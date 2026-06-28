import type { TokenPair } from '@mandor-plate/shared';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './constants';

const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function authCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export function applyAuthCookies(
  response: NextResponse,
  tokens: TokenPair,
): NextResponse {
  const accessMaxAge = Math.max(
    60,
    Math.floor((tokens.tokenExpires - Date.now()) / 1000),
  );

  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.token,
    authCookieOptions(accessMaxAge),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    authCookieOptions(REFRESH_MAX_AGE_SECONDS),
  );

  return response;
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    ...authCookieOptions(0),
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    ...authCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

export function readTokensFromRequest(request: Request): {
  accessToken?: string;
  refreshToken?: string;
} {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const accessToken = getCookieValue(cookieHeader, ACCESS_TOKEN_COOKIE);
  const refreshToken = getCookieValue(cookieHeader, REFRESH_TOKEN_COOKIE);
  return { accessToken, refreshToken };
}

export function getCookieValue(
  cookieHeader: string,
  name: string,
): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}
