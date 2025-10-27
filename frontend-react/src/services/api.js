import axios from 'axios';

// API Base URLs
const API_BASE_URL = 'http://localhost:3000/api';
const AI_API_URL = 'http://localhost:8000/api/v1/ai';

// Create axios instances
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const aiClient = axios.create({
  baseURL: AI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Health check APIs
export const healthAPI = {
  checkAPI: () => apiClient.get('/health'),
  checkAI: () => aiClient.get('/health'),
};

// User APIs
export const userAPI = {
  getAll: () => apiClient.get('/users'),
  create: (userData) => apiClient.post('/users', userData),
  getById: (id) => apiClient.get(`/users/${id}`),
};

// Booking APIs
export const bookingAPI = {
  getAll: () => apiClient.get('/bookings'),
  create: (bookingData) => apiClient.post('/bookings', bookingData),
  getById: (id) => apiClient.get(`/bookings/${id}`),
  update: (id, data) => apiClient.put(`/bookings/${id}`, data),
  delete: (id) => apiClient.delete(`/bookings/${id}`),
};

// AI Detection APIs
export const aiAPI = {
  detectObjects: async (imageFile, bookingRef = null) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    if (bookingRef) {
      formData.append('booking_ref', bookingRef);
    }

    // Use API Core proxy instead of calling AI service directly
    return apiClient.post('/ai/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getSupportedItems: () => aiClient.get('/supported-items'),
  checkHealth: () => aiClient.get('/health'),
};

// Export default service object
const api = {
  health: healthAPI,
  users: userAPI,
  bookings: bookingAPI,
  ai: aiAPI,
};

export default api;
