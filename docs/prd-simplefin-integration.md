# Product Requirement Document (PRD): SimpleFIN Bridge Integration

**Status:** Draft
**Author:** PM Agent
**Date:** 2025-12-11
**Target Component:** Backend (`finance-app`), Frontend (`frontend`)

## 1. Executive Summary
This PRD defines the requirements for integrating the **SimpleFIN Bridge** into the Personal Finance Tracker. The goal is to enable automated synchronization of bank accounts and transactions, replacing manual data entry. This integration will serve as the primary data ingestion pipeline for the application.

## 2. Problem Statement
Currently, users must manually enter transactions or import CSV files, which is error-prone, time-consuming, and discourages regular usage. To provide real-time financial insights, the application needs a reliable, automated method to fetch transaction data from various financial institutions.

## 3. Goals & Objectives
*   **Automation:** Enable users to connect their bank accounts once and receive automatic transaction updates.
*   **Reliability:** Establish a robust sync mechanism that handles SimpleFIN's rate limits and token lifecycle management.
*   **User Experience:** Provide a simple setup flow where users can easily input their SimpleFIN Setup Token.
*   **Data Integrity:** Ensure mapped data (amounts, dates, descriptions) is accurate and duplicates are prevented.

## 4. User Stories

| ID | As a... | I want to... | So that... |
| :--- | :--- | :--- | :--- |
| **US-1** | User | Enter my SimpleFIN Setup Token in the settings | I can link my bank accounts to the app. |
| **US-2** | System | Exchange the Setup Token for an Access Token | I can securely communicate with SimpleFIN on behalf of the user. |
| **US-3** | System | Periodically sync my accounts and transactions | My dashboard always reflects my latest financial status. |
| **US-4** | User | Manually trigger a sync | I can see my latest transactions immediately without waiting for the daily schedule. |
| **US-5** | System | Handle API errors and rate limits gracefully | The system remains stable and I am informed of any connection issues. |
| **US-6** | User | View the status of the last sync | I know if my data is up-to-date or if an error occurred. |

## 5. Functional Requirements

### 5.1 Token Management (Setup & Claiming)
*   **Input:** The system MUST accept a base64-encoded **Setup Token** from the user via a frontend form.
*   **Decryption:** The backend MUST Base64-decode the Setup Token to extract the Claim URL.
*   **Claiming:** The backend MUST issue a `POST` request to the Claim URL to obtain the **Access URL**.
    *   *Constraint:* This is a one-time operation. The Setup Token is invalidated immediately after use.
*   **Storage:** The system MUST securely store the returned **Access URL** associated with the user. The original Setup Token SHOULD NOT be stored.

### 5.2 Data Synchronization (Accounts & Transactions)
*   **Endpoint:** The system MUST use the stored Access URL to fetch data (e.g., `GET {ACCESS_URL}/accounts`).
*   **Authentication:** Requests MUST use Basic Auth. Credentials (username:password) are embedded in the Access URL standard (scheme://user:pass@host/path).
*   **Data Mapping:**
    *   **Accounts:** Map SimpleFIN `org` (institution), `id`, `name`, `currency`, and `balance`.
    *   **Transactions:** Map `id`, `posted` (date), `amount`, `description`, `memo`.
    *   **Normalization:** Convert SimpleFIN timestamps to standard datetime objects.
*   **Deduplication:** The system MUST check existing transaction IDs to prevent creating duplicate records during sync.

### 5.3 Rate Limiting & Quotas
*   **Limit:** The system MUST NOT exceed **24 requests per day** for the user's Access URL.
*   **Date Range:** For historical data, the system MUST respect the **60-day limit** per request. If fetching >60 days, requests must be chunked (though initial prototype may default to "latest").
*   **Leeway:** The system SHOULD implement a buffer (e.g., cap at 20 requests/day) to prevent accidental lockouts.

### 5.4 Error Handling
*   **Response Parsing:** The system MUST parse the JSON response for an `errors` array.
*   **User Feedback:** Warning level errors (non-critical) SHOULD be logged. Critical errors (invalid token, quota exceeded) MUST be surfaced to the user on the dashboard/settings.

## 6. Technical Specifications & API Reference

### 6.1 SimpleFIN Flow
1.  **Decode Token:** `base64_decode(SETUP_TOKEN) -> CLAIM_URL`
2.  **Claim Token:** `POST CLAIM_URL -> ACCESS_URL` (Text response)
3.  **Fetch Data:** `GET {ACCESS_URL}/accounts`
    *   *Note:* `ACCESS_URL` usually contains Basic Auth credentials.
    *   *Python Example:* `requests.get(url, auth=(username, password))`

### 6.2 Backend Implementation Plan (`finance-app`)
*   **Service:** `app/services/simplefin.py`
    *   `claim_access_url(setup_token: str) -> str`
    *   `fetch_accounts(access_url: str, start_date: date = None, end_date: date = None)`
    *   `sync_user_data(user_id: int, db: Session)`
*   **Router:** `app/routers/sync.py`
    *   `POST /sync/setup`: Accepts Setup Token, returns success/fail.
    *   `POST /sync/run`: Triggers an immediate sync (checks rate limit first).
    *   `GET /sync/status`: Returns last sync timestamp and status.

### 6.3 Frontend Implementation Plan (`frontend`)
*   **Settings Page:** Add section "Bank Synchronization".
    *   Input field for "SimpleFIN Setup Token".
    *   "Connect" button.
*   **Feedback:** Show loading spinner during Claim process.
*   **Dashboard:** "Sync Now" button (disabled if quota near limit).

## 7. Non-Functional Requirements
*   **Security:** Access URLs contain sensitive credentials (functionally equivalent to API keys). They must be encrypted at rest in the database.
*   **Performance:** Sync operations can take time. The API endpoint (`POST /sync/run`) should potentially trigger a background task (e.g., using FastAPI `BackgroundTasks`) rather than blocking the UI, pushing updates via WebSocket or requiring client polling. For MVP, blocking with timeout management is acceptable.
*   **Maintainability:** External API client code must be isolated in `services/simplefin.py` to allow easy updates if SimpleFIN API changes.

## 8. Open Questions / Risks
*   **Risk:** Users might regenerate the token on SimpleFIN website, invalidating the app's Access URL.
    *   *Mitigation:* Detect 401/403 errors and prompt user to re-link (enter new Setup Token).
*   **Risk:** SimpleFIN downtime.
    *   *Mitigation:* Handle connection timeouts gracefully.
