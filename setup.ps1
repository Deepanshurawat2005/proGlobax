# USE PYTHON : Python 3.12.2


# setup.ps1
# proGlobax Project Setup Script

Write-Host "Starting project setup..." -ForegroundColor Cyan

# ---------------------------------------------------------
# 1. Frontend Setup (React / Node.js)
# ---------------------------------------------------------
Write-Host "`n[1/3] Setting up Frontend (React)..." -ForegroundColor Yellow
if (Test-Path ".\frontend") {
    Set-Location .\frontend
    Write-Host "Running npm install..."
    npm install
    Set-Location ..
    Write-Host "✅ Frontend setup complete." -ForegroundColor Green
} else {
    Write-Host "❌ Warning: './frontend' directory not found. Skipping." -ForegroundColor Red
}

# ---------------------------------------------------------
# 2. Backend Setup (Python Flask/FastAPI)
# ---------------------------------------------------------
Write-Host "`n[2/3] Setting up Backend..." -ForegroundColor Yellow
if (Test-Path ".\backend") {
    Set-Location .\backend
    Write-Host "Creating virtual environment (.venv)..."
    python -m venv .venv

    Write-Host "Activating .venv and installing dependencies..."
    # Activate virtual environment
    & .\.venv\Scripts\Activate.ps1
    
    # Upgrade pip to avoid warnings
    python -m pip install --upgrade pip | Out-Null
    
    if (Test-Path ".\requirements.txt") {
        pip install -r requirements.txt
    } else {
        Write-Host "⚠️ Warning: requirements.txt not found in ./backend." -ForegroundColor DarkYellow
    }
    
    # Deactivate the environment before moving to the next folder
    deactivate
    Set-Location ..
    Write-Host "✅ Backend setup complete." -ForegroundColor Green
} else {
    Write-Host "❌ Warning: './backend' directory not found. Skipping." -ForegroundColor Red
}

# ---------------------------------------------------------
# 3. Orchestrator Setup (Python Flask)
# ---------------------------------------------------------
Write-Host "`n[3/3] Setting up Orchestrator..." -ForegroundColor Yellow
if (Test-Path ".\orchestrator") {
    Set-Location .\orchestrator
    Write-Host "Creating virtual environment (.venv)..."
    python -m venv .venv

    Write-Host "Activating .venv and installing dependencies..."
    # Activate virtual environment
    & .\.venv\Scripts\Activate.ps1
    
    # Upgrade pip
    python -m pip install --upgrade pip | Out-Null
    
    if (Test-Path ".\requirements.txt") {
        pip install -r requirements.txt
    } else {
        Write-Host "⚠️ Warning: requirements.txt not found in ./orchestrator." -ForegroundColor DarkYellow
    }
    
    # Deactivate the environment
    deactivate
    Set-Location ..
    Write-Host "✅ Orchestrator setup complete." -ForegroundColor Green
} else {
    Write-Host "❌ Warning: './orchestrator' directory not found. Skipping." -ForegroundColor Red
}

Write-Host "`n🎉 Setup finished successfully!" -ForegroundColor Cyan