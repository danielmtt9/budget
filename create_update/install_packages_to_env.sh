#!/bin/bash

# === CONFIG ===
ENV_DIR="/opt/conda/envs"
CONDA_BIN="/opt/conda/bin/conda"

# === INPUTS ===
ENV_NAME=$1         # e.g., project-ai
PACKAGES=$2         # e.g., "matplotlib seaborn opencv"

# === CHECK INPUTS ===
if [[ -z "$ENV_NAME" || -z "$PACKAGES" ]]; then
  echo "Usage: sudo ./install_packages_to_env.sh <env-name> \"<packages>\""
  echo "Example: sudo ./install_packages_to_env.sh project-ai \"matplotlib seaborn\""
  exit 1
fi

# === CHECK IF ENV EXISTS ===
if [[ ! -d "$ENV_DIR/$ENV_NAME" ]]; then
  echo "❌ Environment '$ENV_NAME' does not exist at $ENV_DIR/$ENV_NAME"
  exit 1
fi

# === INSTALL PACKAGES ===
echo "📦 Installing packages into '$ENV_NAME': $PACKAGES"
sudo $CONDA_BIN install --prefix "$ENV_DIR/$ENV_NAME" $PACKAGES -y

echo "✅ Packages installed successfully in '$ENV_NAME'."
