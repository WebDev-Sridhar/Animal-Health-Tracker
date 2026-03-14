import { apiClient } from './client';

export const analyticsApi = {
  getAnalytics: (timeframe = "all") => apiClient.get(`/analytics?timeframe=${timeframe}`),
};
