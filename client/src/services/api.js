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
  updateRatios: (userId, ratios) => api.put(`/users/${userId}/ratios`, ratios),
};

// Income API calls
export const incomeAPI = {
  add: (incomeData) => api.post('/income', incomeData),
  getAll: (userId) => api.get('/income', { params: { userId } }),
  getJarBalances: (userId) => api.get('/income/jars', { params: { userId } }),
};

// Expense API calls
export const expenseAPI = {
  add: (expenseData) => api.post('/expenses', expenseData),
  getAll: (userId) => api.get('/expenses', { params: { userId } }),
  getAnalytics: (userId) => api.get('/expenses/analytics', { params: { userId } }),
};

// AI Coach API
export const aiAPI = {
  coach: ({ prompt, context }) => api.post('/ai/coach', { prompt, context }),
};

export default api;
