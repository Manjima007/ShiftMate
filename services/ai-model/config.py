"""Configuration for AI Model Service"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"

# Create directories if they don't exist
MODEL_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

# Model settings
# Available models (in order of accuracy/speed tradeoff):
# - yolov8n.pt: Nano (fastest, least accurate) - ~6MB
# - yolov8s.pt: Small (balanced) - ~22MB  
# - yolov8m.pt: Medium (more accurate) - ~52MB
# - yolov8l.pt: Large (very accurate) - ~87MB
# - yolov8x.pt: Extra Large (best accuracy, slowest) - ~131MB
MODEL_NAME = "yolov8s.pt"  # Using Small for better accuracy than Nano
MODEL_PATH = MODEL_DIR / MODEL_NAME

# Detection thresholds
CONFIDENCE_THRESHOLD = 0.40  # Lower to catch more objects (especially beds/furniture)
IOU_THRESHOLD = 0.40  # Balanced NMS (0.3 was too aggressive)

# Image settings
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
IMAGE_RESIZE_MAX = 1280

# Server settings
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Item catalog
ITEM_CATALOG_PATH = DATA_DIR / "item_catalog.json"
