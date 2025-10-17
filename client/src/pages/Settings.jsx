import React from 'react';
import JarRatioSettings from '../components/JarRatioSettings';

const SettingsPage = ({ user, onRatiosUpdated }) => {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Settings</h1>
          <p>Customize your jar allocation ratios and preferences</p>
        </div>
        <JarRatioSettings user={user} onRatiosUpdated={onRatiosUpdated} />
      </div>
    </div>
  );
};

export default SettingsPage;
