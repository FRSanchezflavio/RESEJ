const logger = require('../utils/logger');
const { createErrorResponse } = require('../utils/helpers');

/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  // Log del error
  logger.error('Error en la aplicación:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user?.usuario || 'No autenticado',
  });

  // Errores de validación de Multer (archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res
      .status(400)
      .json(
        createErrorResponse(
          'El archivo excede el tamaño máximo permitido (5MB)',
          400
        )
      );
  }

  if (err.message && err.message.includes('Tipo de archivo no permitido')) {
    return res.status(400).json(createErrorResponse(err.message, 400));
  }

  // Errores de base de datos
  if (err.code === '23505') {
    // Unique violation
    return res
      .status(409)
      .json(
        createErrorResponse('El registro ya existe en la base de datos', 409)
      );
  }

  if (err.code === '23503') {
    // Foreign key violation
    return res
      .status(400)
      .json(createErrorResponse('Referencia a registro inexistente', 400));
  }

  if (err.code === '23502') {
    // Not null violation
    return res
      .status(400)
      .json(createErrorResponse('Faltan campos requeridos', 400));
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json(createErrorResponse('Token inválido', 403));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(403).json(createErrorResponse('Token expirado', 403));
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message;

  res.status(statusCode).json(createErrorResponse(message, statusCode));
};

/**
 * Middleware para rutas no encontradas (404)
 */
const notFoundHandler = (req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json(createErrorResponse('Ruta no encontrada', 404));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
