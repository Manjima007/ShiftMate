import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Upload.css';

const Upload = () => {
  const navigate = useNavigate();
  const { detectObjects, loading } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bookingRef, setBookingRef] = useState('');
  const [detectionResult, setDetectionResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setDetectionResult(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    try {
      setError(null);
      const result = await detectObjects(selectedFile, bookingRef || null);
      console.log('Detection completed:', {
        items: result.items_detected,
        volume: result.total_volume_cubic_meters,
        first_item: result.detected_items?.[0]?.class_name
      });
      setDetectionResult(result);
    } catch (err) {
      console.error('Detection error:', err);
      setError(err.message || 'Detection failed. Please try again.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setBookingRef('');
    setDetectionResult(null);
    setError(null);
  };

  const handleProceedToBooking = () => {
    // Navigate to new booking page with detection results
    navigate('/bookings/new', { 
      state: { 
        detectionResult,
        annotatedImage: detectionResult.annotated_image 
      } 
    });
  };

  const formatVolume = (volume) => {
    return volume ? volume.toFixed(3) : '0.000';
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1>AI Object Detection</h1>
        <p>Upload an image to detect and catalog items automatically</p>
      </div>

      <div className="upload-content">
        <div className="upload-section">
          <div className="upload-area">
            {detectionResult && detectionResult.annotated_image ? (
              <div className="image-preview">
                <img 
                  src={`data:image/jpeg;base64,${detectionResult.annotated_image}`} 
                  alt="Detected items with bounding boxes" 
                />
                <button onClick={handleReset} className="clear-button">
                  ✕ Clear
                </button>
              </div>
            ) : preview ? (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button onClick={handleReset} className="clear-button">
                  ✕ Clear
                </button>
              </div>
            ) : (
              <label className="upload-label">
                <div className="upload-placeholder">
                  <span className="upload-icon">📸</span>
                  <span>Click to select image</span>
                  <span className="upload-hint">Supports JPG, PNG, JPEG</span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileSelect}
                  className="upload-input"
                />
              </label>
            )}
          </div>

          <div className="upload-form">
            <div className="form-group">
              <label htmlFor="bookingRef">Booking Reference (Optional)</label>
              <input
                type="text"
                id="bookingRef"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="Enter booking reference"
                className="form-input"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading || detectionResult}
              className="detect-button"
            >
              {loading ? '🔄 Detecting...' : '🤖 Detect Objects'}
            </button>

            {detectionResult && (
              <button
                onClick={handleProceedToBooking}
                className="detect-button"
                style={{ marginTop: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              >
                📦 Proceed to Booking
              </button>
            )}
          </div>

          {error && (
            <div className="error-message">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}
        </div>

        {detectionResult && (
          <div className="results-section">
            <div className="results-header">
              <h2>Detection Results</h2>
              <div className="results-meta">
                <span>⏱️ {detectionResult.processing_time_ms || 0}ms</span>
                <span>📦 {detectionResult.items_detected || 0} items</span>
                <span>📏 {formatVolume(detectionResult.total_volume_cubic_meters || 0)} m³</span>
              </div>
            </div>

            {detectionResult.detected_items && detectionResult.detected_items.length > 0 ? (
              <div className="items-grid">
                {detectionResult.detected_items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-header">
                      <h3>{item.class_name || item.name || 'Unknown'}</h3>
                      <span className="confidence-badge">
                        {((item.confidence || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="item-details">
                      <div className="detail-row">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{item.category || 'N/A'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value">{item.quantity || 1}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Volume:</span>
                        <span className="detail-value">
                          {formatVolume(item.volume_cubic_meters || item.volume || 0)} m³
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Fragile:</span>
                        <span className="detail-value">{item.is_fragile ? '⚠️ Yes' : '✓ No'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items">
                <span>📭</span>
                <p>No items detected in this image</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
