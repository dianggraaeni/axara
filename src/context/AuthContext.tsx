// src/context/AuthContext.tsx
// FIX Bug 4: Session persist saat refresh browser.
// Perubahan dari kode asli:
// - useState diinisialisasi langsung dari authService.getCachedUser() (sudah ada di auth.service.ts)
// - restoreSession() tetap berjalan di background untuk refresh access token
// - Timeout 5 detik: jika backend tidak merespons, tetap pakai cached user (tidak paksa logout)
// - Hanya logout jika refresh token benar-benar invalid (restoreSession() throw error)

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
  // FIX: Inisialisasi langsung dari localStorage via getCachedUser()
  // sehingga user tidak null saat halaman pertama kali dimuat
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCachedUser());
  
  // FIX: isLoading hanya true jika ada refresh token yang perlu divalidasi
  // Jika tidak ada token sama sekali, langsung false tanpa hit API
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return !!localStorage.getItem('axara_refresh');
  });

  useEffect(() => {
    // Tidak ada refresh token → tidak perlu hit API sama sekali
    const hasRefreshToken = !!localStorage.getItem('axara_refresh');
    if (!hasRefreshToken) {
      setIsLoading(false);
      return;
    }

    // FIX: Timeout 5 detik — jika backend tidak merespons,
    // tetap pakai cached user (tidak paksa logout)
    const timeout = setTimeout(() => {
      console.warn('Session restore timeout — menggunakan cached user');
      // Tidak hapus localStorage, tidak logout — pakai cached user
      setIsLoading(false);
    }, 5000);

    authService.restoreSession()
      .then((u) => {
        clearTimeout(timeout);
        if (u) setUser(u);
        // Jika u null tapi tidak throw, berarti tidak ada sesi — tetap pakai cached
      })
      .catch(() => {
        clearTimeout(timeout);
        // restoreSession throw = refresh token invalid → logout paksa
        setUser(null);
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
