const bcrypt = require('bcryptjs');
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const os = require('os');
const { enviarCredencialesNuevoUsuario } = require('../services/emailService');
const {
  generarTokenTemporal,
  validarTokenTemporal,
} = require('../middleware/tokenAcceso');

const crearUsuario = async (req, res) => {
  try {
    console.log('========================================');
    console.log('📥 DATOS RECIBIDOS EN crearUsuario:');
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    console.log('========================================');

    const { username, nombre, apellido, email, password, rol_id, enviarEmail } =
      req.body;

    console.log('📋 Campos extraídos:');
    console.log('- username:', username);
    console.log('- nombre:', nombre);
    console.log('- apellido:', apellido);
    console.log('- email:', email);
    console.log('- password:', password ? '***' : 'undefined');
    console.log('- rol_id:', rol_id);
    console.log('- enviarEmail:', enviarEmail);

    // Validaciones
    console.log('\n🔍 Iniciando validaciones...');

    if (!username || !username.trim()) {
      console.log('❌ Error: username vacío o inválido');
      return res
        .status(400)
        .json({ error: 'El nombre de usuario es requerido' });
    }
    console.log('✅ Username válido');

    if (!nombre || !nombre.trim()) {
      console.log('❌ Error: nombre vacío o inválido');
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    console.log('✅ Nombre válido');

    if (!apellido || !apellido.trim()) {
      console.log('❌ Error: apellido vacío o inválido');
      return res.status(400).json({ error: 'El apellido es requerido' });
    }
    console.log('✅ Apellido válido');

    if (!email || !email.trim()) {
      console.log('❌ Error: email vacío o inválido');
      return res.status(400).json({ error: 'El email es requerido' });
    }
    console.log('✅ Email proporcionado');

    if (!password || !password.trim()) {
      console.log('❌ Error: password vacío o inválido');
      return res.status(400).json({ error: 'La contraseña es requerida' });
    }
    console.log('✅ Password proporcionado');

    if (password.length < 6) {
      console.log('❌ Error: password muy corto');
      return res
        .status(400)
        .json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    console.log('✅ Password con longitud suficiente');

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Error: formato de email inválido');
      return res
        .status(400)
        .json({ error: 'El formato del email no es válido' });
    }
    console.log('✅ Formato de email válido');

    // Verificar si el usuario ya existe
    console.log('\n🔍 Verificando si usuario o email ya existen...');
    const usuarioExistente = await db('usuarios')
      .where('usuario', username.trim())
      .orWhere('email', email.trim())
      .first();

    if (usuarioExistente) {
      console.log('❌ Usuario o email ya existen:', usuarioExistente);
      if (usuarioExistente.usuario === username.trim()) {
        return res
          .status(400)
          .json({ error: 'El nombre de usuario ya existe' });
      }
      if (usuarioExistente.email === email.trim()) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }
    console.log('✅ Username y email disponibles');

    // Verificar que el rol existe
    // Por defecto asignar rol de Administrador (ID 1) con todos los permisos
    const rolIdFinal = rol_id || 1;
    console.log('\n🔍 Verificando rol con ID:', rolIdFinal);
    const rolExiste = await db('roles').where('id', rolIdFinal).first();

    if (!rolExiste) {
      console.log('❌ Rol no existe:', rolIdFinal);
      // Mostrar roles disponibles
      const rolesDisponibles = await db('roles').select('id', 'nombre');
      console.log('Roles disponibles:', rolesDisponibles);
      return res.status(400).json({
        error: 'El rol especificado no existe',
        rolesDisponibles: rolesDisponibles,
      });
    }
    console.log('✅ Rol válido:', rolExiste.nombre);

    // Hash de la contraseña
    console.log('\n🔐 Hasheando contraseña...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Contraseña hasheada exitosamente');

    // Crear usuario
    console.log('\n💾 Insertando usuario en base de datos...');
    console.log('Datos a insertar:', {
      usuario: username.trim(),
      nombre: nombre ? nombre.trim() : null,
      apellido: apellido ? apellido.trim() : null,
      email: email.trim(),
      password_hash: '***',
      rol_id: rolIdFinal,
    });

    const [nuevoUsuario] = await db('usuarios')
      .insert({
        usuario: username.trim(),
        nombre: nombre ? nombre.trim() : null,
        apellido: apellido ? apellido.trim() : null,
        email: email.trim(),
        password_hash: hashedPassword,
        rol_id: rolIdFinal,
      })
      .returning(['id', 'usuario', 'nombre', 'apellido', 'email', 'rol_id']);

    console.log('✅ Usuario creado exitosamente:', nuevoUsuario);

    // Obtener información del rol
    console.log('\n🔍 Obteniendo información del rol...');
    const rol = await db('roles').where('id', nuevoUsuario.rol_id).first();
    console.log('✅ Rol obtenido:', rol);

    // Enviar email si se solicita
    let emailEnviado = false;
    let mensajeEmail = '';

    if (enviarEmail && email) {
      console.log('\n📧 Intentando enviar email...');
      try {
        const resultadoEmail = await enviarCredencialesNuevoUsuario(
          email.trim(),
          username.trim(),
          password, // Contraseña sin hashear para el email
          rol.nombre
        );

        emailEnviado = resultadoEmail.success;
        mensajeEmail = resultadoEmail.message;

        if (resultadoEmail.success) {
          console.log('✅ Email enviado exitosamente');
        } else {
          console.warn(
            '⚠️ Usuario creado pero no se pudo enviar el correo:',
            resultadoEmail.message
          );
        }
      } catch (emailError) {
        console.error('❌ Error al enviar email:', emailError);
        mensajeEmail =
          'Error al enviar el correo electrónico. Usuario creado exitosamente.';
        // No fallamos todo el proceso si falla el email
      }
    } else {
      console.log('ℹ️ Email no solicitado o no proporcionado');
    }

    console.log('\n✅ USUARIO CREADO EXITOSAMENTE');
    console.log('========================================\n');

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      emailEnviado,
      mensajeEmail:
        mensajeEmail ||
        (enviarEmail ? 'Email no enviado' : 'Email no solicitado'),
      usuario: {
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        rol: rol.nombre,
        rol_id: nuevoUsuario.rol_id,
      },
    });
  } catch (error) {
    console.error('\n❌ ERROR EN crearUsuario:');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.error('========================================\n');

    res.status(500).json({
      error: 'Error al crear usuario',
      detalles:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await db('usuarios')
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
      .select(
        'usuarios.id',
        'usuarios.usuario as username',
        'usuarios.nombre',
        'usuarios.apellido',
        'usuarios.email',
        'usuarios.activo',
        'usuarios.fecha_creacion as created_at',
        'roles.nombre as rol',
        'roles.id as rol_id'
      )
      .orderBy('usuarios.fecha_creacion', 'desc');

    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

const obtenerRoles = async (req, res) => {
  try {
    const roles = await db('roles').select('*').orderBy('id');

    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, rol_id } = req.body;

    const updateData = {};

    if (nombre !== undefined) updateData.nombre = nombre.trim();
    if (apellido !== undefined) updateData.apellido = apellido.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (password) updateData.password_hash = await bcrypt.hash(password, 10);
    if (rol_id) updateData.rol_id = rol_id;

    await db('usuarios').where({ id }).update(updateData);

    const usuarioActualizado = await db('usuarios')
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.id', id)
      .select(
        'usuarios.id',
        'usuarios.usuario as username',
        'usuarios.nombre',
        'usuarios.apellido',
        'usuarios.email',
        'roles.nombre as rol'
      )
      .first();

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar al admin principal
    const usuario = await db('usuarios').where({ id }).first();
    if (usuario && usuario.id === 1) {
      return res.status(403).json({
        error: 'No se puede eliminar el usuario administrador principal',
      });
    }

    await db('usuarios').where({ id }).del();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

/**
 * Genera un enlace de acceso temporal para un usuario
 */
const generarEnlaceAcceso = async (req, res) => {
  try {
    console.log('========================================');
    console.log('🔗 GENERANDO ENLACE DE ACCESO TEMPORAL');
    const { usuario_id } = req.body;
    const adminId = req.user.id;

    console.log('- Usuario destino ID:', usuario_id);
    console.log('- Generado por ID:', adminId);

    // Validar que el usuario existe y está activo
    const usuario = await db('usuarios')
      .join('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.id', usuario_id)
      .select('usuarios.*', 'roles.nombre as rol')
      .first();

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    if (!usuario.activo) {
      console.log('❌ Usuario inactivo');
      return res.status(400).json({
        success: false,
        error: 'El usuario no está activo',
      });
    }

    console.log('✅ Usuario encontrado:', usuario.usuario);

    // Generar token temporal
    const { token, fecha_expiracion } = await generarTokenTemporal(
      usuario_id,
      adminId
    );
    console.log('✅ Token generado exitosamente');

    // Obtener IP local del servidor (priorizar redes locales)
    const networkInterfaces = os.networkInterfaces();
    let ipLocal = 'localhost';
    let ipEncontrada = false;

    // Buscar IPs de red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    for (const interfaceName in networkInterfaces) {
      if (ipEncontrada) break;
      const interfaces = networkInterfaces[interfaceName];
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          const ip = iface.address;
          // Priorizar IPs de red local
          if (
            ip.startsWith('192.168.') ||
            ip.startsWith('10.') ||
            (ip.startsWith('172.') &&
              parseInt(ip.split('.')[1]) >= 16 &&
              parseInt(ip.split('.')[1]) <= 31)
          ) {
            ipLocal = ip;
            ipEncontrada = true;
            console.log('📡 IP de red local detectada:', ipLocal);
            break;
          }
        }
      }
    }

    // Si no se encontró IP de red local, usar cualquier IP no interna
    if (ipLocal === 'localhost') {
      for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
          if (iface.family === 'IPv4' && !iface.internal) {
            ipLocal = iface.address;
            console.log('📡 IP detectada:', ipLocal);
            break;
          }
        }
        if (ipLocal !== 'localhost') break;
      }
    }

    // Construir URL de acceso
    const puertoFrontend = process.env.FRONTEND_PORT || '5173';
    const frontendUrl =
      process.env.FRONTEND_URL || `http://${ipLocal}:${puertoFrontend}`;
    const enlaceAcceso = `${frontendUrl}/login?token=${token}`;

    console.log('🌐 URL generada:', enlaceAcceso);

    // Registrar en logs de auditoría
    await db('logs_auditoria').insert({
      usuario_id: adminId,
      accion: 'GENERAR_ENLACE_ACCESO',
      recurso_tipo: 'tokens_acceso_temporal',
      recurso_id: usuario_id,
      detalles: {
        usuario_destino: usuario.usuario,
        valido_hasta: fecha_expiracion,
      },
    });

    console.log('✅ ENLACE GENERADO EXITOSAMENTE');
    console.log('========================================\n');

    res.json({
      success: true,
      data: {
        enlace: enlaceAcceso,
        usuario_destino: usuario.usuario,
        rol_destino: usuario.rol,
        valido_hasta: fecha_expiracion,
        un_solo_uso: true,
      },
    });
  } catch (error) {
    console.error('❌ Error al generar enlace de acceso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar enlace de acceso',
    });
  }
};

