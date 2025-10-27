const RegistroService = require('../services/registroService');
const { createSuccessResponse } = require('../utils/helpers');

class RegistrosController {
  async getAll(req, res, next) {
    try {
      console.log('🔍 [registrosController.getAll] Iniciado');
      console.log('📝 Usuario ID:', req.user?.id);
      console.log('📝 Usuario rol:', req.user?.rol);
      console.log('📝 Query params:', req.query);

      const { page, limit, estado_causa, fecha_desde, fecha_hasta } = req.query;
      const result = await RegistroService.getAllRegistros({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        estado_causa,
        fecha_desde,
        fecha_hasta,
      });
      
      console.log('✅ Registros obtenidos:', result.registros.length);
      console.log('📊 Resultado completo:', result);
      
      res.json(createSuccessResponse(result));
    } catch (error) {
      console.error('❌ Error en getAll:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const registro = await RegistroService.getRegistroById(req.params.id);
      res.json(createSuccessResponse(registro));
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const {
        termino,
        criterio,
        page,
        limit,
        estado_causa,
        fecha_desde,
        fecha_hasta,
      } = req.query;
      const result = await RegistroService.searchRegistros({
        termino,
        criterio: criterio || 'todos',
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        estado_causa,
        fecha_desde,
        fecha_hasta,
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const registro = await RegistroService.createRegistro(
        req.body,
        req.user.id
      );
      res
        .status(201)
        .json(createSuccessResponse(registro, 'Registro creado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const registro = await RegistroService.updateRegistro(
        req.params.id,
        req.body
      );
      res.json(
        createSuccessResponse(registro, 'Registro actualizado exitosamente')
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await RegistroService.deleteRegistro(req.params.id);
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async exportar(req, res, next) {
    try {
      const { estado_causa, fecha_desde, fecha_hasta } = req.query;
      const registros = await RegistroService.exportRegistros({
        estado_causa,
        fecha_desde,
        fecha_hasta,
      });
      res.json(createSuccessResponse(registros));
    } catch (error) {
      next(error);
    }
  }

  async estadisticas(req, res, next) {
    try {
      const stats = await RegistroService.getEstadisticas();
      res.json(createSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RegistrosController();
