# Backlog & User Stories: Phase 3 (Intelligence & PWA)

**Reviewer:** Scrum Master Agent
**Source:** `prd-budget-flow-pwa.md`

## Epic 1: PWA Transformation
*Goal: Make the application installable and mobile-friendly.*

### Story 1.1: PWA Configuration
**As a** Developer
**I want to** configure `vite-plugin-pwa` in the frontend
**So that** the browser recognizes the app as installable (Manifest generated).
*   **Acceptance Criteria:**
    *   `manifest.json` is generated at build time.
    *   Lighthouse audit passes "PWA" check.
    *   Theme colors and Icons are defined.

### Story 1.2: Mobile Navigation
**As a** Mobile User
**I want to** see a bottom navigation bar instead of a sidebar
**So that** I can easily switch views with my thumb.
*   **Acceptance Criteria:**
    *   Mobile view (<640px) hides Sidebar.
    *   Mobile view shows fixed Bottom Nav (Dashboard, Transactions, Sync).

### Story 1.3: Install Prompt
**As a** User
**I want to** be prompted to install the app
**So that** I know it's possible to add it to my home screen.
*   **Acceptance Criteria:**
    *   Custom UI component appears on mobile web.
    *   Detects if running in "Browser" vs "Standalone" mode.

## Epic 2: Smart Categorization Engine
*Goal: Automate data organization.*

### Story 2.1: Categorization Service Setup
**As a** Backend Developer
**I want to** create a `CategorizationService` class
**So that** business logic for rules and AI is isolated.
*   **Acceptance Criteria:**
    *   Class exists in `app/services/categorization.py`.
    *   Method `apply_rules(description)` implemented.
    *   Unit tests passing.

### Story 2.2: Rule Migration
**As a** System
**I want to** load the static rules from the notebook into the database
**So that** we start with a baseline of intelligence.
*   **Acceptance Criteria:**
    *   Migration script creates `categorization_rules` table.
    *   Seed script populates table with ~20 initial rules (Hydro, Uber, etc.).

### Story 2.3: AI Fallback (Ollama)
**As a** System
**I want to** send uncategorized descriptions to Ollama
**So that** I can get a best-guess category when no rules match.
*   **Acceptance Criteria:**
    *   `CategorizationService` calls Ollama API if rule match fails.
    *   Response is validated against allowed Category list.
    *   Timeout handled gracefully (default to "Unknown").

## Epic 3: User Learning (Feedback Loop)
*Goal: Allow the system to get smarter.*

### Story 3.1: Manual Recategorization API
**As a** Developer
**I want to** update the `PATCH /transactions/{id}` endpoint
**So that** it supports updating the `category` field.
*   **Acceptance Criteria:**
    *   Endpoint accepts new category.
    *   Updates `is_manual_category = true`.

### Story 3.2: "Make a Rule" UI
**As a** User
**I want to** save my manual change as a permanent rule
**So that** I don't have to repeat it next month.
*   **Acceptance Criteria:**
    *   When changing a category, a Toast/Dialog asks "Save as rule for '{Keyword}'?".
    *   Clicking "Yes" sends `POST /rules`.
    *   System confirms "Rule Saved".

---

## Technical Debt / Chore
*   **Env Setup:** ensure `app/services` uses `httpx` for async API calls to SimpleFIN and Ollama.
*   **Testing:** Add specific tests for the "Hybrid" logic (Rule beats AI).
