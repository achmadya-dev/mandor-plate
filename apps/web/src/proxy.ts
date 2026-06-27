import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  isAuthApiPath,
  isDashboardPath,
} from '@/lib/auth/constants';
import { applyAuthCookies, getCookieValue } from '@/lib/auth/cookies';
import { isAdminOnlyPath, isAdminUser } from '@/lib/auth/rbac';
import { resolveSession } from '@/lib/auth/session';

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

  if (!accessToken && !refreshToken) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const session = await resolveSession(req);

  if (!session.user) {
    const signInUrl = new URL('/auth/sign-in', req.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminOnlyPath(pathname) && !isAdminUser(session.user)) {
    const forbiddenUrl = new URL('/dashboard/overview', req.url);
    forbiddenUrl.searchParams.set('error', 'forbidden');
    return NextResponse.redirect(forbiddenUrl);
  }

  let response = NextResponse.next();

  if (session.tokens) {
    response = applyAuthCookies(response, session.tokens);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

export { getCookieValue };
