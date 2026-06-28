import 'server-only';

import { cookies, headers } from 'next/headers';

async function getRequestOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');

  if (host) {
    const protocol = headersList.get('x-forwarded-proto') ?? 'http';
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export async function serverApiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const path = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  const res = await fetch(`${await getRequestOrigin()}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
