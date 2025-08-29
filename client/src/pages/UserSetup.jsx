import React, { useState } from 'react';
import { userAPI } from '../services/api';

const UserSetup = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await userAPI.create(formData);
      onUserCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="form-container" style={{ maxWidth: '600px' }}>
          <h2 className="form-title">Welcome to SmartJar! 🏦</h2>
          
          <div style={{ 
            background: '#e3f2fd', 
            color: '#1976d2', 
            padding: '1rem', 
            borderRadius: '10px', 
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>SmartJar helps gig workers manage income volatility</strong>
            </p>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Your income will be automatically split into 3 jars: Salary (60%), Emergency (25%), Future (15%)
            </p>
          </div>

          {error && (
            <div style={{ 
              background: '#ffebee', 
              color: '#c62828', 
              padding: '0.75rem', 
              borderRadius: '5px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Get Started with SmartJar'}
            </button>
          </form>

          <div style={{ 
            marginTop: '2rem', 
            textAlign: 'center', 
            color: '#666', 
            fontSize: '0.9rem' 
          }}>
            <p>By creating an account, you agree to our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;
