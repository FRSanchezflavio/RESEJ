const cron = require('node-cron');
const { limpiarTokensExpirados } = require('../middleware/tokenAcceso');

/**
 * 🕒 Iniciar tareas programadas
 * Ejecuta limpieza automática de tokens expirados cada hora
 */
function iniciarTareasProgramadas() {
  console.log('🕒 Iniciando tareas programadas...');

  // Limpieza de tokens expirados cada hora (a los 0 minutos)
  cron.schedule('0 * * * *', async () => {
    console.log('🧹 Ejecutando limpieza automática de tokens expirados...');
    try {
      await limpiarTokensExpirados();
      console.log('✅ Limpieza de tokens completada');
    } catch (error) {
      console.error('❌ Error en limpieza de tokens:', error);
    }
  });

  console.log('✅ Tareas programadas iniciadas:');
  console.log('   - Limpieza de tokens: cada hora a los 0 minutos');
}

module.exports = { iniciarTareasProgramadas };
