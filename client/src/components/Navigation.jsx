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
//   );
// };

// export default Navigation;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SvgIcon = ({ name }) => {
  const props = { width: 18, height: 18, fill: 'currentColor', 'aria-hidden': true };
  switch (name) {
    case 'dashboard': return <svg {...props} viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>;
    case 'analytics': return <svg {...props} viewBox="0 0 24 24"><path d="M3 3h2v18H3V3zm16 6h2v12h-2V9zM11 13h2v8h-2v-8zM7 17h2v4H7v-4zm8-10h2v14h-2V7z"/></svg>;
    case 'learn': return <svg {...props} viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13.09L5.26 12 12 8.91 18.74 12 12 16.09z"/></svg>;
    case 'settings': return <svg {...props} viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96c-.5-.42-1.05-.77-1.63-.99l-.36-2.54A.5.5 0 0 0 13.9 1h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.58.22-1.13.52-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L.7 7.5a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L.82 13.18a.5.5 0 0 0-.12.64l1.92 3.32c.13.23.4.32.61.22l2.39-.96c.5.43 1.05.77 1.63.99l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.58-.22 1.13-.56 1.63-.99l2.39.96c.22.09.49 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>;
    case 'import': return <svg {...props} viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 20h14v2H5z"/></svg>;
    case 'rewards': return <svg {...props} viewBox="0 0 24 24"><path d="M17 3H7v4H3v4c0 3.31 2.69 6 6 6h6c3.31 0 6-2.69 6-6V7h-4V3zM9 5h6v2H9V5z"/></svg>;
    case 'tools': return <svg {...props} viewBox="0 0 24 24"><path d="M14.7 6.3l3 3-8.4 8.4H6.3v-3.3l8.4-8.4zM19.7 7.3l-3-3 1.3-1.3a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4l-1.3 1.3z"/></svg>;
    case 'salary': return <svg {...props} viewBox="0 0 24 24"><path d="M21 7H3a2 2 0 0 0-2 2v8h22V9a2 2 0 0 0-2-2zm-6 8H9v-2h6v2zm6 4H3v2h18v-2z"/></svg>;
    case 'investment': return <svg {...props} viewBox="0 0 24 24"><path d="M3 17h2v4H3v-4zm4-6h2v10H7V11zm4 3h2v7h-2v-7zm4-8h2v15h-2V6zm4 5h2v10h-2V11z"/></svg>;
    case 'coach': return <svg {...props} viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 0-7 7c0 3.87 3.13 7 7 7 .64 0 1.25-.09 1.84-.25L18 20v-3.26A6.99 6.99 0 0 0 19 10a7 7 0 0 0-7-7z"/></svg>;
    case 'payment': return <svg {...props} viewBox="0 0 24 24"><path d="M21 7H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm0 10H3v-6h18v6zm-3-8H6V7h12v2z"/></svg>;
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
                    <span className="nav-icon"><SvgIcon name={item.icon} /></span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Navigation */}
          <div className="nav-mobile">
            <div className="nav-mobile-header">
              <h3>SmartJar</h3>
              <button className="mobile-menu-toggle" onClick={() => setMobileOpen(v => !v)} aria-expanded={mobileOpen} aria-controls="mobile-menu">
                ☰
              </button>
            </div>
            <div id="mobile-menu" className={`nav-mobile-menu ${mobileOpen ? 'active' : ''}`}>
              <ul className="nav-mobile-list">
                {navItems.map((item) => (
                  <li key={item.path} className="nav-mobile-item">
                    <Link
                      to={item.path}
                      className={`nav-mobile-link ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="nav-icon"><SvgIcon name={item.icon} /></span>
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
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;