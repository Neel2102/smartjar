import React from 'react';
import PaymentGateway from '../components/PaymentGateway';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';

const PaymentPage = ({ user }) => {
  const { userId, handleIncomeAdded } = useApp();

  return (
    <PageLayout
      title="💳 Payment Gateway"
      subtitle="Process payments and manage transactions"
      user={user}
    >
      <PaymentGateway userId={userId} onPaymentSuccess={handleIncomeAdded} />
    </PageLayout>
  );
};

export default PaymentPage;
