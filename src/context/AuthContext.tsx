// src/context/AuthContext.tsx
// Context untuk menyimpan state autentikasi user.
// Menggantikan bagian profile di useAppStore lama.

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/auth.service';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, gender?: 'male' | 'female') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek dulu apakah ada refresh token di localStorage.
    // Kalau tidak ada, langsung set isLoading = false tanpa hit API.
    const hasRefreshToken = !!localStorage.getItem('axara_refresh');
    if (!hasRefreshToken) {
      setIsLoading(false);
      return;
    }

    // Ada token, coba restore session dengan timeout 5 detik
    const timeout = setTimeout(() => {
      // Jika backend tidak merespons dalam 5 detik, anggap tidak login
      console.warn('Session restore timeout — backend mungkin belum jalan');
      localStorage.removeItem('axara_refresh');
      localStorage.removeItem('axara_user');
      setIsLoading(false);
    }, 5000);

    authService.restoreSession()
      .then((u) => {
        clearTimeout(timeout);
        setUser(u);
      })
      .catch(() => {
        clearTimeout(timeout);
        // restoreSession sudah bersihkan localStorage di dalamnya
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    setUser(result.user);
  };

  const register = async (email: string, username: string, password: string, gender?: 'male' | 'female') => {
    const result = await authService.register(email, username, password, gender);
    setUser(result.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (partial: Partial<AuthUser>) => {
    setUser((prev) => prev ? { ...prev, ...partial } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
