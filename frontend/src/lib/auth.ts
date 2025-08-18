"use client";

import { apiFetch } from "@/lib/api";

let accessToken: string | null = null;
const TOKEN_KEY = "amora_token";

export function setToken(token: string | null) {
  accessToken = token;
  try {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    }
  } catch {}
}

export function getToken() {
  if (accessToken) return accessToken;
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        accessToken = stored;
        return accessToken;
      }
    }
  } catch {}
  return null;
}

export async function register(payload: { email: string; password: string; name?: string }) {
  return apiFetch("/register", { method: "POST", body: JSON.stringify(payload) });
}

export async function login(payload: { username: string; password: string }) {
  // Backend expects OAuth2 form data (username/password)
  const body = new URLSearchParams();
  body.set("username", payload.username);
  body.set("password", payload.password);
  return apiFetch<{ access_token: string; token_type: string }>("/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  } as unknown as RequestInit).then((res) => {
    setToken(res.access_token);
    return res;
  });
}

export type CurrentUser = { id: number; email: string; name?: string | null };

export async function me(): Promise<CurrentUser> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return apiFetch<CurrentUser>("/users/me", {}, token);
}

export function logout() {
  setToken(null);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
