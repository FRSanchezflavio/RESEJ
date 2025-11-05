import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { uploadRegistro } from '../../api/api';

export default function UploadForm() {
  const [form, setForm] = useState({
    fecha_carga: '',
    fecha_ingreso: '',
    ufi: '',
    numero_legajo: '',
    seccion_que_interviene: '',
    detalle_secuestro: '',
    numero_protocolo: '',
    cadena_custodia: '',
    nro_folio: '',
    nro_libro_secuestro: '',
    of_a_cargo: '',
    observaciones: '',
  });
  const [files, setFiles] = useState(null);
  const [msg, setMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();

    // 🔹 Convertir fechas a formato ISO (yyyy-mm-dd)
    const fechaIngresoISO = form.fecha_ingreso
      ? new Date(form.fecha_ingreso).toISOString().split('T')[0]
      : '';
    const fechaCargaISO = form.fecha_carga
      ? new Date(form.fecha_carga).toISOString().split('T')[0]
      : '';

    // 🔹 Agregar todos los campos
    Object.entries({
      ...form,
      fecha_ingreso: fechaIngresoISO,
      fecha_carga: fechaCargaISO,
      persona_id: 1, // temporal
    }).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });

    // 🔹 Archivos
    if (files) {
      for (let i = 0; i < files.length; i++) {
        fd.append('archivos', files[i]);
      }
    }

    // 👀 Verificar qué se está enviando
    for (let [k, v] of fd.entries()) {
      console.log(`${k}:`, v);
    }

    try {
      await uploadRegistro(fd);
      setMsg('✅ Registro cargado correctamente');

      // 🔹 Resetear formulario
      setForm({
        fecha_carga: '',
        fecha_ingreso: '',
        ufi: '',
        numero_legajo: '',
        seccion_que_interviene: '',
        detalle_secuestro: '',
        numero_protocolo: '',
        cadena_custodia: '',
        nro_folio: '',
        nro_libro_secuestro: '',
        of_a_cargo: '',
        observaciones: '',
      });
      setFiles(null);
    } catch (err) {
      console.error('Error detallado:', err.response?.data || err.message);
      setMsg(
        '❌ Error al subir: ' + (err.response?.data?.error || err.message)
      );
    }
  };

  const handleChange = e => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === 'date' && value) {
      if (value.includes('/')) {
        const [dia, mes, anio] = value.split('/');
        newValue = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }

    setForm({ ...form, [name]: newValue });
  };

  return (
    <Card className="p-3">
      <h5>Nuevo Registro de Secuestro Judicial</h5>
      {msg && <div className="mb-3 text-danger">{msg}</div>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Fecha de ingreso</Form.Label>
              <Form.Control
                type="date"
                name="fecha_ingreso"
                value={form.fecha_ingreso}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>U.F.I</Form.Label>
          <Form.Control
            name="ufi"
            value={form.ufi}
            onChange={handleChange}
            placeholder="Ej: UFI"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>N° Legajo / Causa</Form.Label>
          <Form.Control
            name="numero_legajo"
            value={form.numero_legajo}
            onChange={handleChange}
            placeholder="Ej: Causa 1234/25"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Sección que interviene</Form.Label>
          <Form.Select
            name="seccion_que_interviene"
            value={form.seccion_que_interviene}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione...</option>
            <option value="Criminalística">Criminalística</option>
            <option value="Robos y Hurtos">Robos y Hurtos</option>
            <option value="Narcotráfico">Narcotráfico</option>
            <option value="Delitos Complejos">Delitos Complejos</option>
            <option value="Otros">Otros</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Detalle del secuestro</Form.Label>
          <Form.Control
            as="textarea"
            name="detalle_secuestro"
            rows={3}
            value={form.detalle_secuestro}
            onChange={handleChange}
            placeholder="Describa el secuestro..."
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>N° de protocolo</Form.Label>
              <Form.Control
                name="numero_protocolo"
                value={form.numero_protocolo}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Cadena de custodia</Form.Label>
              <Form.Control
                name="cadena_custodia"
                value={form.cadena_custodia}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>N° de folio</Form.Label>
              <Form.Control
                name="nro_folio"
                value={form.nro_folio}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>N° de libro de secuestro</Form.Label>
              <Form.Control
                name="nro_libro_secuestro"
                value={form.nro_libro_secuestro}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>Of. a cargo de la causa</Form.Label>
          <Form.Control
            name="of_a_cargo"
            value={form.of_a_cargo}
            onChange={handleChange}
            placeholder="Nombre del oficial"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Observaciones</Form.Label>
          <Form.Control
            as="textarea"
            name="observaciones"
            rows={2}
            value={form.observaciones}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Archivos adjuntos (PDF, JPG, PNG)</Form.Label>
          <Form.Control
            type="file"
            multiple
            onChange={e => setFiles(e.target.files)}
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="dark" type="submit">
            GUARDAR
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => window.location.reload()}
          >
            ← VOLVER
          </Button>
        </div>
      </Form>
    </Card>
  );
}
