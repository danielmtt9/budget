#!/bin/bash
cd finance-app
/opt/conda/envs/budget-env/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
