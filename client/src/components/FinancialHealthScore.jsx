import React from 'react';
import { HeartIcon, LightBulbIcon } from '@heroicons/react/24/outline';

const FinancialHealthScore = ({ user, jarBalances, incomes, expenses }) => {
  // Simple score calculation
  let score = 0;
  
  // Emergency fund (25 points)
  if (user.emergencyFundTarget > 0) {
    const emergencyPercentage = (jarBalances.emergency / user.emergencyFundTarget) * 100;
    if (emergencyPercentage >= 100) score += 25;
    else if (emergencyPercentage >= 50) score += 15;
    else if (emergencyPercentage >= 25) score += 10;
  }
  
  // Savings rate (25 points)
  if (incomes.length > 0) {
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalSaved = jarBalances.emergency + jarBalances.future;
    const savingsRate = (totalSaved / totalIncome) * 100;
    
    if (savingsRate >= 30) score += 25;
    else if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 15;
    else if (savingsRate >= 5) score += 10;
  }
  
  // Activity (20 points)
  if (incomes.length > 0) {
    const daysSinceLastActivity = Math.floor((Date.now() - new Date(incomes[0].receivedAt)) / (1000 * 60 * 60 * 24));
    if (daysSinceLastActivity <= 1) score += 20;
    else if (daysSinceLastActivity <= 3) score += 15;
    else if (daysSinceLastActivity <= 7) score += 10;
  }
  
  // Basic factors (30 points)
  if (incomes.length > 0) score += 15;
  if (jarBalances.emergency > 0) score += 15;

  const getHealthLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: '#1d4ed8' };
    if (score >= 60) return { level: 'Good', color: '#2563eb' };
    if (score >= 40) return { level: 'Fair', color: '#3b82f6' };
    if (score >= 20) return { level: 'Poor', color: '#60a5fa' };
    return { level: 'Critical', color: '#93c5fd' };
  };

  const healthLevel = getHealthLevel(score);

  return (
    <div style={{
      background: 'white',
      borderRadius: '15px',
      padding: '2rem',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#1f2937' }}>
        <HeartIcon style={{ width: 22, height: 22, color: '#2563eb' }} />
        Financial Health Score
      </h3>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '3rem', fontWeight: '700', color: healthLevel.color }}>
          {score}/100
        </div>
        <div style={{ fontSize: '1.2rem', color: healthLevel.color, fontWeight: '600' }}>
          {healthLevel.level}
        </div>
      </div>

      <div style={{
        background: '#eff6ff',
        padding: '1rem',
        borderRadius: '8px',
        borderLeft: '4px solid #2563eb'
      }}>
        <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0', color: '#2563eb' }}>
          <LightBulbIcon style={{ width: 18, height: 18 }} />
          Recommendations:
        </h5>
        {score >= 80 ? (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#2563eb' }}>
            Keep up the excellent work! Consider setting more ambitious financial goals.
          </p>
        ) : score >= 60 ? (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#2563eb' }}>
            Focus on building your emergency fund and maintaining consistent income tracking.
          </p>
        ) : score >= 40 ? (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#2563eb' }}>
            Prioritize emergency savings and review your expense categories regularly.
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#2563eb' }}>
            Start with basic income tracking and aim to save at least 10% of your income.
          </p>
        )}
      </div>
    </div>
  );
};

export default FinancialHealthScore;
