const { createErrorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Middleware para requerir rol de administrador
 * Debe usarse después de authenticateToken
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    logger.error('requireAdmin llamado sin usuario autenticado');
    return res.status(401).json(
      createErrorResponse('Usuario no autenticado', 401)
    );
  }

  if (req.user.rol !== 'administrador') {
    logger.warn(`Acceso denegado a ${req.user.usuario} (${req.user.rol}) - requiere admin`);
    return res.status(403).json(
      createErrorResponse('Acceso denegado. Requiere permisos de administrador.', 403)
    );
  }

  logger.info(`Acceso de administrador concedido: ${req.user.usuario}`);
  next();
};

/**
 * Middleware para permitir solo usuarios activos
 * Nota: Esta verificación se hace en la autenticación inicial,
 * pero se puede usar para verificaciones adicionales
 */
const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(
      createErrorResponse('Usuario no autenticado', 401)
    );
  }

  // La verificación de activo se hace en el login
  // Este middleware es para verificaciones adicionales si es necesario
  next();
};

module.exports = {
  requireAdmin,
  requireActiveUser
};
