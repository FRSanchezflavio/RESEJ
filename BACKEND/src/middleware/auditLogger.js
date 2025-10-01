const db = require('../config/database');
const { getClientIp } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Middleware para registrar acciones en logs de auditoría
 * @param {string} accion - Nombre de la acción realizada
 * @param {string} recursoTipo - Tipo de recurso afectado
 */
const auditLogger = (accion, recursoTipo = null) => {
  return async (req, res, next) => {
    // Capturar el método original de res.json para interceptar la respuesta
    const originalJson = res.json.bind(res);

    res.json = function(body) {
      // Registrar en auditoría solo si la operación fue exitosa (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // No esperar a que termine el registro para continuar
        setImmediate(async () => {
          try {
            const logEntry = {
              usuario_id: req.user?.id || null,
              accion: accion,
              recurso_tipo: recursoTipo,
              recurso_id: req.params.id ? parseInt(req.params.id) : null,
              detalles: JSON.stringify({
                method: req.method,
                url: req.originalUrl,
                params: req.params,
                query: req.query,
                // No registrar passwords u otra info sensible
                body: sanitizeBody(req.body)
              }),
              ip_address: getClientIp(req)
            };

            await db('logs_auditoria').insert(logEntry);
            
            logger.info(`Auditoría registrada: ${accion} por usuario ${req.user?.usuario || 'desconocido'}`);
          } catch (error) {
            logger.error(`Error al registrar auditoría: ${error.message}`);
            // No interrumpir el flujo de la aplicación por error en auditoría
          }
        });
      }

      // Continuar con la respuesta original
      return originalJson(body);
    };

    next();
  };
};

/**
 * Sanitiza el body de la request eliminando campos sensibles
 * @param {Object} body - Body de la request
 * @returns {Object} Body sanitizado
 */
const sanitizeBody = (body) => {
  if (!body) return {};
  
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'password_hash', 'token', 'refresh_token'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
};

module.exports = auditLogger;
