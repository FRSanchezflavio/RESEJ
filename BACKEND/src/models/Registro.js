const db = require('../config/database');

class Registro {
  /**
   * Buscar registro por ID con datos de persona
   */
  static async findById(id) {
    return await db('registros_secuestros as r')
      .leftJoin('personas_registradas as p', 'r.persona_id', 'p.id')
      .leftJoin('usuarios as u', 'r.usuario_carga', 'u.id')
      .select(
        'r.*',
        db.raw(
          "json_build_object('id', p.id, 'nombre', p.nombre, 'apellido', p.apellido, 'dni', p.dni, 'domicilio', p.domicilio, 'telefono', p.telefono, 'email', p.email) as persona"
        ),
        db.raw(
          "json_build_object('id', u.id, 'usuario', u.usuario, 'nombre', u.nombre, 'apellido', u.apellido) as usuario_carga_info"
        )
      )
      .where('r.id', id)
      .first();
  }

  /**
   * Obtener todos los registros con paginación y filtros
   */
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 10,
      estado_causa = null,
      fecha_desde = null,
      fecha_hasta = null,
    } = filters;

    const offset = (page - 1) * limit;

    let query = db('registros_secuestros as r')
      .leftJoin('personas_registradas as p', 'r.persona_id', 'p.id')
      .select(
        'r.*',
        db.raw("concat(p.nombre, ' ', p.apellido) as persona_nombre_completo"),
        'p.dni as persona_dni'
      )
      .orderBy('r.fecha_carga', 'desc');

    // Aplicar filtros
    if (estado_causa) {
      query = query.where('r.estado_causa', estado_causa);
    }

    if (fecha_desde) {
      query = query.where('r.fecha_ingreso', '>=', fecha_desde);
    }

    if (fecha_hasta) {
      query = query.where('r.fecha_ingreso', '<=', fecha_hasta);
    }

    const registros = await query.limit(limit).offset(offset);

    // Count total con los mismos filtros
    let countQuery = db('registros_secuestros');
    if (estado_causa)
      countQuery = countQuery.where('estado_causa', estado_causa);
    if (fecha_desde)
      countQuery = countQuery.where('fecha_ingreso', '>=', fecha_desde);
    if (fecha_hasta)
      countQuery = countQuery.where('fecha_ingreso', '<=', fecha_hasta);

    const [{ total }] = await countQuery.count('* as total');

    return {
      registros,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar registros por múltiples criterios
   */
  static async search(filters = {}) {
    const {
      termino = null,
      criterio = 'todos',
      page = 1,
      limit = 10,
      estado_causa = null,
      fecha_desde = null,
      fecha_hasta = null,
    } = filters;

    const offset = (page - 1) * limit;

    let query = db('registros_secuestros as r')
      .leftJoin('personas_registradas as p', 'r.persona_id', 'p.id')
      .select(
        'r.*',
        db.raw("concat(p.nombre, ' ', p.apellido) as persona_nombre_completo"),
        'p.dni as persona_dni'
      )
      .orderBy('r.fecha_carga', 'desc');

    // Aplicar búsqueda por término según criterio
    if (termino) {
      if (criterio === 'todos' || criterio === 'persona') {
        query = query.where(function () {
          this.where('p.nombre', 'ilike', `%${termino}%`)
            .orWhere('p.apellido', 'ilike', `%${termino}%`)
            .orWhere('p.dni', 'ilike', `%${termino}%`);
        });
      }

      if (criterio === 'todos' || criterio === 'legajo') {
        query = query.orWhere('r.numero_legajo', 'ilike', `%${termino}%`);
      }

      if (criterio === 'todos' || criterio === 'ufi') {
        query = query.orWhere('r.ufi', 'ilike', `%${termino}%`);
      }

      if (criterio === 'todos' || criterio === 'protocolo') {
        query = query.orWhere('r.numero_protocolo', 'ilike', `%${termino}%`);
      }
    }

    // Filtros adicionales
    if (estado_causa) {
      query = query.where('r.estado_causa', estado_causa);
    }

    if (fecha_desde) {
      query = query.where('r.fecha_ingreso', '>=', fecha_desde);
    }

    if (fecha_hasta) {
      query = query.where('r.fecha_ingreso', '<=', fecha_hasta);
    }

    const registros = await query.limit(limit).offset(offset);

    // Count total (simplificado para evitar complejidad)
    const [{ total }] = await db('registros_secuestros').count('* as total');

    return {
      registros,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Crear nuevo registro
   */
  static async create(registroData) {
    const [registro] = await db('registros_secuestros')
      .insert(registroData)
      .returning('*');

    return registro;
  }

  /**
   * Actualizar registro
   */
  static async update(id, registroData) {
    const [registro] = await db('registros_secuestros')
      .where({ id })
      .update(registroData)
      .returning('*');

    return registro;
  }

  /**
   * Eliminar registro
   */
  static async delete(id) {
    return await db('registros_secuestros').where({ id }).del();
  }

  /**
   * Obtener estadísticas de registros
   */
  static async getEstadisticas() {
    const [totalRegistros] = await db('registros_secuestros').count(
      '* as total'
    );
    const [registrosPorEstado] = await db('registros_secuestros')
      .select('estado_causa')
      .count('* as cantidad')
      .groupBy('estado_causa');

    return {
      total: parseInt(totalRegistros.total),
      porEstado: registrosPorEstado,
    };
  }
}

module.exports = Registro;
