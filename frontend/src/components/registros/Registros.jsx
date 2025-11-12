import React, { useEffect, useState } from 'react';
import { fetchRegistros } from '../../api/api';
import { Modal, Form, Button } from 'react-bootstrap';
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
        // Nuevos campos agregados
        estado_secuestro: editData.estado_secuestro,
        lugar_deposito: editData.lugar_deposito,
        caratula: editData.caratula,
        victima: editData.victima,
        imputado_causante: editData.imputado_causante,
        denunciante: editData.denunciante,
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
    <div className="registros-container">
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

      {/* Header */}
      <div className="registros-header">
        <h1 className="page-title-registros">
          🔍 Registros de Secuestros Judiciales
        </h1>
      </div>

      {/* Tarjeta de búsqueda */}
      <div className="search-card">
        <h3 style={{ marginBottom: 'var(--spacing-lg)', fontWeight: 700 }}>
          🎯 Búsqueda Avanzada
        </h3>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-row">
            <div className="form-group-registros">
              <label className="form-label-registros">Buscar por:</label>
              <select
                className="form-select-registros"
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
                <option value="caratula">📑 Carátula</option>
                <option value="victima">🧑 Víctima</option>
                <option value="imputado">⚠️ Imputado/Causante</option>
                <option value="denunciante">📢 Denunciante</option>
              </select>
            </div>

            <div className="form-group-registros">
              <label className="form-label-registros">Término:</label>
              <input
                type="text"
                className="form-input-registros"
                placeholder={
                  searchField === 'all'
                    ? 'Buscar en todos los campos...'
                    : `Buscar por ${searchField}...`
                }
                value={term}
                onChange={e => setTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? '🔄 Buscando...' : '🔍 Buscar'}
            </button>

            <button
              type="button"
              className="btn-clear"
              onClick={handleClearFilters}
              disabled={loading}
            >
              🗑️ Limpiar
            </button>
          </div>
        </form>
      </div>

      {/* Header de resultados */}
      {!loading && registros.length > 0 && (
        <div className="results-header">
          <h2 className="results-title">📊 Resultados</h2>
          {pagination && (
            <div className="results-count">
              {registros.length} de {pagination.total} registros (Página{' '}
              {pagination.page} de {pagination.totalPages})
            </div>
          )}
        </div>
      )}

      {/* Estados de carga y vacío */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner-registros"></div>
          <p className="loading-text">Cargando registros...</p>
        </div>
      ) : registros.length === 0 ? (
        <div className="empty-state-registros">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">No se encontraron registros</h3>
          <p className="empty-description">
            No hay registros que coincidan con tu búsqueda. Intenta con otros
            términos o limpia los filtros.
          </p>
          <div className="empty-actions">
            <button className="btn-search" onClick={handleClearFilters}>
              🔄 Limpiar filtros
            </button>
          </div>
        </div>
      ) : (
        /* Grid de Cards */
        <div className="registros-grid">
          {registros.map(registro => (
            <RegistroCard
              key={registro.id}
              registro={registro}
              isExpanded={expandedRows[registro.id]}
              isEditing={editMode[registro.id]}
              editData={editData}
              onToggle={() => toggleRow(registro.id)}
              onEdit={() => handleEditClick(registro)}
              onSave={() => handleSaveEdit(registro.id)}
              onCancel={() => handleCancelEdit(registro.id)}
              onEditChange={handleEditChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de Card Individual
function RegistroCard({
  registro,
  isExpanded,
  isEditing,
  editData,
  onToggle,
  onEdit,
  onSave,
  onCancel,
  onEditChange,
}) {
  const formatDate = date => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-AR');
  };

  return (
    <div className={`registro-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Header de la Card */}
      <div className="card-header-registro">
        <div className="card-id-badge">#{registro.id}</div>
        <div className="card-actions">
          <button className="btn-table btn-expand" onClick={onToggle}>
            {isExpanded ? '▼ Contraer' : '▶ Expandir'}
          </button>
        </div>
      </div>

      {/* Contenido principal de la Card */}
      <div className="card-content">
        <div className="card-info-row">
          <div className="info-icon">📅</div>
          <div className="info-content">
            <div className="info-label">Fecha de Ingreso</div>
            <div className="info-value">
              {formatDate(registro.fecha_ingreso)}
            </div>
          </div>
        </div>

        <div className="card-info-row">
          <div className="info-icon">🏢</div>
          <div className="info-content">
            <div className="info-label">UFI</div>
            <div className="info-value highlight">{registro.ufi || '-'}</div>
          </div>
        </div>

        <div className="card-info-row">
          <div className="info-icon">📋</div>
          <div className="info-content">
            <div className="info-label">Nº Legajo / Causa</div>
            <div className="info-value highlight">
              {registro.numero_legajo || '-'}
            </div>
          </div>
        </div>

        <div className="card-info-row">
          <div className="info-icon">🏛️</div>
          <div className="info-content">
            <div className="info-label">Sección</div>
            <div className="info-value">
              {registro.seccion_que_interviene || '-'}
            </div>
          </div>
        </div>

        <div className="card-info-row">
          <div className="info-icon">📝</div>
          <div className="info-content">
            <div className="info-label">Detalle del Secuestro</div>
            <div className="info-value">
              {isExpanded ? (
                <div className="objetos-list">
                  {(registro.detalle_secuestro || '-')
                    .split('\n')
                    .map((linea, idx) => {
                      // Parsear cada línea con formato "Objeto N: detalle - Estado: estado"
                      if (linea.trim().startsWith('Objeto')) {
                        return (
                          <div key={idx} className="objeto-item-display">
                            {linea}
                          </div>
                        );
                      }
                      return null;
                    })
                    .filter(Boolean).length > 0 ? (
                    (registro.detalle_secuestro || '-')
                      .split('\n')
                      .map((linea, idx) => {
                        if (linea.trim().startsWith('Objeto')) {
                          return (
                            <div key={idx} className="objeto-item-display">
                              {linea}
                            </div>
                          );
                        }
                        return null;
                      })
                  ) : (
                    <span>{registro.detalle_secuestro || '-'}</span>
                  )}
                </div>
              ) : (
                (registro.detalle_secuestro || '-').substring(0, 100) +
                (registro.detalle_secuestro?.length > 100 ? '...' : '')
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección expandida */}
      {isExpanded && (
        <div className="expanded-section">
          {/* Botones de acción */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <AccionProtegida permiso="editar">
              {!isEditing ? (
                <button className="btn-table btn-edit" onClick={onEdit}>
                  ✏️ Editar Registro
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn-table btn-expand" onClick={onSave}>
                    💾 Guardar Cambios
                  </button>
                  <button className="btn-table btn-delete" onClick={onCancel}>
                    ❌ Cancelar
                  </button>
                </div>
              )}
            </AccionProtegida>
          </div>

          {/* Detalles completos */}
          {!isEditing ? (
            <div className="expanded-content">
              <div className="detail-group">
                <div className="detail-label">📄 Nº de Protocolo</div>
                <div className="detail-value">
                  {registro.numero_protocolo || '-'}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">🔗 Cadena de Custodia</div>
                <div className="detail-value">
                  {registro.cadena_custodia || '-'}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">📑 Nº de Folio</div>
                <div className="detail-value">{registro.nro_folio || '-'}</div>
              </div>

              <div className="detail-group">
                <div className="detail-label">📚 Nº Libro de Secuestro</div>
                <div className="detail-value">
                  {registro.nro_libro_secuestro || '-'}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">👮 Oficial a Cargo</div>
                <div className="detail-value">{registro.of_a_cargo || '-'}</div>
              </div>

              <div className="detail-group">
                <div className="detail-label">💬 Observaciones</div>
                <div className="detail-value">
                  {registro.observaciones || registro.tramite || '-'}
                </div>
              </div>

              {/* Nuevos campos agregados */}
              <div className="detail-group">
                <div className="detail-label">✅ Estado del Secuestro</div>
                <div className="detail-value">
                  {registro.estado_secuestro || '-'}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">📍 Lugar de Depósito</div>
                <div className="detail-value">
                  {registro.lugar_deposito || '-'}
                </div>
              </div>

              <div className="detail-group" style={{ gridColumn: '1 / -1' }}>
                <div className="detail-label">📑 Carátula</div>
                <div className="detail-value">{registro.caratula || '-'}</div>
              </div>

              <div className="detail-group">
                <div className="detail-label">🧑 Víctima</div>
                <div className="detail-value">{registro.victima || '-'}</div>
              </div>

              <div className="detail-group">
                <div className="detail-label">⚠️ Imputado/Causante</div>
                <div className="detail-value">
                  {registro.imputado_causante || '-'}
                </div>
              </div>

              <div className="detail-group">
                <div className="detail-label">📢 Denunciante</div>
                <div className="detail-value">
                  {registro.denunciante || '-'}
                </div>
              </div>
            </div>
          ) : (
            /* Formulario de edición */
            <div className="expanded-content">
              <div className="detail-group">
                <label className="detail-label">📅 Fecha de Ingreso</label>
                <input
                  type="date"
                  className="form-input-registros"
                  value={editData.fecha_ingreso || ''}
                  onChange={e => onEditChange('fecha_ingreso', e.target.value)}
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">🏢 UFI</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.ufi || ''}
                  onChange={e => onEditChange('ufi', e.target.value)}
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">📋 Nº Legajo / Causa</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.numero_legajo || ''}
                  onChange={e => onEditChange('numero_legajo', e.target.value)}
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">🏛️ Sección</label>
                <select
                  className="form-input-registros"
                  value={editData.seccion_que_interviene || ''}
                  onChange={e =>
                    onEditChange('seccion_que_interviene', e.target.value)
                  }
                >
                  <option value="">Seleccione una sección...</option>
                  <option value="Delitos Generales y Especiales">
                    Delitos Generales y Especiales
                  </option>
                  <option value="Cibercrimen">Cibercrimen</option>
                  <option value="Oficina Central(s5)">Oficina Central </option>
                  <option value="Análisis Informática Forense">
                    Análisis Informática Forense
                  </option>
                  <option value="Explotación de Prensa y Reunión de informacion">
                    Explotación de Prensa
                  </option>
                  <option value="Análisis Delictual">Análisis Delictual</option>
                </select>
              </div>

              <div className="detail-group" style={{ gridColumn: '1 / -1' }}>
                <label className="detail-label">📝 Detalle del Secuestro</label>
                <textarea
                  className="form-input-registros"
                  rows="3"
                  value={editData.detalle_secuestro || ''}
                  onChange={e =>
                    onEditChange('detalle_secuestro', e.target.value)
                  }
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">📄 Nº de Protocolo</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.numero_protocolo || ''}
                  onChange={e =>
                    onEditChange('numero_protocolo', e.target.value)
                  }
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">🔗 Cadena de Custodia</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.cadena_custodia || ''}
                  onChange={e =>
                    onEditChange('cadena_custodia', e.target.value)
                  }
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">📑 Nº de Folio</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.nro_folio || ''}
                  onChange={e => onEditChange('nro_folio', e.target.value)}
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">📚 Nº Libro de Secuestro</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.nro_libro_secuestro || ''}
                  onChange={e =>
                    onEditChange('nro_libro_secuestro', e.target.value)
                  }
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">👮 Oficial a Cargo</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.of_a_cargo || ''}
                  onChange={e => onEditChange('of_a_cargo', e.target.value)}
                />
              </div>

              <div className="detail-group" style={{ gridColumn: '1 / -1' }}>
                <label className="detail-label">💬 Observaciones</label>
                <textarea
                  className="form-input-registros"
                  rows="2"
                  value={editData.tramite || editData.observaciones || ''}
                  onChange={e => onEditChange('tramite', e.target.value)}
                />
              </div>

              {/* Nuevos campos editables */}
              <div className="detail-group">
                <label className="detail-label">✅ Estado del Secuestro</label>
                <select
                  className="form-input-registros"
                  value={editData.estado_secuestro || ''}
                  onChange={e =>
                    onEditChange('estado_secuestro', e.target.value)
                  }
                >
                  <option value="">Seleccione un estado...</option>
                  <option value="Remitido">Remitido</option>
                  <option value="En depósito">En depósito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="detail-group">
                <label className="detail-label">📍 Lugar de Depósito</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.lugar_deposito || ''}
                  onChange={e => onEditChange('lugar_deposito', e.target.value)}
                  placeholder="Ubicación del depósito"
                />
              </div>

              <div className="detail-group" style={{ gridColumn: '1 / -1' }}>
                <label className="detail-label">📑 Carátula</label>
                <textarea
                  className="form-input-registros"
                  rows="2"
                  value={editData.caratula || ''}
                  onChange={e => onEditChange('caratula', e.target.value)}
                  placeholder="Carátula de la causa judicial"
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">🧑 Víctima</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.victima || ''}
                  onChange={e => onEditChange('victima', e.target.value)}
                  placeholder="Nombre de la víctima"
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">⚠️ Imputado/Causante</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.imputado_causante || ''}
                  onChange={e =>
                    onEditChange('imputado_causante', e.target.value)
                  }
                  placeholder="Nombre del imputado o causante"
                />
              </div>

              <div className="detail-group">
                <label className="detail-label">📢 Denunciante</label>
                <input
                  type="text"
                  className="form-input-registros"
                  value={editData.denunciante || ''}
                  onChange={e => onEditChange('denunciante', e.target.value)}
                  placeholder="Nombre del denunciante"
                />
              </div>
            </div>
          )}

          {/* Archivos Adjuntos */}
          <div className="archivos-section">
            <h4 className="archivos-title">📎 Archivos Adjuntos</h4>
            <ArchivosAdjuntos registroId={registro.id} />
          </div>
        </div>
      )}
    </div>
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

  if (loading) {
    return (
      <div className="loading-text" style={{ fontSize: 'var(--font-size-sm)' }}>
        Cargando archivos...
      </div>
    );
  }

  if (archivos.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-lg)',
          color: 'var(--text-tertiary)',
        }}
      >
        No hay archivos adjuntos
      </div>
    );
  }

  return (
    <div>
      {archivos.map(archivo => (
        <div key={archivo.id} className="archivo-item">
          <div className="archivo-info">
            <div className="archivo-icon">{getFileIcon(archivo.tipo_mime)}</div>
            <div className="archivo-details">
              <div className="archivo-name">
                {archivo.nombre_original || 'Archivo sin nombre'}
              </div>
              <div className="archivo-size">
                {formatFileSize(archivo.tamano_bytes)}
              </div>
            </div>
          </div>
          <button
            className="btn-download"
            onClick={() => handleDownload(archivo)}
          >
            ⬇️ Descargar
          </button>
        </div>
      ))}
    </div>
  );
}
