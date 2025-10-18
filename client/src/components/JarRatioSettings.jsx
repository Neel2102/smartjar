// import React, { useState } from 'react';
// import { userAPI } from '../services/api';

// const JarRatioSettings = ({ user, onRatiosUpdated }) => {
//   const [ratios, setRatios] = useState({
//     salary: user.jarRatios.salary,
//     emergency: user.jarRatios.emergency,
//     future: user.jarRatios.future
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const numValue = parseInt(value);
    
//     setRatios(prev => {
//       const newRatios = { ...prev, [name]: numValue };
      
//       // Auto-adjust other ratios to maintain 100% total
//       const total = Object.values(newRatios).reduce((sum, val) => sum + val, 0);
//       if (total !== 100) {
//         const remaining = 100 - numValue;
//         const otherRatios = Object.keys(newRatios).filter(key => key !== name);
        
//         if (remaining >= 0) {
//           // Distribute remaining equally among other ratios
//           const equalShare = Math.floor(remaining / otherRatios.length);
//           const remainder = remaining % otherRatios.length;
          
//           otherRatios.forEach((key, index) => {
//             newRatios[key] = equalShare + (index < remainder ? 1 : 0);
//           });
//         }
//       }
      
//       return newRatios;
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const total = Object.values(ratios).reduce((sum, val) => sum + val, 0);
//     if (total !== 100) {
//       setError('Ratios must sum to 100%');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await userAPI.updateRatios(user._id, ratios);
//       onRatiosUpdated(response.data);
//       setSuccess('Jar ratios updated successfully!');
      
//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to update ratios');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetToDefaults = () => {
//     setRatios({ salary: 60, emergency: 25, future: 15 });
//   };

//   return (
//     <div className="form-container">
//       <h2 className="form-title">Customize Jar Ratios</h2>
      
//       <div style={{ 
//         background: '#e8f5e8', 
//         color: '#2e7d32', 
//         padding: '1rem', 
//         borderRadius: '10px', 
//         marginBottom: '1.5rem',
//         textAlign: 'center'
//       }}>
//         <p style={{ margin: 0, fontSize: '0.9rem' }}>
//           <strong>💡 Tip:</strong> Adjust how your income is split between jars. 
//           Total must equal 100%.
//         </p>
//       </div>

//       {error && (
//         <div style={{ 
//           background: '#ffebee', 
//           color: '#c62828', 
//           padding: '0.75rem', 
//           borderRadius: '5px', 
//           marginBottom: '1rem' 
//         }}>
//           {error}
//         </div>
//       )}

//       {success && (
//         <div style={{ 
//           background: '#e8f5e8', 
//           color: '#2e7d32', 
//           padding: '0.75rem', 
//           borderRadius: '5px', 
//           marginBottom: '1rem' 
//         }}>
//           {success}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label className="form-label">
//             Salary Jar: {ratios.salary}%
//           </label>
//           <input
//             type="range"
//             name="salary"
//             min="0"
//             max="100"
//             value={ratios.salary}
//             onChange={handleChange}
//             style={{ width: '100%', marginTop: '0.5rem' }}
//           />
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             fontSize: '0.8rem', 
//             color: '#666',
//             marginTop: '0.25rem'
//           }}>
//             <span>0%</span>
//             <span>100%</span>
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             Emergency Jar: {ratios.emergency}%
//           </label>
//           <input
//             type="range"
//             name="emergency"
//             min="0"
//             max="100"
//             value={ratios.emergency}
//             onChange={handleChange}
//             style={{ width: '100%', marginTop: '0.5rem' }}
//           />
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             fontSize: '0.8rem', 
//             color: '#666',
//             marginTop: '0.25rem'
//           }}>
//             <span>0%</span>
//             <span>100%</span>
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="form-label">
//             Future Jar: {ratios.future}%
//           </label>
//           <input
//             type="range"
//             name="future"
//             min="0"
//             max="100"
//             value={ratios.future}
//             onChange={handleChange}
//             style={{ width: '100%', marginTop: '0.5rem' }}
//           />
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             fontSize: '0.8rem', 
//             color: '#666',
//             marginTop: '0.25rem'
//           }}>
//             <span>0%</span>
//             <span>100%</span>
//           </div>
//         </div>

//         <div style={{ 
//           background: '#f5f5f5', 
//           padding: '1rem', 
//           borderRadius: '8px', 
//           marginBottom: '1.5rem',
//           textAlign: 'center'
//         }}>
//           <strong>Total: {Object.values(ratios).reduce((sum, val) => sum + val, 0)}%</strong>
//           {Object.values(ratios).reduce((sum, val) => sum + val, 0) !== 100 && (
//             <div style={{ color: '#f57c00', fontSize: '0.9rem', marginTop: '0.5rem' }}>
//               ⚠️ Total must equal 100%
//             </div>
//           )}
//         </div>

//         <div style={{ display: 'flex', gap: '1rem' }}>
//           <button 
//             type="button" 
//             onClick={resetToDefaults}
//             style={{
//               background: 'none',
//               border: '2px solid #667eea',
//               color: '#667eea',
//               padding: '0.75rem 1rem',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontWeight: '600',
//               flex: 1
//             }}
//           >
//             Reset to Defaults
//           </button>
          
//           <button 
//             type="submit" 
//             className="btn" 
//             disabled={loading || Object.values(ratios).reduce((sum, val) => sum + val, 0) !== 100}
//             style={{ flex: 2 }}
//           >
//             {loading ? 'Updating...' : 'Update Ratios'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default JarRatioSettings;


import React, { useState } from 'react';

// Mock API for demo
const mockUserAPI = {
  updateRatios: (userId, ratios) => 
    new Promise(resolve => setTimeout(() => resolve({ data: { jarRatios: ratios } }), 1000))
};

