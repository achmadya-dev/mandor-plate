import { apiClient } from '@/lib/api-client';
import type {
  ApiUser,
  ApiUsersPage,
  UserFilters,
  UserMutationPayload,
  UsersResponse,
} from './types';
import {
  buildUsersQuery,
  toCreateUserBody,
  toUpdateUserBody,
  toUser,
} from './types';

export type { User } from './types';

function mapUsersPage(page: ApiUsersPage, filters: UserFilters): UsersResponse {
  return {
    users: page.data.map(toUser),
    hasNextPage: page.hasNextPage,
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
  };
}

export async function getUsers(filters: UserFilters): Promise<UsersResponse> {
  const query = buildUsersQuery(filters);
  const page = await apiClient<ApiUsersPage>(`/users?${query}`);
  return mapUsersPage(page, filters);
}

export async function createUser(data: UserMutationPayload) {
  const user = await apiClient<ApiUser>('/users', {
    method: 'POST',
    body: JSON.stringify(toCreateUserBody(data)),
  });
  return { success: true, user: toUser(user) };
}

export async function updateUser(
  id: number | string,
  data: UserMutationPayload,
) {
  const user = await apiClient<ApiUser>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toUpdateUserBody(data)),
  });
  return { success: true, user: toUser(user) };
}

export async function deleteUser(id: number | string) {
  await apiClient<void>(`/users/${id}`, { method: 'DELETE' });
  return { success: true };
}
