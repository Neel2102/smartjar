import React from 'react';
import WelcomeHeader from './WelcomeHeader';

const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  user, 
  showWelcome = true,
  className = '' 
}) => {
  return (
    <div className={`page ${className}`}>
      <div className="container">
        {showWelcome && user && <WelcomeHeader user={user} />}
        {(title || subtitle) && (
          <div className="page-header">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
