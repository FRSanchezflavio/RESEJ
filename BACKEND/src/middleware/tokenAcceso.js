const crypto = require('crypto');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

/**
 * Genera un token temporal de acceso para un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {number} creadoPor - ID del administrador que crea el token
 * @returns {Promise<Object>} Token y fecha de expiración
 */
async function generarTokenTemporal(usuarioId, creadoPor) {
  try {
    // Generar token aleatorio seguro
    const token = crypto.randomBytes(32).toString('hex');

    // Calcular fecha de expiración (24 horas por defecto)
    const horasValidez = parseInt(process.env.TOKEN_ACCESO_HORAS || '24');
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(fechaExpiracion.getHours() + horasValidez);

    // Guardar en la base de datos
    await db('tokens_acceso_temporal').insert({
      token,
      usuario_id: usuarioId,
      creado_por: creadoPor,
      fecha_expiracion: fechaExpiracion,
      usado: false,
      ip_creacion: null, // Se puede agregar si se necesita
    });

    console.log(`✅ Token temporal generado para usuario ${usuarioId}`);
    console.log(`⏰ Válido hasta: ${fechaExpiracion.toISOString()}`);

    return {
      token,
      fecha_expiracion: fechaExpiracion,
    };
  } catch (error) {
    console.error('❌ Error al generar token temporal:', error);
    throw new Error('Error al generar token de acceso temporal');
  }
}

/**
 * Valida un token temporal y retorna los datos del usuario con JWT
 * @param {string} token - Token temporal a validar
 * @param {string} ipCliente - IP del cliente que está usando el token
 * @returns {Promise<Object>} Resultado de la validación con JWT
 */
async function validarTokenTemporal(token, ipCliente) {
  try {
    // Buscar el token en la base de datos con información del usuario
    const [tokenData] = await db('tokens_acceso_temporal as tat')
      .select(
        'tat.*',
        'u.id as usuario_id',
        'u.usuario as username',
        'u.nombre',
        'u.apellido',
        'u.email',
        'u.rol_id',
        'r.nombre as rol_nombre',
        'r.puede_crear',
        'r.puede_editar',
        'r.puede_eliminar',
        'r.puede_consultar'
      )
      .leftJoin('usuarios as u', 'tat.usuario_id', 'u.id')
      .leftJoin('roles as r', 'u.rol_id', 'r.id')
      .where('tat.token', token)
      .andWhere('u.activo', true);

    if (!tokenData) {
      console.log('❌ Token no encontrado o usuario inactivo');
      return {
        success: false,
        error: 'Token inválido o expirado',
      };
    }

    // Verificar si el token ya fue usado
    if (tokenData.usado) {
      console.log('❌ Token ya fue utilizado anteriormente');
      return {
        success: false,
        error: 'Este token ya fue utilizado',
      };
    }

    // Verificar si el token expiró
    const ahora = new Date();
    const fechaExpiracion = new Date(tokenData.fecha_expiracion);
    if (ahora > fechaExpiracion) {
      console.log('❌ Token expirado');
      return {
        success: false,
        error: 'Token expirado',
      };
    }

    // Marcar el token como usado
    await db('tokens_acceso_temporal')
      .where('id', tokenData.id)
      .update({
        usado: true,
        ip_uso: ipCliente,
        fecha_uso: new Date(),
      });

    // Generar JWT permanente para el usuario
    const payload = {
      userId: tokenData.usuario_id,
      usuario: tokenData.username,
      rol: tokenData.rol_nombre,
      rolNombre: tokenData.rol_nombre,
      permisos: {
        puede_crear: tokenData.puede_crear,
        puede_editar: tokenData.puede_editar,
        puede_eliminar: tokenData.puede_eliminar,
        puede_consultar: tokenData.puede_consultar,
      },
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    console.log('✅ Token temporal validado exitosamente');
    console.log(`👤 Usuario: ${tokenData.username} (${tokenData.rol_nombre})`);

    return {
      success: true,
      token: jwtToken,
      user: {
        id: tokenData.usuario_id,
        usuario: tokenData.username,
        nombre: tokenData.nombre,
        apellido: tokenData.apellido,
        email: tokenData.email,
        rol: tokenData.rol_nombre,
        permisos: {
          puede_crear: tokenData.puede_crear,
          puede_editar: tokenData.puede_editar,
          puede_eliminar: tokenData.puede_eliminar,
          puede_consultar: tokenData.puede_consultar,
        },
      },
    };
  } catch (error) {
    console.error('❌ Error al validar token temporal:', error);
    return {
      success: false,
      error: 'Error al validar el token',
    };
  }
}

/**
 * Limpia tokens temporales expirados (para ejecutar periódicamente)
 * @returns {Promise<number>} Cantidad de tokens eliminados
 */
async function limpiarTokensExpirados() {
  try {
    const ahora = new Date();
    const eliminados = await db('tokens_acceso_temporal')
      .where('fecha_expiracion', '<', ahora)
      .del();

    if (eliminados > 0) {
      console.log(`🧹 Tokens expirados eliminados: ${eliminados}`);
    }

    return eliminados;
  } catch (error) {
    console.error('❌ Error al limpiar tokens expirados:', error);
    return 0;
  }
}

/**
 * Invalida todos los tokens temporales de un usuario
 * @param {number} usuarioId - ID del usuario
 * @returns {Promise<number>} Cantidad de tokens invalidados
 */
async function invalidarTokensUsuario(usuarioId) {
  try {
    const actualizados = await db('tokens_acceso_temporal')
      .where('usuario_id', usuarioId)
      .andWhere('usado', false)
      .update({ usado: true });

    console.log(`🔒 Tokens invalidados para usuario ${usuarioId}: ${actualizados}`);
    return actualizados;
  } catch (error) {
    console.error('❌ Error al invalidar tokens:', error);
    return 0;
  }
}

module.exports = {
  generarTokenTemporal,
  validarTokenTemporal,
  limpiarTokensExpirados,
  invalidarTokensUsuario,
};
