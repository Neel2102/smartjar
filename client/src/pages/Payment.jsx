import React from 'react';
import PaymentGateway from '../components/PaymentGateway';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { CreditCardIcon } from '@heroicons/react/24/outline';

const PaymentPage = ({ user }) => {
  const { userId, handleIncomeAdded } = useApp();

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <CreditCardIcon style={{ width: 24, height: 24 }} aria-hidden />
          Payment Gateway
        </span>
      }
      subtitle="Process payments and manage transactions"
      user={user}
    >
      <PaymentGateway userId={userId} onPaymentSuccess={handleIncomeAdded} />
    </PageLayout>
  );
};

export default PaymentPage;
