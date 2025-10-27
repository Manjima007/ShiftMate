"""AI Model Service - Simplified Version for Local Development"""
import time
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json

# Initialize FastAPI app
app = FastAPI(
    title="ShiftMate AI Service",
    description="Object detection service for furniture and household items (Simplified)",
    version="1.0.0"
)

# Configure CORS - Allow requests from any origin (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/", response_model=dict)
def read_root():
    """Root endpoint"""
    return {
        "service": "ShiftMate AI Model Service",
        "status": "Running",
        "version": "1.0.0",
        "mode": "DEVELOPMENT (Simplified)"
    }

@app.get("/api/v1/ai/health", response_model=dict)
def health_check():
    """Health check endpoint"""
    return {
        "service": "AI Model Service",
        "status": "healthy",
        "model_loaded": True,
        "model_name": "mock-model",
        "gpu_available": False,
        "mode": "development"
    }

@app.post("/api/v1/ai/detect", response_model=dict)
async def detect_objects(
    image: UploadFile = File(...),
    booking_ref: Optional[str] = None
):
    """
    Mock object detection for development
    """
    start_time = time.time()
    
    try:
        # Read image (just to validate it's an image)
        image_bytes = await image.read()
        
        # Mock detection results
        mock_items = [
            {
                "item_id": 1,
                "name": "Chair",
                "category": "furniture",
                "quantity": 2,
                "volume_cu_ft": 2.5,
                "is_fragile": False,
                "confidence_score": 0.95,
                "bounding_box": {
                    "x1": 100,
                    "y1": 150,
                    "x2": 200,
                    "y2": 300
                }
            },
            {
                "item_id": 2,
                "name": "Table",
                "category": "furniture",
                "quantity": 1,
                "volume_cu_ft": 8.0,
                "is_fragile": False,
                "confidence_score": 0.92,
                "bounding_box": {
                    "x1": 250,
                    "y1": 100,
                    "x2": 450,
                    "y2": 200
                }
            }
        ]
        
        total_volume = sum(item["quantity"] * item["volume_cu_ft"] for item in mock_items)
        processing_time = time.time() - start_time
        
        return {
            "status": "completed",
            "booking_ref": booking_ref,
            "detected_items": mock_items,
            "total_estimated_volume_cu_ft": round(total_volume, 2),
            "processing_time_seconds": round(processing_time, 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

@app.get("/api/v1/ai/supported-items", response_model=List[dict])
def get_supported_items():
    """Get list of items that can be detected"""
    return [
        {
            "item_id": 1,
            "name": "Chair",
            "category": "furniture",
            "avg_volume_cu_ft": 2.5,
            "is_fragile": False,
            "weight_estimate_lbs": 15
        },
        {
            "item_id": 2,
            "name": "Table",
            "category": "furniture",
            "avg_volume_cu_ft": 8.0,
            "is_fragile": False,
            "weight_estimate_lbs": 50
        },
        {
            "item_id": 3,
            "name": "Sofa",
            "category": "furniture",
            "avg_volume_cu_ft": 25.0,
            "is_fragile": False,
            "weight_estimate_lbs": 120
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
