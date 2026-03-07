// src/services/leaderboard.service.ts

import { api } from './apiClient';

export const leaderboardService = {
  async getGlobal(page = 1, limit = 20) {
    const { data } = await api.get('/leaderboard', { params: { page, limit } });
    return data.data;
  },

  async getMyRank() {
    const { data } = await api.get('/leaderboard/me');
    return data.data as { rank: number | null; xp: number };
  },
};