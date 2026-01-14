import React, { useState, useEffect } from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { expenseAPI } from '../services/api';

const ExpenseList = ({ expenses, userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5); // Adjust based on container height

  // Reset to first page when expenses change
  useEffect(() => {
    setCurrentPage(1);
  }, [expenses]);

  const handleDownloadExpense = async () => {
    try {
      console.log('Starting expense download for userId:', userId);
      const response = await expenseAPI.exportExpense(userId);
      console.log('Download response:', response);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'expense_history.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading expense history:', error);
      alert('Failed to download expense history: ' + error.message);
    }
  };

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
              <div className="expense-amount">{formatINR(expense.amount)}</div>
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

      <div className="pagination-container">
        {totalPages > 1 && (
          <>
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
                className="pagination-btn download-btn" 
                onClick={handleDownloadExpense}
                style={{ marginLeft: '0.5rem' }}
              >
                Download
              </button>
              <button 
                className="pagination-btn" 
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
