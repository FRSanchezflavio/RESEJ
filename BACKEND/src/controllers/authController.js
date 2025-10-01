const AuthService = require('../services/authService');
const {
  createSuccessResponse,
  createErrorResponse,
  getClientIp,
} = require('../utils/helpers');

class AuthController {
  async login(req, res, next) {
    try {
      const { usuario, password } = req.body;
      const ipAddress = getClientIp(req);

      const result = await AuthService.login(usuario, password, ipAddress);

      res.json(createSuccessResponse(result, 'Login exitoso'));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.body;
      const ipAddress = getClientIp(req);

      const result = await AuthService.refreshAccessToken(
        refresh_token,
        ipAddress
      );

      res.json(createSuccessResponse(result, 'Token refrescado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refresh_token } = req.body;
      const ipAddress = getClientIp(req);

      const result = await AuthService.logout(refresh_token, ipAddress);

      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      res.json(createSuccessResponse({ usuario: req.user }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
