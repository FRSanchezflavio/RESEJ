const express = require('express');
const router = express.Router();
const {
  InvitacionesController,
  validateTokenValidators,
  acceptInvitationValidators,
} = require('../controllers/invitacionesController');

// Validar token de invitación (público)
router.get(
  '/:token/validar',
  validateTokenValidators,
  InvitacionesController.validate
);

// Aceptar invitación y crear usuario (público)
router.post(
  '/:token/aceptar',
  acceptInvitationValidators,
  InvitacionesController.accept
);

module.exports = router;
