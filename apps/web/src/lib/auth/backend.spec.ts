import { ApiProxyError, apiForgotPassword, apiGoogleLogin, apiResetPassword, parseApiErrorBody } from './backend';

describe('ApiProxyError', () => {
  it('carries status and body for BFF forwarding', () => {
    const error = new ApiProxyError(422, { errors: { email: ['invalid'] } });
    expect(error.status).toBe(422);
    expect(error.body).toEqual({ errors: { email: ['invalid'] } });
  });
});

describe('parseApiErrorBody', () => {
  it('returns json body when present', async () => {
    const response = new Response(JSON.stringify({ message: 'bad' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

    await expect(parseApiErrorBody(response)).resolves.toEqual({ message: 'bad' });
  });

  it('falls back when body is not json', async () => {
    const response = new Response('nope', { status: 500, statusText: 'Server Error' });
    await expect(parseApiErrorBody(response)).resolves.toEqual({ message: 'Server Error' });
  });
});

describe('password recovery proxy', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('forwards google login requests to the API', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'access',
          refreshToken: 'refresh',
          tokenExpires: Date.now() + 60_000,
          user: {
            id: 1,
            email: 'user@gmail.com',
            provider: 'google',
            firstName: 'Test',
            lastName: 'User',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const result = await apiGoogleLogin({ idToken: 'google-id-token' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/google/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ idToken: 'google-id-token' }),
      }),
    );
    expect(result.token).toBe('access');
  });

  it('forwards forgot-password requests to the API', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 204 }));

    await apiForgotPassword({ email: 'user@example.com' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/forgot/password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
      }),
    );
  });

  it('forwards reset-password requests to the API', async () => {
    global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 204 }));

    await apiResetPassword({ hash: 'token123', password: 'newsecret' });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/reset/password'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ hash: 'token123', password: 'newsecret' }),
      }),
    );
  });

  it('throws ApiProxyError when reset token is invalid', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ errors: { hash: ['invalidHash'] } }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      apiResetPassword({ hash: 'bad', password: 'newsecret' }),
    ).rejects.toMatchObject({ status: 422 });
  });
});
