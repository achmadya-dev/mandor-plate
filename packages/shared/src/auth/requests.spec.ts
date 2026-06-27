import {
  emailLoginRequestSchema,
  registerRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  confirmEmailRequestSchema,
  googleLoginRequestSchema,
  authUpdateRequestSchema,
} from './requests';

describe('auth request schemas', () => {
  describe('emailLoginRequestSchema', () => {
    it('accepts valid login input and normalizes email', () => {
      const result = emailLoginRequestSchema.parse({
        email: '  User@Example.COM ',
        password: 'secret1',
      });

      expect(result.email).toBe('user@example.com');
      expect(result.password).toBe('secret1');
    });

    it('rejects invalid email and short password', () => {
      expect(
        emailLoginRequestSchema.safeParse({
          email: 'not-an-email',
          password: '123',
        }).success,
      ).toBe(false);
    });
  });

  describe('registerRequestSchema', () => {
    it('accepts valid registration input', () => {
      const result = registerRequestSchema.parse({
        email: 'new@example.com',
        password: 'secret1',
        firstName: 'Jane',
        lastName: 'Doe',
      });

      expect(result.firstName).toBe('Jane');
    });

    it('rejects empty name parts', () => {
      expect(
        registerRequestSchema.safeParse({
          email: 'new@example.com',
          password: 'secret1',
          firstName: '   ',
          lastName: 'Doe',
        }).success,
      ).toBe(false);
    });
  });

  describe('forgotPasswordRequestSchema', () => {
    it('accepts valid email', () => {
      expect(
        forgotPasswordRequestSchema.parse({ email: 'user@example.com' }).email,
      ).toBe('user@example.com');
    });

    it('rejects invalid email', () => {
      expect(
        forgotPasswordRequestSchema.safeParse({ email: 'bad' }).success,
      ).toBe(false);
    });
  });

  describe('resetPasswordRequestSchema', () => {
    it('accepts password and hash', () => {
      expect(
        resetPasswordRequestSchema.parse({
          password: 'secret1',
          hash: 'abc123',
        }).hash,
      ).toBe('abc123');
    });

    it('rejects missing hash', () => {
      expect(
        resetPasswordRequestSchema.safeParse({ password: 'secret1' }).success,
      ).toBe(false);
    });
  });

  describe('confirmEmailRequestSchema', () => {
    it('accepts confirmation hash', () => {
      expect(
        confirmEmailRequestSchema.parse({ hash: 'confirm-me' }).hash,
      ).toBe('confirm-me');
    });

    it('rejects empty hash', () => {
      expect(
        confirmEmailRequestSchema.safeParse({ hash: '  ' }).success,
      ).toBe(false);
    });
  });

  describe('googleLoginRequestSchema', () => {
    it('accepts id token', () => {
      expect(
        googleLoginRequestSchema.parse({ idToken: 'google-token' }).idToken,
      ).toBe('google-token');
    });

    it('rejects empty id token', () => {
      expect(
        googleLoginRequestSchema.safeParse({ idToken: '' }).success,
      ).toBe(false);
    });
  });

  describe('authUpdateRequestSchema', () => {
    it('accepts partial profile update without password', () => {
      expect(
        authUpdateRequestSchema.parse({ firstName: 'Updated' }).firstName,
      ).toBe('Updated');
    });

    it('requires oldPassword when password is set', () => {
      expect(
        authUpdateRequestSchema.safeParse({ password: 'secret1' }).success,
      ).toBe(false);
    });

    it('accepts password change with oldPassword', () => {
      expect(
        authUpdateRequestSchema.parse({
          password: 'secret1',
          oldPassword: 'oldsecret',
        }).password,
      ).toBe('secret1');
    });
  });
});
