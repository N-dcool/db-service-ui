import { authFetch, ensureOk, json, jsonOrNull, rawFetch } from "./http";
import { clearToken, getRefreshToken } from "./tokens";
import { AuthResult, DbRecord, QueryResult, User } from "./types";

// Helper: seconds util expiry
export function expiresInSeconds(db: DbRecord): number {
  return Math.max(
    0,
    Math.floor((new Date(db.expiresAt).getTime() - Date.now()) / 1000),
  );
}

// Auth
export async function register(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResult> {
  const res = await rawFetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      displayName: displayName,
    }),
  });

  return json<AuthResult>(res, "Registration failed");
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const res = await rawFetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return json<AuthResult>(res, "Invalid email or password");
}

export async function logout(): Promise<void> {
  const rt = getRefreshToken();
  if (rt) {
    await rawFetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: rt }),
    }).catch(() => {});
  }
  clearToken();
}

export async function getMe(): Promise<User> {
  return json<User>(await authFetch("/auth/me"), "Unauthorized");
}

// Database
export async function createDb(engine = "postgresql"): Promise<DbRecord> {
  const res = await authFetch("/db/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ engine }),
  });

  return json<DbRecord>(res, "Failed to create database");
}

export async function getDbStatus(): Promise<DbRecord | null> {
  return jsonOrNull<DbRecord>(
    await authFetch("/db/status"),
    "Failed to fetch database status",
  );
}

export async function deleteDb(): Promise<void> {
  await ensureOk(
    await authFetch("/db/delete", { method: "DELETE" }),
    "Failed to delete database",
  );
}

export async function restartDb(): Promise<void> {
  await ensureOk(
    await authFetch("/db/restart", { method: "POST" }),
    "Failed to restart database",
  );
}

// Playground

export async function executeQuery(sql: string): Promise<QueryResult> {
  const res = await authFetch("/playground/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sql }),
  });

  return json<QueryResult>(res, "Query failed");
}

export async function getTables(): Promise<
  Record<
    string,
    { column_name: string; data_type: string; is_nullable: string }[]
  >
> {
  return json(await authFetch("/playground/tables"), "Failed to fetch tables");
}
