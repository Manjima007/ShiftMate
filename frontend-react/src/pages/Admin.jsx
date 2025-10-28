import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import '../styles/Admin.css';

const Admin = () => {
  const { users, bookings, loadUsers, loadBookings, createUser, loading } = useApp();
  const [showUserForm, setShowUserForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  useEffect(() => {
    loadUsers();
    loadBookings();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setFormError('All fields are required');
      return;
    }

    try {
      await createUser(formData);
      setFormSuccess('User created successfully!');
      setFormData({ name: '', email: '', phone: '' });
      setTimeout(() => {
        setShowUserForm(false);
        setFormSuccess(null);
      }, 2000);
    } catch (err) {
      setFormError(err.message || 'Failed to create user');
    }
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };

    bookings.forEach((booking) => {
      if (stats[booking.status] !== undefined) {
        stats[booking.status]++;
      }
    });

    return stats;
  };

  const stats = getBookingStats();

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and monitor system statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-section">
          <div className="section-header">
            <h2>User Management</h2>
            <button
              onClick={() => setShowUserForm(!showUserForm)}
              className="add-button"
            >
              {showUserForm ? '✕ Cancel' : '+ Add User'}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter user name"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </div>

              {formError && (
                <div className="form-message error">
                  ❌ {formError}
                </div>
              )}

              {formSuccess && (
                <div className="form-message success">
                  ✅ {formSuccess}
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          )}

          {users.length === 0 ? (
            <div className="empty-message">
              <span>📭</span>
              <p>No users found. Create your first user!</p>
            </div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className="booking-count">
                          {bookings.filter((b) => b.userId === user.id).length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-section">
          <div className="section-header">
            <h2>Booking Statistics</h2>
          </div>

          <div className="stats-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill pending"
                  style={{ width: `${(stats.pending / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="breakdown-label">
                <span>Pending</span>
                <span>{stats.pending}</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill confirmed"
                  style={{ width: `${(stats.confirmed / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="breakdown-label">
                <span>Confirmed</span>
                <span>{stats.confirmed}</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill in-progress"
                  style={{ width: `${(stats.in_progress / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="breakdown-label">
                <span>In Progress</span>
                <span>{stats.in_progress}</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill completed"
                  style={{ width: `${(stats.completed / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="breakdown-label">
                <span>Completed</span>
                <span>{stats.completed}</span>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill cancelled"
                  style={{ width: `${(stats.cancelled / stats.total) * 100 || 0}%` }}
                ></div>
              </div>
              <div className="breakdown-label">
                <span>Cancelled</span>
                <span>{stats.cancelled}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
