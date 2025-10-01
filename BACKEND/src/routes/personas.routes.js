const express = require('express');
const router = express.Router();
const personasController = require('../controllers/personasController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const auditLogger = require('../middleware/auditLogger');
const {
  createPersonaValidators,
  idParamValidator,
  handleValidationErrors,
} = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/personas - Listar todas las personas
router.get('/', personasController.getAll);

// GET /api/personas/search - Buscar personas
router.get('/search', personasController.search);

// GET /api/personas/:id - Obtener persona por ID
router.get(
  '/:id',
  idParamValidator,
  handleValidationErrors,
  personasController.getById
);

// POST /api/personas - Crear nueva persona (Solo Admin)
router.post(
  '/',
  requireAdmin,
  createPersonaValidators,
  handleValidationErrors,
  auditLogger('CREAR_PERSONA', 'persona'),
  personasController.create
);

// PUT /api/personas/:id - Actualizar persona (Solo Admin)
router.put(
  '/:id',
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ACTUALIZAR_PERSONA', 'persona'),
  personasController.update
);

// DELETE /api/personas/:id - Eliminar persona (Solo Admin)
router.delete(
  '/:id',
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ELIMINAR_PERSONA', 'persona'),
  personasController.delete
);

module.exports = router;
