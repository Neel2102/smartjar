import React from 'react';
import SalaryProjection from '../components/SalaryProjection';

const SalaryPage = ({ userId, user }) => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>💰 Salary Projection</h1>
          <p>Track your progress towards consistent monthly salary</p>
        </div>
        <SalaryProjection userId={userId} user={user} />
      </div>
    </div>
  );
};

export default SalaryPage;
