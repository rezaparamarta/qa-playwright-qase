import { test, expect } from '@playwright/test';

test('User can login with valid credentials', async ({ page }) => {
  test.info().annotations.push({
    type: 'qase',
    description: '7', // ⬅️ Qase case_id
  });

  await page.goto('/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await expect(page).toHaveURL(/inventory/);
});
