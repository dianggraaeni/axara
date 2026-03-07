import axios from 'axios';
 
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';
 
// Token disimpan di memory (bukan localStorage - lebih aman)
let accessToken: string | null = null;
 
export const setToken = (token: string | null) => { accessToken = token; };
export const getToken = () => accessToken;
 
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
 
// Otomatis sisipkan token ke setiap request
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
 
// Auto refresh token saat 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('axara_refresh');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken: refresh });
        setToken(data.data.accessToken);
        localStorage.setItem('axara_refresh', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        setToken(null);
        localStorage.removeItem('axara_refresh');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
