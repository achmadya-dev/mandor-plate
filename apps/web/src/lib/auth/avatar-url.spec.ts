import { normalizeAvatarSrc } from './avatar-url';

describe('normalizeAvatarSrc', () => {
  it('should return empty string for missing paths', () => {
    expect(normalizeAvatarSrc(null)).toBe('');
    expect(normalizeAvatarSrc('')).toBe('');
  });

  it('should keep same-origin relative paths', () => {
    expect(normalizeAvatarSrc('/api/v1/files/avatar.png')).toBe(
      '/api/v1/files/avatar.png',
    );
  });

  it('should strip the API host from absolute file URLs', () => {
    expect(
      normalizeAvatarSrc('http://127.0.0.1:3001/api/v1/files/avatar.png'),
    ).toBe('/api/v1/files/avatar.png');
  });
});
