import { test, expect } from '@playwright/test';
import {
  clearMaildev,
  extractPasswordResetUrl,
  waitForEmail,
} from './helpers/maildev';
import { ADMIN } from './helpers/auth';

test.describe('forgot password', () => {
  test('sends reset email captured in Maildev', async ({ page }) => {
    await clearMaildev();

    await page.goto('/auth/forgot-password');
    await page.getByLabel('Email').fill(ADMIN.email);
    await page.getByRole('button', { name: 'Send reset link' }).click();

    await expect(
      page.getByText('If that email exists, a reset link has been sent.'),
    ).toBeVisible();

    const email = await waitForEmail(ADMIN.email, { subjectIncludes: 'Reset' });
    const resetUrl = extractPasswordResetUrl(email.text);

    expect(resetUrl).toContain('/password-change?hash=');
    expect(resetUrl).toContain('expires=');
  });
});
