import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API functions
export const getSetores = async () => {
  try {
    const response = await api.get('/sectors');
    return response.data;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

export const getSetorById = async (id) => {
  try {
    const response = await api.get(`/sectors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sector ${id}:`, error);
    throw error;
  }
};

export const createSetor = async (sectorData) => {
  try {
    const response = await api.post('/sectors', sectorData);
    return response.data;
  } catch (error) {
    console.error('Error creating sector:', error);
    throw error;
  }
};

export const updateSetor = async (id, sectorData) => {
  try {
    const response = await api.put(`/sectors/${id}`, sectorData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sector ${id}:`, error);
    throw error;
  }
};

export const deleteSetor = async (id) => {
  try {
    const response = await api.delete(`/sectors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sector ${id}:`, error);
    throw error;
  }
};

// Auth functions
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};