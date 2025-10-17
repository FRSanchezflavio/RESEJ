/**
 * Servicio: Respuestas Estandarizadas para Usuario Consulta
 * RE.SE.J - Control de Acceso
 *
 * Proporciona respuestas pre-formateadas según el estado del usuario
 * y el tipo de operación solicitada.
 */

const { MENSAJES } = require('../config/promptSystemConsulta');
const logger = require('../utils/logger');

/**
 * Servicio de respuestas para usuario consulta
 */
class RespuestaConsultaService {
  /**
   * Respuesta de acceso permitido (lectura)
   * @param {object} datos - Los datos a retornar
   * @param {string} mensaje - Mensaje adicional opcional
   * @returns {object} Respuesta formateada
   */
  static respuestaLecturaExitosa(datos, mensaje = null) {
    return {
      success: true,
      data: datos,
      message: mensaje || 'Consulta realizada exitosamente',
      timestamp: new Date().toISOString(),
      tipo: 'lectura',
    };
  }

  /**
   * Respuesta de búsqueda exitosa
   * @param {object} resultado - Resultado de la búsqueda con registros y paginación
   * @returns {object} Respuesta formateada
   */
  static respuestaBusquedaExitosa(resultado) {
    return {
      success: true,
      data: resultado,
      message: `Se encontraron ${resultado.total || 0} registros`,
      timestamp: new Date().toISOString(),
      opciones_disponibles: [
        '✓ Ver detalles adicionales',
        '✓ Descargar documentos',
        '✓ Generar reporte',
        '✓ Nueva búsqueda',
      ],
    };
  }

