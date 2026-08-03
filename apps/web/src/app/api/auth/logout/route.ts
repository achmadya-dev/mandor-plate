import { NextResponse } from 'next/server';
import { apiLogout, ApiProxyError } from '@/lib/auth/backend';
import { clearAuthCookies, readTokensFromRequest } from '@/lib/auth/cookies';
import { resolveSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  const { accessToken } = readTokensFromRequest(request);

  try {
    const session = await resolveSession(request);
    const activeAccessToken = session.tokens?.token ?? accessToken;
    if (session.user && activeAccessToken) {
      await apiLogout(activeAccessToken);
    }
  } catch (error) {
    if (error instanceof ApiProxyError && error.status !== 401) {
      return NextResponse.json(error.body, { status: error.status });
    }
  }

  const response = new NextResponse(null, { status: 204 });
  return clearAuthCookies(response);
}
