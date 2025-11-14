const cron = require('node-cron');
const logger = require('./logger');
const { limpiarTokensExpirados } = require('../middleware/tokenAcceso');

/**
 * Inicializa todas las tareas programadas del sistema
 * Estas tareas se ejecutan automáticamente en segundo plano
 */
function iniciarTareasProgramadas() {
  logger.info('📅 Iniciando tareas programadas...');

  // Tarea 1: Limpieza de tokens temporales expirados
  // Se ejecuta cada hora
  cron.schedule('0 * * * *', async () => {
    try {
      logger.info('🧹 Ejecutando limpieza de tokens temporales expirados...');
      const eliminados = await limpiarTokensExpirados();
      if (eliminados > 0) {
        logger.info(`✅ Tokens temporales eliminados: ${eliminados}`);
      }
    } catch (error) {
      logger.error('❌ Error en limpieza de tokens temporales:', error);
    }
  });

  // Tarea 2: Limpieza de refresh tokens expirados
  // Se ejecuta todos los días a las 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('🧹 Ejecutando limpieza de refresh tokens expirados...');
      const db = require('../config/database');
      const eliminados = await db('refresh_tokens')
        .where('expires_at', '<', new Date())
        .del();
      
      if (eliminados > 0) {
        logger.info(`✅ Refresh tokens eliminados: ${eliminados}`);
      }
    } catch (error) {
      logger.error('❌ Error en limpieza de refresh tokens:', error);
    }
  });

  // Tarea 3: Limpieza de logs antiguos (opcional)
  // Se ejecuta el primer día de cada mes a las 3:00 AM
  cron.schedule('0 3 1 * *', async () => {
    try {
      logger.info('🧹 Ejecutando limpieza de logs antiguos...');
      const db = require('../config/database');
      
      // Mantener solo logs de los últimos 6 meses
      const seisosesAntes = new Date();
      seisosesAntes.setMonth(seisosesAntes.getMonth() - 6);
      
      const eliminados = await db('logs_auditoria')
        .where('timestamp', '<', seisosesAntes)
        .del();
      
      if (eliminados > 0) {
        logger.info(`✅ Logs antiguos eliminados: ${eliminados}`);
      }
    } catch (error) {
      logger.error('❌ Error en limpieza de logs antiguos:', error);
    }
  });

  logger.info('✅ Tareas programadas iniciadas correctamente');
  logger.info('   - Limpieza de tokens temporales: cada hora');
  logger.info('   - Limpieza de refresh tokens: diaria a las 2:00 AM');
  logger.info('   - Limpieza de logs antiguos: mensual el día 1 a las 3:00 AM');
}

module.exports = {
  iniciarTareasProgramadas,
};
