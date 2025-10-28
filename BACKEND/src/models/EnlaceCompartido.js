const db = require('../config/database');

class EnlaceCompartido {
  static async create(data) {
    const [enlace] = await db('enlaces_compartidos')
      .insert(data)
      .returning('*');
    return enlace;
  }

  static async findByToken(token) {
    return db('enlaces_compartidos').where({ token }).first();
  }

  static async findById(id) {
    return db('enlaces_compartidos').where({ id }).first();
  }

  static async findAll({
    page = 1,
    limit = 10,
    usuarioId = null,
    includeRevoked = true,
  } = {}) {
    const offset = (page - 1) * limit;

    const baseQuery = db('enlaces_compartidos').orderBy(
      'fecha_creacion',
      'desc'
    );

    if (!includeRevoked) {
      baseQuery.where({ revocado: false });
    }

    if (usuarioId) {
      baseQuery.andWhere('usuario_creador_id', usuarioId);
    }

    const enlaces = await baseQuery.clone().limit(limit).offset(offset);

    const countQuery = db('enlaces_compartidos').count('* as total');

    if (!includeRevoked) {
      countQuery.where({ revocado: false });
    }

    if (usuarioId) {
      countQuery.andWhere('usuario_creador_id', usuarioId);
    }

    const [{ total }] = await countQuery;

    return {
      enlaces,
      pagination: {
        page,
        limit,
        total: Number(total) || 0,
        totalPages: Math.max(Math.ceil((Number(total) || 0) / limit), 1),
      },
    };
  }

  static async updateByToken(token, data) {
    const [enlace] = await db('enlaces_compartidos')
      .where({ token })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return enlace;
  }

  static async incrementarAcceso(id) {
    const [enlace] = await db('enlaces_compartidos')
      .where({ id })
      .update({
        accesos: db.raw('accesos + 1'),
        ultimo_acceso: db.fn.now(),
        updated_at: db.fn.now(),
      })
      .returning('*');
    return enlace;
  }

  static async deleteById(id) {
    return db('enlaces_compartidos').where({ id }).del();
  }
}

module.exports = EnlaceCompartido;
