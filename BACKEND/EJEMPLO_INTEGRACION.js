/**
 * EJEMPLO: Cómo integrar el Control de Acceso en app.js
 *
 * Este archivo muestra exactamente qué líneas agregar a tu app.js actual
 */

// ============================================
// 📌 PASO 1: AGREGAR ESTOS IMPORTS AL INICIO
// ============================================

// Línea a agregar después de los otros imports:
const {
  soloLectura,
  detectarIntentosAnomalo,
} = require('./middleware/permisosConsulta');

// ============================================
// 📌 PASO 2: AGREGAR ESTOS MIDDLEWARES GLOBALES
// ============================================

// Después de: app.use('/api', generalLimiter);
// Agregar:

// Detectar intentos sospechosos (SQL injection, XSS, etc.)
app.use(detectarIntentosAnomalo);

// Bloquear operaciones de escritura para usuario_consulta
// (GET está permitido, POST/PUT/DELETE está bloqueado)
app.use(soloLectura);

// ============================================
// 📌 PASO 3: ESTRUCTURA COMPLETA DE app.js
// ============================================

/*
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

// ✅ NUEVO: Importar middlewares de control de acceso
const { soloLectura, detectarIntentosAnomalo } = require('./middleware/permisosConsulta');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const personasRoutes = require('./routes/personas.routes');
const registrosRoutes = require('./routes/registros.routes');
const archivosRoutes = require('./routes/archivos.routes');
const logsRoutes = require('./routes/logs.routes');

const app = express();

// ... (resto de configuración igual)

// Rate limiting general
app.use('/api', generalLimiter);

// ✅ NUEVO: Seguridad para usuario_consulta
app.use(detectarIntentosAnomalo);
app.use(soloLectura);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/registros', registrosRoutes);
app.use('/api/archivos', archivosRoutes);
app.use('/api/logs', logsRoutes);

// ... (resto del código igual)

*/

// ============================================
// 📌 PASO 4: INTEGRACIÓN EN RUTAS INDIVIDUALES
// ============================================

/*
EJEMPLO: En src/routes/registros.routes.js

const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registroController');
const { authenticateToken } = require('../middleware/auth');
const { soloLectura } = require('../middleware/permisosConsulta');
const RespuestaConsultaService = require('../services/respuestaConsultaService');

// ✅ RUTAS DE LECTURA - Permitidas para usuario_consulta
router.get('/', authenticateToken, registroController.listar);
router.get('/:id', authenticateToken, registroController.obtener);
router.get('/:id/descargar', authenticateToken, registroController.descargar);

// ❌ RUTAS DE ESCRITURA - Bloqueadas para usuario_consulta
// El middleware soloLectura lo bloquea automáticamente
router.post('/', authenticateToken, soloLectura, registroController.crear);
router.put('/:id', authenticateToken, soloLectura, registroController.actualizar);
router.delete('/:id', authenticateToken, soloLectura, registroController.eliminar);

module.exports = router;
*/

// ============================================
// 📌 PASO 5: INTEGRACIÓN EN CONTROLADORES
// ============================================

