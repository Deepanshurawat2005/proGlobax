# USE PYTHON : Python 3.12.2


# start_services.ps1
# proGlobax Workstation - Bulletproof Startup Script

# 1. Lock the working directory to exactly where this script lives
$BaseDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($BaseDir)) { $BaseDir = (Get-Location).Path }

Write-Host "Starting proGlobax Workstation from: $BaseDir" -ForegroundColor Cyan

# 2. Port Sniper (Kills stuck ghost processes with a safety delay)
Function Free-Port {
    param ([int]$Port)
    $Connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($Connections) {
        $PIDs = $Connections.OwningProcess | Select-Object -Unique
        foreach ($ProcessID in $PIDs) {
            Write-Host "Port $Port is busy. Assassinating ghost process ID $ProcessID..." -ForegroundColor Yellow
            Stop-Process -Id $ProcessID -Force -ErrorAction SilentlyContinue
        }
        # CRITICAL: Wait for Windows to actually release the network socket before moving on
        Write-Host "Waiting for OS to release port $Port..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 2 
        Write-Host "Port $Port is now completely free." -ForegroundColor Green
    } else {
        Write-Host "Port $Port is already free." -ForegroundColor Green
    }
}

Write-Host "`nSweeping ports for ghost processes..." -ForegroundColor Cyan
Free-Port -Port 5173  # Frontend
Free-Port -Port 8000  # Orchestrator
Free-Port -Port 8003  # Backend

# 3. Launch Services in Isolated Windows
Write-Host "`nDispatching Services..." -ForegroundColor Cyan

# 🟢 ORCHESTRATOR (Targeting src/main.py on Port 8000)
Write-Host "-> Booting Orchestrator (8000)..." -ForegroundColor Green
$OrchCommand = "Set-Location -Path '$BaseDir\orchestrator'; `$host.ui.RawUI.WindowTitle = 'Orchestrator [Port 8000]'; if (Test-Path '.\.venv\Scripts\Activate.ps1') { & '.\.venv\Scripts\Activate.ps1' } else { Write-Host '❌ VENV NOT FOUND!' -ForegroundColor Red }; python src\main.py"
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass", "-NoExit", "-Command", $OrchCommand

# 🔵 BACKEND (Targeting app.py on Port 8003)
Write-Host "-> Booting Backend (8003)..." -ForegroundColor Green
$BackendCommand = "Set-Location -Path '$BaseDir\backend'; `$host.ui.RawUI.WindowTitle = 'Backend [Port 8003]'; if (Test-Path '.\.venv\Scripts\Activate.ps1') { & '.\.venv\Scripts\Activate.ps1' } else { Write-Host '❌ VENV NOT FOUND!' -ForegroundColor Red }; python app.py"
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass", "-NoExit", "-Command", $BackendCommand

# 🟠 FRONTEND (Targeting React on Port 5173)
Write-Host "-> Booting Frontend (5173)..." -ForegroundColor Green
$FrontCommand = "Set-Location -Path '$BaseDir\frontend'; `$host.ui.RawUI.WindowTitle = 'Frontend [Port 5173]'; npm run dev"
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass", "-NoExit", "-Command", $FrontCommand

Write-Host "`n✅ All services successfully dispatched!" -ForegroundColor Cyan
Write-Host "You can close this master window. Keep the 3 new windows open for live logs." -ForegroundColor White