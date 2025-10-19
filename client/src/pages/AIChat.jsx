import React from 'react';
import AdvancedAIChat from '../components/AdvancedAIChat';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

const AIChatPage = ({ user }) => {
  const { jarBalances, incomes, expenses } = useApp();

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <SparklesIcon style={{ width: 24, height: 24 }} aria-hidden />
          AI Financial Coach
        </span>
      }
      subtitle="Get personalized financial advice from our AI assistant"
      user={user}
    >
      <AdvancedAIChat 
        user={user} 
        jarBalances={jarBalances} 
        incomes={incomes} 
        expenses={expenses} 
      />
    </PageLayout>
  );
};

export default AIChatPage;
