import { expect } from '@playwright/test';
import { test } from '../support/fixtures/auth.fixture'; // Use the extended test
import axios from 'axios';

test.describe('E2E Tag Management', () => {
    test.beforeEach(async ({ page }) => {
        // Ensure backend is running and data is clean for E2E tests
        // For actual robust E2E, consider a setup script that cleans/seeds the DB
        // For now, assuming fresh state per test.
    });

    // Test will automatically receive logged-in 'page' from the fixture
    test('[P0] User can create and assign a tag to a transaction', async ({ page }) => { 
        // Navigate to transactions (already done by setupUserAndLogin auto fixture)
        // await page.goto('/transactions'); // This is redundant as fixture navigates to /transactions

        // Ensure there's at least one transaction to edit
        const transactionCount = await page.locator('tbody tr').count();
        if (transactionCount === 0) {
            await axios.post('http://localhost:8002/transactions/', {
                amount: 100,
                description: 'E2E Test Transaction',
                date: new Date().toISOString(),
                account_id: 1 // Assuming account_id 1 exists for user
            });
            await page.reload(); // Reload to see new transaction
        }

        // Find first transaction and click Edit
        await page.locator('tbody tr').first().locator('button:has-text("Edit")').click();

        // In the modal, locate TagInput
        const tagInput = page.locator('div.modal-body .position-relative input[type="text"]');
        const newTagName = `E2ETag_${Date.now()}`;

        // Type new tag name and create it
        await tagInput.fill(newTagName);
        // Playwright can click the ListGroup.Item for creation
        await page.locator('div.modal-body >> text=Create "' + newTagName + '"').click(); 
        
        // Save transaction
        await page.locator('button:has-text("Save Changes")').click();

        // Verify tag appears on the transaction row
        await expect(page.locator('tbody tr').first()).toContainText(newTagName);
    });

    test('[P0] User can filter transactions by a newly created tag', async ({ page }) => {
        // await page.goto('/transactions'); // This is redundant as fixture navigates to /transactions

        // Ensure there's at least one transaction to edit and tag
        const transactionCount = await page.locator('tbody tr').count();
        if (transactionCount === 0) {
            await axios.post('http://localhost:8002/transactions/', {
                amount: 150,
                description: 'Filterable Transaction',
                date: new Date().toISOString(),
                account_id: 1 // Assuming account_id 1 exists for user
            });
            await page.reload(); // Reload to see new transaction
        }

        // Assign a unique tag to the first transaction
        const uniqueTagName = `FilterTag_${Date.now()}`;
        await page.locator('tbody tr').first().locator('button:has-text("Edit")').click();
        const tagInput = page.locator('div.modal-body .position-relative input[type="text"]');
        await tagInput.fill(uniqueTagName);
        await page.locator('div.modal-body >> text=Create "' + uniqueTagName + '"').click();
        await page.locator('button:has-text("Save Changes")').click();
        await expect(page.locator('tbody tr').first()).toContainText(uniqueTagName);

        // Filter by the newly created tag
        await page.locator('#dropdown-tag-filter').click(); // Open TagFilter dropdown
        await page.locator(`label:has-text("${uniqueTagName}")`).click(); // Select the tag checkbox
        // No explicit closing click needed, Playwright might handle this by interacting elsewhere

        // Verify only the tagged transaction is visible
        const visibleRowsCount = await page.locator('tbody tr').count(); // Get count of currently visible rows
        expect(visibleRowsCount).toBe(1);
        await expect(page.locator('tbody tr').first()).toContainText(uniqueTagName);

        // Clear filter for other tests (optional but good practice)
        await page.locator('#dropdown-tag-filter').click(); // Open dropdown again
        await page.locator(`label:has-text("${uniqueTagName}")`).click(); // Unselect
        // await page.locator('text="Clear All"').click(); // If we had a clear all button
    });
});