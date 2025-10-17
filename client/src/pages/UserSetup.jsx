import React, { useState } from 'react';
import { userAPI } from '../services/api';
<<<<<<< HEAD
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
=======
import EnhancedOnboarding from '../components/EnhancedOnboarding';

const UserSetup = ({ onUserCreated }) => {
  const [showEnhancedOnboarding, setShowEnhancedOnboarding] = useState(false);
  const [basicUser, setBasicUser] = useState(null);

  const handleBasicUserCreated = (user) => {
    setBasicUser(user);
    setShowEnhancedOnboarding(true);
  };

  const handleEnhancedOnboardingComplete = (updatedUser) => {
    onUserCreated(updatedUser);
  };

  if (showEnhancedOnboarding && basicUser) {
    return (
      <EnhancedOnboarding 
        user={basicUser} 
        onOnboardingComplete={handleEnhancedOnboardingComplete} 
      />
>>>>>>> origin/main
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="user-setup">
      <div className="container">
        <div className="setup-header">
          <h1>🏦 Welcome to SmartJar 2.0</h1>
          <p>Your journey to financial stability starts here</p>
        </div>

        <div className="setup-content">
          <div className="setup-intro">
            <h2>🎯 What is SmartJar 2.0?</h2>
            <p>
              SmartJar transforms your irregular gig income into consistent monthly salary payouts. 
              Our AI-powered system helps you build emergency funds, invest smartly, and achieve 
              financial stability.
            </p>
            
            <div className="features-preview">
              <div className="feature-item">
                <span className="feature-icon">💰</span>
                <div>
                  <h4>Salary-Like System</h4>
                  <p>Get consistent monthly payouts after 90 days</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤖</span>
                <div>
                  <h4>AI Financial Coach</h4>
                  <p>Personalized advice based on your profile</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div>
                  <h4>Investment Assistant</h4>
                  <p>Smart investment recommendations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="setup-form">
            <h2>🚀 Let's Get Started</h2>
            <p>Create your basic profile to begin the enhanced onboarding process</p>
            
            <BasicUserForm onUserCreated={handleBasicUserCreated} />
>>>>>>> origin/main
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
=======
const BasicUserForm = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userAPI.create(formData);
      onUserCreated(response.data);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to create user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="basic-user-form">
      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

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
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData('phone', e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">City/Location</label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => updateFormData('location', e.target.value)}
          placeholder="Enter your city"
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={loading || !formData.name || !formData.email}
      >
        {loading ? 'Creating Profile...' : 'Continue to Enhanced Setup'}
      </button>

      <div className="form-note">
        <small>
          * Required fields. We'll collect more detailed information in the next step 
          to provide you with personalized financial recommendations.
        </small>
      </div>
    </form>
  );
};

>>>>>>> origin/main
export default UserSetup;
