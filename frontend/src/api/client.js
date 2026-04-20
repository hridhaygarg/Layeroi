import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const baseURL = process.env.REACT_APP_API_URL || 'https://api.layeroi.com';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout on 401 from auth-critical endpoints, not every API call
    // This prevents data-fetching 401s from logging the user out

    return Promise.reject(error);
  }
);

export default apiClient;
