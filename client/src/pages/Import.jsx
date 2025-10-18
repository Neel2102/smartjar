import React from 'react';
import CSVImport from '../components/CSVImport';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';

const ImportPage = ({ user }) => {
  const { userId, handleIncomesImported } = useApp();

  return (
    <PageLayout
      title="📥 Import Data"
      subtitle="Bulk import your income data from CSV files"
      user={user}
    >
      <CSVImport userId={userId} onIncomesImported={handleIncomesImported} />
    </PageLayout>
  );
};

export default ImportPage;
