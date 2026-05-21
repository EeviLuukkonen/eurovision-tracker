import type { User } from '../types/user';
import type { ApiResponse } from '../types/api/response';
import { API_BASE } from './base';

export const login = async ({ email, password }: { email: string; password: string }): Promise<User> => {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  let json: ApiResponse<User> | null = null;

  try {
    json = (await response.json()) as ApiResponse<User>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Failed to log in (status ${response.status})`);
  }

  if (!json?.success || !json?.data) {
    throw new Error(json?.error ?? 'Failed to log in');
  }

  return json.data;
};

export const signup = async ({ email, username, password }: { email: string; username: string; password: string }): Promise<User> => {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, username, password }),
  });

  let json: ApiResponse<User> | null = null;

  try {
    json = (await response.json()) as ApiResponse<User>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Failed to sign up (status ${response.status})`);
  }

  if (!json?.success || !json?.data) {
    throw new Error(json?.error ?? 'Failed to sign up');
  }

  return json.data;
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  let json: ApiResponse<unknown> | null = null;

  try {
    json = (await response.json()) as ApiResponse<unknown>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Failed to log out (status ${response.status})`);
  }
};

export const deleteAccount = async (): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    let json: ApiResponse<unknown> | null = null;
    try { json = (await response.json()) as ApiResponse<unknown>; } catch { json = null; }
    throw new Error(json?.error ?? `Failed to delete account (status ${response.status})`);
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  let json: ApiResponse<User> | null = null;

  try {
    json = (await response.json()) as ApiResponse<User>;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(json?.error ?? `Failed to fetch current user (status ${response.status})`);
  }

  if (!json?.success || !json?.data) {
    throw new Error(json?.error ?? 'Failed to fetch current user');
  }

  return json.data;
};
