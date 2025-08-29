import React, { useState, useEffect } from 'react';
import JarCard from '../components/JarCard';
import IncomeForm from '../components/IncomeForm';
import IncomeList from '../components/IncomeList';
import JarRatioSettings from '../components/JarRatioSettings';
import CSVImport from '../components/CSVImport';
import FinancialEducation from '../components/FinancialEducation';
import { incomeAPI } from '../services/api';
import { formatCurrency, calculateTotal } from '../utils/formatters';

const Dashboard = ({ userId, user, onUserUpdated }) => {
  const [jarBalances, setJarBalances] = useState({ salary: 0, emergency: 0, future: 0 });
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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
  const totalSaved = jarBalances.emergency + jarBalances.future;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
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

            {/* Add Income Form */}
            <IncomeForm onIncomeAdded={handleIncomeAdded} userId={userId} />

            {/* Income History */}
            <IncomeList incomes={incomes} />
          </>
        );

      case 'settings':
        return (
          <JarRatioSettings user={user} onRatiosUpdated={handleUserUpdated} />
        );

      case 'import':
        return (
          <CSVImport userId={userId} onIncomesImported={handleIncomesImported} />
        );

      case 'education':
        return <FinancialEducation />;

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {[
            { key: 'overview', label: '📊 Overview', icon: '📊' },
            { key: 'settings', label: '⚙️ Settings', icon: '⚙️' },
            { key: 'import', label: '📥 Import', icon: '📥' },
            { key: 'education', label: '💡 Learn', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? '#667eea' : 'white',
                color: activeTab === tab.key ? 'white' : '#667eea',
                border: '2px solid #667eea',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
