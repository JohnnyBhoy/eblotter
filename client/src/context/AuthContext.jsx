import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getMe() {
    try {
      const res = await api.get('/auth/me');
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

  function login(token) {
    localStorage.setItem('token', token);
    return getMe();
  }

  function logout() {
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

export function useAuth() {
  return useContext(AuthContext);
}
