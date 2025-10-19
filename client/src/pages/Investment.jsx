import React from 'react';
import InvestmentAssistant from '../components/InvestmentAssistant';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const InvestmentPage = ({ user }) => {
  const { jarBalances } = useApp();

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ArrowTrendingUpIcon style={{ width: 24, height: 24 }} aria-hidden />
          Investment Assistant
        </span>
      }
      subtitle="Get personalized investment recommendations"
      user={user}
    >
      <InvestmentAssistant user={user} jarBalances={jarBalances} />
    </PageLayout>
  );
};

export default InvestmentPage;
