import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

const IncomeList = ({ incomes }) => {
  if (!incomes || incomes.length === 0) {
    return (
      <div className="income-list">
        <h3 style={{ textAlign: 'center', color: '#666' }}>
          No income entries yet. Add your first income to get started!
        </h3>
      </div>
    );
  }

  return (
    <div className="income-list">
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Income History</h3>
      
      {incomes.map((income) => (
        <div key={income._id} className="income-item">
          <div>
            <div className="income-amount">{formatCurrency(income.amount)}</div>
            <div className="income-date">{formatDate(income.receivedAt)}</div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div className="income-source">
              {income.source.charAt(0).toUpperCase() + income.source.slice(1)}
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#666', 
              marginTop: '0.25rem' 
            }}>
              {formatCurrency(income.allocations.salary)} • {formatCurrency(income.allocations.emergency)} • {formatCurrency(income.allocations.future)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomeList;
