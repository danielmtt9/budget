# System-Level Test Design

## Testability Assessment

- **Controllability:** **PASS**
    - Backend: FastAPI/SQLAlchemy allows for easy database seeding and transaction rollbacks for test isolation.
    - Frontend: React component architecture supports isolated component testing.
    - Auth: "Dev Login" mentioned in documentation ensures authentication flows can be bypassed or mocked for testing without relying on external Google OAuth.
- **Observability:** **PASS**
    - Backend: FastAPI provides clear error responses and logging hooks.
    - Frontend: React error boundaries and console logging provide sufficient visibility.
- **Reliability:** **PASS**
    - Database state can be reset between tests.
    - API endpoints are stateless (JWT based), facilitating parallel test execution.

## Architecturally Significant Requirements (ASRs)

| ASR ID | Requirement | Source | Risk Score | Testing Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **ASR-1** | **Performance:** Loading transactions with tags must add < 200ms overhead. | PRD | 6 (Med) | Performance tests (k6) targeting the `GET /transactions` endpoint with populated tags. |
| **ASR-2** | **Security:** Strict User Isolation (Users must only see their own tags). | Arch | 9 (High) | Dedicated API Security tests attempting to access cross-user resources; Row-level security verification. |
| **ASR-3** | **Reliability:** Tag synchronization with SimpleFin (if applicable) or internal consistency. | Arch | 4 (Med) | Integration tests for data consistency during transaction updates. |

## Test Levels Strategy

- **Unit: 60%** - High volume of fast tests for:
    - Backend: SQLAlchemy models, Pydantic schemas, utility functions.
    - Frontend: Utility functions, hooks, state logic.
- **Component: 20%** - Focused testing for React UI:
    - `TagInput`: Interaction testing (typing, selecting, creating).
    - `TagList`: Rendering logic.
    - `TagFilter`: State updates.
- **Integration (API): 15%** - Validating service boundaries:
    - Endpoint logic (`/tags` CRUD, `PATCH /transactions`).
    - Database constraints and relationships.
- **E2E: 5%** - Critical User Journeys:
    - "User creates and assigns a tag to a transaction."
    - "User filters transaction list by tag."

## NFR Testing Approach

- **Security:**
    - **Tool:** `pytest` + `requests` (or specialized security tools).
    - **Focus:** Authorization checks (IDOR vulnerabilities) on `/tags` and `/transactions` endpoints. Ensure `user_id` filter is always applied.
- **Performance:**
    - **Tool:** `k6` or `locust`.
    - **Focus:** Load test `GET /transactions` with 1000+ transactions and 50+ tags per user. Measure latency impact of the `transaction_tags` join.
- **Reliability:**
    - **Tool:** `pytest`.
    - **Focus:** Test database constraint violations (duplicate tags, invalid foreign keys) and ensure graceful error handling in API.
- **Maintainability:**
    - **Tool:** `ruff`, `black`, `eslint`.
    - **Focus:** Enforce code style and linting to keep test codebase clean.

## Test Environment Requirements

- **Local/CI:** Dockerized PostgreSQL instance for integration/E2E tests.
- **Data:** Seed scripts to populate users, accounts, and transactions for performance testing.

## Testability Concerns

- **None.** The architecture (FastAPI + React + Postgres) is standard and highly testable. "Dev Login" mitigates the biggest risk (OAuth).

## Recommendations for Sprint 0

- Set up `pytest` configuration with a test database fixture.
- Configure `k6` for baseline performance metrics.
- Establish a pattern for frontend component testing (e.g., using `Vitest` + `React Testing Library`).
