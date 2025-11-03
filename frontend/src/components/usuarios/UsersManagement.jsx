import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { fetchUsers, createUser, fetchRoles } from '../../api/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: 2, // Por defecto: usuario_consulta
  });
  const [enviarEmail, setEnviarEmail] = useState(true);
  const [mensajeEmail, setMensajeEmail] = useState('');

  useEffect(() => {
    load();
    loadRoles();
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

  async function loadRoles() {
    try {
      const res = await fetchRoles();
      let data = res?.data?.data || res?.data || [];
      if (!Array.isArray(data)) data = [];
      setRoles(data);
    } catch (err) {
      console.error('Error cargando roles:', err);
      setRoles([]);
    }
  }

  const handleCreate = async () => {
    try {
      // Validar que el email esté presente si se quiere enviar
      if (enviarEmail && !form.email) {
        alert('Por favor ingresa un email para enviar las credenciales');
        return;
      }

      const datosUsuario = {
        ...form,
        enviarEmail: enviarEmail && form.email ? true : false,
      };

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
        rol_id: 2,
      });
      setEnviarEmail(true);
      setMensajeEmail('');
      load();
    } catch (err) {
      console.error('Error creando usuario:', err);
      alert(
        `Error al crear usuario: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <Card className="p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6>👥 Gestión de Usuarios</h6>
        <Button size="sm" onClick={() => setShow(true)}>
          Crear Nuevo Usuario
        </Button>
      </div>

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
              <Form.Label>📧 Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="usuario@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <Form.Text className="text-muted">
                Necesario para enviar las credenciales por correo
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
                value={form.rol_id}
                onChange={e =>
                  setForm({ ...form, rol_id: parseInt(e.target.value) })
                }
              >
                {roles.length > 0 ? (
                  roles.map(rol => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre === 'administrador'
                        ? '👑 Administrador'
                        : '👤 Usuario Consulta'}{' '}
                      - {rol.descripcion}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="2">
                      👤 Usuario Consulta - Solo puede consultar
                    </option>
                    <option value="1">
                      👑 Administrador - Acceso completo
                    </option>
                  </>
                )}
              </Form.Select>
              {roles.length > 0 && form.rol_id && (
                <Form.Text className="text-muted">
                  {(() => {
                    const selectedRole = roles.find(r => r.id === form.rol_id);
                    if (!selectedRole) return null;
                    return (
                      <div className="mt-2">
                        <strong>Permisos:</strong>
                        <div className="ms-2">
                          {selectedRole.puede_consultar && (
                            <Badge bg="info" className="me-1">
                              Consultar
                            </Badge>
                          )}
                          {selectedRole.puede_crear && (
                            <Badge bg="success" className="me-1">
                              Crear
                            </Badge>
                          )}
                          {selectedRole.puede_editar && (
                            <Badge bg="warning" className="me-1">
                              Editar
                            </Badge>
                          )}
                          {selectedRole.puede_eliminar && (
                            <Badge bg="danger" className="me-1">
                              Eliminar
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </Form.Text>
              )}
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
    </Card>
  );
}
