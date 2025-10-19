import React from 'react';
import FinancialTools from '../components/FinancialTools';
import PageLayout from '../components/PageLayout';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const ToolsPage = ({ user }) => {
  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <WrenchScrewdriverIcon style={{ width: 24, height: 24 }} aria-hidden />
          Financial Tools
        </span>
      }
      subtitle="Useful calculators and financial planning tools"
      user={user}
    >
      <FinancialTools />
    </PageLayout>
  );
};

export default ToolsPage;
