#!/bin/bash

# === CONFIG ===
ENV_DIR="/opt/conda/envs"
CONDA_BIN="/opt/conda/bin/conda"

# === INPUT ===
ENV_NAME=$1  # e.g., project-ai

# === CHECK INPUT ===
if [[ -z "$ENV_NAME" ]]; then
  echo "Usage: sudo ./update_env_packages.sh <env-name>"
  echo "Example: sudo ./update_env_packages.sh project-ai"
  exit 1
fi

# === CHECK IF ENV EXISTS ===
if [[ ! -d "$ENV_DIR/$ENV_NAME" ]]; then
  echo "❌ Environment '$ENV_NAME' does not exist at $ENV_DIR/$ENV_NAME"
  exit 1
fi

echo "🔄 Updating all Conda packages in '$ENV_NAME'..."
sudo $CONDA_BIN update --prefix "$ENV_DIR/$ENV_NAME" --all -y

# Check if pip exists
PIP_PATH="$ENV_DIR/$ENV_NAME/bin/pip"
if [[ -f "$PIP_PATH" ]]; then
  echo "🔄 Updating all pip packages in '$ENV_NAME'..."
  # Get list of pip packages and update them
  sudo $PIP_PATH list --outdated --format=freeze | cut -d = -f 1 | xargs -n1 sudo $PIP_PATH install -U
else
  echo "⚠️ pip not found in environment '$ENV_NAME'. Skipping pip package updates."
fi

echo "✅ All packages in '$ENV_NAME' are up to date."
