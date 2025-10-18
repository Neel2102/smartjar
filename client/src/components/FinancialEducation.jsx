// import React, { useState } from 'react';

// const FinancialEducation = () => {
//   const [activeTab, setActiveTab] = useState('tips');

//   const educationContent = {
//     tips: [
//       {
//         title: "Emergency Fund Rule",
//         content: "Aim to save 3-6 months of your average monthly income in your Emergency Jar. This helps during lean weeks or unexpected expenses.",
//         icon: "🆘",
//         category: "Savings"
//       },
//       {
//         title: "50/30/20 Budget Rule",
//         content: "50% for needs (rent, food, fuel), 30% for wants (entertainment, dining out), 20% for savings and debt repayment.",
//         icon: "📊",
//         category: "Budgeting"
//       },
//       {
//         title: "Income Smoothing",
//         content: "Use your Emergency Jar during low-income weeks to maintain consistent spending. Replenish it during high-income weeks.",
//         icon: "⚖️",
//         category: "Income Management"
//       },
//       {
//         title: "Future Jar Strategy",
//         content: "Consider investing your Future Jar money in mutual funds, fixed deposits, or government schemes for better returns than savings accounts.",
//         icon: "🚀",
//         category: "Investing"
//       },
//       {
//         title: "Track Every Rupee",
//         content: "Record all your income, no matter how small. Even ₹100 daily adds up to ₹3,000 monthly in your Future Jar.",
//         icon: "💰",
//         category: "Tracking"
//       }
//     ],
//     insurance: [
//       {
//         title: "Health Insurance",
//         content: "Essential for gig workers. Look for policies covering hospitalization, pre-existing conditions, and ambulance charges. Premiums are tax-deductible.",
//         icon: "🏥",
//         category: "Health"
//       },
//       {
//         title: "Personal Accident Insurance",
//         content: "Covers accidents during work. Important for delivery riders and drivers. Low premium, high coverage.",
//         icon: "🛡️",
//         category: "Accident"
//       },
//       {
//         title: "Vehicle Insurance",
//         content: "Third-party insurance is mandatory. Comprehensive coverage recommended for better protection.",
//         icon: "🚗",
//         category: "Vehicle"
//       },
//       {
//         title: "Term Life Insurance",
//         content: "Protect your family's future. Start with 10-15 times your annual income as coverage amount.",
//         icon: "👨‍👩‍👧‍👦",
//         category: "Life"
//       }
//     ],
//     investments: [
//       {
//         title: "Public Provident Fund (PPF)",
//         content: "Government-backed, tax-free returns around 7-8%. 15-year lock-in period. Perfect for long-term savings.",
//         icon: "🏛️",
//         category: "Government"
//       },
//       {
//         title: "Mutual Funds",
//         content: "Start with SIP (Systematic Investment Plan) in index funds. Low risk, good returns over 5+ years.",
//         icon: "📈",
//         category: "Equity"
//       },
//       {
//         title: "Fixed Deposits",
//         content: "Safe option for emergency funds. Current rates 6-7%. Choose banks with good ratings.",
//         icon: "🏦",
//         category: "Fixed Income"
//       },
//       {
//         title: "National Pension System (NPS)",
//         content: "Retirement-focused investment. Tax benefits and market-linked returns. Start early for compound growth.",
//         icon: "👴",
//         category: "Retirement"
//       }
//     ],
//     gigWork: [
//       {
//         title: "Multiple Income Streams",
//         content: "Don't rely on one platform. Join multiple delivery/ride apps to maximize earnings and reduce dependency.",
//         icon: "🔄",
//         category: "Strategy"
//       },
//       {
//         title: "Peak Hour Optimization",
//         content: "Work during high-demand hours (lunch/dinner time for food delivery, office hours for rides) for better earnings.",
//         icon: "⏰",
//         category: "Timing"
//       },
//       {
//         title: "Expense Tracking",
//         content: "Track fuel, maintenance, and other work-related expenses. These are tax-deductible business expenses.",
//         icon: "📝",
//         category: "Taxes"
//       },
//       {
//         title: "Skill Development",
//         content: "Learn new skills (bike repair, customer service) to increase your value and earning potential.",
//         icon: "🎓",
//         category: "Growth"
//       }
//     ]
//   };

//   const renderContent = (content) => {
//     return content.map((item, index) => (
//       <div key={index} style={{
//         background: 'white',
//         padding: '1.5rem',
//         borderRadius: '10px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//         marginBottom: '1rem'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
//           <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{item.icon}</span>
//           <div>
//             <h4 style={{ margin: 0, color: '#333' }}>{item.title}</h4>
//             <span style={{
//               background: '#e3f2fd',
//               color: '#1976d2',
//               padding: '0.25rem 0.75rem',
//               borderRadius: '20px',
//               fontSize: '0.8rem',
//               fontWeight: '500'
//             }}>
//               {item.category}
//             </span>
//           </div>
//         </div>
//         <p style={{ margin: 0, color: '#666', lineHeight: '1.6' }}>
//           {item.content}
//         </p>
//       </div>
//     ));
//   };

