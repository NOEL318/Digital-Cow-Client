/**
 * Este archivo expone el contexto de autenticacion con el usuario actual y las acciones de login y logout.
 */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi } from './api';
import { AuthStorage } from '@/lib/auth-storage';
import type { Me } from './types';

interface AuthCtx {
  user: Me | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { accountName: string; fullName: string; email: string; password: string; locale: 'es' | 'en' }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>(null as unknown as AuthCtx);

/** Provee estado de auth global. Hidrata desde localStorage al montar. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (AuthStorage.getAccess()) await refreshMe();
      setLoading(false);
    })();
  }, [refreshMe]);

  const login = useCallback(async (email: string, password: string) => {
    const t = await authApi.login(email, password);
    AuthStorage.setTokens(t.accessToken, t.refreshToken);
    await refreshMe();
  }, [refreshMe]);

  const register = useCallback(async (payload: Parameters<AuthCtx['register']>[0]) => {
    const t = await authApi.register(payload);
    AuthStorage.setTokens(t.accessToken, t.refreshToken);
    await refreshMe();
  }, [refreshMe]);

  const logout = useCallback(async () => {
    const r = AuthStorage.getRefresh();
    if (r) await authApi.logout(r).catch(() => {});
    AuthStorage.clear();
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, loading, login, register, logout, refreshMe }}>{children}</Ctx.Provider>;
}

// Este hook expone los datos y acciones de Auth.
export const useAuth = () => useContext(Ctx);
