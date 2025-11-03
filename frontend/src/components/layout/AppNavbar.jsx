import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { usePermisos } from "../../context/usePermisos";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);
  const { permisos, limpiarPermisos } = usePermisos();

  const handleLogout = () => {
    limpiarPermisos();
    logout();
  };

  const rolDisplay =
    permisos?.rol === 'administrador'
      ? '👑 Administrador'
      : permisos?.rol === 'usuario_consulta'
      ? '👤 Consulta'
      : user?.rol || '';

  return (
    <Navbar
      bg="light"
      expand="lg"
      style={{ borderBottom: '1px solid #e9ecef' }}
    >
      <Container>
        <Navbar.Brand style={{ color: '#546e7a', fontWeight: 600 }}>
          REGISTRO DE SECUESTROS JUDICIALES
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {user ? (
            <>
              <span className="me-3">
                {user.nombreCompleto} ({rolDisplay})
              </span>
              <Button variant="dark" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <span className="text-muted">No autenticado</span>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
