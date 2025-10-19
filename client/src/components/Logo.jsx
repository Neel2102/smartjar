import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const Logo = ({ size = 28, showText = false }) => {
  const iconSize = Math.round(size * 0.6);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: 'var(--bg)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid var(--primary)'
        }}
      >
        <BanknotesIcon style={{ width: iconSize, height: iconSize }} />
      </div>
      {showText && (
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>SmartJar</span>
      )}
    </div>
  );
};

export default Logo;
