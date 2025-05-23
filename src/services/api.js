import axios from 'axios';

// Use environment variable for API URL or fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const getSetores = async () => {
  const response = await api.get('/sectors');
  console.log("Setores:", response.data); // Adicione esta linha para verificar se a resposta está corretamente formatada
  return response.data;
};

export const getSetorById = async (id) => {
  const response = await api.get(`/sectors/${id}`);
  return response.data;
};

export const createSetor = async (setorData) => {
  const response = await api.post('/sectors', setorData);
  return response.data;
};

export const updateSetor = async (id, setorData) => {
  const response = await api.put(`/sectors/${id}`, setorData);
  return response.data;
};

export const deleteSetor = async (id) => {
  const response = await api.delete(`/sectors/${id}`);
  return response.data;
};

export default api;