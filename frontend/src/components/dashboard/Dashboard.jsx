import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { usePermisos } from '../../context/usePermisos';
import { useNavigate } from 'react-router-dom';
import AccionProtegida from '../AccionProtegida';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { permisos } = usePermisos();
  const navigate = useNavigate();

  const isAdmin = permisos?.rol === 'administrador';

  return (
    <div className="dashboard-container">
      {/* Header de Bienvenida */}
      <div className="dashboard-header">
        <div className="welcome-card">
          <div className="welcome-content">
            <h1 className="welcome-title">
              ¡Bienvenido/a, {user?.nombreCompleto}!
            </h1>
            <p className="welcome-subtitle">
              <span className="user-role-badge">
                {isAdmin ? '👑 Administrador' : '👤 Usuario Consulta'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="stats-grid">
        <div className="stat-card-dashboard primary">
          <div className="stat-icon-dashboard primary">📊</div>
          <div className="stat-content-dashboard">
            <div className="stat-label-dashboard">Sistema</div>
            <div className="stat-value-dashboard">Activo</div>
          </div>
        </div>

        <div className="stat-card-dashboard success">
          <div className="stat-icon-dashboard success">✓</div>
          <div className="stat-content-dashboard">
            <div className="stat-label-dashboard">Estado</div>
            <div className="stat-value-dashboard">Operativo</div>
          </div>
        </div>

        <div className="stat-card-dashboard warning">
          <div className="stat-icon-dashboard warning">👤</div>
          <div className="stat-content-dashboard">
            <div className="stat-label-dashboard">Usuario</div>
            <div className="stat-value-dashboard">{user?.username}</div>
          </div>
        </div>
      </div>

      {/* Alerta para usuarios de consulta */}
      {!isAdmin && (
        <div className="info-alert-dashboard">
          <h3 className="alert-title">ℹ️ Acceso de Solo Lectura</h3>
          <p className="alert-description">
            Tu cuenta tiene permisos de consulta. Puedes buscar y visualizar
            registros, pero no crear, editar o eliminar información del sistema.
          </p>
        </div>
      )}

      {/* Accesos Rápidos */}
      <section className="quick-actions-section">
        <h2 className="section-title-dashboard">🚀 Accesos Rápidos</h2>
        <div className="quick-actions-grid">
          <button
            className="action-button"
            onClick={() => navigate('/registros')}
          >
            <span className="action-icon">🔍</span>
            <div>
              <div className="action-label">Buscar Registros</div>
              <div className="action-description">Consultar expedientes</div>
            </div>
          </button>

          <AccionProtegida
            permiso="crear"
            fallback={
              <button
                className="action-button"
                disabled
                title="Solo administradores"
              >
                <span className="action-icon">📤</span>
                <div>
                  <div className="action-label">Cargar Registros</div>
                  <div className="action-description">Acceso restringido</div>
                </div>
              </button>
            }
          >
            <button
              className="action-button"
              onClick={() => navigate('/cargar')}
            >
              <span className="action-icon">📤</span>
              <div>
                <div className="action-label">Cargar Registros</div>
                <div className="action-description">Subir expedientes</div>
              </div>
            </button>
          </AccionProtegida>

          <AccionProtegida
            permiso="crear"
            fallback={
              <button
                className="action-button"
                disabled
                title="Solo administradores"
              >
                <span className="action-icon">👥</span>
                <div>
                  <div className="action-label">Gestionar Usuarios</div>
                  <div className="action-description">Acceso restringido</div>
                </div>
              </button>
            }
          >
            <button
              className="action-button"
              onClick={() => navigate('/usuarios')}
            >
              <span className="action-icon">👥</span>
              <div>
                <div className="action-label">Gestionar Usuarios</div>
                <div className="action-description">Administrar accesos</div>
              </div>
            </button>
          </AccionProtegida>
        </div>
      </section>

      {/* Permisos del Usuario */}
      <div className="permissions-card">
        <h3 className="permissions-title">🔐 Tus Permisos</h3>
        <ul className="permissions-list">
          {permisos?.puede_consultar && (
            <li className="permission-item">
              <span className="permission-icon">✓</span>
              <span className="permission-text">
                Consultar y visualizar registros
              </span>
            </li>
          )}
          {permisos?.puede_crear && (
            <li className="permission-item">
              <span className="permission-icon">✓</span>
              <span className="permission-text">Crear nuevos registros</span>
            </li>
          )}
          {permisos?.puede_editar && (
            <li className="permission-item">
              <span className="permission-icon">✓</span>
              <span className="permission-text">
                Editar registros existentes
              </span>
            </li>
          )}
          {permisos?.puede_eliminar && (
            <li className="permission-item">
              <span className="permission-icon">✓</span>
              <span className="permission-text">Eliminar registros</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
