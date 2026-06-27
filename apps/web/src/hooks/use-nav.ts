'use client';

import type { NavGroup, NavItem } from '@/types';
import { useMemo } from 'react';

/** MP-003: show full nav shell. RBAC filtering arrives in MP-007. */
export function useFilteredNavItems(items: NavItem[]) {
  return useMemo(() => items, [items]);
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  return useMemo(() => groups, [groups]);
}
