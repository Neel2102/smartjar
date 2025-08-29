import React, { useState } from 'react';
import { userAPI } from '../services/api';

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
      
      // Auto-adjust other ratios to maintain 100% total
      const total = Object.values(newRatios).reduce((sum, val) => sum + val, 0);
      if (total !== 100) {
        const remaining = 100 - numValue;
        const otherRatios = Object.keys(newRatios).filter(key => key !== name);
        
        if (remaining >= 0) {
          // Distribute remaining equally among other ratios
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
      const response = await userAPI.updateRatios(user._id, ratios);
      onRatiosUpdated(response.data);
      setSuccess('Jar ratios updated successfully!');
      
      // Clear success message after 3 seconds
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

  return (
    <div className="form-container">
      <h2 className="form-title">Customize Jar Ratios</h2>
      
      <div style={{ 
        background: '#e8f5e8', 
        color: '#2e7d32', 
        padding: '1rem', 
        borderRadius: '10px', 
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>💡 Tip:</strong> Adjust how your income is split between jars. 
          Total must equal 100%.
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

      {success && (
        <div style={{ 
          background: '#e8f5e8', 
          color: '#2e7d32', 
          padding: '0.75rem', 
          borderRadius: '5px', 
          marginBottom: '1rem' 
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Salary Jar: {ratios.salary}%
          </label>
          <input
            type="range"
            name="salary"
            min="0"
            max="100"
            value={ratios.salary}
            onChange={handleChange}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.8rem', 
            color: '#666',
            marginTop: '0.25rem'
          }}>
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Emergency Jar: {ratios.emergency}%
          </label>
          <input
            type="range"
            name="emergency"
            min="0"
            max="100"
            value={ratios.emergency}
            onChange={handleChange}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.8rem', 
            color: '#666',
            marginTop: '0.25rem'
          }}>
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Future Jar: {ratios.future}%
          </label>
          <input
            type="range"
            name="future"
            min="0"
            max="100"
            value={ratios.future}
            onChange={handleChange}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.8rem', 
            color: '#666',
            marginTop: '0.25rem'
          }}>
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <strong>Total: {Object.values(ratios).reduce((sum, val) => sum + val, 0)}%</strong>
          {Object.values(ratios).reduce((sum, val) => sum + val, 0) !== 100 && (
            <div style={{ color: '#f57c00', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              ⚠️ Total must equal 100%
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="button" 
            onClick={resetToDefaults}
            style={{
              background: 'none',
              border: '2px solid #667eea',
              color: '#667eea',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              flex: 1
            }}
          >
            Reset to Defaults
          </button>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={loading || Object.values(ratios).reduce((sum, val) => sum + val, 0) !== 100}
            style={{ flex: 2 }}
          >
            {loading ? 'Updating...' : 'Update Ratios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JarRatioSettings;
