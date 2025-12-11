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

export const getDashboardData = async () => {
  // Placeholder for dashboard specific endpoint if created,
  // otherwise we might calculate from transactions or use analytics endpoints
  // For now, return empty structure or call valid endpoints
  return {}; 
};

export default api;