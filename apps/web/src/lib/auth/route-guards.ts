import { NextResponse } from 'next/server';
import type { SessionUser, TokenPair } from '@mandor-plate/shared';
import { readTokensFromRequest, applyAuthCookies } from './cookies';
import { isAdminUser } from './rbac';
import { resolveSession } from './session';

export type AuthenticatedSession = {
  user: SessionUser;
  accessToken: string;
  tokens?: TokenPair;
};

export type GuardResult =
  | { ok: true; session: AuthenticatedSession }
  | { ok: false; response: NextResponse };

export async function authenticateRequest(
  request: Request,
): Promise<GuardResult> {
  const resolved = await resolveSession(request);

  if (!resolved.user) {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  const { accessToken } = readTokensFromRequest(request);
  const token = resolved.tokens?.token ?? accessToken;

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
    };
  }

  return {
    ok: true,
    session: {
      user: resolved.user,
      accessToken: token,
      tokens: resolved.tokens,
    },
  };
}

export async function requireAdmin(request: Request): Promise<GuardResult> {
  const auth = await authenticateRequest(request);

  if (!auth.ok) {
    return auth;
  }

  if (!isAdminUser(auth.session.user)) {
    return {
      ok: false,
      response: NextResponse.json({ message: 'Forbidden' }, { status: 403 }),
    };
  }

  return auth;
}

export function jsonWithSessionCookies(
  body: unknown,
  init: ResponseInit | undefined,
  session: AuthenticatedSession,
): NextResponse {
  const response = NextResponse.json(body, init);
  if (session.tokens) {
    return applyAuthCookies(response, session.tokens);
  }
  return response;
}

export type { SessionUser };
