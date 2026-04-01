import axios from 'axios';

const useProductionApi = process.env.NEXT_PUBLIC_USE_PRODUCTION_API === 'true';

const baseURL = useProductionApi
  ? 'http://localhost:80/api/v1'
  : 'http://localhost:5000/api/v1';

console.log('NEXT_PUBLIC_USE_PRODUCTION_API:', process.env.NEXT_PUBLIC_USE_PRODUCTION_API);
console.log('Axios baseURL:', baseURL);

const api = axios.create({
  baseURL,
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