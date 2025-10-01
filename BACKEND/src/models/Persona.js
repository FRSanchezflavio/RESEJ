const db = require('../config/database');

class Persona {
  /**
   * Buscar persona por ID
   */
  static async findById(id) {
    return await db('personas_registradas')
      .where({ id })
      .first();
  }

  /**
   * Buscar persona por DNI
   */
  static async findByDni(dni) {
    return await db('personas_registradas')
      .where({ dni })
      .first();
  }

  /**
   * Obtener todas las personas con paginación
   */
  static async findAll({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const personas = await db('personas_registradas')
      .select('*')
      .orderBy('fecha_registro', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('personas_registradas').count('* as total');

    return {
      personas,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Buscar personas por término (nombre, apellido, DNI)
   */
  static async search(termino, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    const personas = await db('personas_registradas')
      .where('nombre', 'ilike', `%${termino}%`)
      .orWhere('apellido', 'ilike', `%${termino}%`)
      .orWhere('dni', 'ilike', `%${termino}%`)
      .orderBy('fecha_registro', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('personas_registradas')
      .where('nombre', 'ilike', `%${termino}%`)
      .orWhere('apellido', 'ilike', `%${termino}%`)
      .orWhere('dni', 'ilike', `%${termino}%`)
      .count('* as total');

    return {
      personas,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Crear nueva persona
   */
  static async create(personaData) {
    const [persona] = await db('personas_registradas')
      .insert(personaData)
      .returning('*');

    return persona;
  }

  /**
   * Actualizar persona
   */
  static async update(id, personaData) {
    const [persona] = await db('personas_registradas')
      .where({ id })
      .update(personaData)
      .returning('*');

    return persona;
  }

  /**
   * Eliminar persona
   */
  static async delete(id) {
    return await db('personas_registradas')
      .where({ id })
      .del();
  }

  /**
   * Verificar si una persona tiene registros asociados
   */
  static async hasRegistros(id) {
    const [{ count }] = await db('registros_secuestros')
      .where({ persona_id: id })
      .count('* as count');

    return parseInt(count) > 0;
  }
}

module.exports = Persona;
