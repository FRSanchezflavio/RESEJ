const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const { createErrorResponse } = require('../utils/helpers');

/**
 * keyGenerator seguro que maneja IPv4 e IPv6
 * Compatible con express-rate-limit v7+
 */
const customKeyGenerator = (req, res) => {
  try {
    // Intentar usar el helper oficial primero
    return ipKeyGenerator(req, res);
  } catch (error) {
    // Fallback: manual IPv6 handling
    const ip = 
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress ||
      'unknown';
    
    // Normalizar IPv6 (::ffff:127.0.0.1 → 127.0.0.1)
    if (ip.startsWith('::ffff:')) {
      return ip.slice(7);
    }
    
    return ip;
  }
};

// Rate limiter general para todas las rutas
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por ventana
  keyGenerator: customKeyGenerator, // ✅ Usar keyGenerator seguro
  message: createErrorResponse(
    'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        createErrorResponse(
          'Demasiadas solicitudes desde esta IP, por favor intente más tarde',
          429
        )
      );
  },
});

// Rate limiter estricto para login (prevenir fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos de login
  keyGenerator: customKeyGenerator, // ✅ Usar keyGenerator seguro
  skipSuccessfulRequests: true, // No contar intentos exitosos
  message: createErrorResponse(
    'Demasiados intentos de inicio de sesión. Por favor intente más tarde',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        createErrorResponse(
          'Demasiados intentos de inicio de sesión. Por favor intente más tarde',
          429
        )
      );
  },
});

// Rate limiter para creación de recursos (prevenir spam)
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 creaciones por minuto
  keyGenerator: customKeyGenerator, // ✅ Usar keyGenerator seguro
  message: createErrorResponse(
    'Demasiadas solicitudes de creación. Por favor espere un momento',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para upload de archivos
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // 5 uploads por minuto
  keyGenerator: customKeyGenerator, // ✅ Usar keyGenerator seguro
  message: createErrorResponse(
    'Demasiados archivos subidos. Por favor espere un momento',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para acceso a enlaces compartidos (público)
 * - Máximo: 30 accesos por minuto por IP
 * - Maneja correctamente IPv4 e IPv6
 */
const limitadorAccesoPublico = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 accesos por minuto por IP
  keyGenerator: customKeyGenerator, // ✅ REPARADO: Usar keyGenerator seguro
  message: createErrorResponse(
    'Demasiados accesos. Por favor espere un momento',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        createErrorResponse(
          'Demasiados accesos. Por favor espere un momento',
          429
        )
      );
  },
});

/**
 * Rate limiter para operaciones de enlaces (crear, actualizar, eliminar)
 * - Máximo: 20 operaciones por minuto
 * - Maneja correctamente IPv4 e IPv6
 */
const limitadorEnlaces = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // 20 operaciones por minuto
  keyGenerator: customKeyGenerator, // ✅ REPARADO: Usar keyGenerator seguro
  skipSuccessfulRequests: false,
  message: createErrorResponse(
    'Demasiadas operaciones con enlaces. Por favor espere',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res
      .status(429)
      .json(
        createErrorResponse(
          'Demasiadas operaciones con enlaces. Por favor espere',
          429
        )
      );
  },
});

module.exports = {
  generalLimiter,
  loginLimiter,
  createLimiter,
  uploadLimiter,
  limitadorAccesoPublico,
  limitadorEnlaces,
  customKeyGenerator, // Exportar para uso en otros lugares si es necesario
};
