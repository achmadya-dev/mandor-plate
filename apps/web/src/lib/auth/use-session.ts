'use client';

import { useEffect, useState } from 'react';
import type { SessionUser } from '@mandor-plate/shared';
import { fetchCurrentUser } from '@/lib/auth/client';
import { usePathname } from 'next/navigation';

export function useSessionUser(): SessionUser | null {
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;

    fetchCurrentUser().then((result) => {
      if (!active) return;
      setUser(result.data?.user ?? null);
    });

    return () => {
      active = false;
    };
  }, [pathname]);

  return user;
}

export function sessionUserDisplayName(user: SessionUser | null): string {
  if (!user) return 'Guest';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return name || user.email || 'User';
}
