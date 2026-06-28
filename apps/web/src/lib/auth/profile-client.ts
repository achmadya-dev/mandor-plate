import type { SessionUser } from '@mandor-plate/shared';
import { sessionUserSchema } from '@mandor-plate/shared';

export async function uploadAvatarViaBff(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/profile/avatar', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message =
      (body as { errors?: { file?: string[] } })?.errors?.file?.[0] ??
      'Upload failed. Try again.';
    return { status: response.status, error: message };
  }

  return {
    status: response.status,
    data: {
      user: sessionUserSchema.parse((body as { user: SessionUser }).user),
    },
  };
}

export function refreshSessionUser() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('session:refresh'));
  }
}
