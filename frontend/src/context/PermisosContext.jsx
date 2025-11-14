import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PermisosContext = createContext();

export const PermisosProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [permisos, setPermisos] = useState({
    puede_crear: false,
    puede_editar: false,
    puede_eliminar: false,
    puede_consultar: false,
  });

  useEffect(() => {
    if (user && user.permisos) {
      setPermisos({
        puede_crear: user.permisos.puede_crear || false,
        puede_editar: user.permisos.puede_editar || false,
        puede_eliminar: user.permisos.puede_eliminar || false,
        puede_consultar: user.permisos.puede_consultar || false,
      });
    } else {
      setPermisos({
        puede_crear: false,
        puede_editar: false,
        puede_eliminar: false,
        puede_consultar: false,
      });
    }
  }, [user]);

  return (
    <PermisosContext.Provider value={{ permisos }}>
      {children}
    </PermisosContext.Provider>
  );
};
