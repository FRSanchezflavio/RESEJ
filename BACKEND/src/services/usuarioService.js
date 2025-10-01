const Usuario = require('../models/Usuario');
const { formatUsuario } = require('../utils/helpers');
const logger = require('../utils/logger');

class UsuarioService {
  /**
   * Obtener todos los usuarios
   */
  static async getAllUsuarios(filters) {
    try {
      const result = await Usuario.findAll(filters);
      
      // Formatear usuarios
      result.usuarios = result.usuarios.map(user => formatUsuario(user));
      
      return result;
    } catch (error) {
      logger.error(`Error al obtener usuarios: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   */
  static async getUsuarioById(id) {
    try {
      const usuario = await Usuario.findById(id);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return formatUsuario(usuario);
    } catch (error) {
      logger.error(`Error al obtener usuario ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crear nuevo usuario
   */
  static async createUsuario(usuarioData, creadoPor) {
    try {
      // Verificar si el usuario ya existe
      const existente = await Usuario.findByUsername(usuarioData.usuario);
      
      if (existente) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Crear usuario
      const nuevoUsuario = await Usuario.create({
        ...usuarioData,
        creado_por: creadoPor
      });

      logger.info(`Usuario creado: ${nuevoUsuario.usuario} por usuario ID ${creadoPor}`);

      return formatUsuario(nuevoUsuario);
    } catch (error) {
      logger.error(`Error al crear usuario: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  static async updateUsuario(id, usuarioData) {
    try {
      // Verificar que el usuario existe
      const usuario = await Usuario.findById(id);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Si se intenta cambiar el nombre de usuario, verificar que no exista
      if (usuarioData.usuario && usuarioData.usuario !== usuario.usuario) {
        const existente = await Usuario.findByUsername(usuarioData.usuario);
        if (existente) {
          throw new Error('El nombre de usuario ya está en uso');
        }
      }

      // Actualizar usuario
      const usuarioActualizado = await Usuario.update(id, usuarioData);

      logger.info(`Usuario actualizado: ${usuarioActualizado.usuario}`);

      return formatUsuario(usuarioActualizado);
    } catch (error) {
      logger.error(`Error al actualizar usuario ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Desactivar usuario
   */
  static async deactivateUsuario(id) {
    try {
      const usuario = await Usuario.deactivate(id);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      logger.info(`Usuario desactivado: ${usuario.usuario}`);

      return formatUsuario(usuario);
    } catch (error) {
      logger.error(`Error al desactivar usuario ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Activar usuario
   */
  static async activateUsuario(id) {
    try {
      const usuario = await Usuario.activate(id);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      logger.info(`Usuario activado: ${usuario.usuario}`);

      return formatUsuario(usuario);
    } catch (error) {
      logger.error(`Error al activar usuario ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resetear contraseña de usuario
   */
  static async resetPassword(id, newPassword) {
    try {
      const usuario = await Usuario.resetPassword(id, newPassword);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      logger.info(`Contraseña reseteada para usuario: ${usuario.usuario}`);

      return formatUsuario(usuario);
    } catch (error) {
      logger.error(`Error al resetear contraseña del usuario ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener historial de accesos
   */
  static async getAccessHistory(id, filters) {
    try {
      const usuario = await Usuario.findById(id);
      
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return await Usuario.getAccessHistory(id, filters);
    } catch (error) {
      logger.error(`Error al obtener historial de usuario ${id}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = UsuarioService;
