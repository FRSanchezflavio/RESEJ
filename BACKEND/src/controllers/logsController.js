const Log = require('../models/Log');
const { createSuccessResponse } = require('../utils/helpers');

class LogsController {
  async getAll(req, res, next) {
    try {
      const { page, limit, usuario_id, accion, recurso_tipo, fecha_desde, fecha_hasta } = req.query;
      const result = await Log.findAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50,
        usuario_id: usuario_id ? parseInt(usuario_id) : null,
        accion,
        recurso_tipo,
        fecha_desde,
        fecha_hasta
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getByUsuarioId(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await Log.findByUsuarioId(req.params.usuarioId, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getAcciones(req, res, next) {
    try {
      const acciones = await Log.getAcciones();
      res.json(createSuccessResponse(acciones));
    } catch (error) {
      next(error);
    }
  }

  async getRecursoTipos(req, res, next) {
    try {
      const tipos = await Log.getRecursoTipos();
      res.json(createSuccessResponse(tipos));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LogsController();
