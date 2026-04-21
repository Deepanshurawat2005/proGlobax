#!/bin/bash

# proGlobax Workstation - Bulletproof Startup Script

# 1. Lock the working directory to exactly where this script lives
BaseDir="$(cd "$(dirname "$0")" && pwd)"
if [ -z "$BaseDir" ]; then BaseDir="$(pwd)"; fi

echo "Starting proGlobax Workstation from: $BaseDir"

# 2. Port Sniper (Kills stuck ghost processes with a safety delay)
free_port() {
    PORT=$1
    PIDS=$(lsof -ti tcp:$PORT)

    if [ -n "$PIDS" ]; then
        for PID in $PIDS; do
            echo "Port $PORT is busy. Assassinating ghost process ID $PID..."
            kill -9 $PID 2>/dev/null
        done

        # CRITICAL: Wait for macOS to release the socket
        echo "Waiting for OS to release port $PORT..."
        sleep 2
        echo "Port $PORT is now completely free."
    else
        echo "Port $PORT is already free."
    fi
}

echo ""
echo "Sweeping ports for ghost processes..."
free_port 5173  # Frontend
free_port 8000  # Orchestrator
free_port 8003  # Backend

# 3. Launch Services in Isolated Terminal Windows
echo ""
echo "Dispatching Services..."

# 🟢 ORCHESTRATOR (Port 8000)
echo "-> Booting Orchestrator (8000)..."
osascript <<EOF
tell application "Terminal"
    do script "cd '$BaseDir/orchestrator'; echo 'Orchestrator [Port 8000]'; if [ -f .venv/bin/activate ]; then source .venv/bin/activate; else echo '❌ VENV NOT FOUND!'; fi; python3.12 src/main.py"
end tell
EOF

# 🔵 BACKEND (Port 8003)
echo "-> Booting Backend (8003)..."
osascript <<EOF
tell application "Terminal"
    do script "cd '$BaseDir/backend'; echo 'Backend [Port 8003]'; if [ -f .venv/bin/activate ]; then source .venv/bin/activate; else echo '❌ VENV NOT FOUND!'; fi; python3.12 app.py"
end tell
EOF

# 🟠 FRONTEND (Port 5173)
echo "-> Booting Frontend (5173)..."
osascript <<EOF
tell application "Terminal"
    do script "cd '$BaseDir/frontend'; echo 'Frontend [Port 5173]'; npm run dev"
end tell
EOF

echo ""
echo "✅ All services successfully dispatched!"
echo "You can close this master window. Keep the 3 new windows open for live logs."