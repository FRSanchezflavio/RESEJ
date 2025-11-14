const cron = require('node-cron');
const db = require('../config/database');

/**
 * Limpia tokens de acceso temporal expirados
 */
const limpiarTokensExpirados = async () => {
  try {
    console.log('🧹 Ejecutando limpieza de tokens expirados...');
    
    const resultado = await db('tokens_acceso_temporal')
      .where('fecha_expiracion', '<', new Date())
      .del();
    
    if (resultado > 0) {
      console.log(`✅ Se eliminaron ${resultado} tokens expirados`);
    }
  } catch (error) {
    console.error('❌ Error al limpiar tokens expirados:', error);
  }
};

/**
 * Limpia sesiones antiguas (refresh tokens)
 */
const limpiarSesionesAntiguas = async () => {
  try {
    console.log('🧹 Ejecutando limpieza de sesiones antiguas...');
    
    // Eliminar refresh tokens expirados (más de 30 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);
    
    const resultado = await db('refresh_tokens')
      .where('created_at', '<', fechaLimite)
      .del();
    
    if (resultado > 0) {
      console.log(`✅ Se eliminaron ${resultado} sesiones antiguas`);
    }
  } catch (error) {
    console.error('❌ Error al limpiar sesiones antiguas:', error);
  }
};

/**
 * Limpia archivos huérfanos (sin registro asociado)
 */
const limpiarArchivosHuerfanos = async () => {
  try {
    console.log('🧹 Ejecutando limpieza de archivos huérfanos...');
    
    const resultado = await db('archivos_adjuntos')
      .whereNotExists(function() {
        this.select('*')
          .from('registros_secuestros')
          .whereRaw('registros_secuestros.id = archivos_adjuntos.registro_id');
      })
      .del();
    
    if (resultado > 0) {
      console.log(`✅ Se eliminaron ${resultado} archivos huérfanos`);
    }
  } catch (error) {
    console.error('❌ Error al limpiar archivos huérfanos:', error);
  }
};

/**
 * Inicia todas las tareas programadas
 */
const iniciarTareasProgramadas = () => {
  console.log('📅 Iniciando tareas programadas...');
  
  // Ejecutar limpieza de tokens cada día a las 2:00 AM
  cron.schedule('0 2 * * *', () => {
    console.log('⏰ Ejecutando tareas programadas diarias');
    limpiarTokensExpirados();
    limpiarSesionesAntiguas();
  });
  
  // Ejecutar limpieza de archivos huérfanos cada domingo a las 3:00 AM
  cron.schedule('0 3 * * 0', () => {
    console.log('⏰ Ejecutando limpieza semanal');
    limpiarArchivosHuerfanos();
  });
  
  console.log('✅ Tareas programadas iniciadas correctamente');
};

module.exports = {
  iniciarTareasProgramadas,
  limpiarTokensExpirados,
  limpiarSesionesAntiguas,
  limpiarArchivosHuerfanos
};
