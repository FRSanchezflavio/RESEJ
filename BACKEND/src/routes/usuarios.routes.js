const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const auditLogger = require('../middleware/auditLogger');
const { createUsuarioValidators, idParamValidator, handleValidationErrors } = require('../utils/validators');

// Todas las rutas requieren autenticación y rol de administrador
router.use(authenticateToken, requireAdmin);

// GET /api/usuarios - Listar todos los usuarios
router.get('/', 
  usuariosController.getAll
);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', 
  idParamValidator,
  handleValidationErrors,
  usuariosController.getById
);

// POST /api/usuarios - Crear nuevo usuario
router.post('/', 
  createUsuarioValidators,
  handleValidationErrors,
  auditLogger('CREAR_USUARIO', 'usuario'),
  usuariosController.create
);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', 
  idParamValidator,
  handleValidationErrors,
  auditLogger('ACTUALIZAR_USUARIO', 'usuario'),
  usuariosController.update
);

// PATCH /api/usuarios/:id/deactivate - Desactivar usuario
router.patch('/:id/deactivate', 
  idParamValidator,
  handleValidationErrors,
  auditLogger('DESACTIVAR_USUARIO', 'usuario'),
  usuariosController.deactivate
);

// PATCH /api/usuarios/:id/activate - Activar usuario
router.patch('/:id/activate', 
  idParamValidator,
  handleValidationErrors,
  auditLogger('ACTIVAR_USUARIO', 'usuario'),
  usuariosController.activate
);

// POST /api/usuarios/:id/reset-password - Resetear contraseña
router.post('/:id/reset-password', 
  idParamValidator,
  handleValidationErrors,
  auditLogger('RESETEAR_PASSWORD', 'usuario'),
  usuariosController.resetPassword
);

// GET /api/usuarios/:id/historial-accesos - Ver historial de accesos
router.get('/:id/historial-accesos', 
  idParamValidator,
  handleValidationErrors,
  usuariosController.getAccessHistory
);

module.exports = router;
