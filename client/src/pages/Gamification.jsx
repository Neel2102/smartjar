import React from 'react';
import Gamification from '../components/Gamification';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';

const GamificationPage = ({ user }) => {
  const { incomes } = useApp();

  return (
    <PageLayout
      title="🏅 Rewards & Achievements"
      subtitle="Track your progress and unlock achievements"
      user={user}
    >
      <Gamification user={user} incomes={incomes} />
    </PageLayout>
  );
};

export default GamificationPage;
