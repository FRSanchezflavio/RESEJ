import React, { useState, useRef } from 'react';
import { uploadRegistro } from '../../api/api';
import './UploadForm.css';

export default function UploadForm() {
  const [form, setForm] = useState({
    fecha_carga: '',
    fecha_ingreso: '',
    ufi: '',
    numero_legajo: '',
    seccion_que_interviene: '',
    detalle_secuestro: '',
    numero_protocolo: '',
    cadena_custodia: '',
    nro_folio: '',
    nro_libro_secuestro: '',
    of_a_cargo: '',
    observaciones: '',
    // Nuevos campos
    estado_secuestro: '',
    lugar_deposito: '',
    caratula: '',
    victima: '',
    imputado_causante: '',
    denunciante: '',
  });
  const [objetosSecuestrados, setObjetosSecuestrados] = useState([
    { id: 1, detalle: '', estado: '' },
  ]);
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCaratulaDetails, setShowCaratulaDetails] = useState(false);
  const fileInputRef = useRef(null);

  // Funciones para manejar objetos secuestrados
  const agregarObjeto = () => {
    const nuevoId =
      objetosSecuestrados.length > 0
        ? Math.max(...objetosSecuestrados.map(obj => obj.id)) + 1
        : 1;
    setObjetosSecuestrados([
      ...objetosSecuestrados,
      { id: nuevoId, detalle: '', estado: '' },
    ]);
  };

  const eliminarObjeto = id => {
    if (objetosSecuestrados.length > 1) {
      setObjetosSecuestrados(objetosSecuestrados.filter(obj => obj.id !== id));
    }
  };

  const actualizarObjeto = (id, campo, valor) => {
    setObjetosSecuestrados(
      objetosSecuestrados.map(obj =>
        obj.id === id ? { ...obj, [campo]: valor } : obj
      )
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg('');

    const fd = new FormData();

    // Convertir fechas a formato ISO (yyyy-mm-dd)
    const fechaIngresoISO = form.fecha_ingreso
      ? new Date(form.fecha_ingreso).toISOString().split('T')[0]
      : '';
    const fechaCargaISO = form.fecha_carga
      ? new Date(form.fecha_carga).toISOString().split('T')[0]
      : '';

    // Construir el detalle completo con todos los objetos
    const detalleCompleto = objetosSecuestrados
      .map(
        (obj, index) =>
          `Objeto ${index + 1}: ${obj.detalle} - Estado: ${
            obj.estado || 'Sin especificar'
          }`
      )
      .join('\n');

    // Agregar todos los campos
    Object.entries({
      ...form,
      detalle_secuestro: detalleCompleto,
      fecha_ingreso: fechaIngresoISO,
      fecha_carga: fechaCargaISO,
      persona_id: 1, // temporal
    }).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });

    // Archivos
    if (files.length > 0) {
      files.forEach(file => {
        fd.append('archivos', file);
      });
    }

    try {
      await uploadRegistro(fd);
      setMsg('success');

      // Resetear formulario
      setForm({
        fecha_carga: '',
        fecha_ingreso: '',
        ufi: '',
        numero_legajo: '',
        seccion_que_interviene: '',
        detalle_secuestro: '',
        numero_protocolo: '',
        cadena_custodia: '',
        nro_folio: '',
        nro_libro_secuestro: '',
        of_a_cargo: '',
        observaciones: '',
        estado_secuestro: '',
        lugar_deposito: '',
        caratula: '',
        victima: '',
        imputado_causante: '',
        denunciante: '',
      });
      setFiles([]);
      setObjetosSecuestrados([{ id: 1, detalle: '', estado: '' }]);
      setShowCaratulaDetails(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Error detallado:', err.response?.data || err.message);
      setMsg('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = e => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === 'date' && value) {
      if (value.includes('/')) {
        const [dia, mes, anio] = value.split('/');
        newValue = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }

    setForm({ ...form, [name]: newValue });
  };

  const handleFileChange = e => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDragOver = e => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const removeFile = index => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="upload-form-container">
      <div className="upload-form-header">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <div>
          <h1 className="upload-form-title">Nuevo Registro de Secuestro</h1>
          <p className="upload-form-subtitle">
            Complete el formulario con los datos del secuestro judicial
          </p>
        </div>
      </div>

      {msg === 'success' && (
        <div className="alert-upload alert-success">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div className="alert-content">
            <h4>¡Registro cargado exitosamente!</h4>
            <p>El registro ha sido guardado correctamente en el sistema</p>
          </div>
        </div>
      )}

      {msg === 'error' && (
        <div className="alert-upload alert-error">
          <div className="alert-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <div className="alert-content">
            <h4>Error al cargar el registro</h4>
            <p>Por favor, verifique los datos e intente nuevamente</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        {/* Sección: Información Básica */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2 className="section-title">Información Básica</h2>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">
                <span className="label-text">Fecha de ingreso</span>
                <span className="label-required">*</span>
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input
                  type="date"
                  name="fecha_ingreso"
                  value={form.fecha_ingreso}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-text">U.F.I</span>
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <input
                  type="text"
                  name="ufi"
                  value={form.ufi}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: UFI N° 5"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-text">N° Legajo / Causa</span>
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <input
                  type="text"
                  name="numero_legajo"
                  value={form.numero_legajo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ej: Causa 1234/25"
                />
              </div>
            </div>

            <div className="form-field ">
              <label className="form-label">
                <span className="label-text">Sección que interviene</span>
                <span className="label-required">*</span>
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <select
                  name="seccion_que_interviene"
                  value={form.seccion_que_interviene}
                  onChange={handleChange}
                  className="form-input form-select"
                  required
                >
                  <option value="">Seleccione una sección...</option>
                  <option value="Delitos Generales y Especiales">
                    Delitos Generales y Especiales
                  </option>
                  <option value="Cibercrimen">Cibercrimen</option>
                  <option value="Of. Central">Of. Central</option>
                  <option value="Análisis Informática Forense">
                    Análisis Informática Forense
                  </option>
                  <option value="Explotación de Prensa">
                    Explotación de Prensa
                  </option>
                  <option value="Análisis Delictual">Análisis Delictual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-field full-width">
            <label className="form-label">
              <span className="label-text">Objetos Secuestrados</span>
              <span className="label-required">*</span>
            </label>

            <div className="objetos-secuestrados-container">
              {objetosSecuestrados.map((objeto, index) => (
                <div key={objeto.id} className="objeto-secuestrado-item">
                  <div className="objeto-numero">Objeto {index + 1}</div>

                  <div className="objeto-inputs">
                    <div className="objeto-detalle">
                      <input
                        type="text"
                        value={objeto.detalle}
                        onChange={e =>
                          actualizarObjeto(objeto.id, 'detalle', e.target.value)
                        }
                        className="form-input"
                        placeholder="Descripción del objeto secuestrado..."
                        required={index === 0}
                      />
                    </div>

                    <div className="objeto-estado">
                      <select
                        value={objeto.estado}
                        onChange={e =>
                          actualizarObjeto(objeto.id, 'estado', e.target.value)
                        }
                        className="form-select"
                      >
                        <option value="">Estado...</option>
                        <option value="Remitido">Remitido</option>
                        <option value="En depósito">En depósito</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>

                    {objetosSecuestrados.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarObjeto(objeto.id)}
                        className="btn-eliminar-objeto"
                        title="Eliminar objeto"
                      >
                        <span>✕</span>
                        <span>Eliminar objeto</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={agregarObjeto}
                className="btn-agregar-objeto"
              >
                + Agregar otro objeto
              </button>
            </div>
          </div>
        </div>

        {/* Sección: Datos Técnicos */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-number">02</span>
            <h2 className="section-title">Datos Técnicos</h2>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">
                <span className="label-text">N° de protocolo</span>
              </label>
              <input
                type="text"
                name="numero_protocolo"
                value={form.numero_protocolo}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese número de protocolo"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-text">Cadena de custodia</span>
              </label>
              <input
                type="text"
                name="cadena_custodia"
                value={form.cadena_custodia}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese cadena de custodia"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-text">N° de folio</span>
              </label>
              <input
                type="text"
                name="nro_folio"
                value={form.nro_folio}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese número de folio"
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-text">N° de libro de secuestro</span>
              </label>
              <input
                type="text"
                name="nro_libro_secuestro"
                value={form.nro_libro_secuestro}
                onChange={handleChange}
                className="form-input"
                placeholder="Ingrese número de libro"
              />
            </div>
          </div>
        </div>

        {/* Sección: Datos Adicionales */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-number">03</span>
            <h2 className="section-title">Datos Adicionales</h2>
          </div>

          <div className="form-field full-width">
            <label className="form-label">
              <span className="label-text">Oficial a cargo de la causa</span>
            </label>
            <input
              type="text"
              name="of_a_cargo"
              value={form.of_a_cargo}
              onChange={handleChange}
              className="form-input"
              placeholder="Nombre completo del oficial"
            />
          </div>

          <div className="form-field full-width">
            <label className="form-label">
              <span className="label-text">Observaciones</span>
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
              placeholder="Agregue cualquier observación adicional..."
            />
          </div>

          {/* Nuevos campos: Estado y Depósito */}
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">
                <span className="label-text">Estado del secuestro</span>
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <select
                  name="estado_secuestro"
                  value={form.estado_secuestro}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="">Seleccione un estado...</option>
                  <option value="Remitido">Remitido</option>
                  <option value="En depósito">En depósito</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">
                <span className="label-text">Lugar de depósito</span>
              </label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <input
                  type="text"
                  name="lugar_deposito"
                  value={form.lugar_deposito}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ubicación del depósito"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Información de la Causa */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-number">04</span>
            <h2 className="section-title">Información de la Causa</h2>
          </div>

          <div className="form-field full-width">
            <label className="form-label">
              <span className="label-text">Carátula</span>
            </label>
            <textarea
              name="caratula"
              value={form.caratula}
              onChange={handleChange}
              className="form-textarea"
              rows={2}
              placeholder="Carátula de la causa judicial"
            />
          </div>

          {/* Toggle para mostrar/ocultar detalles adicionales */}
          <div className="form-field full-width">
            <button
              type="button"
              onClick={() => setShowCaratulaDetails(!showCaratulaDetails)}
              className="toggle-details-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showCaratulaDetails ? 'M19 9l-7 7-7-7' : 'M9 5l7 7-7 7'}
                />
              </svg>
              <span>
                {showCaratulaDetails ? 'Ocultar' : 'Mostrar'} detalles de la
                causa
              </span>
            </button>
          </div>

          {showCaratulaDetails && (
            <div className="caratula-details">
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">
                    <span className="label-text">Víctima</span>
                  </label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="victima"
                      value={form.victima}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nombre de la víctima"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">
                    <span className="label-text">Imputado / Causante</span>
                  </label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="imputado_causante"
                      value={form.imputado_causante}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nombre del imputado o causante"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">
                    <span className="label-text">Denunciante</span>
                  </label>
                  <div className="input-wrapper">
                    <svg
                      className="input-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      name="denunciante"
                      value={form.denunciante}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Nombre del denunciante"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sección: Archivos Adjuntos */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-number">05</span>
            <h2 className="section-title">Archivos Adjuntos</h2>
          </div>

          <div
            className={`file-drop-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input-hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />

            <div className="file-drop-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="file-drop-text">
              <h3>Arrastra archivos aquí o haz clic para seleccionar</h3>
              <p>Soporta: PDF, JPG, PNG</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon">
                    {file.type.includes('pdf') ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M15.5,16.5V19H14V14.5H15.5V16.5M11,19H9.5V14.5H11C11.8,14.5 12.5,15.2 12.5,16V17.5C12.5,18.3 11.8,19 11,19M11,16V17.5H10.5V16H11M7,14.5H8.5V19H7V14.5Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                      </svg>
                    )}
                  </div>
                  <div className="file-info">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="file-remove"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-secondary-upload"
            disabled={isSubmitting}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary-upload"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-upload"></span>
                Guardando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Guardar Registro
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
