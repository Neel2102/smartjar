import React, { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const AdvancedAIChat = ({ user, jarBalances, incomes, expenses }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize chat with welcome message and proactive insights
    initializeChat();
    
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem(`smartjar_chat_${user._id}`);
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, [user, jarBalances, incomes, expenses]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `Hello ${user.name}! 👋 I'm your SmartJar AI Financial Coach. I'm here to help you achieve financial stability and make smart money decisions.`,
      timestamp: new Date(),
      proactive: true
    };

    const proactiveInsights = generateProactiveInsights();
    
    setMessages([welcomeMessage, ...proactiveInsights]);
    setSuggestedQuestions(generateSuggestedQuestions());
  };

  const generateProactiveInsights = () => {
    const insights = [];
    
    // Check emergency fund status
    if (jarBalances?.emergency < 10000) {
      insights.push({
        id: Date.now() + 1,
        type: 'ai',
        content: `🛡️ **Emergency Fund Alert**: Your emergency jar has ₹${formatCurrency(jarBalances?.emergency || 0)}. Consider building it to at least ₹10,000 for better financial security.`,
        timestamp: new Date(),
        proactive: true,
        priority: 'high'
      });
    }

    // Check spending patterns
    if (expenses.length > 0) {
      const recentExpenses = expenses.slice(0, 7);
      const totalRecent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const avgDaily = totalRecent / 7;
      
      if (avgDaily > 500) {
        insights.push({
          id: Date.now() + 2,
          type: 'ai',
          content: `📊 **Spending Pattern**: Your average daily spending is ₹${formatCurrency(avgDaily)}. This is higher than typical. Would you like me to analyze your spending categories?`,
          timestamp: new Date(),
          proactive: true,
          priority: 'medium'
        });
      }
    }

    // Check income consistency
    if (incomes.length > 0) {
      const recentIncomes = incomes.slice(0, 14);
      const totalRecent = recentIncomes.reduce((sum, inc) => sum + inc.amount, 0);
      const avgWeekly = totalRecent / 2;
      
      if (avgWeekly < 3000) {
        insights.push({
          id: Date.now() + 3,
          type: 'ai',
          content: `💰 **Income Alert**: Your recent weekly average is ₹${formatCurrency(avgWeekly)}. This is below the typical range. Consider optimizing your work hours or exploring additional platforms.`,
          timestamp: new Date(),
          proactive: true,
          priority: 'medium'
        });
      }
    }

    // Check investment opportunities
    if (jarBalances?.future > 5000) {
      insights.push({
        id: Date.now() + 4,
        type: 'ai',
        content: `🚀 **Investment Opportunity**: You have ₹${formatCurrency(jarBalances.future)} in your Future jar! Ready to start investing? I can recommend options based on your risk profile.`,
        timestamp: new Date(),
        proactive: true,
        priority: 'low'
      });
    }

    return insights;
  };

  const generateSuggestedQuestions = () => {
    return [
      "How can I save more money?",
      "Should I take a loan for bike repair?",
      "What's the best way to invest ₹5000?",
      "How do I plan for Diwali expenses?",
      "Am I spending too much on fuel?",
      "When will I be eligible for salary payouts?",
      "How to build emergency fund faster?",
      "Which investment is best for beginners?"
    ];
  };

  const sendMessage = async (message = null) => {
    const userMessage = message || inputMessage.trim();
    if (!userMessage) return;
    if (cooldownSec > 0) return; // respect cooldown

    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare context with full conversation history
      const context = {
        user: {
          name: user.name,
          gigProfile: user.gigProfile,
          debtProfile: user.debtProfile,
          investmentProfile: user.investmentProfile,
          jarBalances: jarBalances,
          monthlyIncomeTarget: user.monthlyIncomeTarget,
          emergencyFundTarget: user.emergencyFundTarget
        },
        financialData: {
          recentIncomes: incomes.slice(0, 10),
          recentExpenses: expenses.slice(0, 10),
          totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
          totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0)
        },
        conversationHistory: chatHistory.slice(-5) // Last 5 exchanges for context
      };

      const response = await aiAPI.coach({
        prompt: userMessage,
        context: context
      });

      // Debug: log structured response
      console.log('AI coach response:', response?.data);

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.summary,
        timestamp: new Date(),
        insights: response.data.insights || [],
        actions: response.data.actions || [],
        nudges: response.data.nudges || []
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update chat history
      const newHistory = [...chatHistory, { user: userMessage, ai: response.data.summary }];
      setChatHistory(newHistory);
      localStorage.setItem(`smartjar_chat_${user._id}`, JSON.stringify(newHistory));

      // Generate new suggested questions based on AI response
      if (response.data.actions && response.data.actions.length > 0) {
        const newSuggestions = response.data.actions.map(action => action.label);
        setSuggestedQuestions(prev => [...newSuggestions, ...prev.slice(0, 4)]);
      }

    } catch (error) {
      // Surface detailed server-side error if available
      const serverError = error?.response?.data;
      console.error('Error sending message:', error);
      console.error('AI server error payload:', serverError);

      // Handle rate limit (429) with client-side cooldown timer
      if (error?.response?.status === 429) {
        const retry = Number(serverError?.retryAfter) || 60;
        setCooldownSec(retry);
        const timer = setInterval(() => {
          setCooldownSec((s) => {
            if (s <= 1) {
              clearInterval(timer);
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      }

      // Avoid repeating the same fallback if last message was already an error
      const last = messages[messages.length - 1];
      if (last?.isError) {
        setLoading(false);
        return;
      }

      // Provide a graceful fallback AI reply so UX continues
      const fallback = {
        summary: "I'm having trouble reaching the AI service right now. Here's a quick tip while we fix it:",
        nudges: [
          { title: 'Jar Priorities', detail: 'Ensure 3-6 months of expenses in Emergency before investing.' },
          { title: 'Expense Audit', detail: 'Review top-3 expense categories this week and set micro-budgets.' }
        ],
        insights: [
          { type: 'Status', message: 'Temporary AI outage or invalid JSON from provider.' }
        ]
      };

      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `${fallback.summary}${serverError?.error ? ` (Details: ${serverError.error})` : ''}`,
        timestamp: new Date(),
        isError: true,
        insights: fallback.insights,
        nudges: fallback.nudges
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-IN';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      sendMessage(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([]);
    setChatHistory([]);
    localStorage.removeItem(`smartjar_chat_${user._id}`);
    initializeChat();
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="advanced-ai-chat">
      <div className="chat-header">
        <div className="chat-controls">
          <button 
            className="btn btn-secondary"
            onClick={clearChat}
            title="Clear chat history"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Proactive Insights */}
      {messages.filter(m => m.proactive).length > 0 && (
        <div className="proactive-insights">
          <h3>💡 Proactive Insights</h3>
          {messages.filter(m => m.proactive).map((message) => (
            <div 
              key={message.id} 
              className={`insight-message ${message.priority || 'low'}`}
            >
              <div className="insight-content">
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
                <small>{formatTimestamp(message.timestamp)}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.filter(m => !m.proactive).map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.type} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              <div className="message-text">
                {message.type === 'ai' && message.insights && message.insights.length > 0 && (
                  <div className="ai-insights">
                    {message.insights.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <span className="insight-type">{insight.type}</span>
                        <p>{insight.message}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {message.type === 'ai' && message.nudges && message.nudges.length > 0 && (
                  <div className="ai-nudges">
                    <h4>💡 Key Takeaways:</h4>
                    {message.nudges.map((nudge, index) => (
                      <div key={index} className="nudge-item">
                        <strong>{nudge.title}</strong>
                        <p>{nudge.detail}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div dangerouslySetInnerHTML={{ __html: message.content }} />
              </div>
              <div className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message ai">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="suggested-questions">
          <h4>💭 Suggested Questions:</h4>
          <div className="questions-grid">
            {suggestedQuestions.slice(0, 6).map((question, index) => (
              <button
                key={index}
                className="suggested-question"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input">
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything about your finances..."
            className="message-input"
            disabled={loading || cooldownSec > 0}
          />
          <button
            className="voice-btn"
            onClick={handleVoiceInput}
            disabled={loading || cooldownSec > 0}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !inputMessage.trim() || cooldownSec > 0}
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
        {cooldownSec > 0 && (
          <small className="input-hint" style={{ color: '#c62828' }}>
            Please wait {cooldownSec}s due to provider rate limits.
          </small>
        )}
        <small className="input-hint">
          💡 Try asking about savings, investments, debt management, or spending patterns
        </small>
      </div>
    </div>
  );
};

export default AdvancedAIChat;
