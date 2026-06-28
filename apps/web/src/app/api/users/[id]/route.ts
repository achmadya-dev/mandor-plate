import { NextRequest, NextResponse } from 'next/server';
import { authorizedApiFetch, parseApiErrorBody } from '@/lib/auth/backend';
import { applyAuthCookies } from '@/lib/auth/cookies';
import { jsonWithSessionCookies, requireAdmin } from '@/lib/auth/route-guards';
import type { ApiUser } from '@/features/users/api/types';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;
  const body = await request.json();

  const response = await authorizedApiFetch(
    `/users/${id}`,
    auth.session.accessToken,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
  return jsonWithSessionCookies(data, undefined, auth.session);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;

  const response = await authorizedApiFetch(
    `/users/${id}`,
    auth.session.accessToken,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    return jsonWithSessionCookies(
      await parseApiErrorBody(response),
      { status: response.status },
      auth.session,
    );
  }

  let deleteResponse = new NextResponse(null, { status: 204 });
  if (auth.session.tokens) {
    deleteResponse = applyAuthCookies(deleteResponse, auth.session.tokens);
  }
  return deleteResponse;
}
