# 🚀 Quick Start - ShiftMate AI Service

## ✅ Server is Working! Model Loaded Successfully!

### 🎯 Current Status:
- ✅ PyTorch 2.5.1 installed (fixed compatibility)
- ✅ YOLO v8 model loads successfully  
- ✅ GPU detection working
- ✅ All dependencies installed
- ✅ CORS configured for browser access
- ⚠️ Windows terminal sends interrupt signals (fixed with pythonw.exe)

---

## 🖥️ How to Start the Server

### Method 1: Double-Click Batch File (EASIEST)
```
Just double-click: start_server.bat
```
The server will start in a console window. Keep it open!

### Method 2: PowerShell Command
```powershell
cd C:\Users\Manjima\OneDrive\Desktop\ShiftMate\services\ai-model
Start-Process -NoNewWindow -FilePath "venv\Scripts\pythonw.exe" -ArgumentList "run_server.py"
```

### Method 3: Docker (RECOMMENDED for production)
```bash
cd C:\Users\Manjima\OneDrive\Desktop\ShiftMate
docker-compose up ai
```

---

## 🧪 How to Test Detection

### Option 1: Use the Test UI
1. Start the server (see above)
2. Open in browser: `test_ui.html`
3. Upload a furniture image (chair, couch, table, etc.)
4. Click "Detect Objects"

### Option 2: Use Swagger UI
1. Start the server
2. Go to: http://127.0.0.1:8000/docs
3. Try the `/api/v1/ai/detect` endpoint
4. Upload an image file

### Option 3: Use PowerShell
```powershell
$image = [System.IO.File]::ReadAllBytes("path\to\image.jpg")
$boundary = [System.Guid]::NewGuid().ToString()
$body = @"
--$boundary
Content-Disposition: form-data; name="image"; filename="test.jpg"
Content-Type: image/jpeg

$([System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($image))
--$boundary--
"@

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/ai/detect" `
    -Method POST `
    -ContentType "multipart/form-data; boundary=$boundary" `
    -Body $body
```

---

## 📡 API Endpoints

### Health Check
```bash
GET http://127.0.0.1:8000/api/v1/ai/health
```
Returns: Model status, GPU availability

### Object Detection
```bash
POST http://127.0.0.1:8000/api/v1/ai/detect
Content-Type: multipart/form-data

Body: image file (JPG/PNG)
```
Returns: Detected items with bounding boxes, volumes, categories

### Supported Items List
```bash
GET http://127.0.0.1:8000/api/v1/ai/supported-items
```
Returns: List of all detectable furniture/items

---

## 🐛 Troubleshooting

### Server Immediately Shuts Down
**Cause:** Windows PowerShell terminal sends keyboard interrupt
**Solution:** Use `pythonw.exe` (windowless Python) instead of `python.exe`
```powershell
# Don't use:
python.exe run_server.py

# Use:
pythonw.exe run_server.py
# OR use start_server.bat
```

### Port 8000 Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it (replace PID with actual process ID)
taskkill /F /PID <PID>
```

### Model Not Loading
Check health endpoint:
```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/ai/health
```
Should show: `model_loaded: true`

### CORS Errors in Browser
Make sure main.py has CORS middleware (already added):
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
```

### Detection Returns Empty Results
- Make sure image contains furniture (chair, couch, bed, table)
- Image should be clear and well-lit
- YOLO v8n detects common objects - it may not detect everything

---

## 🔧 System Requirements
- Python 3.12.4
- PyTorch 2.5.1 (CPU or CUDA 11.8)
- YOLO v8 (ultralytics 8.0.228)
- FastAPI 0.104.1
- Windows 10/11 (or Docker on any OS)

---

## 📊 What the AI Detects
The model can detect these categories:
- **Furniture:** chair, couch, bed, dining table
- **Electronics:** TV, laptop, keyboard, mouse
- **Appliances:** refrigerator, oven, microwave
- **Storage:** boxes (small, medium, large)

Each detected item includes:
- Bounding box coordinates
- Confidence score
- Estimated volume (cubic meters)
- Category and fragility rating

---

## 🎉 SUCCESS INDICATORS

You know it's working when you see:
```
✓ Model loaded successfully
✓ GPU available: True
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000
```

Health check returns:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "gpu_available": true
}
```

---

## 🚦 Next Steps

1. ✅ **Server Running** - You're here!
2. ⏭️ **Test Detection** - Upload furniture images
3. ⏭️ **Complete Sprint 1** - Commit code to Git
4. ⏭️ **Sprint 1.5** - Setup CI/CD pipelines
5. ⏭️ **Sprint 2** - Database schema
6. ⏭️ **Sprint 7-8** - Train custom furniture model

---

**Server URL:** http://127.0.0.1:8000  
**API Docs:** http://127.0.0.1:8000/docs  
**Test UI:** file:///.../test_ui.html
