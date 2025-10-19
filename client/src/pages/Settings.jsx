import React from 'react';
import JarRatioSettings from '../components/JarRatioSettings';
import PageLayout from '../components/PageLayout';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

const SettingsPage = ({ user, onRatiosUpdated }) => {
  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Cog6ToothIcon style={{ width: 24, height: 24 }} aria-hidden />
          Settings
        </span>
      }
      subtitle="Customize your jar allocation ratios and preferences"
      user={user}
    >
      <JarRatioSettings user={user} onRatiosUpdated={onRatiosUpdated} />
    </PageLayout>
  );
};

export default SettingsPage;
