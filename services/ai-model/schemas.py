"""Pydantic schemas for API request/response models"""
from typing import List, Optional
from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    """Bounding box coordinates"""
    x1: float
    y1: float
    x2: float
    y2: float


class DetectedItem(BaseModel):
    """Single detected item"""
    item_id: int
    class_name: str
    category: str
    quantity: int = 1
    volume_cubic_meters: float
    is_fragile: bool
    confidence: float
    bbox: Optional[BoundingBox] = None

    class Config:
        populate_by_name = True


class DetectionResponse(BaseModel):
    """Response for single image detection"""
    status: str = "completed"
    booking_ref: Optional[str] = None
    detected_items: List[DetectedItem]
    items_detected: int
    total_volume_cubic_meters: float
    processing_time_ms: float
    annotated_image: Optional[str] = None  # Base64 encoded image with bounding boxes


class BatchDetectionResponse(BaseModel):
    """Response for batch image detection"""
    status: str
    total_images_processed: int
    detected_items: List[DetectedItem]
    total_estimated_volume_cu_ft: float
    processing_time_seconds: float


class SupportedItem(BaseModel):
    """Item in the catalog"""
    item_id: int
    name: str
    category: str
    avg_volume_cu_ft: float
    is_fragile: bool
    weight_estimate_lbs: Optional[float] = None


class HealthCheck(BaseModel):
    """Health check response"""
    model_config = {"protected_namespaces": ()}  # Disable Pydantic namespace warning
    
    service: str
    status: str
    model_loaded: bool
    model_name: str
    gpu_available: bool


class ErrorResponse(BaseModel):
    """Error response"""
    error: str
    detail: str
    status_code: int
