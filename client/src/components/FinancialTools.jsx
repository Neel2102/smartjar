import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatters';

function emi(principal, annualRatePct, months) {
  const r = (annualRatePct / 12) / 100;
  if (r === 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return principal * r * pow / (pow - 1);
}

function sipFutureValue(monthly, annualRatePct, years) {
  const r = (annualRatePct / 12) / 100;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

const FinancialTools = () => {
  const [loan, setLoan] = useState({ principal: 50000, rate: 12, months: 24 });
  const [sip, setSip] = useState({ monthly: 2000, rate: 12, years: 5 });

  const emiValue = useMemo(() => emi(loan.principal, loan.rate, loan.months), [loan]);
  const totalPayable = useMemo(() => emiValue * loan.months, [emiValue, loan.months]);
  const totalInterest = useMemo(() => totalPayable - loan.principal, [totalPayable, loan.principal]);

  const sipValue = useMemo(() => sipFutureValue(sip.monthly, sip.rate, sip.years), [sip]);
  const sipInvested = useMemo(() => sip.monthly * sip.years * 12, [sip]);
  const sipGain = useMemo(() => sipValue - sipInvested, [sipValue, sipInvested]);

  const onLoanChange = (e) => setLoan({ ...loan, [e.target.name]: Number(e.target.value) });
  const onSipChange = (e) => setSip({ ...sip, [e.target.name]: Number(e.target.value) });

  return (
    <div>
      <div className="form-container">
        <h2 className="form-title">Loan EMI Calculator</h2>
        <div className="form-group">
          <label className="form-label">Principal (₹)</label>
          <input className="form-input" type="number" name="principal" value={loan.principal} onChange={onLoanChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Interest Rate (%)</label>
          <input className="form-input" type="number" name="rate" value={loan.rate} onChange={onLoanChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Tenure (months)</label>
          <input className="form-input" type="number" name="months" value={loan.months} onChange={onLoanChange} />
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">{formatCurrency(emiValue)}</div><div className="stat-label">EMI</div></div>
          <div className="stat-card"><div className="stat-number">{formatCurrency(totalPayable)}</div><div className="stat-label">Total Payable</div></div>
          <div className="stat-card"><div className="stat-number">{formatCurrency(totalInterest)}</div><div className="stat-label">Total Interest</div></div>
        </div>
      </div>

      <div className="form-container">
        <h2 className="form-title">SIP Investment Calculator</h2>
        <div className="form-group">
          <label className="form-label">Monthly Investment (₹)</label>
          <input className="form-input" type="number" name="monthly" value={sip.monthly} onChange={onSipChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Expected Annual Return (%)</label>
          <input className="form-input" type="number" name="rate" value={sip.rate} onChange={onSipChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Duration (years)</label>
          <input className="form-input" type="number" name="years" value={sip.years} onChange={onSipChange} />
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-number">{formatCurrency(sipInvested)}</div><div className="stat-label">Total Invested</div></div>
          <div className="stat-card"><div className="stat-number">{formatCurrency(sipValue)}</div><div className="stat-label">Future Value</div></div>
          <div className="stat-card"><div className="stat-number">{formatCurrency(sipGain)}</div><div className="stat-label">Wealth Gain</div></div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTools;
