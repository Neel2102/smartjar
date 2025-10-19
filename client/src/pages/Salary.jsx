import React from 'react';
import SalaryProjection from '../components/SalaryProjection';
import PageLayout from '../components/PageLayout';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const SalaryPage = ({ userId, user }) => {
  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <BanknotesIcon style={{ width: 24, height: 24 }} aria-hidden />
          Salary Projection
        </span>
      }
      subtitle="Track your progress towards consistent monthly salary"
      user={user}
    >
      <SalaryProjection userId={userId} user={user} />
    </PageLayout>
  );
};

export default SalaryPage;
