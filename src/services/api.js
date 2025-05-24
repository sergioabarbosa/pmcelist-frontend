import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Using stored token');
    } else {
      // For testing purposes, add a default admin token only if no token exists
      config.headers.Authorization = 'Bearer test-admin-token';
      console.log('Using default test token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response ? error.response.status : 'Network Error', 
                 error.config ? error.config.url : 'Unknown URL');
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Função auxiliar para tratamento padronizado de erros
const handleApiError = (error, operation, id = '') => {
  console.error(`Error ${operation}${id ? ` sector ${id}` : ''}:`, error);
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
  throw error;
};

// Função auxiliar para formatar dados do setor
const formatSectorData = (sectorData) => {
  return {
    name: sectorData.name,
    battalion: sectorData.battalion,
    company: sectorData.company,
    commander: sectorData.commander,
    phone: sectorData.phone,
    ais: sectorData.ais,
    subitems: sectorData.subitems || []
  };
};

// API functions - Mantendo as rotas em inglês para corresponder ao backend
export const getSetores = async () => {
  try {
    console.log('Fetching all sectors');
    const response = await api.get('/sectors');
    console.log('Fetched sectors:', response.data.length);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching');
  }
};

export const getSetorById = async (id) => {
  try {
    console.log(`Fetching sector with ID: ${id}`);
    const response = await api.get(`/sectors/${id}`);
    console.log('Fetched sector:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching', id);
  }
};

export const createSetor = async (sectorData) => {
  try {
    console.log('Creating new sector with data:', sectorData);
    // Usar o mesmo formato para criar e atualizar
    const dataToSend = formatSectorData(sectorData);
    const response = await api.post('/sectors', dataToSend);
    console.log('Created sector:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'creating');
  }
};

export const updateSetor = async (id, sectorData) => {
  try {
    console.log(`Updating sector ${id} with data:`, sectorData);
    const dataToSend = formatSectorData(sectorData);
    const response = await api.put(`/sectors/${id}`, dataToSend);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'updating', id);
  }
};

export const deleteSetor = async (id) => {
  try {
    console.log(`Deleting sector with ID: ${id}`);
    const response = await api.delete(`/sectors/${id}`);
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'deleting', id);
  }
};

// Auth functions
export const login = async (credentials) => {
  try {
    console.log('Attempting login with credentials');
    const response = await api.post('/users/login', credentials);
    console.log('Login successful');
    
    // Store token in localStorage for future requests
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Token stored in localStorage');
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error, 'login');
  }
};