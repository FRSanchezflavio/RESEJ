const crypto = require('crypto');
const EnlaceCompartido = require('../models/EnlaceCompartido');
const AccesoEnlace = require('../models/AccesoEnlace');
const { hashPassword, comparePassword } = require('../utils/helpers');
const logger = require('../utils/logger');

const TOKEN_BYTES = 24; // 32 caracteres aprox en base64url
const USER_SUFFIX_LENGTH = 6;
const TEMP_PASSWORD_LENGTH = 12;

function generateToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString('base64url');
}

function generateTemporalUser() {
  const suffix = crypto.randomBytes(USER_SUFFIX_LENGTH).toString('hex');
  return `consulta_${suffix}`;
}

function generateTemporalPassword() {
  return crypto.randomBytes(TEMP_PASSWORD_LENGTH).toString('base64url');
}

function calculateExpiration(duracionHoras) {
  if (!duracionHoras || Number(duracionHoras) <= 0) return null;
  const expires = new Date();
  expires.setHours(expires.getHours() + Number(duracionHoras));
  return expires.toISOString();
}

function isExpired(enlace) {
  if (!enlace.fecha_expiracion) return false;
  return new Date(enlace.fecha_expiracion) <= new Date();
}

function maxAccessReached(enlace) {
  if (!enlace.max_accesos) return false;
  return Number(enlace.accesos || 0) >= Number(enlace.max_accesos);
}

async function registerAccess(enlace, { resultado, ip, userAgent, detalle }) {
  try {
    await AccesoEnlace.create({
      enlace_id: enlace.id,
      resultado,
      ip_address: ip || null,
      user_agent: userAgent || null,
      detalle: detalle || null,
    });
  } catch (error) {
    logger.error(
      `Error registrando acceso de enlace ${enlace.token}: ${error.message}`
    );
  }
}

async function createEnlace({
  registroId,
  usuarioCreadorId,
  descripcion,
  duracionHoras,
  maxAccesos,
  requiereContrasena,
  contrasena,
  tipo = 'registro',
}) {
  const token = generateToken();
  const usuarioTemporal = generateTemporalUser();
  const passwordTemporal = generateTemporalPassword();
  const passwordTemporalHash = await hashPassword(passwordTemporal);

  let contrasenaHash = null;
  if (requiereContrasena && contrasena) {
    contrasenaHash = await hashPassword(contrasena);
  }

  const enlace = await EnlaceCompartido.create({
    token,
    registro_id: registroId || null,
    usuario_creador_id: usuarioCreadorId || null,
    tipo,
    descripcion: descripcion || null,
    requiere_contrasena: Boolean(requiereContrasena),
    contrasena_hash: contrasenaHash,
    usuario_temporal_usuario: usuarioTemporal,
    usuario_temporal_password_hash: passwordTemporalHash,
    fecha_expiracion: calculateExpiration(duracionHoras),
    max_accesos: maxAccesos || null,
  });

  return {
    enlace,
    credencialesTemporales: {
      usuario: usuarioTemporal,
      password: passwordTemporal,
    },
  };
}

async function getEnlacePrivado(token) {
  return EnlaceCompartido.findByToken(token);
}

async function listEnlaces({ page, limit, usuarioId, includeRevoked }) {
  return EnlaceCompartido.findAll({ page, limit, usuarioId, includeRevoked });
}

async function revokeEnlace(token) {
  const enlace = await EnlaceCompartido.findByToken(token);
  if (!enlace) {
    return null;
  }

  if (!enlace.revocado) {
    await EnlaceCompartido.updateByToken(token, {
      revocado: true,
      fecha_revocado: new Date().toISOString(),
    });
  }

  return EnlaceCompartido.findByToken(token);
}

async function validatePublicAccess(token, { contrasena, ip, userAgent }) {
  const enlace = await EnlaceCompartido.findByToken(token);
  if (!enlace) {
    return { error: 'Enlace no encontrado', status: 404 };
  }

  if (enlace.revocado) {
    await registerAccess(enlace, {
      resultado: 'revocado',
      ip,
      userAgent,
      detalle: 'Enlace revocado',
    });
    return { error: 'Este enlace fue revocado', status: 410 };
  }

  if (isExpired(enlace)) {
    await registerAccess(enlace, {
      resultado: 'expirado',
      ip,
      userAgent,
      detalle: 'Enlace expirado',
    });
    return { error: 'Este enlace ha expirado', status: 410 };
  }

  if (maxAccessReached(enlace)) {
    await registerAccess(enlace, {
      resultado: 'denegado',
      ip,
      userAgent,
      detalle: 'Se alcanzó el máximo de accesos permitidos',
    });
    return { error: 'Se alcanzó el máximo de accesos permitidos', status: 403 };
  }

  if (enlace.requiere_contrasena) {
    if (!contrasena) {
      return {
        error: 'Este enlace requiere contraseña',
        status: 401,
        necesitaContrasena: true,
      };
    }

    const ok = await comparePassword(contrasena, enlace.contrasena_hash);
    if (!ok) {
      await registerAccess(enlace, {
        resultado: 'denegado',
        ip,
        userAgent,
        detalle: 'Contraseña incorrecta',
      });
      return { error: 'Contraseña incorrecta', status: 401 };
    }
  }

  // acceso permitido
  await EnlaceCompartido.incrementarAcceso(enlace.id);
  await registerAccess(enlace, {
    resultado: 'permitido',
    ip,
    userAgent,
  });

  const refreshed = await EnlaceCompartido.findByToken(token);
  return { enlace: refreshed };
}

module.exports = {
  createEnlace,
  getEnlacePrivado,
  listEnlaces,
  revokeEnlace,
  validatePublicAccess,
};
