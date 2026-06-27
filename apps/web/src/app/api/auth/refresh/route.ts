import { NextResponse } from 'next/server';
import { apiRefresh, ApiProxyError } from '@/lib/auth/backend';
import { applyAuthCookies, readTokensFromRequest } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  const { refreshToken } = readTokensFromRequest(request);

  if (!refreshToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tokens = await apiRefresh(refreshToken);
    const response = NextResponse.json({ ok: true });
    return applyAuthCookies(response, tokens);
  } catch (error) {
    if (error instanceof ApiProxyError) {
      return NextResponse.json(error.body, { status: error.status });
    }
    throw error;
  }
}
