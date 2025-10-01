const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');

// Todas las rutas requieren autenticación y rol de administrador
router.use(authenticateToken, requireAdmin);

// GET /api/logs - Listar todos los logs con filtros
router.get('/', logsController.getAll);

// GET /api/logs/acciones - Obtener lista de acciones
router.get('/acciones', logsController.getAcciones);

// GET /api/logs/recursos-tipos - Obtener tipos de recursos
router.get('/recursos-tipos', logsController.getRecursoTipos);

// GET /api/logs/usuario/:usuarioId - Logs de un usuario específico
router.get('/usuario/:usuarioId', logsController.getByUsuarioId);

module.exports = router;
