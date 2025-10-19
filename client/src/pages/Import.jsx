import React from 'react';
import CSVImport from '../components/CSVImport';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ImportPage = ({ user }) => {
  const { userId, handleIncomesImported } = useApp();

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ArrowDownTrayIcon style={{ width: 24, height: 24 }} aria-hidden />
          Import Data
        </span>
      }
      subtitle="Bulk import your income data from CSV files"
      user={user}
    >
      <CSVImport userId={userId} onIncomesImported={handleIncomesImported} />
    </PageLayout>
  );
};

export default ImportPage;
