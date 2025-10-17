import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const InvestmentAssistant = ({ user, jarBalances }) => {
  const [investmentRecommendations, setInvestmentRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(0);

  const getInvestmentRecommendations = async () => {
    setLoading(true);
    try {
      console.log('Getting investment recommendations for user:', user.name);
      console.log('User investment profile:', user.investmentProfile);
      console.log('Jar balances:', jarBalances);
      
      const response = await aiAPI.coach({
        prompt: "Analyze my investment profile and provide personalized investment recommendations including specific instruments, amounts, and strategies based on my risk appetite and financial situation.",
        context: {
          user: {
            name: user.name,
            investmentProfile: user.investmentProfile,
            jarBalances: jarBalances,
            monthlyIncomeTarget: user.monthlyIncomeTarget,
            emergencyFundTarget: user.emergencyFundTarget
          }
        }
      });
      
      console.log('AI response:', response.data);
      setInvestmentRecommendations(response.data);
    } catch (error) {
      console.error('Error getting investment recommendations:', error);
      console.error('Error details:', error.response?.data);
      
      // Set a fallback recommendation if AI fails
      setInvestmentRecommendations({
        summary: "Based on your investment profile, I recommend starting with low-risk investments like SIPs and fixed deposits. Consider investing 15-20% of your future jar balance in diversified mutual funds for long-term growth.",
        nudges: [
          {
            title: "Start with SIPs",
            detail: "Systematic Investment Plans are perfect for beginners. Start with ₹500-1000 monthly SIPs in large-cap mutual funds."
          },
          {
            title: "Build Emergency Fund First",
            detail: "Ensure you have 3-6 months of expenses in your emergency fund before investing in higher-risk instruments."
          }
        ],
        insights: [
          {
            type: "Risk Assessment",
            message: "Your risk appetite suggests a balanced approach between growth and safety."
          }
        ],
        actions: [
          {
            label: "Start SIP Investment",
            suggestedEndpoint: "createSIP",
            payload: { amount: 1000, frequency: "monthly" }
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#666';
    }
  };

  const getExperienceColor = (experience) => {
    switch (experience) {
      case 'beginner': return '#2196f3';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#9c27b0';
      default: return '#666';
    }
  };

  const getInvestmentInstruments = () => {
    const instruments = [
      {
        key: 'sip',
        name: 'SIP (Systematic Investment Plan)',
        description: 'Regular monthly investments in mutual funds',
        risk: 'Low to Medium',
        returns: '8-12% annually',
        minAmount: 500,
        icon: '📈',
        color: '#4caf50'
      },
      {
        key: 'fd',
        name: 'Fixed Deposits',
        description: 'Safe, guaranteed returns with lock-in period',
        risk: 'Very Low',
        returns: '6-7% annually',
        minAmount: 1000,
        icon: '🏦',
        color: '#2196f3'
      },
      {
        key: 'mutual_funds',
        name: 'Mutual Funds',
        description: 'Diversified portfolio managed by professionals',
        risk: 'Medium to High',
        returns: '10-15% annually',
        minAmount: 1000,
        icon: '🎯',
        color: '#ff9800'
      },
      {
        key: 'stocks',
        name: 'Direct Stocks',
        description: 'Direct ownership in company shares',
        risk: 'High',
        returns: '15-25% annually (potential)',
        minAmount: 5000,
        icon: '📊',
        color: '#f44336'
      }
    ];

    return instruments.filter(instrument => 
      user.investmentProfile?.preferredInstruments?.includes(instrument.key)
    );
  };

  const calculateRecommendedAmount = () => {
    const availableAmount = jarBalances?.future || 0;
    const monthlyIncome = user.monthlyIncomeTarget || 0;
    
    const recommendedPercentage = user.investmentProfile?.riskAppetite === 'high' ? 0.2 : 0.15;
    const recommendedFromIncome = monthlyIncome * recommendedPercentage;
    
    return Math.min(availableAmount, recommendedFromIncome);
  };

  const getPartnerLinks = (instrument) => {
    const partners = {
      sip: [
        { name: 'Groww', url: 'https://groww.in/sip', logo: '��' },
        { name: 'Zerodha', url: 'https://zerodha.com/mutual-funds', logo: '��' },
        { name: 'ET Money', url: 'https://www.etmoney.com/mutual-funds', logo: '💰' }
      ],
      fd: [
        { name: 'HDFC Bank', url: 'https://www.hdfcbank.com/personal/save/deposits/fixed-deposits', logo: '��' },
        { name: 'SBI', url: 'https://www.sbi.co.in/web/personal-banking/investments-deposits/fixed-deposits', logo: '🏛️' },
        { name: 'ICICI Bank', url: 'https://www.icicibank.com/retail-banking/account-deposit/fixed-deposit', logo: '💳' }
      ],
      mutual_funds: [
        { name: 'Groww', url: 'https://groww.in/mutual-funds', logo: '��' },
        { name: 'Zerodha', url: 'https://zerodha.com/mutual-funds', logo: '��' },
        { name: 'ET Money', url: 'https://www.etmoney.com/mutual-funds', logo: '💰' }
      ],
      stocks: [
        { name: 'Zerodha', url: 'https://zerodha.com', logo: '��' },
        { name: 'Groww', url: 'https://groww.in/stocks', logo: '��' },
        { name: 'Upstox', url: 'https://upstox.com', logo: '��' }
      ]
    };
    
    return partners[instrument] || [];
  };

  useEffect(() => {
    if (user.investmentProfile) {
      getInvestmentRecommendations();
    }
  }, [user.investmentProfile]);

  if (!user.investmentProfile) {
    return (
      <div className="investment-assistant">
        <div className="setup-required">
          <h2>🎯 Investment Assistant</h2>
          <p>Complete your investment profile in Settings to get personalized recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="investment-assistant">
      <h2>🎯 Investment Assistant</h2>
      
      {/* Profile Summary */}
      <div className="profile-summary">
        <h3>Your Investment Profile</h3>
        <div className="profile-grid">
          <div className="profile-item">
            <span className="profile-label">Experience</span>
            <span 
              className="profile-value" 
              style={{ color: getExperienceColor(user.investmentProfile.experience) }}
            >
              {user.investmentProfile.experience.charAt(0).toUpperCase() + user.investmentProfile.experience.slice(1)}
            </span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Risk Appetite</span>
            <span 
              className="profile-value" 
              style={{ color: getRiskColor(user.investmentProfile.riskAppetite) }}
            >
              {user.investmentProfile.riskAppetite.charAt(0).toUpperCase() + user.investmentProfile.riskAppetite.slice(1)}
            </span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Time Horizon</span>
            <span className="profile-value">
              {user.investmentProfile.timeHorizon.charAt(0).toUpperCase() + user.investmentProfile.timeHorizon.slice(1)} Term
            </span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Available for Investment</span>
            <span className="profile-value">₹{formatCurrency(jarBalances?.future || 0)}</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {investmentRecommendations && (
        <div className="ai-recommendations">
          <h3>🤖 AI Investment Recommendations</h3>
          <div className="recommendation-summary">
            <p>{investmentRecommendations.summary}</p>
          </div>
          
          {investmentRecommendations.nudges && investmentRecommendations.nudges.length > 0 && (
            <div className="recommendation-section">
              <h4>�� Key Insights</h4>
              {investmentRecommendations.nudges.map((nudge, index) => (
                <div key={index} className="nudge-item">
                  <strong>{nudge.title}</strong>
                  <p>{nudge.detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Investment Instruments */}
      <div className="investment-instruments">
        <h3>📊 Recommended Investment Options</h3>
        <div className="instruments-grid">
          {getInvestmentInstruments().map((instrument) => (
            <div 
              key={instrument.key} 
              className={`instrument-card ${selectedInstrument === instrument.key ? 'selected' : ''}`}
              onClick={() => setSelectedInstrument(instrument.key)}
            >
              <div className="instrument-header">
                <span className="instrument-icon" style={{ color: instrument.color }}>
                  {instrument.icon}
                </span>
                <div className="instrument-info">
                  <h4>{instrument.name}</h4>
                  <p>{instrument.description}</p>
                </div>
              </div>
              <div className="instrument-details">
                <div className="detail-item">
                  <span className="detail-label">Risk Level:</span>
                  <span className="detail-value">{instrument.risk}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Expected Returns:</span>
                  <span className="detail-value">{instrument.returns}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Min Investment:</span>
                  <span className="detail-value">₹{formatCurrency(instrument.minAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Calculator */}
      {selectedInstrument && (
        <div className="investment-calculator">
          <h3>🧮 Investment Calculator</h3>
          <div className="calculator-form">
            <div className="form-group">
              <label>Investment Amount (₹)</label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter amount"
                min={getInvestmentInstruments().find(i => i.key === selectedInstrument)?.minAmount || 0}
              />
            </div>
            
            <div className="form-group">
              <label>Investment Frequency</label>
              <select defaultValue="monthly">
                <option value="monthly">Monthly (SIP)</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One Time</option>
              </select>
            </div>

            <div className="calculation-results">
              <div className="result-item">
                <span>Monthly Investment:</span>
                <span>₹{formatCurrency(investmentAmount)}</span>
              </div>
              <div className="result-item">
                <span>Annual Investment:</span>
                <span>₹{formatCurrency(investmentAmount * 12)}</span>
              </div>
              <div className="result-item">
                <span>Expected Returns (5 years):</span>
                <span>₹{formatCurrency(Math.round(investmentAmount * 12 * 5 * 0.1))}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Platforms */}
      {selectedInstrument && (
        <div className="partner-platforms">
          <h3>�� Invest Through Our Partners</h3>
          <div className="partners-grid">
            {getPartnerLinks(selectedInstrument).map((partner, index) => (
              <a 
                key={index} 
                href={partner.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="partner-card"
              >
                <span className="partner-logo">{partner.logo}</span>
                <span className="partner-name">{partner.name}</span>
                <span className="partner-action">Invest Now →</span>
              </a>
            ))}
          </div>
          <small>We partner with trusted financial platforms. Opening accounts may require KYC verification.</small>
        </div>
      )}

      {/* Investment Tips */}
      <div className="investment-tips">
        <h3>�� Investment Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Start Small</h4>
            <p>Begin with SIPs of ₹500-1000 to build the habit of regular investing.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">⏰</div>
            <h4>Time in Market</h4>
            <p>Long-term investments (5+ years) typically outperform short-term trading.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <h4>Diversify</h4>
            <p>Spread your investments across different asset classes to reduce risk.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📚</div>
            <h4>Keep Learning</h4>
            <p>Stay updated with market trends and financial education resources.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="btn btn-primary"
          onClick={getInvestmentRecommendations}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : '🔄 Refresh Recommendations'}
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setSelectedInstrument(null)}
        >
          Reset Selection
        </button>
      </div>
    </div>
  );
};

export default InvestmentAssistant;