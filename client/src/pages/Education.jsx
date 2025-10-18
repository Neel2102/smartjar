import React from 'react';
import FinancialEducation from '../components/FinancialEducation';
import PageLayout from '../components/PageLayout';

const EducationPage = ({ user }) => {
  return (
    <PageLayout
      title="💡 Financial Education"
      subtitle="Learn essential financial concepts and best practices"
      user={user}
    >
      <FinancialEducation />
    </PageLayout>
  );
};

export default EducationPage;
