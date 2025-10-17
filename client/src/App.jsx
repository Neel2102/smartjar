import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserSetup from './pages/UserSetup';
<<<<<<< HEAD
import { userAPI } from './services/api';
import './styles/App.css';
import { BanknotesIcon } from '@heroicons/react/24/outline';
=======
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import AnalyticsPage from './pages/Analytics';
import EducationPage from './pages/Education';
import SettingsPage from './pages/Settings';
import ImportPage from './pages/Import';
import GamificationPage from './pages/Gamification';
import ToolsPage from './pages/Tools';
import SalaryPage from './pages/Salary';
import InvestmentPage from './pages/Investment';
import AIChatPage from './pages/AIChat';
import PaymentPage from './pages/Payment';
import Navigation from './components/Navigation';
import { AppProvider } from './context/AppContext';
import { userAPI } from './services/api';
import './styles/App.css';
>>>>>>> origin/main

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [introSplash, setIntroSplash] = useState(false);
  const [splashFade, setSplashFade] = useState(false);
  const [splashName, setSplashName] = useState('');
=======
>>>>>>> origin/main

  useEffect(() => {
    // Check if there's a stored user ID
    const storedUserId = localStorage.getItem('smartjar_user_id');
    if (storedUserId) {
      // Verify user exists
      userAPI.getAll()
        .then(response => {
          const user = response.data.find(u => u._id === storedUserId);
          if (user) {
            setCurrentUser(user);
          }
        })
        .catch(err => {
          console.error('Error fetching users:', err);
          localStorage.removeItem('smartjar_user_id');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (!loading && !currentUser) {
      setIntroSplash(true);
      setSplashFade(false);
      setSplashName('');
      const name = 'SmartJar';
      let i = 0;
      const typeTimer = setInterval(() => {
        i += 1;
        setSplashName(name.slice(0, i));
        if (i >= name.length) clearInterval(typeTimer);
      }, 90);
      const fadeTimer = setTimeout(() => setSplashFade(true), 2500);
      const hideTimer = setTimeout(() => setIntroSplash(false), 3000);
      return () => {
        clearInterval(typeTimer);
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [loading, currentUser]);
=======
>>>>>>> origin/main

  const handleUserCreated = (user) => {
    setCurrentUser(user);
    localStorage.setItem('smartjar_user_id', user._id);
  };

<<<<<<< HEAD
=======
  const handleUserLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('smartjar_user_id', user._id);
  };

>>>>>>> origin/main
  const handleUserUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartjar_user_id');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
<<<<<<< HEAD
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <BanknotesIcon style={{ width: 48, height: 48, color: '#2563eb' }} />
          </div>
=======
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
>>>>>>> origin/main
          <div>Loading SmartJar...</div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  if (introSplash && !currentUser) {
    return (
      <div className={`splash ${splashFade ? 'splash--fadeout' : ''}`}>
        <div className="splash__container">
          <div className="splash-logo">
            <BanknotesIcon style={{ width: 160, height: 160 }} />
          </div>
          <div className="splash-name">{splashName}</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        
=======
  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-row">
              <h1>🏦 SmartJar</h1>
            </div>
            {currentUser ? (
              <p className="header-subtitle">
                Welcome back, {currentUser.name}! 👋
              </p>
            ) : (
              <p className="header-subtitle">
                Your Financial Stability Partner
              </p>
            )}
          </div>
        </header>

        {/* Navigation */}
        {currentUser && (
          <Navigation onLogout={handleLogout} />
        )}
>>>>>>> origin/main

        {/* Main Content */}
        <main>
          <Routes>
<<<<<<< HEAD
=======
            {/* Public Routes */}
>>>>>>> origin/main
            <Route 
              path="/" 
              element={
                currentUser ? (
<<<<<<< HEAD
                  <Dashboard 
                    userId={currentUser._id} 
                    user={currentUser}
                    onUserUpdated={handleUserUpdated}
                    onLogout={handleLogout}
                  />
                ) : (
                  <UserSetup onUserCreated={handleUserCreated} />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
=======
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Landing />
                )
              } 
            />
            <Route 
              path="/login" 
              element={
                currentUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onUserLogin={handleUserLogin} />
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                currentUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Register onUserCreated={handleUserCreated} />
                )
              } 
            />
            
            {/* Protected Routes */}
            {currentUser ? (
              <Route path="*" element={
                <AppProvider userId={currentUser._id}>
                  <Routes>
                    <Route 
                      path="/dashboard" 
                      element={
                        <Dashboard 
                          userId={currentUser._id} 
                          user={currentUser}
                          onUserUpdated={handleUserUpdated}
                        />
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={<AnalyticsPage />} 
                    />
                    <Route 
                      path="/education" 
                      element={<EducationPage />} 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <SettingsPage 
                          user={currentUser}
                          onRatiosUpdated={handleUserUpdated}
                        />
                      } 
                    />
                    <Route 
                      path="/import" 
                      element={<ImportPage />} 
                    />
                    <Route 
                      path="/gamification" 
                      element={<GamificationPage user={currentUser} />} 
                    />
                    <Route 
                      path="/tools" 
                      element={<ToolsPage />} 
                    />
                    <Route 
                      path="/salary" 
                      element={
                        <SalaryPage 
                          userId={currentUser._id}
                          user={currentUser}
                        />
                      } 
                    />
                    <Route 
                      path="/investment" 
                      element={<InvestmentPage user={currentUser} />} 
                    />
                    <Route 
                      path="/ai-chat" 
                      element={<AIChatPage user={currentUser} />} 
                    />
                    <Route 
                      path="/payment" 
                      element={<PaymentPage />} 
                    />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppProvider>
              } />
            ) : (
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            )}
>>>>>>> origin/main
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
