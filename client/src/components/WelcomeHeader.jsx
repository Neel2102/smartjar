import React from 'react';

const WelcomeHeader = ({ user }) => {
  if (!user || !user.name) {
    return null;
  }

  return (
    <div className="welcome-header">
      <h2 className="welcome-title">Welcome back, {user.name}! 👋</h2>
      <p className="welcome-subtitle">Let's continue building your financial stability</p>
    </div>
  );
};

export default WelcomeHeader;
