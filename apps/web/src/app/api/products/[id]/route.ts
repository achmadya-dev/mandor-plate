import { fakeProducts } from '@/constants/mock-api';
import { NextRequest } from 'next/server';
import {
  authenticateRequest,
  jsonWithSessionCookies,
} from '@/lib/auth/route-guards';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;
  const data = await fakeProducts.getProductById(Number(id));

  if (!data.success) {
    return jsonWithSessionCookies(data, { status: 404 }, auth.session);
  }

  return jsonWithSessionCookies(data, undefined, auth.session);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;
  const body = await request.json();
  const data = await fakeProducts.updateProduct(Number(id), body);

  if (!data.success) {
    return jsonWithSessionCookies(data, { status: 404 }, auth.session);
  }

  return jsonWithSessionCookies(data, undefined, auth.session);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await params;
  const data = await fakeProducts.deleteProduct(Number(id));

  if (!data.success) {
    return jsonWithSessionCookies(data, { status: 404 }, auth.session);
  }

  return jsonWithSessionCookies(data, undefined, auth.session);
}
