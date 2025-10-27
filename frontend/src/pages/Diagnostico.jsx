import React, { useState, useEffect } from 'react';
import { Alert, Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';

const DiagnosticoApp = () => {
  const [diagnostico, setDiagnostico] = useState({
    backend: { status: '⏳', mensaje: 'Verificando...', url: 'http://localhost:3000' },
    api_registros: { status: '⏳', mensaje: 'Verificando...', url: 'http://localhost:3000/api/registros' },
    api_enlaces: { status: '⏳', mensaje: 'Verificando...', url: 'http://localhost:3000/api/enlaces-compartidos' },
    token: { status: '⏳', mensaje: 'Verificando...', existe: false },
    localStorage: { status: '⏳', mensaje: 'Verificando...' },
  });

  useEffect(() => {
    ejecutarDiagnostico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ejecutarDiagnostico = async () => {
    const nuevosDatos = { ...diagnostico };

    // 1. Verificar token en localStorage
    const token = localStorage.getItem('token');
    nuevosDatos.token = {
      status: token ? '✅' : '❌',
      mensaje: token ? 'Token presente' : 'Sin token',
      existe: !!token,
    };

    // 2. Verificar localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      nuevosDatos.localStorage = {
        status: '✅',
        mensaje: 'localStorage funciona',
      };
    } catch (e) {
      nuevosDatos.localStorage = {
        status: '❌',
        mensaje: `Error: ${e.message}`,
      };
    }

    // 3. Verificar backend
    try {
      const respuestaBackend = await fetch('http://localhost:3000/health', {
        method: 'GET',
        timeout: 5000,
      });
      
      if (respuestaBackend.ok) {
        nuevosDatos.backend = {
          status: '✅',
          mensaje: 'Backend respondiendo (port 3000)',
          url: 'http://localhost:3000',
        };
      } else {
        nuevosDatos.backend = {
          status: '⚠️',
          mensaje: `Backend respondiendo pero status: ${respuestaBackend.status}`,
          url: 'http://localhost:3000',
        };
      }
    } catch (error) {
      nuevosDatos.backend = {
        status: '❌',
        mensaje: `Conexión fallida: ${error.message}`,
        url: 'http://localhost:3000',
      };
    }

    // 4. Verificar API de registros
    try {
      const respuestaRegistros = await fetch('http://localhost:3000/api/registros', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || 'sin-token'}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (respuestaRegistros.ok) {
        const data = await respuestaRegistros.json();
        nuevosDatos.api_registros = {
          status: '✅',
          mensaje: `${data.data?.length || 0} registros encontrados`,
          url: 'http://localhost:3000/api/registros',
        };
      } else {
        const errorData = await respuestaRegistros.json();
        nuevosDatos.api_registros = {
          status: '⚠️',
          mensaje: `Status ${respuestaRegistros.status}: ${errorData.message || 'error'}`,
          url: 'http://localhost:3000/api/registros',
        };
      }
    } catch (error) {
      nuevosDatos.api_registros = {
        status: '❌',
        mensaje: `Error: ${error.message}`,
        url: 'http://localhost:3000/api/registros',
      };
    }

    // 5. Verificar API de enlaces
    try {
      const respuestaEnlaces = await fetch('http://localhost:3000/api/enlaces-compartidos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || 'sin-token'}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });

      if (respuestaEnlaces.ok) {
        const data = await respuestaEnlaces.json();
        nuevosDatos.api_enlaces = {
          status: '✅',
          mensaje: `${data.data?.length || 0} enlaces encontrados`,
          url: 'http://localhost:3000/api/enlaces-compartidos',
        };
      } else {
        const errorData = await respuestaEnlaces.json();
        nuevosDatos.api_enlaces = {
          status: '⚠️',
          mensaje: `Status ${respuestaEnlaces.status}: ${errorData.message || 'error'}`,
          url: 'http://localhost:3000/api/enlaces-compartidos',
        };
      }
    } catch (error) {
      nuevosDatos.api_enlaces = {
        status: '❌',
        mensaje: `Error: ${error.message}`,
        url: 'http://localhost:3000/api/enlaces-compartidos',
      };
    }

    setDiagnostico(nuevosDatos);
  };

  const ItemDiagnostico = ({ titulo, datos }) => (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-1">{titulo}</h5>
            <p className="mb-1 text-muted">{datos.url}</p>
            <p className="mb-0">{datos.mensaje}</p>
          </div>
          <div style={{ fontSize: '2rem' }}>{datos.status}</div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>🔍 Diagnóstico de la Aplicación</h1>
          <p className="text-muted">Verifica el estado de todos los componentes</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <ItemDiagnostico titulo="Backend API" datos={diagnostico.backend} />
        </Col>
        <Col md={6}>
          <ItemDiagnostico titulo="Token" datos={diagnostico.token} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <ItemDiagnostico titulo="localStorage" datos={diagnostico.localStorage} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Endpoints de API</h3>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <ItemDiagnostico titulo="GET /api/registros" datos={diagnostico.api_registros} />
        </Col>
        <Col md={6}>
          <ItemDiagnostico titulo="GET /api/enlaces-compartidos" datos={diagnostico.api_enlaces} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Button variant="primary" onClick={ejecutarDiagnostico} className="me-2">
            🔄 Recargar
          </Button>
          <Button variant="secondary" onClick={() => {
            console.clear();
            console.log('=== INFORMACIÓN DEL DIAGNOSTICO ===');
            console.log(diagnostico);
          }}>
            📋 Mostrar en consola
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Alert variant="info">
            <strong>💡 Sugerencias:</strong>
            <ul className="mb-0 mt-2">
              <li>Si Backend API muestra ❌: Ejecuta <code>npm run dev</code> en la carpeta BACKEND</li>
              <li>Si Token muestra ❌: Inicia sesión primero en la aplicación</li>
              <li>Si los endpoints muestran ⚠️: Revisa la consola del navegador (F12)</li>
            </ul>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default DiagnosticoApp;
