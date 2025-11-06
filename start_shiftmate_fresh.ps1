# PowerShell script to start all ShiftMate services with FRESH CODE

Write-Host "========================================================================================" -ForegroundColor Cyan
Write-Host "  ShiftMate Service Launcher (WITH CACHE CLEARING)" -ForegroundColor Cyan
Write-Host "========================================================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Step 1: Kill existing processes
Write-Host "[STEP 1/5] Stopping existing services..." -ForegroundColor Yellow
$ports = @(3000, 5173, 8000)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  -> Stopping process on port $port ($($process.ProcessName))..." -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                Start-Sleep -Milliseconds 500
            }
        }
    }
}

# Step 2: Clear Python cache (CRITICAL!)
Write-Host ""
Write-Host "[STEP 2/5] Clearing Python cache to ensure fresh code loads..." -ForegroundColor Yellow
$aiPath = Join-Path $PSScriptRoot "services\ai-model"
$pycacheFiles = Get-ChildItem -Path $aiPath -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue
foreach ($cache in $pycacheFiles) {
    Write-Host "  -> Removing: $($cache.FullName)" -ForegroundColor DarkGray
    Remove-Item -Path $cache.FullName -Recurse -Force -ErrorAction SilentlyContinue
}
$pycFiles = Get-ChildItem -Path $aiPath -Recurse -Filter "*.pyc" -ErrorAction SilentlyContinue
foreach ($pyc in $pycFiles) {
    Write-Host "  -> Removing: $($pyc.FullName)" -ForegroundColor DarkGray
    Remove-Item -Path $pyc.FullName -Force -ErrorAction SilentlyContinue
}
Write-Host "  Cache cleared!" -ForegroundColor Green

# Step 3: Start AI Model Service with NO BYTECODE CACHING
Write-Host ""
Write-Host "[STEP 3/5] Starting AI Model Service (port 8000)..." -ForegroundColor Cyan
Write-Host "  Model: YOLOv8s (Small - Better Accuracy)" -ForegroundColor Gray
Write-Host "  Settings: conf=0.15, iou=0.40, imgsz=1280" -ForegroundColor Gray
$aiStartScript = @"
cd '$aiPath'
`$env:PYTHONPATH='$aiPath'
`$env:PYTHONDONTWRITEBYTECODE='1'
Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host 'AI Model Service Starting...' -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green
python run_server.py
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $aiStartScript -WindowStyle Normal
Write-Host "  Waiting for AI service to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Step 4: Start API Core Service
Write-Host ""
Write-Host "[STEP 4/5] Starting API Core Service (port 3000)..." -ForegroundColor Cyan
$apiPath = Join-Path $PSScriptRoot "services\api-core"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$apiPath'; node server.js" -WindowStyle Normal
Write-Host "  Waiting for API Core to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Step 5: Start React Frontend
Write-Host ""
Write-Host "[STEP 5/5] Starting React Frontend (port 5173)..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "frontend-react"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Write-Host "  Waiting for frontend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================================================================" -ForegroundColor Green
Write-Host "  ALL SERVICES STARTED!" -ForegroundColor Green
Write-Host "========================================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor Cyan
Write-Host "  AI Model:     http://localhost:8000/docs" -ForegroundColor White
Write-Host "  API Core:     http://localhost:3000/api/health" -ForegroundColor White
Write-Host "  Frontend:     http://localhost:5173" -ForegroundColor White
Write-Host "  Upload Page:  http://localhost:5173/upload" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT NOTES:" -ForegroundColor Yellow
Write-Host "  - Python cache cleared - NEW CODE is loading!" -ForegroundColor Green
Write-Host "  - YOLOv8s model will auto-download on first detection (~22MB)" -ForegroundColor Gray
Write-Host "  - Quantity fix is active - no more 'quantity' errors!" -ForegroundColor Green
Write-Host "  - Detection optimized for furniture (beds, chairs, tables, etc.)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop services" -ForegroundColor DarkGray
Write-Host ""
