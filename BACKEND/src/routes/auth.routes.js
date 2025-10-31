const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const {
  loginValidators,
  handleValidationErrors,
} = require('../utils/validators');

// POST /api/auth/login - Login de usuario
router.post(
  '/login',
  loginLimiter,
  loginValidators,
  handleValidationErrors,
  authController.login
);

// POST /api/auth/refresh - Refrescar access token
router.post('/refresh', authController.refresh);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authController.logout);

// GET /api/auth/me - Obtener datos del usuario autenticado
router.get('/me', authenticateToken, authController.me);

// POST /api/auth/validate-password - Validar contraseña del usuario actual
router.post(
  '/validate-password',
  authenticateToken,
  authController.validatePassword
);

module.exports = router;
