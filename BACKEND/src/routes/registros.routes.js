const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const auditLogger = require('../middleware/auditLogger');
const { createRegistroValidators, idParamValidator, searchValidators, handleValidationErrors } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/registros - Listar todos los registros
router.get('/', 
  registrosController.getAll
);

// GET /api/registros/buscar - Búsqueda avanzada (todos los roles)
router.get('/buscar', 
  searchValidators,
  handleValidationErrors,
  registrosController.search
);

// GET /api/registros/estadisticas - Obtener estadísticas (Solo Admin)
router.get('/estadisticas', 
  requireAdmin,
  registrosController.estadisticas
);

// GET /api/registros/exportar - Exportar registros (Solo Admin)
router.get('/exportar', 
  requireAdmin,
  auditLogger('EXPORTAR_REGISTROS', 'registro'),
  registrosController.exportar
);

// GET /api/registros/:id - Obtener registro por ID
router.get('/:id', 
  idParamValidator,
  handleValidationErrors,
  registrosController.getById
);

// POST /api/registros - Crear nuevo registro (Solo Admin)
router.post('/', 
  requireAdmin,
  createRegistroValidators,
  handleValidationErrors,
  auditLogger('CREAR_REGISTRO', 'registro'),
  registrosController.create
);

// PUT /api/registros/:id - Actualizar registro (Solo Admin)
router.put('/:id', 
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ACTUALIZAR_REGISTRO', 'registro'),
  registrosController.update
);

// DELETE /api/registros/:id - Eliminar registro (Solo Admin)
router.delete('/:id', 
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ELIMINAR_REGISTRO', 'registro'),
  registrosController.delete
);

module.exports = router;
