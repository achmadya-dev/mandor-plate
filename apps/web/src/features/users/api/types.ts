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
  roles?: string | string[];
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

function mapApiRole(role?: ApiUser['role']): RoleName {
  const roleId = role?.id !== undefined ? Number(role.id) : undefined;
  if (roleId === ROLE_IDS.admin) return 'admin';
  if (roleId === ROLE_IDS.user) return 'user';
  return (role?.name as RoleName | undefined) ?? 'user';
}

function mapApiStatus(status?: ApiUser['status']): User['status'] {
  const statusId = status?.id !== undefined ? Number(status.id) : undefined;
  if (statusId === STATUS_IDS.inactive) return 'inactive';
  if (statusId === STATUS_IDS.active) return 'active';
  return status?.name?.toLowerCase() === 'inactive' ? 'inactive' : 'active';
}

export function toUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName ?? '',
    lastName: apiUser.lastName ?? '',
    email: apiUser.email ?? '',
    role: mapApiRole(apiUser.role),
    status: mapApiStatus(apiUser.status),
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

  const filterPayload: Record<string, unknown> = {};

  if (filters.roles) {
    const roleNames = (
      Array.isArray(filters.roles) ? filters.roles : filters.roles.split(',')
    ).filter(Boolean) as RoleName[];
    const roles = roleNames
      .map((name) => ROLE_IDS[name])
      .filter(Boolean)
      .map((id) => ({ id }));

    if (roles.length > 0) {
      filterPayload.roles = roles;
    }
  }

  if (filters.search?.trim()) {
    filterPayload.search = filters.search.trim();
  }

  if (Object.keys(filterPayload).length > 0) {
    params.set('filters', JSON.stringify(filterPayload));
  }

  params.set('sort', serializeUsersSort(filters.sort));

  return params.toString();
}

const DEFAULT_USERS_SORT = JSON.stringify([
  { orderBy: 'updatedAt', order: 'DESC' },
]);

function serializeUsersSort(sort?: string): string {
  if (!sort) {
    return DEFAULT_USERS_SORT;
  }

  try {
    const parsed = JSON.parse(sort) as Array<{
      id: string;
      desc: boolean;
    }>;
    const first = parsed[0];
    if (!first) {
      return DEFAULT_USERS_SORT;
    }

    const orderBy =
      first.id === 'name'
        ? 'firstName'
        : first.id === 'role'
          ? 'role'
          : first.id === 'status'
            ? 'status'
            : first.id === 'updatedAt'
              ? 'updatedAt'
              : 'createdAt';

    return JSON.stringify([{ orderBy, order: first.desc ? 'DESC' : 'ASC' }]);
  } catch {
    return DEFAULT_USERS_SORT;
  }
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
