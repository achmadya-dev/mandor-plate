import type { AuthUpdateRequest, SessionUser } from '@mandor-plate/shared';
import {
  authUpdateRequestSchema,
  sessionUserSchema,
} from '@mandor-plate/shared';
import { apiUrl } from './constants';
import {
  ApiProxyError,
  authorizedApiFetch,
  parseApiErrorBody,
} from './backend';

export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const AVATAR_ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
]);

export function validateAvatarFile(file: File): string | null {
  if (!AVATAR_ALLOWED_TYPES.has(file.type)) {
    return 'Only JPG, PNG, or GIF images are allowed.';
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return 'Image must be 5 MB or smaller.';
  }

  return null;
}

export async function apiUploadFile(
  accessToken: string,
  file: File,
): Promise<{ id: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(apiUrl('/files/upload'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }

  const payload = (await response.json()) as {
    file: { id: string; path: string };
  };
  return payload.file;
}

export async function apiUpdateProfile(
  accessToken: string,
  body: AuthUpdateRequest,
): Promise<SessionUser> {
  const parsed = authUpdateRequestSchema.parse(body);
  const response = await authorizedApiFetch('/auth/me', accessToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  });

  if (!response.ok) {
    throw new ApiProxyError(response.status, await parseApiErrorBody(response));
  }

  return sessionUserSchema.parse(await response.json());
}

export async function apiUploadAvatar(
  accessToken: string,
  file: File,
): Promise<SessionUser> {
  const uploaded = await apiUploadFile(accessToken, file);
  return apiUpdateProfile(accessToken, { photo: { id: uploaded.id } });
}

export function mapUploadError(error: unknown): string {
  if (!(error instanceof ApiProxyError)) {
    return 'Upload failed. Try again.';
  }

  const body = error.body as { errors?: { file?: string } };
  if (body.errors?.file === 'cantUploadFileType') {
    return 'Only JPG, PNG, or GIF images are allowed.';
  }
  if (body.errors?.file === 'selectFile') {
    return 'Choose an image file to upload.';
  }

  return 'Upload failed. Check the file type and size, then try again.';
}
