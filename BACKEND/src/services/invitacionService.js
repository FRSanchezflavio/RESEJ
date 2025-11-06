const crypto = require('crypto');
const InvitacionUsuario = require('../models/InvitacionUsuario');
const Usuario = require('../models/Usuario');

class InvitacionService {
  /**
   * Generar token único para invitación
   */
  static generateToken() {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Crear una nueva invitación
   */
  static async createInvitation(data, usuarioCreadorId) {
    const { email, nombre_completo, rol, duracion_horas } = data;

    // Verificar si ya existe una invitación pendiente
    const invitacionPendiente = await InvitacionUsuario.findByEmail(email);
    if (invitacionPendiente && !invitacionPendiente.usado) {
      const ahora = new Date();
      const expiracion = new Date(invitacionPendiente.fecha_expiracion);
      if (expiracion > ahora) {
        throw new Error('Ya existe una invitación pendiente para este email');
      }
    }

    // Generar token único
    const token = this.generateToken();

    // Calcular fecha de expiración
    const fechaExpiracion = new Date();
    fechaExpiracion.setHours(
      fechaExpiracion.getHours() + (duracion_horas || 48)
    );

    // Crear invitación
    const invitacion = await InvitacionUsuario.create({
      email,
      nombre_completo,
      rol: rol || 'usuario_consulta',
      token,
      usuario_creador_id: usuarioCreadorId,
      fecha_expiracion: fechaExpiracion,
    });

    return {
      invitacion,
      url: `${
        process.env.FRONTEND_URL || 'http://localhost:5173'
      }/registro/${token}`,
    };
  }

  /**
   * Validar token de invitación
   */
  static async validateInvitation(token) {
    const invitacion = await InvitacionUsuario.findByToken(token);

    if (!invitacion) {
      return { valid: false, error: 'Invitación no encontrada' };
    }

    if (invitacion.usado) {
      return { valid: false, error: 'Esta invitación ya ha sido utilizada' };
    }

    const ahora = new Date();
    const expiracion = new Date(invitacion.fecha_expiracion);
    if (expiracion < ahora) {
      return { valid: false, error: 'Esta invitación ha expirado' };
    }

    return {
      valid: true,
      invitacion: {
        email: invitacion.email,
        nombre_completo: invitacion.nombre_completo,
        rol: invitacion.rol,
      },
    };
  }

  /**
   * Aceptar invitación y crear usuario
   */
  static async acceptInvitation(token, userData) {
    // Validar invitación
    const validation = await this.validateInvitation(token);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const invitacion = await InvitacionUsuario.findByToken(token);

    // Verificar si el username ya existe
    const usuarioExistente = await Usuario.findByUsername(userData.username);
    if (usuarioExistente) {
      throw new Error('Este nombre de usuario ya está en uso');
    }

    // Crear usuario (Usuario.create hashea automáticamente la contraseña)
    const nuevoUsuario = await Usuario.create({
      usuario: userData.username,
      password: userData.password,
      nombre:
        invitacion.nombre_completo.split(' ')[0] || invitacion.nombre_completo,
      apellido: invitacion.nombre_completo.split(' ').slice(1).join(' ') || '',
      rol: invitacion.rol,
      activo: true,
    });

    // Marcar invitación como usada
    await InvitacionUsuario.markAsUsed(token, nuevoUsuario.id);

    return nuevoUsuario;
  }

  /**
   * Obtener todas las invitaciones
   */
  static async getAllInvitations(filters) {
    return await InvitacionUsuario.findAll(filters);
  }

  /**
   * Limpiar invitaciones expiradas
   */
  static async cleanupExpired() {
    return await InvitacionUsuario.deleteExpired();
  }
}

module.exports = InvitacionService;
