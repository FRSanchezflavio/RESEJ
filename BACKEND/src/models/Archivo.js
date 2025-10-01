const db = require('../config/database');

class Archivo {
  /**
   * Buscar archivo por ID
   */
  static async findById(id) {
    return await db('archivos_adjuntos').where({ id }).first();
  }

  /**
   * Obtener todos los archivos de un registro
   */
  static async findByRegistroId(registroId) {
    return await db('archivos_adjuntos')
      .where({ registro_id: registroId })
      .orderBy('fecha_subida', 'desc');
  }

  /**
   * Crear nuevo archivo
   */
  static async create(archivoData) {
    const [archivo] = await db('archivos_adjuntos')
      .insert(archivoData)
      .returning('*');

    return archivo;
  }

  /**
   * Eliminar archivo
   */
  static async delete(id) {
    const archivo = await this.findById(id);
    if (!archivo) return null;

    await db('archivos_adjuntos').where({ id }).del();

    return archivo;
  }

  /**
   * Obtener estadísticas de archivos
   */
  static async getEstadisticas() {
    const [{ total }] = await db('archivos_adjuntos').count('* as total');
    const [{ tamano_total }] = await db('archivos_adjuntos').sum(
      'tamano_bytes as tamano_total'
    );

    return {
      total: parseInt(total),
      tamanoTotal: parseInt(tamano_total) || 0,
    };
  }

  /**
   * Contar archivos de un registro
   */
  static async countByRegistroId(registroId) {
    const [{ count }] = await db('archivos_adjuntos')
      .where({ registro_id: registroId })
      .count('* as count');

    return parseInt(count);
  }
}

module.exports = Archivo;
