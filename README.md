# Budget App

A comprehensive budget tracking application with a FastAPI backend and React frontend.

## Prerequisites

- Python 3.12 (via Conda environment `budget-env`)
- Node.js & npm
- PostgreSQL
- Ollama (for AI features)

## Setup

1.  **Database:**
    The database `finance_db` has been created and migrated.
    Credentials are in `finance-app/.env`.

2.  **Environment:**
    See `ENVIRONMENT_SETUP.md` for details on the Python environment.

3.  **Seeding Data:**
    To reset/seed the database with test data:
    ```bash
    cd finance-app
    /opt/conda/envs/budget-env/bin/python seed.py
    ```

## Running the App

### Backend
Start the FastAPI server:
```bash
./start_backend.sh
```
The API will be available at `http://localhost:8000`.
Docs: `http://localhost:8000/docs`

### Frontend
Start the React development server:
```bash
cd frontend
npm run dev
```
The UI will be available at `http://localhost:5173` (or 5174 if port is busy).

## Features
- **Transactions:** View and manage transactions.
- **Auth:** Google OAuth (configured in `.env`) and Dev Login (for local testing).
- **AI:** Integration with Ollama (configured to use `llama3` model).

## Development
- **Backend:** `finance-app/`
- **Frontend:** `frontend/`
