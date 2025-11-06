const express = require('express');
const router = express.Router();
const {
  InvitacionesController,
  createInvitationValidators
} = require('../controllers/invitacionesController');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Crear nueva invitación
router.post('/', createInvitationValidators, InvitacionesController.create);

// Listar invitaciones
router.get('/', InvitacionesController.list);

// Limpiar invitaciones expiradas
router.delete('/limpiar-expiradas', InvitacionesController.cleanupExpired);

module.exports = router;
