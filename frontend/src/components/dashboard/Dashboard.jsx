import React, { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { usePermisos } from '../../context/usePermisos';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { permisos } = usePermisos();
  const navigate = useNavigate();

  const isAdmin = user?.rol === 'administrador';
  const puedeCargar = permisos.puede_crear || isAdmin;

  return (
    <div className="dashboard-container">
      {/* Header con gradiente */}
      <div className="dashboard-header">
        <h2>👋 Bienvenido, {user?.nombre || user?.usuario}</h2>
        <p className="user-info">
          <span className="user-role">{user?.rol}</span>
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h5>🚀 Accesos Rápidos</h5>
        <div className="action-cards">
          {/* Buscar Registros */}
          <div
            className="action-card search"
            onClick={() => navigate('/registros')}
          >
            <div className="action-card-icon">🔍</div>
            <h6 className="action-card-title">Buscar Registros</h6>
            <p className="action-card-desc">
              Consulta y descarga información de secuestros registrados
            </p>
            <Button variant="outline-primary">Ir a Búsqueda</Button>
          </div>

          {/* Cargar Registros */}
          <div
            className={`action-card upload ${!puedeCargar ? 'disabled' : ''}`}
            onClick={() => puedeCargar && navigate('/cargar')}
          >
            <div className="action-card-icon">📤</div>
            <h6 className="action-card-title">Cargar Registros</h6>
            <p className="action-card-desc">
              {puedeCargar
                ? 'Carga nuevos casos de secuestros al sistema'
                : 'No tiene permisos para cargar registros'}
            </p>
            <Button
              variant={puedeCargar ? 'success' : 'secondary'}
              disabled={!puedeCargar}
            >
              {puedeCargar ? 'Cargar Nuevo' : 'Sin Acceso'}
            </Button>
          </div>

          {/* Gestionar Usuarios - Solo Admin */}
          {isAdmin && (
            <div
              className="action-card users"
              onClick={() => navigate('/usuarios')}
            >
              <div className="action-card-icon">👥</div>
              <h6 className="action-card-title">Gestionar Usuarios</h6>
              <p className="action-card-desc">
                Administra usuarios y permisos del sistema
              </p>
              <Button variant="warning">Administrar</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
