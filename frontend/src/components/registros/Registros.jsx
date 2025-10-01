import React, { useEffect, useState } from "react";
import { fetchRegistros } from "../../api/api";
import { Card, Form, Button, Table } from "react-bootstrap";

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [term, setTerm] = useState("");

  async function load(params = {}) {
    try {
      const res = await fetchRegistros(params);
      // backend devuelve: { success: true, data: { pagination:..., registros: [...] } }
      const items = res.data?.data?.registros ?? res.data?.registros ?? [];
      setRegistros(items);
    } catch (err) {
      console.error(err);
      setRegistros([]);
    }
  }

  useEffect(() => { load({}); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load({ q: term });
  };

  return (
    <Card className="p-3">
      <h5>Buscar registro</h5>
      <Form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
        <Form.Control placeholder="Ingrese término de búsqueda" value={term} onChange={(e)=>setTerm(e.target.value)} />
        <Button type="submit" variant="dark">BUSCAR</Button>
        <Button variant="outline-secondary" onClick={()=>{ setTerm(""); load({}); }}>MOSTRAR TODAS</Button>
      </Form>

      {registros.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th><th>Numero Causa</th><th>Año</th><th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.numero_causa}</td>
                <td>{r.fecha_delito ? new Date(r.fecha_delito).getFullYear() : ''}</td>
                <td>{r.detalle_secuestro || r.descripcion || '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
