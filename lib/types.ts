export interface DbRecord {
  id: string;
  engine: string;
  engineVersion: string;
  status: string;
  dbName: string;
  dbUser: string;
  hostPort: number;
  directUri: string | null;
  pooledUri: string | null;
  memoryLimitMb: number;
  storageLimitMb: number;
  ttlHours: number;
  expiresAt: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
}

export interface QueryResult {
  fields: string[] | null;
  rows: Record<string, unknown>[] | null;
  rowCount: number;
  ms: number;
  message: string | null;
}

export type AuthResult = { accessToken: string; refreshToken: string };
