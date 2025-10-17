/**
 * Middleware: Validador de Permisos para Usuario Consulta
 * RE.SE.J - Control de Acceso
 *
 * Este middleware valida que usuarios con rol "usuario_consulta"
 * solo puedan realizar operaciones de lectura.
 */

const {
  PERMISOS_POR_ROL,
  MENSAJES,
} = require('../config/promptSystemConsulta');
const logger = require('../utils/logger');

/**
 * Middleware para validar si el usuario puede realizar la acción solicitada
 * @param {string} accion - La acción a validar (ej: 'secuestros:crear')
 * @param {string} tipo - El tipo de operación (lectura, escritura, administración)
 */
const validarPermiso = (accion, tipo = 'lectura') => {
  return async (req, res, next) => {
    try {
      const usuario = req.usuario;

      // Si no hay usuario, rechazar
      if (!usuario) {
        logger.error('No hay usuario en la solicitud', {
          ip: req.ip,
          metodo: req.method,
          ruta: req.path,
        });

        return res.status(401).json({
          success: false,
          error: 'No autenticado',
          statusCode: 401,
        });
      }

      // Obtener los permisos del rol del usuario
      const permisos = PERMISOS_POR_ROL[usuario.rol];

      if (!permisos) {
        logger.error('Rol desconocido', {
          usuario: usuario.id,
          rol: usuario.rol,
        });

        return res.status(403).json({
          success: false,
          error: 'Rol de usuario no reconocido',
          statusCode: 403,
        });
      }

      // Verificar si el usuario tiene permiso para la acción
      const tienePermiso = permisos.permisos[accion];

      if (tienePermiso === false) {
        // ACCESO DENEGADO
        logger.warn('Intento de acceso denegado', {
          usuario: usuario.id,
          rol: usuario.rol,
          accion,
          tipo,
          metodo: req.method,
          ruta: req.path,
          ip: req.ip,
        });

        // Preparar mensaje de respuesta
        let mensaje = MENSAJES.acceso_denegado_generico;

        if (tipo === 'escritura') {
          if (req.method === 'POST') {
            mensaje = MENSAJES.acceso_denegado_creacion;
          } else if (req.method === 'PUT' || req.method === 'PATCH') {
            mensaje = MENSAJES.acceso_denegado_edicion;
          } else if (req.method === 'DELETE') {
            mensaje = MENSAJES.acceso_denegado_eliminacion;
          }
        } else if (tipo === 'administración') {
          mensaje = MENSAJES.acceso_denegado_usuarios;
        }

        return res.status(403).json({
          success: false,
          error: mensaje,
          statusCode: 403,
          rol: usuario.rol,
          accion_bloqueada: accion,
        });
      }

      // ACCESO PERMITIDO - Continuar
      next();
    } catch (error) {
      logger.error('Error en validarPermiso', { error: error.message });

      res.status(500).json({
        success: false,
        error: 'Error al validar permisos',
        statusCode: 500,
      });
    }
  };
};

/**
 * Middleware para bloquear completamente a usuarios consulta
 * en rutas específicas
 */
const bloquearConsulta = async (req, res, next) => {
  try {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
        statusCode: 401,
      });
    }

    // Si es usuario consulta, bloquear
    if (usuario.rol === 'usuario_consulta') {
      logger.warn('Acceso bloqueado para usuario consulta', {
        usuario: usuario.id,
        rol: usuario.rol,
        metodo: req.method,
        ruta: req.path,
        ip: req.ip,
      });

      const operacion =
        req.method === 'POST'
          ? 'creación'
          : req.method === 'PUT' || req.method === 'PATCH'
          ? 'edición'
          : req.method === 'DELETE'
          ? 'eliminación'
          : 'operación';

      return res.status(403).json({
        success: false,
        error: MENSAJES.acceso_denegado_generico.replace(
          '{{accion}}',
          operacion
        ),
        statusCode: 403,
        rol: usuario.rol,
      });
    }

    next();
  } catch (error) {
    logger.error('Error en bloquearConsulta', { error: error.message });

    res.status(500).json({
      success: false,
      error: 'Error al validar acceso',
      statusCode: 500,
    });
  }
};

/**
 * Middleware para solo permitir lectura
 * Bloquea POST, PUT, PATCH, DELETE
 */
const soloLectura = async (req, res, next) => {
  try {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
        statusCode: 401,
      });
    }

    // Si es usuario consulta, solo permitir GET
    if (
      usuario.rol === 'usuario_consulta' &&
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
    ) {
      logger.warn('Operación de escritura bloqueada para usuario consulta', {
        usuario: usuario.id,
        rol: usuario.rol,
        metodo: req.method,
        ruta: req.path,
        ip: req.ip,
      });

      const operacion =
        req.method === 'POST'
          ? 'creación'
          : req.method === 'PUT' || req.method === 'PATCH'
          ? 'edición'
          : 'eliminación';

      return res.status(403).json({
        success: false,
        error: MENSAJES.acceso_denegado_generico.replace(
          '{{accion}}',
          operacion
        ),
        statusCode: 403,
        rol: usuario.rol,
      });
    }

    next();
  } catch (error) {
    logger.error('Error en soloLectura', { error: error.message });

    res.status(500).json({
      success: false,
      error: 'Error al validar acceso',
      statusCode: 500,
    });
  }
};

/**
 * Middleware para detectar intentos sospechosos
 */
const detectarIntentosAnomalo = async (req, res, next) => {
  try {
    const usuario = req.usuario;

    if (!usuario || usuario.rol !== 'usuario_consulta') {
      return next();
    }

    // Patrones sospechosos
    const patronesSospechosos = [
      /(\bOR\b|\bAND\b|'|"|;|--|\/\*|\*\/)/gi, // SQL injection
      /<script|javascript:|onerror|onload/gi, // XSS
      /\.\.\//gi, // Path traversal
      /eval|exec|system|shell/gi, // Command injection
    ];

    // Revisar query parameters
    const parametros = JSON.stringify(req.query);
    const body = JSON.stringify(req.body);

    for (const patron of patronesSospechosos) {
      if (patron.test(parametros) || patron.test(body)) {
        logger.warn('Intento de ataque detectado', {
          usuario: usuario.id,
          rol: usuario.rol,
          tipo: 'patrón sospechoso',
          metodo: req.method,
          ruta: req.path,
          ip: req.ip,
        });

        return res.status(400).json({
          success: false,
          error: MENSAJES.solicitud_sospechosa,
          statusCode: 400,
        });
      }
    }

    next();
  } catch (error) {
    logger.error('Error en detectarIntentosAnomalo', { error: error.message });
    next();
  }
};

module.exports = {
  validarPermiso,
  bloquearConsulta,
  soloLectura,
  detectarIntentosAnomalo,
};
