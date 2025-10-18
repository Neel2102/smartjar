import React, { useState, useEffect } from 'react';
import { incomeAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

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
      const response = await incomeAPI.getAll(userId);
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
        color: '#ff9800'
      };
    }
    
    if (user.jarBalances?.emergency < salaryProjection.emergencyFundNeeded * 0.5) {
      return {
        status: 'Need Emergency Fund',
        message: 'Build your emergency fund to at least 50% of the target to start salary payouts',
        color: '#f44336'
      };
    }
    
    return {
      status: 'Eligible',
      message: 'You can start receiving monthly salary payouts!',
      color: '#4caf50'
    };
  };

  const getProgressPercentage = () => {
    return Math.min((salaryProjection.daysInSystem / 90) * 100, 100);
  };

  if (loading) {
    return (
      <div className="salary-projection">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Calculating your salary projection...</div>
        </div>
      </div>
    );
  }

  const eligibility = getEligibilityStatus();

  return (
    <div className="salary-projection">
      <div className="eligibility-card" style={{ borderColor: eligibility.color }}>
        <div className="eligibility-header">
          <h3>Status: {eligibility.status}</h3>
          <div className="status-indicator" style={{ backgroundColor: eligibility.color }}></div>
        </div>
        <p>{eligibility.message}</p>
      </div>

      <div className="progress-section">
        <h3>📅 Building Your Earnings History</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="progress-stats">
          <span>{salaryProjection.daysInSystem} days completed</span>
          <span>{90 - salaryProjection.daysInSystem} days remaining</span>
        </div>
        <small>You need 90 days of consistent earnings to start salary payouts</small>
      </div>

      <div className="projection-grid">
        <div className="projection-card">
          <div className="projection-icon">📊</div>
          <div className="projection-content">
            <h4>Average Daily Earnings</h4>
            <div className="projection-value">₹{formatCurrency(salaryProjection.avgDailyEarnings)}</div>
            <small>Based on last {Math.min(90, salaryProjection.daysInSystem)} days</small>
          </div>
        </div>

        <div className="projection-card">
          <div className="projection-icon">💵</div>
          <div className="projection-content">
            <h4>Projected Monthly Salary</h4>
            <div className="projection-value">₹{formatCurrency(salaryProjection.projectedMonthlySalary)}</div>
            <small>60% of monthly earnings (26 working days)</small>
          </div>
        </div>

        <div className="projection-card">
          <div className="projection-icon">🛡️</div>
          <div className="projection-content">
            <h4>Emergency Fund Target</h4>
            <div className="projection-value">₹{formatCurrency(salaryProjection.emergencyFundNeeded)}</div>
            <small>3 months of salary for safety</small>
          </div>
        </div>

        <div className="projection-card">
          <div className="projection-icon">📅</div>
          <div className="projection-content">
            <h4>Next Payout Date</h4>
            <div className="projection-value">
              {salaryProjection.nextPayoutDate ? 
                salaryProjection.nextPayoutDate.toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'Not eligible yet'
              }
            </div>
            <small>Salary credited on 1st of every month</small>
          </div>
        </div>
      </div>

      <div className="earnings-chart">
        <h3>📈 Recent Earnings Trend</h3>
        <div className="chart-container">
          {earningsHistory.slice(0, 14).map((income, index) => (
            <div key={income._id} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ 
                  height: `${(income.amount / Math.max(...earningsHistory.slice(0, 14).map(i => i.amount))) * 100}%` 
                }}
              ></div>
              <div className="bar-label">
                ₹{formatCurrency(income.amount)}
              </div>
              <small>{new Date(income.receivedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</small>
            </div>
          ))}
        </div>
        <small>Last 14 days of earnings</small>
      </div>

      <div className="emergency-fund-status">
        <h3>🛡️ Emergency Fund Status</h3>
        <div className="fund-progress">
          <div className="fund-target">
            <span>Target: ₹{formatCurrency(salaryProjection.emergencyFundNeeded)}</span>
            <span>Current: ₹{formatCurrency(user.jarBalances?.emergency || 0)}</span>
          </div>
          <div className="fund-progress-bar">
            <div 
              className="fund-progress-fill" 
              style={{ 
                width: `${Math.min(((user.jarBalances?.emergency || 0) / salaryProjection.emergencyFundNeeded) * 100, 100)}%` 
              }}
            ></div>
          </div>
          <small>
            {user.jarBalances?.emergency >= salaryProjection.emergencyFundNeeded * 0.5 
              ? '✅ Emergency fund sufficient for salary payouts' 
              : '⚠️ Build emergency fund to enable salary payouts'
            }
          </small>
        </div>
      </div>

      <div className="how-it-works">
        <h3>🔍 How the Salary System Works</h3>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Track Earnings</h4>
            <p>Log your daily/weekly earnings from gig platforms</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Build History</h4>
            <p>Accumulate 90 days of consistent earnings data</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Emergency Fund</h4>
            <p>Ensure you have 3 months of salary saved</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Monthly Payout</h4>
            <p>Receive consistent salary on 1st of every month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryProjection;
