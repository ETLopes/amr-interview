// API Configuration with proper environment handling
import { getApiUrl, logEnvironment } from '@/config/environment';
import { logout } from "@/lib/auth";

// Log environment configuration in development
if (typeof window !== 'undefined') {
  logEnvironment();
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = getApiUrl(path);
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof URLSearchParams)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  console.log(`🌐 API Request: ${url}`); // Debug logging

  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!res.ok) {
    interface ApiError {
      status: number;
      message?: string;
      detail?: string;
      [key: string]: unknown;
    }
    let error: ApiError = { status: res.status, message: res.statusText };
    try {
      const body = (await res.json()) as unknown;
      if (typeof body === "object" && body !== null) {
        error = { ...error, ...(body as Record<string, unknown>) };
      }
    } catch {}
    if (res.status === 401) {
      try {
        logout();
      } catch {}
    }
    throw error;
  }
  return (await res.json()) as T;
}
