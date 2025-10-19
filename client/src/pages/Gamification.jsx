import React from 'react';
import Gamification from '../components/Gamification';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { TrophyIcon } from '@heroicons/react/24/outline';

const GamificationPage = ({ user }) => {
  const { incomes } = useApp();

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <TrophyIcon style={{ width: 24, height: 24 }} aria-hidden />
          Rewards & Achievements
        </span>
      }
      subtitle="Track your progress and unlock achievements"
      user={user}
    >
      <Gamification user={user} incomes={incomes} />
    </PageLayout>
  );
};

export default GamificationPage;
