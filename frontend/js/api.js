// ShiftMate API Client

const API_BASE_URL = 'http://localhost:3000/api';
const AI_API_URL = 'http://localhost:8000/api/v1/ai';

class ShiftMateAPI {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.aiUrl = AI_API_URL;
    }

    // Helper method for fetch requests
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        return this.request(`${this.baseUrl}/health`);
    }

    // User endpoints
    async getUsers() {
        return this.request(`${this.baseUrl}/users`);
    }

    async createUser(userData) {
        return this.request(`${this.baseUrl}/users`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Booking endpoints
    async getBookings() {
        return this.request(`${this.baseUrl}/bookings`);
    }

    async createBooking(bookingData) {
        return this.request(`${this.baseUrl}/bookings`, {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    }

    // AI Detection endpoint
    async detectObjects(imageFile, bookingRef = null) {
        const formData = new FormData();
        formData.append('image', imageFile);
        if (bookingRef) {
            formData.append('booking_ref', bookingRef);
        }

        try {
            const response = await fetch(`${this.aiUrl}/detect`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('AI Detection Error:', error);
            throw error;
        }
    }

    async getSupportedItems() {
        return this.request(`${this.aiUrl}/supported-items`);
    }

    async checkAIHealth() {
        return this.request(`${this.aiUrl}/health`);
    }
}

// Create a global instance
const api = new ShiftMateAPI();

// Utility functions
const utils = {
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },

    formatVolume(volume) {
        return `${parseFloat(volume).toFixed(2)} m³`;
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    },

    showAlert(message, type = 'info') {
        const alert = document.getElementById('alert');
        if (alert) {
            alert.className = `alert alert-${type} show`;
            alert.textContent = message;
            
            setTimeout(() => {
                alert.classList.remove('show');
            }, 5000);
        }
    },

    showLoading(show = true) {
        const loading = document.getElementById('loading');
        if (loading) {
            if (show) {
                loading.classList.add('show');
            } else {
                loading.classList.remove('show');
            }
        }
    },

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^\+?[\d\s-()]+$/;
        return re.test(phone);
    },

    generateBookingRef() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `BK-${timestamp}-${random}`.toUpperCase();
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
};

// Local Storage Manager
const storage = {
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage save error:', error);
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },

    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Storage clear error:', error);
        }
    },
};

// Image validation
function validateImage(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
        return { valid: false, error: 'Please upload a JPG or PNG image' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Image must be less than 10MB' };
    }

    return { valid: true };
}

// Create image preview
function createImagePreview(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => callback(e.target.result);
    reader.readAsDataURL(file);
}
