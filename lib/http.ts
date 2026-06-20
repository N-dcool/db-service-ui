import { clearToken, getRefreshToken, getToken, saveTokens } from "./tokens";

const BASE = "/api";

// Token refresh (singleton promise to deduplicate concurrent calls)

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });

    if (!res.ok) return false;

    const body = await res.json();
    saveTokens(body.accessToken, body.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// Low level fetch

export async function rawFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const res = await fetch(`${BASE}${path}`, options);

  if (res.status === 503) {
    const clone = res.clone();
    const body = await clone.json().catch(() => ({}));
    if (body.message === "maintenance" || body.error === "maintenance") {
      throw new Error("MAINTENANCE");
    }
  }
  return res;
}

// Authentication fetch (auth header + 401 auto-refresh)
export async function authFetch(
  path: string,
  init: RequestInit = {},
  isRetry = false,
): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await rawFetch(path, { ...init, headers });

  if (res.status === 401 && !isRetry) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshToken().finally(() => {
        refreshPromise = null;
      });
    }
    if (await refreshPromise) return authFetch(path, init, true);

    clearToken();
    globalThis.location.href = "/login";
    throw new Error('Session expired - please log in again');
  }

  return res;
}

// Helpers

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return body.message ?? fallback;
  } catch {
    return res.status === 401
      ? "Session expired - please log in again"
      : fallback;
  }
}

export async function json<T>(res: Response, fallback: string): Promise<T> {
  if (!res.ok) throw new Error(await parseError(res, fallback));
  return res.json();
}

export async function jsonOrNull<T>(
  res: Response,
  fallback: string,
): Promise<T | null> {
  if (res.status === 404 || res.status === 204) return null;

  return json<T>(res, fallback);
}

export async function ensureOk(res: Response, fallback: string): Promise<void> {
  if (!res.ok) throw new Error(await parseError(res, fallback));
}
