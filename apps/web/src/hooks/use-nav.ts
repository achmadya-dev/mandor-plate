'use client';

import type { NavGroup, NavItem } from '@/types';
import { filterNavGroups, filterNavItems } from '@/lib/auth/rbac';
import { useSessionUser } from '@/lib/auth/use-session';
import { useMemo } from 'react';

export function useFilteredNavItems(items: NavItem[]) {
  const user = useSessionUser();

  return useMemo(() => filterNavItems(user, items), [items, user]);
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  const user = useSessionUser();

  return useMemo(() => filterNavGroups(user, groups), [groups, user]);
}
