const rateLimit = require('express-rate-limit');
const { createErrorResponse } = require('../utils/helpers');

// Rate limiter general para todas las rutas
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests por ventana
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
  message: createErrorResponse(
    'Demasiados archivos subidos. Por favor espere un momento',
    429
  ),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  loginLimiter,
  createLimiter,
  uploadLimiter,
};
