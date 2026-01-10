import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';
import { formatINR } from '../utils/formatters';

const SalaryProjection = ({ userId, user }) => {
  const [financeSummary, setFinanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchFinanceSummary();
    }
  }, [userId]);

  const fetchFinanceSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await financeAPI.getSummary(userId);
      setFinanceSummary(response.data);
    } catch (err) {
      console.error('Error fetching finance summary:', err);
      setError('Failed to load salary projection data');
    } finally {
      setLoading(false);
    }
  };

  const getEligibilityStatus = () => {
    if (!financeSummary) return null;

    if (financeSummary.salaryStatus === "BUILDING HISTORY") {
      return {
        status: 'BUILDING HISTORY',
        message: financeSummary.remainingDays > 0 
          ? `You need ${financeSummary.remainingDays} more days to be eligible for salary payouts`
          : 'Build your emergency fund to 100% to start salary payouts',
        color: '#f59e0b',
        bgColor: '#fffbeb',
        icon: '⏳'
      };
    }
    
    return {
      status: 'ELIGIBLE FOR PAYOUT',
      message: 'You can start receiving monthly salary payouts!',
      color: '#10b981',
      bgColor: '#f0fdf4',
      icon: '✓'
    };
  };

  const getProgressPercentage = () => {
    if (!financeSummary) return 0;
    return Math.min((financeSummary.eligibilityDays / 90) * 100, 100);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f4f6',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: '1.5rem'
        }} />
        <div style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>
          Calculating your salary projection...
        </div>
      </div>
    );
  }

  if (error || !financeSummary) {
    return (
      <div style={{
        padding: '2rem',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        color: '#991b1b',
        textAlign: 'center'
      }}>
        {error || 'Unable to load salary projection data'}
      </div>
    );
  }

  const eligibility = getEligibilityStatus();
  const progressPercentage = getProgressPercentage();
  const emergencyFundProgress = financeSummary.emergencyGoal > 0 
    ? Math.min((financeSummary.emergencyJar / financeSummary.emergencyGoal) * 100, 100)
    : 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Status Card */}
      <div style={{
        background: eligibility.bgColor,
        border: `2px solid ${eligibility.color}`,
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          background: eligibility.color,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          color: 'white',
          flexShrink: 0
        }}>
          {eligibility.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            Status: {eligibility.status}
          </div>
          <div style={{ fontSize: '0.9375rem', color: '#4b5563' }}>
            {eligibility.message}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#eef2ff',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            📅
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            Building Your Earnings History
          </h3>
        </div>

        <div style={{
          background: '#f3f4f6',
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            width: `${progressPercentage}%`,
            transition: 'width 0.6s ease',
            borderRadius: '6px'
          }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#374151' }}>
            {financeSummary.eligibilityDays} days completed
          </span>
          <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#6b7280' }}>
            {financeSummary.remainingDays} days remaining
          </span>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          You need 90 days of consistent earnings to start salary payouts
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {[
          {
            icon: '📊',
            iconBg: '#eef2ff',
            title: 'Average Daily Earnings',
            value: formatINR(financeSummary.avgDailyIncome),
            subtitle: 'Based on last 14 active days'
          },
          {
            icon: '💵',
            iconBg: '#f0fdf4',
            title: 'Projected Monthly Salary',
            value: formatINR(financeSummary.projectedSalary),
            subtitle: '26 working days × average daily'
          },
          {
            icon: '🛡️',
            iconBg: '#fffbeb',
            title: 'Emergency Fund Target',
            value: formatINR(financeSummary.emergencyGoal),
            subtitle: 'Your emergency fund goal'
          },
          {
            icon: '📅',
            iconBg: '#fef2f2',
            title: 'Next Payout Date',
            value: financeSummary.nextPayoutDate ? 
              new Date(financeSummary.nextPayoutDate).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short',
                year: 'numeric'
              }) : 'Not eligible yet',
            subtitle: 'Salary credited on 1st of every month',
            noRupee: true
          }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            borderRadius: '14px',
            padding: '1.5rem',
            border: '1px solid #f3f4f6',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: stat.iconBg,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              marginBottom: '1rem'
            }}>
              {stat.icon}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              {stat.title}
            </div>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '0.5rem',
              letterSpacing: '-0.01em'
            }}>
              {!stat.noRupee && stat.value}
              {stat.noRupee && stat.value}
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#f0fdf4',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            📈
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            Recent Earnings Trend
          </h3>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '0.5rem',
          height: '200px',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '12px',
          marginBottom: '1rem'
        }}>
          {financeSummary.last14DaysEarnings.map((day, index) => {
            const maxTotal = Math.max(...financeSummary.last14DaysEarnings.map(d => d.total || 0), 1);
            const heightPercent = maxTotal > 0 ? ((day.total || 0) / maxTotal) * 100 : 0;
            
            return (
              <div key={index} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '4px 4px 0 0',
                  height: `${heightPercent}%`,
                  minHeight: '8px',
                  transition: 'height 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  const tooltip = e.currentTarget.querySelector('.tooltip');
                  if (tooltip) tooltip.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.querySelector('.tooltip');
                  if (tooltip) tooltip.style.opacity = '0';
                }}>
                  <div className="tooltip" style={{
                    position: 'absolute',
                    top: '-28px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    color: '#374151',
                    whiteSpace: 'nowrap',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}>
                    {formatINR(day.total || 0)}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.6875rem',
                  color: '#9ca3af',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  {new Date(day.date).toLocaleDateString('en-IN', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
          Last 14 days of earnings
        </div>
      </div>

      {/* Emergency Fund Status */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#fffbeb',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🛡️
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            Emergency Fund Status
          </h3>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Target:</span> {formatINR(financeSummary.emergencyGoal)}
          </div>
          <div style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Current:</span> {formatINR(financeSummary.emergencyJar)}
          </div>
        </div>

        <div style={{
          background: '#f3f4f6',
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            height: '100%',
            background: financeSummary.emergencyCoveragePercent >= 100
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
            width: `${emergencyFundProgress}%`,
            transition: 'width 0.6s ease',
            borderRadius: '6px'
          }} />
        </div>

        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {financeSummary.emergencyAchieved 
            ? '✅ Emergency fund target achieved!'
            : `You're ${Math.round(financeSummary.emergencyCoveragePercent)}% of the way to your emergency fund target`
          }
        </div>
      </div>

      {/* How It Works */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '1.5rem'
        }}>
          How Salary Projection Works
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              number: '1',
              title: 'Track Earnings',
              description: 'Record your daily income for 90 days',
              color: '#667eea'
            },
            {
              number: '2',
              title: 'Calculate Average',
              description: 'We analyze your last 14 active days to project monthly salary',
              color: '#10b981'
            },
            {
              number: '3',
              title: 'Build Emergency Fund',
              description: 'Reach 100% of your emergency fund target (3 months salary)',
              color: '#f59e0b'
            },
            {
              number: '4',
              title: 'Monthly Payout',
              description: 'Receive consistent salary on 1st of every month',
              color: '#8b5cf6'
            }
          ].map((step, idx) => (
            <div key={idx} style={{
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px solid #f3f4f6',
              transition: 'all 0.2s ease'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: step.color,
                color: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                {step.number}
              </div>
              <h4 style={{
                fontSize: '1.0625rem',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 0.5rem 0'
              }}>
                {step.title}
              </h4>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SalaryProjection;
