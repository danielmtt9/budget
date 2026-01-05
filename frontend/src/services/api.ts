import axios from 'axios';

// Use relative URL in production, or detect host for dev
const getApiUrl = () => {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    // Check if we're accessing from Windows (WSL IP) or localhost
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // If accessing via WSL IP (172.x.x.x) or other non-localhost IP, use the same IP for backend
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '0.0.0.0') {
      console.log('Detected non-localhost hostname:', hostname, '- using for API');
      return `http://${hostname}:8002`;
    }
    // Default to localhost for local access
    return 'http://localhost:8002';
  }
  // In production, use relative URL (same host)
  return '';
};

// Get API URL - check immediately when module loads
let API_URL: string;
if (typeof window !== 'undefined') {
  API_URL = getApiUrl();
  console.log('API URL configured as:', API_URL, '(detected from hostname:', window.location.hostname + ')');
} else {
  API_URL = 'http://localhost:8002'; // Fallback for SSR
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  avatar_url?: string;
  simplefin_access_url?: string;
}

export interface TagRule {
  id: number;
  tag_id: number;
  pattern: string;
  match_type: 'contains' | 'exact' | 'regex';
  tag?: Tag;
}

export const getTransactions = async (tags?: string) => {
  const response = await api.get('/transactions/', { params: { tags } });
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUser = async (data: { full_name?: string; avatar_url?: string; simplefin_access_url?: string; }) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

export const setupSimplefin = async (setup_token: string) => {
  const response = await api.post('/sync/setup', { setup_token });
  return response.data;
};

export const triggerSync = async () => {
  const response = await api.post('/sync/run');
  return response.data;
};

export const getSyncStatus = async () => {
  const response = await api.get('/sync/status');
  return response.data;
};

export const getTags = async () => {
  const response = await api.get('/tags/');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const createTag = async (tag: { name: string, color?: string }) => {
  const response = await api.post('/tags/', tag);
  return response.data;
};

export const updateTransaction = async (id: number, data: any) => {
  const response = await api.patch(`/transactions/${id}`, data);
  return response.data;
};

export const getTagRules = async (): Promise<TagRule[]> => {
  const response = await api.get('/tag-rules/');
  return response.data;
};

export const createTagRule = async (rule: { tag_id: number; pattern: string; match_type: string }) => {
  const response = await api.post('/tag-rules/', rule);
  return response.data;
};

export const deleteTagRule = async (id: number) => {
  await api.delete(`/tag-rules/${id}`);
};

export const applyRulesToAll = async () => {
  const response = await api.post('/tag-rules/apply-all');
  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await api.get('/analytics/summary');
  return response.data;
};

export const getAccountSummaries = async () => {
  const response = await api.get('/analytics/account-summaries');
  return response.data;
};

export const getSpendingTrends = async () => {
  const response = await api.get('/analytics/trends');
  return response.data;
};

export const getDashboardData = async () => {
  const [summary, accounts, trends, transactions, user, categorySpending, syncStatus] = await Promise.all([
    getDashboardSummary(),
    getAccountSummaries(),
    getSpendingTrends(),
    getTransactions(),
    getUser(),
    getSpendingByCategory(),
    getSyncStatus()
  ]);

  return {
    summary,
    accounts,
    trends,
    recentTransactions: transactions,
    user,
    categorySpending,
    syncStatus
  };
};

export const updateCategory = async (id: number, data: { monthly_limit?: number; name?: string }) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};

export const getSpendingByCategory = async () => {
  const response = await api.get('/analytics/spending-by-category');
  return response.data;
};

export const categorizeTransaction = async (id: number, data: { category: string; create_rule: boolean; rule_keyword?: string }) => {
  const response = await api.post(`/transactions/${id}/categorize`, data);
  return response.data;
};

export default api;