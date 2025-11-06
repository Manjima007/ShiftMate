"""Test multi-object detection"""
import requests
import json

# Test with the multi-object image
with open('test_multi_objects.jpg', 'rb') as f:
    files = {'image': ('test.jpg', f, 'image/jpeg')}
    response = requests.post('http://localhost:8000/api/v1/ai/detect', files=files)
    
    print("=" * 60)
    print(f"Status Code: {response.status_code}")
    print("=" * 60)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nDetection successful!")
        print(f"  Items detected: {len(data.get('items', []))}")
        print(f"  Processing time: {data.get('processing_time_ms', 0):.2f}ms")
        
        if data.get('items'):
            print(f"\nDetected Items:")
            for item in data['items']:
                print(f"  - {item['name']}: quantity={item['quantity']}, confidence={item['confidence']:.2f}")
        else:
            print(f"\nNo objects detected in image")
            
        print(f"\nSummary:")
        print(f"  Total items: {data.get('total_items', 0)}")
        print(f"  Total volume: {data.get('total_volume_cubic_feet', 0):.2f} cu ft")
    else:
        print(f"\nError: {response.json()}")
        
    print("=" * 60)
