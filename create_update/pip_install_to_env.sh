#!/bin/bash

# === CONFIG ===
ENV_DIR="/opt/conda/envs"

# === INPUTS ===
ENV_NAME=$1         # e.g., project-ai
PACKAGES=$2         # e.g., "transformers onnx flask"

# === CHECK INPUTS ===
if [[ -z "$ENV_NAME" || -z "$PACKAGES" ]]; then
  echo "Usage: sudo ./pip_install_to_env.sh <env-name> \"<packages>\""
  echo "Example: sudo ./pip_install_to_env.sh project-ai \"transformers flask\""
  exit 1
fi

# === CHECK IF ENV EXISTS ===
if [[ ! -d "$ENV_DIR/$ENV_NAME" ]]; then
  echo "❌ Environment '$ENV_NAME' does not exist at $ENV_DIR/$ENV_NAME"
  exit 1
fi

# === INSTALL PACKAGES USING pip ===
echo "🐍 Installing pip packages into '$ENV_NAME': $PACKAGES"
sudo $ENV_DIR/$ENV_NAME/bin/pip install $PACKAGES

echo "✅ Pip packages installed successfully in '$ENV_NAME'."
