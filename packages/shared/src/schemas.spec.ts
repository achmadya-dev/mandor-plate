import { loginResponseSchema } from './auth/responses';
import { tokenPairSchema } from './auth/responses';
import { roleNameSchema } from './user/role';
import { userSchema } from './user/profile';

describe('user and response schemas', () => {
  describe('roleNameSchema', () => {
    it('accepts admin and user', () => {
      expect(roleNameSchema.parse('admin')).toBe('admin');
      expect(roleNameSchema.parse('user')).toBe('user');
    });

    it('rejects unknown roles', () => {
      expect(roleNameSchema.safeParse('superadmin').success).toBe(false);
    });
  });

  describe('userSchema', () => {
    it('accepts API-shaped user with admin role', () => {
      const user = userSchema.parse({
        id: 1,
        email: 'admin@example.com',
        provider: 'email',
        firstName: 'Admin',
        lastName: 'User',
        role: { id: 1, name: 'admin' },
        status: { id: 1, name: 'active' },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });

      expect(user.role?.name).toBe('admin');
    });

    it('rejects invalid role name', () => {
      expect(
        userSchema.safeParse({
          id: 1,
          email: 'user@example.com',
          provider: 'email',
          firstName: 'A',
          lastName: 'B',
          role: { id: 99, name: 'superadmin' },
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        }).success,
      ).toBe(false);
    });
  });

  describe('loginResponseSchema', () => {
    it('accepts full login response payload', () => {
      const response = loginResponseSchema.parse({
        token: 'access',
        refreshToken: 'refresh',
        tokenExpires: 1_700_000_000_000,
        user: {
          id: 1,
          email: 'user@example.com',
          provider: 'email',
          firstName: 'John',
          lastName: 'Doe',
          role: { id: 2, name: 'user' },
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      });

      expect(response.token).toBe('access');
      expect(tokenPairSchema.parse(response).refreshToken).toBe('refresh');
    });
  });
});
