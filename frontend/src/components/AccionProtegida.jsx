import PropTypes from 'prop-types';
import { usePermisos } from '../context/usePermisos';
import { Alert } from 'react-bootstrap';

/**
 * Componente que protege acciones/componentes basándose en permisos del usuario
 *
 * @param {string} permiso - El permiso requerido ('crear', 'editar', 'eliminar', 'consultar')
 * @param {ReactNode} children - Componentes a renderizar si tiene permiso
 * @param {ReactNode} fallback - Componente a mostrar si no tiene permiso (opcional)
 * @param {boolean} mostrarMensaje - Si debe mostrar un mensaje de alerta cuando no tiene permiso
 * @param {string} tipoElemento - Tipo de elemento para personalizar el mensaje ('botón', 'sección', 'función')
 */
const AccionProtegida = ({
  permiso,
  children,
  fallback = null,
  mostrarMensaje = false,
  tipoElemento = 'función',
}) => {
  const { tienePermiso, permisos } = usePermisos();

  // Si tiene el permiso, renderizar los children
  if (tienePermiso(permiso)) {
    return <>{children}</>;
  }

  // Si no tiene permiso y se debe mostrar mensaje
  if (mostrarMensaje) {
    return (
      <Alert variant="warning" className="mt-2">
        <Alert.Heading>⛔ Acceso Restringido</Alert.Heading>
        <p>No tienes permiso para acceder a esta {tipoElemento}.</p>
        <hr />
        <p className="mb-0">
          <strong>Tu rol:</strong>{' '}
          {permisos.rol === 'usuario_consulta'
            ? 'Usuario Consulta'
            : permisos.rol}
          <br />
          <strong>Permisos disponibles:</strong>
        </p>
        <ul className="mb-0 mt-2">
          {permisos.puede_consultar && <li>✓ Consultar y visualizar</li>}
          {permisos.puede_crear && <li>✓ Crear registros</li>}
          {permisos.puede_editar && <li>✓ Editar registros</li>}
          {permisos.puede_eliminar && <li>✓ Eliminar registros</li>}
        </ul>
      </Alert>
    );
  }

  // Si no tiene permiso y hay un fallback, mostrarlo
  if (fallback) {
    return <>{fallback}</>;
  }

  // Si no tiene permiso y no hay fallback ni mensaje, no renderizar nada
  return null;
};

AccionProtegida.propTypes = {
  permiso: PropTypes.oneOf(['crear', 'editar', 'eliminar', 'consultar'])
    .isRequired,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
  mostrarMensaje: PropTypes.bool,
  tipoElemento: PropTypes.string,
};

export default AccionProtegida;
