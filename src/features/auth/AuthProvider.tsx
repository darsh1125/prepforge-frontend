"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiClientError, apiRequest } from "@/lib/api/client";
import type { SafeUser } from "@/types/api";

type AuthContextValue = {
  user: SafeUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<SafeUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const response = await apiRequest<{ user: SafeUser }>("/api/auth/me");
      setUser(response.user);
      return response.user;
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    refresh,
    login: async (email, password) => {
      const response = await apiRequest<{ user: SafeUser }>("/api/auth/login", { method: "POST", body: { email, password } });
      setUser(response.user);
    },
    register: async (email, password) => {
      const response = await apiRequest<{ user: SafeUser }>("/api/auth/register", { method: "POST", body: { email, password } });
      setUser(response.user);
    },
    logout: async () => {
      await apiRequest<{ success: boolean }>("/api/auth/logout", { method: "POST" });
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
