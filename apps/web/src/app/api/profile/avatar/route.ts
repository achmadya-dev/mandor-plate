import { NextResponse } from 'next/server';
import { ApiProxyError } from '@/lib/auth/backend';
import { readTokensFromRequest } from '@/lib/auth/cookies';
import {
  apiUploadAvatar,
  mapUploadError,
  validateAvatarFile,
} from '@/lib/auth/profile';

export async function POST(request: Request) {
  const { accessToken } = readTokensFromRequest(request);

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json(
      { status: 422, errors: { file: ['Choose an image file to upload.'] } },
      { status: 422 },
    );
  }

  const validationError = validateAvatarFile(file);
  if (validationError) {
    return NextResponse.json(
      { status: 422, errors: { file: [validationError] } },
      { status: 422 },
    );
  }

  try {
    const user = await apiUploadAvatar(accessToken, file);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof ApiProxyError) {
      return NextResponse.json(
        { status: error.status, errors: { file: [mapUploadError(error)] } },
        { status: error.status },
      );
    }
    throw error;
  }
}
