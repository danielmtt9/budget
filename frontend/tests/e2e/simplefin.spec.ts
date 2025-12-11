import { test, expect } from '@playwright/test';

test.describe('SimpleFIN Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock User response
    await page.route('**/users/me', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ json: { id: 1, email: 'test@example.com', simplefin_access_url: null } });
      }
    });

    // Mock Tag Rules & Tags (dependencies for Settings page)
    await page.route('**/tag-rules/', async route => await route.fulfill({ json: [] }));
    await page.route('**/tags/', async route => await route.fulfill({ json: [] }));
    
    // Mock Sync Status
    await page.route('**/sync/status', async route => await route.fulfill({ 
        json: { configured: false, message: "SimpleFIN not configured." } 
    }));

    await page.goto('/settings');
  });

  test('should allow user to enter setup token and connect', async ({ page }) => {
    // Mock Setup endpoint
    await page.route('**/sync/setup', async route => {
      const body = route.request().postDataJSON();
      expect(body.setup_token).toBe('test-setup-token');
      await route.fulfill({ status: 200, json: { message: "SimpleFIN Access URL successfully configured." } });
    });
    
    // Mock Sync Status update after setup (since the component re-fetches)
    // We override the previous route handler for status
    await page.route('**/sync/status', async route => await route.fulfill({ 
        json: { configured: true, message: "SimpleFIN configured." } 
    }));
    
    // Mock User update after setup (to show Access URL)
    await page.route('**/users/me', async route => {
       await route.fulfill({ json: { id: 1, email: 'test@example.com', simplefin_access_url: 'https://user:pass@access.url' } });
    });

    // Handle alert
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('SimpleFIN connection setup successfully');
        await dialog.dismiss();
    });

    // Fill in the token
    await page.getByPlaceholder('Paste your base64-encoded Setup Token here...').fill('test-setup-token');
    
    // Click Connect
    await page.getByRole('button', { name: 'Connect SimpleFIN' }).click();

    // Verify Access URL is displayed
    await expect(page.getByText('Current SimpleFIN Access URL:')).toBeVisible();
    await expect(page.getByText('https://user:pass@access.url')).toBeVisible();
  });

  test('should trigger sync manually', async ({ page }) => {
    // Setup state where user is configured
    await page.route('**/users/me', async route => {
        await route.fulfill({ json: { id: 1, email: 'test@example.com', simplefin_access_url: 'https://configured' } });
    });
    
    // Need to reload/re-navigate to ensure the new mock is picked up by the component's useEffect
    await page.goto('/settings'); 

    // Mock Sync Run endpoint
    await page.route('**/sync/run', async route => {
      await route.fulfill({ status: 202, json: { message: "Financial data synchronization initiated in the background." } });
    });

    // Handle alert
    page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Sync initiated');
        await dialog.dismiss();
    });

    // Click Sync Now
    await page.getByRole('button', { name: 'Sync Now' }).click();
  });
});
