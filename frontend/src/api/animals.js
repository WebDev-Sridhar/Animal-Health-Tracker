import { apiClient } from './client';

export const animalsApi = {
  getNearby: (lat, lng, radius = 10000) =>
    apiClient.get(`/animals/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
};
