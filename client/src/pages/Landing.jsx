import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-icon" aria-hidden="true">SJ</div>
          <h1 className="hero-title">SmartJar</h1>
          <h2 className="hero-subtitle">Financial stability for every gig worker</h2>
          <p className="hero-description">
            Manage irregular income with automated jars, clear analytics, and an AI coach that keeps you on track.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h3 className="features-title">Why choose SmartJar?</h3>
          <div className="title-underline" />
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue-gradient">💼</div>
            <div className="feature-title">Smart Jar System</div>
            <div className="feature-description">Automatic 60/25/15 split for Salary, Emergency, and Future goals.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple-gradient">🤖</div>
            <div className="feature-title">AI Financial Coach</div>
            <div className="feature-description">Context-aware guidance, nudges, and quick actions tailored to you.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon indigo-gradient">📊</div>
            <div className="feature-title">Clear Analytics</div>
            <div className="feature-description">Understand trends, track progress, and celebrate milestones.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon blue-gradient">🎯</div>
            <div className="feature-title">Goal-first Planning</div>
            <div className="feature-description">Define targets; SmartJar helps you reach them steadily.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple-gradient">🏅</div>
            <div className="feature-title">Motivating Rewards</div>
            <div className="feature-description">Badges and streaks designed to keep you consistent.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon indigo-gradient">📱</div>
            <div className="feature-title">Anytime, Anywhere</div>
            <div className="feature-description">Mobile-friendly experience for quick updates on the go.</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h3 className="cta-title">Ready to take control of your money?</h3>
          <p className="cta-description">Join thousands of riders and freelancers building safety and future—one jar at a time.</p>
          <Link to="/register" className="btn btn-cta">Start your journey</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} SmartJar. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;