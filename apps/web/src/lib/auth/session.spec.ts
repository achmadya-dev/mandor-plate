import { apiMe, apiRefresh, ApiProxyError } from './backend';
import { resolveSession } from './session';

jest.mock('./backend', () => ({
  apiMe: jest.fn(),
  apiRefresh: jest.fn(),
  ApiProxyError: class ApiProxyError extends Error {
    constructor(
      readonly status: number,
      readonly body: unknown,
    ) {
      super('API proxy request failed');
    }
  },
}));

const mockedApiMe = apiMe as jest.MockedFunction<typeof apiMe>;
const mockedApiRefresh = apiRefresh as jest.MockedFunction<typeof apiRefresh>;

describe('resolveSession', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns user when access token is valid', async () => {
    const user = {
      id: 1,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
    };
    mockedApiMe.mockResolvedValue(user);

    const request = new Request('http://localhost/api/auth/me', {
      headers: { cookie: 'mp_access_token=access123' },
    });

    await expect(resolveSession(request)).resolves.toEqual({ user });
  });

  it('refreshes tokens when access token is expired', async () => {
    mockedApiMe
      .mockRejectedValueOnce(
        new ApiProxyError(401, { message: 'Unauthorized' }),
      )
      .mockResolvedValueOnce({
        id: 1,
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
      });

    mockedApiRefresh.mockResolvedValue({
      token: 'new-access',
      refreshToken: 'new-refresh',
      tokenExpires: Date.now() + 60_000,
    });

    const request = new Request('http://localhost/api/auth/me', {
      headers: {
        cookie: 'mp_access_token=expired; mp_refresh_token=refresh123',
      },
    });

    const result = await resolveSession(request);
    expect(result.user?.email).toBe('admin@example.com');
    expect(result.tokens?.token).toBe('new-access');
  });

  it('returns null when no cookies are present', async () => {
    const request = new Request('http://localhost/api/auth/me');
    await expect(resolveSession(request)).resolves.toEqual({ user: null });
  });
});
