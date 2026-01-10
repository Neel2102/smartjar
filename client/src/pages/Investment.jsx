import React, { useState, useEffect } from 'react';
import InvestmentAssistant from '../components/InvestmentAssistant';
import PageLayout from '../components/PageLayout';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { investmentAPI, financeAPI } from '../services/api';

const InvestmentPage = ({ user }) => {
  const [financeSummary, setFinanceSummary] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      
      setLoadingRecommendation(true);
      try {
        const [summaryResponse, recommendationResponse] = await Promise.all([
          financeAPI.getSummary(user._id),
          investmentAPI.getRecommendation(user._id)
        ]);
        
        setFinanceSummary(summaryResponse.data);
        setRecommendation(recommendationResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set default blocked state if API fails
        setRecommendation({
          eligible: false,
          reason: 'Unable to calculate recommendation. Please check your financial data.'
        });
      } finally {
        setLoadingRecommendation(false);
      }
    };

    fetchData();
  }, [user?._id]);

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
      showWelcome={false}
    >
      <InvestmentAssistant 
        user={user} 
        jarBalances={financeSummary ? {
          salary: financeSummary.salaryJar,
          emergency: financeSummary.emergencyJar,
          future: financeSummary.futureJar
        } : { salary: 0, emergency: 0, future: 0 }}
        recommendation={recommendation}
        loadingRecommendation={loadingRecommendation}
      />
    </PageLayout>
  );
};

export default InvestmentPage;
