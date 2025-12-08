# Backend Architecture (finance-app)

## Overview
The backend is a **FastAPI** application serving as the REST API for the Personal Finance Tracker. It handles data persistence, authentication, external integrations (SimpleFIN, Ollama), and business logic for transaction management and automation.

## Key Components

### 1. Core Framework
-   **FastAPI:** Web framework for building the API.
-   **Uvicorn:** ASGI server.
-   **SQLAlchemy:** ORM for database interactions.
-   **Pydantic:** Data validation and serialization.
-   **Alembic:** Database migration tool.

### 2. Directory Structure (`finance-app/app/`)
-   `main.py`: Entry point, application configuration, router inclusion.
-   `models.py`: SQLAlchemy database models.
-   `schemas.py`: Pydantic models for request/response bodies.
-   `crud.py`: CRUD (Create, Read, Update, Delete) operations and business logic.
-   `database.py`: Database connection and session management.
-   `config.py`: Environment configuration management.
-   `dependencies.py`: Dependency injection (e.g., `get_current_user`).

### 3. API Modules (`app/routers/`)
-   `auth.py`: Authentication endpoints (Google OAuth).
-   `users.py`: User profile management.
-   `accounts.py`: Bank account management.
-   `transactions.py`: Transaction CRUD, searching, and updates.
-   `categories.py`: Category management.
-   `tags.py`: **[Epic 1]** Custom tag management.
-   `tag_rules.py`: **[Epic 5, 6]** Rule-based auto-tagging management and bulk application.
-   `ai.py`: **[Epic 4]** AI integration endpoints (Ask, Suggest Tags).
-   `sync.py`: Triggering synchronization with SimpleFIN.
-   `analytics.py`: Financial reporting endpoints.

### 4. Services (`app/services/`)
-   `simplefin.py`: Integration with SimpleFIN Bridge API for transaction syncing.
-   `ollama.py`: Integration with local Ollama instance for AI features.

## Key Features & Logic

### Database Schema
-   **Users:** Central entity.
-   **Accounts:** Linked to Users.
-   **Transactions:** Linked to Accounts and Categories.
-   **Tags:** Many-to-Many relationship with Transactions (`transaction_tags` table).
-   **TagRules:** Rules for automated tagging (Pattern matching: Contains, Exact, Regex).

### Automation Pipelines
1.  **Sync:** `POST /sync` fetches data from SimpleFIN, normalizes it, and stores new transactions.
2.  **Auto-Tagging (Real-time):** 
    -   Triggered on `create_transaction` and `update_transaction`.
    -   Checks `TagRules` against transaction description.
    -   Automatically applies matching tags.
3.  **AI Suggestions:**
    -   `POST /ai/suggest-tags` uses LLM (Llama3 via Ollama) to analyze transaction details and suggest tags from the user's existing pool.

## Security
-   **Session Auth:** `SessionMiddleware` with secure cookies.
-   **User Isolation:** All CRUD operations enforce `user_id` filtering to ensure users only access their own data.
