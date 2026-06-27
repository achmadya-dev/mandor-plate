import { expect, type Page } from '@playwright/test';
export const ACCESS_TOKEN_COOKIE = 'mp_access_token';
export const REFRESH_TOKEN_COOKIE = 'mp_refresh_token';

export const ADMIN = {
  email: 'admin@example.com',
  password: 'secret',
};

export const REGULAR_USER = {
  email: 'john.doe@example.com',
  password: 'secret',
};

export async function loginViaUi(
  page: Page,
  credentials: { email: string; password: string },
  redirectPath = '/dashboard/overview',
): Promise<void> {
  await page.goto(`/auth/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
  await page.getByLabel('Email').fill(credentials.email);
  await page.getByLabel('Password').fill(credentials.password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL(`**${redirectPath}`);
}

export async function expectHttpOnlyAuthCookies(page: Page): Promise<void> {
  const cookies = await page.context().cookies();
  const access = cookies.find((cookie) => cookie.name === ACCESS_TOKEN_COOKIE);
  const refresh = cookies.find(
    (cookie) => cookie.name === REFRESH_TOKEN_COOKIE,
  );

  expect(access?.httpOnly).toBe(true);
  expect(refresh?.httpOnly).toBe(true);
  expect(access?.value).toBeTruthy();
  expect(refresh?.value).toBeTruthy();
}

export async function logoutViaBff(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  });
}

export async function registerViaUi(
  page: Page,
  user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  },
): Promise<void> {
  await page.goto('/auth/sign-up');
  await page.getByLabel('First name').fill(user.firstName);
  await page.getByLabel('Last name').fill(user.lastName);
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.waitForURL('**/auth/sign-in');
}
