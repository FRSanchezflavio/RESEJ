const express = require('express');
const router = express.Router();
const {
  crearEnlace,
  listarEnlaces,
  obtenerEnlace,
  revocarEnlace,
  obtenerEnlacePublico,
  obtenerEstadisticas,
  obtenerQR,
} = require('../controllers/enlacesCompartidosController');
const { authenticateToken } = require('../middleware/auth');
const { limitadorEnlaces } = require('../middleware/rateLimiter');

// Rutas públicas (sin autenticación)
// ⚠️ ORDEN IMPORTANTE: Esta debe ir antes de las rutas con :token
router.get('/publico/:token', limitadorEnlaces, obtenerEnlacePublico);

// Rutas protegidas (requieren autenticación)
router.post('/', authenticateToken, limitadorEnlaces, crearEnlace);
router.get('/', authenticateToken, listarEnlaces);
// Cambio: ahora busca por token en lugar de por id
router.get('/:token', authenticateToken, obtenerEnlace);
router.get('/:token/qr', authenticateToken, obtenerQR);
router.get('/:token/estadisticas', authenticateToken, obtenerEstadisticas);
router.post('/:token/revocar', authenticateToken, revocarEnlace);

module.exports = router;
