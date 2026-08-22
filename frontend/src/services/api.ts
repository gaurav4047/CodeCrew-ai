import axios from 'axios';
import type { TrackingConfig, Insight, InsightStats } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const trackingAPI = {
  create: async (config: Partial<TrackingConfig>) => {
    const response = await api.post<TrackingConfig>('/api/tracking/', config);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<TrackingConfig[]>('/api/tracking/');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<TrackingConfig>(`/api/tracking/${id}`);
    return response.data;
  },

  update: async (id: number, config: Partial<TrackingConfig>) => {
    const response = await api.put<TrackingConfig>(`/api/tracking/${id}`, config);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/api/tracking/${id}`);
    return response.data;
  },
};

export const insightsAPI = {
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    priority?: string;
    category?: string;
    unread_only?: boolean;
  }) => {
    const response = await api.get<Insight[]>('/api/insights/', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Insight>(`/api/insights/${id}`);
    return response.data;
  },

  update: async (id: number, data: { is_read: boolean }) => {
    const response = await api.put<Insight>(`/api/insights/${id}`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<InsightStats>('/api/insights/stats/summary');
    return response.data;
  },
};

export default api;
