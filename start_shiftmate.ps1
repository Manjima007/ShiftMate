# PowerShell script to start all ShiftMate services

Write-Host "🚚 Starting ShiftMate Services..." -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Kill existing processes on our ports
Write-Host "Checking for existing services..." -ForegroundColor Yellow
$ports = @(3000, 8000, 8080)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  Stopping process on port $port ($($process.ProcessName))..." -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                Start-Sleep -Milliseconds 500
            }
        }
    }
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Green

# Start AI Model Service
Write-Host "  [1/3] Starting AI Model Service (port 8000)..." -ForegroundColor Cyan
$aiPath = Join-Path $PSScriptRoot "services\ai-model"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$aiPath'; `$env:PYTHONPATH='$aiPath'; python -m uvicorn main:app --host 0.0.0.0 --port 8000" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start API Core Service
Write-Host "  [2/3] Starting API Core Service (port 3000)..." -ForegroundColor Cyan
$apiPath = Join-Path $PSScriptRoot "services\api-core"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiPath'; node server.js" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "  [3/3] Starting Frontend Server (port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python serve_frontend.py" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "  Frontend:    http://localhost:8080/index.html" -ForegroundColor White
Write-Host "  API Core:    http://localhost:3000" -ForegroundColor White
Write-Host "  AI Service:  http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "📝 API Documentation:" -ForegroundColor Cyan
Write-Host "  API Core:    http://localhost:3000/" -ForegroundColor White
Write-Host "  AI Service:  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to open the frontend in your browser..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Start-Process "http://localhost:8080/index.html"

Write-Host ""
Write-Host "✨ ShiftMate is ready!" -ForegroundColor Green
Write-Host "Close the terminal windows to stop the services." -ForegroundColor Yellow
