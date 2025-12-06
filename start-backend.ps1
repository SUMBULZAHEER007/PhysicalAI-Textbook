<#
start-backend.ps1

Usage:
  From PowerShell run: .\start-backend.ps1
  Or pass a custom backend path: .\start-backend.ps1 -BackendRoot "C:\path\to\backend"

This script will:
 - cd to the backend folder
 - create a Python venv (if missing)
 - activate the venv
 - install `requirements.txt` (if present)
 - copy `.env.template` to `.env` (if missing) and prompt to edit
 - start Uvicorn (FastAPI) on port 8000
#>

param(
    [string]$BackendRoot = "C:\Users\sumbul\Hackathon-1\PhysicalAITextbook\backend"
)

Write-Host "[start-backend] Backend root: $BackendRoot"

if (-not (Test-Path $BackendRoot)) {
    Write-Error "Backend path not found: $BackendRoot"
    exit 1
}

Set-Location $BackendRoot

# Check python
$py = (Get-Command python -ErrorAction SilentlyContinue)
if (-not $py) {
    Write-Error "Python not found in PATH. Please install Python 3.11+ and try again."
    exit 1
}

# Create venv if missing
if (-not (Test-Path ".\venv")) {
    Write-Host "[start-backend] Creating virtual environment..."
    python -m venv venv
}

# Activate venv
Write-Host "[start-backend] Activating virtual environment..."
$activate = Join-Path $PWD "venv\Scripts\Activate.ps1"
if (-not (Test-Path $activate)) {
    Write-Error "Activation script not found: $activate"
    exit 1
}

# Use the current process to dot-source the activation script so subsequent commands use venv
. $activate

# Install requirements if file exists
if (Test-Path ".\requirements.txt") {
    Write-Host "[start-backend] Installing Python requirements..."
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Error "pip install failed (exit code $LASTEXITCODE). Fix errors and try again."
        exit $LASTEXITCODE
    }
} else {
    Write-Warning "No requirements.txt found in $BackendRoot. Skipping pip install."
}

# Copy .env.template to .env if not present
if (Test-Path ".env.template" -and -not (Test-Path ".env")) {
    Write-Host "[start-backend] Creating .env from .env.template (edit values after this)..."
    Copy-Item -Path .env.template -Destination .env
    Write-Host "[start-backend] Please edit .env and add your API keys (OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY, DATABASE_URL, etc.)"
} elseif (-not (Test-Path ".env.template") -and -not (Test-Path ".env")) {
    Write-Warning "No .env.template found and no .env present. Create a .env file with required keys before starting the server."
}

# Start Uvicorn
Write-Host "[start-backend] Starting Uvicorn on http://127.0.0.1:8000 ..."
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# End of script
