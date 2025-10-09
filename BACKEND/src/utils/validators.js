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
  // Campos requeridos
  body('persona_id')
    .notEmpty()
    .withMessage('El ID de persona es requerido')
    .isInt({ min: 1 })
    .withMessage('ID de persona inválido'),

  body('fecha_ingreso')
    .notEmpty()
    .withMessage('La fecha de ingreso es requerida')
    .custom(value => {
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoRegex.test(value)) {
        throw new Error('Formato de fecha inválido (use AAAA-MM-DD)');
      }
      return true;
    }),

  // Campos opcionales - permitir todos los campos del formulario
  body('fecha_carga')
    .optional()
    .custom(value => {
      if (value && value !== '') {
        const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!isoRegex.test(value)) {
          throw new Error(
            'Formato de fecha de carga inválido (use AAAA-MM-DD)'
          );
        }
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

  body('seccion_que_interviene')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Sección que interviene no puede exceder 200 caracteres'),

  body('detalle_secuestro').optional().trim(),

  body('numero_protocolo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Número de protocolo no puede exceder 100 caracteres'),

  body('cadena_custodia')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Cadena de custodia no puede exceder 100 caracteres'),

  body('nro_folio')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Número de folio no puede exceder 50 caracteres'),

  body('nro_libro_secuestro')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Número de libro de secuestro no puede exceder 50 caracteres'),

  body('of_a_cargo')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Oficial a cargo no puede exceder 200 caracteres'),

  body('observaciones').optional().trim(),

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

module.exports = {
  handleValidationErrors,
  loginValidators,
  createUsuarioValidators,
  createPersonaValidators,
  createRegistroValidators,
  idParamValidator,
  searchValidators,
};
