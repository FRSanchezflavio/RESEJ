import React, { useEffect, useState } from 'react';
import { fetchRegistros } from '../../api/api';
import {
  Card,
  Form,
  Button,
  Table,
  Row,
  Col,
  Collapse,
  Modal,
} from 'react-bootstrap';
import api from '../../api/api';
import AccionProtegida from '../AccionProtegida';
import './Registros.css';

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [term, setTerm] = useState('');
  const [searchField, setSearchField] = useState('all'); // Campo de búsqueda seleccionado
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedRegistroId, setSelectedRegistroId] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [editData, setEditData] = useState({});

  async function load(params = {}) {
    try {
      setLoading(true);
      const res = await fetchRegistros(params);
      // backend devuelve: { success: true, data: { pagination:..., registros: [...] } }
      const items = res.data?.data?.registros ?? res.data?.registros ?? [];
      const paginationData = res.data?.data?.pagination ?? null;
      setRegistros(items);
      setPagination(paginationData);
    } catch (err) {
      console.error(err);
      setRegistros([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    const params = { termino: term };

    // Si se seleccionó un campo específico, agregarlo a los parámetros
    if (searchField !== 'all') {
      params.campo = searchField;
    }

    load(params);
  };

  const handleClearFilters = () => {
    setTerm('');
    setSearchField('all');
    load({});
  };

  const toggleRow = id => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditClick = registro => {
    setSelectedRegistroId(registro.id);
    setEditData(registro);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async () => {
    try {
      // Validar la contraseña del administrador
      const response = await api.post('/auth/validate-password', {
        password: passwordInput,
      });

      if (response.data.success) {
        setShowPasswordModal(false);
        setPasswordInput('');
        setEditMode(prev => ({ ...prev, [selectedRegistroId]: true }));
      }
    } catch {
      alert('Contraseña incorrecta. Intente nuevamente.');
      setPasswordInput('');
    }
  };

  const handleCancelEdit = registroId => {
    setEditMode(prev => ({ ...prev, [registroId]: false }));
    setEditData({});
  };

  const handleSaveEdit = async registroId => {
    try {
      // Filtrar solo los campos que existen en la tabla registros_secuestros
      const camposPermitidos = {
        persona_id: editData.persona_id,
        fecha_ingreso: editData.fecha_ingreso,
        ufi: editData.ufi,
        numero_legajo: editData.numero_legajo,
        seccion_que_interviene: editData.seccion_que_interviene,
        detalle_secuestro: editData.detalle_secuestro,
        numero_protocolo: editData.numero_protocolo,
        cadena_custodia: editData.cadena_custodia,
        nro_folio: editData.nro_folio,
        nro_libro_secuestro: editData.nro_libro_secuestro,
        of_a_cargo: editData.of_a_cargo,
        tramite: editData.tramite,
        tipo_delito: editData.tipo_delito,
        fecha_delito: editData.fecha_delito,
        lugar_delito: editData.lugar_delito,
        descripcion: editData.descripcion,
        estado_causa: editData.estado_causa,
        numero_causa: editData.numero_causa,
        juzgado: editData.juzgado,
        observaciones: editData.observaciones,
      };

      await api.put(`/registros/${registroId}`, camposPermitidos);
      alert('Registro actualizado exitosamente');
      setEditMode(prev => ({ ...prev, [registroId]: false }));
      setEditData({});
      load({}); // Recargar los registros
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el registro');
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Modal de validación de contraseña */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>🔒 Verificación de Administrador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ingrese la contraseña de administrador:</Form.Label>
            <Form.Control
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Contraseña"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Verificar
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="p-3">
        <h5>Buscar registro</h5>

        <Form onSubmit={handleSearch}>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Buscar por:</Form.Label>
              <Form.Select
                value={searchField}
                onChange={e => setSearchField(e.target.value)}
                disabled={loading}
              >
                <option value="all">🔍 Todos los campos</option>
                <option value="persona">👤 Persona</option>
                <option value="dni">🆔 DNI</option>
                <option value="numero_legajo">📋 Nº Legajo</option>
                <option value="numero_causa">⚖️ Nº Causa</option>
                <option value="ufi">🏢 UFI</option>
                <option value="numero_protocolo">📄 Nº Protocolo</option>
                <option value="cadena_custodia">🔗 Cadena de Custodia</option>
                <option value="detalle_secuestro">📝 Detalle</option>
                <option value="of_a_cargo">👮 Oficial a Cargo</option>
              </Form.Select>
            </Col>
            <Col md={9}>
              <Form.Label>Término de búsqueda:</Form.Label>
              <Form.Control
                placeholder={
                  searchField === 'all'
                    ? 'Buscar en todos los campos...'
                    : `Buscar por ${
                        searchField === 'persona'
                          ? 'nombre de persona'
                          : searchField === 'dni'
                          ? 'DNI'
                          : searchField === 'numero_legajo'
                          ? 'número de legajo'
                          : searchField === 'numero_causa'
                          ? 'número de causa'
                          : searchField === 'ufi'
                          ? 'UFI'
                          : searchField === 'numero_protocolo'
                          ? 'número de protocolo'
                          : searchField === 'cadena_custodia'
                          ? 'cadena de custodia'
                          : searchField === 'detalle_secuestro'
                          ? 'detalle del secuestro'
                          : 'oficial a cargo'
                      }...`
                }
                value={term}
                onChange={e => setTerm(e.target.value)}
                disabled={loading}
              />
            </Col>
          </Row>
          <div className="d-flex gap-2 mb-3">
            <Button type="submit" variant="dark" disabled={loading}>
              {loading ? '🔄 Buscando...' : '🔍 BUSCAR'}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleClearFilters}
              disabled={loading}
            >
              🗑️ LIMPIAR FILTROS
            </Button>
          </div>
        </Form>

        {pagination && (
          <div className="mb-2 text-muted">
            Mostrando {registros.length} de {pagination.total} registros (Página{' '}
            {pagination.page} de {pagination.totalPages})
          </div>
        )}

        {loading ? (
          <p>Cargando registros...</p>
        ) : registros.length === 0 ? (
          <p>No hay registros que coincidan con la búsqueda</p>
        ) : (
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Ver</th>
                <th>#</th>
                <th>Fecha Ingreso</th>
                <th>UFI</th>
                <th>N° Legajo/Causa</th>
                <th>Sección</th>
                <th>Detalle Secuestro</th>
                <th>N° Protocolo</th>
                <th>Cadena Custodia</th>
                <th>N° Folio</th>
                <th>N° Libro Secuestro</th>
                <th>Oficial a Cargo</th>
                <th>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map(r => (
                <React.Fragment key={r.id}>
                  <tr
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleRow(r.id)}
                  >
                    <td className="text-center">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          toggleRow(r.id);
                        }}
                        style={{ padding: 0, textDecoration: 'none' }}
                      >
                        {expandedRows[r.id] ? '▼' : '▶'}
                      </Button>
                    </td>
                    <td>{r.id}</td>
                    <td>
                      {r.fecha_ingreso
                        ? new Date(r.fecha_ingreso).toLocaleDateString('es-AR')
                        : '-'}
                    </td>
                    <td>{r.ufi || '-'}</td>
                    <td>{r.numero_legajo || '-'}</td>
                    <td
                      style={{
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.seccion_que_interviene || '-'}
                    </td>
                    <td
                      style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.detalle_secuestro || r.descripcion || '-'}
                    </td>
                    <td>{r.numero_protocolo || '-'}</td>
                    <td>{r.cadena_custodia || '-'}</td>
                    <td>{r.nro_folio || '-'}</td>
                    <td>{r.nro_libro_secuestro || '-'}</td>
                    <td
                      style={{
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.of_a_cargo || '-'}
                    </td>
                    <td
                      style={{
                        maxWidth: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.observaciones || '-'}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="13" style={{ padding: 0, border: 'none' }}>
                      <Collapse in={expandedRows[r.id]}>
                        <div
                          style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                          }}
                        >
                          <Row>
                            <Col md={6}>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0">
                                  📋 Información del Registro
                                </h6>
                                <AccionProtegida permiso="editar">
                                  {!editMode[r.id] ? (
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() => handleEditClick(r)}
                                    >
                                      ✏️ Editar
                                    </Button>
                                  ) : (
                                    <div>
                                      <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleSaveEdit(r.id)}
                                        className="me-2"
                                      >
                                        💾 Guardar
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleCancelEdit(r.id)}
                                      >
                                        ❌ Cancelar
                                      </Button>
                                    </div>
                                  )}
                                </AccionProtegida>
                              </div>

                              {!editMode[r.id] ? (
                                <>
                                  <div className="mb-2">
                                    <strong>Fecha de inicio:</strong>{' '}
                                    {r.fecha_ingreso
                                      ? new Date(
                                          r.fecha_ingreso
                                        ).toLocaleDateString('es-AR')
                                      : '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>UFI:</strong> {r.ufi || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>N° Legajo / Causa:</strong>{' '}
                                    {r.numero_legajo || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>Sección que interviene:</strong>{' '}
                                    {r.seccion_que_interviene || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>Detalle del secuestro:</strong>{' '}
                                    {r.detalle_secuestro || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>N° de protocolo:</strong>{' '}
                                    {r.numero_protocolo || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>Cadena de custodia:</strong>{' '}
                                    {r.cadena_custodia || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>N° de folio:</strong>{' '}
                                    {r.nro_folio || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>N° de libro de secuestro:</strong>{' '}
                                    {r.nro_libro_secuestro || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>De. a cargo de la causa:</strong>{' '}
                                    {r.of_a_cargo || '-'}
                                  </div>
                                  <div className="mb-2">
                                    <strong>Observaciones:</strong>{' '}
                                    {r.tramite || '-'}
                                  </div>
                                </>
                              ) : (
                                <Form>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>Fecha de inicio:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="date"
                                      value={editData.fecha_ingreso || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'fecha_ingreso',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>UFI:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.ufi || ''}
                                      onChange={e =>
                                        handleEditChange('ufi', e.target.value)
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>N° Legajo / Causa:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.numero_legajo || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'numero_legajo',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>Sección que interviene:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={
                                        editData.seccion_que_interviene || ''
                                      }
                                      onChange={e =>
                                        handleEditChange(
                                          'seccion_que_interviene',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>Detalle del secuestro:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      as="textarea"
                                      rows={3}
                                      value={editData.detalle_secuestro || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'detalle_secuestro',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>N° de protocolo:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.numero_protocolo || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'numero_protocolo',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>Cadena de custodia:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.cadena_custodia || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'cadena_custodia',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>N° de folio:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.nro_folio || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'nro_folio',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>N° de libro de secuestro:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.nro_libro_secuestro || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'nro_libro_secuestro',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>De. a cargo de la causa:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      value={editData.of_a_cargo || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'of_a_cargo',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group className="mb-2">
                                    <Form.Label>
                                      <strong>Observaciones:</strong>
                                    </Form.Label>
                                    <Form.Control
                                      as="textarea"
                                      rows={2}
                                      value={editData.tramite || ''}
                                      onChange={e =>
                                        handleEditChange(
                                          'tramite',
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                </Form>
                              )}
                            </Col>
                            <Col md={6}>
                              <h6 className="mb-3">
                                📎 Archivos Adjuntos (PDF, JPG, PNG)
                              </h6>
                              <ArchivosAdjuntos registroId={r.id} />
                            </Col>
                          </Row>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}

// Componente para mostrar archivos adjuntos
function ArchivosAdjuntos({ registroId }) {
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        setLoading(true);
        console.log('Fetching archivos para registro:', registroId);
        const response = await api.get(`/archivos/registro/${registroId}`);
        console.log('Respuesta archivos:', response.data);
        const archivosData = response.data?.data || [];
        console.log('Archivos encontrados:', archivosData.length);
        setArchivos(archivosData);
      } catch (error) {
        console.error('Error al cargar archivos:', error);
        console.error(
          'Detalle del error:',
          error.response?.data || error.message
        );
        setArchivos([]);
      } finally {
        setLoading(false);
      }
    };

    if (registroId) {
      fetchArchivos();
    }
  }, [registroId]);

  const getFileIcon = tipoMime => {
    if (!tipoMime) return '📄';
    if (tipoMime.startsWith('image/')) return '🖼️';
    if (tipoMime.startsWith('video/')) return '🎥';
    if (tipoMime.startsWith('audio/')) return '🎵';
    if (tipoMime.includes('pdf')) return '📕';
    if (tipoMime.includes('word') || tipoMime.includes('document')) return '📘';
    if (tipoMime.includes('excel') || tipoMime.includes('sheet')) return '📗';
    if (tipoMime.includes('powerpoint') || tipoMime.includes('presentation'))
      return '📙';
    if (
      tipoMime.includes('zip') ||
      tipoMime.includes('rar') ||
      tipoMime.includes('compressed')
    )
      return '📦';
    return '📄';
  };

  const formatFileSize = bytes => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDownload = async archivo => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/archivos/${archivo.id}/download`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', archivo.nombre_original || 'archivo');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('Error al descargar el archivo. Por favor intente nuevamente.');
    }
  };

  if (archivos.length === 0 && !loading) {
    return <div className="text-muted small">No hay archivos adjuntos</div>;
  }

  if (loading) {
    return <div className="text-muted small">Cargando...</div>;
  }

  return (
    <div>
      {archivos.map(archivo => (
        <div
          key={archivo.id}
          className="mb-2 p-2"
          style={{
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>
                  {getFileIcon(archivo.tipo_mime)}
                </span>
                <div>
                  <strong style={{ fontSize: '0.9rem' }}>
                    {archivo.nombre_original || 'Archivo sin nombre'}
                  </strong>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {formatFileSize(archivo.tamano_bytes)}
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleDownload(archivo)}
            >
              ⬇️
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
