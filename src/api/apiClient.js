import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kai_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kai_access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('kai_access_token');
    return apiClient.post('/auth/logout');
  },
  me: () => apiClient.get('/auth/me'),
  refreshToken: () => apiClient.post('/auth/refresh'),
};

// User API
export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.patch('/users/profile', data),
  getSettings: () => apiClient.get('/users/settings'),
  updateSettings: (data) => apiClient.patch('/users/settings', data),
};

// Memory API
export const memoryAPI = {
  list: (limit = 10) => apiClient.get(`/memories?limit=${limit}`),
  create: (data) => apiClient.post('/memories', data),
  get: (id) => apiClient.get(`/memories/${id}`),
  update: (id, data) => apiClient.patch(`/memories/${id}`, data),
  delete: (id) => apiClient.delete(`/memories/${id}`),
};

// Goals API
export const goalsAPI = {
  list: (limit = 5) => apiClient.get(`/goals?limit=${limit}`),
  create: (data) => apiClient.post('/goals', data),
  get: (id) => apiClient.get(`/goals/${id}`),
  update: (id, data) => apiClient.patch(`/goals/${id}`, data),
  delete: (id) => apiClient.delete(`/goals/${id}`),
};

// Context API
export const contextAPI = {
  get: () => apiClient.get('/context'),
  update: (data) => apiClient.patch('/context', data),
};

// Self Audit API
export const selfAuditAPI = {
  list: (limit = 10) => apiClient.get(`/self-audits?limit=${limit}`),
  create: (data) => apiClient.post('/self-audits', data),
};

// God Mode State API
export const godModeStateAPI = {
  get: () => apiClient.get('/god-mode-state'),
  create: (data) => apiClient.post('/god-mode-state', data),
};

// AI Functions API
export const aiAPI = {
  reasoning: (query) => apiClient.post('/ai/reasoning', { query }),
  creativity: () => apiClient.get('/ai/creativity'),
  evolution: () => apiClient.post('/ai/evolution'),
  selfEvolution: () => apiClient.post('/ai/self-evolution'),
  dailyBriefing: () => apiClient.get('/ai/daily-briefing'),
  suggestGoals: () => apiClient.get('/ai/suggest-goals'),
  metaCognition: () => apiClient.get('/ai/meta-cognition'),
  crossDomainFusion: (domains) => apiClient.post('/ai/cross-domain-fusion', { domains }),
  worldStateModeling: () => apiClient.get('/ai/world-state'),
  ontologyBuilder: () => apiClient.get('/ai/ontology'),
  omniversalIntegrator: () => apiClient.get('/ai/omniversal'),
};

// App Logs API
export const appLogsAPI = {
  logPageView: (pageName) => apiClient.post('/logs/page-view', { pageName }),
  logEvent: (eventType, data) => apiClient.post('/logs/event', { eventType, data }),
};

export default apiClient;
