import {
  resetPasswordRequestSchema,
  safeParseWithSchema,
} from '@mandor-plate/shared';
import { NextResponse } from 'next/server';
import { apiResetPassword, ApiProxyError } from '@/lib/auth/backend';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = safeParseWithSchema(resetPasswordRequestSchema, body);

  if (!parsed.success) {
    return NextResponse.json(
      { status: 422, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    await apiResetPassword(parsed.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiProxyError) {
      return NextResponse.json(error.body, { status: error.status });
    }
    throw error;
  }
}
