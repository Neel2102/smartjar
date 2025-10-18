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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
      gap: '2rem',
      padding: '0'
    }}>
      {/* Loan EMI Calculator */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #E0F2FE',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            💰
          </div>
          <h2 style={{
            margin: 0,
            color: '#1F2937',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            Loan EMI Calculator
          </h2>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Principal Amount (₹)
            </label>
            <input 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                color: '#1F2937'
              }}
              type="number" 
              name="principal" 
              value={loan.principal} 
              onChange={onLoanChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Annual Interest Rate (%)
            </label>
            <input 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                color: '#1F2937'
              }}
              type="number" 
              name="rate" 
              value={loan.rate} 
              onChange={onLoanChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Loan Tenure (months)
            </label>
            <input 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                color: '#1F2937'
              }}
              type="number" 
              name="months" 
              value={loan.months} 
              onChange={onLoanChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(emiValue)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              EMI
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(totalPayable)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Payable
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(totalInterest)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Interest
            </div>
          </div>
        </div>
      </div>

      {/* SIP Investment Calculator */}
      <div style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid #E0F2FE',
        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '700'
          }}>
            📈
          </div>
          <h2 style={{
            margin: 0,
            color: '#1F2937',
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            SIP Investment Calculator
          </h2>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Monthly Investment (₹)
            </label>
            <input 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                color: '#1F2937'
              }}
              type="number" 
              name="monthly" 
              value={sip.monthly} 
              onChange={onSipChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Expected Annual Return (%)
            </label>
            <input 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                color: '#1F2937'
              }}
              type="number" 
              name="rate" 
              value={sip.rate} 
              onChange={onSipChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
              fontSize: '0.875rem'
            }}>
              Investment Duration (years)
            </label>
            <input 
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: '#FFFFFF',
                color: '#1F2937'
              }}
              type="number" 
              name="years" 
              value={sip.years} 
              onChange={onSipChange}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(sipInvested)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Invested
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(sipValue)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Future Value
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1E40AF',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(sipGain)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Wealth Gain
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTools;
