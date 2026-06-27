import { NextResponse } from 'next/server';
import { apiLogout, ApiProxyError } from '@/lib/auth/backend';
import { clearAuthCookies, readTokensFromRequest } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  const { accessToken } = readTokensFromRequest(request);

  try {
    if (accessToken) {
      await apiLogout(accessToken);
    }
  } catch (error) {
    if (error instanceof ApiProxyError && error.status !== 401) {
      return NextResponse.json(error.body, { status: error.status });
    }
  }

  const response = new NextResponse(null, { status: 204 });
  return clearAuthCookies(response);
}