const JarRatioSettings = ({ user, onRatiosUpdated }) => {
  const [ratios, setRatios] = useState({
    salary: user.jarRatios.salary,
    emergency: user.jarRatios.emergency,
    future: user.jarRatios.future
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    setRatios(prev => {
      const newRatios = { ...prev, [name]: numValue };
      const total = Object.values(newRatios).reduce((sum, val) => sum + val, 0);
      
      if (total !== 100) {
        const remaining = 100 - numValue;
        const otherRatios = Object.keys(newRatios).filter(key => key !== name);
        
        if (remaining >= 0) {
          const equalShare = Math.floor(remaining / otherRatios.length);
          const remainder = remaining % otherRatios.length;
          
          otherRatios.forEach((key, index) => {
            newRatios[key] = equalShare + (index < remainder ? 1 : 0);
          });
        }
      }
      
      return newRatios;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const total = Object.values(ratios).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      setError('Ratios must sum to 100%');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await mockUserAPI.updateRatios(user._id, ratios);
      onRatiosUpdated(response.data);
      setSuccess('Jar ratios updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update ratios');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setRatios({ salary: 60, emergency: 25, future: 15 });
  };

  const total = Object.values(ratios).reduce((sum, val) => sum + val, 0);
  const isValidTotal = total === 100;

  const jarConfig = {
    salary: { 
      icon: '💰', 
      color: '#667eea',
      bgColor: '#eef2ff',
      label: 'Salary Jar',
      description: 'For daily expenses and lifestyle'
    },
    emergency: { 
      icon: '🚨', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      label: 'Emergency Jar',
      description: 'Emergency fund for unexpected expenses'
    },
    future: { 
      icon: '🌟', 
      color: '#10b981',
      bgColor: '#f0fdf4',
      label: 'Future Jar',
      description: 'Long-term savings and investments'
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Info Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: 'white'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          flexShrink: 0
        }}>
          💡
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>
            Customize Your Jar Distribution
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.95 }}>
            Adjust the sliders below to set your preferred allocation. The total must equal 100%.
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#dc2626',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            !
          </div>
          <div style={{ color: '#991b1b', fontSize: '0.9375rem', fontWeight: '500' }}>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1rem',
            flexShrink: 0
          }}>
            ✓
          </div>
          <div style={{ color: '#065f46', fontSize: '0.9375rem', fontWeight: '500' }}>
            {success}
          </div>
        </div>
      )}

      {/* Jar Sliders */}
      <div style={{ marginBottom: '2rem' }}>
        {Object.entries(ratios).map(([key, value]) => {
          const config = jarConfig[key];
          return (
            <div key={key} style={{
              marginBottom: '1.75rem',
              transition: 'all 0.2s ease'
            }}>
              {/* Jar Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.875rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    background: config.bgColor,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {config.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '1.0625rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '0.125rem'
                    }}>
                      {config.label}
                    </div>
                    <div style={{
                      fontSize: '0.8125rem',
                      color: '#6b7280'
                    }}>
                      {config.description}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: config.color,
                  minWidth: '85px',
                  textAlign: 'right',
                  letterSpacing: '-0.02em'
                }}>
                  {value}%
                </div>
              </div>

              {/* Slider Container */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '2px solid #f3f4f6',
                transition: 'border-color 0.2s ease'
              }}>
                <input
                  type="range"
                  name={key}
                  min="0"
                  max="100"
                  value={value}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    outline: 'none',
                    background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#9ca3af'
                }}>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div style={{
        background: isValidTotal ? '#f0fdf4' : '#fffbeb',
        border: `2px solid ${isValidTotal ? '#bbf7d0' : '#fde68a'}`,
        borderRadius: '14px',
        padding: '1.5rem',
        marginBottom: '2rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: isValidTotal ? '#10b981' : '#f59e0b',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              {isValidTotal ? '✓' : '⚠'}
            </div>
            <div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: isValidTotal ? '#065f46' : '#92400e',
                marginBottom: '0.125rem'
              }}>
                Total Allocation
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: isValidTotal ? '#047857' : '#b45309'
              }}>
                {isValidTotal ? 'Perfect! Ready to update' : 'Adjust to reach 100%'}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: isValidTotal ? '#10b981' : '#f59e0b',
            letterSpacing: '-0.02em'
          }}>
            {total}%
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '1rem'
      }}>
        <button
          type="button"
          onClick={resetToDefaults}
          style={{
            padding: '1rem',
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            color: '#4b5563',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f9fafb';
            e.target.style.borderColor = '#667eea';
            e.target.style.color = '#667eea';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'white';
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.color = '#4b5563';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Reset to Defaults
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !isValidTotal}
          style={{
            padding: '1rem',
            background: loading || !isValidTotal 
              ? '#e5e7eb' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            color: loading || !isValidTotal ? '#9ca3af' : 'white',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: loading || !isValidTotal ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxShadow: loading || !isValidTotal 
              ? 'none' 
              : '0 4px 14px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (!loading && isValidTotal) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && isValidTotal) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
              <span style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />
              Updating Ratios...
            </span>
          ) : (
            'Update Ratios'
          )}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          border: 2px solid #e5e7eb;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
          border-color: #d1d5db;
        }

        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }

        input[type="range"]::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
          border-color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

// Demo Component
const SettingsPage = () => {
  const [user, setUser] = useState({
    _id: 'user123',
    jarRatios: { salary: 60, emergency: 25, future: 15 }
  });

  const handleRatiosUpdated = (data) => {
    setUser(prev => ({ ...prev, jarRatios: data.jarRatios }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%)',
      padding: '3rem 1rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <JarRatioSettings user={user} onRatiosUpdated={handleRatiosUpdated} />
      </div>
    </div>
  );
};

export default SettingsPage;