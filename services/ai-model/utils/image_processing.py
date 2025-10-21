"""Image preprocessing utilities"""
import io
from PIL import Image
from pathlib import Path
from typing import Tuple
import config


def validate_image(file_content: bytes, filename: str) -> Tuple[bool, str]:
    """
    Validate uploaded image
    
    Args:
        file_content: Image file bytes
        filename: Original filename
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check file size
    if len(file_content) > config.MAX_IMAGE_SIZE:
        return False, f"File size exceeds {config.MAX_IMAGE_SIZE / 1024 / 1024}MB limit"
    
    # Check extension
    ext = Path(filename).suffix.lower()
    if ext not in config.ALLOWED_EXTENSIONS:
        return False, f"File type {ext} not allowed. Use: {', '.join(config.ALLOWED_EXTENSIONS)}"
    
    # Try to open image
    try:
        img = Image.open(io.BytesIO(file_content))
        img.verify()
        return True, ""
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"


def preprocess_image(image_bytes: bytes) -> Image.Image:
    """
    Preprocess image for model inference
    
    Args:
        image_bytes: Raw image bytes
        
    Returns:
        Preprocessed PIL Image
    """
    # Open image
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if needed
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Resize if too large
    max_size = config.IMAGE_RESIZE_MAX
    if max(img.size) > max_size:
        img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    
    return img


def save_temp_image(image: Image.Image, filename: str) -> Path:
    """
    Save image temporarily for processing
    
    Args:
        image: PIL Image
        filename: Original filename
        
    Returns:
        Path to saved file
    """
    save_path = config.UPLOAD_DIR / filename
    image.save(save_path)
    return save_path
