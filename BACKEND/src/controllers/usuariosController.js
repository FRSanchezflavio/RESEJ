const UsuarioService = require('../services/usuarioService');
const { createSuccessResponse } = require('../utils/helpers');

class UsuariosController {
  async getAll(req, res, next) {
    try {
      const { page, limit, activo } = req.query;
      const result = await UsuarioService.getAllUsuarios({ 
        page: parseInt(page) || 1, 
        limit: parseInt(limit) || 10,
        activo: activo !== undefined ? activo === 'true' : null
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const usuario = await UsuarioService.getUsuarioById(req.params.id);
      res.json(createSuccessResponse(usuario));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const usuario = await UsuarioService.createUsuario(req.body, req.user.id);
      res.status(201).json(createSuccessResponse(usuario, 'Usuario creado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const usuario = await UsuarioService.updateUsuario(req.params.id, req.body);
      res.json(createSuccessResponse(usuario, 'Usuario actualizado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req, res, next) {
    try {
      const usuario = await UsuarioService.deactivateUsuario(req.params.id);
      res.json(createSuccessResponse(usuario, 'Usuario desactivado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const usuario = await UsuarioService.activateUsuario(req.params.id);
      res.json(createSuccessResponse(usuario, 'Usuario activado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { new_password } = req.body;
      const usuario = await UsuarioService.resetPassword(req.params.id, new_password);
      res.json(createSuccessResponse(usuario, 'Contraseña reseteada exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async getAccessHistory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await UsuarioService.getAccessHistory(req.params.id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuariosController();
