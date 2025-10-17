import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const Login = ({ onUserLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, we'll use a simple email-based login
      // In a real app, you'd have proper authentication
      const response = await userAPI.getAll();
      const user = response.data.find(u => u.email === formData.email);
      
      if (user) {
        onUserLogin(user);
        navigate('/dashboard');
      } else {
        setError('User not found. Please check your email or register first.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-header">
            <h1>🏦 Welcome Back to SmartJar</h1>
            <p>Sign in to continue your financial journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account? 
                <Link to="/register" className="auth-link">
                  Create one here
                </Link>
              </p>
            </div>
          </form>

          <div className="auth-features">
            <h3>Why Choose SmartJar?</h3>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <div>
                  <h4>Smart Jar System</h4>
                  <p>Automatic 60/25/15 allocation for salary, emergency, and future</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <div>
                  <h4>AI Financial Coach</h4>
                  <p>Get personalized advice for your financial goals</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div>
                  <h4>Advanced Analytics</h4>
                  <p>Track your spending patterns and financial health</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