//   return (
//     <div className="dashboard">
//       <div className="container">

//         {/* Tab Navigation */}
//         <div style={{
//           display: 'flex',
//           justifyContent: 'center',
//           marginBottom: '2rem',
//           flexWrap: 'wrap',
//           gap: '0.5rem'
//         }}>
//           {Object.keys(educationContent).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               style={{
//                 background: activeTab === tab ? '#667eea' : 'white',
//                 color: activeTab === tab ? 'white' : '#667eea',
//                 border: '2px solid #667eea',
//                 padding: '0.75rem 1.5rem',
//                 borderRadius: '25px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 transition: 'all 0.3s ease',
//                 textTransform: 'capitalize'
//               }}
//             >
//               {tab === 'tips' && '💡 Tips'}
//               {tab === 'insurance' && '🛡️ Insurance'}
//               {tab === 'investments' && '📈 Investments'}
//               {tab === 'gigWork' && '🚀 Gig Work'}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div style={{ maxWidth: '800px', margin: '0 auto' }}>
//           {renderContent(educationContent[activeTab])}
//         </div>

//         {/* Additional Resources */}
//         <div style={{
//           background: 'white',
//           padding: '2rem',
//           borderRadius: '15px',
//           boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
//           marginTop: '2rem',
//           textAlign: 'center'
//         }}>
//           <h3 style={{ marginBottom: '1rem', color: '#333' }}>
//             📚 Additional Resources
//           </h3>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//             gap: '1rem',
//             marginTop: '1rem'
//           }}>
//             <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" style={{
//               background: '#e3f2fd',
//               color: '#1976d2',
//               padding: '1rem',
//               borderRadius: '8px',
//               textDecoration: 'none',
//               fontWeight: '500',
//               transition: 'transform 0.3s ease'
//             }}>
//               🏛️ RBI Resources
//             </a>
//             <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{
//               background: '#e8f5e8',
//               color: '#2e7d32',
//               padding: '1rem',
//               borderRadius: '8px',
//               textDecoration: 'none',
//               fontWeight: '500',
//               transition: 'transform 0.3s ease'
//             }}>
//               📊 SEBI Guidelines
//             </a>
//             <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" style={{
//               background: '#fff3e0',
//               color: '#f57c00',
//               padding: '1rem',
//               borderRadius: '8px',
//               textDecoration: 'none',
//               fontWeight: '500',
//               transition: 'transform 0.3s ease'
//             }}>
//               💰 Tax Information
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FinancialEducation;

import React, { useState } from 'react';

