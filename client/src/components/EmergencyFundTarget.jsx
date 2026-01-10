import React, { useState } from 'react';
import { userAPI } from '../services/api';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../utils/formatters';

const EmergencyFundTarget = ({ user, onUpdated }) => {
  const [emergencyGoal, setEmergencyGoal] = useState(user?.emergencyGoal || user?.emergencyFundTarget || 10000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emergencyGoal || emergencyGoal < 1000) {
      setError('Emergency Goal must be at least ₹1,000');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateEmergencyGoal(user._id, emergencyGoal);
      if (onUpdated && response.data) {
        // Merge the updated emergencyGoal with existing user data
        const updatedGoal = response.data.user?.emergencyGoal || response.data.emergencyGoal || emergencyGoal;
        onUpdated({ ...user, emergencyGoal: updatedGoal });
      }
      setSuccess('Emergency Target Updated Successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update emergency goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
      maxWidth: '900px',
      margin: '0 auto 2rem',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <ShieldCheckIcon style={{ width: 24, height: 24 }} />
        </div>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.25rem'
          }}>
            Emergency Fund Target
          </h3>
          <p style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            Set your emergency fund goal to unlock investment recommendations
          </p>
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.9375rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.75rem'
          }}>
            Emergency Goal (₹)
          </label>
          <input
            type="number"
            value={emergencyGoal}
            onChange={(e) => setEmergencyGoal(parseInt(e.target.value) || 0)}
            min="1000"
            step="1000"
            required
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              background: '#ffffff',
              color: '#1f2937',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
            placeholder="Enter amount (minimum ₹1,000)"
          />
          <div style={{
            fontSize: '0.8125rem',
            color: '#6b7280',
            marginTop: '0.5rem'
          }}>
            💡 Recommended: 3-6 months of monthly expenses
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: loading 
              ? '#e5e7eb' 
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            borderRadius: '12px',
            color: loading ? '#9ca3af' : 'white',
            fontSize: '0.9375rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            outline: 'none',
            boxShadow: loading 
              ? 'none' 
              : '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px rgba(245, 158, 11, 0.4)';
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
              Saving...
            </span>
          ) : (
            'Save Emergency Target'
          )}
        </button>
      </form>

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
      `}</style>
    </div>
  );
};

export default EmergencyFundTarget;
