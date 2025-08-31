import React, { useState } from 'react';
import { userAPI, aiAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const EnhancedOnboarding = ({ user, onOnboardingComplete }) => {
  const [currentStep, setCurrentStep] = useState('gig_profile');
  const [formData, setFormData] = useState({
    gigProfile: {
      type: 'driver',
      platforms: ['swiggy'],
      weeklyWorkDays: 6,
      weeklyWorkHours: 48,
      avgGoodWeekEarnings: 0,
      avgBadWeekEarnings: 0,
      cashVsDigitalSplit: 70,
    },
    debtProfile: {
      hasLoans: false,
      totalDebt: 0,
      monthlyEMI: 0,
      informalBorrowings: 0,
    },
    investmentProfile: {
      experience: 'beginner',
      riskAppetite: 'medium',
      timeHorizon: 'medium',
      preferredInstruments: ['sip'],
    }
  });
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePlatformToggle = (platform) => {
    const currentPlatforms = formData.gigProfile.platforms;
    if (currentPlatforms.includes(platform)) {
      updateFormData('gigProfile', 'platforms', currentPlatforms.filter(p => p !== platform));
    } else {
      updateFormData('gigProfile', 'platforms', [...currentPlatforms, platform]);
    }
  };

  const getAIRecommendations = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.coach({
        prompt: "Analyze my gig worker profile and provide personalized financial recommendations for jar ratios, emergency fund targets, and investment strategy.",
        context: {
          user: {
            name: user.name,
            gigProfile: formData.gigProfile,
            debtProfile: formData.debtProfile,
            investmentProfile: formData.investmentProfile
          }
        }
      });
      setAiRecommendations(response.data);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedUser = {
        ...user,
        gigProfile: formData.gigProfile,
        debtProfile: formData.debtProfile,
        investmentProfile: formData.investmentProfile,
        onboardingCompleted: true,
        onboardingStep: 'completed'
      };

      if (aiRecommendations) {
        // Apply AI recommendations
        const actions = aiRecommendations.actions || [];
        actions.forEach(action => {
          if (action.suggestedEndpoint === 'updateRatios' && action.payload) {
            updatedUser.jarRatios = action.payload;
          }
          if (action.suggestedEndpoint === 'setEmergencyFund' && action.payload) {
            updatedUser.emergencyFundTarget = action.payload.target;
          }
        });
      }

      await userAPI.update(user._id, updatedUser);
      onOnboardingComplete(updatedUser);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const renderGigProfile = () => (
    <div className="onboarding-step">
      <h2>Tell us about your gig work</h2>
      
      <div className="form-group">
        <label>What type of gig work do you do?</label>
        <select 
          value={formData.gigProfile.type}
          onChange={(e) => updateFormData('gigProfile', 'type', e.target.value)}
        >
          <option value="driver">🚗 Driver (Uber, Rapido, Ola)</option>
          <option value="delivery">🛵 Delivery (Swiggy, Zomato, Dunzo)</option>
          <option value="freelancer">💻 Freelancer (Upwork, Fiverr)</option>
          <option value="other">🔧 Other</option>
        </select>
      </div>

      <div className="form-group">
        <label>Which platforms do you work for?</label>
        <div className="platform-grid">
          {['swiggy', 'zomato', 'uber', 'rapido', 'ola', 'dunzo'].map(platform => (
            <button
              key={platform}
              type="button"
              className={`platform-btn ${formData.gigProfile.platforms.includes(platform) ? 'active' : ''}`}
              onClick={() => handlePlatformToggle(platform)}
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>How many days do you work per week?</label>
        <input
          type="number"
          min="1"
          max="7"
          value={formData.gigProfile.weeklyWorkDays}
          onChange={(e) => updateFormData('gigProfile', 'weeklyWorkDays', parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>How many hours do you work per week?</label>
        <input
          type="number"
          min="10"
          max="80"
          value={formData.gigProfile.weeklyWorkHours}
          onChange={(e) => updateFormData('gigProfile', 'weeklyWorkHours', parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>What's your average earnings in a good week?</label>
        <input
          type="number"
          placeholder="₹"
          value={formData.gigProfile.avgGoodWeekEarnings}
          onChange={(e) => updateFormData('gigProfile', 'avgGoodWeekEarnings', parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>What's your average earnings in a bad week?</label>
        <input
          type="number"
          placeholder="₹"
          value={formData.gigProfile.avgBadWeekEarnings}
          onChange={(e) => updateFormData('gigProfile', 'avgBadWeekEarnings', parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>What percentage of your earnings come through digital payments?</label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.gigProfile.cashVsDigitalSplit}
          onChange={(e) => updateFormData('gigProfile', 'cashVsDigitalSplit', parseInt(e.target.value))}
        />
        <small>Digital payments include UPI, bank transfers, wallet credits</small>
      </div>

      <button 
        className="btn btn-primary"
        onClick={() => setCurrentStep('financial_profile')}
        disabled={!formData.gigProfile.avgGoodWeekEarnings || !formData.gigProfile.avgBadWeekEarnings}
      >
        Next: Financial Profile
      </button>
    </div>
  );

  const renderFinancialProfile = () => (
    <div className="onboarding-step">
      <h2>Let's understand your financial situation</h2>
      
      <div className="form-group">
        <label>Do you have any existing loans or EMIs?</label>
        <select 
          value={formData.debtProfile.hasLoans}
          onChange={(e) => updateFormData('debtProfile', 'hasLoans', e.target.value === 'true')}
        >
          <option value="false">No loans</option>
          <option value="true">Yes, I have loans</option>
        </select>
      </div>

      {formData.debtProfile.hasLoans && (
        <>
          <div className="form-group">
            <label>Total outstanding debt amount</label>
            <input
              type="number"
              placeholder="₹"
              value={formData.debtProfile.totalDebt}
              onChange={(e) => updateFormData('debtProfile', 'totalDebt', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Monthly EMI payments</label>
            <input
              type="number"
              placeholder="₹"
              value={formData.debtProfile.monthlyEMI}
              onChange={(e) => updateFormData('debtProfile', 'monthlyEMI', parseInt(e.target.value))}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Any informal borrowings from friends/family?</label>
        <input
          type="number"
          placeholder="₹"
          value={formData.debtProfile.informalBorrowings}
          onChange={(e) => updateFormData('debtProfile', 'informalBorrowings', parseInt(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>What's your investment experience?</label>
        <select 
          value={formData.investmentProfile.experience}
          onChange={(e) => updateFormData('investmentProfile', 'experience', e.target.value)}
        >
          <option value="beginner">Beginner - Never invested before</option>
          <option value="intermediate">Intermediate - Some experience</option>
          <option value="advanced">Advanced - Regular investor</option>
        </select>
      </div>

      <div className="form-group">
        <label>What's your risk tolerance?</label>
        <select 
          value={formData.investmentProfile.riskAppetite}
          onChange={(e) => updateFormData('investmentProfile', 'riskAppetite', e.target.value)}
        >
          <option value="low">Low - I prefer safe, stable returns</option>
          <option value="medium">Medium - I can handle some ups and downs</option>
          <option value="high">High - I'm comfortable with market volatility</option>
        </select>
      </div>

      <div className="form-group">
        <label>What's your investment time horizon?</label>
        <select 
          value={formData.investmentProfile.timeHorizon}
          onChange={(e) => updateFormData('investmentProfile', 'timeHorizon', e.target.value)}
        >
          <option value="short">Short term (1-3 years)</option>
          <option value="medium">Medium term (3-7 years)</option>
          <option value="long">Long term (7+ years)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Which investment instruments interest you?</label>
        <div className="checkbox-group">
          {[
            { key: 'sip', label: 'SIP (Systematic Investment Plan)' },
            { key: 'fd', label: 'Fixed Deposits' },
            { key: 'mutual_funds', label: 'Mutual Funds' },
            { key: 'stocks', label: 'Stocks' }
          ].map(instrument => (
            <label key={instrument.key} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.investmentProfile.preferredInstruments.includes(instrument.key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateFormData('investmentProfile', 'preferredInstruments', 
                      [...formData.investmentProfile.preferredInstruments, instrument.key]
                    );
                  } else {
                    updateFormData('investmentProfile', 'preferredInstruments',
                      formData.investmentProfile.preferredInstruments.filter(i => i !== instrument.key)
                    );
                  }
                }}
              />
              {instrument.label}
            </label>
          ))}
        </div>
      </div>

      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={() => setCurrentStep('gig_profile')}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => setCurrentStep('ai_recommendations')}
        >
          Get AI Recommendations
        </button>
      </div>
    </div>
  );

  const renderAIRecommendations = () => (
    <div className="onboarding-step">
      <h2>Your Personalized Financial Plan</h2>
      
      {!aiRecommendations ? (
        <div className="ai-loading">
          <p>Let our AI analyze your profile and create a personalized financial plan...</p>
          <button 
            className="btn btn-primary"
            onClick={getAIRecommendations}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Get AI Recommendations'}
          </button>
        </div>
      ) : (
        <div className="ai-recommendations">
          <div className="recommendation-summary">
            <h3>📋 Summary</h3>
            <p>{aiRecommendations.summary}</p>
          </div>

          {aiRecommendations.nudges && aiRecommendations.nudges.length > 0 && (
            <div className="recommendation-section">
              <h3>💡 Key Insights</h3>
              {aiRecommendations.nudges.map((nudge, index) => (
                <div key={index} className="nudge-item">
                  <strong>{nudge.title}</strong>
                  <p>{nudge.detail}</p>
                </div>
              ))}
            </div>
          )}

          {aiRecommendations.insights && aiRecommendations.insights.length > 0 && (
            <div className="recommendation-section">
              <h3>🔍 Financial Analysis</h3>
              {aiRecommendations.insights.map((insight, index) => (
                <div key={index} className="insight-item">
                  <span className="insight-type">{insight.type}</span>
                  <p>{insight.message}</p>
                </div>
              ))}
            </div>
          )}

          <div className="recommendation-section">
            <h3>🎯 Your Customized Jar Setup</h3>
            <div className="jar-preview">
              <div className="jar-item">
                <span className="jar-icon">💰</span>
                <div>
                  <strong>Salary Jar</strong>
                  <p>For daily expenses and bills</p>
                </div>
                <span className="jar-percentage">{formData.gigProfile.avgGoodWeekEarnings ? 
                  Math.round((formData.gigProfile.avgGoodWeekEarnings * 4 * 0.6) / 100) * 100 : 0}%</span>
              </div>
              <div className="jar-item">
                <span className="jar-icon">🛡️</span>
                <div>
                  <strong>Emergency Jar</strong>
                  <p>Build 3-6 months of expenses</p>
                </div>
                <span className="jar-percentage">{formData.gigProfile.avgGoodWeekEarnings ? 
                  Math.round((formData.gigProfile.avgGoodWeekEarnings * 4 * 0.25) / 100) * 100 : 0}%</span>
              </div>
              <div className="jar-item">
                <span className="jar-icon">🚀</span>
                <div>
                  <strong>Future Jar</strong>
                  <p>Investments and long-term goals</p>
                </div>
                <span className="jar-percentage">{formData.gigProfile.avgGoodWeekEarnings ? 
                  Math.round((formData.gigProfile.avgGoodWeekEarnings * 4 * 0.15) / 100) * 100 : 0}%</span>
              </div>
            </div>
          </div>

          <div className="recommendation-section">
            <h3>📅 Salary Projection</h3>
            <div className="salary-projection">
              <p>Based on your work pattern, you could earn a consistent monthly salary of approximately:</p>
              <div className="projected-salary">
                <span className="salary-amount">
                  ₹{formData.gigProfile.avgGoodWeekEarnings ? 
                    Math.round((formData.gigProfile.avgGoodWeekEarnings * 4 * 0.6)) : 0}
                </span>
                <small>per month (after 90 days of consistent earnings)</small>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentStep('financial_profile')}
            >
              Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="enhanced-onboarding">
      <div className="onboarding-progress">
        <div className={`progress-step ${currentStep === 'gig_profile' ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Gig Profile</span>
        </div>
        <div className={`progress-step ${currentStep === 'financial_profile' ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Financial Profile</span>
        </div>
        <div className={`progress-step ${currentStep === 'ai_recommendations' ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">AI Recommendations</span>
        </div>
      </div>

      {currentStep === 'gig_profile' && renderGigProfile()}
      {currentStep === 'financial_profile' && renderFinancialProfile()}
      {currentStep === 'ai_recommendations' && renderAIRecommendations()}
    </div>
  );
};

export default EnhancedOnboarding;
