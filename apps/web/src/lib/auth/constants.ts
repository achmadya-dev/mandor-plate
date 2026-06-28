export const ACCESS_TOKEN_COOKIE = 'mp_access_token';
export const REFRESH_TOKEN_COOKIE = 'mp_refresh_token';

export function getApiBaseUrl(): string {
  return process.env.API_URL ?? 'http://localhost:3001';
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api/v1${normalized}`;
}

export const AUTH_PUBLIC_PATHS = [
  '/auth',
  '/about',
  '/privacy-policy',
  '/terms-of-service',
];

export function isDashboardPath(pathname: string): boolean {
  return pathname === '/dashboard' || pathname.startsWith('/dashboard/');
}

export function isAuthApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/auth');
}
