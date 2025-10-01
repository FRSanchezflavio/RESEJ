const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secure_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'your_super_secure_refresh_token_secret';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Genera un token JWT de acceso
 * @param {Object} payload - Datos del usuario { userId, usuario, rol, nombreCompleto }
 * @returns {string} Token JWT
 */
const generateAccessToken = payload => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Genera un refresh token
 * @param {Object} payload - Datos del usuario { userId }
 * @returns {string} Refresh token
 */
const generateRefreshToken = payload => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

/**
 * Verifica un token de acceso
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
const verifyAccessToken = token => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Verifica un refresh token
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 */
const verifyRefreshToken = token => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};

/**
 * Calcula la fecha de expiración del refresh token
 * @returns {Date} Fecha de expiración
 */
const getRefreshTokenExpiration = () => {
  const days = parseInt(REFRESH_TOKEN_EXPIRES_IN.replace('d', '')) || 7;
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenExpiration,
};
