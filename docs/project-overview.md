# Project Overview

## Executive Summary
Personal Finance Tracker using SimpleFin Bridge for automated transaction syncing. A multi-part application with a Python FastAPI backend and a React/TypeScript frontend.

## Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | FastAPI | Python 3.12, Async API |
| **Database** | PostgreSQL | SQLAlchemy ORM, Alembic Migrations |
| **Frontend** | React 19 | TypeScript, Vite, Bootstrap 5 |
| **Integration** | SimpleFin | Bank data synchronization |

## Architecture
**Type:** Multi-part (Client-Server)

-   **Backend (`finance-app/`):** Service-oriented architecture handling auth, data persistence, and external API sync.
-   **Frontend (`frontend/`):** Single Page Application (SPA) consuming the Backend REST API.

## Documentation Index
-   [Data Models](./data-models.md)
-   [SimpleFIN Integration PRD](./prd-simplefin-integration.md)
-   [Backend Architecture](./architecture-finance-app.md) _(To be generated)_
-   [Frontend Architecture](./architecture-frontend.md) _(To be generated)_
