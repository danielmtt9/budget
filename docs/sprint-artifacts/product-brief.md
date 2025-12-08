# Project Brief: Personal Finance Tracker

## 1. Executive Summary
The **Personal Finance Tracker** is an existing web application designed to give the user full control over their personal finances. It leverages the **SimpleFin Bridge** for automated, real-time synchronization of bank transactions and account balances. The project is currently in a "Legacy/Brownfield" state with a functional FastAPI backend and React frontend, but requires structured enhancement to fully realize the goal of financial control.

## 2. Project Analysis & Narrative Fit
**Does it fit the narrative?**
**YES.**
The codebase is already architected around the SimpleFin narrative:
-   **Backend (`finance-app`):** Contains dedicated services (`services/simplefin.py`) and data models (`simplefin_id`) to handle SimpleFin's specific data structure.
-   **Frontend (`frontend`):** Includes specific settings pages (`Settings.tsx`) for managing the SimpleFin Access URL.
-   **Core Value:** The existing implementation directly supports the "automated control" goal by removing the need for manual data entry.

## 3. Scope
**In Scope:**
-   **Automated Syncing:** Robust integration with SimpleFin Bridge API to fetch accounts and transactions.
-   **Transaction Management:** Viewing, searching, and categorizing transactions.
-   **Financial Dashboard:** Visualizing net worth, spending trends, and budget adherence (Frontend enhancement).
-   **Data Privacy:** Self-hosted architecture ensuring user data ownership.
-   **Authentication:** Secure user access (OAuth/Local).

**Out of Scope:**
-   Manual CSV imports (primary focus is automation via SimpleFin).
-   Complex investment analysis (initial focus is budget/expense tracking).

## 4. Objectives
1.  **Reliability:** Ensure 100% accurate data synchronization with SimpleFin.
2.  **Usability:** Provide a clear, actionable dashboard for immediate financial insight.
3.  **Control:** Enable custom categorization and tagging to reflect the user's specific spending habits.

## 5. Deliverables
-   **Refined Backend API:** Optimized `sync` endpoints and error handling for SimpleFin limits.
-   **Enhanced Frontend UI:** Interactive charts and "Budget vs Actual" views.
-   **Documentation:** Setup guide for SimpleFin Bridge token acquisition and local deployment.

## 6. Stakeholders
-   **Product Owner / User:** Danielaroko (Primary stakeholder seeking financial control).
-   **Developers:** BMad Agents (Implementation & Analysis).

## 7. KPIs (Key Performance Indicators)
-   **Sync Success Rate:** >99% of sync attempts complete without error.
-   **Categorization Rate:** % of transactions successfully categorized (target >90%).
-   **Load Time:** Dashboard loads in <2 seconds.