/*
EJEMPLO: En src/controllers/registroController.js

const RespuestaConsultaService = require('../services/respuestaConsultaService');

class RegistroController {
  
  // ✅ OPERACIÓN DE LECTURA
  static async listar(req, res) {
    try {
      const registros = await RegistroService.listar();
      
      // Usar respuesta estandarizada
      return res.status(200).json(
        RespuestaConsultaService.respuestaBusquedaExitosa({
          registros,
          total: registros.length,
          pagination: { page: 1, limit: 10 }
        })
      );
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }

  // ✅ OPERACIÓN DE LECTURA
  static async obtener(req, res) {
    try {
      const { id } = req.params;
      const registro = await RegistroService.obtenerPorId(id);
      
      if (!registro) {
        return res.status(404).json(
          RespuestaConsultaService.respuestaError('Registro no encontrado')
        );
      }

      return res.status(200).json(
        RespuestaConsultaService.respuestaVisualizacionRegistro(registro)
      );
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }

  // ❌ OPERACIÓN DE ESCRITURA (El middleware ya lo bloquea)
  static async crear(req, res) {
    try {
      // Validación adicional de seguridad
      if (req.usuario.rol === 'usuario_consulta') {
        return res.status(403).json(
          RespuestaConsultaService.respuestaAccesoDenegadoCreacion('registro')
        );
      }

      const nuevoRegistro = await RegistroService.crear(req.body);
      
      return res.status(201).json({
        success: true,
        data: nuevoRegistro,
        message: 'Registro creado exitosamente'
      });
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }

  // ❌ OPERACIÓN DE ESCRITURA (El middleware ya lo bloquea)
  static async actualizar(req, res) {
    try {
      if (req.usuario.rol === 'usuario_consulta') {
        return res.status(403).json(
          RespuestaConsultaService.respuestaAccesoDenegadoEdicion('registro')
        );
      }

      const { id } = req.params;
      const registroActualizado = await RegistroService.actualizar(id, req.body);
      
      return res.status(200).json({
        success: true,
        data: registroActualizado,
        message: 'Registro actualizado exitosamente'
      });
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }

  // ❌ OPERACIÓN DE ESCRITURA (El middleware ya lo bloquea)
  static async eliminar(req, res) {
    try {
      if (req.usuario.rol === 'usuario_consulta') {
        return res.status(403).json(
          RespuestaConsultaService.respuestaAccesoDenegadoEliminacion('registro')
        );
      }

      const { id } = req.params;
      await RegistroService.eliminar(id);
      
      return res.status(200).json({
        success: true,
        message: 'Registro eliminado exitosamente'
      });
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }
}

module.exports = RegistroController;
*/

// ============================================
// 📌 PASO 6: CREAR USUARIO CONSULTA EN BD
// ============================================

/*
SQL para crear un usuario de consulta:

INSERT INTO usuarios (usuario, password_hash, nombre, apellido, rol, activo, fecha_creacion)
VALUES (
  'consultor01',
  '$2b$12$abcdefghijklmnopqrstuvwxyz', -- Hash bcrypt de contraseña
  'Juan',
  'Consultor',
  'usuario_consulta',
  true,
  NOW()
);

O si prefieres actualizar un usuario existente:

UPDATE usuarios 
SET rol = 'usuario_consulta' 
WHERE id = 3;
*/

// ============================================
// 📌 PASO 7: PROBAR LA IMPLEMENTACIÓN
// ============================================

/*
SCRIPT DE PRUEBA:

# 1. Login como usuario_consulta
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"consultor01","password":"tu_contraseña"}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

echo "Token obtenido: $TOKEN"

# 2. Probar GET (debe funcionar)
echo "Probando GET /api/registros..."
curl -X GET http://localhost:3000/api/registros \
  -H "Authorization: Bearer $TOKEN"

# 3. Probar POST (debe ser bloqueado)
echo "Probando POST /api/registros..."
curl -X POST http://localhost:3000/api/registros \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"test"}'

# 4. Probar PUT (debe ser bloqueado)
echo "Probando PUT /api/registros/1..."
curl -X PUT http://localhost:3000/api/registros/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"test"}'

# 5. Probar DELETE (debe ser bloqueado)
echo "Probando DELETE /api/registros/1..."
curl -X DELETE http://localhost:3000/api/registros/1 \
  -H "Authorization: Bearer $TOKEN"
*/

// ============================================
// 📌 RESUMEN DE CAMBIOS REQUERIDOS
// ============================================

/*
1. ✅ ARCHIVO: src/app.js
   - Agregar import: const { soloLectura, detectarIntentosAnomalo } = ...
   - Agregar middleware: app.use(detectarIntentosAnomalo);
   - Agregar middleware: app.use(soloLectura);

2. ✅ ARCHIVOS: src/routes/*.routes.js
   - Agregar soloLectura en rutas POST, PUT, DELETE
   - Ejemplo: router.post('/', authenticateToken, soloLectura, controller.crear);

3. ✅ ARCHIVOS: src/controllers/*.controller.js
   - Usar RespuestaConsultaService para respuestas estandarizadas
   - Validar rol en operaciones de escritura

4. ✅ BASE DE DATOS:
   - Crear usuarios con rol 'usuario_consulta'
   - Asegurarse de que el campo 'rol' existe en tabla usuarios

5. ✅ TESTING:
   - Probar acceso de lectura (debe funcionar)
   - Probar acceso de escritura (debe bloquearse)
*/

module.exports = {};
