import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = (username, password) => {
  return api.post('/auth/login/', { username, password });
};

// Dashboard APIs
export const getDashboardSummary = () => {
  return api.get('/dashboard/summary/');
};

// Category APIs
export const getCategories = () => {
  return api.get('/categories/');
};

export const createCategory = (data) => {
  return api.post('/categories/', data);
};

export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}/`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}/`);
};

// Menu Item APIs
export const getMenuItems = (params = {}) => {
  return api.get('/menu-items/', { params });
};

export const createMenuItem = (data) => {
  return api.post('/menu-items/', data);
};

export const updateMenuItem = (id, data) => {
  return api.put(`/menu-items/${id}/`, data);
};

export const deleteMenuItem = (id) => {
  return api.delete(`/menu-items/${id}/`);
};

// Table APIs
export const getTables = () => {
  return api.get('/tables/');
};

export const createTable = (data) => {
  return api.post('/tables/', data);
};

export const updateTableStatus = (id, status) => {
  return api.post(`/tables/${id}/update-status/`, { status });
};

// Order APIs
export const getOrders = (params = {}) => {
  return api.get('/orders/', { params });
};

export const createOrder = (data) => {
  return api.post('/orders/', data);
};

export const updateOrderStatus = (id, status) => {
  return api.post(`/orders/${id}/update-status/`, { status });
};

// Reservation APIs
export const getReservations = (params = {}) => {
  return api.get('/reservations/', { params });
};

export const createReservation = (data) => {
  return api.post('/reservations/', data);
};

// Staff APIs
export const getStaff = () => {
  return api.get('/staff/');
};

export const createStaff = (data) => {
  return api.post('/staff/', data);
};

export const updateStaff = (id, data) => {
  return api.put(`/staff/${id}/`, data);
};

export const deleteStaff = (id) => {
  return api.delete(`/staff/${id}/`);
};

// Table APIs - add deleteTable
export const deleteTable = (id) => {
  return api.delete(`/tables/${id}/`);
};

export default api;