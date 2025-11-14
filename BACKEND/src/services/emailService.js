/**
 * Servicio de envío de emails
 * Nota: Esta es una implementación básica. Para producción, configurar con nodemailer
 * o un servicio de email como SendGrid, AWS SES, etc.
 */

const enviarCredencialesNuevoUsuario = async (email, usuario, password) => {
  try {
    console.log('📧 Enviando credenciales a:', email);
    console.log('Usuario:', usuario);
    
    // TODO: Implementar envío real de email
    // Por ahora solo registramos en consola
    console.log(`
    ====================================
    CREDENCIALES DE NUEVO USUARIO
    ====================================
    Para: ${email}
    Usuario: ${usuario}
    Contraseña: ${password}
    
    Instrucciones:
    1. Acceda al sistema con estas credenciales
    2. Se recomienda cambiar la contraseña al primer ingreso
    ====================================
    `);
    
    return {
      success: true,
      message: 'Email simulado enviado (implementar servicio real)'
    };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return {
      success: false,
      message: 'Error al enviar email',
      error: error.message
    };
  }
};

module.exports = {
  enviarCredencialesNuevoUsuario
};
