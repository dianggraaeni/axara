// src/services/provinces.service.ts
// Daftar provinsi, detail, visit, progress.

import { api } from './apiClient';

export const provincesService = {
  async getAll() {
    const { data } = await api.get('/provinces');
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get(`/provinces/${id}`);
    return data.data;
  },

  async visit(id: string) {
    const { data } = await api.post(`/provinces/${id}/visit`);
    return data.data;
  },

  async getProgress(id: string) {
    const { data } = await api.get(`/provinces/${id}/progress`);
    return data.data;
  },
};