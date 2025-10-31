const UsuarioService = require('../services/usuarioService');
const { createSuccessResponse } = require('../utils/helpers');
const { enviarCredencialesNuevoUsuario } = require('../services/emailService');

class UsuariosController {
  async getAll(req, res, next) {
    try {
      const { page, limit, activo } = req.query;
      const result = await UsuarioService.getAllUsuarios({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        activo: activo !== undefined ? activo === 'true' : null,
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
      const { enviarEmail, ...usuarioData } = req.body;
      
      // Guardar la contraseña original antes de hashearla (solo para enviar por email)
      const passwordOriginal = usuarioData.password;
      
      const usuario = await UsuarioService.createUsuario(usuarioData, req.user.id);
      
      let emailEnviado = false;
      let mensajeEmail = '';
      
      // Si se solicita enviar email y el usuario tiene email
      if (enviarEmail && usuario.email) {
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
        const resultadoEmail = await enviarCredencialesNuevoUsuario(
          usuario.email,
          usuario.usuario,
          passwordOriginal,
          nombreCompleto
        );
        
        emailEnviado = resultadoEmail.success;
        mensajeEmail = resultadoEmail.message;
        
        if (!resultadoEmail.success) {
          console.warn('Usuario creado pero no se pudo enviar el correo:', resultadoEmail.message);
        }
      }
      
      // Crear respuesta con información del email
      const respuesta = {
        usuario: {
          id: usuario.id,
          usuario: usuario.usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
          activo: usuario.activo
        },
        emailEnviado,
        mensajeEmail: emailEnviado ? 'Correo con credenciales enviado exitosamente' : mensajeEmail
      };
      
      res
        .status(201)
        .json(createSuccessResponse(respuesta, 'Usuario creado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const usuario = await UsuarioService.updateUsuario(
        req.params.id,
        req.body
      );
      res.json(
        createSuccessResponse(usuario, 'Usuario actualizado exitosamente')
      );
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req, res, next) {
    try {
      const usuario = await UsuarioService.deactivateUsuario(req.params.id);
      res.json(
        createSuccessResponse(usuario, 'Usuario desactivado exitosamente')
      );
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
      const usuario = await UsuarioService.resetPassword(
        req.params.id,
        new_password
      );
      res.json(
        createSuccessResponse(usuario, 'Contraseña reseteada exitosamente')
      );
    } catch (error) {
      next(error);
    }
  }

  async getAccessHistory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await UsuarioService.getAccessHistory(req.params.id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuariosController();
