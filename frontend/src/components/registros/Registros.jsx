import React, { useEffect, useState } from "react";
import { fetchRegistros, fetchArchivosByRegistroId } from "../../api/api";
import { Card, Form, Button, Table, Badge, Pagination } from "react-bootstrap";
import {
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaDownload,
  FaEdit,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [archivos, setArchivos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 20;

  async function load(params = {}) {
    try {
      const res = await fetchRegistros({ ...params, page, limit: LIMIT });
      const items = res.data?.data?.registros ?? res.data?.registros ?? [];
      setRegistros(items);
      const totalPag =
        res.data?.data?.pagination?.totalPages ??
        res.data?.pagination?.totalPages ??
        1;
      setTotalPages(totalPag);
    } catch (err) {
      console.error(err);
      setRegistros([]);
      setTotalPages(1);
    }
  }

  useEffect(() => {
    load({ termino: term });
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load({ termino: term });
  };

  const handleRowClick = async (registro) => {
    if (selected?.id === registro.id) {
      setSelected(null);
      setArchivos([]);
    } else {
      setSelected(registro);
      try {
        const res = await fetchArchivosByRegistroId(registro.id);
        const archivosData = res.data?.data ?? res.data ?? [];
        setArchivos(archivosData);
      } catch (err) {
        console.error("Error al cargar archivos:", err);
        setArchivos([]);
      }
    }
  };

  const downloadFile = async (archivo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/archivos/${archivo.id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Error al descargar archivo");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archivo.nombre_original;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error al descargar archivo");
    }
  };

  const getFileIcon = (archivo) => {
    const mime = archivo.tipo_mime;
    if (mime.includes("pdf"))
      return <FaFilePdf color="#e74c3c" size={20} className="me-2" />;
    if (mime.includes("image"))
      return <FaFileImage color="#3498db" size={20} className="me-2" />;
    return <FaFileAlt color="#95a5a6" size={20} className="me-2" />;
  };

  const handleEditClick = (registro) => {
    setEditingId(registro.id);
    setEditData({ ...registro });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
  try {
    const token = localStorage.getItem("token");

    // 🔹 Solo campos válidos para la tabla
    const validFields = [
      "id",
      "persona_id",
      "fecha_ingreso",
      "fecha_carga",
      "ufi",
      "numero_legajo",
      "seccion_que_interviene",
      "detalle_secuestro",
      "numero_protocolo",
      "cadena_custodia",
      "nro_folio",
      "nro_libro_secuestro",
      "of_a_cargo",
      "observaciones",
      "usuario_carga",
      "estado_causa",
      "created_at",
      "updated_at",
      "foto",
    ];

    // 🔹 Crear payload filtrando solo campos válidos
    const payload = {};
    validFields.forEach((key) => {
      if (editData[key] !== undefined) payload[key] = editData[key] ?? null;
    });

    // 🔹 Formatear fecha
    if (payload.fecha_ingreso) {
      const date = new Date(payload.fecha_ingreso);
      if (!isNaN(date)) payload.fecha_ingreso = date.toISOString().slice(0, 10);
    }

    // 🔹 Enviar PUT
    const res = await fetch(`http://localhost:3000/api/registros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Error al guardar cambios");
    }

    const updated = await res.json();
    const updatedRegistro = updated.data;

    // 🔹 Actualizar fecha localmente
    const now = new Date().toISOString();
    setRegistros((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedRegistro, updated_at: now } : r))
    );

    setEditingId(null);
    setEditData({});
  } catch (err) {
    console.error(err);
    alert("Error al guardar cambios: " + err.message);
  }
};


  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
          {i}
        </Pagination.Item>
      );
    }
    return <Pagination className="mt-3">{items}</Pagination>;
  };

  return (
    <Card className="p-3">
      <h5 className="mb-3">Buscar registro</h5>
      <Form onSubmit={handleSearch} className="d-flex gap-2 mb-3">
        <Form.Control
          placeholder="Ingrese término de búsqueda"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <Button type="submit" variant="dark">
          BUSCAR
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => {
            setTerm("");
            setPage(1);
            load({});
          }}
        >
          MOSTRAR TODAS
        </Button>
      </Form>

      {registros.length === 0 ? (
        <p>No hay registros</p>
      ) : (
        <>
          <Table striped bordered hover size="sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha ingreso</th>
                <th>UFI</th>
                <th>N° Legajo</th>
                <th>Detalle</th>
                <th>Estado actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
  {registros.map((r) => (
    <React.Fragment key={r.id}>
      <tr
        className={selected?.id === r.id ? "table-primary" : ""}
      >
        <td>{r.id}</td>

        <td>
          {editingId === r.id ? (
            <Form.Control
              type="date"
              value={editData.fecha_ingreso ? editData.fecha_ingreso.split("T")[0] : ""}
              onChange={(e) => handleChange("fecha_ingreso", e.target.value)}
            />
          ) : r.fecha_ingreso ? (
            new Date(r.fecha_ingreso).toLocaleDateString()
          ) : (
            "-"
          )}
        </td>

        <td>
          {editingId === r.id ? (
            <Form.Control
              value={editData.ufi || ""}
              onChange={(e) => handleChange("ufi", e.target.value)}
            />
          ) : (
            r.ufi || "-"
          )}
        </td>

        <td>
          {editingId === r.id ? (
            <Form.Control
              value={editData.numero_legajo || ""}
              onChange={(e) => handleChange("numero_legajo", e.target.value)}
            />
          ) : (
            r.numero_legajo || "-"
          )}
        </td>

        <td>
          {editingId === r.id ? (
            <Form.Control
              value={editData.detalle_secuestro || ""}
              onChange={(e) => handleChange("detalle_secuestro", e.target.value)}
            />
          ) : (
            r.detalle_secuestro || "-"
          )}
        </td>

        <td>
          {editingId === r.id ? (
            <Form.Select
              size="sm"
              value={editData.observaciones || ""}
              onChange={(e) => handleChange("observaciones", e.target.value)}
            >
              <option value="">Seleccionar estado</option>
              <option value="En depósito">En depósito</option>
              <option value="Devuelto">Devuelto</option>
              <option value="Destruido">Destruido</option>
              <option value="Peritado">Peritado</option>
              <option value="Remitido a UFI">Remitido a UFI</option>
            </Form.Select>
          ) : (
            r.observaciones || "-"
          )}
        </td>

        <td>
          {editingId === r.id ? (
            <>
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave(r.id);
                }}
              >
                <FaCheck />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
              >
                <FaTimes />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(r);
                }}
              >
                <FaEdit /> Editar
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(r); // 🔹 solo se ejecuta al clickear la flecha
                }}
              >
                {selected?.id === r.id ? <FaChevronUp /> : <FaChevronDown />}
              </Button>
            </>
          )}
        </td>
      </tr>

      {selected?.id === r.id && (
        <tr>
          <td colSpan="7">
            <div className="p-3 bg-light rounded border d-flex gap-3">
              <div style={{ flex: 1 }}>
                <h6 className="mb-3 text-secondary">
                  📄 Detalle del registro #{r.id}
                </h6>
                <p>
                  <strong>Sección que interviene:</strong> {r.seccion_que_interviene || "-"}
                </p>
                <p>
                  <strong>N° Protocolo:</strong> {r.numero_protocolo || "-"}
                </p>
                <p>
                  <strong>Cadena de custodia:</strong> {r.cadena_custodia || "-"}
                </p>
                <p>
                  <strong>Oficial a cargo:</strong> {r.of_a_cargo || "-"}
                </p>
                <p>
                  <strong>Estado actual del secuestro:</strong> {r.observaciones || "-"}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {r.updated_at ? new Date(r.updated_at).toLocaleString() : "-"}
                </p>
              </div>

              <div style={{ width: "300px" }}>
                <h6 className="mb-2">📎 Archivos</h6>
                {archivos.length === 0 ? (
                  <p className="text-muted">Sin archivos adjuntos</p>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {archivos.map((a) => (
                      <div
                        key={a.id}
                        className="d-flex justify-content-between align-items-center p-2 border rounded shadow-sm"
                        style={{ background: "#fdfdfd", cursor: "pointer" }}
                        onClick={() => downloadFile(a)}
                      >
                        <div className="d-flex align-items-center">
                          {getFileIcon(a)}
                          <span style={{ wordBreak: "break-word" }}>{a.nombre_original}</span>
                        </div>
                        <Badge bg="secondary">
                          <FaDownload />
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

          </Table>

          {renderPagination()}
        </>
      )}
    </Card>
  );
}
