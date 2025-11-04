import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './UsersManagement.css';

const UsersManagement = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [enlaceGenerado, setEnlaceGenerado] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: 2,
    enviarEmail: true,
  });

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await Promise.all([cargarUsuarios(), cargarRoles()]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      mostrarMensaje('error', 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      console.log('Usuarios cargados:', response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      throw error;
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await api.get('/usuarios/roles');
      console.log('Roles cargados:', response.data);
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      throw error;
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validaciones del lado del cliente
    if (!formData.username.trim()) {
      mostrarMensaje('error', 'El nombre de usuario es requerido');
      return;
    }

    if (!formData.email.trim()) {
      mostrarMensaje('error', 'El email es requerido');
      return;
    }

    if (!formData.password.trim()) {
      mostrarMensaje('error', 'La contraseña es requerida');
      return;
    }

    if (formData.password.length < 6) {
      mostrarMensaje('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      mostrarMensaje('error', 'El formato del email no es válido');
      return;
    }

    try {
      console.log('========================================');
      console.log('📤 INICIANDO CREACIÓN DE USUARIO');
      console.log('FormData original:', formData);

      const dataToSend = {
        username: formData.username.trim(),
        nombre: formData.nombre.trim() || null,
        apellido: formData.apellido.trim() || null,
        email: formData.email.trim(),
        password: formData.password,
        rol_id: parseInt(formData.rol_id),
        enviarEmail: formData.enviarEmail,
      };

      console.log('📋 Datos preparados para enviar:');
      console.log(JSON.stringify(dataToSend, null, 2));
      console.log('========================================');

      const response = await api.post('/usuarios', dataToSend);

      console.log('✅ Respuesta exitosa del servidor:');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('========================================');

      if (response.data.success) {
        let mensajeExito = 'Usuario creado exitosamente';
        if (formData.enviarEmail) {
          if (response.data.emailEnviado) {
            mensajeExito += ' y correo enviado';
          } else {
            mensajeExito += ` (${
              response.data.mensajeEmail || 'pero no se pudo enviar el correo'
            })`;
          }
        }

        mostrarMensaje('success', mensajeExito);

        // Resetear formulario
        setFormData({
          username: '',
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          rol_id: 2,
          enviarEmail: true,
        });

        setShowModal(false);
        await cargarUsuarios();
      }
    } catch (error) {
      console.error('========================================');
      console.error('❌ ERROR AL CREAR USUARIO');
      console.error('Error completo:', error);
      console.error('Mensaje:', error.message);
      console.error('Código de estado:', error.response?.status);
      console.error('Datos de respuesta:', error.response?.data);
      console.error('Headers de respuesta:', error.response?.headers);
      console.error('========================================');

      const mensajeError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Error al crear el usuario';

      mostrarMensaje('error', mensajeError);
    }
  };

  const handleEliminar = async id => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await api.delete(`/usuarios/${id}`);
      mostrarMensaje('success', 'Usuario eliminado exitosamente');
      await cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      const mensajeError =
        error.response?.data?.error || 'Error al eliminar el usuario';
      mostrarMensaje('error', mensajeError);
    }
  };

  const handleGenerarEnlace = async (usuarioId, username) => {
    try {
      console.log('🔗 Generando enlace de acceso para usuario:', usuarioId);
      const response = await api.post('/usuarios/generar-enlace-acceso', {
        usuario_id: usuarioId,
      });

      if (response.data.success) {
        console.log('✅ Enlace generado:', response.data);
        const data = response.data.data || response.data;
        setEnlaceGenerado({
          enlace: data.enlace,
          usuarioDestino: username,
          rolDestino: data.rol_destino,
          validoHasta: data.valido_hasta,
          tiempoRestante: calcularTiempoRestante(data.valido_hasta),
        });
        setShowLinkModal(true);
        setCopiado(false);
      }
    } catch (error) {
      console.error('❌ Error al generar enlace:', error);
      const mensajeError =
        error.response?.data?.error || 'Error al generar el enlace de acceso';
      mostrarMensaje('error', mensajeError);
    }
  };

  const copiarAlPortapapeles = () => {
    if (enlaceGenerado?.enlace) {
      navigator.clipboard
        .writeText(enlaceGenerado.enlace)
        .then(() => {
          setCopiado(true);
          setTimeout(() => setCopiado(false), 3000);
          console.log('📋 Enlace copiado al portapapeles');
        })
        .catch(err => {
          console.error('Error al copiar:', err);
          mostrarMensaje('error', 'No se pudo copiar el enlace');
        });
    }
  };

  const formatearFecha = fecha => {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calcularTiempoRestante = fechaExpiracion => {
    const ahora = new Date();
    const expiracion = new Date(fechaExpiracion);
    const diferencia = expiracion - ahora;

    if (diferencia <= 0) return 'Expirado';

    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    return `${horas}h ${minutos}m`;
  };

  const rolSeleccionado = roles.find(r => r.id === parseInt(formData.rol_id));

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="users-management">
      <div className="header">
        <h2>Gestión de Usuarios</h2>
        <div className="header-actions">
          <button className="btn-volver" onClick={() => navigate('/dashboard')}>
            ← Volver
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Crear Usuario
          </button>
        </div>
      </div>

      {mensaje.texto && (
        <div className={`mensaje mensaje-${mensaje.tipo}`}>{mensaje.texto}</div>
      )}

      <div className="usuarios-lista">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.username}</td>
                <td>
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`badge badge-${usuario.rol}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-link btn-sm"
                    onClick={() =>
                      handleGenerarEnlace(usuario.id, usuario.username)
                    }
                    title="Generar enlace de acceso temporal"
                  >
                    🔗
                  </button>
                  <button
                    className="btn-danger btn-sm"
                    onClick={() => handleEliminar(usuario.id)}
                    disabled={usuario.id === 1}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nuevo Usuario</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Usuario *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Nombre de usuario"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Apellido"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rol_id">Rol de Usuario *</label>
                <select
                  id="rol_id"
                  name="rol_id"
                  value={formData.rol_id}
                  onChange={handleChange}
                  required
                >
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1)}
                    </option>
                  ))}
                </select>
                {rolSeleccionado && (
                  <small className="rol-descripcion">
                    {rolSeleccionado.descripcion}
                  </small>
                )}
              </div>

              <div className="form-group-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="enviarEmail"
                    checked={formData.enviarEmail}
                    onChange={handleChange}
                  />
                  <span>Enviar credenciales por correo electrónico</span>
                </label>
                <small>
                  El usuario recibirá un email con sus credenciales y un enlace
                  para acceder
                </small>
              </div>

              {rolSeleccionado && (
                <div className="permisos-info">
                  <h4>Permisos del rol:</h4>
                  <ul>
                    <li
                      className={
                        rolSeleccionado.puede_consultar
                          ? 'permiso-si'
                          : 'permiso-no'
                      }
                    >
                      {rolSeleccionado.puede_consultar ? '✓' : '✗'} Consultar
                    </li>
                    <li
                      className={
                        rolSeleccionado.puede_crear
                          ? 'permiso-si'
                          : 'permiso-no'
                      }
                    >
                      {rolSeleccionado.puede_crear ? '✓' : '✗'} Crear
                    </li>
                    <li
                      className={
                        rolSeleccionado.puede_editar
                          ? 'permiso-si'
                          : 'permiso-no'
                      }
                    >
                      {rolSeleccionado.puede_editar ? '✓' : '✗'} Editar
                    </li>
                    <li
                      className={
                        rolSeleccionado.puede_eliminar
                          ? 'permiso-si'
                          : 'permiso-no'
                      }
                    >
                      {rolSeleccionado.puede_eliminar ? '✓' : '✗'} Eliminar
                    </li>
                  </ul>
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLinkModal && enlaceGenerado && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div
            className="modal-content modal-link"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>🔗 Enlace de Acceso Temporal</h3>
              <button
                className="btn-close"
                onClick={() => setShowLinkModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="link-info">
                <div className="info-item">
                  <strong>Usuario destino:</strong>{' '}
                  {enlaceGenerado.usuarioDestino}
                </div>
                <div className="info-item">
                  <strong>Rol:</strong>{' '}
                  <span className={`badge badge-${enlaceGenerado.rolDestino}`}>
                    {enlaceGenerado.rolDestino}
                  </span>
                </div>
                <div className="info-item">
                  <strong>Válido hasta:</strong>{' '}
                  {formatearFecha(enlaceGenerado.validoHasta)}
                </div>
                <div className="info-item">
                  <strong>Tiempo restante:</strong>{' '}
                  <span className="badge badge-tiempo">
                    {enlaceGenerado.tiempoRestante}
                  </span>
                </div>
              </div>

              <div className="link-container">
                <label>Enlace de acceso:</label>
                <div className="link-box">{enlaceGenerado.enlace}</div>
                <button
                  className={`btn-copy ${copiado ? 'copiado' : ''}`}
                  onClick={copiarAlPortapapeles}
                >
                  {copiado ? '✓ Copiado' : '📋 Copiar enlace'}
                </button>
              </div>

              <div className="advertencias">
                <div className="advertencia-warning">
                  <strong>⚠️ Importante:</strong>
                  <ul>
                    <li>Este enlace solo puede ser usado UNA vez</li>
                    <li>Expira automáticamente en 24 horas</li>
                    <li>No envíes este enlace por canales inseguros</li>
                  </ul>
                </div>
                <div className="advertencia-info">
                  <strong>ℹ️ Recomendaciones:</strong>
                  <ul>
                    <li>Comparte el enlace directamente con el usuario</li>
                    <li>Verifica la identidad antes de compartir</li>
                    <li>
                      El enlace está configurado para tu red local (
                      {enlaceGenerado.enlace.split('/')[2]})
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowLinkModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
