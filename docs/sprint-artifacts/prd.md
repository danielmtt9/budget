# Product Requirements Document (PRD): Transaction Tagging System

## 1. Introduction
This PRD defines the requirements for adding a **Custom Tagging System** to the Personal Finance Tracker. Currently, transactions can be categorized (e.g., "Food"), but users lack a flexible way to add ad-hoc labels (e.g., "Vacation 2024", "Tax Deductible") across different categories. This feature will introduce a many-to-many relationship between transactions and tags.

## 2. Goals & Objectives
-   **Flexibility:** Allow users to organize finances beyond rigid categories.
-   **Searchability:** Enable filtering transactions by specific tags.
-   **User Experience:** efficient inline tagging within the transaction list.

## 3. Scope
**In Scope:**
-   Backend: New `tags` table and `transaction_tags` association table.
-   Backend: CRUD API endpoints for Tags.
-   Backend: Update Transaction API to include/update tags.
-   Frontend: UI to create/select tags on a transaction.
-   Frontend: Filter transactions by tag.

**Out of Scope:**
-   Automated tagging rules (AI or regex-based) - *Phase 2*.
-   Hierarchical tags.

## 4. User Stories

| ID | As a... | I want to... | So that... |
| :--- | :--- | :--- | :--- |
| **US-1** | User | Create a new tag (e.g., "2025-Trip") | I can label specific groups of expenses. |
| **US-2** | User | Assign multiple tags to a single transaction | I can cross-reference expenses (e.g., "Food" + "Work Expense"). |
| **US-3** | User | Remove a tag from a transaction | I can correct mistakes. |
| **US-4** | User | View all transactions with a specific tag | I can see the total cost of an event or project. |
| **US-5** | User | Manage my tags (rename/delete) | I can keep my tagging system clean. |

## 5. Functional Requirements

### 5.1 Backend (FastAPI + SQLAlchemy)
-   **Schema:**
    -   Create `Tag` model (`id`, `user_id`, `name`, `color`).
    -   Create `transaction_tags` association table.
-   **API:**
    -   `GET /tags` - List all tags.
    -   `POST /tags` - Create new tag.
    -   `PUT /tags/{id}` - Update tag.
    -   `DELETE /tags/{id}` - Delete tag.
    -   `PATCH /transactions/{id}` - Update transaction tags (add/remove).

### 5.2 Frontend (React)
-   **Component:** `TagInput` - A multi-select component (combobox) allowing selection of existing tags or creation of new ones.
-   **View:** Update `TransactionList` to display tags as badges (pills) next to the category.
-   **Filter:** Add a "Tags" dropdown to the existing transaction filter bar.

## 6. Acceptance Criteria
1.  **Tag Creation:** User can type a new tag name in the transaction edit view and create it instantly.
2.  **Display:** Tags appear as colored badges on the transaction row.
3.  **Persistence:** Assigned tags persist after page reload and re-syncs.
4.  **Isolation:** Users only see their own tags.
5.  **Performance:** Loading transactions with tags adds < 200ms overhead.

## 7. Success Metrics
-   **Adoption:** 20% of transactions tagged within first month.
-   **Efficiency:** Tagging a transaction takes < 3 clicks.