import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/Bookings.css';

const Bookings = () => {
  const { bookings, loadBookings, loading } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const getFilteredBookings = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.reference?.toLowerCase().includes(term) ||
          booking.user?.name?.toLowerCase().includes(term) ||
          booking.user?.email?.toLowerCase().includes(term) ||
          booking.userId?.toString().includes(term)
      );
    }

    return filtered;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800';
      case 'confirmed':
        return '#2196f3';
      case 'in_progress':
        return '#9c27b0';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const filteredBookings = getFilteredBookings();

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>Bookings Management</h1>
        <p>View and manage all customer bookings</p>
      </div>

      <div className="bookings-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by reference, user name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-tab ${filter === status ? 'active' : ''}`}
              >
                {status.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <button onClick={loadBookings} disabled={loading} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="loading-state">
          <span className="loading-spinner">⏳</span>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No bookings found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search criteria'
              : filter !== 'all'
              ? `No ${filter} bookings`
              : 'No bookings available'}
          </p>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-ref">
                  <span className="ref-label">REF:</span>
                  <span className="ref-value">{booking.reference || 'N/A'}</span>
                </div>
                <span
                  className="status-badge"
                  style={{ background: getStatusColor(booking.status) }}
                >
                  {booking.status?.replace('_', ' ')}
                </span>
              </div>

              <div className="booking-details">
                <div className="detail-item">
                  <span className="detail-icon">👤</span>
                  <span className="detail-text">
                    {booking.user?.name || `User ID: ${booking.userId}`}
                  </span>
                </div>
                {booking.user?.email && (
                  <div className="detail-item">
                    <span className="detail-icon">�</span>
                    <span className="detail-text">{booking.user.email}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-icon">�📅</span>
                  <span className="detail-text">{formatDate(booking.createdAt)}</span>
                </div>
                {booking.scheduledDate && (
                  <div className="detail-item">
                    <span className="detail-icon">🚚</span>
                    <span className="detail-text">
                      Scheduled: {formatDate(booking.scheduledDate)}
                    </span>
                  </div>
                )}
                {booking.totalVolume && (
                  <div className="detail-item">
                    <span className="detail-icon">📏</span>
                    <span className="detail-text">
                      {booking.totalVolume.toFixed(3)} m³
                    </span>
                  </div>
                )}
                {booking.distance && (
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">
                      {booking.distance} km
                    </span>
                  </div>
                )}
              </div>

              {(booking.pickupAddress || booking.dropoffAddress) && (
                <div className="booking-addresses">
                  {booking.pickupAddress && (
                    <div className="address-item">
                      <span className="address-label">From:</span>
                      <span className="address-text">{booking.pickupAddress}</span>
                    </div>
                  )}
                  {booking.dropoffAddress && (
                    <div className="address-item">
                      <span className="address-label">To:</span>
                      <span className="address-text">{booking.dropoffAddress}</span>
                    </div>
                  )}
                </div>
              )}

              {booking.notes && (
                <div className="booking-notes">
                  <p>{booking.notes}</p>
                </div>
              )}

              {booking.items && booking.items.length > 0 && (
                <div className="booking-items">
                  <span className="items-count">
                    📦 {booking.items.length} items
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
