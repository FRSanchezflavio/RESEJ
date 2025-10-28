const {
  createSuccessResponse,
  createErrorResponse,
  getClientIp,
} = require('../utils/helpers');
const enlaceCompartidoService = require('../services/enlaceCompartidoService');
const logger = require('../utils/logger');

const sanitizeEnlace = enlace => {
  if (!enlace) return null;
  const { contrasena_hash, usuario_temporal_password_hash, ...resto } = enlace;
  return resto;
};

const create = async (req, res, next) => {
  try {
    const {
      registro_id,
      descripcion,
      duracion_horas,
      max_accesos,
      requiere_contrasena,
      contrasena,
      tipo,
    } = req.body;

    const { enlace, credencialesTemporales } =
      await enlaceCompartidoService.createEnlace({
        registroId: registro_id,
        usuarioCreadorId: req.user?.id,
        descripcion,
        duracionHoras: duracion_horas,
        maxAccesos: max_accesos,
        requiereContrasena: requiere_contrasena,
        contrasena,
        tipo,
      });

    return res.status(201).json(
      createSuccessResponse({
        enlace: sanitizeEnlace(enlace),
        credencialesTemporales,
      })
    );
  } catch (error) {
    logger.error(`Error creando enlace compartido: ${error.message}`);
    return next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, includeRevoked = true } = req.query;
    const includeRevokedFlag =
      typeof includeRevoked === 'boolean'
        ? includeRevoked
        : includeRevoked !== 'false';

    const resultado = await enlaceCompartidoService.listEnlaces({
      page: Number(page),
      limit: Number(limit),
      usuarioId: req.user?.id,
      includeRevoked: includeRevokedFlag,
    });

    resultado.enlaces = resultado.enlaces.map(sanitizeEnlace);

    return res.json(createSuccessResponse(resultado));
  } catch (error) {
    logger.error(`Error listando enlaces compartidos: ${error.message}`);
    return next(error);
  }
};

const getByToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const enlace = await enlaceCompartidoService.getEnlacePrivado(token);

    if (!enlace) {
      return res
        .status(404)
        .json(createErrorResponse('Enlace no encontrado', 404));
    }

    return res.json(createSuccessResponse(sanitizeEnlace(enlace)));
  } catch (error) {
    logger.error(`Error obteniendo enlace compartido: ${error.message}`);
    return next(error);
  }
};

const revoke = async (req, res, next) => {
  try {
    const { token } = req.params;
    const enlace = await enlaceCompartidoService.revokeEnlace(token);

    if (!enlace) {
      return res
        .status(404)
        .json(createErrorResponse('Enlace no encontrado', 404));
    }

    return res.json(
      createSuccessResponse(
        sanitizeEnlace(enlace),
        'Enlace revocado correctamente'
      )
    );
  } catch (error) {
    logger.error(`Error revocando enlace: ${error.message}`);
    return next(error);
  }
};

const accessPublico = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { contrasena } = req.body || {};
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'];

    const resultado = await enlaceCompartidoService.validatePublicAccess(
      token,
      {
        contrasena,
        ip,
        userAgent,
      }
    );

    if (resultado.error) {
      const payload = createErrorResponse(resultado.error, resultado.status);
      if (resultado.necesitaContrasena) {
        payload.necesitaContrasena = true;
      }
      return res.status(resultado.status).json(payload);
    }

    return res.json(createSuccessResponse(sanitizeEnlace(resultado.enlace)));
  } catch (error) {
    logger.error(`Error accediendo a enlace público: ${error.message}`);
    return next(error);
  }
};

module.exports = {
  create,
  list,
  getByToken,
  revoke,
  accessPublico,
};
