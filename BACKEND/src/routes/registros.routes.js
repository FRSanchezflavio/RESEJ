const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const auditLogger = require('../middleware/auditLogger');
const {
  createRegistroValidators,
  idParamValidator,
  searchValidators,
  handleValidationErrors,
} = require('../utils/validators');

// 🔹 multer configurado en memoria (sin carpeta uploads)
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/registros
router.get('/', registrosController.getAll);

// GET /api/registros/buscar
router.get(
  '/buscar',
  searchValidators,
  handleValidationErrors,
  registrosController.search
);

// GET /api/registros/estadisticas
router.get('/estadisticas', requireAdmin, registrosController.estadisticas);

// GET /api/registros/exportar
router.get(
  '/exportar',
  requireAdmin,
  auditLogger('EXPORTAR_REGISTROS', 'registro'),
  registrosController.exportar
);

// GET /api/registros/:id
router.get(
  '/:id',
  idParamValidator,
  handleValidationErrors,
  registrosController.getById
);

// ✅ POST /api/registros - Crear nuevo registro (Solo Admin)
router.post(
  '/',
  requireAdmin,
  upload.array('archivos'),

  // 🧩 Normalizar campos del multipart/form-data
  (req, res, next) => {
    console.log('📦 Campos recibidos (raw):', req.body);

    // Convertir persona_id a número
    if (req.body.persona_id) {
      req.body.persona_id = parseInt(req.body.persona_id, 10);
    }

    // Normalizar fechas (remover parte de tiempo si existe)
    if (req.body.fecha_ingreso && req.body.fecha_ingreso.includes('T')) {
      req.body.fecha_ingreso = req.body.fecha_ingreso.split('T')[0];
    }

    if (req.body.fecha_carga && req.body.fecha_carga.includes('T')) {
      req.body.fecha_carga = req.body.fecha_carga.split('T')[0];
    }

    // Convertir strings vacíos a null para campos opcionales
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '') {
        req.body[key] = null;
      }
    });

    console.log('✅ Campos normalizados:', req.body);
    next();
  },

  createRegistroValidators,
  handleValidationErrors,
  auditLogger('CREAR_REGISTRO', 'registro'),
  registrosController.create
);

// PUT /api/registros/:id
router.put(
  '/:id',
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ACTUALIZAR_REGISTRO', 'registro'),
  registrosController.update
);

// DELETE /api/registros/:id
router.delete(
  '/:id',
  requireAdmin,
  idParamValidator,
  handleValidationErrors,
  auditLogger('ELIMINAR_REGISTRO', 'registro'),
  registrosController.delete
);

module.exports = router;
