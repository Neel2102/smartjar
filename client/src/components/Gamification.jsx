import React, { useMemo } from 'react';

const Gamification = ({ user, incomes }) => {
  const badges = useMemo(() => {
    const totalEntries = incomes.length;
    const totalAmount = incomes.reduce((s, i) => s + i.amount, 0);
    const out = [];
    if (totalEntries >= 1) out.push({ icon: '🏁', name: 'First Deposit', desc: 'Logged your first income' });
    if (totalEntries >= 10) out.push({ icon: '🔟', name: '10 Entries', desc: 'Consistent tracking' });
    if (totalAmount >= 10000) out.push({ icon: '💰', name: '₹10k Club', desc: 'Reached ₹10,000 total income' });
    return out;
  }, [incomes]);

  const streakDays = useMemo(() => {
    if (incomes.length === 0) return 0;
    const daysSet = new Set(incomes.map(i => new Date(i.receivedAt).toISOString().slice(0,10)));
    let streak = 0;
    let d = new Date();
    for (;;) {
      const key = d.toISOString().slice(0,10);
      if (daysSet.has(key)) {
        streak += 1;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [incomes]);

  return (
    <div className="form-container" style={{ maxWidth: '100%' }}>
      <h2 className="form-title">Achievements & Streak</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '2rem' }}>🔥</div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.5rem' }}>Streak</div>
          <div style={{ color: '#666' }}>{streakDays} day(s)</div>
        </div>
        {badges.length === 0 ? (
          <div style={{ color: '#666' }}>No badges yet. Keep going!</div>
        ) : badges.map((b, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: 10, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '2rem' }}>{b.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.5rem' }}>{b.name}</div>
            <div style={{ color: '#666' }}>{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gamification;
