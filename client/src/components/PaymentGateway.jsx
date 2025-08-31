import React, { useState } from 'react';
import { incomeAPI } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const PaymentGateway = ({ userId, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    amount: '',
    source: 'gig_platform',
    platform: 'swiggy',
    transactionId: '',
    paymentMethod: 'upi',
    upiId: '',
    bankAccount: '',
    ifscCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('amount'); // amount, method, confirm, success
  const [error, setError] = useState('');

  const platforms = [
    { key: 'swiggy', name: 'Swiggy', icon: '🛵' },
    { key: 'zomato', name: 'Zomato', icon: '🍕' },
    { key: 'uber', name: 'Uber', icon: '🚗' },
    { key: 'rapido', name: 'Rapido', icon: '🏍️' },
    { key: 'ola', name: 'Ola', icon: '🚙' },
    { key: 'dunzo', name: 'Dunzo', icon: '📦' },
    { key: 'other', name: 'Other', icon: '🔧' }
  ];

  const paymentMethods = [
    { key: 'upi', name: 'UPI Transfer', icon: '📱', description: 'Instant transfer via UPI ID' },
    { key: 'bank_transfer', name: 'Bank Transfer', icon: '🏦', description: 'Direct bank account transfer' },
    { key: 'wallet', name: 'Wallet Credit', icon: '💳', description: 'Credit to SmartJar wallet' },
    { key: 'cash', name: 'Cash Entry', icon: '💵', description: 'Manual entry for cash earnings' }
  ];

  const updatePaymentData = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `SJ${timestamp}${random}`.toUpperCase();
  };

  const handleAmountSubmit = () => {
    if (!paymentData.amount || paymentData.amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    setPaymentData(prev => ({ ...prev, transactionId: generateTransactionId() }));
    setStep('method');
  };

  const handleMethodSelect = (method) => {
    updatePaymentData('paymentMethod', method);
    setStep('confirm');
  };

  const handlePaymentConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create income entry
      const incomeData = {
        userId,
        amount: parseFloat(paymentData.amount),
        source: paymentData.source,
        platform: paymentData.platform,
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod,
        receivedAt: new Date()
      };

      const response = await incomeAPI.add(incomeData);
      
      if (response.data) {
        setStep('success');
        onPaymentSuccess(response.data);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPayment = () => {
    setPaymentData({
      amount: '',
      source: 'gig_platform',
      platform: 'swiggy',
      transactionId: '',
      paymentMethod: 'upi',
      upiId: '',
      bankAccount: '',
      ifscCode: ''
    });
    setStep('amount');
    setError('');
  };

  const renderAmountStep = () => (
    <div className="payment-step">
      <h3>💰 Enter Your Earnings</h3>
      <p>How much did you earn today?</p>
      
      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          value={paymentData.amount}
          onChange={(e) => updatePaymentData('amount', e.target.value)}
          placeholder="Enter amount"
          min="1"
          step="0.01"
          className="amount-input"
        />
      </div>

      <div className="form-group">
        <label>Platform</label>
        <div className="platform-selector">
          {platforms.map(platform => (
            <button
              key={platform.key}
              className={`platform-option ${paymentData.platform === platform.key ? 'selected' : ''}`}
              onClick={() => updatePaymentData('platform', platform.key)}
            >
              <span className="platform-icon">{platform.icon}</span>
              <span className="platform-name">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        className="btn btn-primary"
        onClick={handleAmountSubmit}
        disabled={!paymentData.amount || paymentData.amount <= 0}
      >
        Continue
      </button>
    </div>
  );

  const renderMethodStep = () => (
    <div className="payment-step">
      <h3>💳 Choose Payment Method</h3>
      <p>How would you like to deposit your earnings?</p>
      
      <div className="payment-methods">
        {paymentMethods.map(method => (
          <button
            key={method.key}
            className="payment-method-option"
            onClick={() => handleMethodSelect(method.key)}
          >
            <div className="method-header">
              <span className="method-icon">{method.icon}</span>
              <div className="method-info">
                <h4>{method.name}</h4>
                <p>{method.description}</p>
              </div>
            </div>
            <span className="method-arrow">→</span>
          </button>
        ))}
      </div>

      <button 
        className="btn btn-secondary"
        onClick={() => setStep('amount')}
      >
        Back
      </button>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="payment-step">
      <h3>✅ Confirm Payment</h3>
      <p>Review your payment details before confirming</p>
      
      <div className="payment-summary">
        <div className="summary-item">
          <span className="summary-label">Amount:</span>
          <span className="summary-value">₹{formatCurrency(paymentData.amount)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Platform:</span>
          <span className="summary-value">
            {platforms.find(p => p.key === paymentData.platform)?.icon} 
            {platforms.find(p => p.key === paymentData.platform)?.name}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Payment Method:</span>
          <span className="summary-value">
            {paymentMethods.find(m => m.key === paymentData.paymentMethod)?.icon} 
            {paymentMethods.find(m => m.key === paymentData.paymentMethod)?.name}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Transaction ID:</span>
          <span className="summary-value">{paymentData.transactionId}</span>
        </div>
      </div>

      {paymentData.paymentMethod === 'upi' && (
        <div className="form-group">
          <label>UPI ID</label>
          <input
            type="text"
            value={paymentData.upiId}
            onChange={(e) => updatePaymentData('upiId', e.target.value)}
            placeholder="Enter UPI ID (e.g., name@upi)"
            className="form-input"
          />
        </div>
      )}

      {paymentData.paymentMethod === 'bank_transfer' && (
        <>
          <div className="form-group">
            <label>Bank Account Number</label>
            <input
              type="text"
              value={paymentData.bankAccount}
              onChange={(e) => updatePaymentData('bankAccount', e.target.value)}
              placeholder="Enter account number"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>IFSC Code</label>
            <input
              type="text"
              value={paymentData.ifscCode}
              onChange={(e) => updatePaymentData('ifscCode', e.target.value)}
              placeholder="Enter IFSC code"
              className="form-input"
            />
          </div>
        </>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="button-group">
        <button 
          className="btn btn-secondary"
          onClick={() => setStep('method')}
        >
          Back
        </button>
        <button 
          className="btn btn-primary"
          onClick={handlePaymentConfirm}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="payment-step success">
      <div className="success-icon">✅</div>
      <h3>Payment Successful!</h3>
      <p>Your earnings have been deposited into SmartJar</p>
      
      <div className="success-details">
        <div className="detail-item">
          <span className="detail-label">Amount:</span>
          <span className="detail-value">₹{formatCurrency(paymentData.amount)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Transaction ID:</span>
          <span className="detail-value">{paymentData.transactionId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time:</span>
          <span className="detail-value">{new Date().toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="jar-allocation-preview">
        <h4>💰 Jar Allocation Preview</h4>
        <div className="jar-preview-grid">
          <div className="jar-preview-item">
            <span className="jar-icon">💰</span>
            <div>
              <strong>Salary Jar</strong>
              <p>₹{formatCurrency(paymentData.amount * 0.6)} (60%)</p>
            </div>
          </div>
          <div className="jar-preview-item">
            <span className="jar-icon">🛡️</span>
            <div>
              <strong>Emergency Jar</strong>
              <p>₹{formatCurrency(paymentData.amount * 0.25)} (25%)</p>
            </div>
          </div>
          <div className="jar-preview-item">
            <span className="jar-icon">🚀</span>
            <div>
              <strong>Future Jar</strong>
              <p>₹{formatCurrency(paymentData.amount * 0.15)} (15%)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="success-actions">
        <button 
          className="btn btn-primary"
          onClick={resetPayment}
        >
          Deposit More Earnings
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => window.location.reload()}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="payment-gateway">
      <div className="payment-header">
        <h2>🏦 SmartJar Payment Gateway</h2>
        <p>Deposit your daily earnings securely</p>
      </div>

      <div className="payment-container">
        {step === 'amount' && renderAmountStep()}
        {step === 'method' && renderMethodStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'success' && renderSuccessStep()}
      </div>

      <div className="payment-info">
        <h4>ℹ️ How it works:</h4>
        <div className="info-steps">
          <div className="info-step">
            <span className="step-number">1</span>
            <p>Enter your earnings amount and platform</p>
          </div>
          <div className="info-step">
            <span className="step-number">2</span>
            <p>Choose your preferred payment method</p>
          </div>
          <div className="info-step">
            <span className="step-number">3</span>
            <p>Confirm and complete the transaction</p>
          </div>
          <div className="info-step">
            <span className="step-number">4</span>
            <p>Your money is automatically allocated to jars</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
