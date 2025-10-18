import React from 'react';
import InvestmentAssistant from '../components/InvestmentAssistant';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';

const InvestmentPage = ({ user }) => {
  const { jarBalances } = useApp();

  return (
    <PageLayout
      title="Investment Assistant"
      subtitle="Get personalized investment recommendations"
      user={user}
    >
      <InvestmentAssistant user={user} jarBalances={jarBalances} />
    </PageLayout>
  );
};

export default InvestmentPage;
