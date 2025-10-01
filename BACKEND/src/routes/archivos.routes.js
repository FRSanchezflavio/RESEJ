const express = require('express');
const router = express.Router();
const archivosController = require('../controllers/archivosController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const auditLogger = require('../middleware/auditLogger');
const { upload } = require('../config/multer');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { idParamValidator, handleValidationErrors } = require('../utils/validators');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/archivos/upload - Subir archivo (Solo Admin)
router.post('/upload', 
  requireAdmin,
  uploadLimiter,
  upload.single('archivo'),
  auditLogger('SUBIR_ARCHIVO', 'archivo'),
  archivosController.upload
);

// GET /api/archivos/registro/:registroId - Listar archivos de un registro
router.get('/registro/:registroId', 
  archivosController.getByRegistroId
);

// GET /api/archivos/:id/download - Descargar archivo
router.get('/:id/download', 
  idParamValidator,
  handleValidationErrors,
  archivosController.download
);

// DELETE /api/archivos/:id - Eliminar archivo (Solo Admin)
router.delete('/:id', 
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ELIMINAR_ARCHIVO', 'archivo'),
  archivosController.delete
);

module.exports = router;
