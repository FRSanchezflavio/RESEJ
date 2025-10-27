import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Table,
  Alert,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { Plus, Copy, Trash2, Eye, Download, Share2 } from 'lucide-react';
import CrearEnlaceModal from '../components/enlaces/CrearEnlaceModal';
import { enlacesApi } from '../services/enlacesApi';
import '../styles/EnlacesCompartidos.css';

const EnlacesCompartidos = () => {
  const [enlaces, setEnlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enlaceAEliminar, setEnlaceAEliminar] = useState(null);
  const [copiados, setCopiados] = useState({});
  const [filtro, setFiltro] = useState('activos'); // activos, expirados, todos

  // Cargar enlaces
  useEffect(() => {
    cargarEnlaces();
  }, []);

  const cargarEnlaces = async () => {
    try {
      setLoading(true);
      setError('');
      const datos = await enlacesApi.listarEnlaces();
      setEnlaces(datos || []);
    } catch (err) {
      console.error('Error cargando enlaces:', err);
      setError(err.response?.data?.message || 'Error al cargar los enlaces');
      setEnlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearEnlace = async () => {
    // El modal maneja la creación y actualización
    cargarEnlaces();
  };

  const copiarURL = token => {
    const url = `${window.location.origin}/enlace/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiados({ ...copiados, [token]: true });
      setTimeout(() => {
        setCopiados({ ...copiados, [token]: false });
      }, 2000);
    });
  };

  const descargarQR = async token => {
    try {
      const qr = await enlacesApi.obtenerQR(token);
      if (qr) {
        const link = document.createElement('a');
        link.href = qr;
        link.download = `qr-enlace-${token}.png`;
        link.click();
      }
    } catch (err) {
      console.error('Error descargando QR:', err);
    }
  };

  const confirmarEliminar = enlace => {
    setEnlaceAEliminar(enlace);
    setShowDeleteModal(true);
  };

  const eliminarEnlace = async () => {
    if (!enlaceAEliminar) return;

    try {
      await enlacesApi.eliminarEnlace(enlaceAEliminar.id);
      setShowDeleteModal(false);
      setEnlaceAEliminar(null);
      cargarEnlaces();
    } catch (err) {
      console.error('Error eliminando enlace:', err);
      setError(err.response?.data?.message || 'Error al eliminar el enlace');
    }
  };

  const revocarEnlace = async enlaceToken => {
    try {
      await enlacesApi.revocarEnlace(enlaceToken);
      cargarEnlaces();
    } catch (err) {
      console.error('Error revocando enlace:', err);
      setError(err.response?.data?.message || 'Error al revocar el enlace');
    }
  };

  const filtrarEnlaces = () => {
    const ahora = new Date();
    return enlaces.filter(enlace => {
      const expiracio = enlace.fecha_expiracion
        ? new Date(enlace.fecha_expiracion)
        : null;
      const estaActivo = !enlace.revocado && (!expiracio || expiracio > ahora);

      if (filtro === 'activos') return estaActivo;
      if (filtro === 'expirados') return !estaActivo;
      return true;
    });
  };

  const enlacesFiltrados = filtrarEnlaces();

  const calcularEstadisticas = () => {
    const ahora = new Date();
    const activos = enlaces.filter(
      e =>
        !e.revocado &&
        (!e.fecha_expiracion || new Date(e.fecha_expiracion) > ahora)
    ).length;
    const expirados = enlaces.filter(
      e =>
        e.revocado ||
        (e.fecha_expiracion && new Date(e.fecha_expiracion) <= ahora)
    ).length;
    const totalAccesos = enlaces.reduce((sum, e) => sum + (e.accesos || 0), 0);

    return { activos, expirados, totalAccesos };
  };

  const estadisticas = calcularEstadisticas();

  return (
    <Container className="enlaces-compartidos-page py-4">
      <div className="page-header mb-4">
        <Row className="align-items-center">
          <Col md={6}>
            <h1 className="mb-0">
              <Share2 className="me-2" style={{ display: 'inline' }} />
              Enlaces Compartidos
            </h1>
            <p className="text-muted mt-2">
              Gestiona enlaces públicos para tus registros
            </p>
          </Col>
          <Col md={6} className="text-end">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCrearModal(true)}
              className="gap-2"
            >
              <Plus size={20} /> Crear Enlace
            </Button>
          </Col>
        </Row>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {/* Tarjetas de Estadísticas */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number">{estadisticas.activos}</div>
              <div className="stats-label">Enlaces Activos</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number">{estadisticas.expirados}</div>
              <div className="stats-label">Enlaces Expirados</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-number">{estadisticas.totalAccesos}</div>
              <div className="stats-label">Total de Accesos</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <div className="filter-section mb-4">
        <div className="btn-group" role="group">
          <Button
            variant={filtro === 'activos' ? 'primary' : 'outline-primary'}
            onClick={() => setFiltro('activos')}
          >
            Activos
          </Button>
          <Button
            variant={filtro === 'expirados' ? 'primary' : 'outline-primary'}
            onClick={() => setFiltro('expirados')}
          >
            Expirados
          </Button>
          <Button
            variant={filtro === 'todos' ? 'primary' : 'outline-primary'}
            onClick={() => setFiltro('todos')}
          >
            Todos
          </Button>
        </div>
      </div>

      {/* Tabla de Enlaces */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p>Cargando enlaces...</p>
        </div>
      ) : enlacesFiltrados.length === 0 ? (
        <Alert variant="info">
          {enlaces.length === 0
            ? 'No has creado ningún enlace aún. ¡Crea el primero!'
            : `No hay ${filtro} en este momento.`}
        </Alert>
      ) : (
        <Card className="table-card">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Token</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Accesos</th>
                <th>Expira</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {enlacesFiltrados.map(enlace => {
                const ahora = new Date();
                const expira = enlace.fecha_expiracion
                  ? new Date(enlace.fecha_expiracion)
                  : null;
                const estaActivo =
                  !enlace.revocado && (!expira || expira > ahora);
                const diasFaltantes = expira
                  ? Math.ceil((expira - ahora) / (1000 * 60 * 60 * 24))
                  : null;

                return (
                  <tr
                    key={enlace.id}
                    className={!estaActivo ? 'table-row-inactive' : ''}
                  >
                    <td>
                      <code className="font-monospace small">
                        {enlace.token?.substring(0, 8)}...
                      </code>
                    </td>
                    <td>{enlace.descripcion || '(sin descripción)'}</td>
                    <td>
                      {estaActivo ? (
                        <Badge bg="success">Activo</Badge>
                      ) : enlace.revocado ? (
                        <Badge bg="danger">Revocado</Badge>
                      ) : (
                        <Badge bg="warning">Expirado</Badge>
                      )}
                    </td>
                    <td>
                      {enlace.max_accesos
                        ? `${enlace.accesos || 0}/${enlace.max_accesos}`
                        : `${enlace.accesos || 0}/∞`}
                    </td>
                    <td>
                      {expira ? (
                        <span
                          className={
                            diasFaltantes <= 7 ? 'text-warning fw-bold' : ''
                          }
                        >
                          {diasFaltantes > 0 ? `${diasFaltantes}d` : 'Hoy'}
                        </span>
                      ) : (
                        <span className="text-muted">Sin fecha</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="sm"
                          size="sm"
                          className="btn-action"
                          onClick={() => copiarURL(enlace.token)}
                          title="Copiar URL"
                        >
                          {copiados[enlace.token] ? (
                            <span className="text-success">✓</span>
                          ) : (
                            <Copy size={16} />
                          )}
                        </Button>

                        <Button
                          variant="sm"
                          className="btn-action"
                          size="sm"
                          onClick={() => descargarQR(enlace.token)}
                          title="Descargar QR"
                        >
                          <Download size={16} />
                        </Button>

                        <a
                          href={`/enlace/${enlace.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-action"
                          title="Ver enlace"
                        >
                          <Eye size={16} />
                        </a>

                        {estaActivo && (
                          <Button
                            variant="sm"
                            className="btn-action btn-warning"
                            size="sm"
                            onClick={() => revocarEnlace(enlace.token)}
                            title="Revocar enlace"
                          >
                            Revocar
                          </Button>
                        )}

                        <Button
                          variant="sm"
                          className="btn-action btn-danger"
                          size="sm"
                          onClick={() => confirmarEliminar(enlace)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Modal Crear Enlace */}
      <CrearEnlaceModal
        show={showCrearModal}
        onHide={() => setShowCrearModal(false)}
        onSuccess={handleCrearEnlace}
      />

      {/* Modal Confirmar Eliminación */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este enlace? Esta acción no se
          puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarEnlace}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EnlacesCompartidos;
