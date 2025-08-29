import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { incomeAPI, expenseAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const toYMD = (date) => new Date(date).toISOString().slice(0,10);

const Analytics = ({ userId, incomes, expenses, jarBalances }) => {
  const [expenseAnalytics, setExpenseAnalytics] = useState(null);

  useEffect(() => {
    if (!userId) return;
    expenseAPI.getAnalytics(userId).then(({ data }) => setExpenseAnalytics(data)).catch(() => {});
  }, [userId]);

  // Build daily time series for income vs expense
  const series = useMemo(() => {
    const incomeByDay = new Map();
    const expenseByDay = new Map();
    incomes.forEach(i => {
      const d = toYMD(i.receivedAt);
      incomeByDay.set(d, (incomeByDay.get(d) || 0) + i.amount);
    });
    (expenses || []).forEach(e => {
      const d = toYMD(e.date);
      expenseByDay.set(d, (expenseByDay.get(d) || 0) + e.amount);
    });
    const days = Array.from(new Set([...incomeByDay.keys(), ...expenseByDay.keys()])).sort();
    const rows = days.map(d => ({ date: d, income: incomeByDay.get(d) || 0, expense: expenseByDay.get(d) || 0, net: (incomeByDay.get(d) || 0) - (expenseByDay.get(d) || 0) }));
    return rows;
  }, [incomes, expenses]);

  // Simple 7-day moving average forecast for next 7 days
  const forecast = useMemo(() => {
    if (series.length < 3) return [];
    const last7 = series.slice(-7);
    const avgIncome = last7.reduce((s, r) => s + r.income, 0) / last7.length || 0;
    const avgExpense = last7.reduce((s, r) => s + r.expense, 0) / last7.length || 0;
    const lastDate = series.length ? new Date(series[series.length - 1].date) : new Date();
    const out = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(lastDate);
      d.setDate(d.getDate() + i);
      out.push({ date: toYMD(d), income: Math.round(avgIncome), expense: Math.round(avgExpense), net: Math.round(avgIncome - avgExpense) });
    }
    return out;
  }, [series]);

  const jarData = [
    { name: 'Salary', amount: jarBalances.salary },
    { name: 'Emergency', amount: jarBalances.emergency },
    { name: 'Future', amount: jarBalances.future },
  ];

  return (
    <div>
      <div className="form-container" style={{ maxWidth: '100%' }}>
        <h2 className="form-title">Income vs Expense</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#f44336" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="net" stroke="#667eea" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="form-container" style={{ maxWidth: '100%' }}>
        <h2 className="form-title">7-Day Forecast (Avg-based)</h2>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={forecast} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#f44336" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="net" stroke="#667eea" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="form-container" style={{ maxWidth: '100%' }}>
        <h2 className="form-title">Jar Balances</h2>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={jarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#667eea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {expenseAnalytics && (
        <div className="form-container">
          <h2 className="form-title">Expense Breakdown (This Month)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="stat-card"><div className="stat-number">{formatCurrency(expenseAnalytics.totalExpenses)}</div><div className="stat-label">Total</div></div>
            <div className="stat-card"><div className="stat-number">{formatCurrency(expenseAnalytics.businessExpenses)}</div><div className="stat-label">Business</div></div>
            <div className="stat-card"><div className="stat-number">{formatCurrency(expenseAnalytics.personalExpenses)}</div><div className="stat-label">Personal</div></div>
            <div className="stat-card"><div className="stat-number">{expenseAnalytics.expenseCount}</div><div className="stat-label">Entries</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
