import React, { useEffect, useState, useContext } from 'react';
import { Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { fetchUsers, createUser } from '../../api/api';
import InviteUserModal from './InviteUserModal';
import { AuthContext } from '../../context/AuthContext';

export default function UsersManagement() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [form, setForm] = useState({
    usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'usuario_consulta',
  });
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [mensajeEmail, setMensajeEmail] = useState('');

  useEffect(() => {
    // Debug: Mostrar información del usuario actual
    console.log('👤 Usuario actual:', user);
    console.log('🔑 Rol:', user?.rol);
    console.log('✅ Es admin:', isAdmin);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try {
      const res = await fetchUsers();
      // asegura que users sea siempre array
      let data = res?.data?.data || res?.data || [];
      if (!Array.isArray(data)) data = [];
      setUsers(data);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setUsers([]); // fallback
    }
  }

  const handleCreate = async () => {
    try {
      // Validar campos requeridos
      if (!form.usuario || !form.nombre || !form.apellido || !form.password) {
        alert('Por favor completa todos los campos obligatorios');
        return;
      }

      // Validar que el email esté presente si se quiere enviar
      if (enviarEmail && !form.email) {
        alert(
          'Por favor ingresa un email para enviar las credenciales, o desmarca la opción de envío'
        );
        return;
      }

      const datosUsuario = {
        usuario: form.usuario,
        nombre: form.nombre,
        apellido: form.apellido,
        password: form.password,
        rol: form.rol,
        ...(form.email && { email: form.email }), // Solo incluir email si existe
        enviarEmail: enviarEmail && form.email ? true : false,
      };

      console.log('📤 Datos a enviar:', datosUsuario);
      const response = await createUser(datosUsuario);

      // Mostrar mensaje sobre el envío del email
      if (response.data?.data?.emailEnviado) {
        setMensajeEmail('✓ Usuario creado y credenciales enviadas por email');
        alert(
          `Usuario creado exitosamente.\n\n✉️ Se han enviado las credenciales al correo: ${form.email}`
        );
      } else if (enviarEmail && form.email) {
        setMensajeEmail('⚠ Usuario creado pero no se pudo enviar el email');
        alert(
          `Usuario creado exitosamente.\n\n⚠️ Advertencia: No se pudo enviar el correo con las credenciales.\n${
            response.data?.data?.mensajeEmail ||
            'Verifica la configuración del servidor de email.'
          }`
        );
      } else {
        alert('Usuario creado exitosamente');
      }

      setShow(false);
      setForm({
        usuario: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'usuario_consulta',
      });
      setEnviarEmail(true);
      setMensajeEmail('');
      load();
    } catch (err) {
      console.error('❌ Error creando usuario:', err);
      console.error('📋 Respuesta del servidor:', err.response?.data);
      console.error('📊 Status:', err.response?.status);

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.detalles?.[0]?.msg ||
        JSON.stringify(err.response?.data) ||
        err.message;

      alert(`Error al crear usuario: ${errorMsg}`);
    }
  };

  // Verificar si el usuario es administrador
  const isAdmin = user?.rol === 'administrador' || user?.rol === 'admin';

  return (
    <Card className="p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6>👥 Gestión de Usuarios</h6>
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => setShowInviteModal(true)}
            disabled={!isAdmin}
            title={
              !isAdmin
                ? 'Solo administradores pueden invitar usuarios'
                : 'Invitar usuario por email'
            }
          >
            📧 Invitar Usuario
          </Button>
          <Button
            size="sm"
            onClick={() => setShow(true)}
            disabled={!isAdmin}
            title={
              !isAdmin
                ? 'Solo administradores pueden crear usuarios'
                : 'Crear usuario manualmente'
            }
          >
            Crear Nuevo Usuario
          </Button>
        </div>
      </div>

      {!isAdmin && (
        <Alert variant="danger" className="mb-3">
          <strong>🚫 Acceso Denegado</strong>
          <p className="mb-2 mt-2">
            Solo los administradores pueden gestionar usuarios.
          </p>
          <div className="bg-light p-2 rounded mt-2">
            <small>
              <strong>Tu usuario:</strong> {user?.usuario || 'Desconocido'}
              <br />
              <strong>Tu rol:</strong> {user?.rol || 'Desconocido'}
            </small>
          </div>
          <hr />
          <small className="text-muted">
            💡 <strong>Solución:</strong> Cierra sesión y vuelve a iniciar con
            el usuario <code>admin</code> y contraseña <code>Admin2025!</code>
          </small>
        </Alert>
      )}

      <Table size="sm" striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.usuario}</td>
                <td>
                  {u.nombre} {u.apellido}
                </td>
                <td>
                  {u.email || <span className="text-muted">Sin email</span>}
                </td>
                <td>
                  <span
                    className={`badge ${
                      u.rol === 'administrador' ? 'bg-danger' : 'bg-info'
                    }`}
                  >
                    {u.rol === 'administrador' ? '👑 Admin' : '👤 Usuario'}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      u.activo ? 'bg-success' : 'bg-secondary'
                    }`}
                  >
                    {u.activo ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal para crear usuario */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                value={form.usuario}
                onChange={e => setForm({ ...form, usuario: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                value={form.apellido}
                onChange={e => setForm({ ...form, apellido: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>📧 Email (Opcional)</Form.Label>
              <Form.Control
                type="email"
                placeholder="usuario@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <Form.Text className="text-muted">
                Solo se usa para enviar credenciales por correo. No se guarda en
                la base de datos.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={form.rol}
                onChange={e => setForm({ ...form, rol: e.target.value })}
              >
                <option value="usuario_consulta">Usuario Consulta</option>
                <option value="administrador">Administrador</option>
              </Form.Select>
            </Form.Group>

            <hr />

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="enviarEmailCheck"
                checked={enviarEmail}
                onChange={e => setEnviarEmail(e.target.checked)}
                label={
                  <span>
                    <strong>✉️ Enviar credenciales por email</strong>
                    <br />
                    <small className="text-muted">
                      El usuario recibirá un correo con su usuario, contraseña y
                      un link de acceso directo
                    </small>
                  </span>
                }
              />
            </Form.Group>

            {mensajeEmail && (
              <div
                className={`alert ${
                  mensajeEmail.includes('✓') ? 'alert-success' : 'alert-warning'
                } py-2`}
              >
                <small>{mensajeEmail}</small>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Crear</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para invitar usuario */}
      <InviteUserModal
        show={showInviteModal}
        onHide={() => setShowInviteModal(false)}
        onInvitationSent={() => load()}
      />
    </Card>
  );
}
