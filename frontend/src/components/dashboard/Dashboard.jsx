import React, { useContext } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.rol === "administrador";

  return (
    <Container style={{ paddingTop: 20 }}>
      <Row>
        <Col>
          <Card className="mb-3 p-3">
            <h5>Accesos rápidos</h5>
            <div className="d-flex gap-2 mt-3">
              <Button variant="outline-dark" onClick={() => navigate("/registros")}>
                🔍 Buscar Registros
              </Button>
              {isAdmin ? (
                <>
                  <Button variant="dark" onClick={() => navigate("/cargar")}>
                    📄 Cargar Registros
                  </Button>
                  <Button variant="outline-dark" onClick={() => navigate("/usuarios")}>
                    👥 Gestionar Usuarios
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" disabled>📄 Cargar Registros</Button>
                  <Button variant="secondary" disabled>👥 Gestionar Usuarios</Button>
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
