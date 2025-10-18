import React from 'react';
import SalaryProjection from '../components/SalaryProjection';
import PageLayout from '../components/PageLayout';

const SalaryPage = ({ userId, user }) => {
  return (
    <PageLayout
      title="💰 Salary Projection"
      subtitle="Track your progress towards consistent monthly salary"
      user={user}
    >
      <SalaryProjection userId={userId} user={user} />
    </PageLayout>
  );
};

export default SalaryPage;
