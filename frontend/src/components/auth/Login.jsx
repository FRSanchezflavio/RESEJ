import React, { useContext, useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { loginRequest } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await loginRequest(usuario, password);
      const token = res.data?.data?.accessToken || res.data?.accessToken || res.data?.data?.accessToken;
      if (!token) throw new Error("No token");
      login(token);
    } catch (error) {
      setErr("Credenciales inválidas o error de servidor");
      console.error(error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card style={{ width: 420, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
        <h4 className="mb-3">Iniciar Sesión</h4>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de usuario</Form.Label>
            <Form.Control value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center">
            <Button type="submit" variant="dark">INICIAR SESIÓN</Button>
            <small className="text-muted">© 2025 - Policía de Tucumán</small>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
