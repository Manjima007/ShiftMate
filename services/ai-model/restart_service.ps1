# Restart AI Service Script
# This script stops and restarts the AI Model service

Write-Host "="*60 -ForegroundColor Cyan
Write-Host "  ShiftMate AI Service Restart Script" -ForegroundColor Cyan
Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""

# Stop existing Python processes (AI service)
Write-Host "[1/3] Stopping existing AI service..." -ForegroundColor Yellow
$pythonProcesses = Get-Process python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    $pythonProcesses | Stop-Process -Force
    Write-Host "  ✓ Stopped $($pythonProcesses.Count) Python process(es)" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ℹ No running Python processes found" -ForegroundColor Gray
}

# Start AI service in new window
Write-Host "[2/3] Starting AI service..." -ForegroundColor Yellow
$aiPath = "c:\ShiftMate\services\ai-model"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$aiPath'; Write-Host 'Starting AI Service...' -ForegroundColor Cyan; python run_server.py" -WindowStyle Normal
Start-Sleep -Seconds 4

# Check if service is running
Write-Host "[3/3] Verifying service..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName localhost -Port 8000 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($connection) {
    Write-Host "  ✓ AI Service is running on http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Endpoints:" -ForegroundColor Cyan
    Write-Host "  - Health: http://localhost:8000/api/v1/ai/health" -ForegroundColor White
    Write-Host "  - Detect: http://localhost:8000/api/v1/ai/detect" -ForegroundColor White
    Write-Host "  - Docs:   http://localhost:8000/docs" -ForegroundColor White
} else {
    Write-Host "  ✗ Service failed to start. Check the PowerShell window for errors." -ForegroundColor Red
    Write-Host "  Common issues:" -ForegroundColor Yellow
    Write-Host "    - Port 8000 already in use" -ForegroundColor Gray
    Write-Host "    - Missing Python dependencies" -ForegroundColor Gray
    Write-Host "    - Python not in PATH" -ForegroundColor Gray
}

Write-Host ""
Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""
