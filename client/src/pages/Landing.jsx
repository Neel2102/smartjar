import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="container">
        <div className="landing-hero">
          <h1>🏦 SmartJar 2.0</h1>
          <h2>Transform Your Gig Income into Financial Stability</h2>
          <p>
            SmartJar helps gig workers manage irregular income with our AI-powered 
            jar system, investment recommendations, and personalized financial coaching.
          </p>
          
          <div className="landing-actions">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Sign In
            </Link>
          </div>
        </div>

        <div className="landing-features">
          <h3>Why Choose SmartJar?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h4>Smart Jar System</h4>
              <p>Automatic 60/25/15 allocation for salary, emergency, and future savings</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h4>AI Financial Coach</h4>
              <p>Get personalized investment advice and financial recommendations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Advanced Analytics</h4>
              <p>Track spending patterns and monitor your financial health score</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>Investment Assistant</h4>
              <p>Smart investment recommendations based on your risk profile</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h4>Gamified Experience</h4>
              <p>Earn rewards and achievements for good financial habits</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h4>Mobile Friendly</h4>
              <p>Access your financial data anywhere, anytime</p>
            </div>
          </div>
        </div>

        <div className="landing-cta">
          <h3>Ready to Take Control of Your Finances?</h3>
          <p>Join thousands of gig workers who have achieved financial stability with SmartJar</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Start Your Journey Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
