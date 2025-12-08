# Frontend Tests

This directory contains the automated tests for the frontend application.

## Structure

- `e2e/`: End-to-End tests simulating user journeys.
- `api/`: API integration tests for frontend-backend communication.
- `component/`: (Planned) Component-level tests for React components.
- `unit/`: (Planned) Unit tests for isolated functions.
- `support/`: Supporting files like fixtures and factories.

## Running Tests

Tests are run using Playwright. Ensure Playwright browsers are installed (`npx playwright install`).

```bash
# Run all E2E and API tests
npm run test:e2e

# Run only API tests
npm run test:api

# Run P0 (critical) E2E tests
npm run test:e2e:p0

# Run P0 and P1 (high priority) E2E tests
npm run test:e2e:p1

# Run tests in UI mode (interactive debugger)
npx playwright test --ui

# Run tests in headed mode (browser visible)
npm run test:e2e -- --headed
```

## Priority Tags

Tests are tagged with priorities in their names (e.g., `[P0]`, `[P1]`).

- **[P0] (Critical):** Blocks core user journeys. Run on every commit.
- **[P1] (High):** Important features. Run on PR to main.
- **[P2] (Medium):** Edge cases. Run nightly.
- **[P3] (Low):** Nice-to-haves. Run on-demand.

## Writing New Tests

- Use the `Given-When-Then` format for clarity.
- Prefer `data-testid` for selectors to ensure test stability.
- Use fixtures (`tests/support/fixtures/auth.fixture.ts`) for common setups like authenticated users.
- Use factories (`tests/support/factories/user.factory.ts`) for generating test data.
- Keep tests self-cleaning.
