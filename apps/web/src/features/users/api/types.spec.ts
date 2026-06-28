import {
  toCreateUserBody,
  toUpdateUserBody,
  toUser,
  buildUsersQuery,
} from './types';

describe('user API body mappers', () => {
  const formPayload = {
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'secret12',
    role: 'admin' as const,
    status: 'active' as const,
  };

  it('maps create payload to NestJS user dto shape', () => {
    expect(toCreateUserBody(formPayload)).toEqual({
      email: 'admin@example.com',
      password: 'secret12',
      firstName: 'John',
      lastName: 'Doe',
      role: { id: 1 },
      status: { id: 1 },
    });
  });

  it('maps update payload and omits empty password', () => {
    expect(toUpdateUserBody({ ...formPayload, password: '' })).toEqual({
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: { id: 1 },
      status: { id: 1 },
    });
  });

  it('corrupts role/status ids if api-shaped body is mapped again', () => {
    const apiBody = toUpdateUserBody(formPayload);
    const remapped = toUpdateUserBody(apiBody as never);

    expect(remapped.role).toEqual({ id: undefined });
    expect(remapped.status).toEqual({ id: undefined });
  });

  it('includes search in filters query param', () => {
    const query = buildUsersQuery({
      page: 1,
      limit: 10,
      search: 'john',
    });

    expect(query).toContain('filters=');
    expect(decodeURIComponent(query)).toContain('"search":"john"');
  });

  it('combines search and role filters', () => {
    const query = buildUsersQuery({
      page: 1,
      limit: 10,
      search: 'john',
      roles: ['admin'],
    });

    const filtersParam = new URLSearchParams(query).get('filters');
    expect(filtersParam).toBeTruthy();
    expect(JSON.parse(filtersParam!)).toEqual({
      roles: [{ id: 1 }],
      search: 'john',
    });
  });

  it('defaults to updatedAt descending when no sort is provided', () => {
    const query = buildUsersQuery({ page: 1, limit: 10 });
    const sortParam = new URLSearchParams(query).get('sort');

    expect(JSON.parse(sortParam!)).toEqual([
      { orderBy: 'updatedAt', order: 'DESC' },
    ]);
  });
});

describe('toUser', () => {
  it('maps inactive status by id when name is missing', () => {
    expect(
      toUser({
        id: 2,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: { id: 2, name: 'user' },
        status: { id: 2, name: '' },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }).status,
    ).toBe('inactive');
  });

  it('maps inactive status from capitalized API name', () => {
    expect(
      toUser({
        id: 2,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: { id: 2, name: 'user' },
        status: { id: 2, name: 'Inactive' },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }).status,
    ).toBe('inactive');
  });

  it('maps role by id when name is missing', () => {
    expect(
      toUser({
        id: 1,
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: { id: 1, name: '' },
        status: { id: 1, name: 'Active' },
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      }).role,
    ).toBe('admin');
  });
});
