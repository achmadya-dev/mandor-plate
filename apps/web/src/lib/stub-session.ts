'use client';

/** Placeholder session until MP-004 wires NestJS auth (MP-007 adds RBAC nav). */
export type StubUser = {
  fullName: string;
  email: string;
  imageUrl?: string;
};

export const stubUser: StubUser = {
  fullName: 'Demo User',
  email: 'demo@example.com',
  imageUrl: undefined,
};

export function useStubUser(): StubUser {
  return stubUser;
}
