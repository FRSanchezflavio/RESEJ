/**
 * Script de limpieza de tokens de refresco expirados
 * Ejecutar periódicamente para mantener la base de datos limpia
 */

require('dotenv').config();
const db = require('./src/config/database');
const logger = require('./src/utils/logger');

async function cleanupExpiredTokens() {
  try {
    logger.info('Iniciando limpieza de tokens expirados...');

    // Eliminar tokens expirados
    const result = await db('refresh_tokens')
      .where('expira_en', '<', new Date())
      .orWhere('revocado', true)
      .delete();

    logger.info(`Tokens eliminados: ${result}`);
    
    console.log(`✅ Limpieza completada. ${result} tokens eliminados.`);
    process.exit(0);
  } catch (error) {
    logger.error('Error en limpieza de tokens:', error);
    console.error('❌ Error en limpieza:', error.message);
    process.exit(1);
  }
}

cleanupExpiredTokens();
