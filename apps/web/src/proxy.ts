import { NextRequest, NextResponse } from 'next/server';
import { apiRefresh, ApiProxyError } from '@/lib/auth/backend';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  isAuthApiPath,
  isDashboardPath,
} from '@/lib/auth/constants';
import { applyAuthCookies, getCookieValue } from '@/lib/auth/cookies';

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isAuthApiPath(pathname)) {
    return NextResponse.next();
  }

  if (!isDashboardPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const tokens = await apiRefresh(refreshToken);
      const response = NextResponse.next();
      return applyAuthCookies(response, tokens);
    } catch (error) {
      if (!(error instanceof ApiProxyError)) {
        throw error;
      }
    }
  }

  const signInUrl = new URL('/auth/sign-in', req.url);
  signInUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

// Re-export for tests — cookie parsing without NextRequest
export { getCookieValue };
