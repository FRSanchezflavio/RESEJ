const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const { verificarPermiso } = require('../middleware/permisos');
const auditLogger = require('../middleware/auditLogger');
const { upload } = require('../config/multer');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  idParamValidator,
  handleValidationErrors,
} = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/archivos/upload - Subir archivo (requiere permiso crear)
router.post(
  '/upload',
  verificarPermiso('crear'),
  uploadLimiter,
  upload.single('archivo'),
  auditLogger('SUBIR_ARCHIVO', 'archivo'),
  archivosController.upload
);

// GET /api/archivos/registro/:registroId - Listar archivos (requiere permiso consultar)
router.get(
  '/registro/:registroId',
  verificarPermiso('consultar'),
  archivosController.getByRegistroId
);

// GET /api/archivos/:id/download - Descargar archivo (requiere permiso consultar)
router.get(
  '/:id/download',
  verificarPermiso('consultar'),
  idParamValidator,
  handleValidationErrors,
  archivosController.download
);

// DELETE /api/archivos/:id - Eliminar archivo (requiere permiso eliminar)
router.delete(
  '/:id',
  verificarPermiso('eliminar'),
  idParamValidator,
  handleValidationErrors,
  auditLogger('ELIMINAR_ARCHIVO', 'archivo'),
  archivosController.delete
);

module.exports = router;
