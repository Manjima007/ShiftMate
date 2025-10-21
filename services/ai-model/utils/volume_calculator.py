"""Volume estimation utilities"""
import json
from typing import Dict, Tuple
import config


# Load item catalog
def load_catalog() -> dict:
    """Load item catalog from JSON"""
    try:
        with open(config.ITEM_CATALOG_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"categories": {}, "yolo_class_mapping": {}}


CATALOG = load_catalog()


def estimate_volume(class_name: str, bbox_area: float = 0) -> float:
    """
    Estimate volume for detected item
    
    Args:
        class_name: Detected class name from YOLO
        bbox_area: Bounding box area (for future refinement)
        
    Returns:
        Estimated volume in cubic feet
    """
    # Search in catalog
    for category, items in CATALOG.get("categories", {}).items():
        if class_name.lower() in items:
            return items[class_name.lower()]["volume"]
    
    # Default fallback volumes based on bbox area
    if bbox_area > 0.5:  # Large item
        return 30.0
    elif bbox_area > 0.2:  # Medium item
        return 10.0
    else:  # Small item
        return 3.0


def get_item_details(class_name: str) -> Tuple[bool, str, float]:
    """
    Get item details from catalog
    
    Args:
        class_name: Item class name
        
    Returns:
        Tuple of (is_fragile, category, weight)
    """
    for category, items in CATALOG.get("categories", {}).items():
        if class_name.lower() in items:
            item = items[class_name.lower()]
            return item["fragile"], category, item.get("weight", 0)
    
    return False, "unknown", 0


def map_yolo_class(class_id: int) -> str:
    """
    Map YOLO class ID to item name
    
    Args:
        class_id: YOLO class ID
        
    Returns:
        Item name
    """
    mapping = CATALOG.get("yolo_class_mapping", {})
    return mapping.get(str(class_id), f"item_{class_id}")
