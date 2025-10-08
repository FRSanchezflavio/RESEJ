import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import { fetchUsers, createUser } from "../../api/api";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    usuario: "",
    nombre: "",
    apellido: "",
    password: "",
    rol: "usuario_consulta",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetchUsers();
      // asegura que users sea siempre array
      let data = res?.data?.data || res?.data || [];
      if (!Array.isArray(data)) data = [];
      setUsers(data);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setUsers([]); // fallback
    }
  }

  const handleCreate = async () => {
    try {
      await createUser(form);
      setShow(false);
      setForm({
        usuario: "",
        nombre: "",
        apellido: "",
        password: "",
        rol: "usuario_consulta",
      });
      load();
    } catch (err) {
      console.error("Error creando usuario:", err);
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
            users.map((u) => (
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
                onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
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
