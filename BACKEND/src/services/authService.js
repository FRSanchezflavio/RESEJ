const db = require('../config/database');
const Usuario = require('../models/Usuario');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiration,
} = require('../config/jwt');
const { comparePassword, formatUsuario } = require('../utils/helpers');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Login de usuario
   */
  static async login(usuario, password, ipAddress) {
    try {
      // Buscar usuario con sus permisos de rol
      const user = await db('usuarios')
        .select(
          'usuarios.*',
          'roles.nombre as rol_nombre',
          'roles.puede_crear',
          'roles.puede_editar',
          'roles.puede_eliminar',
          'roles.puede_consultar'
        )
        .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
        .where('usuarios.usuario', usuario)
        .first();

      if (!user) {
        logger.warn(
          `Intento de login fallido: usuario no encontrado - ${usuario}`
        );
        throw new Error('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        logger.warn(`Intento de login de usuario inactivo - ${usuario}`);
        throw new Error('Usuario inactivo. Contacte al administrador');
      }

      // Verificar contraseña
      const passwordMatch = await comparePassword(password, user.password_hash);

      if (!passwordMatch) {
        logger.warn(
          `Intento de login fallido: contraseña incorrecta - ${usuario}`
        );
        throw new Error('Credenciales inválidas');
      }

      // Crear objeto de permisos
      const permisos = {
        puede_crear: user.puede_crear || false,
        puede_editar: user.puede_editar || false,
        puede_eliminar: user.puede_eliminar || false,
        puede_consultar: user.puede_consultar || false,
        rol: user.rol_nombre || 'sin_rol',
      };

      // Generar tokens con permisos incluidos
      const payload = {
        userId: user.id,
        usuario: user.usuario,
        rol: user.rol_nombre || user.rol || 'sin_rol', // Usar rol_nombre de la relación con la tabla roles
        rolNombre: user.rol_nombre,
        nombreCompleto: `${user.nombre} ${user.apellido}`,
        permisos: permisos,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken({ userId: user.id });

      // Guardar refresh token en la base de datos
      await db('refresh_tokens').insert({
        usuario_id: user.id,
        token: refreshToken,
        fecha_expiracion: getRefreshTokenExpiration(),
        ip_address: ipAddress,
      });

      // Actualizar último acceso
      await Usuario.updateLastAccess(user.id);

      // Registrar login en auditoría
      await db('logs_auditoria').insert({
        usuario_id: user.id,
        accion: 'LOGIN',
        recurso_tipo: 'autenticacion',
        detalles: JSON.stringify({
          usuario: user.usuario,
          rol: user.rol_nombre,
        }),
        ip_address: ipAddress,
      });

      logger.info(
        `Login exitoso: ${usuario} (${user.rol_nombre}) desde ${ipAddress}`
      );

      return {
        accessToken,
        refreshToken,
        usuario: {
          ...formatUsuario(user),
          rol_nombre: user.rol_nombre,
        },
        permisos: permisos,
      };
    } catch (error) {
      logger.error(`Error en login: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refrescar access token usando refresh token
   */
  static async refreshAccessToken(refreshToken, ipAddress) {
    try {
      // Verificar refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Verificar que el token existe en la base de datos y no está revocado
      const tokenRecord = await db('refresh_tokens')
        .where({ token: refreshToken, revocado: false })
        .first();

      if (!tokenRecord) {
        logger.warn('Intento de uso de refresh token inválido o revocado');
        throw new Error('Refresh token inválido o revocado');
      }

      // Verificar que no esté expirado
      if (new Date(tokenRecord.fecha_expiracion) < new Date()) {
        logger.warn('Intento de uso de refresh token expirado');
        throw new Error('Refresh token expirado');
      }

      // Obtener usuario con sus permisos de rol
      const user = await db('usuarios')
        .select(
          'usuarios.*',
          'roles.nombre as rol_nombre',
          'roles.puede_crear',
          'roles.puede_editar',
          'roles.puede_eliminar',
          'roles.puede_consultar'
        )
        .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
        .where('usuarios.id', decoded.userId)
        .first();

      if (!user || !user.activo) {
        throw new Error('Usuario no encontrado o inactivo');
      }

      // Crear objeto de permisos
      const permisos = {
        puede_crear: user.puede_crear || false,
        puede_editar: user.puede_editar || false,
        puede_eliminar: user.puede_eliminar || false,
        puede_consultar: user.puede_consultar || false,
        rol: user.rol_nombre || 'sin_rol',
      };

      // Generar nuevo access token con permisos
      const payload = {
        userId: user.id,
        usuario: user.usuario,
        rol: user.rol_nombre || user.rol || 'sin_rol', // Usar rol_nombre de la relación con la tabla roles
        rolNombre: user.rol_nombre,
        nombreCompleto: `${user.nombre} ${user.apellido}`,
        permisos: permisos,
      };

      const newAccessToken = generateAccessToken(payload);

      logger.info(`Access token refrescado para usuario: ${user.usuario}`);

      return {
        accessToken: newAccessToken,
        usuario: {
          ...formatUsuario(user),
          rol_nombre: user.rol_nombre,
        },
        permisos: permisos,
      };
    } catch (error) {
      logger.error(`Error al refrescar token: ${error.message}`);
      throw error;
    }
  }

  /**
   * Logout - revocar refresh token
   */
  static async logout(refreshToken, ipAddress) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token no proporcionado');
      }

      // Revocar el token
      const result = await db('refresh_tokens')
        .where({ token: refreshToken })
        .update({ revocado: true });

      if (result > 0) {
        logger.info(`Refresh token revocado exitosamente desde ${ipAddress}`);
        return { message: 'Sesión cerrada exitosamente' };
      } else {
        logger.warn('Intento de revocar token no encontrado');
        return { message: 'Token no encontrado' };
      }
    } catch (error) {
      logger.error(`Error en logout: ${error.message}`);
      throw error;
    }
  }

  /**
   * Revocar todos los refresh tokens de un usuario
   */
  static async revokeAllUserTokens(usuarioId) {
    try {
      await db('refresh_tokens')
        .where({ usuario_id: usuarioId })
        .update({ revocado: true });

      logger.info(
        `Todos los tokens del usuario ${usuarioId} han sido revocados`
      );
      return { message: 'Todas las sesiones cerradas exitosamente' };
    } catch (error) {
      logger.error(`Error al revocar tokens: ${error.message}`);
      throw error;
    }
  }

  /**
   * Limpiar tokens expirados (tarea de mantenimiento)
   */
  static async cleanExpiredTokens() {
    try {
      const deleted = await db('refresh_tokens')
        .where('fecha_expiracion', '<', new Date())
        .del();

      logger.info(`Tokens expirados limpiados: ${deleted}`);
      return { deleted };
    } catch (error) {
      logger.error(`Error al limpiar tokens expirados: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validar contraseña del usuario
   */
  static async validatePassword(userId, password) {
    try {
      const user = await Usuario.findById(userId);

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      const passwordMatch = await comparePassword(password, user.password_hash);

      logger.info(
        `Validación de contraseña para usuario: ${user.usuario} - ${
          passwordMatch ? 'exitosa' : 'fallida'
        }`
      );

      return passwordMatch;
    } catch (error) {
      logger.error(`Error al validar contraseña: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AuthService;
