import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import './UsersManagement.css';

const UsersManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

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

  const rolSeleccionado = roles.find(r => r.id === parseInt(formData.rol_id));

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="users-management">
      <div className="header">
        <h2>Gestión de Usuarios</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Crear Usuario
        </button>
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
    </div>
  );
};

export default UsersManagement;
