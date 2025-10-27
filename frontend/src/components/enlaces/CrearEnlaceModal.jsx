import React, { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import { Copy, Check, Download, Eye, EyeOff } from 'lucide-react';
import QRCode from 'qrcode';
import { enlacesApi } from '../../services/enlacesApi';
import './CrearEnlaceModal.css';

// Obtener URL base del frontend desde variable de entorno
const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || window.location.origin;

// ✅ CAMBIO: Mantener onSuccess en los parámetros para que el padre pueda recargar
const CrearEnlaceModal = ({ show, onHide, onSuccess }) => {
  const [paso, setPaso] = useState(1); // 1: formulario, 2: resultado
  const [registros, setRegistros] = useState([]);
  const [formData, setFormData] = useState({
    registro_id: '',
    duracion_horas: '24',
    max_accesos: '',
    descripcion: '',
    requiere_contrasena: false,
    contrasena: '',
  });
  const [enlaceGenerado, setEnlaceGenerado] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cargar registros cuando se abre el modal
  React.useEffect(() => {
    if (show) {
      cargarRegistros();
    }
  }, [show]);

  const cargarRegistros = async () => {
    try {
      console.log('=== Iniciando cargarRegistros ===');

      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      console.log('Token disponible:', !!token);

      if (!token) {
        console.error('No hay token disponible');
        setRegistros([]);
        return;
      }

      // Hacer petición a la API de registros
      console.log('Realizando fetch a http://localhost:3000/api/registros');

      const response = await fetch('http://localhost:3000/api/registros', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Error ${response.status}:`, errorData);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      console.log('JSON recibido:', json);

      // La estructura es: { success: true, data: { registros: [...], pagination: {...} } }
      let datos = [];

      if (json.data && Array.isArray(json.data.registros)) {
        datos = json.data.registros;
        console.log('Datos encontrados en json.data.registros:', datos);
      } else if (json.data && Array.isArray(json.data)) {
        datos = json.data;
        console.log('Datos encontrados en json.data:', datos);
      } else if (Array.isArray(json)) {
        datos = json;
        console.log('Datos encontrados en json directo:', datos);
      } else {
        console.warn('Estructura de datos no reconocida:', json);
        datos = [];
      }

      console.log('Registros procesados final:', datos);
      setRegistros(datos);
    } catch (err) {
      console.error('Error COMPLETO cargando registros:', {
        mensaje: err.message,
        stack: err.stack,
        error: err,
      });
      setError(`Error cargando registros: ${err.message}`);
      setRegistros([]);
    }
  };

  // Generar QR
  const generarQR = async enlaceUrl => {
    try {
      const qr = await QRCode.toDataURL(enlaceUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
      });
      setQrDataUrl(qr);
    } catch (err) {
      console.error('Error generando QR:', err);
      setError('Error al generar el código QR');
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar datos
      if (!formData.registro_id) {
        setError('Selecciona un registro');
        setLoading(false);
        return;
      }

      // Crear el enlace
      const respuesta = await enlacesApi.crearEnlace({
        registro_id: parseInt(formData.registro_id),
        duracion_horas: parseInt(formData.duracion_horas) || 24,
        max_accesos: formData.max_accesos
          ? parseInt(formData.max_accesos)
          : null,
        descripcion: formData.descripcion || '',
        requiere_contrasena: formData.requiere_contrasena,
        contrasena: formData.requiere_contrasena ? formData.contrasena : null,
      });

      setEnlaceGenerado(respuesta);

      // Generar QR con la URL del enlace
      const enlaceUrl = `${FRONTEND_URL}/enlace/${respuesta.token}`;
      await generarQR(enlaceUrl);

      setPaso(2);

      // Notificar al padre que se creó exitosamente
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error creando enlace:', err);
      const mensajeError =
        err.response?.data?.message ||
        err.message ||
        'Error al crear el enlace';
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const copiarURL = () => {
    if (enlaceGenerado) {
      const url = `${FRONTEND_URL}/enlace/${enlaceGenerado.token}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
    }
  };

  const descargarQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `qr-enlace-${enlaceGenerado.token}.png`;
      link.click();
    }
  };

  const cerrarModal = () => {
    setPaso(1);
    setFormData({
      registro_id: '',
      duracion_horas: '24',
      max_accesos: '',
      descripcion: '',
      requiere_contrasena: false,
      contrasena: '',
    });
    setEnlaceGenerado(null);
    setQrDataUrl('');
    setError('');
    onHide();
  };

  return (
    <Modal show={show} onHide={cerrarModal} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {paso === 1 ? 'Crear Enlace Compartido' : 'Enlace Generado'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        {paso === 1 ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Registro a compartir *</Form.Label>
              <Form.Select
                name="registro_id"
                value={formData.registro_id}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">-- Selecciona un registro --</option>
                {registros.map(reg => {
                  // Obtener nombre de la persona desde diferentes posibles estructuras
                  let nombrePersona = 'Sin nombre';
                  if (reg.persona_info) {
                    if (typeof reg.persona_info === 'string') {
                      try {
                        const personaObj = JSON.parse(reg.persona_info);
                        nombrePersona = `${personaObj.nombre || ''} ${
                          personaObj.apellido || ''
                        }`.trim();
                      } catch {
                        nombrePersona = reg.persona_info;
                      }
                    } else {
                      nombrePersona = `${reg.persona_info.nombre || ''} ${
                        reg.persona_info.apellido || ''
                      }`.trim();
                    }
                  }

                  return (
                    <option key={reg.id} value={reg.id}>
                      {nombrePersona} - Legajo: {reg.numero_legajo || 'N/A'}
                    </option>
                  );
                })}
              </Form.Select>
              <Form.Text className="text-muted">
                {registros.length === 0 && 'No hay registros disponibles'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duración (horas) *</Form.Label>
              <Form.Select
                name="duracion_horas"
                value={formData.duracion_horas}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="1">1 hora</option>
                <option value="24">24 horas (1 día)</option>
                <option value="72">72 horas (3 días)</option>
                <option value="168">168 horas (1 semana)</option>
                <option value="720">720 horas (1 mes)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Accesos máximos (opcional)</Form.Label>
              <Form.Control
                type="number"
                name="max_accesos"
                value={formData.max_accesos}
                onChange={handleInputChange}
                placeholder="Ej: 10"
                min="1"
                disabled={loading}
              />
              <Form.Text className="text-muted">
                Deja en blanco para accesos ilimitados
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Notas sobre este enlace..."
                rows="2"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="requiere_contrasena"
                label="Proteger con contraseña"
                checked={formData.requiere_contrasena}
                onChange={handleInputChange}
                disabled={loading}
              />
            </Form.Group>

            {formData.requiere_contrasena && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña *</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                    placeholder="Ingresa una contraseña segura"
                    required={formData.requiere_contrasena}
                    disabled={loading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </InputGroup>
              </Form.Group>
            )}
          </Form>
        ) : (
          <div className="qr-result-container">
            <div className="qr-success">
              <h5 className="mb-3">¡Enlace creado exitosamente!</h5>

              {qrDataUrl && (
                <div className="qr-code-box">
                  <img src={qrDataUrl} alt="Código QR" className="qr-image" />
                </div>
              )}

              <div className="enlace-info mt-4 p-3 bg-light rounded">
                <div className="mb-2">
                  <strong>URL del enlace:</strong>
                  <InputGroup className="mt-2">
                    <Form.Control
                      type="text"
                      value={`${FRONTEND_URL}/enlace/${enlaceGenerado?.token}`}
                      readOnly
                    />
                    <Button
                      variant={copiado ? 'success' : 'outline-primary'}
                      onClick={copiarURL}
                      title="Copiar"
                    >
                      {copiado ? (
                        <>
                          <Check size={18} /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy size={18} /> Copiar
                        </>
                      )}
                    </Button>
                  </InputGroup>
                </div>

                <div className="mt-3">
                  <strong>Token:</strong>
                  <div className="text-muted small font-monospace">
                    {enlaceGenerado?.token}
                  </div>
                </div>

                {enlaceGenerado?.fecha_expiracion && (
                  <div className="mt-3">
                    <strong>Expira:</strong>
                    <div className="text-muted small">
                      {new Date(enlaceGenerado.fecha_expiracion).toLocaleString(
                        'es-ES'
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {paso === 1 ? (
          <>
            <Button
              variant="secondary"
              onClick={cerrarModal}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" /> Creando...
                </>
              ) : (
                'Crear Enlace'
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline-primary" onClick={descargarQR}>
              <Download size={18} className="me-2" /> Descargar QR
            </Button>
            <Button variant="primary" onClick={cerrarModal}>
              Listo
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CrearEnlaceModal;
