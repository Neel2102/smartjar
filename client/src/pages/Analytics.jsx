import React from 'react';
import Analytics from '../components/Analytics';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';

const AnalyticsPage = ({ user }) => {
  const { userId, jarBalances, incomes, expenses } = useApp();

  return (
    <PageLayout
      title="📈 Analytics & Insights"
      subtitle="Deep dive into your financial patterns and trends"
      user={user}
    >
      <Analytics 
        userId={userId}
        incomes={incomes} 
        expenses={expenses} 
        jarBalances={jarBalances} 
      />
    </PageLayout>
  );
};

export default AnalyticsPage;
