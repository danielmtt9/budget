import axios from 'axios';

const API_URL = 'http://localhost:8002';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
});

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export const getTransactions = async (tags?: string) => {
  const response = await api.get('/transactions/', { params: { tags } });
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUser = async (data: { simplefin_access_url?: string }) => {
  const response = await api.put('/users/me', data);
  return response.data;
};

export const triggerSync = async () => {
  const response = await api.post('/sync/');
  return response.data;
};

export const getTags = async () => {
  const response = await api.get('/tags/');
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

export const getDashboardData = async () => {
  // Placeholder for dashboard specific endpoint if created,
  // otherwise we might calculate from transactions or use analytics endpoints
  // For now, return empty structure or call valid endpoints
  return {}; 
};

export default api;