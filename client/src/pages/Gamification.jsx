import React from 'react';
import Gamification from '../components/Gamification';
import { useApp } from '../context/AppContext';

const GamificationPage = ({ user }) => {
  const { incomes } = useApp();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>🏅 Rewards & Achievements</h1>
          <p>Track your progress and unlock achievements</p>
        </div>
        <Gamification user={user} incomes={incomes} />
      </div>
    </div>
  );
};

export default GamificationPage;
