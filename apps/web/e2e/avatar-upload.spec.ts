import path from 'node:path';
import { test, expect } from '@playwright/test';
import { REGULAR_USER, loginViaUi } from './helpers/auth';

const fixturePath = path.join(__dirname, 'fixtures', 'test-avatar.png');

test.describe('profile avatar upload', () => {
  test('uploads avatar and shows image on profile', async ({ page }) => {
    await loginViaUi(page, REGULAR_USER, '/dashboard/profile');

    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

    await page.locator('input[type="file"]').setInputFiles(fixturePath);
    await expect(page.getByText('uploaded', { exact: false })).toBeVisible({
      timeout: 15_000,
    });

    const avatar = page.locator(
      '[data-slot="avatar"].h-20 [data-slot="avatar-image"]',
    );
    await expect(avatar).toBeVisible({ timeout: 15_000 });
    await expect(avatar).toHaveAttribute('src', /\/api\/v1\/files\//);
  });
});
