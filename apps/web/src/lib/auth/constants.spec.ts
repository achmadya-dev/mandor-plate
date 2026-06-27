import { getCookieValue } from './cookies';
import { apiUrl, isDashboardPath } from './constants';

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
});

describe('cookie parsing', () => {
  it('reads named cookies from header string', () => {
    const header = 'mp_access_token=abc123; mp_refresh_token=def456';
    expect(getCookieValue(header, 'mp_access_token')).toBe('abc123');
    expect(getCookieValue(header, 'mp_refresh_token')).toBe('def456');
    expect(getCookieValue(header, 'missing')).toBeUndefined();
  });
});
