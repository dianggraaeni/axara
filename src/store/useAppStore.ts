import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: number;
}

export interface ProvinceProgress {
  provinceId: string;
  completedQuizzes: number;
  totalQuizzes: number;
  isUnlocked: boolean;
}

export interface UserProfile {
  name: string;
  avatar: string;
  gender: 'male' | 'female' | null;
}

interface AppState {
  profile: UserProfile;
  xp: number;
  level: number;
  badges: Badge[];
  provinces: Record<string, ProvinceProgress>;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addXp: (amount: number) => void;
  unlockBadge: (badge: Omit<Badge, 'unlockedAt'>) => void;
  unlockProvince: (provinceId: string) => void;
  completeQuiz: (provinceId: string) => void;
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: {
        name: 'Petualang',
        avatar: '🤠',
        gender: null,
      },
      xp: 0,
      level: 1,
      badges: [],
      provinces: {
        'bali': { provinceId: 'bali', completedQuizzes: 0, totalQuizzes: 3, isUnlocked: true },
        'jawa-tengah': { provinceId: 'jawa-tengah', completedQuizzes: 0, totalQuizzes: 3, isUnlocked: false },
        'sumatera-barat': { provinceId: 'sumatera-barat', completedQuizzes: 0, totalQuizzes: 3, isUnlocked: false },
        'papua': { provinceId: 'papua', completedQuizzes: 0, totalQuizzes: 3, isUnlocked: false },
        'sulawesi-selatan': { provinceId: 'sulawesi-selatan', completedQuizzes: 0, totalQuizzes: 3, isUnlocked: false },
      },
      updateProfile: (newProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...newProfile },
        })),
      addXp: (amount) =>
        set((state) => {
          const newXp = state.xp + amount;
          let newLevel = state.level;
          for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (newXp >= LEVEL_THRESHOLDS[i]) {
              newLevel = i + 1;
              break;
            }
          }
          return { xp: newXp, level: newLevel };
        }),
      unlockBadge: (badge) =>
        set((state) => {
          if (state.badges.some((b) => b.id === badge.id)) return state;
          return {
            badges: [...state.badges, { ...badge, unlockedAt: Date.now() }],
          };
        }),
      unlockProvince: (provinceId) =>
        set((state) => ({
          provinces: {
            ...state.provinces,
            [provinceId]: {
              ...state.provinces[provinceId],
              isUnlocked: true,
            },
          },
        })),
      completeQuiz: (provinceId) =>
        set((state) => {
          const province = state.provinces[provinceId];
          if (!province) return state;
          return {
            provinces: {
              ...state.provinces,
              [provinceId]: {
                ...province,
                completedQuizzes: Math.min(province.completedQuizzes + 1, province.totalQuizzes),
              },
            },
          };
        }),
    }),
    {
      name: 'axara-storage',
    }
  )
);
