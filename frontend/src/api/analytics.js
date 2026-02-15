import { apiClient } from './client';

export const analyticsApi = {
  getAnalytics: () => apiClient.get('/analytics'),
};
