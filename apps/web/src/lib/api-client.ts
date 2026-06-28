export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const path = `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const res = await fetch(path, {
    ...options,
    cache: 'no-store',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const details =
      errorBody && typeof errorBody === 'object' && 'errors' in errorBody
        ? ` — ${JSON.stringify((errorBody as { errors: unknown }).errors)}`
        : '';
    throw new Error(`API error: ${res.status} ${res.statusText}${details}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
