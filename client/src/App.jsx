import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UserSetup from './pages/UserSetup';
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
      <div className="App">
        {/* Header */}
        <header className="header">
          <div className="container">
            <h1>🏦 SmartJar</h1>
            {currentUser && (
              <p style={{ 
                textAlign: 'center', 
                marginTop: '0.5rem', 
                opacity: 0.9,
                fontSize: '1rem'
              }}>
                Welcome back, {currentUser.name}! 👋
              </p>
            )}
          </div>
        </header>

        {/* Navigation */}
        {currentUser && (
          <nav className="nav">
            <div className="container">
              <ul className="nav-list">
                <li>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: '2px solid #667eea',
                      color: '#667eea',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#667eea';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#667eea';
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        )}

        {/* Main Content */}
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                currentUser ? (
                  <Dashboard userId={currentUser._id} />
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
