import axios from 'axios';

const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'https://fromtheheart-production-e892.up.railway.app')
  .replace(/\/$/, '');
const baseURL = `${apiOrigin}/api/v1`;

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
