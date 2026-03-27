import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  withCredentials: true, // if using cookies
});

// Request interceptor (attach token, access, refresh, etc.)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor (handle errors globally)
API.interceptors.response.use(
  (response) => {
    // any global success handling
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - maybe logout or refresh token');
      // e.g., perform a logout action or attempt a token refresh
    }
    return Promise.reject(error);
  }
);

export default API;
