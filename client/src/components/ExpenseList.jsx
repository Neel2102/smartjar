import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

const ExpenseList = ({ expenses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5); // Adjust based on container height

  // Reset to first page when expenses change
  useEffect(() => {
    setCurrentPage(1);
  }, [expenses]);

  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-list-container">
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Expense History</h3>
        <div className="expense-list-content">
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No expenses recorded yet.
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(expenses.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="expense-list-container">
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Expense History</h3>
      
      <div className="expense-list-content">
        {currentExpenses.map((expense) => (
          <div key={expense._id} className="expense-item">
            <div>
              <div className="expense-amount">{formatCurrency(expense.amount)}</div>
              <div className="expense-date">{formatDate(expense.date)}</div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div className="expense-category">{expense.category}</div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#666', 
                marginTop: '0.25rem' 
              }}>
                {expense.type} • {expense.jarSource}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="pagination-btn" 
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
