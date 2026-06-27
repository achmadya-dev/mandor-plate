import type { ForgotPasswordRequest, ResetPasswordRequest } from '@mandor-plate/shared';
import {
  loginResponseSchema,
  refreshResponseSchema,
  sessionUserSchema,
  type EmailLoginRequest,
  type GoogleLoginRequest,
  type LoginResponse,
  type RefreshResponse,
  type RegisterRequest,
  type SessionUser,
} from '@mandor-plate/shared';
import { apiUrl } from './constants';

export async function parseApiErrorBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return { message: response.statusText || 'Request failed' };
  }
}

export async function apiLogin(body: EmailLoginRequest): Promise<LoginResponse> {
  const response = await fetch(apiUrl('/auth/email/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }

  return loginResponseSchema.parse(await response.json());
}

export async function apiRegister(body: RegisterRequest): Promise<void> {
  const response = await fetch(apiUrl('/auth/email/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }
}

export async function apiGoogleLogin(body: GoogleLoginRequest): Promise<LoginResponse> {
  const response = await fetch(apiUrl('/auth/google/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }

  return loginResponseSchema.parse(await response.json());
}

export async function apiForgotPassword(body: ForgotPasswordRequest): Promise<void> {
  const response = await fetch(apiUrl('/auth/forgot/password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }
}

export async function apiResetPassword(body: ResetPasswordRequest): Promise<void> {
  const response = await fetch(apiUrl('/auth/reset/password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }
}

export async function apiRefresh(refreshToken: string): Promise<RefreshResponse> {
  const response = await fetch(apiUrl('/auth/refresh'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }

  return refreshResponseSchema.parse(await response.json());
}

export async function apiMe(accessToken: string): Promise<SessionUser> {
  const response = await fetch(apiUrl('/auth/me'), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }

  return sessionUserSchema.parse(await response.json());
}

export async function apiLogout(accessToken: string): Promise<void> {
  const response = await fetch(apiUrl('/auth/logout'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }
}

export class ApiProxyError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super('API proxy request failed');
    this.name = 'ApiProxyError';
  }
}

/** Server-side fetch helper — injects access token from cookies when present. */
export async function authorizedApiFetch(
  path: string,
  accessToken: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);

  return fetch(apiUrl(path), {
    ...init,
    headers,
    cache: 'no-store',
  });
}
