#!/bin/bash

# === CONFIG ===
CONDA_BIN="/opt/conda/bin/conda"
ENV_DIR="/opt/conda/envs"
JUPYTERHUB_PREFIX="/opt/jupyterhub"

# === INPUTS ===
ENV_NAME=$1             # e.g. project-ai
DISPLAY_NAME=$2         # e.g. "Python (Project AI)"
PACKAGES=$3             # e.g. "python=3.10 numpy pandas matplotlib"

# === CHECK INPUTS ===
if [[ -z "$ENV_NAME" || -z "$DISPLAY_NAME" || -z "$PACKAGES" ]]; then
  echo "Usage: sudo ./create_jupyterhub_env.sh <env-name> <display-name> \"<packages>\""
  echo "Example: sudo ./create_jupyterhub_env.sh project-ai \"Python (Project AI)\" \"python=3.10 numpy pandas matplotlib\""
  exit 1
fi

# === CREATE CONDA ENV ===
echo "📦 Creating conda environment '$ENV_NAME'..."
sudo $CONDA_BIN create --prefix $ENV_DIR/$ENV_NAME -c conda-forge $PACKAGES ipykernel -y

# === REGISTER KERNEL ===
echo "🔧 Registering kernel with JupyterHub as '$DISPLAY_NAME'..."
sudo $ENV_DIR/$ENV_NAME/bin/python -m ipykernel install \
  --prefix=$JUPYTERHUB_PREFIX \
  --name "$ENV_NAME" \
  --display-name "$DISPLAY_NAME"

echo "✅ Environment '$ENV_NAME' created and kernel '$DISPLAY_NAME' registered!"
