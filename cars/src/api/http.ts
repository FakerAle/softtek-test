import axios from 'axios';
import { useAuthStore } from '@/auth/authStore';

export const http = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) cfg.headers!.Authorization = `Bearer ${token}`;
  return cfg;
});
