import React from 'react';
import InvestmentAssistant from '../components/InvestmentAssistant';
import { useApp } from '../context/AppContext';

const InvestmentPage = ({ user }) => {
  const { jarBalances } = useApp();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🎯 Investment Assistant</h1>
          <p>Get personalized investment recommendations</p>
        </div>
        <InvestmentAssistant user={user} jarBalances={jarBalances} />
      </div>
    </div>
  );
};

export default InvestmentPage;
