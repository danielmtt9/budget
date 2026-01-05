# Architecture Design: Budget Intelligence & PWA

**Status:** Draft
**Author:** Architect Agent
**Date:** 2025-12-16
**Based on:** `prd-budget-flow-pwa.md`

## 1. System Overview
The system is a personally hosted Finance Tracker transforming into a **Mobile-First Progressive Web App (PWA)**. Ideally, it acts as a "Financial Assistant" that ingests data from SimpleFIN, intelligently categorizes it using a hybrid Rule/LLM engine, and presents it via a fast, offline-capable UI.

## 2. Architectural Patterns
*   **Frontend:** Single Page Application (SPA) with PWA capabilities (Service Workers, Manifest).
*   **Backend:** REST API (FastAPI) with layered architecture (Router -> Service -> Data Access).
*   **Data Pipeline:**
    *   **Ingest:** Pull-based (SimpleFIN API).
    *   **Process:** Synchronous (MVP) / background (Future) processing for categorization.
*   **AI Integration:** Local LLM (Ollama) via HTTP interface.

## 3. Component Architecture

### 3.1 Frontend (React + Vite PWA)
Located in `frontend/`

*   **PWA Layer:**
    *   `manifest.json`: Defines app identity (Name, Icons, Colors).
    *   `sw.js`: Service Worker for caching app shell and API responses (`strategies: StaleWhileRevalidate`).
    *   `InstallTarget`: UI Component to guide users on iOS/Android to "Add to Home Screen".
*   **State Management:** React Context or Query (TanStack Query) to handle sync state and optimistic updates.
*   **Responsive Layout:**
    *   **Desktop:** Sidebar navigation.
    *   **Mobile:** Bottom navigation bar (App-like feel).

### 3.2 Backend (FastAPI)
Located in `finance-app/`

*   **Runtime Environment:** `/opt/conda/envs/budget-env` (Managed via `create_update` scripts).
*   **Modules:**
    *   **Runners:** `app/routers/sync.py`, `app/routers/transactions.py`
    *   **Services:**
        *   `SimpleFinService`: Handles token exchange and raw data fetching.
        *   `CategorizationService`: The brain.
            *   *Input:* Transaction Description, Amount.
            *   *Logic:* `match_rule()` OR `predict_ollama()`.
            *   *Learning:* `create_rule()` based on user feedback.
    *   **Database Models (SQLAlchemy):**
        *   `Transaction`: Stores financial records.
        *   `Account`: Stores bank account details.
        *   `CategorizationRule`: Stores user-defined mappings (keyword -> category).

### 3.3 Database Schema (PostgreSQL)

#### Table: `categorization_rules`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | Integer (PK) | |
| `keyword` | String | Substring to match (e.g., "Starbucks") |
| `category` | String | Target Category (e.g., "Dining Out") |
| `match_type` | String | 'exact', 'contains' (Default: 'contains') |
| `priority` | Integer | Higher number = Higher priority (User rules > System rules) |
| `is_active` | Boolean | |

#### Table: `transactions` (Updated)
| Column | Type | Notes |
| :--- | :--- | :--- |
| ... | ... | Existing columns |
| `category` | String | Now populated by automation |
| `is_manual_category` | Boolean | True if user manually set it (locks it from AI updates) |

## 4. Workflows

### 4.1 "Smart Sync" Pipeline
1.  **Trigger:** User clicks "Sync" or Cron Job fires.
2.  **Fetch:** `SimpleFinService` calls external API -> Returns JSON.
3.  **Upsert:** Save new transactions to DB.
4.  **Categorize (Loop for new items):**
    *   Check `categorization_rules` (DB). Match? -> Assign.
    *   Else -> Call `Ollama API`. Assign.
    *   Else -> Assign "Unknown".
5.  **Response:** Return status to Frontend.

### 4.2 "Learn" Pipeline
1.  **Trigger:** User changes category of Transaction X from "Unknown" to "Groceries".
2.  **Prompt:** UI asks "Categorize all future 'Loblaws' as 'Groceries'?"
3.  **Action:** User confirms.
4.  **API:** `POST /rules` with `{ keyword: "Loblaws", category: "Groceries" }`.
5.  **Effect:** System re-runs categorization on past "Unknown" transactions with new rule.

## 5. Deployment & Environment
*   **Environment Management:** Strictly use scripts in `create_update/` to maintain consistency with the JupyterHub environment.
    *   Current Env: `/opt/conda/envs/budget-env`
    *   Python: 3.12
*   **PWA Hosting:** Served via Vite Preview or Nginx (Static) + FastAPI (API Proxy).
