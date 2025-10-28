import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import { accessSharedLinkPublic } from '../../api/api';

const initialState = {
  token: '',
  contrasena: '',
};

const statusFor = enlace => {
  if (!enlace) return { variant: 'secondary', label: 'Sin datos' };
  if (enlace.revocado) return { variant: 'secondary', label: 'Revocado' };
  if (enlace.fecha_expiracion) {
    const expired = new Date(enlace.fecha_expiracion) <= new Date();
    if (expired) return { variant: 'danger', label: 'Expirado' };
  }
  if (enlace.max_accesos && enlace.accesos >= enlace.max_accesos) {
    return { variant: 'warning', label: 'Límite alcanzado' };
  }
  return { variant: 'success', label: 'Vigente' };
};

const formatDate = value => (value ? new Date(value).toLocaleString() : '-');

export default function TemporalAccess() {
  const [form, setForm] = useState({ ...initialState });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [enlace, setEnlace] = useState(null);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm({ ...initialState });
    setError(null);
    setRequiresPassword(false);
    setEnlace(null);
  };

  const requestAccess = useCallback(async ({ token, contrasena }) => {
    setLoading(true);
    setError(null);
    setRequiresPassword(false);
    try {
      const payload = contrasena ? { contrasena } : {};
      const response = await accessSharedLinkPublic(token, payload);
      const data = response.data?.data ?? {};
      setEnlace(data);
    } catch (err) {
      const responsePayload = err?.response?.data ?? {};
      const status = err?.response?.status;
      const needsPassword =
        responsePayload.necesitaContrasena || status === 401;
      if (needsPassword) {
        setRequiresPassword(true);
        if (responsePayload.error) {
          setError(responsePayload.error);
        }
      } else {
        setError(
          responsePayload.error || 'No se pudo acceder al enlace solicitado'
        );
      }
      setEnlace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!form.token) return;
    await requestAccess(form);
  };

  const status = useMemo(() => statusFor(enlace), [enlace]);

  return (
    <Container style={{ paddingTop: 20, maxWidth: 900 }}>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="mb-1">Acceso a enlaces compartidos</h4>
                <p className="text-muted mb-0">
                  Consulte registros habilitados ingresando el token entregado.
                </p>
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleReset}
              >
                Limpiar
              </Button>
            </div>

            <Form onSubmit={handleSubmit} className="mb-3">
              <Row className="g-2">
                <Col md={8}>
                  <Form.Label>Token de enlace</Form.Label>
                  <Form.Control
                    name="token"
                    value={form.token}
                    placeholder="Ej: R3S3J-ABC..."
                    minLength={10}
                    maxLength={128}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button type="submit" className="w-100" disabled={loading}>
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Consultar'
                    )}
                  </Button>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form.Label>Contraseña (si corresponde)</Form.Label>
                  <Form.Control
                    name="contrasena"
                    value={form.contrasena}
                    type="password"
                    placeholder="Solo necesaria si el enlace lo requiere"
                    minLength={8}
                    maxLength={128}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
            </Form>

            {error && (
              <Alert variant={requiresPassword ? 'warning' : 'danger'}>
                {error}
              </Alert>
            )}

            {loading ? (
              <div className="d-flex justify-content-center py-4">
                <Spinner animation="border" />
              </div>
            ) : enlace ? (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <strong>Token:</strong>
                    <div className="text-monospace">{enlace.token}</div>
                  </div>
                  <Badge bg={status.variant}>{status.label}</Badge>
                </div>
                <Row className="mb-3">
                  <Col md={6}>
                    <small className="text-muted">Registro relacionado</small>
                    <div className="fw-semibold">
                      {enlace.registro_id ?? '-'}
                    </div>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Descripción</small>
                    <div>{enlace.descripcion || 'Sin descripción'}</div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <small className="text-muted">Fecha de creación</small>
                    <div>{formatDate(enlace.fecha_creacion)}</div>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Fecha de expiración</small>
                    <div>{formatDate(enlace.fecha_expiracion)}</div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <small className="text-muted">Accesos</small>
                    <div>
                      {enlace.accesos || 0}
                      {enlace.max_accesos ? ` / ${enlace.max_accesos}` : ''}
                    </div>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Último acceso</small>
                    <div>{formatDate(enlace.ultimo_acceso)}</div>
                  </Col>
                </Row>
                <Alert variant="info" className="mt-3 mb-0">
                  Esta vista muestra únicamente la metadata autorizada. Para
                  documentación adicional, contacte al administrador del enlace.
                </Alert>
              </div>
            ) : (
              <Alert variant="secondary">
                Ingrese un token válido para visualizar la información
                disponible.
              </Alert>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
