import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

// Heroicons components
const TrendingUpIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const BuildingLibraryIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ChartPieIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const CpuChipIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const LightBulbIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CalculatorIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ArrowTopRightOnSquareIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const AcademicCapIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const ArrowPathIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const getIconComponent = (iconName) => {
  const icons = {
    TrendingUpIcon,
    BuildingLibraryIcon,
    ChartBarIcon,
    ChartPieIcon,
    CpuChipIcon,
    LightBulbIcon,
    CalculatorIcon,
    ArrowTopRightOnSquareIcon,
    AcademicCapIcon,
    ArrowPathIcon
  };
  return icons[iconName] || TrendingUpIcon;
};

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
        icon: 'TrendingUpIcon',
        color: '#2563EB'
      },
      {
        key: 'fd',
        name: 'Fixed Deposits',
        description: 'Safe, guaranteed returns with lock-in period',
        risk: 'Very Low',
        returns: '6-7% annually',
        minAmount: 1000,
        icon: 'BuildingLibraryIcon',
        color: '#0EA5E9'
      },
      {
        key: 'mutual_funds',
        name: 'Mutual Funds',
        description: 'Diversified portfolio managed by professionals',
        risk: 'Medium to High',
        returns: '10-15% annually',
        minAmount: 1000,
        icon: 'ChartBarIcon',
        color: '#2563EB'
      },
      {
        key: 'stocks',
        name: 'Direct Stocks',
        description: 'Direct ownership in company shares',
        risk: 'High',
        returns: '15-25% annually (potential)',
        minAmount: 5000,
        icon: 'ChartPieIcon',
        color: '#0EA5E9'
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
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        border: '1px solid #E0F2FE',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'white'
        }}>
          <AcademicCapIcon className="w-6 h-6" />
        </div>
        <h3 style={{
          margin: '0 0 1rem 0',
          color: '#1F2937',
          fontSize: '1.25rem',
          fontWeight: '700'
        }}>
          Complete Your Investment Profile
        </h3>
        <p style={{
          margin: 0,
          color: '#6B7280',
          fontSize: '0.95rem',
          lineHeight: '1.5'
        }}>
          Complete your investment profile in Settings to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '0'
    }}>
      {/* Profile Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E0F2FE',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.25rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <CpuChipIcon className="w-4 h-4" />
          </div>
          <h3 style={{
            margin: 0,
            color: '#1F2937',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Your Investment Profile
          </h3>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Experience Level
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: getExperienceColor(user.investmentProfile.experience)
            }}>
              {user.investmentProfile.experience.charAt(0).toUpperCase() + user.investmentProfile.experience.slice(1)}
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Risk Appetite
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: getRiskColor(user.investmentProfile.riskAppetite)
            }}>
              {user.investmentProfile.riskAppetite.charAt(0).toUpperCase() + user.investmentProfile.riskAppetite.slice(1)}
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Time Horizon
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1E40AF'
            }}>
              {user.investmentProfile.timeHorizon.charAt(0).toUpperCase() + user.investmentProfile.timeHorizon.slice(1)} Term
            </div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Available for Investment
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1E40AF'
            }}>
              ₹{formatCurrency(jarBalances?.future || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {investmentRecommendations && (
        <div className="ai-recommendations">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.25rem',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <CpuChipIcon className="w-4 h-4" />
            </div>
            <h3 style={{
              margin: 0,
              color: '#1F2937',
              fontSize: '1.25rem',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              AI Investment Recommendations
            </h3>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #BAE6FD',
            marginBottom: '1.25rem'
          }}>
            <p style={{
              margin: 0,
              color: '#1F2937',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              {investmentRecommendations.summary}
            </p>
          </div>
          
          {investmentRecommendations.nudges && investmentRecommendations.nudges.length > 0 && (
            <div>
              <h4 style={{
                margin: '0 0 1rem 0',
                color: '#1F2937',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <LightBulbIcon className="w-4 h-4" style={{ color: '#2563EB' }} />
                Key Insights
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {investmentRecommendations.nudges.map((nudge, index) => (
                  <div key={index} style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.3s ease'
                  }}>
                    <h5 style={{
                      margin: '0 0 0.5rem 0',
                      color: '#1F2937',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {nudge.title}
                    </h5>
                    <p style={{
                      margin: 0,
                      color: '#6B7280',
                      fontSize: '0.85rem',
                      lineHeight: '1.5'
                    }}>
                      {nudge.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Investment Instruments */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E0F2FE',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.25rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <ChartBarIcon className="w-4 h-4" />
          </div>
          <h3 style={{
            margin: 0,
            color: '#1F2937',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Recommended Investment Options
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {getInvestmentInstruments().map((instrument) => (
            <div 
              key={instrument.key} 
              onClick={() => setSelectedInstrument(instrument.key)}
              style={{
                background: selectedInstrument === instrument.key 
                  ? 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)'
                  : 'white',
                padding: '1.25rem',
                borderRadius: '12px',
                border: selectedInstrument === instrument.key 
                  ? '2px solid #2563EB'
                  : '1px solid #E5E7EB',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: selectedInstrument === instrument.key ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: selectedInstrument === instrument.key 
                  ? '0 8px 20px rgba(37, 99, 235, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: `linear-gradient(135deg, ${instrument.color} 0%, ${instrument.color}CC 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {React.createElement(getIconComponent(instrument.icon), { className: "w-4 h-4" })}
                </div>
                <div>
                  <h4 style={{
                    margin: '0 0 0.25rem 0',
                    color: '#1F2937',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    {instrument.name}
                  </h4>
                  <p style={{
                    margin: 0,
                    color: '#6B7280',
                    fontSize: '0.85rem',
                    lineHeight: '1.4'
                  }}>
                    {instrument.description}
                  </p>
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '0.75rem'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>
                    Risk Level
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    {instrument.risk}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>
                    Returns
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    {instrument.returns}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.25rem'
                  }}>
                    Min Amount
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: '#1F2937'
                  }}>
                    ₹{formatCurrency(instrument.minAmount)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Calculator */}
      {selectedInstrument && (
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #E0F2FE',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.25rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <CalculatorIcon className="w-4 h-4" />
          </div>
          <h3 style={{
            margin: 0,
            color: '#1F2937',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Investment Calculator
          </h3>
        </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <label style={{
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Investment Amount (₹)
              </label>
              <input
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  background: '#FFFFFF',
                  color: '#1F2937'
                }}
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseInt(e.target.value) || 0)}
                placeholder="Enter amount"
                min={getInvestmentInstruments().find(i => i.key === selectedInstrument)?.minAmount || 0}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <label style={{
                fontWeight: '600',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Investment Frequency
              </label>
              <select 
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  background: '#FFFFFF',
                  color: '#1F2937'
                }}
                defaultValue="monthly"
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="monthly">Monthly (SIP)</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One Time</option>
              </select>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #BAE6FD',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#0284C7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Monthly Investment
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#1E40AF'
                }}>
                  ₹{formatCurrency(investmentAmount)}
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #BAE6FD',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#0284C7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Annual Investment
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#1E40AF'
                }}>
                  ₹{formatCurrency(investmentAmount * 12)}
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid #BAE6FD',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#0284C7',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Expected Returns (5 years)
                </div>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#1E40AF'
                }}>
                  ₹{formatCurrency(Math.round(investmentAmount * 12 * 5 * 0.1))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partner Platforms */}
      {selectedInstrument && (
        <div style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #E0F2FE',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.25rem',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            </div>
            <h3 style={{
              margin: 0,
              color: '#1F2937',
              fontSize: '1.25rem',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              Invest Through Our Partners
            </h3>
          </div>
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
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E0F2FE',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.25rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <AcademicCapIcon className="w-4 h-4" />
          </div>
          <h3 style={{
            margin: 0,
            color: '#1F2937',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Investment Tips
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.25rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              🎯
            </div>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              color: '#1F2937',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Start Small
            </h4>
            <p style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              Begin with SIPs of ₹500-1000 to build the habit of regular investing.
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              ⏰
            </div>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              color: '#1F2937',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Time in Market
            </h4>
            <p style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              Long-term investments (5+ years) typically outperform short-term trading.
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              🔄
            </div>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              color: '#1F2937',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Diversify
            </h4>
            <p style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              Spread your investments across different asset classes to reduce risk.
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            transition: 'all 0.3s ease',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              📚
            </div>
            <h4 style={{
              margin: '0 0 0.5rem 0',
              color: '#1F2937',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              Keep Learning
            </h4>
            <p style={{
              margin: 0,
              color: '#6B7280',
              fontSize: '0.85rem',
              lineHeight: '1.5'
            }}>
              Stay updated with market trends and financial education resources.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={getInvestmentRecommendations}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '0.875rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
          }}
        >
          {loading ? (
            <>
              <ArrowPathIcon className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />
              Analyzing...
            </>
          ) : (
            <>
              <ArrowPathIcon className="w-4 h-4" />
              Refresh Recommendations
            </>
          )}
        </button>
        <button 
          onClick={() => setSelectedInstrument(null)}
          style={{
            background: 'white',
            color: '#2563EB',
            border: '1.5px solid #BAE6FD',
            borderRadius: '10px',
            padding: '0.875rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)'
          }}
        >
          Reset Selection
        </button>
      </div>
    </div>
  );
};

export default InvestmentAssistant;