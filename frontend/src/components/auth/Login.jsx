import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { loginRequest } from '../../api/api';
import api from '../../api/api';
import { AuthContext } from '../../context/AuthContext';
import { usePermisos } from '../../context/usePermisos';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { actualizarPermisos } = usePermisos();
  const [searchParams] = useSearchParams();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [validandoToken, setValidandoToken] = useState(false);
  const [infoToken, setInfoToken] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      validarTokenAcceso(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validarTokenAcceso = async token => {
    setValidandoToken(true);
    setInfoToken('Validando enlace de acceso temporal...');
    setErr('');

    try {
      console.log('🔗 Validando token de acceso:', token);
      const response = await api.post('/usuarios/validar-token-acceso', {
        token,
      });

      if (response.data.success && response.data.token_valido) {
        console.log('✅ Token válido, iniciando sesión automática');
        const jwtToken = response.data.jwt_token;
        const permisos = response.data.permisos;
        const usuarioData = response.data.usuario;

        // Guardar permisos
        if (permisos) {
          actualizarPermisos(permisos);
          console.log('Permisos del usuario:', permisos);
        }

        // Guardar usuario en localStorage
        if (usuarioData) {
          localStorage.setItem('usuario', JSON.stringify(usuarioData));
        }

        setInfoToken(
          `¡Bienvenido ${usuarioData?.username || 'Usuario'}! Redirigiendo...`
        );

        // Login automático
        setTimeout(() => {
          login(jwtToken);
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Error al validar token:', error);
      const mensajeError =
        error.response?.data?.error ||
        'El enlace de acceso no es válido o ha expirado';
      setErr(mensajeError);
      setInfoToken('Por favor, inicia sesión con tu usuario y contraseña.');
      setValidandoToken(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await loginRequest(usuario, password);
      const token =
        res.data?.data?.accessToken ||
        res.data?.accessToken ||
        res.data?.data?.accessToken;
      if (!token) throw new Error('No token');

      // Guardar permisos si están disponibles
      const permisos = res.data?.data?.permisos;
      if (permisos) {
        actualizarPermisos(permisos);
        console.log('Permisos del usuario:', permisos);
      }

      // Guardar usuario completo en localStorage para referencia
      const usuarioData = res.data?.data?.usuario;
      if (usuarioData) {
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
      }

      login(token);
    } catch (error) {
      setErr('Credenciales inválidas o error de servidor');
      console.error(error);
    }
  };

  if (validandoToken) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '80vh' }}
      >
        <Card
          style={{
            width: 420,
            padding: 30,
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            textAlign: 'center',
          }}
        >
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>{infoToken}</h5>
          <p className="text-muted mt-2" style={{ fontSize: '14px' }}>
            Estás accediendo con un enlace temporal de un solo uso
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
    >
      <Card
        style={{
          width: 420,
          padding: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,.08)',
        }}
      >
        <h4 className="mb-3">Iniciar Sesión</h4>
        {err && <Alert variant="danger">{err}</Alert>}
        {infoToken && !err && <Alert variant="info">{infoToken}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center">
            <Button type="submit" variant="dark">
              INICIAR SESIÓN
            </Button>
            <small className="text-muted">© 2025 - Policía de Tucumán</small>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
