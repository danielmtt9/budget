# Environment Setup for Budget App

## Overview
A dedicated Conda environment named `budget-env` has been created and registered with JupyterHub.

## Details
- **Environment Name:** `budget-env`
- **Jupyter Kernel Name:** `Python (Budget App)`
- **Python Version:** 3.12
- **Location:** `/opt/conda/envs/budget-env`

## Installed Packages
The following key packages have been installed:
- `fastapi`
- `uvicorn[standard]`
- `sqlalchemy`
- `psycopg2-binary`
- `pydantic`
- `pydantic-settings`
- `python-dotenv`
- `pytest`
- `httpx`
- `authlib`
- `itsdangerous`
- `alembic`
- `ipykernel` (for JupyterHub integration)

## Usage
To use this environment in a terminal:
```bash
conda activate budget-env
```
Or simply point to the python executable:
```bash
/opt/conda/envs/budget-env/bin/python
```

To use this environment in JupyterHub:
Select the kernel **"Python (Budget App)"** from the kernel list.

## Creation Script
The environment was created using the scripts located in `/home/danielaroko/applications/create_update/`:
1. `create_jupyterhub_env.sh` (patched to use `conda-forge`)
2. `pip_install_to_env.sh`
