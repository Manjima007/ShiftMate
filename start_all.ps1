# ShiftMate Startup Script
# This script starts all three services: API Core, AI Model, and React Frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting ShiftMate Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Function to start a service in a new window
function Start-Service {
    param($Name, $Path, $Command, $Color)
    Write-Host "Starting $Name..." -ForegroundColor $Color
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Path'; $Command"
    Start-Sleep -Seconds 2
}

# Check if ports are available
Write-Host "Checking port availability..." -ForegroundColor Yellow

$apiPort = Test-Port -Port 3000
$aiPort = Test-Port -Port 8000
$frontendPort = Test-Port -Port 5174

if ($apiPort) {
    Write-Host "WARNING: Port 3000 (API Core) is already in use" -ForegroundColor Yellow
} else {
    Write-Host "Port 3000 is available" -ForegroundColor Green
}

if ($aiPort) {
    Write-Host "WARNING: Port 8000 (AI Model) is already in use" -ForegroundColor Yellow
} else {
    Write-Host "Port 8000 is available" -ForegroundColor Green
}

if ($frontendPort) {
    Write-Host "WARNING: Port 5174 (React Frontend) is already in use" -ForegroundColor Yellow
} else {
    Write-Host "Port 5174 is available" -ForegroundColor Green
}

Write-Host ""
Start-Sleep -Seconds 1

# Start API Core (Port 3000)
if (-not $apiPort) {
    Start-Service -Name "API Core" -Path "C:\Users\kinja\ShiftMate\services\api-core" -Command "npm start" -Color "Blue"
} else {
    Write-Host "Skipping API Core (already running)" -ForegroundColor Yellow
}

# Start AI Model Service (Port 8000)
if (-not $aiPort) {
    Start-Service -Name "AI Model" -Path "C:\Users\kinja\ShiftMate\services\ai-model" -Command "python run_server.py" -Color "Magenta"
} else {
    Write-Host "Skipping AI Model (already running)" -ForegroundColor Yellow
}

# Start React Frontend (Port 5174)
if (-not $frontendPort) {
    Start-Service -Name "React Frontend" -Path "C:\Users\kinja\ShiftMate\frontend-react" -Command "npm run dev" -Color "Cyan"
} else {
    Write-Host "Skipping React Frontend (already running)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   All Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor White
Write-Host "  - API Core:       http://localhost:3000" -ForegroundColor Blue
Write-Host "  - AI Model:       http://localhost:8000" -ForegroundColor Magenta
Write-Host "  - React Frontend: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Documentation:" -ForegroundColor White
Write-Host "  - AI Model Docs:  http://localhost:8000/docs" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to open the React app in browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:5174"

Write-Host ""
Write-Host "ShiftMate is now running!" -ForegroundColor Green
Write-Host "Press Ctrl+C in each window to stop the services." -ForegroundColor Yellow
