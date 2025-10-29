import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import {
  createSharedLink,
  fetchSharedLinks,
  revokeSharedLink,
} from '../../api/api';

const EMPTY_FORM = {
  descripcion: '',
  duracion_horas: '24',
  max_accesos: '',
  requiere_contrasena: false,
  contrasena: '',
  tipo: 'registro',
};

const limitedStatus = enlace => {
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

export default function SharedLinks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [includeRevoked, setIncludeRevoked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM }));
  const [creating, setCreating] = useState(false);
  const [creationResult, setCreationResult] = useState(null);
  const fetchData = useCallback(
    async ({ page = 1, limit = 10 } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchSharedLinks({
          page,
          limit,
          includeRevoked,
        });
        const payload = response.data?.data ?? {};
        setLinks(payload.enlaces ?? []);
        setPagination(payload.pagination ?? { page: 1, totalPages: 1 });
      } catch (err) {
        console.error('Error cargando enlaces', err);
        setError(
          err?.response?.data?.error ||
            'No se pudieron obtener los enlaces compartidos'
        );
        setLinks([]);
      } finally {
        setLoading(false);
      }
    },
    [includeRevoked]
  );

  useEffect(() => {
    const registroPrefill = searchParams.get('registro');
    if (registroPrefill) {
      setForm(prev => ({ ...prev, registro_id: registroPrefill }));
      setCreationResult(null);
      setShowModal(true);
      const updated = new URLSearchParams(searchParams);
      updated.delete('registro');
      setSearchParams(updated, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchData({ page: 1 });
  }, [fetchData]);

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    if (name === 'requiere_contrasena') {
      setForm(prev => ({
        ...prev,
        requiere_contrasena: checked,
        contrasena: checked ? prev.contrasena : '',
      }));
      return;
    }
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = useCallback(() => {
    setForm({ ...EMPTY_FORM });
    setCreationResult(null);
  }, []);

  const handleCreate = async event => {
    event.preventDefault();
    setCreating(true);
    setCreationResult(null);
    try {
      const payload = {
        ...form,
        max_accesos: form.max_accesos ? Number(form.max_accesos) : null,
        duracion_horas: form.duracion_horas
          ? Number(form.duracion_horas)
          : null,
      };

      const response = await createSharedLink(payload);
      const data = response.data?.data ?? {};
      setCreationResult(data);
      await fetchData({ page: pagination.page });
    } catch (err) {
      console.error('Error creando enlace', err);
      setCreationResult({
        error:
          err?.response?.data?.error || 'No se pudo crear el enlace compartido',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleRevoke = async token => {
    if (!window.confirm('¿Está seguro de revocar este enlace?')) return;
    try {
      await revokeSharedLink(token);
      await fetchData({ page: pagination.page });
    } catch (err) {
      console.error('Error revocando enlace', err);
      alert(
        err?.response?.data?.error ||
          'No se pudo revocar el enlace seleccionado'
      );
    }
  };

  const activeLinks = useMemo(
    () => links.filter(link => !link.revocado),
    [links]
  );

  const publicBaseUrl = useMemo(() => {
    return `${window.location.origin}/enlace`;
  }, []);

  const renderCreationSummary = () => {
    if (!creationResult) return null;

    if (creationResult.error) {
      return <Alert variant="danger">{creationResult.error}</Alert>;
    }

    const enlace = creationResult.enlace ?? {};
    const credenciales = creationResult.credencialesTemporales;
    const linkUrl = `${publicBaseUrl}/${enlace.token}`;

    return (
      <Alert variant="success">
        <Alert.Heading>Enlace generado correctamente</Alert.Heading>
        <p>Comparta esta URL con la persona autorizada:</p>
        <Form.Control
          type="text"
          readOnly
          value={linkUrl}
          className="mb-2"
          onFocus={event => event.target.select()}
        />
        <div className="d-flex gap-2 mb-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigator.clipboard.writeText(linkUrl)}
          >
            Copiar enlace
          </Button>
        </div>
        {credenciales ? (
          <>
            <p className="mb-1">Credenciales temporales:</p>
            <div className="d-flex flex-column gap-1">
              <Form.Control
                type="text"
                readOnly
                value={`Usuario: ${credenciales.usuario}`}
                onFocus={event => event.target.select()}
              />
              <Form.Control
                type="text"
                readOnly
                value={`Clave temporal: ${credenciales.password}`}
                onFocus={event => event.target.select()}
              />
            </div>
            <small className="text-muted">
              Comparta las credenciales sólo con el destinatario previsto.
            </small>
          </>
        ) : null}
      </Alert>
    );
  };

  return (
    <Card className="p-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h5>Enlaces compartidos</h5>
          <p className="text-muted mb-0">
            Administre los accesos externos a registros y archivos.
          </p>
        </Col>
        <Col className="text-end">
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            Crear enlace
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md="auto" className="d-flex align-items-center gap-2">
          <Form.Check
            type="switch"
            id="toggle-revoked"
            label="Incluir revocados"
            checked={includeRevoked}
            onChange={event => setIncludeRevoked(event.target.checked)}
          />
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => fetchData({ page: 1 })}
          >
            Actualizar
          </Button>
        </Col>
        <Col className="text-end">
          <small className="text-muted">
            Enlaces activos: {activeLinks.length}
          </small>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" />
        </div>
      ) : links.length === 0 ? (
        <p className="mb-0">
          No se encontraron enlaces para los criterios seleccionados.
        </p>
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>Token</th>
              <th>Descripción</th>
              <th>Registro</th>
              <th>Estado</th>
              <th>Accesos</th>
              <th>Expiración</th>
              <th>Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => {
              const status = limitedStatus(link);
              const linkUrl = `${publicBaseUrl}/${link.token}`;
              return (
                <tr key={link.token}>
                  <td style={{ maxWidth: 160 }}>
                    <Form.Control
                      size="sm"
                      readOnly
                      value={link.token}
                      onFocus={event => event.target.select()}
                    />
                  </td>
                  <td>{link.descripcion || '-'}</td>
                  <td>{link.registro_id ?? '-'}</td>
                  <td>
                    <Badge bg={status.variant}>{status.label}</Badge>
                  </td>
                  <td>{`${link.accesos || 0}${
                    link.max_accesos ? `/${link.max_accesos}` : ''
                  }`}</td>
                  <td>{formatDate(link.fecha_expiracion)}</td>
                  <td>{formatDate(link.fecha_creacion)}</td>
                  <td className="d-flex flex-column gap-2">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(linkUrl)}
                    >
                      Copiar enlace
                    </Button>
                    {!link.revocado && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRevoke(link.token)}
                      >
                        Revocar
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Página {pagination.page} de {pagination.totalPages}
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={pagination.page <= 1 || loading}
            onClick={() => fetchData({ page: pagination.page - 1 })}
          >
            Anterior
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={pagination.page >= pagination.totalPages || loading}
            onClick={() => fetchData({ page: pagination.page + 1 })}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form onSubmit={handleCreate}>
          <Modal.Header closeButton>
            <Modal.Title>Crear enlace compartido</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {renderCreationSummary()}
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                maxLength={255}
                placeholder="Opcional"
              />
            </Form.Group>
            <Row className="mb-3">
              <Col>
                <Form.Label>Duración (horas)</Form.Label>
                <Form.Control
                  name="duracion_horas"
                  value={form.duracion_horas}
                  type="number"
                  min="1"
                  max="720"
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Label>Máx. accesos</Form.Label>
                <Form.Control
                  name="max_accesos"
                  value={form.max_accesos}
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="Ilimitado"
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                label="Requerir contraseña para acceder"
                name="requiere_contrasena"
                checked={form.requiere_contrasena}
                onChange={handleChange}
              />
            </Form.Group>
            {form.requiere_contrasena && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  name="contrasena"
                  type="text"
                  value={form.contrasena}
                  minLength={8}
                  maxLength={128}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <Button variant="outline-secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? <Spinner animation="border" size="sm" /> : 'Generar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
}
