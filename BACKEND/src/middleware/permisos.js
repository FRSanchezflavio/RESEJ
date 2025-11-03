const db = require('../config/database');

/**
 * Middleware para verificar permisos específicos
 * @param {string} permiso - El tipo de permiso a verificar ('crear', 'editar', 'eliminar', 'consultar')
 * @returns {Function} Middleware function
 */
const verificarPermiso = permiso => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Obtener el rol y permisos del usuario
      const usuario = await db('usuarios')
        .select(
          'usuarios.id',
          'usuarios.rol_id',
          'roles.nombre as rol_nombre',
          'roles.puede_crear',
          'roles.puede_editar',
          'roles.puede_eliminar',
          'roles.puede_consultar'
        )
        .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
        .where('usuarios.id', userId)
        .first();

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Si no tiene rol asignado, denegar acceso
      if (!usuario.rol_id) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: 'No tienes un rol asignado',
        });
      }

      // Mapear el permiso solicitado a la columna correspondiente
      const mapaPermisos = {
        crear: 'puede_crear',
        editar: 'puede_editar',
        eliminar: 'puede_eliminar',
        consultar: 'puede_consultar',
      };

      const columnaPermiso = mapaPermisos[permiso];

      if (!columnaPermiso) {
        return res.status(400).json({
          error: 'Permiso inválido',
          mensaje: `El permiso "${permiso}" no es válido`,
        });
      }

      // Verificar si el usuario tiene el permiso
      if (!usuario[columnaPermiso]) {
        return res.status(403).json({
          error: 'Acceso denegado',
          mensaje: `No tienes permiso para ${permiso} en este recurso`,
          rol: usuario.rol_nombre,
        });
      }

      // Agregar los permisos al objeto req.user para uso posterior
      req.user.permisos = {
        puede_crear: usuario.puede_crear,
        puede_editar: usuario.puede_editar,
        puede_eliminar: usuario.puede_eliminar,
        puede_consultar: usuario.puede_consultar,
        rol: usuario.rol_nombre,
      };

      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return res.status(500).json({
        error: 'Error al verificar permisos',
        mensaje: error.message,
      });
    }
  };
};

/**
 * Middleware para obtener y agregar los permisos del usuario a req.user
 * No bloquea el acceso, solo agrega información
 */
const obtenerPermisos = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const usuario = await db('usuarios')
      .select(
        'usuarios.id',
        'usuarios.rol_id',
        'roles.nombre as rol_nombre',
        'roles.puede_crear',
        'roles.puede_editar',
        'roles.puede_eliminar',
        'roles.puede_consultar'
      )
      .leftJoin('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.id', userId)
      .first();

    if (usuario && usuario.rol_id) {
      req.user.permisos = {
        puede_crear: usuario.puede_crear,
        puede_editar: usuario.puede_editar,
        puede_eliminar: usuario.puede_eliminar,
        puede_consultar: usuario.puede_consultar,
        rol: usuario.rol_nombre,
      };
    } else {
      req.user.permisos = {
        puede_crear: false,
        puede_editar: false,
        puede_eliminar: false,
        puede_consultar: false,
        rol: 'sin_rol',
      };
    }

    next();
  } catch (error) {
    console.error('Error obteniendo permisos:', error);
    // No bloquear la petición, solo continuar sin permisos
    req.user.permisos = {
      puede_crear: false,
      puede_editar: false,
      puede_eliminar: false,
      puede_consultar: false,
      rol: 'error',
    };
    next();
  }
};

module.exports = {
  verificarPermiso,
  obtenerPermisos,
};
