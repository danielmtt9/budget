#!/bin/bash

# === CONFIG ===
APP_BASE_DIR="/home/danielaroko/applications"

# === INPUTS ===
APP_NAME=$1              # e.g., resume-matcher
PYTHON_VERSION=${2:-3.11} # default to 3.11 if not specified

# === CHECK INPUTS ===
if [[ -z "$APP_NAME" ]]; then
  echo "Usage: ./create_python_env.sh <app-name> [python-version]"
  echo "Example: ./create_python_env.sh resume-matcher 3.11"
  exit 1
fi

APP_DIR="$APP_BASE_DIR/$APP_NAME"
VENV_DIR="$APP_DIR/venv"

# === CHECK IF APP DIR EXISTS ===
if [[ ! -d "$APP_DIR" ]]; then
  echo "❌ Application directory '$APP_DIR' does not exist"
  exit 1
fi

# === CREATE PYTHON VENV ===
echo "📦 Creating Python $PYTHON_VERSION virtual environment in '$VENV_DIR'..."
python${PYTHON_VERSION} -m venv "$VENV_DIR"

if [[ $? -ne 0 ]]; then
  echo "❌ Failed to create virtual environment. Make sure python${PYTHON_VERSION} is installed."
  echo "Install it with: sudo apt install python${PYTHON_VERSION} python${PYTHON_VERSION}-venv"
  exit 1
fi

# === UPGRADE PIP ===
echo "🔧 Upgrading pip..."
"$VENV_DIR/bin/pip" install --upgrade pip

# === INSTALL REQUIREMENTS IF EXISTS ===
if [[ -f "$APP_DIR/requirements.txt" ]]; then
  echo "📥 Installing requirements from requirements.txt..."
  "$VENV_DIR/bin/pip" install -r "$APP_DIR/requirements.txt"
else
  echo "⚠️  No requirements.txt found in $APP_DIR"
fi

echo "✅ Virtual environment created successfully at '$VENV_DIR'!"
echo "   Activate it with: source $VENV_DIR/bin/activate"
