import React from 'react';
import CSVImport from '../components/CSVImport';
import { useApp } from '../context/AppContext';

const ImportPage = () => {
  const { userId, handleIncomesImported } = useApp();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>📥 Import Data</h1>
          <p>Bulk import your income data from CSV files</p>
        </div>
        <CSVImport userId={userId} onIncomesImported={handleIncomesImported} />
      </div>
    </div>
  );
};

export default ImportPage;
