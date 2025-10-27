import React, { useContext } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isAdmin = user?.rol === "administrador";

  return (
    <Container style={{ paddingTop: 20 }}>
      <Row>
        <Col>
          <Card className="mb-3 p-3">
            <h5>Accesos r√°pidos</h5>
            <div className="d-flex gap-2 mt-3 flex-wrap">
              <Button variant="outline-dark" onClick={() => navigate("/registros")}>
                Ì¥ç Buscar Registros
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={() => navigate("/enlaces")}
                className="d-flex align-items-center gap-2"
              >
                <Share2 size={18} /> Enlaces Compartidos
              </Button>
              {isAdmin ? (
                <>
                  <Button variant="dark" onClick={() => navigate("/cargar")}>
                    Ì≥Ñ Cargar Registros
                  </Button>
                  <Button variant="outline-dark" onClick={() => navigate("/usuarios")}>
                    Ì±• Gestionar Usuarios
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" disabled>Ì≥Ñ Cargar Registros</Button>
                  <Button variant="secondary" disabled>Ì±• Gestionar Usuarios</Button>
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
