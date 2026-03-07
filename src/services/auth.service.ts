// src/services/auth.service.ts
// Semua fungsi autentikasi: register, login, logout, refresh.

import { api, setToken } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  gender: 'male' | 'female' | null;
  xp: number;
  level: number;
  streakDays: number;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(email: string, username: string, password: string, gender?: 'male' | 'female'): Promise<AuthResponse> {
    const { data } = await api.post('/auth/register', { email, username, password, gender });
    const result: AuthResponse = data.data;
    setToken(result.accessToken);
    localStorage.setItem('axara_refresh', result.refreshToken);
    localStorage.setItem('axara_user', JSON.stringify(result.user));
    return result;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', { email, password });
    const result: AuthResponse = data.data;
    setToken(result.accessToken);
    localStorage.setItem('axara_refresh', result.refreshToken);
    localStorage.setItem('axara_user', JSON.stringify(result.user));
    return result;
  },

  async logout(): Promise<void> {
    const refresh = localStorage.getItem('axara_refresh');
    if (refresh) {
      try { await api.post('/auth/logout', { refreshToken: refresh }); } catch { /* ignore */ }
    }
    setToken(null);
    localStorage.removeItem('axara_refresh');
    localStorage.removeItem('axara_user');
  },

  // Restore session saat app mount (access token hilang karena page reload)
  async restoreSession(): Promise<AuthUser | null> {
    const refresh = localStorage.getItem('axara_refresh');
    const cachedUser = localStorage.getItem('axara_user');
    if (!refresh) return null;
    try {
      const { data } = await api.post('/auth/refresh', { refreshToken: refresh });
      setToken(data.data.accessToken);
      localStorage.setItem('axara_refresh', data.data.refreshToken);
      // Ambil profil terbaru dari server
      const { data: profileData } = await api.get('/users/me');
      const user = profileData.data;
      localStorage.setItem('axara_user', JSON.stringify(user));
      return user;
    } catch {
      // Refresh gagal, bersihkan
      setToken(null);
      localStorage.removeItem('axara_refresh');
      localStorage.removeItem('axara_user');
      return null;
    }
  },

  getCachedUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem('axara_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
};