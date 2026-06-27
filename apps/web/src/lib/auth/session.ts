import { NextResponse } from 'next/server';
import type { SessionUser, TokenPair } from '@mandor-plate/shared';
import { ApiProxyError, apiMe, apiRefresh } from './backend';
import { applyAuthCookies, readTokensFromRequest } from './cookies';

export type SessionResult =
  | { user: SessionUser; tokens?: TokenPair }
  | { user: null; tokens?: undefined };

export async function resolveSession(request: Request): Promise<SessionResult> {
  const { accessToken, refreshToken } = readTokensFromRequest(request);

  if (accessToken) {
    try {
      const user = await apiMe(accessToken);
      return { user };
    } catch (error) {
      if (!(error instanceof ApiProxyError) || error.status !== 401 || !refreshToken) {
        return { user: null };
      }
    }
  }

  if (!refreshToken) {
    return { user: null };
  }

  try {
    const tokens = await apiRefresh(refreshToken);
    const user = await apiMe(tokens.token);
    return { user, tokens };
  } catch {
    return { user: null };
  }
}

export function jsonWithOptionalAuthCookies(
  body: unknown,
  init: ResponseInit | undefined,
  tokens?: TokenPair,
): NextResponse {
  const response = NextResponse.json(body, init);
  if (tokens) {
    applyAuthCookies(response, tokens);
  }
  return response;
}
