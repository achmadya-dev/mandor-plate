import { googleLoginRequestSchema, safeParseWithSchema } from '@mandor-plate/shared';
import { NextResponse } from 'next/server';
import { apiGoogleLogin, ApiProxyError } from '@/lib/auth/backend';
import { applyAuthCookies } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = safeParseWithSchema(googleLoginRequestSchema, body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: 422, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const data = await apiGoogleLogin(parsed.data);
    const response = NextResponse.json({ user: data.user });
    return applyAuthCookies(response, data);
  } catch (error) {
    if (error instanceof ApiProxyError) {
      return NextResponse.json(error.body, { status: error.status });
    }
    throw error;
  }
}
