import React from 'react';
import Analytics from '../components/Analytics';
import { useApp } from '../context/AppContext';

const AnalyticsPage = () => {
  const { userId, jarBalances, incomes, expenses } = useApp();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>📈 Analytics & Insights</h1>
          <p>Deep dive into your financial patterns and trends</p>
        </div>
        <Analytics 
          userId={userId}
          incomes={incomes} 
          expenses={expenses} 
          jarBalances={jarBalances} 
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
