const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

/**
 * Rate limiter para endpoint PÚBLICO (sin autenticación)
 * - Máximo: 10 requests por IP cada 15 minutos
 * - Compatible con IPv4 e IPv6
 */
const rateLimitPublic = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests por ventana
  keyGenerator: ipKeyGenerator, // ✅ USA EL HELPER SEGURO
  message: {
    success: false,
    error: 'Demasiados intentos. Intente nuevamente en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Saltar rate limit en desarrollo (opcional)
    return (
      process.env.NODE_ENV === 'development' &&
      process.env.RATE_LIMIT_DISABLED === 'true'
    );
  },
  handler: (req, res) => {
    const logger = require('../utils/logger');
    logger.warn(`Rate limit excedido para IP: ${req.ip}`);

    res.status(429).json({
      success: false,
      error: 'Demasiados intentos. Intente nuevamente en 15 minutos.',
      retry_after: req.rateLimit?.resetTime
        ? Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000)
        : 900,
    });
  },
});

/**
 * Rate limiter para endpoints ADMIN (autenticados)
 * - Máximo: 60 requests por usuario cada 15 minutos
 * - Compatible con IPv4 e IPv6
 */
const rateLimitAdmin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  keyGenerator: (req, res) => {
    // Usar ID del usuario autenticado como clave
    return req.user?.id?.toString() || ipKeyGenerator(req, res);
  },
  message: {
    success: false,
    error: 'Límite de requests excedido. Intente nuevamente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: req => {
    // Solo aplicar a usuarios no-admin
    return req.user?.rol === 'administrador';
  },
});

/**
 * Rate limiter ESTRICTO para login
 * - Máximo: 5 intentos fallidos por IP cada 15 minutos
 */
const rateLimitLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: ipKeyGenerator, // ✅ SEGURO
  skipSuccessfulRequests: true, // No contar intentos exitosos
  skipFailedRequests: false, // Contar intentos fallidos
  message: {
    success: false,
    error: 'Demasiados intentos de login fallidos. Intente en 15 minutos.',
  },
});

module.exports = {
  rateLimitPublic,
  rateLimitAdmin,
  rateLimitLogin,
};
