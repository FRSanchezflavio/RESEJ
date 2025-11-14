const nodemailer = require('nodemailer');

/**
 * Configuración del transporte de email
 * Lee las variables de entorno para configurar el servicio SMTP
 */
const crearTransportador = () => {
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  // Si no hay configuración de email, retornar null
  if (!config.auth.user || !config.auth.pass) {
    console.warn('⚠️  Configuración de email incompleta. Los emails no se enviarán.');
    return null;
  }

  return nodemailer.createTransport(config);
};

/**
 * Envía un email con las credenciales a un nuevo usuario
 * @param {Object} datos - Datos del usuario y credenciales
 * @param {string} datos.email - Email del destinatario
 * @param {string} datos.nombre - Nombre del usuario
 * @param {string} datos.apellido - Apellido del usuario
 * @param {string} datos.username - Nombre de usuario
 * @param {string} datos.password - Contraseña temporal
 * @param {string} datos.rol - Rol asignado
 * @returns {Promise<Object>} Resultado del envío
 */
async function enviarCredencialesNuevoUsuario(datos) {
  try {
    const transporter = crearTransportador();

    // Si no hay configuración, simular envío exitoso
    if (!transporter) {
      console.log('📧 Email no configurado. Credenciales no enviadas a:', datos.email);
      return {
        success: false,
        message: 'Servicio de email no configurado',
        simulado: true,
      };
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0056b3; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
          .credentials { background-color: #fff; padding: 15px; border-left: 4px solid #0056b3; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          strong { color: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sistema RE.SE.J</h1>
            <p>Registro de Secuestros Judiciales</p>
          </div>
          
          <div class="content">
            <h2>Bienvenido/a ${datos.nombre} ${datos.apellido}</h2>
            
            <p>Se ha creado una cuenta de usuario para usted en el Sistema RE.SE.J.</p>
            
            <div class="credentials">
              <h3>📋 Credenciales de Acceso</h3>
              <p><strong>Usuario:</strong> ${datos.username}</p>
              <p><strong>Contraseña temporal:</strong> ${datos.password}</p>
              <p><strong>Rol asignado:</strong> ${datos.rol}</p>
              <p><strong>URL del sistema:</strong> ${process.env.FRONTEND_URL || 'http://localhost:5173'}</p>
            </div>
            
            <div class="warning">
              <h3>⚠️ Importante</h3>
              <ul>
                <li>Por seguridad, se recomienda cambiar su contraseña en el primer inicio de sesión</li>
                <li>No comparta sus credenciales con otras personas</li>
                <li>Mantenga sus datos de acceso en un lugar seguro</li>
              </ul>
            </div>
            
            <p>Si tiene alguna pregunta o problema para acceder al sistema, contacte con el administrador.</p>
          </div>
          
          <div class="footer">
            <p>Este es un mensaje automático del Sistema RE.SE.J</p>
            <p>Por favor, no responda a este correo</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Sistema RE.SE.J - Registro de Secuestros Judiciales

Bienvenido/a ${datos.nombre} ${datos.apellido}

Se ha creado una cuenta de usuario para usted en el Sistema RE.SE.J.

CREDENCIALES DE ACCESO:
- Usuario: ${datos.username}
- Contraseña temporal: ${datos.password}
- Rol asignado: ${datos.rol}
- URL del sistema: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

IMPORTANTE:
- Por seguridad, se recomienda cambiar su contraseña en el primer inicio de sesión
- No comparta sus credenciales con otras personas
- Mantenga sus datos de acceso en un lugar seguro

Si tiene alguna pregunta o problema para acceder al sistema, contacte con el administrador.

---
Este es un mensaje automático del Sistema RE.SE.J
Por favor, no responda a este correo
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Sistema RE.SE.J" <${process.env.EMAIL_USER}>`,
      to: datos.email,
      subject: 'Credenciales de acceso - Sistema RE.SE.J',
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email enviado exitosamente a:', datos.email);
    console.log('📬 Message ID:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      message: 'Email enviado correctamente',
    };
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al enviar el email',
    };
  }
}

/**
 * Envía un email de prueba para verificar la configuración
 * @param {string} emailDestino - Email de destino para la prueba
 * @returns {Promise<Object>} Resultado de la prueba
 */
async function enviarEmailPrueba(emailDestino) {
  try {
    const transporter = crearTransportador();

    if (!transporter) {
      return {
        success: false,
        message: 'Servicio de email no configurado',
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Sistema RE.SE.J" <${process.env.EMAIL_USER}>`,
      to: emailDestino,
      subject: 'Prueba de configuración - Sistema RE.SE.J',
      text: 'Este es un email de prueba del Sistema RE.SE.J. Si recibió este mensaje, la configuración de email está funcionando correctamente.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>✅ Prueba de Email - Sistema RE.SE.J</h2>
          <p>Este es un email de prueba del Sistema RE.SE.J.</p>
          <p>Si recibió este mensaje, la configuración de email está funcionando correctamente.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">Mensaje enviado desde: ${process.env.EMAIL_USER}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      message: 'Email de prueba enviado correctamente',
    };
  } catch (error) {
    console.error('❌ Error en prueba de email:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error al enviar email de prueba',
    };
  }
}

module.exports = {
  enviarCredencialesNuevoUsuario,
  enviarEmailPrueba,
};
