import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import '../styles/LoginRegister.css';

const Login = ({ onUserLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
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
      <div className="auth-container">
        <div className="auth-header">
          <h1>Sign in to SmartJar</h1>
          <p>Welcome back. Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
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
            {loading ? (
              <>
                <span className="btn-loader"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="auth-footer">
            <p>
              New to SmartJar? 
              <Link to="/register" className="auth-link">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
