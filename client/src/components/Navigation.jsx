// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Navigation = ({ onLogout }) => {
//   const location = useLocation();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const navItems = [
//     { path: '/dashboard', label: ' Dashboard', icon: '📊' },
//     { path: '/analytics', label: ' Analytics', icon: '📈' },
//     { path: '/education', label: ' Learn', icon: '💡' },
//     { path: '/settings', label: ' Settings', icon: '⚙️' },
//     { path: '/import', label: ' Import', icon: '📥' },
//     { path: '/gamification', label: ' Rewards', icon: '🏅' },
//     { path: '/tools', label: ' Tools', icon: '🧮' },
//     { path: '/salary', label: ' Salary', icon: '💰' },
//     { path: '/investment', label: ' Investment', icon: '🎯' },
//     { path: '/ai-chat', label: ' AI Coach', icon: '🤖' },
//     { path: '/payment', label: ' Payment', icon: '💳' }
//   ];

//   const isActive = (path) => {
//     if (path === '/dashboard') {
//       return location.pathname === '/dashboard';
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <nav className="navigation">
//       <div className="container">
//         <div className="nav-content">
//           {/* Desktop Navigation */}
//           <div className="nav-desktop">
//             <ul className="nav-list">
//               {navItems.map((item) => (
//                 <li key={item.path} className="nav-item">
//                   <Link
//                     to={item.path}
//                     className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
//                   >
//                     <span className="nav-icon">{item.icon}</span>
//                     <span className="nav-label">{item.label}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Mobile Navigation */}
//           <div className="nav-mobile">
//             <div className="nav-mobile-header">
//               <h3>🏦 SmartJar</h3>
//               <button className="mobile-menu-toggle" onClick={() => setMobileOpen(v => !v)} aria-expanded={mobileOpen} aria-controls="mobile-menu">
//                 ☰
//               </button>
//             </div>
//             <div id="mobile-menu" className={`nav-mobile-menu ${mobileOpen ? 'active' : ''}`}>
//               <ul className="nav-mobile-list">
//                 {navItems.map((item) => (
//                   <li key={item.path} className="nav-mobile-item">
//                     <Link
//                       to={item.path}
//                       className={`nav-mobile-link ${isActive(item.path) ? 'active' : ''}`}
//                       onClick={() => setMobileOpen(false)}
//                     >
//                       <span className="nav-icon">{item.icon}</span>
//                       <span className="nav-label">{item.label}</span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Logout Button */}
//           <div className="nav-logout">
//             <button 
//               onClick={onLogout}
//               className="logout-btn"
//             >
//               🚪 Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  ArrowDownTrayIcon,
  TrophyIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import Logo from './Logo';

const NavIcon = ({ name }) => {
  const style = { width: 18, height: 18 };
  const props = { style, 'aria-hidden': true };
  switch (name) {
    case 'dashboard': return <HomeIcon {...props} />;
    case 'analytics': return <ChartBarIcon {...props} />;
    case 'learn': return <AcademicCapIcon {...props} />;
    case 'settings': return <Cog6ToothIcon {...props} />;
    case 'import': return <ArrowDownTrayIcon {...props} />;
    case 'rewards': return <TrophyIcon {...props} />;
    case 'tools': return <WrenchScrewdriverIcon {...props} />;
    case 'salary': return <BanknotesIcon {...props} />;
    case 'investment': return <ArrowTrendingUpIcon {...props} />;
    case 'coach': return <SparklesIcon {...props} />;
    case 'payment': return <CreditCardIcon {...props} />;
    default: return null;
  }
};

const Navigation = ({ onLogout }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/analytics', label: 'Analytics', icon: 'analytics' },
    { path: '/education', label: 'Learn', icon: 'learn' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
    { path: '/import', label: 'Import', icon: 'import' },
    { path: '/gamification', label: 'Rewards', icon: 'rewards' },
    { path: '/tools', label: 'Tools', icon: 'tools' },
    { path: '/salary', label: 'Salary', icon: 'salary' },
    { path: '/investment', label: 'Investment', icon: 'investment' },
    { path: '/ai-chat', label: 'AI Coach', icon: 'coach' },
    { path: '/payment', label: 'Payment', icon: 'payment' }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main">
      <div className="sidebar-header">
        <Logo size={28} showText={true} />
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}>
                <span className="sidebar-icon"><NavIcon name={item.icon} /></span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default Navigation;