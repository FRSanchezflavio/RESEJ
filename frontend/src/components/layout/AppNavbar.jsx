import React, { useContext } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="light" expand="lg" style={{ borderBottom: "1px solid #e9ecef" }}>
      <Container>
        <Navbar.Brand style={{ color: "#546e7a", fontWeight: 600 }}>
          REGISTRO DE SECUESTROS JUDICIALES
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          {user ? (
            <>
              <span className="me-3">👤 {user.nombreCompleto} ({user.rol})</span>
              <Button variant="dark" size="sm" onClick={logout}>Cerrar sesión</Button>
            </>
          ) : (
            <span className="text-muted">No autenticado</span>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
