const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken } = require('../middleware/auth');
const { verificarPermiso } = require('../middleware/permisos');

// Rutas de usuarios
router.get('/roles', authenticateToken, usuariosController.obtenerRoles);
router.get(
  '/',
  authenticateToken,
  verificarPermiso('consultar'),
  usuariosController.obtenerUsuarios
);
router.post(
  '/',
  authenticateToken,
  verificarPermiso('crear'),
  usuariosController.crearUsuario
);
router.put(
  '/:id',
  authenticateToken,
  verificarPermiso('editar'),
  usuariosController.actualizarUsuario
);
router.delete(
  '/:id',
  authenticateToken,
  verificarPermiso('eliminar'),
  usuariosController.eliminarUsuario
);

// Rutas para tokens de acceso temporal
router.post(
  '/generar-enlace-acceso',
  authenticateToken,
  verificarPermiso('crear'),
  usuariosController.generarEnlaceAcceso
);
router.post('/validar-token-acceso', usuariosController.validarTokenAcceso);
router.get(
  '/tokens-activos',
  authenticateToken,
  verificarPermiso('crear'),
  usuariosController.listarTokensActivos
);

module.exports = router;
