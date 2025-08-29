import React, { useState } from 'react';
import { incomeAPI } from '../services/api';

const IncomeForm = ({ onIncomeAdded, userId }) => {
  const [formData, setFormData] = useState({
    amount: '',
    source: 'gig',
    receivedAt: new Date().toISOString().split('T')[0]
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
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await incomeAPI.add({
        userId,
        amount: parseFloat(formData.amount),
        source: formData.source,
        receivedAt: formData.receivedAt
      });

      // Reset form
      setFormData({
        amount: '',
        source: 'gig',
        receivedAt: new Date().toISOString().split('T')[0]
      });

      // Notify parent component
      onIncomeAdded(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Income</h2>
      
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
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter amount"
            min="1"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Source</label>
          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="form-select"
          >
            <option value="gig">Gig Work</option>
            <option value="delivery">Food Delivery</option>
            <option value="ride">Ride Sharing</option>
            <option value="freelance">Freelance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date Received</label>
          <input
            type="date"
            name="receivedAt"
            value={formData.receivedAt}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Income'}
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;
