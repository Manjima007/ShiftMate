# QUANTITY ERROR FIX - COMPLETE GUIDE

## Problem: "Detection failed: 'quantity'" Error

You're seeing this error because the AI service is loading **OLD CACHED CODE** instead of the fixed code.

---

## ✅ SOLUTION: Use the New Startup Script

### Quick Fix (Use This!)

```powershell
cd c:\ShiftMate
.\start_shiftmate_fresh.ps1
```

This script:
1. ✅ Stops all running services
2. ✅ **CLEARS Python cache** (__pycache__, *.pyc files)
3. ✅ Sets `PYTHONDONTWRITEBYTECODE=1` to prevent new cache files
4. ✅ Starts all services with **FRESH CODE**

---

## Why The Error Keeps Happening

### Root Cause: Python Module Caching

Python aggressively caches compiled bytecode (`.pyc` files) in `__pycache__` directories:

```
services/ai-model/
├── __pycache__/
│   ├── main.cpython-314.pyc      ← OLD CODE (with quantity bug)
│   ├── config.cpython-314.pyc
│   └── schemas.cpython-314.pyc
├── main.py                        ← NEW CODE (with quantity fix)
├── config.py
└── schemas.py
```

**What happens:**
1. You upload an image
2. Python loads `main.cpython-314.pyc` (OLD cached code)
3. OLD code doesn't have `"quantity": 1` initialization
4. KeyError: 'quantity' when creating response
5. Error 500 returned to frontend

**The fix exists in `main.py` line 216**, but Python never loads it!

---

## Verification Steps

### 1. Check Services Are Running

Open PowerShell and run:
```powershell
Get-Process python,node | Format-Table ProcessName,Id
```

Should see:
- 3 Python processes (AI service)
- 2+ Node processes (API Core + Frontend)

### 2. Test AI Service Directly

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/" -Method Get
```

Expected response:
```json
{
  "service": "ShiftMate AI Model Service",
  "status": "Running",
  "model": "yolov8s.pt",
  "version": "1.0.0"
}
```

### 3. Check Logs for New Format

The AI service window should show:
```
============================================================
AI Model Service Starting...
============================================================
==================================================
Starting ShiftMate AI Service
Server: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs
==================================================
Loading YOLO model: yolov8s.pt
✓ Model loaded successfully
```

### 4. Test Detection

Go to: **http://localhost:5173/upload**

Upload an image and look for this in the AI service window:
```
=== Processing Detection Results ===
Image size: (width, height)
Confidence threshold: 0.15
IOU threshold: 0.40

[1/X] Detected: chair
     ✓ Added new item type to collection (quantity initialized to 1)
```

**If you see this format** → ✅ New code is loading!  
**If you see old format** → ❌ Still cached, restart again

---

## Common Issues & Solutions

### Issue 1: "Request failed with status code 500"

**Cause**: AI service crashed or using old cached code

**Solution**:
```powershell
# Stop everything
Get-Process python,node | Stop-Process -Force

# Clear cache manually
cd c:\ShiftMate\services\ai-model
Remove-Item -Recurse -Force __pycache__
Remove-Item -Recurse -Force utils\__pycache__

# Restart
cd c:\ShiftMate
.\start_shiftmate_fresh.ps1
```

### Issue 2: Services won't start

**Cause**: Ports already in use

**Solution**:
```powershell
# Kill processes on specific ports
$ports = @(3000, 5173, 8000)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Stop-Process -Id $conn.OwningProcess -Force
    }
}
```

### Issue 3: "Detection failed: 'quantity'" STILL appears

**Cause**: You're using the old startup script or manually starting services

**Solutions**:

**Option A - Use new script** (RECOMMENDED):
```powershell
.\start_shiftmate_fresh.ps1
```

**Option B - Manual restart with cache clearing**:
```powershell
# 1. Stop all
Get-Process python,node | Stop-Process -Force

# 2. Clear cache
cd c:\ShiftMate\services\ai-model
Remove-Item -Recurse -Force __pycache__,*.pyc

# 3. Start AI service
$env:PYTHONDONTWRITEBYTECODE='1'
python run_server.py

# 4. In another terminal, start API Core
cd c:\ShiftMate\services\api-core
node server.js

# 5. In another terminal, start Frontend
cd c:\ShiftMate\frontend-react
npm run dev
```

---

## Updated Startup Scripts

### New Script: `start_shiftmate_fresh.ps1` ✅
- **USE THIS ONE** for guaranteed fresh code
- Clears Python cache automatically
- Sets `PYTHONDONTWRITEBYTECODE=1`
- Opens separate windows for each service
- Shows helpful status messages

### Old Script: `start_shiftmate.ps1` ⚠️
- **Don't use** - doesn't clear cache
- May load old cached code
- Will cause "quantity" errors

### Manual Script: `start_all.ps1`
- **Don't use** - doesn't clear cache
- Same issue as old script

---

## Technical Details

### The Quantity Fix (Line 216 in main.py)

```python
# When a new object type is detected for the first time:
item_counts[class_name] = {
    "name": catalog_item["name"],
    "class_id": int(class_id),
    "quantity": 1,  # ← THIS LINE FIXES THE ERROR
    "confidence": float(confidence),
    "dimensions": catalog_item["dimensions"],
    "volume_cubic_feet": catalog_item["volume_cubic_feet"]
}
```

**Before fix**: Dictionary created without `"quantity"` key  
**After fix**: Dictionary always has `"quantity": 1` on first detection  
**Result**: No more KeyError when accessing `item["quantity"]` later

### Why Cache Clearing is Critical

Python's import system:
1. Check if `.pyc` exists and is newer than `.py`
2. If yes → Load `.pyc` (FAST but OLD code)
3. If no → Compile `.py` to `.pyc` and load

**Problem**: Even if you edit `main.py`, Python sees the `.pyc` timestamp and uses cached version!

**Solution**: Delete `.pyc` files OR set `PYTHONDONTWRITEBYTECODE=1`

---

## Expected Behavior After Fix

### Before (With Bug)
```
Upload image → Detection starts → Error: 'quantity' → Status 500
```

### After (Fixed)
```
Upload image → Detection starts → Objects detected → Success!

Response:
{
  "items": [
    { "name": "chair", "quantity": 2, "confidence": 0.85 },
    { "name": "table", "quantity": 1, "confidence": 0.91 }
  ],
  "total_items": 3,
  "annotated_image": "data:image/jpeg;base64,..."
}
```

---

## Quick Reference

### Start Services (FRESH CODE)
```powershell
cd c:\ShiftMate
.\start_shiftmate_fresh.ps1
```

### Stop All Services
```powershell
Get-Process python,node | Stop-Process -Force
```

### Clear Cache Manually
```powershell
cd c:\ShiftMate\services\ai-model
Remove-Item -Recurse -Force __pycache__,*.pyc
```

### Test Detection
1. Open: http://localhost:5173/upload
2. Upload image with furniture
3. Click "Detect Objects"
4. Should see results (no error 500)

---

## Summary

✅ **Root Cause**: Python module caching (.pyc files)  
✅ **Fix Applied**: Quantity initialization in main.py line 216  
✅ **Solution**: Use `start_shiftmate_fresh.ps1` to clear cache  
✅ **Model Upgrade**: YOLOv8s for better detection  
✅ **Verification**: Check logs for new format  

**Status**: 🎯 **READY TO TEST!**

Go to http://localhost:5173/upload and try detecting objects - the quantity error should be gone! 🚀
