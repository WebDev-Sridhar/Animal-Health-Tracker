const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('token');

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = { ...options.headers };
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  get: (endpoint) => apiClient.request(endpoint),
  post: (endpoint, body) =>
    apiClient.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (endpoint, body) => apiClient.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiClient.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => apiClient.request(endpoint, { method: 'DELETE' }),
};
