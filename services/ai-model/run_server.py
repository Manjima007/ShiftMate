"""Alternative server runner using gunicorn-style approach"""
import sys
import os
import logging

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

# Setup file logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('server.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

if __name__ == "__main__":
    import uvicorn
    
    # Run with explicit configuration
    config = uvicorn.Config(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload to avoid multiprocessing issues
        log_level="info",
        access_log=True,
        use_colors=False,  # Disable colors for file logging
    )
    
    server = uvicorn.Server(config)
    
    print("=" * 50)
    print("🚀 Starting ShiftMate AI Service")
    print("📍 Server: http://127.0.0.1:8000")
    print("📖 API Docs: http://127.0.0.1:8000/docs")
    print("=" * 50)
    
    try:
        server.run()
    except KeyboardInterrupt:
        print("\n\n✋ Server stopped by user")
    except Exception as e:
        print(f"\n\n❌ Server error: {e}")
        import traceback
        traceback.print_exc()
