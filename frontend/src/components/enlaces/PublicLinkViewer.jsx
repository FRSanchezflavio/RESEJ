import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { accessSharedLinkPublic } from "../../api/api";

const formatDate = value =>
  value ? new Date(value).toLocaleString() : "-";

const statusFor = enlace => {
  if (!enlace) return { variant: "secondary", label: "Desconocido" };
  if (enlace.revocado) return { variant: "secondary", label: "Revocado" };
  if (enlace.fecha_expiracion) {
    const expired = new Date(enlace.fecha_expiracion) <= new Date();
    if (expired) return { variant: "danger", label: "Expirado" };
  }
  if (enlace.max_accesos && enlace.accesos >= enlace.max_accesos) {
    return { variant: "warning", label: "Límite alcanzado" };
  }
  return { variant: "success", label: "Vigente" };
};

export default function PublicLinkViewer() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [enlace, setEnlace] = useState(null);
  const [error, setError] = useState(null);
  const [necesitaContrasena, setNecesitaContrasena] = useState(false);
  const [contrasena, setContrasena] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestAccess = useCallback(
    async (password = "") => {
      setLoading(true);
      setError(null);
      setNecesitaContrasena(false);
      try {
        const response = await accessSharedLinkPublic(
          token,
          password ? { contrasena: password } : {}
        );
        const data = response.data?.data ?? {};
        setEnlace(data);
      } catch (err) {
        const payload = err?.response?.data ?? {};
        const status = err?.response?.status;
        const passwordRequired =
          payload.necesitaContrasena || status === 401;

        if (passwordRequired) {
          setNecesitaContrasena(true);
          if (payload.error) {
            setError(payload.error);
          }
        } else {
          setError(payload.error || "No se pudo acceder al enlace");
        }
        setEnlace(null);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    requestAccess();
  }, [requestAccess]);

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await requestAccess(contrasena);
      setContrasena("");
    } finally {
      setSubmitting(false);
    }
  };

  const status = useMemo(() => statusFor(enlace), [enlace]);
  const publicData = enlace;

  return (
    <Container className="py-4" style={{ maxWidth: 700 }}>
      <Card className="p-4 shadow-sm">
        <h4 className="mb-3">Acceso compartido</h4>
        <p className="text-muted">
          Revise la información suministrada a través de un enlace seguro.
        </p>

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : publicData ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <strong>Token:</strong>
                <div className="text-monospace">{publicData.token}</div>
              </div>
              <Badge bg={status.variant}>{status.label}</Badge>
            </div>
            <div className="mb-3">
              <strong>Descripción:</strong>
              <div>{publicData.descripcion || "Sin descripción"}</div>
            </div>
            <div className="mb-3">
              <strong>Registro asociado:</strong>
              <div>{publicData.registro_id ?? "-"}</div>
            </div>
            <div className="d-flex flex-column gap-2 mb-3">
              <div>
                <strong>Fecha de creación:</strong> {formatDate(publicData.fecha_creacion)}
              </div>
              <div>
                <strong>Fecha de expiración:</strong> {formatDate(publicData.fecha_expiracion)}
              </div>
              <div>
                <strong>Accesos:</strong> {publicData.accesos || 0}
                {publicData.max_accesos ? ` / ${publicData.max_accesos}` : ""}
              </div>
            </div>
            <Alert variant="info" className="mb-0">
              Si el enlace da acceso a documentación adicional, comuníquese con la persona que lo compartió para recibir instrucciones.
            </Alert>
          </>
        ) : necesitaContrasena ? (
          <>
            <Alert variant={error ? "danger" : "warning"}>
              Este enlace requiere una contraseña proporcionada por el emisor.
              {error ? <div className="mt-2 mb-0">{error}</div> : null}
            </Alert>
            <Form onSubmit={handleSubmit} className="d-flex gap-2">
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                minLength={8}
                maxLength={128}
                onChange={event => setContrasena(event.target.value)}
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner animation="border" size="sm" /> : "Validar"}
              </Button>
            </Form>
          </>
        ) : (
          <Alert variant="secondary">No hay información asociada a este enlace.</Alert>
        )}
      </Card>
    </Container>
  );
}
