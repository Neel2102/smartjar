// import React, { useState, useEffect } from 'react';
// import { incomeAPI } from '../services/api';
// import { formatCurrency } from '../utils/formatters';

// const SalaryProjection = ({ userId, user }) => {
//   const [earningsHistory, setEarningsHistory] = useState([]);
//   const [salaryProjection, setSalaryProjection] = useState({
//     avgDailyEarnings: 0,
//     projectedMonthlySalary: 0,
//     daysInSystem: 0,
//     nextPayoutDate: null,
//     emergencyFundNeeded: 0,
//     isEligible: false
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (userId) {
//       fetchEarningsHistory();
//     }
//   }, [userId]);

//   const fetchEarningsHistory = async () => {
//     try {
//       setLoading(true);
//       const response = await incomeAPI.getAll(userId);
//       const incomes = response.data;
      
//       const sortedIncomes = incomes.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
//       setEarningsHistory(sortedIncomes);
      
//       calculateSalaryProjection(sortedIncomes);
//     } catch (error) {
//       console.error('Error fetching earnings history:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateSalaryProjection = (incomes) => {
//     if (incomes.length === 0) {
//       setSalaryProjection({
//         avgDailyEarnings: 0,
//         projectedMonthlySalary: 0,
//         daysInSystem: 0,
//         nextPayoutDate: null,
//         emergencyFundNeeded: 0,
//         isEligible: false
//       });
//       return;
//     }

//     const firstIncome = new Date(incomes[incomes.length - 1].receivedAt);
//     const today = new Date();
//     const daysInSystem = Math.ceil((today - firstIncome) / (1000 * 60 * 60 * 24));

//     const daysToConsider = Math.min(90, daysInSystem);
//     const recentIncomes = incomes.slice(0, daysToConsider);
//     const totalEarnings = recentIncomes.reduce((sum, income) => sum + income.amount, 0);
//     const avgDailyEarnings = totalEarnings / daysToConsider;

//     const projectedMonthlySalary = Math.round(avgDailyEarnings * 26 * 0.6);
//     const emergencyFundNeeded = projectedMonthlySalary * 3;
//     const isEligible = daysInSystem >= 90;

//     const nextPayoutDate = new Date();
//     nextPayoutDate.setDate(1);
//     nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);

//     setSalaryProjection({
//       avgDailyEarnings: Math.round(avgDailyEarnings),
//       projectedMonthlySalary,
//       daysInSystem,
//       nextPayoutDate,
//       emergencyFundNeeded,
//       isEligible
//     });
//   };

//   const getEligibilityStatus = () => {
//     if (salaryProjection.daysInSystem < 90) {
//       return {
//         status: 'Building History',
//         message: `You need ${90 - salaryProjection.daysInSystem} more days to be eligible for salary payouts`,
//         color: '#ff9800'
//       };
//     }
    
//     if (user.jarBalances?.emergency < salaryProjection.emergencyFundNeeded * 0.5) {
//       return {
//         status: 'Need Emergency Fund',
//         message: 'Build your emergency fund to at least 50% of the target to start salary payouts',
//         color: '#f44336'
//       };
//     }
    
//     return {
//       status: 'Eligible',
//       message: 'You can start receiving monthly salary payouts!',
//       color: '#4caf50'
//     };
//   };

//   const getProgressPercentage = () => {
//     return Math.min((salaryProjection.daysInSystem / 90) * 100, 100);
//   };

//   if (loading) {
//     return (
//       <div className="salary-projection">
//         <div style={{ textAlign: 'center', padding: '2rem' }}>
//           <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
//           <div>Calculating your salary projection...</div>
//         </div>
//       </div>
//     );
//   }

//   const eligibility = getEligibilityStatus();

//   return (
//     <div className="salary-projection">
//       <div className="eligibility-card" style={{ borderColor: eligibility.color }}>
//         <div className="eligibility-header">
//           <h3>Status: {eligibility.status}</h3>
//           <div className="status-indicator" style={{ backgroundColor: eligibility.color }}></div>
//         </div>
//         <p>{eligibility.message}</p>
//       </div>

//       <div className="progress-section">
//         <h3>📅 Building Your Earnings History</h3>
//         <div className="progress-bar">
//           <div 
//             className="progress-fill" 
//             style={{ width: `${getProgressPercentage()}%` }}
//           ></div>
//         </div>
//         <div className="progress-stats">
//           <span>{salaryProjection.daysInSystem} days completed</span>
//           <span>{90 - salaryProjection.daysInSystem} days remaining</span>
//         </div>
//         <small>You need 90 days of consistent earnings to start salary payouts</small>
//       </div>

//       <div className="projection-grid">
//         <div className="projection-card">
//           <div className="projection-icon">📊</div>
//           <div className="projection-content">
//             <h4>Average Daily Earnings</h4>
//             <div className="projection-value">₹{formatCurrency(salaryProjection.avgDailyEarnings)}</div>
//             <small>Based on last {Math.min(90, salaryProjection.daysInSystem)} days</small>
//           </div>
//         </div>

//         <div className="projection-card">
//           <div className="projection-icon">💵</div>
//           <div className="projection-content">
//             <h4>Projected Monthly Salary</h4>
//             <div className="projection-value">₹{formatCurrency(salaryProjection.projectedMonthlySalary)}</div>
//             <small>60% of monthly earnings (26 working days)</small>
//           </div>
//         </div>

//         <div className="projection-card">
//           <div className="projection-icon">🛡️</div>
//           <div className="projection-content">
//             <h4>Emergency Fund Target</h4>
//             <div className="projection-value">₹{formatCurrency(salaryProjection.emergencyFundNeeded)}</div>
//             <small>3 months of salary for safety</small>
//           </div>
//         </div>

//         <div className="projection-card">
//           <div className="projection-icon">📅</div>
//           <div className="projection-content">
//             <h4>Next Payout Date</h4>
//             <div className="projection-value">
//               {salaryProjection.nextPayoutDate ? 
//                 salaryProjection.nextPayoutDate.toLocaleDateString('en-IN', { 
//                   day: 'numeric', 
//                   month: 'long', 
//                   year: 'numeric' 
//                 }) : 'Not eligible yet'
//               }
//             </div>
//             <small>Salary credited on 1st of every month</small>
//           </div>
//         </div>
//       </div>

//       <div className="earnings-chart">
//         <h3>📈 Recent Earnings Trend</h3>
//         <div className="chart-container">
//           {earningsHistory.slice(0, 14).map((income, index) => (
//             <div key={income._id} className="chart-bar">
//               <div 
//                 className="bar-fill" 
//                 style={{ 
//                   height: `${(income.amount / Math.max(...earningsHistory.slice(0, 14).map(i => i.amount))) * 100}%` 
//                 }}
//               ></div>
//               <div className="bar-label">
//                 ₹{formatCurrency(income.amount)}
//               </div>
//               <small>{new Date(income.receivedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</small>
//             </div>
//           ))}
//         </div>
//         <small>Last 14 days of earnings</small>
//       </div>

//       <div className="emergency-fund-status">
//         <h3>🛡️ Emergency Fund Status</h3>
//         <div className="fund-progress">
//           <div className="fund-target">
//             <span>Target: ₹{formatCurrency(salaryProjection.emergencyFundNeeded)}</span>
//             <span>Current: ₹{formatCurrency(user.jarBalances?.emergency || 0)}</span>
//           </div>
//           <div className="fund-progress-bar">
//             <div 
//               className="fund-progress-fill" 
//               style={{ 
//                 width: `${Math.min(((user.jarBalances?.emergency || 0) / salaryProjection.emergencyFundNeeded) * 100, 100)}%` 
//               }}
//             ></div>
//           </div>
//           <small>
//             {user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
//               ? '✅ Emergency fund sufficient for salary payouts' 
//               : '⚠️ Build emergency fund to enable salary payouts'
//             }
//           </small>
//         </div>
//       </div>

//       <div className="how-it-works">
//         <h3>🔍 How the Salary System Works</h3>
//         <div className="steps-grid">
//           <div className="step">
//             <div className="step-number">1</div>
//             <h4>Track Earnings</h4>
//             <p>Log your daily/weekly earnings from gig platforms</p>
//           </div>
//           <div className="step">
//             <div className="step-number">2</div>
//             <h4>Build History</h4>
//             <p>Accumulate 90 days of consistent earnings data</p>
//           </div>
//           <div className="step">
//             <div className="step-number">3</div>
//             <h4>Emergency Fund</h4>
//             <p>Ensure you have 3 months of salary saved</p>
//           </div>
//           <div className="step">
//             <div className="step-number">4</div>
//             <h4>Monthly Payout</h4>
//             <p>Receive consistent salary on 1st of every month</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalaryProjection;


import React, { useState, useEffect } from 'react';

// Mock API and formatter for demo
const mockIncomeAPI = {
  getAll: (userId) => new Promise(resolve => {
    setTimeout(() => {
      const mockData = Array.from({ length: 14 }, (_, i) => ({
        _id: `income-${i}`,
        amount: Math.floor(Math.random() * 2000) + 800,
        receivedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      }));
      resolve({ data: mockData });
    }, 800);
  })
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

const SalaryProjection = ({ userId, user }) => {
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [salaryProjection, setSalaryProjection] = useState({
    avgDailyEarnings: 0,
    projectedMonthlySalary: 0,
    daysInSystem: 0,
    nextPayoutDate: null,
    emergencyFundNeeded: 0,
    isEligible: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchEarningsHistory();
    }
  }, [userId]);

  const fetchEarningsHistory = async () => {
    try {
      setLoading(true);
      const response = await mockIncomeAPI.getAll(userId);
      const incomes = response.data;
      
      const sortedIncomes = incomes.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
      setEarningsHistory(sortedIncomes);
      
      calculateSalaryProjection(sortedIncomes);
    } catch (error) {
      console.error('Error fetching earnings history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSalaryProjection = (incomes) => {
    if (incomes.length === 0) {
      setSalaryProjection({
        avgDailyEarnings: 0,
        projectedMonthlySalary: 0,
        daysInSystem: 0,
        nextPayoutDate: null,
        emergencyFundNeeded: 0,
        isEligible: false
      });
      return;
    }

    const firstIncome = new Date(incomes[incomes.length - 1].receivedAt);
    const today = new Date();
    const daysInSystem = Math.ceil((today - firstIncome) / (1000 * 60 * 60 * 24));

    const daysToConsider = Math.min(90, daysInSystem);
    const recentIncomes = incomes.slice(0, daysToConsider);
    const totalEarnings = recentIncomes.reduce((sum, income) => sum + income.amount, 0);
    const avgDailyEarnings = totalEarnings / daysToConsider;

    const projectedMonthlySalary = Math.round(avgDailyEarnings * 26 * 0.6);
    const emergencyFundNeeded = projectedMonthlySalary * 3;
    const isEligible = daysInSystem >= 90;

    const nextPayoutDate = new Date();
    nextPayoutDate.setDate(1);
    nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);

    setSalaryProjection({
      avgDailyEarnings: Math.round(avgDailyEarnings),
      projectedMonthlySalary,
      daysInSystem,
      nextPayoutDate,
      emergencyFundNeeded,
      isEligible
    });
  };

  const getEligibilityStatus = () => {
    if (salaryProjection.daysInSystem < 90) {
      return {
        status: 'Building History',
        message: `You need ${90 - salaryProjection.daysInSystem} more days to be eligible for salary payouts`,
        color: '#f59e0b',
        bgColor: '#fffbeb',
        icon: '⏳'
      };
    }
    
    if (user.jarBalances?.emergency < salaryProjection.emergencyFundNeeded * 0.5) {
      return {
        status: 'Need Emergency Fund',
        message: 'Build your emergency fund to at least 50% of the target to start salary payouts',
        color: '#ef4444',
        bgColor: '#fef2f2',
        icon: '⚠️'
      };
    }
    
    return {
      status: 'Eligible',
      message: 'You can start receiving monthly salary payouts!',
      color: '#10b981',
      bgColor: '#f0fdf4',
      icon: '✓'
    };
  };

  const getProgressPercentage = () => {
    return Math.min((salaryProjection.daysInSystem / 90) * 100, 100);
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

  const eligibility = getEligibilityStatus();
  const progressPercentage = getProgressPercentage();

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
            {salaryProjection.daysInSystem} days completed
          </span>
          <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#6b7280' }}>
            {Math.max(0, 90 - salaryProjection.daysInSystem)} days remaining
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
            value: formatCurrency(salaryProjection.avgDailyEarnings),
            subtitle: `Based on last ${Math.min(90, salaryProjection.daysInSystem)} days`
          },
          {
            icon: '💵',
            iconBg: '#f0fdf4',
            title: 'Projected Monthly Salary',
            value: formatCurrency(salaryProjection.projectedMonthlySalary),
            subtitle: '60% of monthly earnings (26 working days)'
          },
          {
            icon: '🛡️',
            iconBg: '#fffbeb',
            title: 'Emergency Fund Target',
            value: formatCurrency(salaryProjection.emergencyFundNeeded),
            subtitle: '3 months of salary for safety'
          },
          {
            icon: '📅',
            iconBg: '#fef2f2',
            title: 'Next Payout Date',
            value: salaryProjection.nextPayoutDate ? 
              salaryProjection.nextPayoutDate.toLocaleDateString('en-IN', { 
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
              {!stat.noRupee && '₹'}{stat.value}
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
          {earningsHistory.slice(0, 14).reverse().map((income, index) => {
            const maxAmount = Math.max(...earningsHistory.slice(0, 14).map(i => i.amount));
            const heightPercent = (income.amount / maxAmount) * 100;
            
            return (
              <div key={income._id} style={{
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
                }}>
                  <div style={{
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
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                    ₹{formatCurrency(income.amount)}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.6875rem',
                  color: '#9ca3af',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  {new Date(income.receivedAt).toLocaleDateString('en-IN', { 
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
            <span style={{ fontWeight: '600', color: '#374151' }}>Target:</span> ₹{formatCurrency(salaryProjection.emergencyFundNeeded)}
          </div>
          <div style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Current:</span> ₹{formatCurrency(user.jarBalances?.emergency || 0)}
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
            background: user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
              : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
            width: `${Math.min(((user.jarBalances?.emergency || 0) / salaryProjection.emergencyFundNeeded) * 100, 100)}%`,
            transition: 'width 0.6s ease',
            borderRadius: '6px'
          }} />
        </div>

        <div style={{
          padding: '1rem',
          background: user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
            ? '#f0fdf4' 
            : '#fffbeb',
          borderRadius: '10px',
          fontSize: '0.875rem',
          color: user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
            ? '#065f46' 
            : '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>
            {user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
              ? '✅' 
              : '⚠️'
            }
          </span>
          <span>
            {user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
              ? 'Emergency fund sufficient for salary payouts' 
              : 'Build emergency fund to enable salary payouts'
            }
          </span>
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#fef2f2',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }}>
            🔍
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            How the Salary System Works
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {[
            {
              number: '1',
              title: 'Track Earnings',
              description: 'Log your daily/weekly earnings from gig platforms',
              color: '#667eea'
            },
            {
              number: '2',
              title: 'Build History',
              description: 'Accumulate 90 days of consistent earnings data',
              color: '#10b981'
            },
            {
              number: '3',
              title: 'Emergency Fund',
              description: 'Ensure you have 3 months of salary saved',
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

// Demo Component
const SalaryPage = () => {
  const mockUser = {
    _id: 'user123',
    jarBalances: {
      salary: 15000,
      emergency: 25000,
      future: 10000
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%)',
      padding: '3rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SalaryProjection userId="user123" user={mockUser} />
      </div>
    </div>
  );
};

export default SalaryPage;