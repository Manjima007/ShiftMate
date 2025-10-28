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
        Estimated volume in cubic meters
    """
    print(f"  [Volume] Looking for: '{class_name}' in catalog...")
    
    # Search in catalog
    for category, items in CATALOG.get("categories", {}).items():
        print(f"  [Volume] Checking category: {category}, items: {list(items.keys())[:3]}...")
        if class_name.lower() in items:
            volume = items[class_name.lower()]["volume"]
            print(f"  [Volume] ✓ Found! Volume: {volume} m³")
            return volume
    
    # Default fallback volumes in cubic meters
    print(f"  [Volume] ✗ Not found in catalog, using fallback")
    if bbox_area > 0.5:  # Large item
        return 2.0
    elif bbox_area > 0.2:  # Medium item
        return 0.5
    else:  # Small item
        return 0.1


def get_item_details(class_name: str) -> Tuple[bool, str, float]:
    """
    Get item details from catalog
    
    Args:
        class_name: Item class name
        
    Returns:
        Tuple of (is_fragile, category, weight)
    """
    print(f"  [Details] Looking up: '{class_name}'")
    
    for category, items in CATALOG.get("categories", {}).items():
        print(f"  [Details] Checking category: {category}")
        if class_name.lower() in items:
            item = items[class_name.lower()]
            print(f"  [Details] ✓ Found in {category}! Fragile: {item['fragile']}")
            return item["fragile"], category, item.get("weight", 0)
    
    print(f"  [Details] ✗ Not found, using defaults")
    return False, "Miscellaneous", 0


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
