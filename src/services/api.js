import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    console.log('API Request Interceptor: Sending', config.method?.toUpperCase(), 'request to', config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request Interceptor: Using stored authentication token.');
    } else {
      // For testing purposes, add a default admin token only if no token exists
      config.headers.Authorization = 'Bearer test-admin-token';
      console.log('API Request Interceptor: No token found, using default test token.');
    }
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response Interceptor: Received', response.status, 'from', response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Interceptor Error:', error.response ? error.response.status : 'Network Error', 
                  error.config ? `for URL: ${error.config.url}` : 'Unknown URL');
    if (error.response) {
      console.error('API Response Interceptor: Error response data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Função auxiliar para tratamento padronizado de erros
const handleApiError = (error, operation, id = '') => {
  console.error(`API Error - ${operation} sector${id ? ` ${id}` : ''}:`, error);
  if (error.response) {
    console.error('API Error Details: Response status:', error.response.status);
    console.error('API Error Details: Response data:', error.response.data);
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
    console.log('API Call: Attempting to fetch all sectors...');
    const response = await api.get('/sectors');
    // Adjusted log to show the entire sectors array
    console.log(`API Call: Successfully fetched ${response.data.length} sectors. Data:`, response.data); 
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching all');
  }
};

// This call is for testing and will run immediately when the file is imported/executed.
// For a production app, you'd typically call this within a component or effect.
getSetores()
  // Adjusted log to show the entire sectors array
  .then((sectors) => console.log('Initial fetch result (all sectors data):', sectors)) 
  .catch((error) => console.error('Initial fetch error (all sectors):', error));


export const getSetorById = async (id) => {
  try {
    console.log(`API Call: Attempting to fetch sector with ID: ${id}...`);
    const response = await api.get(`/sectors/${id}`);
    console.log(`API Call: Successfully fetched sector ID ${id}:`, response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'fetching by ID', id);
  }
};

export const createSetor = async (sectorData) => {
  try {
    console.log('API Call: Attempting to create new sector with data:', sectorData);
    const dataToSend = formatSectorData(sectorData);
    const response = await api.post('/sectors', dataToSend);
    console.log('API Call: Successfully created sector:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'creating');
  }
};

export const updateSetor = async (id, sectorData) => {
  try {
    console.log(`API Call: Attempting to update sector ${id} with data:`, sectorData);
    const dataToSend = formatSectorData(sectorData);
    const response = await api.put(`/sectors/${id}`, dataToSend);
    console.log(`API Call: Successfully updated sector ${id}:`, response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'updating', id);
  }
};

export const deleteSetor = async (id) => {
  try {
    console.log(`API Call: Attempting to delete sector with ID: ${id}...`);
    const response = await api.delete(`/sectors/${id}`);
    console.log(`API Call: Successfully deleted sector ID ${id}:`, response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'deleting', id);
  }
};

// Auth functions
export const login = async (credentials) => {
  try {
    console.log('API Call: Attempting user login...');
    const response = await api.post('/users/login', credentials);
    console.log('API Call: Login successful.');
    
    // Store token in localStorage for future requests
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('API Call: Authentication token stored in localStorage.');
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error, 'login');
  }
};