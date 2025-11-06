import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { usePermisos } from '../../context/usePermisos';
import ThemeToggle from '../theme/ThemeToggle';
import './AppNavbar.css';

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const { permisos, limpiarPermisos } = usePermisos();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    limpiarPermisos();
    logout();
  };

  const isAdmin = permisos?.rol === 'administrador';

  const getInitials = name => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const getRoleBadge = () => {
    if (permisos?.rol === 'administrador') {
      return <span className="role-badge admin">👑 Administrador</span>;
    }
    return <span className="role-badge user">👤 Consulta</span>;
  };

  if (!user) return null;

  return (
    <nav className="judicial-navbar">
      <div className="navbar-container">
        {/* Logo y Branding */}
        <div className="navbar-brand">
          <div className="navbar-logo">⚖️</div>
          <div className="navbar-title">
            <span className="navbar-title-main">RESEJ</span>
            <span className="navbar-title-sub">Sistema Judicial</span>
          </div>
        </div>

        {/* Navegación Principal */}
        <ul className="navbar-nav">
          <li>
            <Link
              to="/dashboard"
              className={`nav-link ${
                location.pathname === '/dashboard' ? 'active' : ''
              }`}
            >
              📊 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/registros"
              className={`nav-link ${
                location.pathname === '/registros' ? 'active' : ''
              }`}
            >
              📁 Registros
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/cargar"
                  className={`nav-link ${
                    location.pathname === '/cargar' ? 'active' : ''
                  }`}
                >
                  📤 Cargar
                </Link>
              </li>
              <li>
                <Link
                  to="/usuarios"
                  className={`nav-link ${
                    location.pathname === '/usuarios' ? 'active' : ''
                  }`}
                >
                  👥 Usuarios
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Información de Usuario y Acciones */}
        <div className="navbar-user">
          <ThemeToggle />

          <div className="user-info">
            <div className="user-avatar">
              {getInitials(user.nombreCompleto)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.nombreCompleto}</span>
              <span className="user-role">{getRoleBadge()}</span>
            </div>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Toggle Móvil */}
        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Menú Móvil */}
      {mobileMenuOpen && (
        <div className="navbar-menu-mobile open">
          <Link
            to="/dashboard"
            className={`nav-link ${
              location.pathname === '/dashboard' ? 'active' : ''
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/registros"
            className={`nav-link ${
              location.pathname === '/registros' ? 'active' : ''
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            📁 Registros
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/cargar"
                className={`nav-link ${
                  location.pathname === '/cargar' ? 'active' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                📤 Cargar
              </Link>
              <Link
                to="/usuarios"
                className={`nav-link ${
                  location.pathname === '/usuarios' ? 'active' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                👥 Usuarios
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
