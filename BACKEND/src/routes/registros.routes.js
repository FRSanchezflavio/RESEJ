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

  // 🧩 FIX — convertir manualmente los campos del multipart/form-data
  (req, res, next) => {
    console.log("📦 Campos recibidos (raw):", req.body);

    // Aseguramos que persona_id y fecha_ingreso existan
    let { persona_id, fecha_ingreso, fecha_carga } = req.body;

    // Si vienen vacíos o indefinidos, les damos valor por defecto
    if (!persona_id) persona_id = "1";
    if (!fecha_ingreso) fecha_ingreso = new Date().toISOString().split("T")[0];
    if (!fecha_carga) fecha_carga = new Date().toISOString().split("T")[0];

    // Normalizamos fecha
    if (fecha_ingreso.includes("T")) fecha_ingreso = fecha_ingreso.split("T")[0];

    // Reasignamos al body limpio
    req.body = {
      ...req.body,
      persona_id: parseInt(persona_id, 10),
      fecha_ingreso,
      fecha_carga,
    };

    console.log("✅ Campos normalizados:", req.body);
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
