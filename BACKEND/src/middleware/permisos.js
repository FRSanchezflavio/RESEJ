/**
 * Middleware para verificar permisos específicos del usuario
 * Se utiliza en las rutas que requieren permisos específicos (crear, editar, eliminar, consultar)
 */

/**
 * Verifica si el usuario tiene un permiso específico
 * @param {string} permiso - Tipo de permiso: 'crear', 'editar', 'eliminar', 'consultar'
 * @returns {Function} Middleware de Express
 */
function verificarPermiso(permiso) {
  return (req, res, next) => {
    try {
      // El middleware authenticateToken ya debe haber agregado req.user
      if (!req.user) {
        console.log('❌ Usuario no autenticado en verificarPermiso');
        return res.status(401).json({
          success: false,
          error: 'No autenticado',
        });
      }

      // Los permisos vienen en req.user.permisos del JWT
      const permisos = req.user.permisos || {};
      const campo = `puede_${permiso}`;

      console.log(`🔍 Verificando permiso: ${permiso}`);
      console.log(`👤 Usuario: ${req.user.usuario} (${req.user.rol})`);
      console.log(`🔑 Permisos:`, permisos);

      // Verificar si tiene el permiso específico
      if (!permisos[campo]) {
        console.log(`❌ Permiso denegado: ${permiso}`);
        console.log(`   Usuario ${req.user.usuario} no tiene permiso para ${permiso}`);
        return res.status(403).json({
          success: false,
          error: `No tiene permiso para ${permiso}`,
          mensaje: `Su rol (${req.user.rol}) no permite esta acción`,
        });
      }

      console.log(`✅ Permiso concedido: ${permiso} para ${req.user.usuario}`);
      next();
    } catch (error) {
      console.error('❌ Error en verificarPermiso:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al verificar permisos',
      });
    }
  };
}

/**
 * Verifica si el usuario es administrador
 * Middleware simplificado para rutas que solo admins pueden acceder
 * @returns {Function} Middleware de Express
 */
function soloAdministrador(req, res, next) {
  try {
    if (!req.user) {
      console.log('❌ Usuario no autenticado en soloAdministrador');
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const esAdmin = req.user.rol === 'administrador' || req.user.rolNombre === 'administrador';

    console.log(`🔍 Verificando si es administrador: ${req.user.usuario}`);
    console.log(`   Rol: ${req.user.rol || req.user.rolNombre}`);

    if (!esAdmin) {
      console.log(`❌ Acceso denegado: no es administrador`);
      return res.status(403).json({
        success: false,
        error: 'Acceso denegado',
        mensaje: 'Esta acción solo está disponible para administradores',
      });
    }

    console.log(`✅ Acceso concedido: usuario es administrador`);
    next();
  } catch (error) {
    console.error('❌ Error en soloAdministrador:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al verificar permisos de administrador',
    });
  }
}

/**
 * Verifica que el usuario tenga al menos uno de los permisos especificados
 * @param {Array<string>} permisosRequeridos - Array de permisos, ej: ['crear', 'editar']
 * @returns {Function} Middleware de Express
 */
function verificarAlgunoDeEsosPermisos(permisosRequeridos) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado',
        });
      }

      const permisos = req.user.permisos || {};
      
      // Verificar si tiene al menos uno de los permisos
      const tienePermiso = permisosRequeridos.some(permiso => {
        const campo = `puede_${permiso}`;
        return permisos[campo] === true;
      });

      if (!tienePermiso) {
        console.log(`❌ Permiso denegado: necesita uno de ${permisosRequeridos.join(', ')}`);
        return res.status(403).json({
          success: false,
          error: 'No tiene los permisos necesarios',
          mensaje: `Requiere uno de los siguientes permisos: ${permisosRequeridos.join(', ')}`,
        });
      }

      console.log(`✅ Permiso concedido para ${req.user.usuario}`);
      next();
    } catch (error) {
      console.error('❌ Error en verificarAlgunoDeEsosPermisos:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al verificar permisos',
      });
    }
  };
}

module.exports = {
  verificarPermiso,
  soloAdministrador,
  verificarAlgunoDeEsosPermisos,
};
