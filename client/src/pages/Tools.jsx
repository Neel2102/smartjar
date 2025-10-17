import React from 'react';
import FinancialTools from '../components/FinancialTools';

const ToolsPage = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🧮 Financial Tools</h1>
          <p>Useful calculators and financial planning tools</p>
        </div>
        <FinancialTools />
      </div>
    </div>
  );
};

export default ToolsPage;