const FinancialEducation = () => {
  const [activeTab, setActiveTab] = useState('tips');
  const [hoveredCard, setHoveredCard] = useState(null);

  const educationContent = {
    tips: [
      {
        title: "Emergency Fund Rule",
        content: "Aim to save 3-6 months of your average monthly income in your Emergency Jar. This helps during lean weeks or unexpected expenses.",
        icon: "1",
        category: "Savings"
      },
      {
        title: "50/30/20 Budget Rule",
        content: "50% for needs (rent, food, fuel), 30% for wants (entertainment, dining out), 20% for savings and debt repayment.",
        icon: "2",
        category: "Budgeting"
      },
      {
        title: "Income Smoothing",
        content: "Use your Emergency Jar during low-income weeks to maintain consistent spending. Replenish it during high-income weeks.",
        icon: "3",
        category: "Income Management"
      },
      {
        title: "Future Jar Strategy",
        content: "Consider investing your Future Jar money in mutual funds, fixed deposits, or government schemes for better returns than savings accounts.",
        icon: "4",
        category: "Investing"
      },
      {
        title: "Track Every Rupee",
        content: "Record all your income, no matter how small. Even ₹100 daily adds up to ₹3,000 monthly in your Future Jar.",
        icon: "5",
        category: "Tracking"
      }
    ],
    insurance: [
      {
        title: "Health Insurance",
        content: "Essential for gig workers. Look for policies covering hospitalization, pre-existing conditions, and ambulance charges. Premiums are tax-deductible.",
        icon: "H",
        category: "Health"
      },
      {
        title: "Personal Accident Insurance",
        content: "Covers accidents during work. Important for delivery riders and drivers. Low premium, high coverage.",
        icon: "A",
        category: "Accident"
      },
      {
        title: "Vehicle Insurance",
        content: "Third-party insurance is mandatory. Comprehensive coverage recommended for better protection.",
        icon: "V",
        category: "Vehicle"
      },
      {
        title: "Term Life Insurance",
        content: "Protect your family's future. Start with 10-15 times your annual income as coverage amount.",
        icon: "L",
        category: "Life"
      }
    ],
    investments: [
      {
        title: "Public Provident Fund (PPF)",
        content: "Government-backed, tax-free returns around 7-8%. 15-year lock-in period. Perfect for long-term savings.",
        icon: "P",
        category: "Government"
      },
      {
        title: "Mutual Funds",
        content: "Start with SIP (Systematic Investment Plan) in index funds. Low risk, good returns over 5+ years.",
        icon: "M",
        category: "Equity"
      },
      {
        title: "Fixed Deposits",
        content: "Safe option for emergency funds. Current rates 6-7%. Choose banks with good ratings.",
        icon: "F",
        category: "Fixed Income"
      },
      {
        title: "National Pension System (NPS)",
        content: "Retirement-focused investment. Tax benefits and market-linked returns. Start early for compound growth.",
        icon: "N",
        category: "Retirement"
      }
    ],
    gigWork: [
      {
        title: "Multiple Income Streams",
        content: "Don't rely on one platform. Join multiple delivery/ride apps to maximize earnings and reduce dependency.",
        icon: "$",
        category: "Strategy"
      },
      {
        title: "Peak Hour Optimization",
        content: "Work during high-demand hours (lunch/dinner time for food delivery, office hours for rides) for better earnings.",
        icon: "⏱",
        category: "Timing"
      },
      {
        title: "Expense Tracking",
        content: "Track fuel, maintenance, and other work-related expenses. These are tax-deductible business expenses.",
        icon: "📊",
        category: "Taxes"
      },
      {
        title: "Skill Development",
        content: "Learn new skills (bike repair, customer service) to increase your value and earning potential.",
        icon: "★",
        category: "Growth"
      }
    ]
  };

  const tabConfig = {
    tips: { label: 'Tips', icon: '💡' },
    insurance: { label: 'Insurance', icon: '🛡️' },
    investments: { label: 'Investments', icon: '📈' },
    gigWork: { label: 'Gig Work', icon: '🚀' }
  };

  const renderContent = (content) => {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '0.875rem'
      }}>
        {content.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              background: 'white',
              padding: '1.125rem',
              borderRadius: '10px',
              border: '1px solid #E5E7EB',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: hoveredCard === index 
                ? '0 6px 16px rgba(37, 99, 235, 0.08)' 
                : '0 1px 4px rgba(0, 0, 0, 0.04)',
              transform: hoveredCard === index ? 'translateY(-2px)' : 'translateY(0)',
              borderColor: hoveredCard === index ? '#DBEAFE' : '#E5E7EB'
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                {item.icon}
              </div>
            </div>
            
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#1F2937', 
              fontSize: '0.9rem', 
              fontWeight: '700',
              lineHeight: '1.4'
            }}>
              {item.title}
            </h4>
            
            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                color: '#0284C7',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.6rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
                border: '1px solid #BAE6FD',
                letterSpacing: '0.3px'
              }}
            >
              {item.category}
            </span>
            
            <p style={{ 
              margin: 0, 
              color: '#6B7280', 
              lineHeight: '1.5', 
              fontSize: '0.8rem',
              fontWeight: '400'
            }}>
              {item.content}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', padding: '1rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Tab Navigation */}
        <div style={{
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F0F4F8 100%)',
          padding: '0.5rem',
          borderRadius: '8px',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          border: '1px solid #E5E7EB'
        }}>
          {Object.keys(educationContent).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab 
                  ? 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)'
                  : 'white',
                color: activeTab === tab ? 'white' : '#6B7280',
                border: '1px solid ' + (activeTab === tab ? 'transparent' : '#E5E7EB'),
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.8rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: activeTab === tab 
                  ? '0 2px 6px rgba(37, 99, 235, 0.2)' 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.background = '#F3F4F6';
                  e.target.style.color = '#1F2937';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.background = 'white';
                  e.target.style.color = '#6B7280';
                }
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{tabConfig[tab].icon}</span>
              {tabConfig[tab].label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div style={{ marginBottom: '1.5rem' }}>
          {renderContent(educationContent[activeTab])}
        </div>

        {/* Additional Resources Section */}
        <div style={{
          background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
          padding: '1.25rem',
          borderRadius: '10px',
          border: '1px solid #BAE6FD'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ 
              margin: '0', 
              color: '#1E40AF', 
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '-0.1px'
            }}>
              Explore Official Resources
            </h3>
            <p style={{
              margin: '0.5rem 0 0 0',
              color: '#0284C7',
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              Access trusted government and regulatory websites
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}>
            {[
              { name: 'RBI Resources', url: 'https://www.rbi.org.in', bgColor: '#EFF6FF', borderColor: '#BFDBFE', textColor: '#1E40AF', accentColor: '#2563EB' },
              { name: 'SEBI Guidelines', url: 'https://www.sebi.gov.in', bgColor: '#ECFDF5', borderColor: '#86EFAC', textColor: '#15803D', accentColor: '#16A34A' },
              { name: 'Tax Information', url: 'https://www.incometax.gov.in', bgColor: '#FEF3C7', borderColor: '#FCD34D', textColor: '#92400E', accentColor: '#D97706' }
            ].map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: resource.bgColor,
                  color: resource.textColor,
                  padding: '0.875rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  border: `1px solid ${resource.borderColor}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textAlign: 'center',
                  display: 'block',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px rgba(${resource.accentColor === '#2563EB' ? '37, 99, 235' : resource.accentColor === '#16A34A' ? '22, 163, 74' : '217, 119, 6'}, 0.2)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {resource.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialEducation;