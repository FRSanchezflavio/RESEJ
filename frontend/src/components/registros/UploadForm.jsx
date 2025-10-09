import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { uploadRegistro } from "../../api/api";

const initialRegistroState = {
  persona_id: '',
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
};

export default function UploadForm() {
  const [form, setForm] = useState(initialRegistroState);
  const [files, setFiles] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('danger');
  const [submitting, setSubmitting] = useState(false);

  const resetRegistroForm = () => {
    setForm(initialRegistroState);
    setFiles(null);
  };

  const handleRegistroChange = e => {
    const { name, value, type } = e.target;

    let newValue = value;
    if (type === 'date' && value) {
      if (value.includes('/')) {
        const [dia, mes, anio] = value.split('/');
        newValue = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
      }
    }

    setForm(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.persona_id || isNaN(Number(form.persona_id))) {
      setMsgType('danger');
      setMsg('Debes ingresar un ID de persona válido (número).');
      return;
    }

    const fd = new FormData();
    const fechaIngresoISO = form.fecha_ingreso
      ? new Date(form.fecha_ingreso).toISOString().split('T')[0]
      : '';
    const fechaCargaISO = form.fecha_carga
      ? new Date(form.fecha_carga).toISOString().split('T')[0]
      : '';

    Object.entries({
      ...form,
      fecha_ingreso: fechaIngresoISO,
      fecha_carga: fechaCargaISO,
      persona_id: Number(form.persona_id),
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        fd.append(key, value);
      }
    });

    if (files) {
      Array.from(files).forEach(file => fd.append('archivos', file));
    }

    setSubmitting(true);
    setMsg('');

    try {
      await uploadRegistro(fd);
      setMsgType('success');
      setMsg('✅ Registro cargado correctamente.');
      resetRegistroForm();
    } catch (error) {
      console.error('Error al subir registro', error);
      const errorMsg =
        error?.response?.data?.error || error?.message || 'Error inesperado';
      setMsgType('danger');
      setMsg(`❌ Error al subir: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-3">
      <h5>Nuevo Registro de Secuestro Judicial</h5>

      {msg && (
        <Alert
          className="mb-3"
          variant={msgType === 'success' ? 'success' : 'danger'}
        >
          {msg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>ID de Persona *</Form.Label>
          <Form.Control
            type="number"
            name="persona_id"
            value={form.persona_id}
            onChange={handleRegistroChange}
            placeholder="Ingrese el ID de la persona asociada"
            required
            min="1"
          />
          <Form.Text className="text-muted">
            Debe existir una persona registrada con este ID en el sistema.
          </Form.Text>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Fecha de ingreso *</Form.Label>
              <Form.Control
                type="date"
                name="fecha_ingreso"
                value={form.fecha_ingreso}
                onChange={handleRegistroChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Fecha de carga</Form.Label>
              <Form.Control
                type="date"
                name="fecha_carga"
                value={form.fecha_carga}
                onChange={handleRegistroChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>U.F.I</Form.Label>
          <Form.Control
            name="ufi"
            value={form.ufi}
            onChange={handleRegistroChange}
            placeholder="Ej: UFI"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>N° Legajo / Causa</Form.Label>
          <Form.Control
            name="numero_legajo"
            value={form.numero_legajo}
            onChange={handleRegistroChange}
            placeholder="Ej: Causa 1234/25"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Sección que interviene *</Form.Label>
          <Form.Select
            name="seccion_que_interviene"
            value={form.seccion_que_interviene}
            onChange={handleRegistroChange}
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
          <Form.Label>Detalle del secuestro *</Form.Label>
          <Form.Control
            as="textarea"
            name="detalle_secuestro"
            rows={3}
            value={form.detalle_secuestro}
            onChange={handleRegistroChange}
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
                onChange={handleRegistroChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Cadena de custodia</Form.Label>
              <Form.Control
                name="cadena_custodia"
                value={form.cadena_custodia}
                onChange={handleRegistroChange}
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
                onChange={handleRegistroChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>N° de libro de secuestro</Form.Label>
              <Form.Control
                name="nro_libro_secuestro"
                value={form.nro_libro_secuestro}
                onChange={handleRegistroChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-2">
          <Form.Label>Of. a cargo de la causa</Form.Label>
          <Form.Control
            name="of_a_cargo"
            value={form.of_a_cargo}
            onChange={handleRegistroChange}
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
            onChange={handleRegistroChange}
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
          <Button variant="dark" type="submit" disabled={submitting}>
            {submitting ? <Spinner animation="border" size="sm" /> : 'GUARDAR'}
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => {
              resetRegistroForm();
              setMsg('');
            }}
          >
            Limpiar
          </Button>
        </div>
      </Form>
    </Card>
  );
}
