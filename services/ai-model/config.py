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
MODEL_NAME = "yolov8n.pt"  # Nano version for faster inference
MODEL_PATH = MODEL_DIR / MODEL_NAME
CONFIDENCE_THRESHOLD = 0.5
IOU_THRESHOLD = 0.45

# Image settings
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
IMAGE_RESIZE_MAX = 1280

# Server settings
PORT = int(os.getenv("PORT", 8000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Item catalog
ITEM_CATALOG_PATH = DATA_DIR / "item_catalog.json"
