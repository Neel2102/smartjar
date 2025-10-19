import React from 'react';
import FinancialEducation from '../components/FinancialEducation';
import PageLayout from '../components/PageLayout';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const EducationPage = ({ user }) => {
  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <AcademicCapIcon style={{ width: 24, height: 24 }} aria-hidden />
          Financial Education
        </span>
      }
      subtitle="Learn essential financial concepts and best practices"
      user={user}
    >
      <FinancialEducation />
    </PageLayout>
  );
};

export default EducationPage;
