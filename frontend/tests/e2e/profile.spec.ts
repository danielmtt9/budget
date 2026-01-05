import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Mock initial user data
    await page.route('**/users/me', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          json: {
            id: 1,
            email: 'test@example.com',
            full_name: 'Test User',
            avatar_url: 'http://example.com/avatar.png'
          }
        });
      } else if (route.request().method() === 'PUT') {
        const body = route.request().postDataJSON();
        await route.fulfill({
          json: {
            id: 1,
            email: 'test@example.com',
            full_name: body.full_name || 'Test User',
            avatar_url: body.avatar_url || 'http://example.com/avatar.png'
          }
        });
      }
    });

    await page.goto('/profile');
  });

  test('should display user information', async ({ page }) => {
    await expect(page.locator('input[value="test@example.com"]')).toBeVisible();
    await expect(page.locator('input[value="test@example.com"]')).toBeDisabled();
    await expect(page.getByPlaceholder('Your full name')).toHaveValue('Test User');
    await expect(page.getByPlaceholder('URL to your avatar image')).toHaveValue('http://example.com/avatar.png');
  });

  test('should allow updating profile information', async ({ page }) => {
    // Update Name
    await page.getByPlaceholder('Your full name').fill('Updated Name');

    // Update Avatar
    await page.getByPlaceholder('URL to your avatar image').fill('http://example.com/new.png');

    // Handle alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Profile updated successfully');
      await dialog.dismiss();
    });

    // Save
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Verify values remain (mock handles response)
    await expect(page.getByPlaceholder('Your full name')).toHaveValue('Updated Name');
    await expect(page.getByPlaceholder('URL to your avatar image')).toHaveValue('http://example.com/new.png');
  });
});
