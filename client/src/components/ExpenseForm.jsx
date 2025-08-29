import React, { useState } from 'react';

const ExpenseForm = ({ onExpenseAdded, userId, jarBalances }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'fuel',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'personal',
    jarSource: 'salary'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    { value: 'fuel', label: '🚗 Fuel', color: '#f57c00' },
    { value: 'maintenance', label: '🔧 Maintenance', color: '#1976d2' },
    { value: 'food', label: '🍕 Food', color: '#388e3c' },
    { value: 'rent', label: '🏠 Rent', color: '#7b1fa2' },
    { value: 'utilities', label: '⚡ Utilities', color: '#ff9800' },
    { value: 'entertainment', label: '🎬 Entertainment', color: '#e91e63' },
    { value: 'health', label: '🏥 Health', color: '#f44336' },
    { value: 'transport', label: '🚌 Transport', color: '#009688' },
    { value: 'other', label: '📦 Other', color: '#795548' }
  ];

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

    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description.trim(),
          date: formData.date,
          type: formData.type,
          jarSource: formData.jarSource
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const expense = await response.json();
      
      // Reset form
      setFormData({
        amount: '',
        category: 'fuel',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'personal',
        jarSource: 'salary'
      });

      // Notify parent component
      onExpenseAdded(expense);
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Expense</h2>
      
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
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            placeholder="What was this expense for?"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="personal">Personal</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Pay From Jar</label>
          <select
            name="jarSource"
            value={formData.jarSource}
            onChange={handleChange}
            className="form-select"
          >
            <option value="salary">Salary Jar (₹{jarBalances?.salary || 0})</option>
            <option value="emergency">Emergency Jar (₹{jarBalances?.emergency || 0})</option>
            <option value="future">Future Jar (₹{jarBalances?.future || 0})</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
