#!/bin/bash
echo "WARNING: It is critical to use the @applications/create_update method for running the backend. Refer to docs/backend-execution.md for details."
cd finance-app
/opt/conda/envs/budget-env/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
