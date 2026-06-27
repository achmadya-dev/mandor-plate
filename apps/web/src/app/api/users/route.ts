import { NextRequest } from 'next/server';
import { authorizedApiFetch, parseApiErrorBody } from '@/lib/auth/backend';
import { jsonWithSessionCookies, requireAdmin } from '@/lib/auth/route-guards';
import type { ApiUser, ApiUsersPage } from '@/features/users/api/types';
import { buildUsersQuery, toCreateUserBody } from '@/features/users/api/types';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = request.nextUrl;
  const filters = {
    page: Number(searchParams.get('page') ?? 1),
    limit: Number(searchParams.get('limit') ?? 10),
    roles: searchParams.get('roles') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const query = buildUsersQuery(filters);
  const response = await authorizedApiFetch(
    `/users?${query}`,
    auth.session.accessToken,
  );

  if (!response.ok) {
    return jsonWithSessionCookies(
      await parseApiErrorBody(response),
      { status: response.status },
      auth.session,
    );
  }

  const data = (await response.json()) as ApiUsersPage;
  return jsonWithSessionCookies(data, undefined, auth.session);
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json();
  const response = await authorizedApiFetch(
    '/users',
    auth.session.accessToken,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toCreateUserBody(body)),
    },
  );

  if (!response.ok) {
    return jsonWithSessionCookies(
      await parseApiErrorBody(response),
      { status: response.status },
      auth.session,
    );
  }

  const data = (await response.json()) as ApiUser;
  return jsonWithSessionCookies(data, { status: 201 }, auth.session);
}
