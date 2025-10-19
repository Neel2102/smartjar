import React from 'react';
import Analytics from '../components/Analytics';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const AnalyticsPage = ({ user }) => {
  const { userId, jarBalances, incomes, expenses } = useApp();

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ChartBarIcon style={{ width: 24, height: 24 }} aria-hidden />
          Analytics & Insights
        </span>
      }
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
