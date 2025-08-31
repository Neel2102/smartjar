import React, { useState } from 'react';
import { userAPI } from '../services/api';
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
    );
  }

  return (
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
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default UserSetup;
