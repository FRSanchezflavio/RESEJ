const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Genera un token temporal de acceso
 * @param {Object} data - Datos a incluir en el token
 * @param {string} expiresIn - Tiempo de expiración (ej: '24h', '7d')
 * @returns {string} Token JWT
 */
const generarTokenTemporal = (data, expiresIn = '24h') => {
  const secret = process.env.JWT_SECRET || 'secret-key-default';
  
  const payload = {
    ...data,
    type: 'temporal',
    timestamp: Date.now()
  };
  
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Valida un token temporal de acceso
 * @param {string} token - Token JWT a validar
 * @returns {Object|null} Payload del token o null si es inválido
 */
const validarTokenTemporal = (token) => {
  try {
    const secret = process.env.JWT_SECRET || 'secret-key-default';
    const decoded = jwt.verify(token, secret);
    
    if (decoded.type !== 'temporal') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Error al validar token temporal:', error.message);
    return null;
  }
};

/**
 * Middleware para verificar token temporal en requests
 */
const verificarTokenTemporal = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }
    
    const decoded = validarTokenTemporal(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    req.tokenData = decoded;
    next();
  } catch (error) {
    console.error('Error en verificarTokenTemporal:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar token'
    });
  }
};

module.exports = {
  generarTokenTemporal,
  validarTokenTemporal,
  verificarTokenTemporal
};
