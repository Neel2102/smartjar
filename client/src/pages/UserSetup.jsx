import React, { useState } from 'react';
import { userAPI } from '../services/api';
import { BanknotesIcon } from '@heroicons/react/24/outline';

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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <BanknotesIcon style={{ width: 48, height: 48 }} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Signing you in...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="form-container" style={{ maxWidth: '600px' }}>
          <h2 className="form-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <BanknotesIcon style={{ width: 24, height: 24, color: '#2563eb' }} />
            Welcome to SmartJar!
          </h2>
          
          <div style={{ background: '#eff6ff', color: '#1f2937', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', textAlign: 'center', border: '1px solid #dbeafe' }}>
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
