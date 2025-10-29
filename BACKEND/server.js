require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const db = require('./src/config/database');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Obtener las interfaces de red para mostrar todas las URLs disponibles
const getNetworkAddresses = () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  
  return addresses;
};

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await db.raw('SELECT 1');
    logger.info('✓ Conexión a la base de datos establecida correctamente');

    // Iniciar el servidor
    app.listen(PORT, HOST, () => {
      const networkAddresses = getNetworkAddresses();
      
      logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      logger.info(`🚀 Servidor RE.SE.J iniciado correctamente`);
      logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      logger.info(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`⏰ Timestamp: ${new Date().toISOString()}`);
      logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      logger.info(`📍 URLs de acceso disponibles:`);
      logger.info(`   - Local:    http://localhost:${PORT}`);
      logger.info(`   - Local:    http://127.0.0.1:${PORT}`);
      
      if (networkAddresses.length > 0) {
        networkAddresses.forEach(address => {
          logger.info(`   - Red:      http://${address}:${PORT}`);
        });
      }
      
      logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      logger.info(`💡 Configura el frontend con:`);
      logger.info(`   VITE_API_URL=http://localhost:${PORT}/api`);
      if (networkAddresses.length > 0) {
        logger.info(`   O para acceso desde la red:`);
        logger.info(`   VITE_API_URL=http://${networkAddresses[0]}:${PORT}/api`);
      }
      logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recibido. Cerrando servidor gracefully...');
  await db.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recibido. Cerrando servidor gracefully...');
  await db.destroy();
  process.exit(0);
});

// Iniciar servidor
startServer();
