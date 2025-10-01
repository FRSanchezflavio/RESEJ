import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { uploadRegistro } from "../../api/api";

export default function UploadForm() {
  const [form, setForm] = useState({ fecha_ingreso: "", numero_legajo: "", detalle_secuestro: "" });
  const [files, setFiles] = useState(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("fecha_ingreso", form.fecha_ingreso);
    fd.append("numero_legajo", form.numero_legajo);
    fd.append("detalle_secuestro", form.detalle_secuestro);
    if (files) {
      for (let i = 0; i < files.length; i++) fd.append("archivos", files[i]);
    }
    try {
      await uploadRegistro(fd);
      setMsg("Registro subido correctamente");
    } catch (err) {
      console.error(err);
      setMsg("Error al subir");
    }
  };

  return (
    <Card className="p-3">
      <h6>Nuevo registro</h6>
      {msg && <div className="mb-2">{msg}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Fecha de ingreso</Form.Label>
          <Form.Control type="date" value={form.fecha_ingreso} onChange={e=>setForm({...form, fecha_ingreso: e.target.value})} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>N° de legajo/causa</Form.Label>
          <Form.Control value={form.numero_legajo} onChange={e=>setForm({...form, numero_legajo: e.target.value})} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Detalle</Form.Label>
          <Form.Control as="textarea" value={form.detalle_secuestro} onChange={e=>setForm({...form, detalle_secuestro: e.target.value})} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Archivos (PDF/JPG/PNG)</Form.Label>
          <Form.Control type="file" multiple onChange={e=>setFiles(e.target.files)} />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="dark" type="submit">GUARDAR</Button>
          <Button variant="outline-secondary" onClick={()=>{ /* volver al inicio si hace falta */ }}>← VOLVER AL INICIO</Button>
        </div>
      </Form>
    </Card>
  );
}
