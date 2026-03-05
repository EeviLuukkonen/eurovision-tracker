import type { User } from '../types/user';
import type { ApiResponse } from '../types/api/response';

export const login = async ({ email, password }: { email: string; password: string }): Promise<User> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorJson = (await response.json()) as ApiResponse<unknown>;
    throw new Error(errorJson.error ?? 'Failed to log in');
  }

  const json = (await response.json()) as ApiResponse<User>;

  if (!json.success || !json.data) {
    throw new Error(json.error ?? 'Failed to log in');
  }

  return json.data;
};
