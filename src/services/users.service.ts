// src/services/users.service.ts
// Profil, stats, passport, badge, upload avatar.

import { api } from './apiClient';

export const usersService = {
  async getMe() {
    const { data } = await api.get('/users/me');
    return data.data;
  },

  async getStats() {
    const { data } = await api.get('/users/me/stats');
    return data.data;
  },

  async getPassport() {
    const { data } = await api.get('/users/me/passport');
    return data.data;
  },

  async getBadges() {
    const { data } = await api.get('/users/me/badges');
    return data.data;
  },

  async updateProfile(payload: { username?: string; gender?: 'male' | 'female' }) {
    const { data } = await api.patch('/users/me', payload);
    return data.data;
  },

  async uploadAvatar(file: File) {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },
};