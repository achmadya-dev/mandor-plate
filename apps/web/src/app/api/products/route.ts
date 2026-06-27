import { fakeProducts } from '@/constants/mock-api';
import { NextRequest } from 'next/server';
import {
  authenticateRequest,
  jsonWithSessionCookies,
} from '@/lib/auth/route-guards';

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { searchParams } = request.nextUrl;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);
  const categories = searchParams.get('categories') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const data = await fakeProducts.getProducts({
    page,
    limit,
    categories,
    search,
    sort,
  });

  return jsonWithSessionCookies(data, undefined, auth.session);
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.ok) {
    return auth.response;
  }

  const body = await request.json();
  const data = await fakeProducts.createProduct(body);
  return jsonWithSessionCookies(data, { status: 201 }, auth.session);
}
