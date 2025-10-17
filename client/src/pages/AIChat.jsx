import React from 'react';
import AdvancedAIChat from '../components/AdvancedAIChat';
import { useApp } from '../context/AppContext';

const AIChatPage = ({ user }) => {
  const { jarBalances, incomes, expenses } = useApp();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🤖 AI Financial Coach</h1>
          <p>Get personalized financial advice from our AI assistant</p>
        </div>
        <AdvancedAIChat 
          user={user} 
          jarBalances={jarBalances} 
          incomes={incomes} 
          expenses={expenses} 
        />
      </div>
    </div>
  );
};

export default AIChatPage;
