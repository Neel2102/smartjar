import React, { useState, useEffect } from 'react';
import InvestmentAssistant from '../components/InvestmentAssistant';
import PageLayout from '../components/PageLayout';
import { useApp } from '../context/AppContext';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { investmentAPI } from '../services/api';

const InvestmentPage = ({ user }) => {
  const { jarBalances } = useApp();
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!user?._id) return;
      
      setLoadingRecommendation(true);
      try {
        const response = await investmentAPI.getRecommendation(user._id);
        setRecommendation(response.data);
      } catch (error) {
        console.error('Error fetching investment recommendation:', error);
        // Set default blocked state if API fails
        setRecommendation({
          eligible: false,
          reason: 'Unable to calculate recommendation. Please check your financial data.'
        });
      } finally {
        setLoadingRecommendation(false);
      }
    };

    fetchRecommendation();
  }, [user?._id, jarBalances]);

  return (
    <PageLayout
      title={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ArrowTrendingUpIcon style={{ width: 24, height: 24 }} aria-hidden />
          Investment Assistant
        </span>
      }
      subtitle="Get personalized investment recommendations"
      user={user}
    >
      <InvestmentAssistant 
        user={user} 
        jarBalances={jarBalances} 
        recommendation={recommendation}
        loadingRecommendation={loadingRecommendation}
      />
    </PageLayout>
  );
};

export default InvestmentPage;
