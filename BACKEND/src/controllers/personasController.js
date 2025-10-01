const Persona = require('../models/Persona');
const { createSuccessResponse } = require('../utils/helpers');

class PersonasController {
  async getAll(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await Persona.findAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const persona = await Persona.findById(req.params.id);
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
      res.json(createSuccessResponse(persona));
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const { termino, page, limit } = req.query;
      const result = await Persona.search(termino, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const persona = await Persona.create(req.body);
      res
        .status(201)
        .json(createSuccessResponse(persona, 'Persona creada exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const persona = await Persona.update(req.params.id, req.body);
      if (!persona) {
        return res.status(404).json({ error: 'Persona no encontrada' });
      }
      res.json(
        createSuccessResponse(persona, 'Persona actualizada exitosamente')
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const hasRegistros = await Persona.hasRegistros(req.params.id);
      if (hasRegistros) {
        return res
          .status(400)
          .json({
            error: 'No se puede eliminar una persona con registros asociados',
          });
      }
      await Persona.delete(req.params.id);
      res.json(createSuccessResponse(null, 'Persona eliminada exitosamente'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PersonasController();
