import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import { fetchUsers, createUser } from '../../api/api';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    usuario: '',
    nombre: '',
    apellido: '',
    password: '',
    rol: 'usuario_consulta',
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetchUsers();
      console.log('Respuesta de usuarios:', res.data);

      // La API devuelve { success: true, data: { usuarios: [...], pagination: {...} } }
      let usuarios = res?.data?.data?.usuarios || res?.data?.usuarios || [];
      if (!Array.isArray(usuarios)) usuarios = [];

      console.log('Usuarios cargados:', usuarios);
      setUsers(usuarios);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setUsers([]); // fallback
    }
  }

  const handleCreate = async () => {
    // Validación básica del lado del cliente
    if (!form.usuario || !form.nombre || !form.apellido || !form.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Validar contraseña
    if (form.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (!/[A-Z]/.test(form.password)) {
      alert('La contraseña debe contener al menos una mayúscula');
      return;
    }
    if (!/[a-z]/.test(form.password)) {
      alert('La contraseña debe contener al menos una minúscula');
      return;
    }
    if (!/\d/.test(form.password)) {
      alert('La contraseña debe contener al menos un número');
      return;
    }

    try {
      const response = await createUser(form);
      console.log('Usuario creado:', response.data);
      setShow(false);
      setForm({
        usuario: '',
        nombre: '',
        apellido: '',
        password: '',
        rol: 'usuario_consulta',
      });
      load();
      alert('Usuario creado exitosamente');
    } catch (err) {
      console.error('Error completo:', err);
      const errorMsg =
        err.response?.data?.detalles?.[0]?.msg ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;
      alert(`Error: ${errorMsg}`);
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
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
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
                <td>{u.rol}</td>
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
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <small className="text-muted d-block mt-1">
                Requisitos: mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1
                número
              </small>
              {form.password && (
                <div className="mt-2 small">
                  <div
                    className={
                      form.password.length >= 8 ? 'text-success' : 'text-danger'
                    }
                  >
                    ✓ Mínimo 8 caracteres{' '}
                    {form.password.length >= 8 ? '✓' : '✗'}
                  </div>
                  <div
                    className={
                      /[A-Z]/.test(form.password)
                        ? 'text-success'
                        : 'text-danger'
                    }
                  >
                    ✓ Mayúscula {/[A-Z]/.test(form.password) ? '✓' : '✗'}
                  </div>
                  <div
                    className={
                      /[a-z]/.test(form.password)
                        ? 'text-success'
                        : 'text-danger'
                    }
                  >
                    ✓ Minúscula {/[a-z]/.test(form.password) ? '✓' : '✗'}
                  </div>
                  <div
                    className={
                      /\d/.test(form.password) ? 'text-success' : 'text-danger'
                    }
                  >
                    ✓ Número {/\d/.test(form.password) ? '✓' : '✗'}
                  </div>
                </div>
              )}
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
