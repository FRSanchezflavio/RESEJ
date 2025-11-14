const db = require('../config/database');

/**
 * Middleware para verificar permisos específicos del usuario
 * @param {string} permiso - Nombre del permiso a verificar ('puede_crear', 'puede_editar', 'puede_eliminar', 'puede_consultar')
 */
const verificarPermiso = (permiso) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId || req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Obtener permisos del usuario desde la base de datos
      const usuario = await db('usuarios')
        .select(
          'usuarios.*',
          'roles.puede_crear',
          'roles.puede_editar',
          'roles.puede_eliminar',
          'roles.puede_consultar'
        )
        .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
        .where('usuarios.id', userId)
        .first();

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Verificar el permiso específico
      if (!usuario[permiso]) {
        return res.status(403).json({
          success: false,
          message: `No tiene permiso para realizar esta acción (${permiso})`
        });
      }

      // Agregar permisos al request para uso posterior
      req.permisos = {
        puede_crear: usuario.puede_crear,
        puede_editar: usuario.puede_editar,
        puede_eliminar: usuario.puede_eliminar,
        puede_consultar: usuario.puede_consultar
      };

      next();
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario es administrador
 */
const esAdministrador = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    const usuario = await db('usuarios')
      .select('usuarios.*', 'roles.nombre as rol_nombre')
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.id', userId)
      .first();

    if (!usuario || usuario.rol_nombre !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: requiere privilegios de administrador'
      });
    }

    next();
  } catch (error) {
    console.error('Error al verificar administrador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar permisos'
    });
  }
};

module.exports = {
  verificarPermiso,
  esAdministrador
};
