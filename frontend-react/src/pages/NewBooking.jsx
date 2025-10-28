import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TruckIcon, MapPinIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const NewBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const detectionResult = location.state?.detectionResult;
  const annotatedImage = location.state?.annotatedImage;

  const [bookingData, setBookingData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    scheduledDate: '',
    distance: 0,
    notes: '',
  });

  useEffect(() => {
    if (!detectionResult) {
      console.log('No detection result found, redirecting to upload');
      navigate('/upload');
    } else {
      console.log('Detection result:', detectionResult);
    }
  }, [detectionResult, navigate]);

  if (!detectionResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No detection results found. Redirecting...</p>
        </div>
      </div>
    );
  }

  // Calculate pricing based on volume and distance
  const calculatePrice = () => {
    const baseRate = 50; // Base rate
    const volumeRate = 30; // Per cubic meter
    const distanceRate = 2; // Per km
    const fragileCharge = 20; // Extra charge for fragile items

    const totalVolume = detectionResult?.total_volume_cubic_meters || 0;
    const volumeCharge = totalVolume * volumeRate;
    const distanceCharge = (parseFloat(bookingData.distance) || 0) * distanceRate;
    const fragileItems = detectionResult?.detected_items?.filter(item => item.is_fragile) || [];
    const fragileTotal = fragileItems.length * fragileCharge;

    return {
      baseRate,
      volumeCharge: volumeCharge.toFixed(2),
      distanceCharge: distanceCharge.toFixed(2),
      fragileCharge: fragileTotal.toFixed(2),
      total: (baseRate + volumeCharge + distanceCharge + fragileTotal).toFixed(2),
    };
  };

  const pricing = calculatePrice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    console.log('Submitting booking with data:', {
      userId: currentUser?.id,
      ...bookingData,
      totalPrice: parseFloat(pricing.total),
      items: detectionResult.detected_items
    });

    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          pickupAddress: bookingData.pickupAddress,
          dropoffAddress: bookingData.dropoffAddress,
          distance: parseFloat(bookingData.distance),
          scheduledDate: bookingData.scheduledDate,
          status: 'pending',
          totalPrice: parseFloat(pricing.total),
          notes: bookingData.notes,
          items: detectionResult.detected_items.map(item => ({
            name: item.class_name || item.name || 'Unknown',
            category: item.category,
            volume: item.volume_cubic_meters || item.volume || 0,
            quantity: item.quantity || 1,
            confidence: item.confidence || 0,
          })),
        }),
      });

      if (response.ok) {
        const booking = await response.json();
        console.log('Booking created successfully:', booking);
        navigate('/bookings', { state: { message: 'Booking created successfully!' } });
      } else {
        const errorData = await response.json();
        console.error('Booking creation failed:', errorData);
        setError(errorData.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Booking</h1>
          <p className="text-gray-600 mt-2">Review detected items and complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Detected Items */}
          <div className="space-y-6">
            {/* Annotated Image */}
            {annotatedImage && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-indigo-50 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Detected Items</h2>
                </div>
                <div className="p-4">
                  <img 
                    src={`data:image/jpeg;base64,${annotatedImage}`} 
                    alt="Detected items" 
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      <span className="font-semibold text-gray-900">{detectionResult.items_detected}</span> items detected
                    </span>
                    <span className="text-gray-600">
                      Total Volume: <span className="font-semibold text-gray-900">{detectionResult.total_volume_cubic_meters.toFixed(2)} m³</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-indigo-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Item Details</h3>
              </div>
              <div className="p-4 space-y-3">
                {detectionResult.detected_items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{item.class_name || item.name || 'Unknown Item'}</h4>
                        {item.is_fragile && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">⚠️ Fragile</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="mr-4">Category: {item.category}</span>
                        <span className="mr-4">Qty: {item.quantity || 1}</span>
                        <span>Volume: {(item.volume_cubic_meters || item.volume || 0).toFixed(2)} m³</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600">
                      {((item.confidence || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form & Invoice */}
          <div className="space-y-6">
            {/* Booking Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="inline h-5 w-5 mr-1" />
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={bookingData.pickupAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123 Main St, New York, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="inline h-5 w-5 mr-1" />
                    Dropoff Address
                  </label>
                  <input
                    type="text"
                    name="dropoffAddress"
                    value={bookingData.dropoffAddress}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="456 Oak Ave, Brooklyn, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TruckIcon className="inline h-5 w-5 mr-1" />
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={bookingData.distance}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="10.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="inline h-5 w-5 mr-1" />
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </form>

            {/* Invoice */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-green-600" />
                Price Breakdown
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Rate</span>
                  <span className="font-semibold text-gray-900">${pricing.baseRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volume Charge ({detectionResult.total_volume_cubic_meters.toFixed(2)} m³)</span>
                  <span className="font-semibold text-gray-900">${pricing.volumeCharge}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance Charge ({bookingData.distance} km)</span>
                  <span className="font-semibold text-gray-900">${pricing.distanceCharge}</span>
                </div>
                {parseFloat(pricing.fragileCharge) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fragile Items Handling</span>
                    <span className="font-semibold text-gray-900">${pricing.fragileCharge}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Price</span>
                  <span className="text-2xl font-bold text-indigo-600">${pricing.total}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !bookingData.pickupAddress || !bookingData.dropoffAddress}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? '⏳ Creating Booking...' : '✓ Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBooking;
