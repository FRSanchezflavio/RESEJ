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
      query = query.where(function () {
        if (criterio === 'todos') {
          // Búsqueda en todos los campos
          this.where('p.nombre', 'ilike', `%${termino}%`)
            .orWhere('p.apellido', 'ilike', `%${termino}%`)
            .orWhere('p.dni', 'ilike', `%${termino}%`)
            .orWhere('r.numero_legajo', 'ilike', `%${termino}%`)
            .orWhere('r.ufi', 'ilike', `%${termino}%`)
            .orWhere('r.numero_protocolo', 'ilike', `%${termino}%`)
            .orWhere('r.numero_causa', 'ilike', `%${termino}%`)
            .orWhere('r.detalle_secuestro', 'ilike', `%${termino}%`)
            .orWhere('r.cadena_custodia', 'ilike', `%${termino}%`)
            .orWhere('r.of_a_cargo', 'ilike', `%${termino}%`)
            .orWhere('r.estado_secuestro', 'ilike', `%${termino}%`)
            .orWhere('r.lugar_deposito', 'ilike', `%${termino}%`)
            .orWhere('r.caratula', 'ilike', `%${termino}%`)
            .orWhere('r.victima', 'ilike', `%${termino}%`)
            .orWhere('r.imputado_causante', 'ilike', `%${termino}%`)
            .orWhere('r.denunciante', 'ilike', `%${termino}%`);
        } else if (criterio === 'persona') {
          this.where('p.nombre', 'ilike', `%${termino}%`).orWhere(
            'p.apellido',
            'ilike',
            `%${termino}%`
          );
        } else if (criterio === 'dni') {
          this.where('p.dni', 'ilike', `%${termino}%`);
        } else if (criterio === 'legajo') {
          this.where('r.numero_legajo', 'ilike', `%${termino}%`);
        } else if (criterio === 'causa') {
          this.where('r.numero_causa', 'ilike', `%${termino}%`);
        } else if (criterio === 'ufi') {
          this.where('r.ufi', 'ilike', `%${termino}%`);
        } else if (criterio === 'protocolo') {
          this.where('r.numero_protocolo', 'ilike', `%${termino}%`);
        } else if (criterio === 'cadena_custodia') {
          this.where('r.cadena_custodia', 'ilike', `%${termino}%`);
        } else if (criterio === 'detalle') {
          this.where('r.detalle_secuestro', 'ilike', `%${termino}%`);
        } else if (criterio === 'oficial') {
          this.where('r.of_a_cargo', 'ilike', `%${termino}%`);
        } else if (criterio === 'caratula') {
          this.where('r.caratula', 'ilike', `%${termino}%`);
        } else if (criterio === 'victima') {
          this.where('r.victima', 'ilike', `%${termino}%`);
        } else if (criterio === 'imputado') {
          this.where('r.imputado_causante', 'ilike', `%${termino}%`);
        } else if (criterio === 'denunciante') {
          this.where('r.denunciante', 'ilike', `%${termino}%`);
        }
      });
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
