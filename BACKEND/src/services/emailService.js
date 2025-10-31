const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Crear transporter de nodemailer con configuración desde variables de entorno
 */
const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    return transporter;
  } catch (error) {
    logger.error(`Error al crear transporter de email: ${error.message}`);
    throw error;
  }
};

/**
 * Verificar configuración de email
 */
const verificarConfiguracion = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    logger.info('✓ Configuración de email verificada correctamente');
    return true;
  } catch (error) {
    logger.warn(
      `⚠ No se pudo verificar configuración de email: ${error.message}`
    );
    return false;
  }
};

/**
 * Enviar credenciales a un nuevo usuario
 */
const enviarCredencialesNuevoUsuario = async (
  email,
  usuario,
  contraseña,
  nombreCompleto
) => {
  try {
    // Verificar que las credenciales de email estén configuradas
    if (
      !process.env.EMAIL_USER ||
      process.env.EMAIL_USER === 'tu-correo@gmail.com'
    ) {
      logger.warn('Email no configurado. No se enviará correo.');
      return {
        success: false,
        message: 'Servicio de email no configurado',
      };
    }

    const transporter = createTransporter();
    const loginUrl = `${process.env.FRONTEND_URL}/`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔐 Credenciales de Acceso - Sistema RESEJ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
            }
            .credentials {
              background: white;
              padding: 20px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
              border-radius: 5px;
            }
            .credentials strong {
              color: #667eea;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #ddd;
            }
            ul {
              list-style: none;
              padding: 0;
            }
            ul li {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 ¡Bienvenido/a!</h1>
            <p>Tu cuenta ha sido creada exitosamente</p>
          </div>
          
          <div class="content">
            <p>Hola <strong>${nombreCompleto}</strong>,</p>
            
            <p>Se ha creado una cuenta para ti en el <strong>Sistema de Registro de Secuestros Judiciales (RESEJ)</strong>.</p>
            
            <div class="credentials">
              <h3>📋 Tus Credenciales de Acceso:</h3>
              <ul>
                <li><strong>Usuario:</strong> ${usuario}</li>
                <li><strong>Contraseña:</strong> ${contraseña}</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">🚀 Acceder al Sistema</a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              O copia y pega este enlace en tu navegador:<br>
              <a href="${loginUrl}">${loginUrl}</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Importante - Seguridad:</strong>
              <ul style="margin: 10px 0 0 20px;">
                <li>Cambia tu contraseña después del primer inicio de sesión</li>
                <li>No compartas tus credenciales con nadie</li>
                <li>Cierra sesión al terminar de usar el sistema</li>
                <li>Este correo contiene información confidencial</li>
              </ul>
            </div>
            
            <p>Si tienes algún problema para acceder al sistema, por favor contacta al administrador.</p>
            
            <p>Saludos,<br>
            <strong>Equipo RESEJ</strong></p>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático. Por favor, no responder.</p>
            <p>&copy; ${new Date().getFullYear()} Sistema RESEJ - Todos los derechos reservados</p>
          </div>
        </body>
        </html>
      `,
      text: `
        Bienvenido/a ${nombreCompleto},
        
        Se ha creado una cuenta para ti en el Sistema RESEJ.
        
        Credenciales de Acceso:
        - Usuario: ${usuario}
        - Contraseña: ${contraseña}
        
        Accede al sistema en: ${loginUrl}
        
        IMPORTANTE: Por seguridad, cambia tu contraseña después del primer inicio de sesión.
        
        Saludos,
        Equipo RESEJ
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(
      `✓ Correo de credenciales enviado a: ${email} - MessageID: ${info.messageId}`
    );

    return {
      success: true,
      message: 'Correo enviado exitosamente',
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(`Error al enviar correo a ${email}: ${error.message}`);
    return {
      success: false,
      message: 'Error al enviar correo',
      error: error.message,
    };
  }
};

/**
 * Enviar correo de restablecimiento de contraseña
 */
const enviarRestablecimientoPassword = async (email, usuario, tokenReset) => {
  try {
    if (
      !process.env.EMAIL_USER ||
      process.env.EMAIL_USER === 'tu-correo@gmail.com'
    ) {
      logger.warn('Email no configurado. No se enviará correo.');
      return {
        success: false,
        message: 'Servicio de email no configurado',
      };
    }

    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${tokenReset}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔑 Restablecimiento de Contraseña - Sistema RESEJ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔑 Restablecimiento de Contraseña</h1>
          </div>
          
          <div class="content">
            <p>Hola <strong>${usuario}</strong>,</p>
            
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en el Sistema RESEJ.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            </div>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              O copia y pega este enlace en tu navegador:<br>
              <a href="${resetUrl}">${resetUrl}</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Nota Importante:</strong>
              <ul style="margin: 10px 0 0 20px;">
                <li>Este enlace expirará en 1 hora</li>
                <li>Si no solicitaste este cambio, ignora este correo</li>
                <li>Tu contraseña actual seguirá siendo válida</li>
              </ul>
            </div>
            
            <p>Saludos,<br><strong>Equipo RESEJ</strong></p>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático. Por favor, no responder.</p>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(`✓ Correo de restablecimiento enviado a: ${email}`);

    return {
      success: true,
      message: 'Correo enviado exitosamente',
      messageId: info.messageId,
    };
  } catch (error) {
    logger.error(
      `Error al enviar correo de restablecimiento a ${email}: ${error.message}`
    );
    return {
      success: false,
      message: 'Error al enviar correo',
      error: error.message,
    };
  }
};

module.exports = {
  enviarCredencialesNuevoUsuario,
  enviarRestablecimientoPassword,
  verificarConfiguracion,
};
