const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const enviarCredencialesNuevoUsuario = async (
  email,
  usuario,
  contraseña,
  rol
) => {
  // Si no está configurado el email, retornar éxito sin enviar
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Configuración de email no encontrada. Email no enviado.');
    return {
      success: false,
      message: 'Configuración de email no disponible',
    };
  }

  const loginUrl = `${
    process.env.FRONTEND_URL || 'http://localhost:5173'
  }/login`;

  const permisos =
    rol === 'consulta'
      ? '<strong>Solo podrás buscar y visualizar información.</strong> No podrás crear, editar o eliminar registros.'
      : 'Tienes acceso completo al sistema.';

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Credenciales de acceso - Nuevo Usuario',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Bienvenido a la plataforma</h2>
                <p>Se ha creado una cuenta para ti con las siguientes credenciales:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 10px 0;"><strong>Usuario:</strong> ${usuario}</li>
                        <li style="margin: 10px 0;"><strong>Contraseña:</strong> ${contraseña}</li>
                        <li style="margin: 10px 0;"><strong>Rol:</strong> ${rol}</li>
                    </ul>
                </div>
                <p><strong>Permisos:</strong> ${permisos}</p>
                <p>Puedes acceder a la aplicación haciendo clic en el siguiente botón:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Acceder a la aplicación</a>
                </div>
                <p style="color: #666; font-size: 14px;">O copia y pega este enlace en tu navegador:</p>
                <p style="color: #2196F3; word-break: break-all;">${loginUrl}</p>
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-top: 20px;">
                    <p style="margin: 0;"><strong>⚠️ Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña después del primer inicio de sesión.</p>
                </div>
            </div>
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return {
      success: true,
      message: 'Correo enviado exitosamente',
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return {
      success: false,
      message: `Error al enviar correo: ${error.message}`,
    };
  }
};

module.exports = {
  enviarCredencialesNuevoUsuario,
};
