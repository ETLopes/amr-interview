export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
import { logout } from "@/lib/auth";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof URLSearchParams)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

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
