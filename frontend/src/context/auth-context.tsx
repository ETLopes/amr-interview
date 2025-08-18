"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { CurrentUser, login as loginApi, logout as logoutApi, getToken } from "@/lib/auth";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { me as fetchMe } from "@/lib/auth";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const enabled = !!getToken();
  const meQuery = useQuery({ queryKey: qk.me, queryFn: fetchMe, enabled, staleTime: 60_000 });

  useEffect(() => {
    if (meQuery.data) setUser(meQuery.data);
    if (!enabled) setUser(null);
    if (meQuery.isFetched || !enabled) setHydrated(true);
  }, [enabled, meQuery.data, meQuery.isFetched]);

  const login = async (email: string, password: string) => {
    await loginApi({ username: email, password });
    await qc.invalidateQueries({ queryKey: qk.me });
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    qc.clear();
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading: !hydrated || meQuery.isFetching,
    login,
    logout,
  }), [user, hydrated, meQuery.isFetching, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
