import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userAPI = {
  create: (userData) => api.post('/users', userData),
  getAll: () => api.get('/users'),
  updateRatios: (userId, ratios) => api.put(`/users/${userId}/ratios`, { jarRatios: ratios }),
  update: (userId, userData) => api.put(`/users/${userId}`, userData),
  updateEmergencyGoal: (userId, emergencyGoal) => api.put(`/users/${userId}/emergency-goal`, { emergencyGoal }),
};

// Income API calls
export const incomeAPI = {
  add: (incomeData) => api.post('/income', incomeData),
  getAll: (userId) => api.get('/income', { params: { userId } }),
  getJarBalances: (userId) => api.get('/income/jars', { params: { userId } }),
  exportIncome: (userId) => api.get('/income/export', { 
    params: { userId },
    responseType: 'blob',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }),
};

// Expense API calls
export const expenseAPI = {
  add: (expenseData) => api.post('/expenses', expenseData),
  getAll: (userId) => api.get('/expenses', { params: { userId } }),
  getAnalytics: (userId) => api.get('/expenses/analytics', { params: { userId } }),
  exportExpense: (userId) => api.get('/expenses/export', { 
    params: { userId },
    responseType: 'blob',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  }),
};

// AI Coach API
export const aiAPI = {
  coach: ({ prompt, context }) => api.post('/ai/coach', { prompt, context }),
};

// Investment API calls
export const investmentAPI = {
  getRecommendation: (userId) => api.get('/investment/recommendation', { params: { userId } }),
  getExplanation: (userId) => api.get('/investment/explanation', { params: { userId } }),
  getTips: (userId) => api.get('/investment/tips', { params: { userId } }),
};

// Finance API calls
export const financeAPI = {
  getSummary: (userId) => api.get('/finance/summary', { params: { userId } }),
};

export default api;
