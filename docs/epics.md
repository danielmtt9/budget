# Epics and User Stories

## Context Validation
- **PRD:** Loaded (`docs/sprint-artifacts/prd.md`)
- **Architecture:** Loaded (`docs/architecture-solution.md`)
- **UX Design:** Loaded (`docs/ux-design-specification.md`)

## Functional Requirements Inventory
| ID | Description | Source |
| :--- | :--- | :--- |
| **FR-1** | **Backend Schema:** Create `Tag` model and `transaction_tags` association table. | PRD 5.1 |
| **FR-2** | **Tag Management API:** Implement CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`) for `/tags`. | PRD 5.1 |
| **FR-3** | **Transaction Update API:** Update `PATCH /transactions/{id}` to handle tag associations. | PRD 5.1 |
| **FR-4** | **TagInput Component:** Develop React component for searching, selecting, and creating tags. | PRD 5.2, UX 2.1 |
| **FR-5** | **Transaction Tag Display:** Update `TransactionList` to display tags (`TagList` component). | PRD 5.2, UX 2.4 |
| **FR-6** | **Tag Filtering:** Implement `TagFilter` component and integrate into the filter bar. | PRD 5.2, UX 2.4 |
| **FR-7** | **Tag Creation UX:** Enable inline creation of new tags within the `TagInput`. | UX 2.5 |
| **FR-8** | **Tag Validation:** Ensure tags are unique per user and validated on backend. | Arch 8 |
| **FR-9** | **User Isolation:** Ensure users can only access/modify their own tags. | Arch 8 |

## Epic Structure

### Epic 1: Tagging Foundation & Management
- **Goal:** Establish database schema, API endpoints for tags, and the core TagInput component.
- **User Value:** Sets up the system to store and manage tags.
- **Dependencies:** None.

### Epic 2: Transaction Tagging Integration
- **Goal:** Enable users to assign tags to transactions and view them in the list.
- **User Value:** Users can actively organize their expenses.
- **Dependencies:** Epic 1.

### Epic 3: Filtering & Discovery

-   **Goal:** Enable users to filter the transaction list by tags.

-   **User Value:** Users can find specific groups of transactions (e.g., "Vacation").

-   **Dependencies:** Epic 2.



### Epic 4: Bank Synchronization (SimpleFIN)

-   **Goal:** Automate the import of bank accounts and transactions.

-   **User Value:** Removes manual data entry; keeps financial data current.

-   **Dependencies:** Epic 1 (Basic Schema).



## Epic 1: Tagging Foundation & Management
**Goal:** Establish database schema, API endpoints for tags, and the core TagInput component.

### Story 1.1: Database Schema for Tags
- **User Story:** As a developer, I want to update the database schema to support tags so that users can store their custom labels.
- **Acceptance Criteria:**
    - Create `tags` table with columns: `id` (PK), `user_id` (FK), `name` (Unique per user), `color`.
    - Create `transaction_tags` table with columns: `transaction_id` (FK), `tag_id` (FK), PK(transaction_id, tag_id).
    - Generate and apply Alembic migration.
    - Verify constraints (Unique name per user, Foreign Keys).
- **Technical Context:** Arch 4, Schema.

### Story 1.2: Tag Management API (CRUD)
- **User Story:** As a user, I want to manage my tags via the API so that the frontend can list and create them.
- **Acceptance Criteria:**
    - `GET /tags`: Returns list of user's tags.
    - `POST /tags`: Creates a new tag (validates uniqueness).
    - `PUT /tags/{id}`: Updates tag name/color.
    - `DELETE /tags/{id}`: Deletes a tag.
    - Ensure strict user isolation (users only see/edit their own tags).
- **Technical Context:** Arch 5.1, API.

### Story 1.3: TagInput Component
- **User Story:** As a user, I want a component to type and select tags so that I can easily assign them.
- **Acceptance Criteria:**
    - Create `TagInput` React component.
    - Input field allows typing.
    - Dropdown shows filtered suggestions from existing tags.
    - "Create 'NewTag'" option appears if tag doesn't exist.
    - Selected tags appear as dismissible badges/pills within or below input.
    - Accessibility: Keyboard navigation support.
- **Technical Context:** UX 2.5, Component Strategy.

## Epic 2: Transaction Tagging Integration
**Goal:** Enable users to assign tags to transactions and view them in the list.

### Story 2.1: Backend Transaction Update Logic
- **User Story:** As a system, I want to update a transaction's tags when it is saved so that the associations are persisted.
- **Acceptance Criteria:**
    - Update `PATCH /transactions/{id}` to accept `tag_ids: List[int]`.
    - In the service layer, for the given transaction: remove existing `transaction_tags` rows, then insert new ones for provided IDs.
    - Validate that all `tag_ids` belong to the current user.
    - Return updated transaction with tags in response.
- **Technical Context:** Arch 5.2, Transaction Tagging.

### Story 2.2: Frontend Transaction Edit Integration
- **User Story:** As a user, I want to tag a transaction while editing it so I can organize it.
- **Acceptance Criteria:**
    - Integrate `TagInput` into the Transaction Edit Form/Modal.
    - On load, fetch and display currently assigned tags for the transaction.
    - When saving, send the list of selected `tag_ids` in the `PATCH` payload.
    - Ensure UI updates immediately upon successful save.
- **Technical Context:** Arch 6, Frontend Integration.

### Story 2.3: Display Tags in Transaction List
- **User Story:** As a user, I want to see tags on my transaction list so I can quickly identify them.
- **Acceptance Criteria:**
    - Create `TagList` component to render a list of tags as badges.
    - Update `TransactionList` row to include `TagList`.
    - Ensure tags wrap gracefully or truncate if space is limited (responsive check).
- **Technical Context:** Arch 6, TagList Component.

## Epic 3: Filtering & Discovery
**Goal:** Enable users to filter the transaction list by tags.

### Story 3.1: Tag Filter Component
- **User Story:** As a user, I want to select tags from a filter menu so I can find specific transactions.
- **Acceptance Criteria:**
    - Create `TagFilter` component (likely a dropdown with checkboxes).
    - Fetch available tags from `GET /tags` on mount.
    - Allow selecting multiple tags.
    - Show selected count or badges in the collapsed filter button.
- **Technical Context:** Arch 6, TagFilter.

### Story 3.2: Filter Bar Integration
- **User Story:** As a user, I want the transaction list to update when I filter by tags so I see only relevant data.
- **Acceptance Criteria:**
    - Add `TagFilter` to the existing Filter Bar.
    - Update the API call to fetch transactions with `tags` query parameter (e.g., `?tags=1,2`).
    - Ensure backend supports filtering by tag IDs (verify/implement logic).
    - Add "Clear All" functionality to reset tag filters.
- **Technical Context:** Arch 6, Filter Logic.

## Epic 4: Bank Synchronization (SimpleFIN)
**Goal:** Automate the import of bank accounts and transactions.

### Story 4.1: SimpleFIN Service Implementation
-   **User Story:** As a system, I need a service to communicate with SimpleFIN Bridge so that I can claim tokens and fetch data.
-   **Acceptance Criteria:**
    -   Implement `claim_access_url` (decodes token, POSTs to claim).
    -   Implement `fetch_financial_data` (GETs accounts/transactions, handles Basic Auth).
    -   Handle 403 Forbidden (Token Expired) and Rate Limit errors.
-   **Technical Context:** `app/services/simplefin.py`.

### Story 4.2: Setup API & Persistence
-   **User Story:** As a user, I want to link my bank account by pasting a token so that the app remembers my connection.
-   **Acceptance Criteria:**
    -   `POST /sync/setup` endpoint accepting `setup_token`.
    -   Calls service to claim Access URL.
    -   Saves `simplefin_access_url` to `users` table.
    -   Returns success/failure message.
-   **Technical Context:** `app/routers/sync.py`, `User` model.

### Story 4.3: Sync Execution & Deduplication
-   **User Story:** As a user, I want my data to sync without duplicates so that my balance is accurate.
-   **Acceptance Criteria:**
    -   `POST /sync/run` endpoint.
    -   Fetches accounts and transactions.
    -   Creates new `Account` records if `simplefin_id` doesn't exist.
    -   Creates new `Transaction` records if `simplefin_id` doesn't exist.
    -   Updates balances.
-   **Technical Context:** `app/services/simplefin.py` (sync logic).

### Story 4.4: Frontend Setup UI
-   **User Story:** As a user, I want a settings form to paste my token so I can start the sync process.
-   **Acceptance Criteria:**
    -   Add "Bank Sync" section to Settings page.
    -   Input field for token. "Connect" button.
    -   Show loading state while claiming.
    -   Show success/error toast.
-   **Technical Context:** `frontend/src/pages/Settings.tsx`.

## FR Coverage Matrix
| FR ID | Covered By |
| :--- | :--- |
| FR-1 | Story 1.1 |
| FR-2 | Story 1.2 |
| FR-3 | Story 2.1 |
| FR-4 | Story 1.3, 2.2 |
| FR-5 | Story 2.3 |
| FR-6 | Story 3.1, 3.2 |
| FR-7 | Story 1.3 |
| FR-8 | Story 1.1, 1.2 |
| FR-9 | Story 1.2 |

## Final Validation
- **User Value:** Epics are structured to deliver usable milestones (Foundation -> Tagging -> Filtering).
- **Completeness:** All functional requirements from the PRD are mapped to stories.
- **Technical Soundness:** Stories reference specific architectural decisions and schemas.
- **Implementation Ready:** Stories have clear acceptance criteria and technical context.
