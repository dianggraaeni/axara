// src/services/quests.service.ts
// Ambil pertanyaan, buat sesi, submit sesi, history.

import { api } from './apiClient';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category?: string;
}

export type GameType = 'guess_culture' | 'memory_match' | 'province_puzzle';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const questsService = {
  async getQuestions(provinceId: string, count = 3, difficulty: Difficulty = 'easy', gameType: GameType = 'guess_culture'): Promise<QuizQuestion[]> {
    const { data } = await api.get('/quests/questions', {
      params: { provinceId, count, difficulty, gameType },
    });
    return data.data;
  },

  async createSession(provinceId: string, gameType: GameType, questionsData: QuizQuestion[]) {
    const { data } = await api.post('/quests/sessions', { provinceId, gameType, questionsData });
    return data.data as { sessionId: string };
  },

  async submitSession(sessionId: string, answers: number[], durationSeconds?: number) {
    const { data } = await api.post(`/quests/sessions/${sessionId}/submit`, {
      answers,
      durationSeconds,
    });
    return data.data;
  },

  async getHistory(page = 1, limit = 10) {
    const { data } = await api.get('/quests/sessions/history', { params: { page, limit } });
    return data.data;
  },
};