  /**
   * Respuesta cuando no hay resultados
   * @returns {object} Respuesta formateada
   */
  static respuestaSinResultados() {
    return {
      success: true,
      data: [],
      message: 'No se encontraron registros que coincidan con tu búsqueda',
      sugerencias: [
        'Intenta con criterios de búsqueda más amplios',
        'Verifica la ortografía de los datos',
        'Intenta con fechas diferentes',
      ],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de descarga exitosa
   * @param {string} nombreArchivo - Nombre del archivo
   * @param {string} tipo - Tipo de archivo (PDF, imagen, etc.)
   * @returns {object} Respuesta formateada
   */
  static respuestaDescargaExitosa(nombreArchivo, tipo = 'PDF') {
    return {
      success: true,
      message: `Descargando ${tipo}: ${nombreArchivo}`,
      archivo: nombreArchivo,
      tipo: tipo,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de acceso denegado - Creación
   * @param {string} tipo - Tipo de recurso (registro, usuario, etc.)
   * @returns {object} Respuesta formateada
   */
  static respuestaAccesoDenegadoCreacion(tipo = 'registro') {
    logger.warn(`Intento de creación bloqueado para usuario consulta: ${tipo}`);

    return {
      success: false,
      error: MENSAJES.acceso_denegado_creacion,
      accion_bloqueada: 'crear',
      tipo_recurso: tipo,
      statusCode: 403,
      rol_requerido: 'administrador',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de acceso denegado - Edición
   * @param {string} tipo - Tipo de recurso (registro, usuario, etc.)
   * @returns {object} Respuesta formateada
   */
  static respuestaAccesoDenegadoEdicion(tipo = 'registro') {
    logger.warn(`Intento de edición bloqueado para usuario consulta: ${tipo}`);

    return {
      success: false,
      error: MENSAJES.acceso_denegado_edicion,
      accion_bloqueada: 'editar',
      tipo_recurso: tipo,
      statusCode: 403,
      rol_requerido: 'administrador',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de acceso denegado - Eliminación
   * @param {string} tipo - Tipo de recurso (registro, usuario, etc.)
   * @returns {object} Respuesta formateada
   */
  static respuestaAccesoDenegadoEliminacion(tipo = 'registro') {
    logger.warn(
      `Intento de eliminación bloqueado para usuario consulta: ${tipo}`
    );

    return {
      success: false,
      error: MENSAJES.acceso_denegado_eliminacion,
      accion_bloqueada: 'eliminar',
      tipo_recurso: tipo,
      statusCode: 403,
      rol_requerido: 'administrador',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de acceso denegado - Gestión de usuarios
   * @returns {object} Respuesta formateada
   */
  static respuestaAccesoDenegadoGestionUsuarios() {
    logger.warn(
      'Intento de gestión de usuarios bloqueado para usuario consulta'
    );

    return {
      success: false,
      error: MENSAJES.acceso_denegado_usuarios,
      accion_bloqueada: 'gestionar_usuarios',
      statusCode: 403,
      rol_requerido: 'administrador',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta para intento de bypass
   * @returns {object} Respuesta formateada
   */
  static respuestaIntentoBypas() {
    logger.error('Intento de bypass detectado en usuario consulta');

    return {
      success: false,
      error: MENSAJES.intento_bypass,
      tipo_intento: 'bypass_seguridad',
      statusCode: 403,
      timestamp: new Date().toISOString(),
      alerta: 'Este intento ha sido registrado y reportado',
    };
  }

  /**
   * Respuesta para solicitud sospechosa
   * @returns {object} Respuesta formateada
   */
  static respuestaSolicitudSospechosa() {
    logger.error('Solicitud sospechosa detectada en usuario consulta');

    return {
      success: false,
      error: MENSAJES.solicitud_sospechosa,
      tipo_intento: 'solicitud_sospechosa',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      alerta: 'Este intento ha sido registrado',
    };
  }

  /**
   * Respuesta informativa sobre permisos del usuario
   * @returns {object} Respuesta formateada
   */
  static respuestaInformativaPermisos() {
    return {
      success: true,
      rol: 'usuario_consulta',
      nombre_rol: 'Usuario de Consulta',
      permisos: {
        permitidos: [
          '✅ Buscar registros',
          '✅ Visualizar detalles',
          '✅ Descargar documentos',
          '✅ Ver reportes',
        ],
        denegados: [
          '❌ Crear registros',
          '❌ Editar registros',
          '❌ Eliminar registros',
          '❌ Gestionar usuarios',
          '❌ Acceder a auditoría',
        ],
      },
      soporte: {
        email: 'soporte-ti@policia.tucuman.gob.ar',
        horario: 'Lunes a Viernes 8:00-17:00',
        telefono: '+54 (381) XXXX-XXXX',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de visualización de registro con detalles
   * @param {object} registro - Datos del registro
   * @returns {object} Respuesta formateada
   */
  static respuestaVisualizacionRegistro(registro) {
    return {
      success: true,
      data: registro,
      message: 'Aquí están los detalles completos del registro',
      opciones_disponibles: [
        'Descargar archivos adjuntos',
        'Generar reporte PDF',
        'Ver personas relacionadas',
        'Ver historial',
      ],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta de error genérico para usuario consulta
   * @param {string} mensaje - Mensaje de error
   * @returns {object} Respuesta formateada
   */
  static respuestaError(mensaje) {
    return {
      success: false,
      error: mensaje,
      sugerencias: [
        'Verifica que los datos sean correctos',
        'Intenta nuevamente',
        'Si el problema persiste, contacta soporte',
      ],
      soporte: 'soporte-ti@policia.tucuman.gob.ar',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Respuesta informativa bienvenida
   * @param {object} usuario - Datos del usuario
   * @returns {object} Respuesta formateada
   */
  static respuestaBienvenida(usuario) {
    return {
      success: true,
      message: `Bienvenido, ${usuario.nombreCompleto}`,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombreCompleto,
        rol: usuario.rol,
        rol_nombre: 'Usuario de Consulta',
      },
      funcionalidades: {
        disponibles: [
          '🔍 Búsqueda avanzada de registros',
          '👁️ Visualizar detalles completos',
          '📥 Descargar archivos adjuntos',
          '📊 Generar reportes',
        ],
      },
      informacion: {
        'Tu rol': 'Usuario de Consulta (Solo Lectura)',
        'Acceso a': 'Búsqueda y visualización de datos',
        Limitaciones: 'No puedes crear, editar o eliminar registros',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validar si una acción está permitida
   * @param {string} accion - Acción a validar
   * @param {string} rol - Rol del usuario
   * @returns {boolean}
   */
  static esAccionPermitida(accion, rol = 'usuario_consulta') {
    const accionesPermitidas = [
      'secuestros:listar',
      'secuestros:visualizar',
      'secuestros:buscar',
      'secuestros:exportar',
      'personas:listar',
      'personas:visualizar',
      'objetos:listar',
      'objetos:visualizar',
      'dependencias:listar',
      'archivos:descargar',
      'reportes:ver',
    ];

    return rol === 'usuario_consulta'
      ? accionesPermitidas.includes(accion)
      : true;
  }
}

module.exports = RespuestaConsultaService;
