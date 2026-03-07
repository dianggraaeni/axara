// src/store/useAppStore.ts
// Store ini sekarang berperan sebagai LOCAL CACHE untuk data yang sudah di-fetch dari backend.
// State utama user (login, profil) ada di AuthContext.
// Gunakan hooks useProvinces(), useStats() dll untuk data real-time dari backend.

import { create } from 'zustand';

// Tipe sederhana untuk cache UI (tidak lagi jadi source of truth)
interface AppUIState {
  // Notifikasi badge yang baru di-unlock (untuk popup)
  pendingBadgeNotifications: string[];
  addBadgeNotification: (badgeId: string) => void;
  clearBadgeNotifications: () => void;

  // Session ID chat yang aktif (agar history tersimpan per sesi)
  activeChatSessionId: string | null;
  setActiveChatSessionId: (id: string | null) => void;
}

export const useAppStore = create<AppUIState>((set) => ({
  pendingBadgeNotifications: [],
  addBadgeNotification: (id) =>
    set((s) => ({ pendingBadgeNotifications: [...s.pendingBadgeNotifications, id] })),
  clearBadgeNotifications: () => set({ pendingBadgeNotifications: [] }),

  activeChatSessionId: null,
  setActiveChatSessionId: (id) => set({ activeChatSessionId: id }),
}));