import React, { useContext } from "react";
import { Container, Card, Row, Col, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { usePermisos } from "../../context/usePermisos";
import { useNavigate } from "react-router-dom";
import AccionProtegida from "../AccionProtegida";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { permisos } = usePermisos();
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: 20 }}>
      <Row>
        <Col>
          <Card className="mb-3 p-3">
            <h5>Bienvenido/a, {user?.nombreCompleto}</h5>
            <p className="text-muted mb-0">
              Rol:{' '}
              {permisos?.rol === 'administrador'
                ? '👑 Administrador'
                : '👤 Usuario Consulta'}
            </p>
          </Card>

          {permisos?.rol === 'usuario_consulta' && (
            <Alert variant="info" className="mb-3">
              <Alert.Heading>ℹ️ Tu acceso es de solo lectura</Alert.Heading>
              <p className="mb-0">
                Puedes buscar y visualizar registros, pero no crear, editar o
                eliminar información.
              </p>
            </Alert>
          )}

          <Card className="mb-3 p-3">
            <h5>Accesos rápidos</h5>
            <div className="d-flex gap-2 mt-3 flex-wrap">
              <Button
                variant="outline-dark"
                onClick={() => navigate('/registros')}
              >
                🔍 Buscar Registros
              </Button>

              <AccionProtegida permiso="crear">
                <Button variant="dark" onClick={() => navigate('/cargar')}>
                  📄 Cargar Registros
                </Button>
              </AccionProtegida>

              <AccionProtegida
                permiso="crear"
                fallback={
                  <Button
                    variant="secondary"
                    disabled
                    title="Solo administradores"
                  >
                    📄 Cargar Registros
                  </Button>
                }
              />

              <AccionProtegida permiso="crear">
                <Button
                  variant="outline-dark"
                  onClick={() => navigate('/usuarios')}
                >
                  👥 Gestionar Usuarios
                </Button>
              </AccionProtegida>

              <AccionProtegida
                permiso="crear"
                fallback={
                  <Button
                    variant="secondary"
                    disabled
                    title="Solo administradores"
                  >
                    👥 Gestionar Usuarios
                  </Button>
                }
              />
            </div>
          </Card>

          <Card className="p-3">
            <h6>Tus permisos:</h6>
            <ul className="mb-0">
              {permisos?.puede_consultar && (
                <li>✓ Consultar y visualizar registros</li>
              )}
              {permisos?.puede_crear && <li>✓ Crear nuevos registros</li>}
              {permisos?.puede_editar && <li>✓ Editar registros existentes</li>}
              {permisos?.puede_eliminar && <li>✓ Eliminar registros</li>}
            </ul>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
