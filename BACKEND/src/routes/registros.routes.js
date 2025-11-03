const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/authorize');
const { verificarPermiso } = require('../middleware/permisos');
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

// GET /api/registros - Requiere permiso de consultar
router.get('/', verificarPermiso('consultar'), registrosController.getAll);

// GET /api/registros/buscar - Requiere permiso de consultar
router.get(
  '/buscar',
  verificarPermiso('consultar'),
  searchValidators,
  handleValidationErrors,
  registrosController.search
);

// GET /api/registros/estadisticas - Requiere permiso de consultar
router.get(
  '/estadisticas',
  verificarPermiso('consultar'),
  registrosController.estadisticas
);

// GET /api/registros/exportar - Requiere permiso de consultar (y es admin-only para más control)
router.get(
  '/exportar',
  requireAdmin,
  verificarPermiso('consultar'),
  auditLogger('EXPORTAR_REGISTROS', 'registro'),
  registrosController.exportar
);

// GET /api/registros/:id - Requiere permiso de consultar
router.get(
  '/:id',
  verificarPermiso('consultar'),
  idParamValidator,
  handleValidationErrors,
  registrosController.getById
);

// ✅ POST /api/registros - Crear nuevo registro (requiere permiso crear)
router.post(
  '/',
  verificarPermiso('crear'),
  upload.array('archivos'),

  // 🧩 FIX — convertir manualmente los campos del multipart/form-data
  (req, res, next) => {
    console.log('📦 Campos recibidos (raw):', req.body);

    // Aseguramos que persona_id y fecha_ingreso existan
    let { persona_id, fecha_ingreso, fecha_carga } = req.body;

    // Si vienen vacíos o indefinidos, les damos valor por defecto
    if (!persona_id) persona_id = '1';
    if (!fecha_ingreso) fecha_ingreso = new Date().toISOString().split('T')[0];
    if (!fecha_carga) fecha_carga = new Date().toISOString().split('T')[0];

    // Normalizamos fecha
    if (fecha_ingreso.includes('T'))
      fecha_ingreso = fecha_ingreso.split('T')[0];

    // Reasignamos al body limpio
    req.body = {
      ...req.body,
      persona_id: parseInt(persona_id, 10),
      fecha_ingreso,
      fecha_carga,
    };

    console.log('✅ Campos normalizados:', req.body);
    next();
  },

  createRegistroValidators,
  handleValidationErrors,
  auditLogger('CREAR_REGISTRO', 'registro'),
  registrosController.create
);

// PUT /api/registros/:id - Requiere permiso editar
router.put(
  '/:id',
  verificarPermiso('editar'),
  idParamValidator,
  handleValidationErrors,
  auditLogger('ACTUALIZAR_REGISTRO', 'registro'),
  registrosController.update
);

// DELETE /api/registros/:id - Requiere permiso eliminar
router.delete(
  '/:id',
  verificarPermiso('eliminar'),
  idParamValidator,
  handleValidationErrors,
  auditLogger('ELIMINAR_REGISTRO', 'registro'),
  registrosController.delete
);

module.exports = router;
