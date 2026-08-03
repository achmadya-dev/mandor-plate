import {
  confirmEmailRequestSchema,
  safeParseWithSchema,
} from '@mandor-plate/shared';
import { NextResponse } from 'next/server';
import { apiConfirmNewEmail, ApiProxyError } from '@/lib/auth/backend';

export async function POST(request: Request) {
  const parsed = safeParseWithSchema(
    confirmEmailRequestSchema,
    await request.json(),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { status: 422, errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    await apiConfirmNewEmail(parsed.data);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ApiProxyError) {
      return NextResponse.json(error.body, { status: error.status });
    }
    throw error;
  }
}
