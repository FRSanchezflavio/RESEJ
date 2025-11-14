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
            <span className="navbar-title-sub">
              Registro de Secuestros Judiciales
            </span>
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

          <button
            className="theme-toggle btn-logout-icon"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            {/* Icono de salida (logout) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logout-icon"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
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
