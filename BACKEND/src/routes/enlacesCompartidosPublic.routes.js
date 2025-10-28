const express = require('express');
const router = express.Router();
const enlacesCompartidosController = require('../controllers/enlacesCompartidosController');
const {
  tokenParamValidator,
  publicAccessValidators,
  handleValidationErrors,
} = require('../utils/validators');
const { sharedLinkAccessLimiter } = require('../middleware/rateLimiter');

router.post(
  '/:token/acceso',
  sharedLinkAccessLimiter,
  tokenParamValidator,
  publicAccessValidators,
  handleValidationErrors,
  enlacesCompartidosController.accessPublico
);

module.exports = router;
