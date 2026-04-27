import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api.js';
import type { User } from '../types/index.js';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  getMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function getMe(): Promise<void> {
    try {
      const res = await api.get<{ user: User }>('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
      localStorage.removeItem('token');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(token: string): Promise<void> {
    localStorage.setItem('token', token);
    await getMe();
  }

  function logout(): void {
    localStorage.removeItem('token');
    setUser(null);
    api.post('/auth/logout').catch(() => {});
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
