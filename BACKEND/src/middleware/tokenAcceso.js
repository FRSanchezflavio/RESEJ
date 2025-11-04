const crypto = require('crypto');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

/**
 * Genera un token temporal único para acceso
 */
const generarTokenTemporal = async (usuarioId, generadoPor) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + 24);

    await db('tokens_acceso_temporal').insert({
      usuario_id: usuarioId,
      token: token,
      fecha_expiracion: fechaExpiracion,
      generado_por: generadoPor,
    });

    return {
      token,
      fecha_expiracion: fechaExpiracion,
    };
  } catch (error) {
    console.error('Error al generar token temporal:', error);
    throw error;
  }
};

/**
 * Valida un token temporal de acceso
 */
const validarTokenTemporal = async (token, ipCliente) => {
  try {
    const tokenData = await db('tokens_acceso_temporal')
      .join('usuarios', 'tokens_acceso_temporal.usuario_id', 'usuarios.id')
      .join('roles', 'usuarios.rol_id', 'roles.id')
      .where('tokens_acceso_temporal.token', token)
      .select(
        'tokens_acceso_temporal.*',
        'usuarios.usuario as username',
        'usuarios.nombre',
        'usuarios.apellido',
        'usuarios.email',
        'usuarios.activo',
        'roles.nombre as rol',
        'roles.puede_crear',
        'roles.puede_editar',
        'roles.puede_eliminar',
        'roles.puede_consultar'
      )
      .first();

    if (!tokenData) {
      return {
        valido: false,
        mensaje: 'Token no encontrado',
      };
    }

    // Verificar si el usuario está activo
    if (!tokenData.activo) {
      return {
        valido: false,
        mensaje: 'El usuario no está activo',
      };
    }

    // Verificar si ya fue usado
    if (tokenData.usado) {
      return {
        valido: false,
        mensaje: 'Este enlace ya fue utilizado',
      };
    }

    // Verificar expiración
    const ahora = new Date();
    const expiracion = new Date(tokenData.fecha_expiracion);

    if (ahora > expiracion) {
      return {
        valido: false,
        mensaje: 'Este enlace ha expirado',
      };
    }

    // Marcar token como usado
    await db('tokens_acceso_temporal').where('token', token).update({
      usado: true,
      ip_uso: ipCliente,
      fecha_uso: db.fn.now(),
    });

    return {
      valido: true,
      usuario: {
        id: tokenData.usuario_id,
        username: tokenData.username,
        nombre: tokenData.nombre,
        apellido: tokenData.apellido,
        email: tokenData.email,
        rol: tokenData.rol,
        permisos: {
          puede_crear: tokenData.puede_crear,
          puede_editar: tokenData.puede_editar,
          puede_eliminar: tokenData.puede_eliminar,
          puede_consultar: tokenData.puede_consultar,
        },
      },
    };
  } catch (error) {
    console.error('Error al validar token temporal:', error);
    throw error;
  }
};

/**
 * Limpia tokens expirados (ejecutar periódicamente)
 */
const limpiarTokensExpirados = async () => {
  try {
    const ahora = new Date();
    const resultado = await db('tokens_acceso_temporal')
      .where('fecha_expiracion', '<', ahora)
      .orWhere(function () {
        this.where('usado', true).where(
          'fecha_uso',
          '<',
          db.raw("NOW() - INTERVAL '7 days'")
        );
      })
      .del();

    console.log(`🗑️  Tokens limpiados: ${resultado}`);
    return resultado;
  } catch (error) {
    console.error('Error al limpiar tokens expirados:', error);
    throw error;
  }
};

/**
 * Invalida todos los tokens de un usuario
 */
const invalidarTokensUsuario = async usuarioId => {
  try {
    const resultado = await db('tokens_acceso_temporal')
      .where('usuario_id', usuarioId)
      .where('usado', false)
      .update({
        usado: true,
        fecha_uso: db.fn.now(),
      });

    console.log(
      `🔒 Tokens invalidados para usuario ${usuarioId}: ${resultado}`
    );
    return resultado;
  } catch (error) {
    console.error('Error al invalidar tokens de usuario:', error);
    throw error;
  }
};

module.exports = {
  generarTokenTemporal,
  validarTokenTemporal,
  limpiarTokensExpirados,
  invalidarTokensUsuario,
};
