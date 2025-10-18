import React, { useState, useEffect } from 'react';
import JarCard from '../components/JarCard';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import ExpenseForm from '../components/ExpenseForm';
import FinancialHealthScore from '../components/FinancialHealthScore';
// Removed per simplified dashboard; these features are accessible via top navigation routes
import ProgressRing from '../components/ProgressRing';
import PageLayout from '../components/PageLayout';
import { incomeAPI, expenseAPI } from '../services/api';
import { formatCurrency, calculateTotal } from '../utils/formatters';

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
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
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
            background: '#ffebee',
            color: '#c62828',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
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
            color="#FF9800"
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <IncomeForm onIncomeAdded={handleIncomeAdded} userId={userId} />
          <ExpenseForm onExpenseAdded={handleExpenseAdded} userId={userId} jarBalances={jarBalances} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <IncomeList incomes={incomes} />
          <div className="income-list">
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Expense History</h3>
            {expenses.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666' }}>
                No expenses recorded yet.
              </div>
            ) : (
              expenses.slice(0, 5).map((expense) => (
                <div key={expense._id} className="income-item">
                  <div>
                    <div className="income-amount">{formatCurrency(expense.amount)}</div>
                    <div className="income-date">{new Date(expense.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="income-source">{expense.category}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      {expense.type} • {expense.jarSource}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
    </PageLayout>
  );
};

export default Dashboard;
