import React, { useState, useEffect } from 'react';
import { formatINR, formatDate } from '../utils/formatters';
import { incomeAPI } from '../services/api';

const IncomeList = ({ incomes, userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5); // Adjust based on container height

  // Reset to first page when incomes change
  useEffect(() => {
    setCurrentPage(1);
  }, [incomes]);

  const handleDownloadIncome = async () => {
    try {
      console.log('Starting income download for userId:', userId);
      const response = await incomeAPI.exportIncome(userId);
      console.log('Download response:', response);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'income_history.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading income history:', error);
      alert('Failed to download income history: ' + error.message);
    }
  };

  if (!incomes || incomes.length === 0) {
    return (
      <div className="income-list-container">
        <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Income History</h3>
        <div className="income-list-content">
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No income entries yet. Add your first income to get started!
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(incomes.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentIncomes = incomes.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="income-list-container">
      <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Income History</h3>
      
      <div className="income-list-content">
        {currentIncomes.map((income) => (
          <div key={income._id} className="income-item">
            <div>
              <div className="income-amount">{formatINR(income.amount)}</div>
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
                {formatINR(income.allocations.salary)} • {formatINR(income.allocations.emergency)} • {formatINR(income.allocations.future)}
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
                onClick={handleDownloadIncome}
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

export default IncomeList;
