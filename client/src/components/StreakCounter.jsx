import React, { useState, useEffect } from 'react';
import { financeAPI } from '../services/api';

const StreakCounter = ({ userId }) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      fetchStreakData();
    }
  }, [userId]);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      console.log('Fetching streak data for userId:', userId);
      const response = await financeAPI.getHeatmapLayout(userId);
      console.log('Streak API response:', response);
      setStreakData(response.data.stats);
    } catch (err) {
      console.error('Error fetching streak data:', err);
      setError('Failed to load streak data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1rem',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e1e4e8',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ color: '#666', fontSize: '0.875rem' }}>
          Loading streak data...
        </div>
      </div>
    );
  }

  if (error || !streakData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 1rem',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #e1e4e8',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ color: '#666', fontSize: '0.875rem' }}>
          {error || 'No streak data available'}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e1e4e8',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      margin: '0'
    }}>
      {/* Main Streak Display */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1rem'
      }}>
        {/* Fire Emoji and Streak Number */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <span style={{
            fontSize: '3rem',
            lineHeight: '1'
          }}>
            🔥
          </span>
          <div style={{
            fontSize: '4rem',
            fontWeight: '700',
            color: '#ff6b35',
            lineHeight: '1',
            letterSpacing: '-0.02em'
          }}>
            {streakData.current_streak}
          </div>
        </div>

        {/* Streak Label */}
        <div style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#24292e',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Day Streak
        </div>

        {/* Motivational Message */}
        <div style={{
          fontSize: '0.875rem',
          color: '#586069',
          fontWeight: '400',
          maxWidth: '300px',
          lineHeight: '1.4'
        }}>
          {streakData.current_streak >= 7 
            ? `🎉 Amazing! You're on a ${streakData.current_streak}-day streak!`
            : streakData.current_streak >= 3
            ? `👍 Great job! ${streakData.current_streak} days and counting!`
            : streakData.current_streak >= 1
            ? `💪 Keep going! ${streakData.current_streak} day down!`
            : `🚀 Start your streak today!`
          }
        </div>

        {/* Additional Stats */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '1rem',
          fontSize: '0.875rem',
          color: '#656d76'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#1a7f37' }}>
              {streakData.max_streak}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Max
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', color: '#8250df' }}>
              {streakData.active_days}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
              Active Days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
