import { useState } from 'react';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { FaEnvelope, FaUser, FaCopy, FaCheck, FaClock } from 'react-icons/fa';
import api from '../../api/api';

const InviteUserModal = ({ show, onHide, onInvitationSent }) => {
  const [formData, setFormData] = useState({
    email: '',
    nombre_completo: '',
    rol: 'usuario_consulta',
    duracion_horas: 48,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invitationUrl, setInvitationUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/invitaciones', formData);
      setInvitationUrl(response.data.data.url);
      if (onInvitationSent) {
        onInvitationSent(response.data.data);
      }
    } catch (err) {
      console.error('Error al crear invitación:', err);
      setError(err.response?.data?.error || 'Error al crear la invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (invitationUrl) {
      navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      nombre_completo: '',
      rol: 'usuario_consulta',
      duracion_horas: 48,
    });
    setError(null);
    setInvitationUrl(null);
    setCopied(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaEnvelope className="me-2" />
          Invitar Nuevo Usuario
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!invitationUrl ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Se enviará la invitación a este email
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo *</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaUser />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                  minLength={3}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol *</Form.Label>
              <Form.Select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="usuario_consulta">
                  Usuario de Consulta (Solo lectura)
                </option>
                <option value="usuario_registro">Usuario de Registro</option>
                <option value="admin">Administrador</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Usuario de Consulta: Solo puede buscar y visualizar información
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duración de la Invitación</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaClock />
                </InputGroup.Text>
                <Form.Select
                  name="duracion_horas"
                  value={formData.duracion_horas}
                  onChange={handleChange}
                >
                  <option value="24">24 horas</option>
                  <option value="48">48 horas</option>
                  <option value="72">3 días</option>
                  <option value="168">7 días</option>
                  <option value="720">30 días</option>
                </Form.Select>
              </InputGroup>
              <Form.Text className="text-muted">
                Tiempo que el usuario tiene para aceptar la invitación
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Invitación'}
              </Button>
            </div>
          </Form>
        ) : (
          <div>
            <Alert variant="success" className="mb-3">
              ✅ <strong>Invitación creada exitosamente</strong>
            </Alert>

            <div className="mb-3">
              <small className="text-muted d-block mb-2">
                Envía este enlace a <strong>{formData.email}</strong>
              </small>

              <InputGroup>
                <Form.Control
                  readOnly
                  value={invitationUrl}
                  onClick={e => e.target.select()}
                  style={{ fontSize: '0.9rem', fontFamily: 'monospace' }}
                  className="bg-light"
                />
                <Button
                  variant={copied ? 'success' : 'primary'}
                  onClick={handleCopyUrl}
                  style={{ minWidth: '110px' }}
                >
                  {copied ? (
                    <>
                      <FaCheck className="me-1" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <FaCopy className="me-1" />
                      Copiar enlace
                    </>
                  )}
                </Button>
              </InputGroup>

              <small className="text-muted d-block mt-2">
                <FaClock className="me-1" />
                Expira en {formData.duracion_horas} horas
              </small>
            </div>

            <Alert variant="warning" className="mb-3">
              <small>
                <strong>⚠️ Importante:</strong>
                <ul className="mb-0 mt-1 ps-3">
                  <li>
                    El enlace es de <strong>un solo uso</strong>
                  </li>
                  <li>El usuario debe registrarse antes de que expire</li>
                </ul>
              </small>
            </Alert>

            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={handleClose}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InviteUserModal;
