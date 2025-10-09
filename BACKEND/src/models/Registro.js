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
    // Mapear correctamente los campos del formulario
    const dataToInsert = {
      persona_id: registroData.persona_id,
      fecha_ingreso: registroData.fecha_ingreso,
      ufi: registroData.ufi || null,
      numero_legajo: registroData.numero_legajo || null,
      seccion_que_interviene: registroData.seccion_que_interviene,
      detalle_secuestro: registroData.detalle_secuestro,
      numero_protocolo: registroData.numero_protocolo || null,
      cadena_custodia: registroData.cadena_custodia || null,
      nro_folio: registroData.nro_folio || null,
      nro_libro_secuestro: registroData.nro_libro_secuestro || null,
      of_a_cargo: registroData.of_a_cargo || null,
      observaciones: registroData.observaciones || null,
      usuario_carga: registroData.usuario_carga || null,
      // Campos heredados opcionales
      tipo_delito: registroData.tipo_delito || null,
      fecha_delito: registroData.fecha_delito || null,
      lugar_delito: registroData.lugar_delito || null,
      descripcion: registroData.descripcion || null,
      estado_causa: registroData.estado_causa || 'en_proceso',
      numero_causa: registroData.numero_causa || null,
      juzgado: registroData.juzgado || null,
      tramite: registroData.tramite || null
    };

    const [registro] = await db('registros_secuestros')
      .insert(dataToInsert)
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
