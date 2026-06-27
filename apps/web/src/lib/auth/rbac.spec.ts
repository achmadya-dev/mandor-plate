import type { SessionUser } from '@mandor-plate/shared';
import {
  canAccessNavItem,
  filterNavGroups,
  filterNavItems,
  isAdminOnlyPath,
  isAdminUser,
} from './rbac';

describe('rbac', () => {
  const adminUser: SessionUser = {
    id: 1,
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: { id: 1, name: 'admin' },
  };

  const regularUser: SessionUser = {
    id: 2,
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: { id: 2, name: 'user' },
  };

  it('identifies admin-only dashboard paths', () => {
    expect(isAdminOnlyPath('/dashboard/users')).toBe(true);
    expect(isAdminOnlyPath('/dashboard/overview')).toBe(false);
  });

  it('allows admin role checks', () => {
    expect(isAdminUser(adminUser)).toBe(true);
    expect(isAdminUser(regularUser)).toBe(false);
  });

  it('filters admin-only nav items for regular users', () => {
    const items = [
      { title: 'Overview', url: '/dashboard/overview', items: [] },
      { title: 'Users', url: '/dashboard/users', items: [], access: { role: 'admin' as const } },
    ];

    expect(filterNavItems(adminUser, items)).toHaveLength(2);
    expect(filterNavItems(regularUser, items)).toHaveLength(1);
    expect(filterNavItems(regularUser, items)[0]?.title).toBe('Overview');
  });

  it('hides org-gated items without Clerk organizations', () => {
    expect(canAccessNavItem(regularUser, { requireOrg: true })).toBe(false);
  });

  it('removes empty nav groups after filtering', () => {
    const groups = filterNavGroups(regularUser, [
      {
        label: 'Admin',
        items: [{ title: 'Users', url: '/dashboard/users', items: [], access: { role: 'admin' } }],
      },
    ]);

    expect(groups).toHaveLength(0);
  });
});