/**
 * Valida un token temporal y retorna el JWT
 */
const validarTokenAcceso = async (req, res) => {
  try {
    console.log('========================================');
    console.log('🔍 VALIDANDO TOKEN DE ACCESO TEMPORAL');

    const { token } = req.body;
    const ipCliente = req.ip || req.connection.remoteAddress;

    console.log(
      '- Token recibido:',
      token ? token.substring(0, 10) + '...' : 'ninguno'
    );
    console.log('- IP Cliente:', ipCliente);

    if (!token) {
      console.log('❌ Token no proporcionado');
      return res.status(400).json({
        success: false,
        error: 'Token no proporcionado',
      });
    }

    const resultado = await validarTokenTemporal(token, ipCliente);

    if (!resultado.valido) {
      console.log('❌ Token inválido:', resultado.mensaje);
      return res.status(401).json({
        success: false,
        token_valido: false,
        mensaje: resultado.mensaje,
      });
    }

    console.log('✅ Token válido para usuario:', resultado.usuario.username);

    // Generar JWT para la sesión
    const jwtToken = jwt.sign(
      {
        id: resultado.usuario.id,
        username: resultado.usuario.username,
        rol: resultado.usuario.rol,
        permisos: resultado.usuario.permisos,
      },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    console.log('✅ JWT generado para sesión');

    // Registrar acceso en logs
    await db('logs_auditoria').insert({
      usuario_id: resultado.usuario.id,
      accion: 'LOGIN_TOKEN_TEMPORAL',
      recurso_tipo: 'usuarios',
      recurso_id: resultado.usuario.id,
      detalles: {
        ip: ipCliente,
        metodo: 'token_temporal',
      },
    });

    console.log('✅ ACCESO VALIDADO EXITOSAMENTE');
    console.log('========================================\n');

    res.json({
      success: true,
      token_valido: true,
      usuario: resultado.usuario,
      jwt_token: jwtToken,
      permisos: resultado.usuario.permisos,
    });
  } catch (error) {
    console.error('❌ Error al validar token de acceso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al validar token de acceso',
    });
  }
};

/**
 * Lista los tokens de acceso activos (para administradores)
 */
const listarTokensActivos = async (req, res) => {
  try {
    const tokens = await db('tokens_acceso_temporal')
      .join('usuarios', 'tokens_acceso_temporal.usuario_id', 'usuarios.id')
      .leftJoin(
        'usuarios as generador',
        'tokens_acceso_temporal.generado_por',
        'generador.id'
      )
      .where('tokens_acceso_temporal.usado', false)
      .where('tokens_acceso_temporal.fecha_expiracion', '>', new Date())
      .select(
        'tokens_acceso_temporal.id',
        'tokens_acceso_temporal.token',
        'tokens_acceso_temporal.fecha_generacion',
        'tokens_acceso_temporal.fecha_expiracion',
        'usuarios.usuario as usuario_destino',
        'generador.usuario as generado_por'
      )
      .orderBy('tokens_acceso_temporal.fecha_generacion', 'desc');

    res.json({
      success: true,
      tokens,
    });
  } catch (error) {
    console.error('Error al listar tokens activos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al listar tokens activos',
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerRoles,
  actualizarUsuario,
  eliminarUsuario,
  generarEnlaceAcceso,
  validarTokenAcceso,
  listarTokensActivos,
};
