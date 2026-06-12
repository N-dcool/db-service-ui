const  BASE = '/api';


export interface DbRecord {
    id: string;
    connection_string: string;
    host: string;
    port: number;
    db_name: string;
    username: string;
    password: string;
    expires_at: number;
    expires_in_seconds: number;
    created_at: number;
}

export interface User {
    id: string;
    email: string;
    created_at: number;
}

async function request(path: string, options: RequestInit = {}): Promise<Response>{
    const res = await fetch(`${BASE}${path}`, options);

    if(res.status === 503) {
        const body = await res.json().catch(() => ({}));
        if(body.error === 'maintenance') {
            throw new Error('MAINTENANCE');
        }
    }

    return res;
} 

export async function register(email: string, password: string): Promise<{ token: string}> {
    const res = await request('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const body = await res.json();
    if(!res.ok) throw new Error(body.message ?? 'Registration failed');

    return body;
}

export async function login(email: string, password: string): Promise<{ token: string}> {
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

export async function createDb(token: string): Promise<DbRecord> {
    const res = await request('/db/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const body = await res.json();
    if(!res.ok) throw new Error(body.message ?? 'Failed to create database');

    return body;
}

export async function getDbStatus(token: string) : Promise<DbRecord | null> {
    const res = await request('/db/status', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(res.status === 404) return null;
    if(!res.ok) throw new Error('Failed to fetch database status');

    return res.json();
}

export async function deleteDb(token: string) : Promise<void> {
    const res = await request('/db/delete', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(!res.ok) throw new Error('Failed to delete database');
}



