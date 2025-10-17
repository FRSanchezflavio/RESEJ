/**
 * Configuración: Protección de Rutas para Usuario Consulta
 * RE.SE.J - Control de Acceso
 *
 * Define qué rutas están protegidas y qué nivel de acceso requieren
 */

const {
  soloLectura,
  bloquearConsulta,
  detectarIntentosAnomalo,
} = require('../middleware/permisosConsulta');
const { authenticateToken } = require('../middleware/auth');

/**
 * Rutas de solo lectura - Permitidas para usuario_consulta
 * Solo se permite GET
 */
const RUTAS_LECTURA = {
  'GET /api/secuestros': ['usuario_consulta', 'administrador'],
  'GET /api/secuestros/:id': ['usuario_consulta', 'administrador'],
  'GET /api/personas': ['usuario_consulta', 'administrador'],
  'GET /api/personas/:id': ['usuario_consulta', 'administrador'],
  'GET /api/objetos': ['usuario_consulta', 'administrador'],
  'GET /api/objetos/:id': ['usuario_consulta', 'administrador'],
  'GET /api/dependencias': ['usuario_consulta', 'administrador'],
  'GET /api/dependencias/:id': ['usuario_consulta', 'administrador'],
  'GET /api/archivos': ['usuario_consulta', 'administrador'],
};

/**
 * Rutas de escritura - Bloqueadas para usuario_consulta
 * Requieren rol de administrador
 */
const RUTAS_ESCRITURA = {
  'POST /api/secuestros': ['administrador'],
  'PUT /api/secuestros/:id': ['administrador'],
  'DELETE /api/secuestros/:id': ['administrador'],
  'POST /api/personas': ['administrador'],
  'PUT /api/personas/:id': ['administrador'],
  'DELETE /api/personas/:id': ['administrador'],
  'POST /api/objetos': ['administrador'],
  'PUT /api/objetos/:id': ['administrador'],
  'DELETE /api/objetos/:id': ['administrador'],
  'POST /api/dependencias': ['administrador'],
  'PUT /api/dependencias/:id': ['administrador'],
  'DELETE /api/dependencias/:id': ['administrador'],
  'POST /api/archivos/upload': ['administrador'],
  'DELETE /api/archivos/:id': ['administrador'],
};

/**
 * Rutas de administración - Completamente bloqueadas para usuario_consulta
 */
const RUTAS_ADMINISTRACION = {
  'GET /api/usuarios': ['administrador'],
  'POST /api/usuarios': ['administrador'],
  'PUT /api/usuarios/:id': ['administrador'],
  'DELETE /api/usuarios/:id': ['administrador'],
  'POST /api/usuarios/:id/reset-password': ['administrador'],
  'GET /api/logs': ['administrador'],
  'GET /api/auditoria': ['administrador'],
  'PUT /api/configuracion': ['administrador'],
};

/**
 * Aplicar protección a rutas específicas
 * @param {object} router - Express router
 */
function aplicarProteccionRutas(router) {
  // Aplicar middleware a todas las rutas protegidas
  router.use(detectarIntentosAnomalo); // Detectar intentos sospechosos

  // Bloquear operaciones de escritura para usuario_consulta
  router.post('/', authenticateToken, soloLectura);
  router.put('/', authenticateToken, soloLectura);
  router.patch('/', authenticateToken, soloLectura);
  router.delete('/', authenticateToken, soloLectura);
}

/**
 * Validar si el usuario puede acceder a una ruta
 * @param {string} metodo - Método HTTP (GET, POST, PUT, DELETE)
 * @param {string} ruta - Ruta solicitada
 * @param {string} rolUsuario - Rol del usuario
 * @returns {boolean}
 */
function puedeAccederRuta(metodo, ruta, rolUsuario) {
  const rutaKey = `${metodo} ${ruta}`;

  // Verificar si está en rutas de lectura
  if (RUTAS_LECTURA[rutaKey]) {
    return RUTAS_LECTURA[rutaKey].includes(rolUsuario);
  }

  // Verificar si está en rutas de escritura
  if (RUTAS_ESCRITURA[rutaKey]) {
    return RUTAS_ESCRITURA[rutaKey].includes(rolUsuario);
  }

  // Verificar si está en rutas de administración
  if (RUTAS_ADMINISTRACION[rutaKey]) {
    return RUTAS_ADMINISTRACION[rutaKey].includes(rolUsuario);
  }

  // Por defecto, permitir si es administrador
  return rolUsuario === 'administrador';
}

/**
 * Obtener la descripción de una ruta
 * @param {string} metodo - Método HTTP
 * @param {string} ruta - Ruta solicitada
 * @returns {object} Información de la ruta
 */
function obtenerInfoRuta(metodo, ruta) {
  const rutaKey = `${metodo} ${ruta}`;

  let tipo = 'desconocida';
  let descripcion = 'Operación desconocida';

  if (RUTAS_LECTURA[rutaKey]) {
    tipo = 'lectura';
    descripcion = 'Operación de lectura - Permitida para usuario_consulta';
  } else if (RUTAS_ESCRITURA[rutaKey]) {
    tipo = 'escritura';
    descripcion = 'Operación de escritura - Bloqueada para usuario_consulta';
  } else if (RUTAS_ADMINISTRACION[rutaKey]) {
    tipo = 'administración';
    descripcion = 'Operación administrativa - Bloqueada para usuario_consulta';
  }

  return {
    metodo,
    ruta,
    tipo,
    descripcion,
    permitida_para:
      tipo === 'lectura'
        ? ['usuario_consulta', 'administrador']
        : ['administrador'],
  };
}

module.exports = {
  RUTAS_LECTURA,
  RUTAS_ESCRITURA,
  RUTAS_ADMINISTRACION,
  aplicarProteccionRutas,
  puedeAccederRuta,
  obtenerInfoRuta,
};
