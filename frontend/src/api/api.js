import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Debug: Mostrar la URL configurada
if (import.meta.env.DEV) {
  console.log('🌐 API configurada:', API_URL);
  console.log('📋 Variables de entorno:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
  });
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  timeout: 10000, // 10 segundos de timeout
});

// attach token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

export async function fetchSharedLinks(params = {}) {
  return api.get('/enlaces-compartidos', { params });
}

export async function createSharedLink(payload) {
  return api.post('/enlaces-compartidos', payload);
}

export async function getSharedLink(token) {
  return api.get(`/enlaces-compartidos/${token}`);
}

export async function revokeSharedLink(token) {
  return api.post(`/enlaces-compartidos/${token}/revocar`);
}

export async function accessSharedLinkPublic(token, payload = {}) {
  return axios.post(`${API_URL}/public/enlaces/${token}/acceso`, payload);
}

export default api;
