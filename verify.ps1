# Quick Verification Script
# Run this to check if all services are working correctly

Write-Host ""
Write-Host "="*70 -ForegroundColor Cyan
Write-Host "  ShiftMate Services Verification" -ForegroundColor Cyan
Write-Host "="*70 -ForegroundColor Cyan
Write-Host ""

# Check services
Write-Host "[1/4] Checking Services..." -ForegroundColor Yellow
$ai = Test-NetConnection localhost -Port 8000 -InformationLevel Quiet -WarningAction SilentlyContinue
$api = Test-NetConnection localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
$frontend = Test-NetConnection localhost -Port 5174 -InformationLevel Quiet -WarningAction SilentlyContinue

Write-Host "  AI Service (8000):  " -NoNewline
if($ai){ Write-Host "[OK] Running" -ForegroundColor Green } else { Write-Host "[FAIL] Not Running" -ForegroundColor Red }

Write-Host "  API Core (3000):    " -NoNewline
if($api){ Write-Host "[OK] Running" -ForegroundColor Green } else { Write-Host "[FAIL] Not Running" -ForegroundColor Red }

Write-Host "  Frontend (5174):    " -NoNewline
if($frontend){ Write-Host "[OK] Running" -ForegroundColor Green } else { Write-Host "[FAIL] Not Running" -ForegroundColor Red }

Write-Host ""

# Test AI service health
if ($ai) {
    Write-Host "[2/4] Testing AI Service Health..." -ForegroundColor Yellow
    try {
        $health = Invoke-RestMethod http://localhost:8000/api/v1/ai/health -ErrorAction Stop
        Write-Host "  Status:       " -NoNewline
        Write-Host $health.status -ForegroundColor Green
        Write-Host "  Model Loaded: " -NoNewline
        Write-Host $health.model_loaded -ForegroundColor $(if($health.model_loaded){"Green"}else{"Red"})
        Write-Host "  Model Name:   " -NoNewline
        Write-Host $health.model_name -ForegroundColor Cyan
    } catch {
        Write-Host "  ✗ Failed to get health status" -ForegroundColor Red
    }
} else {
    Write-Host "[2/4] AI Service Not Running - Skipping Health Check" -ForegroundColor Red
}

Write-Host ""

# Test API Core
if ($api) {
    Write-Host "[3/4] Testing API Core..." -ForegroundColor Yellow
    try {
        $apiHealth = Invoke-RestMethod http://localhost:3000/api/health -ErrorAction Stop
        Write-Host "  Status:   " -NoNewline
        Write-Host $apiHealth.status -ForegroundColor Green
        Write-Host "  Database: " -NoNewline
        Write-Host $apiHealth.database -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed to get API health" -ForegroundColor Red
    }
} else {
    Write-Host "[3/4] API Core Not Running - Skipping Test" -ForegroundColor Red
}

Write-Host ""

# Check for quantity fix
Write-Host "[4/4] Verifying Code Fix..." -ForegroundColor Yellow
$fixCheck = Select-String -Path "services\ai-model\main.py" -Pattern "quantity: 1  # Initialize" -Quiet
if ($fixCheck) {
    Write-Host "  [OK] Quantity fix present in code" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] Quantity fix NOT found in code" -ForegroundColor Red
}

Write-Host ""
Write-Host "="*70 -ForegroundColor Cyan

# Summary
Write-Host ""
$allGood = $ai -and $api -and $frontend -and $fixCheck
if ($allGood) {
    Write-Host "  [SUCCESS] All Systems Operational!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Open http://localhost:5174 in your browser" -ForegroundColor White
    Write-Host "  2. Navigate to Upload page" -ForegroundColor White
    Write-Host "  3. Upload an image with furniture" -ForegroundColor White
    Write-Host "  4. Click 'Detect Objects'" -ForegroundColor White
    Write-Host ""
    $openBrowser = Read-Host "  Open browser now? (y/n)"
    if ($openBrowser -eq 'y') {
        Start-Process "http://localhost:5174/upload"
    }
} else {
    Write-Host "  [WARNING] Some Issues Detected" -ForegroundColor Yellow
    Write-Host ""
    if (-not ($ai -and $api -and $frontend)) {
        Write-Host "  Some services are not running. Start them with:" -ForegroundColor White
        Write-Host "  cd c:\ShiftMate" -ForegroundColor Gray
        Write-Host "  .\start_all.ps1" -ForegroundColor Gray
    }
    if (-not $fixCheck) {
        Write-Host "  Code fix not found. The file may have been modified." -ForegroundColor White
    }
}

Write-Host ""
Write-Host "="*70 -ForegroundColor Cyan
Write-Host ""
