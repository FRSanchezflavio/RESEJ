const fs = require('fs').promises;
const path = require('path');
const Archivo = require('../models/Archivo');
const { UPLOAD_DIR } = require('../config/multer');
const { validateFileMagicBytes } = require('../utils/helpers');
const logger = require('../utils/logger');

class FileService {
  /**
   * Guardar archivo subido
   */
  static async saveFile(file, registroId, usuarioId) {
    try {
      // Leer los primeros bytes para validación
      const buffer = await fs.readFile(file.path);
      const isValid = validateFileMagicBytes(buffer, file.mimetype);

      if (!isValid) {
        // Eliminar archivo si la validación falla
        await fs.unlink(file.path);
        throw new Error('El archivo no coincide con su tipo MIME declarado');
      }

      // Guardar información en la base de datos
      const archivoData = {
        registro_id: registroId,
        nombre_original: file.originalname,
        nombre_archivo: file.filename,
        ruta_archivo: file.path,
        tipo_mime: file.mimetype,
        tamano_bytes: file.size,
        subido_por: usuarioId
      };

      const archivo = await Archivo.create(archivoData);

      logger.info(`Archivo guardado: ${file.originalname} (ID: ${archivo.id})`);

      return archivo;
    } catch (error) {
      // Limpiar archivo si hay error
      try {
        await fs.unlink(file.path);
      } catch (unlinkError) {
        logger.error(`Error al eliminar archivo: ${unlinkError.message}`);
      }
      
      logger.error(`Error al guardar archivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener archivo por ID
   */
  static async getFile(id) {
    try {
      const archivo = await Archivo.findById(id);
      
      if (!archivo) {
        throw new Error('Archivo no encontrado');
      }

      // Verificar que el archivo físico existe
      try {
        await fs.access(archivo.ruta_archivo);
      } catch {
        throw new Error('El archivo físico no existe en el sistema');
      }

      return archivo;
    } catch (error) {
      logger.error(`Error al obtener archivo ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener archivos de un registro
   */
  static async getFilesByRegistroId(registroId) {
    try {
      return await Archivo.findByRegistroId(registroId);
    } catch (error) {
      logger.error(`Error al obtener archivos del registro ${registroId}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Eliminar archivo
   */
  static async deleteFile(id) {
    try {
      const archivo = await Archivo.delete(id);
      
      if (!archivo) {
        throw new Error('Archivo no encontrado');
      }

      // Eliminar archivo físico
      try {
        await fs.unlink(archivo.ruta_archivo);
        logger.info(`Archivo físico eliminado: ${archivo.ruta_archivo}`);
      } catch (error) {
        logger.warn(`No se pudo eliminar el archivo físico: ${error.message}`);
      }

      logger.info(`Archivo eliminado: ${archivo.nombre_original} (ID: ${id})`);

      return { message: 'Archivo eliminado exitosamente', archivo };
    } catch (error) {
      logger.error(`Error al eliminar archivo ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de archivos
   */
  static async getEstadisticas() {
    try {
      return await Archivo.getEstadisticas();
    } catch (error) {
      logger.error(`Error al obtener estadísticas de archivos: ${error.message}`);
      throw error;
    }
  }

  /**
   * Limpiar archivos huérfanos (sin registro en BD)
   */
  static async cleanOrphanFiles() {
    try {
      const files = await fs.readdir(UPLOAD_DIR);
      let cleaned = 0;

      for (const file of files) {
        if (file === '.gitkeep') continue;

        const archivo = await Archivo.findById({ nombre_archivo: file });
        
        if (!archivo) {
          const filePath = path.join(UPLOAD_DIR, file);
          await fs.unlink(filePath);
          cleaned++;
          logger.info(`Archivo huérfano eliminado: ${file}`);
        }
      }

      return { cleaned, message: `${cleaned} archivos huérfanos eliminados` };
    } catch (error) {
      logger.error(`Error al limpiar archivos huérfanos: ${error.message}`);
      throw error;
    }
  }
}

module.exports = FileService;
