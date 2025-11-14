const RegistroService = require('../services/registroService');
const { createSuccessResponse } = require('../utils/helpers');

class RegistrosController {
  async getAll(req, res, next) {
    try {
      console.log('🔍 [registrosController.getAll] Iniciado');
      console.log('📝 Usuario ID:', req.user?.id);
      console.log('📝 Usuario rol:', req.user?.rol);
      console.log('📝 Query params:', req.query);

      const { page, limit, estado_causa, fecha_desde, fecha_hasta } = req.query;
      const result = await RegistroService.getAllRegistros({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        estado_causa,
        fecha_desde,
        fecha_hasta,
      });

      console.log('✅ Registros obtenidos:', result.registros.length);
      console.log('📊 Resultado completo:', result);

      res.json(createSuccessResponse(result));
    } catch (error) {
      console.error('❌ Error en getAll:', error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const registro = await RegistroService.getRegistroById(req.params.id);
      res.json(createSuccessResponse(registro));
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const {
        termino,
        criterio,
        campo, // Nuevo parámetro desde frontend
        page,
        limit,
        estado_causa,
        fecha_desde,
        fecha_hasta,
      } = req.query;

      // Mapear 'campo' a 'criterio' si se proporciona
      let criterioFinal = criterio || campo || 'todos';

      // Mapear nombres de campos específicos
      if (campo === 'all') criterioFinal = 'todos';
      if (campo === 'persona') criterioFinal = 'persona';
      if (campo === 'dni') criterioFinal = 'dni';
      if (campo === 'numero_legajo') criterioFinal = 'legajo';
      if (campo === 'numero_causa') criterioFinal = 'causa';
      if (campo === 'ufi') criterioFinal = 'ufi';
      if (campo === 'numero_protocolo') criterioFinal = 'protocolo';
      if (campo === 'cadena_custodia') criterioFinal = 'cadena_custodia';
      if (campo === 'detalle_secuestro') criterioFinal = 'detalle';
      if (campo === 'of_a_cargo') criterioFinal = 'oficial';

      const result = await RegistroService.searchRegistros({
        termino,
        criterio: criterioFinal,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        estado_causa,
        fecha_desde,
        fecha_hasta,
      });
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      // Crear el registro
      const registro = await RegistroService.createRegistro(
        req.body,
        req.user.id
      );

      // Si hay archivos adjuntos, guardarlos
      if (req.files && req.files.length > 0) {
        const FileService = require('../services/fileService');
        const fs = require('fs').promises;
        const path = require('path');

        for (const file of req.files) {
          try {
            // Crear directorio uploads si no existe
            const uploadsDir = path.join(__dirname, '../../uploads');
            await fs.mkdir(uploadsDir, { recursive: true });

            // Generar nombre único para el archivo
            const timestamp = Date.now();
            const fileName = `${timestamp}-${file.originalname}`;
            const filePath = path.join(uploadsDir, fileName);

            // Guardar archivo físicamente
            await fs.writeFile(filePath, file.buffer);

            // Crear objeto file compatible con FileService
            const fileObj = {
              originalname: file.originalname,
              filename: fileName,
              path: filePath,
              mimetype: file.mimetype,
              size: file.size,
            };

            // Guardar en la base de datos
            await FileService.saveFile(fileObj, registro.id, req.user.id);
          } catch (fileError) {
            console.error('Error al guardar archivo:', fileError);
            // Continuar con los demás archivos aunque uno falle
          }
        }
      }

      res
        .status(201)
        .json(createSuccessResponse(registro, 'Registro creado exitosamente'));
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const registro = await RegistroService.updateRegistro(
        req.params.id,
        req.body
      );
      res.json(
        createSuccessResponse(registro, 'Registro actualizado exitosamente')
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await RegistroService.deleteRegistro(req.params.id);
      res.json(createSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async exportar(req, res, next) {
    try {
      const { estado_causa, fecha_desde, fecha_hasta } = req.query;
      const registros = await RegistroService.exportRegistros({
        estado_causa,
        fecha_desde,
        fecha_hasta,
      });
      res.json(createSuccessResponse(registros));
    } catch (error) {
      next(error);
    }
  }

  async estadisticas(req, res, next) {
    try {
      const stats = await RegistroService.getEstadisticas();
      res.json(createSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RegistrosController();
