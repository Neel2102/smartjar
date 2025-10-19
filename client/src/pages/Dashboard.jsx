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
import { incomeAPI, expenseAPI } from '../services/api';
import { formatCurrency, calculateTotal } from '../utils/formatters';
import { ArrowPathIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = ({ userId, user, onUserUpdated }) => {
  const [jarBalances, setJarBalances] = useState({ salary: 0, emergency: 0, future: 0 });
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
      const [balancesResponse, incomesResponse, expensesResponse] = await Promise.all([
        incomeAPI.getJarBalances(userId),
        incomeAPI.getAll(userId),
        expenseAPI.getAll(userId)
      ]);
      
      setJarBalances(balancesResponse.data);
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
    fetchData(); // Refresh jar balances
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    fetchData(); // Refresh jar balances
  };

  const handleIncomesImported = (importedIncomes) => {
    setIncomes(prev => [...importedIncomes, ...prev]);
    fetchData(); // Refresh jar balances
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

  const totalIncome = calculateTotal(incomes.map(inc => inc.amount));
  const totalExpenses = calculateTotal(expenses.map(exp => exp.amount));
  const totalSaved = jarBalances.emergency + jarBalances.future;
  const netIncome = totalIncome - totalExpenses;
  const emergencyTarget = user?.emergencyFundTarget || 0;

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
            <div className="stat-number">{formatCurrency(totalIncome)}</div>
            <div className="stat-label">Total Income</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(totalExpenses)}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(netIncome)}</div>
            <div className="stat-label">Net Income</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(totalSaved)}</div>
            <div className="stat-label">Total Saved</div>
          </div>
        </div>

        <div style={{ background: 'var(--card)', borderRadius: 15, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <ProgressRing
            current={jarBalances.emergency}
            target={emergencyTarget}
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
              <IncomeList incomes={incomes} />
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="dashboard-row">
            <div className="dashboard-card expense-form-card">
              <ExpenseForm onExpenseAdded={handleExpenseAdded} userId={userId} jarBalances={jarBalances} />
            </div>
            <div className="dashboard-card expense-history-card">
              <ExpenseList expenses={expenses} />
            </div>
          </div>
        </div>
    </PageLayout>
  );
};

export default Dashboard;
