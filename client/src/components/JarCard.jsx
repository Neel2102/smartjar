import React from 'react';
import { formatCurrency } from '../utils/formatters';

const JarCard = ({ type, amount, percentage, totalIncome }) => {
  const getJarInfo = () => {
    switch (type) {
      case 'salary':
        return {
          label: 'Salary Jar',
          color: 'salary',
          description: 'Daily spending needs',
          icon: '💰'
        };
      case 'emergency':
        return {
          label: 'Emergency Jar',
          color: 'emergency',
          description: 'Safety buffer',
          icon: '🆘'
        };
      case 'future':
        return {
          label: 'Future Jar',
          color: 'future',
          description: 'Long-term savings',
          icon: '🚀'
        };
      default:
        return { label: '', color: '', description: '', icon: '' };
    }
  };

  const jarInfo = getJarInfo();
  const progressPercentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;

  return (
    <div className={`jar-card ${jarInfo.color}`}>
      <div className="jar-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {jarInfo.icon}
      </div>
      <div className="jar-label">{jarInfo.label}</div>
      <div className={`jar-amount ${jarInfo.color}`}>
        {formatCurrency(amount)}
      </div>
      <div className="jar-percentage">
        {percentage}% of income • {progressPercentage.toFixed(1)}% of total
      </div>
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
