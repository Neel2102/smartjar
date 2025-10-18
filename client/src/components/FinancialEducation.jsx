import React, { useState } from 'react';

const FinancialEducation = () => {
  const [activeTab, setActiveTab] = useState('tips');

  const educationContent = {
    tips: [
      {
        title: "Emergency Fund Rule",
        content: "Aim to save 3-6 months of your average monthly income in your Emergency Jar. This helps during lean weeks or unexpected expenses.",
        icon: "🆘",
        category: "Savings"
      },
      {
        title: "50/30/20 Budget Rule",
        content: "50% for needs (rent, food, fuel), 30% for wants (entertainment, dining out), 20% for savings and debt repayment.",
        icon: "📊",
        category: "Budgeting"
      },
      {
        title: "Income Smoothing",
        content: "Use your Emergency Jar during low-income weeks to maintain consistent spending. Replenish it during high-income weeks.",
        icon: "⚖️",
        category: "Income Management"
      },
      {
        title: "Future Jar Strategy",
        content: "Consider investing your Future Jar money in mutual funds, fixed deposits, or government schemes for better returns than savings accounts.",
        icon: "🚀",
        category: "Investing"
      },
      {
        title: "Track Every Rupee",
        content: "Record all your income, no matter how small. Even ₹100 daily adds up to ₹3,000 monthly in your Future Jar.",
        icon: "💰",
        category: "Tracking"
      }
    ],
    insurance: [
      {
        title: "Health Insurance",
        content: "Essential for gig workers. Look for policies covering hospitalization, pre-existing conditions, and ambulance charges. Premiums are tax-deductible.",
        icon: "🏥",
        category: "Health"
      },
      {
        title: "Personal Accident Insurance",
        content: "Covers accidents during work. Important for delivery riders and drivers. Low premium, high coverage.",
        icon: "🛡️",
        category: "Accident"
      },
      {
        title: "Vehicle Insurance",
        content: "Third-party insurance is mandatory. Comprehensive coverage recommended for better protection.",
        icon: "🚗",
        category: "Vehicle"
      },
      {
        title: "Term Life Insurance",
        content: "Protect your family's future. Start with 10-15 times your annual income as coverage amount.",
        icon: "👨‍👩‍👧‍👦",
        category: "Life"
      }
    ],
    investments: [
      {
        title: "Public Provident Fund (PPF)",
        content: "Government-backed, tax-free returns around 7-8%. 15-year lock-in period. Perfect for long-term savings.",
        icon: "🏛️",
        category: "Government"
      },
      {
        title: "Mutual Funds",
        content: "Start with SIP (Systematic Investment Plan) in index funds. Low risk, good returns over 5+ years.",
        icon: "📈",
        category: "Equity"
      },
      {
        title: "Fixed Deposits",
        content: "Safe option for emergency funds. Current rates 6-7%. Choose banks with good ratings.",
        icon: "🏦",
        category: "Fixed Income"
      },
      {
        title: "National Pension System (NPS)",
        content: "Retirement-focused investment. Tax benefits and market-linked returns. Start early for compound growth.",
        icon: "👴",
        category: "Retirement"
      }
    ],
    gigWork: [
      {
        title: "Multiple Income Streams",
        content: "Don't rely on one platform. Join multiple delivery/ride apps to maximize earnings and reduce dependency.",
        icon: "🔄",
        category: "Strategy"
      },
      {
        title: "Peak Hour Optimization",
        content: "Work during high-demand hours (lunch/dinner time for food delivery, office hours for rides) for better earnings.",
        icon: "⏰",
        category: "Timing"
      },
      {
        title: "Expense Tracking",
        content: "Track fuel, maintenance, and other work-related expenses. These are tax-deductible business expenses.",
        icon: "📝",
        category: "Taxes"
      },
      {
        title: "Skill Development",
        content: "Learn new skills (bike repair, customer service) to increase your value and earning potential.",
        icon: "🎓",
        category: "Growth"
      }
    ]
  };

  const renderContent = (content) => {
    return content.map((item, index) => (
      <div key={index} style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{item.icon}</span>
          <div>
            <h4 style={{ margin: 0, color: '#333' }}>{item.title}</h4>
            <span style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              {item.category}
            </span>
          </div>
        </div>
        <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
          {item.content}
        </p>
      </div>
    ));
  };

  return (
    <div className="dashboard">
      <div className="container">

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {Object.keys(educationContent).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#667eea' : 'white',
                color: activeTab === tab ? 'white' : '#667eea',
                border: '2px solid #667eea',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {tab === 'tips' && '💡 Tips'}
              {tab === 'insurance' && '🛡️ Insurance'}
              {tab === 'investments' && '📈 Investments'}
              {tab === 'gigWork' && '🚀 Gig Work'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {renderContent(educationContent[activeTab])}
        </div>

        {/* Additional Resources */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>
            📚 Additional Resources
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'transform 0.3s ease'
            }}>
              🏛️ RBI Resources
            </a>
            <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{
              background: '#e8f5e8',
              color: '#2e7d32',
              padding: '1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'transform 0.3s ease'
            }}>
              📊 SEBI Guidelines
            </a>
            <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" style={{
              background: '#fff3e0',
              color: '#f57c00',
              padding: '1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'transform 0.3s ease'
            }}>
              💰 Tax Information
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialEducation;
