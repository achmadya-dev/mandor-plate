import 'server-only';

import { serverApiClient } from '@/lib/api-client.server';
import type { ApiUsersPage, UserFilters, UsersResponse } from './types';
import { buildUsersQuery, toUser } from './types';

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
  const page = await serverApiClient<ApiUsersPage>(`/users?${query}`);
  return mapUsersPage(page, filters);
}
