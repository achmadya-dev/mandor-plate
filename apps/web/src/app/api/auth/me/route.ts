import { NextResponse } from 'next/server';
import { jsonWithOptionalAuthCookies, resolveSession } from '@/lib/auth/session';

export async function GET(request: Request) {
  const session = await resolveSession(request);

  if (!session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return jsonWithOptionalAuthCookies({ user: session.user }, undefined, session.tokens);
}
