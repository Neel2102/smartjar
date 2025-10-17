import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserSetup from './pages/UserSetup';
import { userAPI } from './services/api';
import './styles/App.css';
import { BanknotesIcon } from '@heroicons/react/24/outline';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [introSplash, setIntroSplash] = useState(false);
  const [splashFade, setSplashFade] = useState(false);
  const [splashName, setSplashName] = useState('');

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

  const handleUserCreated = (user) => {
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <BanknotesIcon style={{ width: 48, height: 48, color: '#2563eb' }} />
          </div>
          <div>Loading SmartJar...</div>
        </div>
      </div>
    );
  }

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
        

        {/* Main Content */}
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                currentUser ? (
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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
