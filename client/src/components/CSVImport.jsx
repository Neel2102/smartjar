import React, { useState } from 'react';
import { incomeAPI } from '../services/api';

const CSVImport = ({ userId, onIncomesImported }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
      previewCSV(selectedFile);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
      setPreview(null);
    }
  };

  const previewCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const sampleData = lines.slice(1, 4).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      setPreview({ headers, sampleData });
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('csv', file);
      formData.append('userId', userId);

      // For now, we'll simulate CSV processing on the frontend
      // In a real app, you'd send this to the backend
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Find column indices
        const amountIndex = headers.findIndex(h => 
          h.toLowerCase().includes('amount') || h.toLowerCase().includes('income')
        );
        const dateIndex = headers.findIndex(h => 
          h.toLowerCase().includes('date') || h.toLowerCase().includes('received')
        );
        const sourceIndex = headers.findIndex(h => 
          h.toLowerCase().includes('source') || h.toLowerCase().includes('type')
        );

        if (amountIndex === -1) {
          throw new Error('Could not find amount column in CSV');
        }

        const importedIncomes = [];
        let successCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            try {
              const values = lines[i].split(',').map(v => v.trim());
              const amount = parseFloat(values[amountIndex]);
              
              if (isNaN(amount) || amount <= 0) continue;

              const incomeData = {
                userId,
                amount,
                source: sourceIndex !== -1 ? values[sourceIndex] : 'gig',
                receivedAt: dateIndex !== -1 ? new Date(values[dateIndex]) : new Date()
              };

              const response = await incomeAPI.add(incomeData);
              importedIncomes.push(response.data);
              successCount++;
            } catch (err) {
              errorCount++;
              console.error(`Error importing row ${i + 1}:`, err);
            }
          }
        }

        setSuccess(`Successfully imported ${successCount} incomes${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
        onIncomesImported(importedIncomes);
        
        // Reset form
        setFile(null);
        setPreview(null);
        e.target.reset();
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      };
      
      reader.readAsText(file);
    } catch (err) {
      setError(err.message || 'Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'amount,source,receivedAt\n5000,gig,2024-01-15\n3000,delivery,2024-01-16\n7500,ride,2024-01-17';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartjar_income_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Import Income from CSV</h2>
      
      <div style={{ 
        background: '#e3f2fd', 
        color: '#1976d2', 
        padding: '1rem', 
        borderRadius: '10px', 
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>📊 CSV Format:</strong> amount, source, receivedAt (optional)
        </p>
        <button 
          onClick={downloadTemplate}
          style={{
            background: 'none',
            border: '1px solid #1976d2',
            color: '#1976d2',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '0.5rem',
            fontSize: '0.8rem'
          }}
        >
          Download Template
        </button>
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
          <label className="form-label">Select CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="form-input"
            required
          />
        </div>

        {preview && (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem' 
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>CSV Preview:</h4>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              Headers: {preview.headers.join(', ')}
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              {preview.sampleData.map((row, index) => (
                <div key={index} style={{ marginBottom: '0.25rem' }}>
                  Row {index + 1}: {Object.values(row).join(', ')}
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className="btn" 
          disabled={loading || !file}
        >
          {loading ? 'Importing...' : 'Import CSV'}
        </button>
      </form>
    </div>
  );
};

export default CSVImport;
