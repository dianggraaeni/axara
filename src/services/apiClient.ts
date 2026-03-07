// src/services/apiClient.ts
// Menggantikan file apiClient.ts yang lama.
// Token disimpan di memory (lebih aman dari localStorage untuk accessToken).

import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

let accessToken: string | null = null;
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export const setToken = (token: string | null) => { accessToken = token; };
export const getToken = () => accessToken;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Sisipkan access token ke setiap request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Auto-refresh saat 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const refresh = localStorage.getItem('axara_refresh');
        if (!refresh) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh });
        const newAccess = data.data.accessToken;
        const newRefresh = data.data.refreshToken;

        setToken(newAccess);
        localStorage.setItem('axara_refresh', newRefresh);

        refreshQueue.forEach((cb) => cb(newAccess));
        refreshQueue = [];

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        setToken(null);
        localStorage.removeItem('axara_refresh');
        localStorage.removeItem('axara_user');
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
