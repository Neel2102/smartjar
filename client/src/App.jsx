import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserSetup from './pages/UserSetup';
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

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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


  const handleUserCreated = (user) => {
    setCurrentUser(user);
    localStorage.setItem('smartjar_user_id', user._id);
  };

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('smartjar_user_id', user._id);
  };

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
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
          <div>Loading SmartJar...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App with-sidebar">
        {/* Header */}
        {/* <header className="header">
          <div className="container">
            <div className="header-row">
              {/* <h1>🏦 SmartJar</h1> */}
            {/* </div>
            {currentUser ? (
              <p className="header-subtitle">
                Welcome back, {currentUser.name}! 👋
              </p>
            ) : (
              <p className="header-subtitle"> */}
                {/* Your Financial Stability Partner */}
              {/* </p>
            )}
          </div>
        </header> */} 
        {/* */} 

        {/* Navigation */}
        {currentUser && (
          <Navigation onLogout={handleLogout} />
        )}

        {/* Main Content */}
        <main className={!currentUser ? 'landing-main' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                currentUser ? (
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
                      element={<AnalyticsPage user={currentUser} />} 
                    />
                    <Route 
                      path="/education" 
                      element={<EducationPage user={currentUser} />} 
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
                      element={<ImportPage user={currentUser} />} 
                    />
                    <Route 
                      path="/gamification" 
                      element={<GamificationPage user={currentUser} />} 
                    />
                    <Route 
                      path="/tools" 
                      element={<ToolsPage user={currentUser} />} 
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
                      element={<PaymentPage user={currentUser} />} 
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
