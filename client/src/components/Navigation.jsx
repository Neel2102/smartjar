import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard', icon: '📊' },
    { path: '/analytics', label: '📈 Analytics', icon: '📈' },
    { path: '/education', label: '💡 Learn', icon: '💡' },
    { path: '/settings', label: '⚙️ Settings', icon: '⚙️' },
    { path: '/import', label: '📥 Import', icon: '📥' },
    { path: '/gamification', label: '🏅 Rewards', icon: '🏅' },
    { path: '/tools', label: '🧮 Tools', icon: '🧮' },
    { path: '/salary', label: '💰 Salary', icon: '💰' },
    { path: '/investment', label: '🎯 Investment', icon: '🎯' },
    { path: '/ai-chat', label: '🤖 AI Coach', icon: '🤖' },
    { path: '/payment', label: '💳 Payment', icon: '💳' }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-content">
          {/* Desktop Navigation */}
          <div className="nav-desktop">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Navigation */}
          <div className="nav-mobile">
            <div className="nav-mobile-header">
              <h3>🏦 SmartJar</h3>
              <button className="mobile-menu-toggle" onClick={() => {
                const mobileNav = document.querySelector('.nav-mobile-menu');
                mobileNav.classList.toggle('active');
              }}>
                ☰
              </button>
            </div>
            <div className="nav-mobile-menu">
              <ul className="nav-mobile-list">
                {navItems.map((item) => (
                  <li key={item.path} className="nav-mobile-item">
                    <Link
                      to={item.path}
                      className={`nav-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => {
                        const mobileNav = document.querySelector('.nav-mobile-menu');
                        mobileNav.classList.remove('active');
                      }}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logout Button */}
          <div className="nav-logout">
            <button 
              onClick={onLogout}
              className="logout-btn"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
