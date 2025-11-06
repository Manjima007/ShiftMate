"""Test script to verify multiple object detection"""
import requests
import json
import sys
from pathlib import Path

# API endpoint
API_URL = "http://localhost:8000/api/v1/ai/detect"

def test_detection(image_path: str):
    """Test object detection on an image"""
    
    print(f"\n{'='*60}")
    print(f"Testing Multiple Object Detection")
    print(f"{'='*60}")
    print(f"Image: {image_path}")
    print(f"API: {API_URL}\n")
    
    # Check if image exists
    if not Path(image_path).exists():
        print(f"❌ Error: Image file not found: {image_path}")
        return
    
    try:
        # Send image to API
        with open(image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(API_URL, files=files)
        
        # Check response
        if response.status_code == 200:
            result = response.json()
            
            print(f"✅ Detection Successful!")
            print(f"\n{'='*60}")
            print(f"Results Summary:")
            print(f"{'='*60}")
            print(f"Status: {result['status']}")
            print(f"Items detected: {result['items_detected']}")
            print(f"Total volume: {result['total_volume_cubic_meters']} m³")
            print(f"Processing time: {result['processing_time_ms']:.2f} ms")
            
            print(f"\n{'='*60}")
            print(f"Detected Items:")
            print(f"{'='*60}")
            
            if result['detected_items']:
                for idx, item in enumerate(result['detected_items'], 1):
                    print(f"\n[{idx}] {item['class_name']}")
                    print(f"    Category: {item['category']}")
                    print(f"    Quantity: {item['quantity']}")
                    print(f"    Volume: {item['volume_cubic_meters']} m³ each")
                    print(f"    Total volume: {item['volume_cubic_meters'] * item['quantity']:.2f} m³")
                    print(f"    Fragile: {'Yes' if item['is_fragile'] else 'No'}")
                    print(f"    Confidence: {item['confidence']:.2%}")
                    if item.get('bbox'):
                        bbox = item['bbox']
                        print(f"    Bounding Box: [{bbox['x1']:.1f}, {bbox['y1']:.1f}, {bbox['x2']:.1f}, {bbox['y2']:.1f}]")
            else:
                print("\n⚠️  No objects detected!")
                print("Tips:")
                print("  - Ensure the image contains detectable objects (furniture, electronics, etc.)")
                print("  - Use well-lit, clear images")
                print("  - Check if objects are clearly visible and not too small")
            
            print(f"\n{'='*60}")
            print(f"Total Items Summary:")
            print(f"{'='*60}")
            total_items = sum(item['quantity'] for item in result['detected_items'])
            print(f"Total individual objects: {total_items}")
            print(f"Unique item types: {result['items_detected']}")
            print(f"Combined volume: {result['total_volume_cubic_meters']} m³")
            print(f"{'='*60}\n")
            
            # Save annotated image
            if result.get('annotated_image'):
                import base64
                output_path = Path(image_path).parent / f"annotated_{Path(image_path).name}"
                img_data = base64.b64decode(result['annotated_image'])
                with open(output_path, 'wb') as f:
                    f.write(img_data)
                print(f"💾 Annotated image saved to: {output_path}")
            
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Could not connect to API at {API_URL}")
        print(f"Make sure the AI service is running: python run_server.py")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Use test image or provided path
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        # Try to find test_image.jpg in current directory
        test_img = Path(__file__).parent / "test_image.jpg"
        if test_img.exists():
            image_path = str(test_img)
        else:
            print("Usage: python test_multiple_objects.py <path_to_image>")
            print("\nOr place a test_image.jpg in the current directory")
            sys.exit(1)
    
    test_detection(image_path)
