const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Errores de validación',
      detalles: errors.array(),
    });
  }
  next();
};

/**
 * Validadores para autenticación
 */
const loginValidators = [
  body('usuario')
    .trim()
    .notEmpty()
    .withMessage('El usuario es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El usuario debe tener entre 3 y 50 caracteres'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

/**
 * Validadores para creación de usuario
 */
const createUsuarioValidators = [
  body('usuario')
    .trim()
    .notEmpty()
    .withMessage('El usuario es requerido')
    .isLength({ min: 3, max: 50 })
    .withMessage('El usuario debe tener entre 3 y 50 caracteres'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'La contraseña debe contener mayúsculas, minúsculas y números'
    ),
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ max: 100 })
    .withMessage('El apellido no puede exceder 100 caracteres'),
  body('rol')
    .optional()
    .isIn(['administrador', 'usuario_consulta'])
    .withMessage('Rol inválido'),
];

/**
 * Validadores para creación de persona
 */
const createPersonaValidators = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('apellido')
    .trim()
    .notEmpty()
    .withMessage('El apellido es requerido')
    .isLength({ max: 100 })
    .withMessage('El apellido no puede exceder 100 caracteres'),
  body('dni')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El DNI no puede exceder 20 caracteres'),
  body('email').optional().trim().isEmail().withMessage('Email inválido'),
  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El teléfono no puede exceder 50 caracteres'),
];

/**
 * Validadores para creación de registro de secuestro
 */
const createRegistroValidators = [
  body('persona_id')
    .notEmpty()
    .withMessage('El ID de persona es requerido')
    .isInt({ min: 1 })
    .withMessage('ID de persona inválido'),
  // fecha_ingreso: aceptar AAAA-MM-DD y convertir a Date
  body('fecha_ingreso')
    .notEmpty().withMessage('La fecha de ingreso es requerida')
    .custom((value) => {
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoRegex.test(value)) {
        throw new Error('Formato de fecha inválido (use AAAA-MM-DD)');
      }
      return true;
    }),

  body('ufi')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('UFI no puede exceder 100 caracteres'),
  body('numero_legajo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Número de legajo no puede exceder 100 caracteres'),
  body('estado_causa')
    .optional()
    .isIn(['abierta', 'cerrada', 'en_proceso'])
    .withMessage('Estado de causa inválido'),
];

/**
 * Validadores para parámetros de ID
 */
const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
];

/**
 * Validadores para búsqueda
 */
const searchValidators = [
  query('termino')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Término de búsqueda debe tener entre 1 y 200 caracteres'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de página inválido'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
];

/**
 * Validadores para enlaces compartidos
 */
const createEnlaceCompartidoValidators = [
  body('registro_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('El ID del registro debe ser un entero positivo'),
  body('descripcion')
    .optional({ checkFalsy: true })
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
  body('duracion_horas')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 720 })
    .withMessage('La duración debe estar entre 1 y 720 horas'),
  body('max_accesos')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 1000 })
    .withMessage('El máximo de accesos debe ser un entero entre 1 y 1000'),
  body('requiere_contrasena')
    .optional()
    .isBoolean()
    .withMessage('El campo requiere_contrasena debe ser booleano')
    .toBoolean(),
  body('contrasena')
    .optional({ checkFalsy: true })
    .isLength({ min: 8, max: 128 })
    .withMessage('La contraseña debe tener entre 8 y 128 caracteres')
    .custom((value, { req }) => {
      if (req.body.requiere_contrasena && !value) {
        throw new Error('Debe proporcionar una contraseña cuando se requiere');
      }
      return true;
    }),
  body('tipo')
    .optional({ checkFalsy: true })
    .isIn(['registro', 'archivo', 'custom'])
    .withMessage('Tipo de enlace inválido'),
];

const listEnlaceCompartidoValidators = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de página inválido'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Límite debe estar entre 1 y 100'),
  query('includeRevoked')
    .optional()
    .isBoolean()
    .withMessage('includeRevoked debe ser booleano')
    .toBoolean(),
];

const tokenParamValidator = [
  param('token')
    .trim()
    .notEmpty()
    .withMessage('El token es requerido')
    .isLength({ min: 10, max: 128 })
    .withMessage('Token inválido')
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage('El token debe estar en formato base64url'),
];

const publicAccessValidators = [
  body('contrasena')
    .optional({ checkFalsy: true })
    .isLength({ min: 8, max: 128 })
    .withMessage('La contraseña debe tener entre 8 y 128 caracteres'),
];

module.exports = {
  handleValidationErrors,
  loginValidators,
  createUsuarioValidators,
  createPersonaValidators,
  createRegistroValidators,
  idParamValidator,
  searchValidators,
  createEnlaceCompartidoValidators,
  listEnlaceCompartidoValidators,
  tokenParamValidator,
  publicAccessValidators,
};
