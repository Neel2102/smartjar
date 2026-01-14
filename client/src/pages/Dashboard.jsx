import React, { useState, useEffect } from 'react';
import JarCard from '../components/JarCard';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import FinancialHealthScore from '../components/FinancialHealthScore';
// Removed per simplified dashboard; these features are accessible via top navigation routes
import ProgressRing from '../components/ProgressRing';
import PageLayout from '../components/PageLayout';
import { incomeAPI, expenseAPI, financeAPI } from '../services/api';
import { formatINR, calculateTotal } from '../utils/formatters';
import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = ({ userId, user, onUserUpdated }) => {
  const [financeSummary, setFinanceSummary] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryResponse, incomesResponse, expensesResponse] = await Promise.all([
        financeAPI.getSummary(userId),
        incomeAPI.getAll(userId),
        expenseAPI.getAll(userId)
      ]);
      
      setFinanceSummary(summaryResponse.data);
      setIncomes(incomesResponse.data);
      setExpenses(expensesResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncomeAdded = (newIncome) => {
    setIncomes(prev => [newIncome, ...prev]);
    fetchData(); // Refresh finance summary
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    fetchData(); // Refresh finance summary
  };

  const handleIncomesImported = (importedIncomes) => {
    setIncomes(prev => [...importedIncomes, ...prev]);
    fetchData(); // Refresh finance summary
  };

  const handleUserUpdated = (updatedUser) => {
    onUserUpdated(updatedUser);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <ArrowPathIcon style={{ width: 28, height: 28 }} aria-hidden />
            </div>
            <div>Loading your SmartJar...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="container">
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: '10px',
            border: '1px solid var(--primary-lighter)'
          }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
              <XCircleIcon style={{ width: 28, height: 28 }} aria-hidden />
            </div>
            <div>{error}</div>
            <button 
              onClick={fetchData} 
              className="btn" 
              style={{ marginTop: '1rem', maxWidth: '200px' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use finance summary values (backend-calculated)
  const totalIncome = financeSummary?.totalIncome || 0;
  const totalExpenses = financeSummary?.totalExpenses || 0;
  const totalSaved = (financeSummary?.emergencyJar || 0) + (financeSummary?.futureJar || 0);
  const netIncome = financeSummary?.netIncome || 0;
  const emergencyGoal = financeSummary?.emergencyGoal || 0;
  const emergencySaved = financeSummary?.emergencyJar || 0;
  const emergencyCoverage = financeSummary?.emergencyCoveragePercent || 0;
  const jarBalances = financeSummary ? {
    salary: financeSummary.salaryJar,
    emergency: financeSummary.emergencyJar,
    future: financeSummary.futureJar
  } : { salary: 0, emergency: 0, future: 0 };

  // Dashboard now focuses on Overview only; other sections are accessible via the top navigation routes

  return (
    <PageLayout user={user} showWelcome={true} className="dashboard">
      {/* Overview */}
      <FinancialHealthScore 
        user={user} 
        jarBalances={jarBalances} 
        incomes={incomes} 
        expenses={expenses} 
      />

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{formatINR(totalIncome)}</div>
            <div className="stat-label">Total Income</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatINR(totalExpenses)}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatINR(netIncome)}</div>
            <div className="stat-label">Net Income</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatINR(totalSaved)}</div>
            <div className="stat-label">Total Saved</div>
          </div>
        </div>

        {/* Emergency Goal Widget */}
        {emergencyGoal > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Emergency Goal
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {formatINR(emergencyGoal)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Emergency Saved
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: '#1f2937'
                }}>
                  {formatINR(emergencySaved)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Coverage
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  color: emergencyCoverage >= 30 ? '#10b981' : emergencyCoverage >= 15 ? '#f59e0b' : '#ef4444'
                }}>
                  {emergencyCoverage}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--card)', borderRadius: 15, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <ProgressRing
            current={jarBalances.emergency}
            target={emergencyGoal}
            label="Emergency Fund"
            color="var(--primary)"
          />
        </div>

        <div className="jar-grid">
          <JarCard
            type="salary"
            amount={jarBalances.salary}
            percentage={user.jarRatios.salary}
            totalIncome={totalIncome}
          />
          <JarCard
            type="emergency"
            amount={jarBalances.emergency}
            percentage={user.jarRatios.emergency}
            totalIncome={totalIncome}
          />
          <JarCard
            type="future"
            amount={jarBalances.future}
            percentage={user.jarRatios.future}
            totalIncome={totalIncome}
          />
        </div>

        {/* New 2x2 Grid Layout for Income & Expenses */}
        <div className="dashboard-grid">
          {/* Top Row */}
          <div className="dashboard-row">
            <div className="dashboard-card income-form-card">
              <IncomeForm onIncomeAdded={handleIncomeAdded} userId={userId} />
            </div>
            <div className="dashboard-card income-history-card">
              <IncomeList incomes={incomes} userId={userId} />
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="dashboard-row">
            <div className="dashboard-card expense-form-card">
              <ExpenseForm onExpenseAdded={handleExpenseAdded} userId={userId} jarBalances={jarBalances} />
            </div>
            <div className="dashboard-card expense-history-card">
              <ExpenseList expenses={expenses} userId={userId} />
            </div>
          </div>
        </div>
    </PageLayout>
  );
};

export default Dashboard;
