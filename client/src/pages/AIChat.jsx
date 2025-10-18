import React from 'react';
import AdvancedAIChat from '../components/AdvancedAIChat';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';

const AIChatPage = ({ user }) => {
  const { jarBalances, incomes, expenses } = useApp();

  return (
    <PageLayout
      title="🤖 AI Financial Coach"
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
