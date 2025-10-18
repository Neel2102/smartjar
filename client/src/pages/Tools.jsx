import React from 'react';
import FinancialTools from '../components/FinancialTools';
import PageLayout from '../components/PageLayout';

const ToolsPage = ({ user }) => {
  return (
    <PageLayout
      title="🧮 Financial Tools"
      subtitle="Useful calculators and financial planning tools"
      user={user}
    >
      <FinancialTools />
    </PageLayout>
  );
};

export default ToolsPage;
