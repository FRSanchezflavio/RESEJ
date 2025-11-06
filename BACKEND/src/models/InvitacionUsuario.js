const knex = require('../config/database');

class InvitacionUsuario {
  /**
   * Crear una nueva invitación
   */
  static async create(data) {
    const [invitacion] = await knex('invitaciones_usuarios')
      .insert(data)
      .returning('*');
    return invitacion;
  }

  /**
   * Buscar invitación por token
   */
  static async findByToken(token) {
    const invitacion = await knex('invitaciones_usuarios')
      .where({ token })
      .first();
    return invitacion;
  }

  /**
   * Buscar invitación por email
   */
  static async findByEmail(email) {
    const invitacion = await knex('invitaciones_usuarios')
      .where({ email })
      .orderBy('fecha_creacion', 'desc')
      .first();
    return invitacion;
  }

  /**
   * Marcar invitación como usada
   */
  static async markAsUsed(token, usuarioCreadoId) {
    const [invitacion] = await knex('invitaciones_usuarios')
      .where({ token })
      .update({
        usado: true,
        usuario_creado_id: usuarioCreadoId,
        fecha_uso: knex.fn.now(),
      })
      .returning('*');
    return invitacion;
  }

  /**
   * Obtener todas las invitaciones
   */
  static async findAll(filters = {}) {
    let query = knex('invitaciones_usuarios')
      .select(
        'invitaciones_usuarios.*',
        'usuarios.nombre as nombre_creador',
        'usuarios.apellido as apellido_creador'
      )
      .leftJoin(
        'usuarios',
        'invitaciones_usuarios.usuario_creador_id',
        'usuarios.id'
      )
      .orderBy('fecha_creacion', 'desc');

    if (filters.usado !== undefined) {
      query = query.where('invitaciones_usuarios.usado', filters.usado);
    }

    if (filters.email) {
      query = query.where(
        'invitaciones_usuarios.email',
        'ilike',
        `%${filters.email}%`
      );
    }

    return await query;
  }

  /**
   * Eliminar invitaciones expiradas
   */
  static async deleteExpired() {
    const result = await knex('invitaciones_usuarios')
      .where('fecha_expiracion', '<', knex.fn.now())
      .where('usado', false)
      .delete();
    return result;
  }

  /**
   * Obtener invitación por ID
   */
  static async findById(id) {
    const invitacion = await knex('invitaciones_usuarios')
      .where({ id })
      .first();
    return invitacion;
  }
}

module.exports = InvitacionUsuario;
