const db = require('../config/database');

class AccesoEnlace {
  /**
   * Registra un nuevo acceso al enlace
   * @param {Object} data
   */
  static async create(data) {
    const [acceso] = await db('accesos_enlace').insert(data).returning('*');
    return acceso;
  }

  /**
   * Obtiene accesos paginados para un enlace
   */
  static async findByEnlace(enlaceId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;

    const accesos = await db('accesos_enlace')
      .where({ enlace_id: enlaceId })
      .orderBy('fecha_acceso', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('accesos_enlace')
      .where({ enlace_id: enlaceId })
      .count('* as total');

    return {
      accesos,
      pagination: {
        page,
        limit,
        total: Number(total) || 0,
        totalPages: Math.ceil((Number(total) || 0) / limit) || 1,
      },
    };
  }
}

module.exports = AccesoEnlace;
