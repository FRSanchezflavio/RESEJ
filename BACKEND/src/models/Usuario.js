const db = require('../config/database');
const { hashPassword } = require('../utils/helpers');

class Usuario {
  /**
   * Buscar usuario por nombre de usuario
   */
  static async findByUsername(usuario) {
    return await db('usuarios')
      .where({ usuario })
      .first();
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id) {
    return await db('usuarios')
      .where({ id })
      .first();
  }

  /**
   * Obtener todos los usuarios con paginación
   */
  static async findAll({ page = 1, limit = 10, activo = null }) {
    const offset = (page - 1) * limit;
    
    let query = db('usuarios')
      .select('id', 'usuario', 'nombre', 'apellido', 'rol', 'activo', 'fecha_creacion', 'ultimo_acceso')
      .orderBy('fecha_creacion', 'desc');

    if (activo !== null) {
      query = query.where({ activo });
    }

    const usuarios = await query
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('usuarios').count('* as total');

    return {
      usuarios,
      pagination: {
        page,
        limit,
        total: parseInt(total),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Crear nuevo usuario
   */
  static async create(usuarioData) {
    const { password, ...rest } = usuarioData;
    const password_hash = await hashPassword(password);

    const [usuario] = await db('usuarios')
      .insert({
        ...rest,
        password_hash
      })
      .returning('*');

    return usuario;
  }

  /**
   * Actualizar usuario
   */
  static async update(id, usuarioData) {
    const { password, ...rest } = usuarioData;
    const updateData = { ...rest };

    // Solo actualizar password si se proporciona
    if (password) {
      updateData.password_hash = await hashPassword(password);
    }

    const [usuario] = await db('usuarios')
      .where({ id })
      .update(updateData)
      .returning('*');

    return usuario;
  }

  /**
   * Desactivar usuario (soft delete)
   */
  static async deactivate(id) {
    const [usuario] = await db('usuarios')
      .where({ id })
      .update({ activo: false })
      .returning('*');

    return usuario;
  }

  /**
   * Activar usuario
   */
  static async activate(id) {
    const [usuario] = await db('usuarios')
      .where({ id })
      .update({ activo: true })
      .returning('*');

    return usuario;
  }

  /**
   * Actualizar último acceso
   */
  static async updateLastAccess(id) {
    await db('usuarios')
      .where({ id })
      .update({ ultimo_acceso: db.fn.now() });
  }

  /**
   * Resetear contraseña
   */
  static async resetPassword(id, newPassword) {
    const password_hash = await hashPassword(newPassword);
    
    const [usuario] = await db('usuarios')
      .where({ id })
      .update({ password_hash })
      .returning('*');

    return usuario;
  }

  /**
   * Obtener historial de accesos desde logs
   */
  static async getAccessHistory(id, { page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;

    const logs = await db('logs_auditoria')
      .where({ usuario_id: id, accion: 'LOGIN' })
      .orderBy('fecha_hora', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('logs_auditoria')
      .where({ usuario_id: id, accion: 'LOGIN' })
      .count('* as total');

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
}

module.exports = Usuario;
