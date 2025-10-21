"""AI Model Service - Object Detection for Moving Items"""
import time
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
from ultralytics import YOLO

import config
from schemas import (
    DetectionResponse, HealthCheck, DetectedItem, 
    SupportedItem, ErrorResponse, BoundingBox
)
from utils.image_processing import validate_image, preprocess_image, save_temp_image
from utils.volume_calculator import estimate_volume, get_item_details, map_yolo_class, load_catalog

# Initialize FastAPI app
app = FastAPI(
    title="ShiftMate AI Service",
    description="Object detection service for furniture and household items",
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

# Global model variable
model = None

def get_model():
    """Lazy load YOLO model on first request"""
    global model
    if model is None:
        print(f"Loading YOLO model: {config.MODEL_NAME}")
        try:
            model = YOLO(config.MODEL_NAME)  # Will auto-download if not exists
            print(f"✓ Model loaded successfully")
            print(f"✓ GPU available: {torch.cuda.is_available()}")
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            model = None
    return model

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=dict)
def read_root():
    """Root endpoint"""
    return {
        "service": "ShiftMate AI Model Service",
        "status": "Running",
        "version": "1.0.0",
        "model": config.MODEL_NAME,
        "mode": "PRODUCTION"
    }


@app.get("/api/v1/ai/health", response_model=HealthCheck)
def health_check():
    """Health check endpoint"""
    current_model = get_model()
    return HealthCheck(
        service="AI Model Service",
        status="healthy" if current_model is not None else "degraded",
        model_loaded=current_model is not None,
        model_name=config.MODEL_NAME,
        gpu_available=torch.cuda.is_available()
    )


@app.post("/api/v1/ai/detect", response_model=DetectionResponse)
async def detect_objects(
    image: UploadFile = File(...),
    booking_ref: Optional[str] = None
):
    """
    Detect furniture and household items from uploaded image
    
    Args:
        image: Image file (JPG, PNG)
        booking_ref: Optional booking reference ID
        
    Returns:
        Detection results with items and volume estimates
    """
    start_time = time.time()
    
    # Lazy load model on first request
    current_model = get_model()
    if current_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Read and validate image
        image_bytes = await image.read()
        is_valid, error_msg = validate_image(image_bytes, image.filename)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Preprocess image
        img = preprocess_image(image_bytes)
        
        # Run inference
        results = current_model(img, conf=config.CONFIDENCE_THRESHOLD, iou=config.IOU_THRESHOLD)
        
        # Process detections
        detected_items = []
        item_counts = {}
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Get detection info
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                coords = box.xyxy[0].tolist()
                
                # Map to item name
                class_name = result.names[class_id]
                
                # Get item details
                is_fragile, category, weight = get_item_details(class_name)
                volume = estimate_volume(class_name)
                
                # Count duplicates
                if class_name in item_counts:
                    item_counts[class_name]["quantity"] += 1
                else:
                    item_counts[class_name] = {
                        "name": class_name,
                        "category": category,
                        "volume": volume,
                        "is_fragile": is_fragile,
                        "confidence": confidence,
                        "bbox": coords
                    }
        
        # Convert to response format
        item_id = 1
        for item_name, item_data in item_counts.items():
            detected_items.append(DetectedItem(
                item_id=item_id,
                name=item_data["name"].title(),
                category=item_data["category"],
                quantity=item_data.get("quantity", 1),
                volume_cu_ft=item_data["volume"],
                is_fragile=item_data["is_fragile"],
                confidence_score=round(item_data["confidence"], 2),
                bounding_box=BoundingBox(
                    x1=item_data["bbox"][0],
                    y1=item_data["bbox"][1],
                    x2=item_data["bbox"][2],
                    y2=item_data["bbox"][3]
                ) if item_data.get("bbox") else None
            ))
            item_id += 1
        
        # Calculate total volume
        total_volume = sum(
            item.quantity * item.volume_cu_ft for item in detected_items
        )
        
        processing_time = time.time() - start_time
        
        return DetectionResponse(
            status="completed",
            booking_ref=booking_ref,
            detected_items=detected_items,
            total_estimated_volume_cu_ft=round(total_volume, 2),
            processing_time_seconds=round(processing_time, 2)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")


@app.get("/api/v1/ai/supported-items", response_model=List[SupportedItem])
def get_supported_items():
    """Get list of items that can be detected"""
    catalog = load_catalog()
    items = []
    item_id = 1
    
    for category, category_items in catalog.get("categories", {}).items():
        for item_name, item_data in category_items.items():
            items.append(SupportedItem(
                item_id=item_id,
                name=item_name.title(),
                category=category,
                avg_volume_cu_ft=item_data["volume"],
                is_fragile=item_data["fragile"],
                weight_estimate_lbs=item_data.get("weight")
            ))
            item_id += 1
    
    return items


# if __name__ == "__main__":
#     # Use: uvicorn main:app --reload --port 8000
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=config.PORT)
