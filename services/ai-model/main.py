from fastapi import FastAPI
from pydantic import BaseModel
import time

app = FastAPI()

# This is our mock endpoint to simulate AI object detection
@app.post("/api/v1/ai/detect")
def mock_detect_objects(payload: dict):
    print("--- AI MOCK SERVICE RECEIVED REQUEST ---")
    
    # Simulate processing time (3 seconds)
    time.sleep(3) 

    # Mock Data: Based on a standard 1BHK/small office shift
    mock_items = [
        {"item_id": 101, "name": "Standard Moving Box (Small)", "quantity": 10, "volume_cu_ft": 1.5, "is_fragile": False},
        {"item_id": 102, "name": "Large Wardrobe Box", "quantity": 3, "volume_cu_ft": 4.0, "is_fragile": True},
        {"item_id": 201, "name": "Desk Chair", "quantity": 2, "volume_cu_ft": 5.0, "is_fragile": False},
        {"item_id": 305, "name": "TV (50 inch)", "quantity": 1, "volume_cu_ft": 10.0, "is_fragile": True},
    ]

    total_volume = sum(item['quantity'] * item['volume_cu_ft'] for item in mock_items)

    return {
        "status": "completed",
        "booking_ref": payload.get("booking_id", "MOCK_BKG_123"),
        "detected_items": mock_items,
        "total_estimated_volume_cu_ft": round(total_volume, 2)
    }

@app.get("/")
def read_root():
    return {"service": "AI Model Service", "status": "Running", "mode": "MOCK"}
