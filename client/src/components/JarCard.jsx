<<<<<<< HEAD
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { BanknotesIcon, LifebuoyIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
=======
import React, { useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';
>>>>>>> origin/main

const JarCard = ({ type, amount, percentage, totalIncome }) => {
  const getJarInfo = () => {
    switch (type) {
      case 'salary':
        return {
          label: 'Salary Jar',
          color: 'salary',
          description: 'Daily spending needs',
<<<<<<< HEAD
          icon: <BanknotesIcon className="icon" style={{ width: 32, height: 32 }} />
=======
          icon: '💰'
>>>>>>> origin/main
        };
      case 'emergency':
        return {
          label: 'Emergency Jar',
          color: 'emergency',
          description: 'Safety buffer',
<<<<<<< HEAD
          icon: <LifebuoyIcon className="icon" style={{ width: 32, height: 32 }} />
=======
          icon: '🆘'
>>>>>>> origin/main
        };
      case 'future':
        return {
          label: 'Future Jar',
          color: 'future',
          description: 'Long-term savings',
<<<<<<< HEAD
          icon: <RocketLaunchIcon className="icon" style={{ width: 32, height: 32 }} />
        };
      default:
        return { label: '', color: '', description: '', icon: null };
=======
          icon: '🚀'
        };
      default:
        return { label: '', color: '', description: '', icon: '' };
>>>>>>> origin/main
    }
  };

  const jarInfo = getJarInfo();
  const progressPercentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
<<<<<<< HEAD

  return (
    <div className={`jar-card ${jarInfo.color}`}>
      <div className="jar-icon" style={{ marginBottom: '1rem', color: '#2563eb' }}>
=======
  const barColor = useMemo(() => {
    switch (type) {
      case 'salary': return '#4CAF50';
      case 'emergency': return '#FF9800';
      case 'future': return '#2196F3';
      default: return '#667eea';
    }
  }, [type]);

  return (
    <div className={`jar-card ${jarInfo.color}`}>
      <div className="jar-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
>>>>>>> origin/main
        {jarInfo.icon}
      </div>
      <div className="jar-label">{jarInfo.label}</div>
      <div className={`jar-amount ${jarInfo.color}`}>
        {formatCurrency(amount)}
      </div>
      <div className="jar-percentage">
        {percentage}% of income • {progressPercentage.toFixed(1)}% of total
      </div>
<<<<<<< HEAD
=======
      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ height: 10, background: '#eaeaea', borderRadius: 6, overflow: 'hidden' }}>
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
>>>>>>> origin/main
      <div className="jar-description" style={{ 
        marginTop: '1rem', 
        color: '#666', 
        fontSize: '0.9rem' 
      }}>
        {jarInfo.description}
      </div>
    </div>
  );
};

export default JarCard;
