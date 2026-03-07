import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/apiClient';
 
// ── User Stats ────────────────────────────────────────────────────────
export const useStats = () =>
  useQuery({ queryKey: ['stats'], queryFn: () => api.get('/users/me/stats').then(r => r.data.data) });
 
// ── Culture Passport ──────────────────────────────────────────────────
export const usePassport = () =>
  useQuery({ queryKey: ['passport'], queryFn: () => api.get('/users/me/passport').then(r => r.data.data) });
 
// ── Provinces (Map page) ──────────────────────────────────────────────
export const useProvinces = () =>
  useQuery({ queryKey: ['provinces'], queryFn: () => api.get('/provinces').then(r => r.data.data) });
 
export const useProvince = (id: string) =>
  useQuery({ queryKey: ['province', id], queryFn: () => api.get(`/provinces/${id}`).then(r => r.data.data), enabled: !!id });
 
// ── Visit Province ────────────────────────────────────────────────────
export const useVisitProvince = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (provinceId: string) => api.post(`/provinces/${provinceId}/visit`).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['provinces'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};
 
// ── Quiz Questions ────────────────────────────────────────────────────
export const useQuizQuestions = (provinceId: string, enabled = false) =>
  useQuery({
    queryKey: ['quiz-questions', provinceId],
    queryFn: () => api.get(`/quests/questions?provinceId=${provinceId}&count=3`).then(r => r.data.data),
    enabled,
    staleTime: 5 * 60_000, // 5 menit
  });
 
// ── Submit Quiz ───────────────────────────────────────────────────────
export const useSubmitQuiz = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, answers, durationSeconds }: { sessionId: string; answers: number[]; durationSeconds?: number }) =>
      api.post(`/quests/sessions/${sessionId}/submit`, { answers, durationSeconds }).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['stats'] });
      qc.invalidateQueries({ queryKey: ['passport'] });
      qc.invalidateQueries({ queryKey: ['provinces'] });
    },
  });
};
 
// ── Badges ────────────────────────────────────────────────────────────
export const useMyBadges = () =>
  useQuery({ queryKey: ['my-badges'], queryFn: () => api.get('/users/me/badges').then(r => r.data.data) });
 
// ── Leaderboard ───────────────────────────────────────────────────────
export const useLeaderboard = (page = 1) =>
  useQuery({ queryKey: ['leaderboard', page], queryFn: () => api.get(`/leaderboard?page=${page}`).then(r => r.data.data) });
 
export const useMyRank = () =>
  useQuery({ queryKey: ['my-rank'], queryFn: () => api.get('/leaderboard/me').then(r => r.data.data) });
