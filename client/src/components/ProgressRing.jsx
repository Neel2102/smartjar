import React from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const ProgressRing = ({ size = 140, stroke = 10, current = 0, target = 0, label = 'Emergency Fund', sublabel, color = '#4CAF50' }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? clamp(current / target, 0, 1) : 0;
  const dash = circumference * pct;
  const remainder = circumference - dash;

  const percentText = `${Math.round(pct * 100)}%`;
  const subtitle = sublabel || (target > 0 ? `${percentText} of target` : 'No target set');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${remainder}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 800ms ease' }}
          />
        </g>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" style={{ fontSize: size * 0.18, fontWeight: 700, fill: '#333' }}>
          {percentText}
        </text>
      </svg>
      <div>
        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>{subtitle}</div>
        {target > 0 && (
          <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            ₹{Math.round(current).toLocaleString()} / ₹{Math.round(target).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;


