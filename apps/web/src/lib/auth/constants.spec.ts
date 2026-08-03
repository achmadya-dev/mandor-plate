import { getCookieValue } from './cookies';
import { apiUrl, isDashboardPath, safeAuthRedirect } from './constants';

describe('auth constants', () => {
  it('builds versioned API URLs', () => {
    process.env.API_URL = 'http://localhost:3001';
    expect(apiUrl('/auth/email/login')).toBe(
      'http://localhost:3001/api/v1/auth/email/login',
    );
  });

  it('detects dashboard paths', () => {
    expect(isDashboardPath('/dashboard')).toBe(true);
    expect(isDashboardPath('/dashboard/overview')).toBe(true);
    expect(isDashboardPath('/auth/sign-in')).toBe(false);
  });

  it.each([null, '', 'https://evil.example', '//evil.example'])(
    'rejects external redirect %s',
    (value) => {
      expect(safeAuthRedirect(value)).toBe('/dashboard/overview');
    },
  );

  it('allows an internal redirect', () => {
    expect(safeAuthRedirect('/dashboard/users?page=2')).toBe(
      '/dashboard/users?page=2',
    );
  });
});

describe('cookie parsing', () => {
  it('reads named cookies from header string', () => {
    const header = 'mp_access_token=abc123; mp_refresh_token=def456';
    expect(getCookieValue(header, 'mp_access_token')).toBe('abc123');
    expect(getCookieValue(header, 'mp_refresh_token')).toBe('def456');
    expect(getCookieValue(header, 'missing')).toBeUndefined();
  });
});
