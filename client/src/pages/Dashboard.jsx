import React, { useState, useEffect } from 'react';
import JarCard from '../components/JarCard';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import { incomeAPI } from '../services/api';
import { formatCurrency, calculateTotal } from '../utils/formatters';

const Dashboard = ({ userId }) => {
  const [jarBalances, setJarBalances] = useState({ salary: 0, emergency: 0, future: 0 });
  const [incomes, setIncomes] = useState([]);
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
      const [balancesResponse, incomesResponse] = await Promise.all([
        incomeAPI.getJarBalances(userId),
        incomeAPI.getAll(userId)
      ]);
      
      setJarBalances(balancesResponse.data);
      setIncomes(incomesResponse.data);
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
  const totalSaved = jarBalances.emergency + jarBalances.future;

  return (
    <div className="dashboard">
      <div className="container">
        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(totalIncome)}</div>
            <div className="stat-label">Total Income</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(totalSaved)}</div>
            <div className="stat-label">Total Saved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{incomes.length}</div>
            <div className="stat-label">Income Entries</div>
          </div>
        </div>

        {/* Jar Cards */}
        <div className="jar-grid">
          <JarCard
            type="salary"
            amount={jarBalances.salary}
            percentage={60}
            totalIncome={totalIncome}
          />
          <JarCard
            type="emergency"
            amount={jarBalances.emergency}
            percentage={25}
            totalIncome={totalIncome}
          />
          <JarCard
            type="future"
            amount={jarBalances.future}
            percentage={15}
            totalIncome={totalIncome}
          />
        </div>

        {/* Add Income Form */}
        <IncomeForm onIncomeAdded={handleIncomeAdded} userId={userId} />

        {/* Income History */}
        <IncomeList incomes={incomes} />
      </div>
    </div>
  );
};

export default Dashboard;
