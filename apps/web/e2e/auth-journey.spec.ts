import { test, expect } from '@playwright/test';
import {
  confirmEmailViaApi,
  clearMaildev,
  extractConfirmEmailHash,
  waitForEmail,
} from './helpers/maildev';
import {
  expectHttpOnlyAuthCookies,
  loginViaUi,
  logoutViaBff,
  registerViaUi,
} from './helpers/auth';

test.describe('primary auth journey', () => {
  test('register, confirm, login, dashboard, logout, and redirect', async ({
    page,
  }) => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'Secret123!';

    await clearMaildev();

    await registerViaUi(page, {
      email,
      password,
      firstName: 'E2E',
      lastName: 'User',
    });

    const confirmation = await waitForEmail(email, {
      subjectIncludes: 'Confirm',
    });
    const hash = extractConfirmEmailHash(confirmation.text);
    await confirmEmailViaApi(hash);

    await loginViaUi(page, { email, password });
    await expectHttpOnlyAuthCookies(page);
    await expect(page).toHaveURL(/\/dashboard\/overview/);

    await logoutViaBff(page);

    const cookiesAfterLogout = await page.context().cookies();
    expect(
      cookiesAfterLogout.find((c) => c.name === 'mp_access_token')?.value ?? '',
    ).toBeFalsy();

    await page.goto('/dashboard/overview');
    await page.waitForURL('**/auth/sign-in**');
    expect(page.url()).toContain('/auth/sign-in');
  });
});
