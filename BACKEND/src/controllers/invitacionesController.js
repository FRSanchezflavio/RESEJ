const { body, param, query, validationResult } = require('express-validator');
const InvitacionService = require('../services/invitacionService');

// Validadores
const createInvitationValidators = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('nombre_completo')
    .trim()
    .notEmpty()
    .withMessage('El nombre completo es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),
  body('rol')
    .optional()
    .isIn(['usuario_consulta', 'usuario_registro', 'admin'])
    .withMessage('Rol inválido'),
  body('duracion_horas')
    .optional()
    .isInt({ min: 1, max: 720 })
    .withMessage('La duración debe ser entre 1 y 720 horas (30 días)'),
];

const validateTokenValidators = [
  param('token')
    .trim()
    .notEmpty()
    .withMessage('El token es requerido')
    .isLength({ min: 32 })
    .withMessage('Token inválido'),
];

const acceptInvitationValidators = [
  param('token').trim().notEmpty().withMessage('El token es requerido'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El nombre de usuario es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El usuario debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El usuario solo puede contener letras, números y guión bajo'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

class InvitacionesController {
  /**
   * Crear nueva invitación
   * POST /api/invitaciones
   */
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const usuarioCreadorId = req.user.id;
      const result = await InvitacionService.createInvitation(
        req.body,
        usuarioCreadorId
      );

      res.status(201).json({
        message: 'Invitación creada exitosamente',
        data: result,
      });
    } catch (error) {
      console.error('Error al crear invitación:', error);
      res.status(400).json({
        error: error.message || 'Error al crear la invitación',
      });
    }
  }

  /**
   * Validar token de invitación
   * GET /api/public/invitaciones/:token/validar
   */
  static async validate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token } = req.params;
      const result = await InvitacionService.validateInvitation(token);

      if (!result.valid) {
        return res.status(400).json({
          valid: false,
          error: result.error,
        });
      }

      res.json({
        valid: true,
        invitacion: result.invitacion,
      });
    } catch (error) {
      console.error('Error al validar invitación:', error);
      res.status(500).json({
        error: 'Error al validar la invitación',
      });
    }
  }

  /**
   * Aceptar invitación y crear usuario
   * POST /api/public/invitaciones/:token/aceptar
   */
  static async accept(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token } = req.params;
      const usuario = await InvitacionService.acceptInvitation(token, req.body);

      res.status(201).json({
        message: 'Usuario creado exitosamente',
        data: {
          id: usuario.id,
          username: usuario.usuario,
          email: usuario.email,
          rol: usuario.rol,
        },
      });
    } catch (error) {
      console.error('Error al aceptar invitación:', error);
      res.status(400).json({
        error: error.message || 'Error al aceptar la invitación',
      });
    }
  }

  /**
   * Listar todas las invitaciones
   * GET /api/invitaciones
   */
  static async list(req, res) {
    try {
      const filters = {
        usado:
          req.query.usado === 'true'
            ? true
            : req.query.usado === 'false'
            ? false
            : undefined,
        email: req.query.email,
      };

      const invitaciones = await InvitacionService.getAllInvitations(filters);

      res.json({
        data: invitaciones,
      });
    } catch (error) {
      console.error('Error al listar invitaciones:', error);
      res.status(500).json({
        error: 'Error al obtener las invitaciones',
      });
    }
  }

  /**
   * Limpiar invitaciones expiradas
   * DELETE /api/invitaciones/limpiar-expiradas
   */
  static async cleanupExpired(req, res) {
    try {
      const result = await InvitacionService.cleanupExpired();

      res.json({
        message: `${result} invitaciones expiradas eliminadas`,
      });
    } catch (error) {
      console.error('Error al limpiar invitaciones:', error);
      res.status(500).json({
        error: 'Error al limpiar las invitaciones',
      });
    }
  }
}

module.exports = {
  InvitacionesController,
  createInvitationValidators,
  validateTokenValidators,
  acceptInvitationValidators,
};
