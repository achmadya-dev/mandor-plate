import type { SessionUser } from '@mandor-plate/shared';
import { authenticateRequest, requireAdmin } from './route-guards';
import { resolveSession } from './session';

jest.mock('./session', () => ({
  resolveSession: jest.fn(),
}));

const mockResolveSession = jest.mocked(resolveSession);

const adminUser: SessionUser = {
  id: 1,
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: { id: 1, name: 'admin' },
};

describe('route-guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject unauthenticated requests', async () => {
    mockResolveSession.mockResolvedValue({ user: null });

    const result = await authenticateRequest(
      new Request('http://localhost/api/users'),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(401);
    }
  });

  it('should allow authenticated requests with an access token', async () => {
    mockResolveSession.mockResolvedValue({ user: adminUser });

    const request = new Request('http://localhost/api/users', {
      headers: { cookie: 'mp_access_token=test-token' },
    });

    const result = await authenticateRequest(request);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.session.user).toEqual(adminUser);
      expect(result.session.accessToken).toBe('test-token');
    }
  });

  it('should require admin role for admin-only routes', async () => {
    mockResolveSession.mockResolvedValue({
      user: { ...adminUser, role: { id: 2, name: 'user' } },
    });

    const request = new Request('http://localhost/api/users', {
      headers: { cookie: 'mp_access_token=test-token' },
    });

    const result = await requireAdmin(request);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(403);
    }
  });
});
