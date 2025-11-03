import { useContext } from 'react';
import { PermisosContext } from './PermisosContext';

export const usePermisos = () => {
  const context = useContext(PermisosContext);
  if (!context) {
    throw new Error('usePermisos debe usarse dentro de un PermisosProvider');
  }
  return context;
};
