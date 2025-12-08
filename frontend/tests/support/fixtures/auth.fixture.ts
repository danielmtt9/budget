import { test as base, Page } from '@playwright/test'; // Import Page
import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_URL = 'http://localhost:8002';

// Create a new test object that extends the base test
// with a custom 'setupUserAndLogin' fixture
export const test = base.extend<{ setupUserAndLogin: void }>({
  setupUserAndLogin: [async ({ page }, use) => {
    // 1. Create a user
    const email = faker.internet.email();
    const password = faker.internet.password();
    const google_sub = faker.string.uuid();

    await axios.post(`${API_URL}/auth/dev/signup`, { email, password, google_sub });

    // 2. Log in through UI using the provided 'page'
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard/transactions
    await page.waitForURL('/transactions'); 

    // Use: this tells Playwright to run the actual test function now
    // and provide it with the 'page' object which is now logged in.
    await use(); 
  }, { scope: 'each', auto: true }], // 'auto: true' means this fixture runs automatically for tests.
});
