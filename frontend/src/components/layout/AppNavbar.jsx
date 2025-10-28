import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AppNavbar({
  isLimitedUser = false,
  isTemporalUser = false,
}) {
  const { user, logout } = useContext(AuthContext);
  const role = user?.rol;
  const isAdmin = role === 'administrador';
  const isConsulta = role === 'usuario_consulta';
  const showDashboard = !isLimitedUser && (isAdmin || isConsulta);
  const showSharedLinks = !isLimitedUser && (isAdmin || isConsulta);

  return (
    <Navbar
      bg="light"
      expand="lg"
      style={{ borderBottom: '1px solid #e9ecef' }}
      className="mb-3"
    >
      <Container>
        <Navbar.Brand style={{ color: '#546e7a', fontWeight: 600 }}>
          REGISTRO DE SECUESTROS JUDICIALES
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {user ? (
              <>
                {showDashboard && (
                  <Nav.Link as={NavLink} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                )}
                {showSharedLinks && (
                  <Nav.Link as={NavLink} to="/registros">
                    Registros
                  </Nav.Link>
                )}
                {showSharedLinks && (
                  <Nav.Link as={NavLink} to="/enlaces">
                    Enlaces compartidos
                  </Nav.Link>
                )}
                {isTemporalUser && (
                  <Nav.Link as={NavLink} to="/acceso-temporal">
                    Acceso compartido
                  </Nav.Link>
                )}
                {isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/cargar">
                      Carga
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/usuarios">
                      Usuarios
                    </Nav.Link>
                  </>
                )}
              </>
            ) : null}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <span className="me-3">
                  👤 {user.nombreCompleto} ({user.rol})
                </span>
                <Button variant="dark" size="sm" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <span className="text-muted">No autenticado</span>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
