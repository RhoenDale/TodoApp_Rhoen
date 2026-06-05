import { API_BASE_URL } from '@/constants/Config';

export type User = {
  id: number;
  name: string;
  email: string;
  darkMode: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
  apiVersion: string;
};

export type ProfileResponse = {
  user: User;
  apiVersion: string;
};

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  token?: string | null;
  body?: Record<string, unknown>;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const buildUrl = (path: string) =>
  `${API_BASE_URL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;

async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;

  try {
    response = await fetch(buildUrl(path), {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your API URL and internet connection.', 0);
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.message || 'Request failed.', response.status);
  }

  return data as T;
}

export const loginRequest = (email: string, password: string, appVersion: string) =>
  apiRequest<AuthResponse>('login.php', {
    method: 'POST',
    body: { email, password, appVersion },
  });

export const registerRequest = (
  name: string,
  email: string,
  password: string,
  appVersion: string
) =>
  apiRequest<AuthResponse>('register.php', {
    method: 'POST',
    body: { name, email, password, appVersion },
  });

export const fetchProfileRequest = (token: string) =>
  apiRequest<ProfileResponse>('profile.php', { token });

export const updateProfileRequest = (
  token: string,
  updates: { name?: string; darkMode?: boolean; appVersion?: string }
) =>
  apiRequest<ProfileResponse>('profile.php', {
    method: 'PATCH',
    token,
    body: updates,
  });

export const logoutRequest = (token: string) =>
  apiRequest<{ ok: boolean }>('logout.php', {
    method: 'POST',
    token,
  });
