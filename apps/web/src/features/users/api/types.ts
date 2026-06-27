import type { RoleName } from '@mandor-plate/shared';

const ROLE_IDS: Record<RoleName, number> = {
  admin: 1,
  user: 2,
};

const STATUS_IDS = {
  active: 1,
  inactive: 2,
} as const;

export type ApiUser = {
  id: number | string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  role?: { id: number; name: string } | null;
  status?: { id: number; name: string };
  createdAt: string;
  updatedAt: string;
};

export type ApiUsersPage = {
  data: ApiUser[];
  hasNextPage: boolean;
};

export type User = {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleName;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type UserFilters = {
  page?: number;
  limit?: number;
  roles?: string;
  search?: string;
  sort?: string;
};

export type UsersResponse = {
  users: User[];
  hasNextPage: boolean;
  page: number;
  limit: number;
};

export type UserMutationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: RoleName;
  status: 'active' | 'inactive';
};

export function toUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName ?? '',
    lastName: apiUser.lastName ?? '',
    email: apiUser.email ?? '',
    role: (apiUser.role?.name as RoleName | undefined) ?? 'user',
    status: apiUser.status?.name === 'inactive' ? 'inactive' : 'active',
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
}

export function buildUsersQuery(filters: UserFilters): string {
  const params = new URLSearchParams();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;

  params.set('page', String(page));
  params.set('limit', String(limit));

  if (filters.roles) {
    const roleNames = filters.roles.split(',').filter(Boolean) as RoleName[];
    const roles = roleNames
      .map((name) => ROLE_IDS[name])
      .filter(Boolean)
      .map((id) => ({ id }));

    if (roles.length > 0) {
      params.set('filters', JSON.stringify({ roles }));
    }
  }

  if (filters.sort) {
    try {
      const parsed = JSON.parse(filters.sort) as Array<{
        id: string;
        desc: boolean;
      }>;
      const first = parsed[0];
      if (first) {
        const orderBy =
          first.id === 'name'
            ? 'firstName'
            : first.id === 'role'
              ? 'role'
              : first.id === 'status'
                ? 'status'
                : 'createdAt';
        params.set(
          'sort',
          JSON.stringify([{ orderBy, order: first.desc ? 'DESC' : 'ASC' }]),
        );
      }
    } catch {
      // ignore invalid sort payloads from the table
    }
  }

  return params.toString();
}

export function toCreateUserBody(payload: UserMutationPayload) {
  return {
    email: payload.email,
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: { id: ROLE_IDS[payload.role] },
    status: { id: STATUS_IDS[payload.status] },
  };
}

export function toUpdateUserBody(payload: UserMutationPayload) {
  const body: Record<string, unknown> = {
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: { id: ROLE_IDS[payload.role] },
    status: { id: STATUS_IDS[payload.status] },
  };

  if (payload.password) {
    body.password = payload.password;
  }

  return body;
}
