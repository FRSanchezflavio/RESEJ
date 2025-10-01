const bcrypt = require('bcrypt');

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

/**
 * Hashea una contraseña
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} Hash de la contraseña
 */
const hashPassword = async password => {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
};

/**
 * Compara una contraseña con su hash
 * @param {string} password - Contraseña en texto plano
 * @param {string} hash - Hash de la contraseña
 * @returns {Promise<boolean>} True si coinciden
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Sanitiza un objeto eliminando campos sensibles
 * @param {Object} obj - Objeto a sanitizar
 * @param {Array<string>} fieldsToRemove - Campos a eliminar
 * @returns {Object} Objeto sanitizado
 */
const sanitizeObject = (
  obj,
  fieldsToRemove = ['password_hash', 'password']
) => {
  const sanitized = { ...obj };
  fieldsToRemove.forEach(field => {
    delete sanitized[field];
  });
  return sanitized;
};

/**
 * Formatea los datos de un usuario para respuesta
 * @param {Object} usuario - Datos del usuario
 * @returns {Object} Usuario formateado
 */
const formatUsuario = usuario => {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
    rol: usuario.rol,
    activo: usuario.activo,
    fecha_creacion: usuario.fecha_creacion,
    ultimo_acceso: usuario.ultimo_acceso,
  };
};

/**
 * Obtiene la IP del cliente desde la request
 * @param {Object} req - Request de Express
 * @returns {string} IP del cliente
 */
const getClientIp = req => {
  return (
    req.ip ||
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection?.remoteAddress ||
    'unknown'
  );
};

/**
 * Genera respuesta de error estandarizada
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP
 * @returns {Object} Objeto de error
 */
const createErrorResponse = (message, statusCode = 500) => {
  return {
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Genera respuesta de éxito estandarizada
 * @param {*} data - Datos de respuesta
 * @param {string} message - Mensaje opcional
 * @returns {Object} Objeto de respuesta
 */
const createSuccessResponse = (data, message = null) => {
  const response = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return response;
};

/**
 * Valida magic bytes de archivos
 * @param {Buffer} buffer - Buffer del archivo
 * @param {string} mimeType - Tipo MIME esperado
 * @returns {boolean} True si es válido
 */
const validateFileMagicBytes = (buffer, mimeType) => {
  const signatures = {
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    'image/jpeg': [0xff, 0xd8, 0xff],
    'image/png': [0x89, 0x50, 0x4e, 0x47],
  };

  const signature = signatures[mimeType];
  if (!signature) return false;

  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false;
    }
  }
  return true;
};

module.exports = {
  hashPassword,
  comparePassword,
  sanitizeObject,
  formatUsuario,
  getClientIp,
  createErrorResponse,
  createSuccessResponse,
  validateFileMagicBytes,
  BCRYPT_ROUNDS,
};
