/**
 * Client-side BFF fetch pattern — browser never calls the NestJS API directly.
 * Always use credentials: 'include' so httpOnly auth cookies are sent.
 */
import type { SessionUser } from '@mandor-plate/shared';
import { sessionUserSchema } from '@mandor-plate/shared';

export async function fetchBff<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ data?: T; error?: unknown; status: number }> {
  const response = await fetch(path, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return { status: response.status };
  }

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    return { status: response.status, error: body };
  }

  return { status: response.status, data: body as T };
}

export type MeResponse = {
  user: SessionUser;
};

export async function fetchCurrentUser() {
  const result = await fetchBff<MeResponse>('/api/auth/me');
  if (result.data?.user) {
    return {
      ...result,
      data: { user: sessionUserSchema.parse(result.data.user) },
    };
  }
  return result;
}

export async function logoutViaBff() {
  return fetchBff<void>('/api/auth/logout', { method: 'POST' });
}
