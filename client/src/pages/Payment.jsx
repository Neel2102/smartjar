import React from 'react';
import PaymentGateway from '../components/PaymentGateway';
import { useApp } from '../context/AppContext';

const PaymentPage = () => {
  const { userId, handleIncomeAdded } = useApp();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>💳 Payment Gateway</h1>
          <p>Process payments and manage transactions</p>
        </div>
        <PaymentGateway userId={userId} onPaymentSuccess={handleIncomeAdded} />
      </div>
    </div>
  );
};

export default PaymentPage;
