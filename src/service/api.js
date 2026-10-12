// Contoh src/services/api.js menggunakan Axios/Fetch
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_API_URL

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lp_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;