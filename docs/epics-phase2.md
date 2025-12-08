
## Phase 2: Automated Tagging & Intelligence
**Focus:** Leveraging AI and rule-based automation to reduce manual tagging effort.

### Epic 4: AI Tag Suggestions
- **Goal:** Intelligent tag suggestions for individual transactions using LLMs (Ollama).
- **User Value:** Reduces cognitive load by suggesting relevant tags.
- **Dependencies:** Epic 1, Epic 2.

#### Story 4.1: AI Tag Suggestion API
- **User Story:** As a user, I want the system to suggest relevant tags for a transaction so I don't have to search for them.
- **Acceptance Criteria:**
    - Create `POST /ai/suggest-tags` endpoint.
    - Input: Transaction description, amount, payee.
    - Context: Fetch user's existing tags to prompt the AI (e.g., "Given tags [Food, Travel], which apply to 'Uber to Airport'?").
    - Output: List of suggested tag names.
    - Performance: Timeout handling (AI can be slow).
- **Technical Context:** `finance-app/app/routers/ai.py`, `finance-app/app/services/ollama.py`.

#### Story 4.2: Frontend AI Suggestions
- **User Story:** As a user, I want to see AI suggestions when editing a transaction.
- **Acceptance Criteria:**
    - Update `TransactionForm` / `TagInput` to fetch suggestions when the modal opens or description changes.
    - Display suggestions as "clickable chips" distinct from selected tags.
    - Click to accept suggestion (moves to selected).
    - Visual feedback for "Thinking..." state.

### Epic 5: Rule-Based Auto-Tagging
- **Goal:** Deterministic automation for recurring transactions.
- **User Value:** Completely automates tagging for known vendors (e.g., Spotify, Netflix).
- **Dependencies:** Epic 1, Epic 2.

#### Story 5.1: Tag Rules Schema & API
- **User Story:** As a user, I want to define rules like "If description contains X, apply tag Y".
- **Acceptance Criteria:**
    - Create `TagRule` model: `id`, `user_id`, `tag_id`, `pattern` (string), `match_type` (contains/exact/regex).
    - CRUD API for `/tag-rules`.
    - Alembic migrations.

#### Story 5.2: Apply Rules on Transaction Save
- **User Story:** As a system, I want to automatically apply tags when a transaction is imported or modified.
- **Acceptance Criteria:**
    - Update `create_transaction` and `update_transaction` logic.
    - Check description against active `TagRule`s.
    - Automatically add matching tags (do not remove existing ones).

#### Story 5.3: Rules Management UI
- **User Story:** As a user, I want an interface to view and create my tagging rules.
- **Acceptance Criteria:**
    - "Tag Rules" page or modal in Settings.
    - List existing rules.
    - Form to create new rule: Select Tag -> Enter Pattern -> Save.

### Epic 6: Historical Auto-Tagging (Bulk)
- **Goal:** Apply rules/AI to past data.
- **User Value:** Cleans up historical data without manual entry.

#### Story 6.1: Run Rules on History
- **User Story:** As a user, I want to run my new rules on all past transactions.
- **Acceptance Criteria:**
    - `POST /tags/rules/apply-all`.
    - Background task (or efficient query) to iterate all user transactions and apply matching rules.
    - Return count of updated transactions.
