import { test, expect } from '@playwright/test';
import { ADMIN, REGULAR_USER, loginViaUi } from './helpers/auth';

test.describe('role-based navigation', () => {
  test('admin sees Users nav item', async ({ page }) => {
    await loginViaUi(page, ADMIN);
    await expect(
      page
        .locator('[data-slot="sidebar"]')
        .getByRole('link', { name: 'Users' }),
    ).toBeVisible();
  });

  test('regular user does not see Users nav item', async ({ page }) => {
    await loginViaUi(page, REGULAR_USER);
    await expect(
      page
        .locator('[data-slot="sidebar"]')
        .getByRole('link', { name: 'Users' }),
    ).toHaveCount(0);
  });
});
