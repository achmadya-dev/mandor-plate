import {
  apiUploadAvatar,
  mapUploadError,
  validateAvatarFile,
} from './profile';
import { ApiProxyError } from './backend';

describe('profile avatar helpers', () => {
  it('validates allowed image types and size', () => {
    expect(
      validateAvatarFile(new File(['x'], 'photo.jpg', { type: 'image/jpeg' })),
    ).toBeNull();
    expect(
      validateAvatarFile(new File(['x'], 'doc.pdf', { type: 'application/pdf' })),
    ).toContain('JPG');
    expect(
      validateAvatarFile(
        new File([new ArrayBuffer(6 * 1024 * 1024)], 'big.png', { type: 'image/png' }),
      ),
    ).toContain('5 MB');
  });

  it('maps API upload type errors to user-facing messages', () => {
    const error = new ApiProxyError(422, { errors: { file: 'cantUploadFileType' } });
    expect(mapUploadError(error)).toContain('JPG');
  });
});

describe('apiUploadAvatar', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('uploads a file then patches the current user profile', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            file: {
              id: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
              path: '/api/v1/files/x.png',
            },
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 1,
            email: 'admin@example.com',
            provider: 'email',
            firstName: 'Admin',
            lastName: 'User',
            photo: {
              id: 'cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae',
              path: 'http://localhost:3001/api/v1/files/x.png',
            },
            role: { id: 1, name: 'admin' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const user = await apiUploadAvatar('token123', file);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(user.photo?.id).toBe('cbcfa8b8-3a25-4adb-a9c6-e325f0d0f3ae');
  });
});
