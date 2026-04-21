#!/bin/bash

echo "Starting project setup..."

# ---------------------------------------------------------
# 1. Frontend Setup (React / Node.js)
# ---------------------------------------------------------
echo ""
echo "[1/3] Setting up Frontend (React)..."

if [ -d "./frontend" ]; then
    cd ./frontend
    echo "Running npm install..."
    npm install
    cd ..
    echo "✅ Frontend setup complete."
else
    echo "❌ Warning: './frontend' directory not found. Skipping."
fi

# ---------------------------------------------------------
# 2. Backend Setup (Python Flask/FastAPI)
# ---------------------------------------------------------
echo ""
echo "[2/3] Setting up Backend..."

if [ -d "./backend" ]; then
    cd ./backend

    echo "Creating virtual environment (.venv)..."
    python3.12 -m venv .venv

    echo "Activating .venv and installing dependencies..."
    source .venv/bin/activate

    # Upgrade pip
    python -m pip install --upgrade pip >/dev/null

    if [ -f "./requirements.txt" ]; then
        pip install -r requirements.txt
    else
        echo "⚠️ Warning: requirements.txt not found in ./backend."
    fi

    deactivate
    cd ..
    echo "✅ Backend setup complete."
else
    echo "❌ Warning: './backend' directory not found. Skipping."
fi

# ---------------------------------------------------------
# 3. Orchestrator Setup (Python Flask)
# ---------------------------------------------------------
echo ""
echo "[3/3] Setting up Orchestrator..."

if [ -d "./orchestrator" ]; then
    cd ./orchestrator

    echo "Creating virtual environment (.venv)..."
    python3.12 -m venv .venv

    echo "Activating .venv and installing dependencies..."
    source .venv/bin/activate

    # Upgrade pip
    python -m pip install --upgrade pip >/dev/null

    if [ -f "./requirements.txt" ]; then
        pip install -r requirements.txt
    else
        echo "⚠️ Warning: requirements.txt not found in ./orchestrator."
    fi

    deactivate
    cd ..
    echo "✅ Orchestrator setup complete."
else
    echo "❌ Warning: './orchestrator' directory not found. Skipping."
fi

echo ""
echo "🎉 Setup finished successfully!"