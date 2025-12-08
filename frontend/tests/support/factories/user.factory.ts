import { faker } from '@faker-js/faker';
import axios from 'axios';

const API_URL = 'http://localhost:8002'; // Backend API

export const createUser = async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const google_sub = faker.string.uuid();

    // Dev signup endpoint
    await axios.post(`${API_URL}/auth/dev/signup`, { email, password, google_sub });

    // No need to explicitly login via API here for session in Playwright API tests,
    // as the current_user is mocked by get_current_user in backend dependencies.
    // This factory is more for ensuring a user exists and is clean.

    return { email, password };
};

// There's no delete user API, so tests might leave dummy users.
// For real tests, a cleanup mechanism would be needed.
// For now, Playwright test context isolates tests implicitly.
