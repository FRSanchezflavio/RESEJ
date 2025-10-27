const db = require('../config/database');
const crypto = require('crypto');

class EnlaceCompartido {
  /**
   * Crear un nuevo enlace compartido
   */
  static async crear(datos) {
    const {
      registro_id,
      creado_por,
      duracion_horas,
      max_accesos,
      descripcion,
      requiere_contrasena,
      contrasena,
    } = datos;

    // Validar datos
    if (!registro_id || !creado_por) {
      throw new Error('Faltan parámetros requeridos');
    }

    // Generar token único
    const token = crypto.randomUUID();

    // Calcular fecha de expiración
    let fecha_expiracion = null;
    if (duracion_horas) {
      const ahora = new Date();
      const ms = duracion_horas * 60 * 60 * 1000;
      fecha_expiracion = new Date(ahora.getTime() + ms);
    }

    try {
      const result = await db('enlaces_compartidos').insert({
        token,
        registro_id,
        creado_por,
        fecha_creacion: db.raw('CURRENT_TIMESTAMP'),
        fecha_expiracion,
        max_accesos: max_accesos || null,
        accesos_actuales: 0,
        activo: true,
      });

      return {
        id: result[0],
        token,
        registro_id,
        creado_por,
        fecha_expiracion,
        max_accesos,
        descripcion: descripcion || '',
      };
    } catch (error) {
      throw new Error(`Error al crear enlace: ${error.message}`);
    }
  }

  /**
   * Obtener todos los enlaces de un usuario
   */
  static async listarPorUsuario(usuarioId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const enlaces = await db('enlaces_compartidos')
        .where('creado_por', usuarioId)
        .select(
          'id',
          'token',
          'registro_id',
          'creado_por',
          'fecha_creacion',
          'fecha_expiracion',
          'max_accesos',
          'accesos_actuales',
          'activo'
        )
        .orderBy('fecha_creacion', 'desc')
        .limit(limit)
        .offset(offset);

      const total = await db('enlaces_compartidos')
        .where('creado_por', usuarioId)
        .count('* as total')
        .first();

      return {
        data: enlaces,
        total: total.total,
        page,
        limit,
        pages: Math.ceil(total.total / limit),
      };
    } catch (error) {
      throw new Error(`Error al listar enlaces: ${error.message}`);
    }
  }

  /**
   * Obtener enlace por ID
   */
  static async obtenerPorId(id) {
    try {
      const enlace = await db('enlaces_compartidos')
        .where('id', id)
        .select('*')
        .first();

      return enlace;
    } catch (error) {
      throw new Error(`Error al obtener enlace: ${error.message}`);
    }
  }

  /**
   * Obtener enlace público por token
   */
  static async obtenerPorToken(token) {
    try {
      const enlace = await db('enlaces_compartidos')
        .where('token', token)
        .where('activo', true)
        .select('*')
        .first();

      if (!enlace) {
        return null;
      }

      // Verificar si ha expirado
      if (
        enlace.fecha_expiracion &&
        new Date(enlace.fecha_expiracion) < new Date()
      ) {
        return null;
      }

      // Verificar si se alcanzó el máximo de accesos
      if (enlace.max_accesos && enlace.accesos_actuales >= enlace.max_accesos) {
        return null;
      }

      return enlace;
    } catch (error) {
      throw new Error(`Error al obtener enlace: ${error.message}`);
    }
  }

  /**
   * Actualizar enlace
   */
  static async actualizar(id, datos) {
    try {
      const actualizaciones = {};
      if (datos.max_accesos !== undefined)
        actualizaciones.max_accesos = datos.max_accesos;
      if (datos.fecha_expiracion !== undefined)
        actualizaciones.fecha_expiracion = datos.fecha_expiracion;
      if (datos.activo !== undefined) actualizaciones.activo = datos.activo;

      await db('enlaces_compartidos').where('id', id).update(actualizaciones);

      return this.obtenerPorId(id);
    } catch (error) {
      throw new Error(`Error al actualizar enlace: ${error.message}`);
    }
  }

  /**
   * Eliminar enlace
   */
  static async eliminar(id) {
    try {
      // Primero eliminar accesos
      await db('accesos_enlace').where('enlace_id', id).delete();

      // Luego eliminar enlace
      const result = await db('enlaces_compartidos').where('id', id).delete();

      return result > 0;
    } catch (error) {
      throw new Error(`Error al eliminar enlace: ${error.message}`);
    }
  }

  /**
   * Revocar acceso a enlace (deshabilitar)
   */
  static async revocar(id) {
    try {
      await db('enlaces_compartidos').where('id', id).update({ activo: false });

      return true;
    } catch (error) {
      throw new Error(`Error al revocar enlace: ${error.message}`);
    }
  }

  /**
   * Obtener accesos a un enlace
   */
  static async obtenerAccesos(enlaceId, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const accesos = await db('accesos_enlace')
        .where('enlace_id', enlaceId)
        .select('*')
        .orderBy('fecha_acceso', 'desc')
        .limit(limit)
        .offset(offset);

      const total = await db('accesos_enlace')
        .where('enlace_id', enlaceId)
        .count('* as total')
        .first();

      return {
        data: accesos,
        total: total.total,
        page,
        limit,
        pages: Math.ceil(total.total / limit),
      };
    } catch (error) {
      throw new Error(`Error al obtener accesos: ${error.message}`);
    }
  }

  /**
   * Registrar acceso a enlace
   */
  static async registrarAcceso(enlaceId, ipAddress, userAgent) {
    try {
      // Incrementar contador de accesos
      await db('enlaces_compartidos')
        .where('id', enlaceId)
        .increment('accesos_actuales', 1);

      const result = await db('accesos_enlace').insert({
        enlace_id: enlaceId,
        direccion_ip: ipAddress || '0.0.0.0',
        user_agent: userAgent || 'unknown',
        fecha_acceso: db.raw('CURRENT_TIMESTAMP'),
      });

      return result[0];
    } catch (error) {
      throw new Error(`Error al registrar acceso: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de un enlace
   */
  static async obtenerEstadisticas(enlaceId) {
    try {
      const enlace = await db('enlaces_compartidos')
        .where('id', enlaceId)
        .select(
          'accesos_actuales',
          'max_accesos',
          'fecha_creacion',
          'fecha_expiracion'
        )
        .first();

      if (!enlace) {
        throw new Error('Enlace no encontrado');
      }

      return {
        total_accesos: enlace.accesos_actuales || 0,
        max_accesos: enlace.max_accesos || null,
        fecha_creacion: enlace.fecha_creacion,
        fecha_expiracion: enlace.fecha_expiracion,
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }
}

module.exports = EnlaceCompartido;
