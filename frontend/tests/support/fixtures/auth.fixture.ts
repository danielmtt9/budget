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

    await axios.post(`${API_URL}/dev/signup`, { email, password, google_sub });

    // 2. Log in through UI using the Dev Login endpoint directly
    // This sets the session cookie and redirects to frontend
    await page.goto(`${API_URL}/dev/login?email=${email}`);

    // Wait for navigation to dashboard (root)
    await page.waitForURL('/');

    // Use: this tells Playwright to run the actual test function now
    // and provide it with the 'page' object which is now logged in.
    await use();
  }, { auto: true }], // 'auto: true' means this fixture runs automatically for tests.
});
