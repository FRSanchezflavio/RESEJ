const Registro = require('../models/Registro');
const Persona = require('../models/Persona');
const logger = require('../utils/logger');

class RegistroService {
  /**
   * Obtener todos los registros con filtros
   */
  static async getAllRegistros(filters) {
    try {
      return await Registro.findAll(filters);
    } catch (error) {
      logger.error(`Error al obtener registros: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener registro por ID
   */
  static async getRegistroById(id) {
    try {
      const registro = await Registro.findById(id);

      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      return registro;
    } catch (error) {
      logger.error(`Error al obtener registro ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar registros
   */
  static async searchRegistros(filters) {
    try {
      return await Registro.search(filters);
    } catch (error) {
      logger.error(`Error al buscar registros: ${error.message}`);
      throw error;
    }
  }

  /**
   * Crear nuevo registro
   */
  static async createRegistro(registroData, usuarioId) {
    try {
      // Verificar que la persona existe
      const persona = await Persona.findById(registroData.persona_id);

      if (!persona) {
        throw new Error('La persona especificada no existe');
      }

      // Crear registro
      const nuevoRegistro = await Registro.create({
        ...registroData,
        usuario_carga: usuarioId,
      });

      logger.info(
        `Registro creado: ID ${nuevoRegistro.id} por usuario ID ${usuarioId}`
      );

      // Obtener registro completo con datos de persona
      return await Registro.findById(nuevoRegistro.id);
    } catch (error) {
      logger.error(`Error al crear registro: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar registro
   */
  static async updateRegistro(id, registroData) {
    try {
      // Verificar que el registro existe
      const registro = await Registro.findById(id);

      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      // Si se cambia la persona, verificar que existe
      if (
        registroData.persona_id &&
        registroData.persona_id !== registro.persona_id
      ) {
        const persona = await Persona.findById(registroData.persona_id);
        if (!persona) {
          throw new Error('La persona especificada no existe');
        }
      }

      // Actualizar registro
      const registroActualizado = await Registro.update(id, registroData);

      logger.info(`Registro actualizado: ID ${id}`);

      // Obtener registro completo
      return await Registro.findById(id);
    } catch (error) {
      logger.error(`Error al actualizar registro ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Eliminar registro
   */
  static async deleteRegistro(id) {
    try {
      const registro = await Registro.findById(id);

      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      await Registro.delete(id);

      logger.info(`Registro eliminado: ID ${id}`);

      return { message: 'Registro eliminado exitosamente', registro };
    } catch (error) {
      logger.error(`Error al eliminar registro ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener estadísticas
   */
  static async getEstadisticas() {
    try {
      return await Registro.getEstadisticas();
    } catch (error) {
      logger.error(`Error al obtener estadísticas: ${error.message}`);
      throw error;
    }
  }

  /**
   * Exportar registros (preparar datos para exportación)
   */
  static async exportRegistros(filters) {
    try {
      // Obtener todos los registros sin paginación
      const { registros } = await Registro.findAll({
        ...filters,
        limit: 10000,
        page: 1,
      });

      logger.info(`Registros exportados: ${registros.length} registros`);

      return registros;
    } catch (error) {
      logger.error(`Error al exportar registros: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RegistroService;
