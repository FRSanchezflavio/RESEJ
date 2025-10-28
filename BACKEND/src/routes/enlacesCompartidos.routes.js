const express = require('express');const express = require('express');

const router = express.Router();const router = express.Router();

const enlacesCompartidosController = require('../controllers/enlacesCompartidosController');const {

const { authenticateToken } = require('../middleware/auth');  crearEnlace,

const auditLogger = require('../middleware/auditLogger');  listarEnlaces,

const { createLimiter } = require('../middleware/rateLimiter');  obtenerEnlace,

const {  revocarEnlace,

  createEnlaceCompartidoValidators,  obtenerEnlacePublico,

  listEnlaceCompartidoValidators,  obtenerEstadisticas,

  tokenParamValidator,  obtenerQR,

  handleValidationErrors,} = require('../controllers/enlacesCompartidosController');

} = require('../utils/validators');const { authenticateToken } = require('../middleware/auth');

const { limitadorEnlaces } = require('../middleware/rateLimiter');

// Todas las rutas requieren usuario autenticado

router.use(authenticateToken);// Rutas públicas (sin autenticación)

// ⚠️ ORDEN IMPORTANTE: Esta debe ir antes de las rutas con :token

router.get(router.get('/publico/:token', limitadorEnlaces, obtenerEnlacePublico);

  '/',

  listEnlaceCompartidoValidators,// Rutas protegidas (requieren autenticación)

  handleValidationErrors,router.post('/', authenticateToken, limitadorEnlaces, crearEnlace);

  enlacesCompartidosController.listrouter.get('/', authenticateToken, listarEnlaces);

);// Cambio: ahora busca por token en lugar de por id

router.get('/:token', authenticateToken, obtenerEnlace);

router.post(router.get('/:token/qr', authenticateToken, obtenerQR);

  '/',router.get('/:token/estadisticas', authenticateToken, obtenerEstadisticas);

  createLimiter,router.post('/:token/revocar', authenticateToken, revocarEnlace);

  createEnlaceCompartidoValidators,

  handleValidationErrors,module.exports = router;

  auditLogger('CREAR_ENLACE_COMPARTIDO', 'enlace_compartido'),
  enlacesCompartidosController.create
);

router.get(
  '/:token',
  tokenParamValidator,
  handleValidationErrors,
  enlacesCompartidosController.getByToken
);

router.post(
  '/:token/revocar',
  tokenParamValidator,
  handleValidationErrors,
  auditLogger('REVOCAR_ENLACE_COMPARTIDO', 'enlace_compartido'),
  enlacesCompartidosController.revoke
);

module.exports = router;
