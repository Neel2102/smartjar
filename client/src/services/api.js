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

export default api;
