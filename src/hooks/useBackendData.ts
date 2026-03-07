// src/hooks/useBackendData.ts
// Custom hooks untuk fetch data dari backend dengan loading/error state.

import { useState, useEffect, useCallback } from 'react';
import { provincesService } from '../services/provinces.service';
import { usersService } from '../services/users.service';
import { leaderboardService } from '../services/leaderboard.service';

// ─── useProvinces ─────────────────────────────────────────────────────────────
export function useProvinces() {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await provincesService.getAll();
      setProvinces(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Gagal memuat provinsi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { provinces, isLoading, error, refetch: fetch };
}

// ─── useUserStats ─────────────────────────────────────────────────────────────
export function useUserStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getStats();
      setStats(data);
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, isLoading, refetch: fetch };
}

// ─── useUserBadges ────────────────────────────────────────────────────────────
export function useUserBadges() {
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await usersService.getBadges();
      setBadges(data);
    } catch { /* ignore */ } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { badges, isLoading, refetch: fetch };
}

// ─── useLeaderboard ───────────────────────────────────────────────────────────
export function useLeaderboard(page = 1) {
  const [data, setData] = useState<any>(null);
  const [myRank, setMyRank] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [lb, rank] = await Promise.all([
          leaderboardService.getGlobal(page),
          leaderboardService.getMyRank(),
        ]);
        setData(lb);
        setMyRank(rank);
      } catch { /* ignore */ } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [page]);

  return { data, myRank, isLoading };
}