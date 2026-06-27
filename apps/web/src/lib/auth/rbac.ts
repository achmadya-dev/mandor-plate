import type { RoleName, SessionUser } from '@mandor-plate/shared';
import type { NavGroup, NavItem, PermissionCheck } from '@/types';

export const ADMIN_ONLY_PATHS = ['/dashboard/users'] as const;

export function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function getUserRoleName(user: SessionUser | null | undefined): RoleName | undefined {
  return user?.role?.name;
}

export function isAdminUser(user: SessionUser | null | undefined): boolean {
  return getUserRoleName(user) === 'admin';
}

export function canAccessNavItem(
  user: SessionUser | null | undefined,
  access?: PermissionCheck,
): boolean {
  if (!access) {
    return true;
  }

  if (access.requireOrg) {
    return false;
  }

  if (access.permission) {
    return false;
  }

  if (access.role) {
    return getUserRoleName(user) === access.role;
  }

  return true;
}

function filterNavItem(user: SessionUser | null | undefined, item: NavItem): NavItem | null {
  if (item.items?.length) {
    const children = filterNavItems(user, item.items);
    if (children.length === 0) {
      return null;
    }

    if (item.url === '#') {
      return { ...item, items: children };
    }

    if (!canAccessNavItem(user, item.access)) {
      return null;
    }

    return { ...item, items: children };
  }

  if (!canAccessNavItem(user, item.access)) {
    return null;
  }

  return item;
}

export function filterNavItems(
  user: SessionUser | null | undefined,
  items: NavItem[],
): NavItem[] {
  return items
    .map((item) => filterNavItem(user, item))
    .filter((item): item is NavItem => item !== null);
}

export function filterNavGroups(
  user: SessionUser | null | undefined,
  groups: NavGroup[],
): NavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: filterNavItems(user, group.items),
    }))
    .filter((group) => group.items.length > 0);
}
