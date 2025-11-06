import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUserPlus, FaUser, FaLock, FaCheckCircle } from 'react-icons/fa';
import api from '../api/api';

const RegistroInvitacion = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [validating, setValidating] = useState(true);
  const [invitacionValida, setInvitacionValida] = useState(false);
  const [invitacionData, setInvitacionData] = useState(null);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await api.get(`/public/invitaciones/${token}/validar`);
        if (response.data.valid) {
          setInvitacionValida(true);
          setInvitacionData(response.data.invitacion);
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        console.error('Error al validar token:', err);
        setError(err.response?.data?.error || 'Invitación inválida o expirada');
      } finally {
        setValidating(false);
      }
    };
    
    validateToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/public/invitaciones/${token}/aceptar`, {
        username: formData.username,
        password: formData.password
      });
      
      setRegistroExitoso(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      setError(err.response?.data?.error || 'Error al completar el registro');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Validando invitación...</p>
        </div>
      </Container>
    );
  }

  if (registroExitoso) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ maxWidth: '500px', width: '100%' }} className="shadow">
          <Card.Body className="text-center p-5">
            <FaCheckCircle size={60} className="text-success mb-3" />
            <h2 className="mb-3">¡Registro Exitoso!</h2>
            <p className="text-muted">
              Tu cuenta ha sido creada correctamente.
            </p>
            <p className="text-muted">
              Redirigiendo al inicio de sesión...
            </p>
            <Spinner animation="border" size="sm" variant="primary" className="mt-3" />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!invitacionValida || error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ maxWidth: '500px', width: '100%' }} className="shadow">
          <Card.Body className="p-5">
            <Alert variant="danger">
              <Alert.Heading>Invitación Inválida</Alert.Heading>
              <p className="mb-0">{error}</p>
            </Alert>
            <Button variant="primary" onClick={() => navigate('/login')} className="w-100 mt-3">
              Ir al Inicio de Sesión
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ maxWidth: '500px', width: '100%' }} className="shadow">
        <Card.Body className="p-5">
          <div className="text-center mb-4">
            <FaUserPlus size={50} className="text-primary mb-3" />
            <h2>Completar Registro</h2>
            <p className="text-muted">Has sido invitado a RE.SE.J</p>
          </div>

          {invitacionData && (
            <Alert variant="info" className="mb-4">
              <div><strong>Email:</strong> {invitacionData.email}</div>
              <div><strong>Nombre:</strong> {invitacionData.nombre_completo}</div>
              <div><strong>Rol:</strong> {
                invitacionData.rol === 'usuario_consulta' ? 'Usuario de Consulta' :
                invitacionData.rol === 'usuario_registro' ? 'Usuario de Registro' :
                'Administrador'
              }</div>
            </Alert>
          )}

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2" />
                Nombre de Usuario *
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa tu nombre de usuario"
                required
                minLength={3}
                maxLength={50}
                pattern="[a-zA-Z0-9_]+"
                title="Solo letras, números y guión bajo"
              />
              <Form.Text className="text-muted">
                Solo letras, números y guión bajo (mínimo 3 caracteres)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <FaLock className="me-2" />
                Contraseña *
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña"
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Mínimo 6 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <FaLock className="me-2" />
                Confirmar Contraseña *
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                required
                minLength={6}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Registrando...
                </>
              ) : (
                'Completar Registro'
              )}
            </Button>
          </Form>

          <div className="text-center mt-4">
            <small className="text-muted">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-decoration-none">
                Iniciar sesión
              </a>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegistroInvitacion;
