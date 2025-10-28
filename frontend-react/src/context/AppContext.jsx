import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [systemHealth, setSystemHealth] = useState({
    api: 'unknown',
    ai: 'unknown',
    database: 'unknown',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.users.getAll();
      setUsers(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await api.bookings.getAll();
      setBookings(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.users.create(userData);
      await loadUsers();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const response = await api.bookings.create(bookingData);
      await loadBookings();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check system health
  const checkSystemHealth = async () => {
    const newHealth = { ...systemHealth };

    try {
      const apiResponse = await api.health.checkAPI();
      newHealth.api = 'healthy';
      newHealth.database = apiResponse.data.database === 'connected' ? 'healthy' : 'unhealthy';
    } catch {
      newHealth.api = 'unhealthy';
      newHealth.database = 'unknown';
    }

    try {
      const aiResponse = await api.ai.checkHealth();
      newHealth.ai = aiResponse.data.status === 'healthy' ? 'healthy' : 'degraded';
    } catch {
      newHealth.ai = 'unhealthy';
    }

    setSystemHealth(newHealth);
    return newHealth;
  };

  // AI detection
  const detectObjects = async (imageFile, bookingRef = null) => {
    try {
      setLoading(true);
      const response = await api.ai.detectObjects(imageFile, bookingRef);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Save current user to localStorage
  const saveCurrentUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Load current user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const value = {
    // State
    users,
    bookings,
    currentUser,
    systemHealth,
    loading,
    error,
    
    // Actions
    loadUsers,
    loadBookings,
    createUser,
    createBooking,
    checkSystemHealth,
    detectObjects,
    saveCurrentUser,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
