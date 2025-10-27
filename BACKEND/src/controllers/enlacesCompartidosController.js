const EnlaceCompartido = require('../models/EnlaceCompartido');
const {
  createErrorResponse,
  createSuccessResponse,
} = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * Crear enlace compartido
 */
exports.crearEnlace = async (req, res, next) => {
  try {
    const {
      registro_id,
      duracion_horas,
      max_accesos,
      descripcion,
      requiere_contrasena,
      contrasena,
    } = req.body;
    const creado_por = req.user.id;

    // Validar datos
    if (!registro_id) {
      return res
        .status(400)
        .json(createErrorResponse('El ID del registro es requerido'));
    }

    const resultado = await EnlaceCompartido.crear({
      registro_id,
      creado_por,
      duracion_horas: parseInt(duracion_horas) || 24,
      max_accesos: max_accesos ? parseInt(max_accesos) : null,
      descripcion,
      requiere_contrasena: requiere_contrasena || false,
      contrasena,
    });

    logger.info(`Enlace creado: ${resultado.id} por usuario ${creado_por}`);

    res
      .status(201)
      .json(createSuccessResponse(resultado, 'Enlace creado exitosamente'));
  } catch (error) {
    logger.error(`Error creando enlace: ${error.message}`);
    next(error);
  }
};

/**
 * Listar enlaces del usuario
 */
exports.listarEnlaces = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const usuario_id = req.user.id;

    const resultado = await EnlaceCompartido.listarPorUsuario(
      usuario_id,
      parseInt(page),
      parseInt(limit)
    );

    res.json(
      createSuccessResponse(resultado.data, 'Enlaces listados', {
        pagination: {
          total: resultado.total,
          page: resultado.page,
          limit: resultado.limit,
          pages: resultado.pages,
        },
      })
    );
  } catch (error) {
    logger.error(`Error listando enlaces: ${error.message}`);
    next(error);
  }
};

/**
 * Obtener enlace por token
 */
exports.obtenerEnlace = async (req, res, next) => {
  try {
    const { token } = req.params;
    const usuario_id = req.user.id;

    const enlace = await EnlaceCompartido.obtenerPorToken(token);

    if (!enlace) {
      return res.status(404).json(createErrorResponse('Enlace no encontrado'));
    }

    // Verificar que pertenece al usuario
    if (enlace.creado_por !== usuario_id) {
      return res
        .status(403)
        .json(
          createErrorResponse('No tienes permisos para acceder a este enlace')
        );
    }

    res.json(createSuccessResponse(enlace));
  } catch (error) {
    logger.error(`Error obteniendo enlace: ${error.message}`);
    next(error);
  }
};

/**
 * Obtener enlace público (sin autenticación)
 */
exports.obtenerEnlacePublico = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { contrasena } = req.body || {};

    const enlace = await EnlaceCompartido.obtenerPorToken(token);

    if (!enlace) {
      return res
        .status(404)
        .json(createErrorResponse('Enlace no encontrado o expirado'));
    }

    // Registrar acceso
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    await EnlaceCompartido.registrarAcceso(enlace.id, ipAddress, userAgent);

    res.json(createSuccessResponse(enlace, 'Enlace obtenido'));
  } catch (error) {
    logger.error(`Error obteniendo enlace público: ${error.message}`);
    next(error);
  }
};

/**
 * Revocar acceso a enlace
 */
exports.revocarEnlace = async (req, res, next) => {
  try {
    const { token } = req.params;
    const usuario_id = req.user.id;

    const enlace = await EnlaceCompartido.obtenerPorToken(token);

    if (!enlace) {
      return res.status(404).json(createErrorResponse('Enlace no encontrado'));
    }

    if (enlace.creado_por !== usuario_id) {
      return res
        .status(403)
        .json(
          createErrorResponse('No tienes permisos para revocar este enlace')
        );
    }

    await EnlaceCompartido.revocar(enlace.id);

    logger.info(`Enlace revocado: ${enlace.id}`);
    res.json(createSuccessResponse(null, 'Acceso revocado'));
  } catch (error) {
    logger.error(`Error revocando enlace: ${error.message}`);
    next(error);
  }
};

/**
 * Obtener estadísticas de enlace
 */
exports.obtenerEstadisticas = async (req, res, next) => {
  try {
    const { token } = req.params;
    const usuario_id = req.user.id;

    const enlace = await EnlaceCompartido.obtenerPorToken(token);

    if (!enlace) {
      return res.status(404).json(createErrorResponse('Enlace no encontrado'));
    }

    if (enlace.creado_por !== usuario_id) {
      return res.status(403).json(createErrorResponse('No tienes permisos'));
    }

    // Retornar estadísticas del enlace
    const stats = {
      id: enlace.id,
      token: enlace.token,
      fecha_creacion: enlace.fecha_creacion,
      fecha_expiracion: enlace.fecha_expiracion,
      max_accesos: enlace.max_accesos,
      accesos_actuales: enlace.accesos_actuales,
      activo: enlace.activo,
    };

    res.json(createSuccessResponse(stats));
  } catch (error) {
    logger.error(`Error obteniendo estadísticas: ${error.message}`);
    next(error);
  }
};

/**
 * Obtener QR del enlace
 */
exports.obtenerQR = async (req, res, next) => {
  try {
    const { token } = req.params;
    const usuario_id = req.user.id;

    const enlace = await EnlaceCompartido.obtenerPorToken(token);

    if (!enlace) {
      return res.status(404).json(createErrorResponse('Enlace no encontrado'));
    }

    if (enlace.creado_por !== usuario_id) {
      return res.status(403).json(createErrorResponse('No tienes permisos'));
    }

    // URL pública del enlace
    const urlPublica = `${
      process.env.FRONTEND_URL || 'http://localhost:5173'
    }/enlace/${enlace.token}`;

    res.json(
      createSuccessResponse(
        { url: urlPublica, token: enlace.token },
        'URL del enlace obtenida'
      )
    );
  } catch (error) {
    logger.error(`Error obteniendo QR: ${error.message}`);
    next(error);
  }
};
