import { mailCopy } from './mail-copy';

describe('mailCopy', () => {
  it('should expose English copy for all transactional emails', () => {
    expect(mailCopy.confirmEmail.title).toBe('Confirm email');
    expect(mailCopy.resetPassword.title).toBe('Reset password');
    expect(mailCopy.confirmNewEmail.title).toBe('Confirm email');
    expect(mailCopy.confirmEmail.text1).toBeTruthy();
    expect(mailCopy.resetPassword.text4).toBeTruthy();
  });
});
