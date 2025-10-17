import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
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
  // Si hay término de búsqueda, usar la ruta /registros/buscar
  if (params.termino) {
    return api.get('/registros/buscar', { params });
  }
  // Si no hay término, traer todos los registros
  return api.get('/registros', { params });
}

export async function fetchArchivosByRegistroId(registroId) {
  return await api.get(`/archivos/registro/${registroId}`);
}


export async function uploadRegistro(formData) {
  return api.post('/registros', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function fetchPersonas(params = {}) {
  return api.get('/personas', { params });
}

export async function createPersona(payload) {
  return api.post('/personas', payload);
}

export async function fetchUsers(params = {}) {
  // params ejemplo: { page: 1, limit: 20, activo: true }
  return api.get('/usuarios', { params });
}

export async function createUser(payload) {
  return api.post('/usuarios', payload);
}

export default api;
