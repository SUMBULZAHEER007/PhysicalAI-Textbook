<#
start-frontend.ps1

Usage:
  From PowerShell run: .\start-frontend.ps1
  Or pass a custom path: .\start-frontend.ps1 -SiteRoot "C:\path\to\physical-ai-book"

This script will:
 - cd to the Docusaurus site root
 - run `npm install` (if needed)
 - start the Docusaurus dev server (`npm run start`)
#>

param(
    [string]$SiteRoot = "C:\Users\sumbul\Hackathon-1\PhysicalAITextbook\physical-ai-book"
)

Write-Host "[start-frontend] Changing to site root: $SiteRoot"

if (-not (Test-Path $SiteRoot)) {
    Write-Error "Site root not found: $SiteRoot"
    exit 1
}

Set-Location $SiteRoot

# Ensure Node is available
$node = (Get-Command node -ErrorAction SilentlyContinue)
if (-not $node) {
    Write-Error "Node.js not found in PATH. Please install Node 18+ and try again."
    exit 1
}

Write-Host "[start-frontend] Installing npm dependencies (this may take a while)..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "npm install failed (exit code $LASTEXITCODE). Fix errors and try again."
    exit $LASTEXITCODE
}

Write-Host "[start-frontend] Starting Docusaurus dev server (http://localhost:3000)"
npm run start

# When the script ends, the dev server will keep running in this terminal

