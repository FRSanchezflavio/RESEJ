const { verifyAccessToken } = require('../config/jwt');
const { createErrorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Middleware para autenticar tokens JWT
 * Verifica que el token sea válido y añade los datos del usuario a req.user
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json(
        createErrorResponse('Token de autenticación no proporcionado', 401)
      );
    }

    // Verificar token
    const decoded = verifyAccessToken(token);
    
    // Añadir datos del usuario a la request
    req.user = {
      id: decoded.userId,
      usuario: decoded.usuario,
      rol: decoded.rol,
      nombreCompleto: decoded.nombreCompleto
    };

    logger.info(`Usuario autenticado: ${decoded.usuario} (${decoded.rol})`);
    next();
  } catch (error) {
    logger.error(`Error en autenticación: ${error.message}`);
    return res.status(403).json(
      createErrorResponse('Token inválido o expirado', 403)
    );
  }
};

module.exports = { authenticateToken };
