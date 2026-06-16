const  BASE = '/api';


export interface DbRecord {
    id: string;
    engine: string;
    engineVersion: string;
    status: string;
    dbName: string;
    dbUser: string
    hostPort: number;
    directUri: string | null
    pooledUri: string | null;
    memoryLimitMb: number;
    storageLimitMb: number;
    ttlHours: number
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

// Helper: secondss util expiry
export function expiresInSeconds(db: DbRecord): number {
    return Math.max(0, Math.floor((new Date(db.expiresAt).getTime() - Date.now())/1000));
}

// Base request

async function request(path: string, options: RequestInit = {}): Promise<Response>{
    const res = await fetch(`${BASE}${path}`, options);

    if(res.status === 503) {
        const body = await res.json().catch(() => ({}));
        if(body.message === 'maintenance' || body.error === 'maintenance') {
            throw new Error('MAINTENANCE');
        }
    }
    return res;
}

async function parseError(res: Response, fallback: string): Promise<string> {
    try {
        const body = await res.json();
        return body.message ?? fallback;
    } catch {
        return res.status === 401 ? "Session expired - please log in again" : fallback;
    }
}

// Auth
export async function register(email: string, password: string, displayName?: string): Promise<{ accessToken: string}> {
    const res = await request('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, displayName: displayName || undefined })
    });

    const body = await res.json();
    if(!res.ok) throw new Error(body.message ?? 'Registration failed');

    return body;
}

export async function login(email: string, password: string): Promise<{ accessToken: string}> {
    const res = await request('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const body = await res.json();
    if(!res.ok) throw new Error(body.message ?? 'Invalid email or password');

    return body;
}

export async function getMe(token: string): Promise<User> {
    const res = await request('/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(!res.ok) throw new Error('Unauthorized');

    return res.json();
}

// Database
export async function createDb(token: string, engine = 'postgresql'): Promise<DbRecord> {
    const res = await request('/db/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({engine})
    });

    if(!res.ok) throw new Error(await parseError(res ,'Failed to create database'));

    return res.json();
}

export async function getDbStatus(token: string) : Promise<DbRecord | null> {
    const res = await request('/db/status', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(res.status === 404 || res.status === 204) return null;
    if(!res.ok) throw new Error(await parseError(res, 'Failed to fetch database status'));

    return res.json();
}

export async function deleteDb(token: string) : Promise<void> {
    const res = await request('/db/delete', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(!res.ok) throw new Error(await parseError(res, 'Failed to delete database'));
}

export async function restart(token: string): Promise<void> {
    const res = await request("/db/restart", {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`}
    });

    if(!res.ok) throw new Error(await parseError(res, "Failed to restart database"));
}

// Playground

export async function executeQuery(token: string, sql: string): Promise<QueryResult> {
    const res = await request('/playground/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,Authorization: `Bearer ${token}`},
        body: JSON.stringify({sql})
    });

    if(!res.ok) throw new Error(await parseError(res, "Query failed"));

    return res.json();
}

export async function getTables(token: string): Promise<Record<string, { column_name: string; data_type: string; is_nullable: string }[]>> {
    const res = await request("/playground/tables", {
        headers: {Authorization: `Bearer ${token}`}
    });

    if(!res.ok) throw new Error(await parseError(res, "Failed to fetch tables"));

    return res.json();
}



