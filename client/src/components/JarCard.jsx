import React, { useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';
import { BanknotesIcon, ShieldCheckIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const JarCard = ({ type, amount, percentage, totalIncome }) => {
  const getJarInfo = () => {
    switch (type) {
      case 'salary':
        return {
          label: 'Salary Jar',
          color: 'salary',
          description: 'Daily spending needs',
          icon: 'salary'
        };
      case 'emergency':
        return {
          label: 'Emergency Jar',
          color: 'emergency',
          description: 'Safety buffer',
          icon: 'emergency'
        };
      case 'future':
        return {
          label: 'Future Jar',
          color: 'future',
          description: 'Long-term savings',
          icon: 'future'
        };
      default:
        return { label: '', color: '', description: '', icon: '' };
    }
  };

  const jarInfo = getJarInfo();
  const progressPercentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
  const barColor = useMemo(() => 'var(--primary)', []);

  const renderIcon = () => {
    const props = { style: { width: 28, height: 28 }, 'aria-hidden': true };
    switch (jarInfo.icon) {
      case 'salary': return <BanknotesIcon {...props} />;
      case 'emergency': return <ShieldCheckIcon {...props} />;
      case 'future': return <RocketLaunchIcon {...props} />;
      default: return null;
    }
  };

  return (
    <div className={`jar-card ${jarInfo.color}`}>
      <div className="jar-icon" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
        {renderIcon()}
      </div>
      <div className="jar-label">{jarInfo.label}</div>
      <div className={`jar-amount ${jarInfo.color}`}>
        {formatCurrency(amount)}
      </div>
      <div className="jar-percentage">
        {percentage}% of income • {progressPercentage.toFixed(1)}% of total
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ height: 10, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: barColor,
              transition: 'width 800ms ease'
            }}
          />
        </div>
      </div>
      <div className="jar-description" style={{ 
        marginTop: '1rem', 
        color: 'var(--muted)', 
        fontSize: '0.9rem' 
      }}>
        {jarInfo.description}
      </div>
    </div>
  );
};

export default JarCard;
