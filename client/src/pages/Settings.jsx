import React from 'react';
import JarRatioSettings from '../components/JarRatioSettings';
import PageLayout from '../components/PageLayout';

const SettingsPage = ({ user, onRatiosUpdated }) => {
  return (
    <PageLayout
      title="⚙️ Settings"
      subtitle="Customize your jar allocation ratios and preferences"
      user={user}
    >
      <JarRatioSettings user={user} onRatiosUpdated={onRatiosUpdated} />
    </PageLayout>
  );
};

export default SettingsPage;
