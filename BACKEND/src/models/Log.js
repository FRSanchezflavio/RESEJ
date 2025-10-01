const db = require('../config/database');

class Log {
  /**
   * Crear nuevo log de auditoría
   */
  static async create(logData) {
    const [log] = await db('logs_auditoria')
      .insert(logData)
      .returning('*');

    return log;
  }

  /**
   * Obtener todos los logs con paginación y filtros
   */
  static async findAll(filters = {}) {
    const {
      page = 1,
      limit = 50,
      usuario_id = null,
      accion = null,
      recurso_tipo = null,
      fecha_desde = null,
      fecha_hasta = null
    } = filters;

    const offset = (page - 1) * limit;

    let query = db('logs_auditoria as l')
      .leftJoin('usuarios as u', 'l.usuario_id', 'u.id')
      .select(
        'l.*',
        db.raw("json_build_object('id', u.id, 'usuario', u.usuario, 'nombre', u.nombre, 'apellido', u.apellido) as usuario_info")
      )
      .orderBy('l.fecha_hora', 'desc');

    // Aplicar filtros
    if (usuario_id) {
      query = query.where('l.usuario_id', usuario_id);
    }

    if (accion) {
      query = query.where('l.accion', accion);
    }

    if (recurso_tipo) {
      query = query.where('l.recurso_tipo', recurso_tipo);
    }

    if (fecha_desde) {
      query = query.where('l.fecha_hora', '>=', fecha_desde);
    }

    if (fecha_hasta) {
      query = query.where('l.fecha_hora', '<=', fecha_hasta);
    }

    const logs = await query
      .limit(limit)
      .offset(offset);

    // Count total con los mismos filtros
    let countQuery = db('logs_auditoria');
    if (usuario_id) countQuery = countQuery.where('usuario_id', usuario_id);
    if (accion) countQuery = countQuery.where('accion', accion);
    if (recurso_tipo) countQuery = countQuery.where('recurso_tipo', recurso_tipo);
    if (fecha_desde) countQuery = countQuery.where('fecha_hora', '>=', fecha_desde);
    if (fecha_hasta) countQuery = countQuery.where('fecha_hora', '<=', fecha_hasta);

    const [{ total }] = await countQuery.count('* as total');

    return {
      logs,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener logs de un usuario específico
   */
  static async findByUsuarioId(usuarioId, { page = 1, limit = 20 }) {
    return await this.findAll({ page, limit, usuario_id: usuarioId });
  }

  /**
   * Obtener acciones únicas para filtros
   */
  static async getAcciones() {
    const acciones = await db('logs_auditoria')
      .distinct('accion')
      .orderBy('accion');

    return acciones.map(a => a.accion);
  }

  /**
   * Obtener tipos de recursos únicos para filtros
   */
  static async getRecursoTipos() {
    const tipos = await db('logs_auditoria')
      .distinct('recurso_tipo')
      .whereNotNull('recurso_tipo')
      .orderBy('recurso_tipo');

    return tipos.map(t => t.recurso_tipo);
  }
}

module.exports = Log;
