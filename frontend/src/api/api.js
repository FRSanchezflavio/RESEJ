import axios from 'axios';

// Usar variable de entorno o fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🌐 API URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Interceptor para adjuntar el token automáticamente
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  response => response,
  error => {
    // Si el error es 401 (No autorizado) o 403 (Prohibido) por token inválido
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const errorMessage = error.response.data?.error || '';

      // Si el error es específicamente por token inválido o expirado
      if (
        errorMessage.includes('Token') ||
        errorMessage.includes('token') ||
        errorMessage.includes('expirado') ||
        errorMessage.includes('inválido')
      ) {
        console.warn('⚠️ Token expirado o inválido. Redirigiendo al login...');

        // Limpiar el localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rol');

        // Redirigir al login (ruta raíz)
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export async function loginRequest(usuario, password) {
  return api.post('/auth/login', { usuario, password });
}

export async function fetchRegistros(params = {}) {
  // Si hay un término de búsqueda, usa el endpoint /buscar
  // params ejemplo: { page:1, limit:10, termino:'texto' }
  const endpoint = params.termino ? '/registros/buscar' : '/registros';
  return api.get(endpoint, { params });
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

export async function fetchRoles() {
  return api.get('/usuarios/roles');
}

export default api;
