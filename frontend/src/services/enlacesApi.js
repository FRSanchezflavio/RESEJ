import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token en las peticiones
client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const enlacesApi = {
  // Crear enlace compartido
  crearEnlace: async datos => {
    try {
      const response = await client.post('/enlaces-compartidos', datos);
      console.log('Respuesta de crearEnlace:', response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en crearEnlace:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Listar enlaces del usuario
  listarEnlaces: async (page = 1, limit = 10) => {
    try {
      const response = await client.get('/enlaces-compartidos', {
        params: { page, limit },
      });
      console.log('Respuesta de listarEnlaces:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error(
        'Error en listarEnlaces:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener enlace por token
  obtenerEnlace: async token => {
    try {
      const response = await client.get(`/enlaces-compartidos/${token}`);
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en obtenerEnlace:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener enlace público por token (sin autenticación)
  obtenerEnlacePublico: async (token, password = null) => {
    try {
      let response;
      if (password) {
        response = await client.post(`/enlaces-compartidos/publico/${token}`, {
          contrasena: password,
        });
      } else {
        response = await client.get(`/enlaces-compartidos/publico/${token}`);
      }
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en obtenerEnlacePublico:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Actualizar enlace
  actualizarEnlace: async (token, datos) => {
    try {
      const response = await client.put(`/enlaces-compartidos/${token}`, datos);
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en actualizarEnlace:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Eliminar enlace
  eliminarEnlace: async token => {
    try {
      await client.delete(`/enlaces-compartidos/${token}`);
      return true;
    } catch (error) {
      console.error(
        'Error en eliminarEnlace:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Revocar acceso a enlace
  revocarEnlace: async token => {
    try {
      const response = await client.post(
        `/enlaces-compartidos/${token}/revocar`,
        {}
      );
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en revocarEnlace:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener estadísticas de enlace
  obtenerEstadisticas: async token => {
    try {
      const response = await client.get(
        `/enlaces-compartidos/${token}/estadisticas`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en obtenerEstadisticas:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener accesos de un enlace
  obtenerAccesos: async (token, page = 1, limit = 20) => {
    try {
      const response = await client.get(
        `/enlaces-compartidos/${token}/accesos`,
        {
          params: { page, limit },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en obtenerAccesos:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Exportar accesos
  exportarAccesos: async (token, formato = 'csv') => {
    try {
      const response = await client.get(
        `/enlaces-compartidos/${token}/accesos/exportar`,
        {
          params: { formato },
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error en exportarAccesos:',
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Obtener QR de un enlace
  obtenerQR: async token => {
    try {
      const response = await client.get(`/enlaces-compartidos/${token}/qr`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error obteniendo QR:', error);
      return null;
    }
  },

  // Obtener análitica de un enlace
  obtenerAnalytics: async token => {
    try {
      const response = await client.get(
        `/enlaces-compartidos/${token}/analytics`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        'Error en obtenerAnalytics:',
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default enlacesApi;
