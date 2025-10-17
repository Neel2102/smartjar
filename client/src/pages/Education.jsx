import React from 'react';
import FinancialEducation from '../components/FinancialEducation';

const EducationPage = () => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>💡 Financial Education</h1>
          <p>Learn essential financial concepts and best practices</p>
        </div>
        <FinancialEducation />
      </div>
    </div>
  );
};

export default EducationPage;
