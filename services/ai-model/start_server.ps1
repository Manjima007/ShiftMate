# ShiftMate AI Service Startup Script
# Run this with: .\start_server.ps1

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting ShiftMate AI Service" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📍 Server will run on: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "📖 API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""

# Open browser
Start-Process "http://127.0.0.1:8000/docs"

# Start server using pythonw (windowless) to avoid console interrupt issues
Start-Process -NoNewWindow -FilePath "$scriptPath\venv\Scripts\pythonw.exe" -ArgumentList "$scriptPath\run_server.py"

Write-Host "✅ Server started in background!" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the server:" -ForegroundColor Yellow
Write-Host "  Get-Process | Where-Object {`$_.ProcessName -eq 'pythonw'} | Stop-Process" -ForegroundColor Gray
Write-Host ""
