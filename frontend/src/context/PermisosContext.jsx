/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Exportar el contexto para que pueda ser usado en usePermisos.js
export const PermisosContext = createContext();

// Componente Provider
export const PermisosProvider = ({ children }) => {
  const [permisos, setPermisos] = useState(() => {
    // Cargar permisos desde localStorage al iniciar
    const permisosGuardados = localStorage.getItem('permisos');
    if (permisosGuardados) {
      try {
        return JSON.parse(permisosGuardados);
      } catch (error) {
        console.error('Error al parsear permisos del localStorage:', error);
        return {
          puede_crear: false,
          puede_editar: false,
          puede_eliminar: false,
          puede_consultar: false,
          rol: 'sin_rol',
        };
      }
    }
    return {
      puede_crear: false,
      puede_editar: false,
      puede_eliminar: false,
      puede_consultar: false,
      rol: 'sin_rol',
    };
  });

  // Sincronizar con localStorage cuando cambien los permisos
  useEffect(() => {
    localStorage.setItem('permisos', JSON.stringify(permisos));
  }, [permisos]);

  const actualizarPermisos = nuevosPermisos => {
    setPermisos(nuevosPermisos);
  };

  const limpiarPermisos = () => {
    const permisosVacios = {
      puede_crear: false,
      puede_editar: false,
      puede_eliminar: false,
      puede_consultar: false,
      rol: 'sin_rol',
    };
    setPermisos(permisosVacios);
    localStorage.removeItem('permisos');
  };

  const tienePermiso = permiso => {
    if (!permisos) return false;

    const mapaPermisos = {
      crear: permisos.puede_crear,
      editar: permisos.puede_editar,
      eliminar: permisos.puede_eliminar,
      consultar: permisos.puede_consultar,
    };

    return mapaPermisos[permiso] || false;
  };

  const esAdministrador = () => {
    return permisos.rol === 'administrador';
  };

  const esConsulta = () => {
    return permisos.rol === 'usuario_consulta';
  };

  const value = {
    permisos,
    actualizarPermisos,
    limpiarPermisos,
    tienePermiso,
    esAdministrador,
    esConsulta,
  };

  return (
    <PermisosContext.Provider value={value}>
      {children}
    </PermisosContext.Provider>
  );
};

PermisosProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
