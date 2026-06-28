function resolveApiUrl(endpoint: string): string {
  const path = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (typeof window !== 'undefined') {
    return path;
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${origin}${path}`;
}

async function getServerCookieHeader(): Promise<string | undefined> {
  if (typeof window !== 'undefined') {
    return undefined;
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const header = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  return header || undefined;
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const cookieHeader = await getServerCookieHeader();

  const res = await fetch(resolveApiUrl(endpoint), {
    ...options,
    cache: 'no-store',
    credentials: typeof window !== 'undefined' ? 'include' : undefined,
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
