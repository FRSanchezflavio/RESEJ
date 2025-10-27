import React from 'react';
import { Share2, Trash2, Lock } from 'lucide-react';

const TablaEnlaces = ({ enlaces, loading, onEliminar, onRevocar }) => {
  if (loading) {
    return <div className="spinner">Cargando enlaces...</div>;
  }

  if (!enlaces || enlaces.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay enlaces compartidos aún</p>
      </div>
    );
  }

  const isExpired = fecha => {
    if (!fecha) return false;
    return new Date(fecha) < new Date();
  };

  return (
    <div className="tabla-enlaces">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Accesos</th>
            <th>Creado</th>
            <th>Expira</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {enlaces.map(enlace => (
            <tr
              key={enlace.id}
              className={isExpired(enlace.fecha_expiracion) ? 'expired' : ''}
            >
              <td>
                <div className="title-cell">
                  {enlace.requiere_contrasena && <Lock size={16} />}
                  <span>{enlace.titulo || 'Sin título'}</span>
                </div>
              </td>
              <td>{enlace.tipo}</td>
              <td>{enlace.accesos || 0}</td>
              <td>{new Date(enlace.fecha_creacion).toLocaleDateString()}</td>
              <td>
                {enlace.fecha_expiracion
                  ? new Date(enlace.fecha_expiracion).toLocaleDateString()
                  : 'Sin expiración'}
              </td>
              <td>
                <span
                  className={`badge ${
                    isExpired(enlace.fecha_expiracion)
                      ? 'badge-danger'
                      : 'badge-success'
                  }`}
                >
                  {isExpired(enlace.fecha_expiracion) ? 'Expirado' : 'Activo'}
                </span>
              </td>
              <td className="actions-cell">
                <button
                  className="btn btn-icon"
                  title="Copiar enlace"
                  onClick={() => {
                    const enlaceUrl = `${window.location.origin}/enlace/${enlace.token}`;
                    navigator.clipboard.writeText(enlaceUrl);
                    alert('Enlace copiado!');
                  }}
                >
                  <Share2 size={18} />
                </button>
                {!isExpired(enlace.fecha_expiracion) && (
                  <button
                    className="btn btn-icon btn-danger"
                    title="Revocar acceso"
                    onClick={() => onRevocar(enlace.id)}
                  >
                    <Lock size={18} />
                  </button>
                )}
                <button
                  className="btn btn-icon btn-danger"
                  title="Eliminar"
                  onClick={() => onEliminar(enlace.id)}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEnlaces;
