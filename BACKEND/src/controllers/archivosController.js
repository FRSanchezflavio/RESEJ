const FileService = require('../services/fileService');
const { createSuccessResponse } = require('../utils/helpers');
const path = require('path');

class ArchivosController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'No se proporcionó ningún archivo' });
      }

      const { registro_id } = req.body;
      if (!registro_id) {
        return res
          .status(400)
          .json({ error: 'El ID del registro es requerido' });
      }

      const archivo = await FileService.saveFile(
        req.file,
        parseInt(registro_id),
        req.user.id
      );
      res
        .status(201)
        .json(createSuccessResponse(archivo, 'Archivo subido exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async getByRegistroId(req, res, next) {
    try {
      const archivos = await FileService.getFilesByRegistroId(
        req.params.registroId
      );
      res.json(createSuccessResponse(archivos));
    } catch (error) {
      next(error);
    }
  }

  async download(req, res, next) {
    try {
      const archivo = await FileService.getFile(req.params.id);
      res.download(archivo.ruta_archivo, archivo.nombre_original);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await FileService.deleteFile(req.params.id);
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ArchivosController();
