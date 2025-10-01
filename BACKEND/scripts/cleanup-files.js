/**
 * Script de limpieza de archivos huérfanos
 * Elimina archivos del sistema de archivos que no tienen registro en la BD
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const db = require('../src/config/database');
const logger = require('../src/utils/logger');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

async function cleanupOrphanFiles() {
  try {
    logger.info('Iniciando limpieza de archivos huérfanos...');

    // Obtener lista de archivos en BD
    const archivosDB = await db('archivos_adjuntos')
      .select('nombre_archivo');
    
    const archivosDBSet = new Set(archivosDB.map(a => a.nombre_archivo));

    // Obtener lista de archivos en el sistema
    const archivosFS = await fs.readdir(UPLOAD_DIR);

    // Encontrar archivos huérfanos
    const huerfanos = archivosFS.filter(archivo => {
      // Ignorar archivos ocultos y .gitkeep
      if (archivo.startsWith('.')) return false;
      return !archivosDBSet.has(archivo);
    });

    // Eliminar archivos huérfanos
    let eliminados = 0;
    for (const archivo of huerfanos) {
      try {
        const rutaArchivo = path.join(UPLOAD_DIR, archivo);
        await fs.unlink(rutaArchivo);
        logger.info(`Archivo huérfano eliminado: ${archivo}`);
        eliminados++;
      } catch (error) {
        logger.error(`Error eliminando archivo ${archivo}:`, error);
      }
    }

    console.log(`✅ Limpieza completada. ${eliminados} archivos eliminados.`);
    process.exit(0);
  } catch (error) {
    logger.error('Error en limpieza de archivos:', error);
    console.error('❌ Error en limpieza:', error.message);
    process.exit(1);
  }
}

cleanupOrphanFiles();
