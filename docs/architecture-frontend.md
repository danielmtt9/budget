# Frontend Architecture (frontend)

## Overview
The frontend is a **Single Page Application (SPA)** built with **React 19**, **TypeScript**, and **Vite**. It provides a responsive user interface for managing finances, visualizing data, and interacting with the backend API.

## Key Technologies
-   **React 19:** UI Library.
-   **TypeScript:** Static typing for robustness.
-   **Vite:** Build tool and development server.
-   **Bootstrap 5 (React-Bootstrap):** UI Component library.
-   **Axios:** HTTP client for API communication.
-   **Playwright:** End-to-End (E2E) testing.

## Directory Structure (`frontend/src/`)
-   `main.tsx`: Entry point, global styles, router setup.
-   `App.tsx`: Main layout and route definitions.
-   `services/api.ts`: Centralized API client with typed functions for all backend endpoints.
-   `pages/`: Top-level route components.
    -   `Dashboard.tsx`: Overview of finances.
    -   `Transactions.tsx`: Main transaction list with filtering and editing.
    -   `Settings.tsx`: Configuration for SimpleFIN and Auto-Tagging Rules.
    -   `Login.tsx`: Authentication entry point.
-   `components/`: Reusable UI components.
    -   `Layout.tsx`: Common page layout (Navbar, Container).
    -   `TagInput.tsx`: **[Epic 1, 4]** Complex component for selecting/creating tags, with integrated AI suggestions.
    -   `TagFilter.tsx`: **[Epic 3]** Dropdown component for filtering lists by tags.

## Key Features & UX Patterns

### Transaction Management
-   **List View:** Tabular display of transactions with color-coded amounts and tag badges.
-   **Editing:** Modal-based editing allowing description updates and tag management.
-   **Tagging:** 
    -   Inline creation of new tags.
    -   "✨ Suggest" button calls AI to propose tags based on context.

### Automation Configuration
-   **Settings Page:**
    -   SimpleFIN URL configuration.
    -   **Rule Management:** Interface to create/delete `TagRules` (Regex/Exact/Contains).
    -   **Bulk Action:** "Run on History" button to apply rules to all past data.

### State Management
-   Local React State (`useState`) is used for component-level data.
-   Data fetching is triggered via `useEffect` hooks calling `api.ts` services.

## Integration
-   Proxies API requests to `http://localhost:8000` (via Vite config or direct Axios setup).
-   Handles authentication cookies automatically via `withCredentials: true`.
