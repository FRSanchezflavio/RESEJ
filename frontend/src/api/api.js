import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token agregado al header:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️  No hay token en localStorage');
  }
  return config;
});

// manejo de errores global
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('❌ Token expirado, limpiando localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }
);

export async function loginRequest(usuario, password) {
  return api.post('/auth/login', { usuario, password });
}

export async function fetchRegistros(params = {}) {
  // backend puede aceptar query params; params ejemplo: { page:1, limit:10, q:'term' }
  return api.get('/registros', { params });
}

export async function uploadRegistro(formData) {
  return api.post('/registros', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function fetchUsers() {
  return api.get('/usuarios');
}

export async function createUser(payload) {
  return api.post('/usuarios', payload);
}

export default api;
