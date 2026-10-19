import { useState, useEffect, useMemo, useRef } from "react";
import api from "../services/api";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "20px",
    gap: "8px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  formAlta: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr)) 140px",
    gap: "12px",
    alignItems: "end",
  },
  fieldGroup: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: "0.75rem",
    color: "#64748b",
    marginBottom: "4px",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
  th: {
    textAlign: "left",
    padding: "12px 10px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
    userSelect: "none",
  },
  td: {
    padding: "10px 10px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle",
    textAlign: "left",
    wordBreak: "break-word",
  },
  inputControl: {
    height: "38px",
    padding: "0 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    color: "#334155",
  },
  btnPrimary: {
    height: "34px",
    padding: "0 12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSuccess: {
    height: "34px",
    padding: "0 12px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    height: "34px",
    padding: "0 12px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDanger: {
    height: "34px",
    padding: "0 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  toastContainer: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  toast: (tipo) => ({
    padding: "12px 18px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
    backgroundColor: tipo === "error" ? "#dc2626" : "#10b981",
  }),
  calendarHeaderNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  calendarTable: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  calendarTh: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "10px",
    textAlign: "center",
    color: "#475569",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  calendarCell: {
    border: "1px solid #e2e8f0",
    height: "110px",
    verticalAlign: "top",
    padding: "6px",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  calendarCellToday: {
    border: "2px solid #2563eb",
    height: "110px",
    verticalAlign: "top",
    padding: "6px",
    backgroundColor: "#eff6ff",
    position: "relative",
  },
  calendarCellOutside: {
    border: "1px solid #e2e8f0",
    height: "110px",
    verticalAlign: "top",
    padding: "6px",
    backgroundColor: "#f8fafc",
    opacity: 0.5,
  },
  dayNumber: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#334155",
    marginBottom: "4px",
    display: "block",
  },
  turnoBadge: {
    backgroundColor: "#dbeafe",
    border: "1px solid #bfdbfe",
    borderRadius: "4px",
    padding: "3px 6px",
    fontSize: "0.75rem",
    marginBottom: "3px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    cursor: "pointer",
    color: "#1e40af",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: "1.25rem",
    color: "#1e293b",
    marginBottom: "8px",
    marginTop: 0,
    fontWeight: "bold",
  },
  modalText: { fontSize: "0.95rem", color: "#64748b", marginBottom: "20px" },
  modalActions: { display: "flex", justifyContent: "center", gap: "10px" },
};

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);

  const [vista, setVista] = useState("tabla");
  const [fechaCalendario, setFechaCalendario] = useState(new Date());
  const [turnoAEliminar, setTurnoAEliminar] = useState(null);

  // Formulario de alta
  const [nuevoFecha, setNuevoFecha] = useState("");
  const [nuevoHora, setNuevoHora] = useState("");
  const [nuevoClienteId, setNuevoClienteId] = useState("");
  const [nuevoCampoId, setNuevoCampoId] = useState("");
  const [nuevoObservacion, setNuevoObservacion] = useState("");

  // Edición
  const [editId, setEditId] = useState(null);
  const [editFecha, setEditFecha] = useState("");
  const [editHora, setEditHora] = useState("");
  const [editClienteId, setEditClienteId] = useState("");
  const [editCampoId, setEditCampoId] = useState("");
  const [editObservacion, setEditObservacion] = useState("");

  const [toasts, setToasts] = useState([]);
  const toastIdCounter = useRef(0);

  const mostrarToast = (mensaje, tipo = "success") => {
    toastIdCounter.current += 1;
    const id = toastIdCounter.current;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resT, resC, resCp] = await Promise.all([
          api.get("/turnos").catch(() => ({ data: [] })),
          api.get("/clientes").catch(() => ({ data: [] })),
          api.get("/campos").catch(() => ({ data: [] })),
        ]);
        setTurnos(resT.data);
        setClientes(resC.data);
        setCampos(resCp.data);
      } catch {
        // Error silenciado
      }
    };

    cargarDatos();
  }, []);

  const construirFechaHora = (fecha, hora) =>
    hora ? `${fecha} ${hora}:00` : `${fecha} 00:00:00`;

  const camposFiltradosAlta = useMemo(() => {
    if (!nuevoClienteId) return campos;
    return campos.filter(
      (c) => Number(c.cliente_id) === Number(nuevoClienteId),
    );
  }, [campos, nuevoClienteId]);

  const camposFiltradosEdit = useMemo(() => {
    if (!editClienteId) return campos;
    return campos.filter((c) => Number(c.cliente_id) === Number(editClienteId));
  }, [campos, editClienteId]);

  const handleCrearTurno = async (e) => {
    e.preventDefault();
    if (!nuevoFecha || !nuevoClienteId || !nuevoCampoId) {
      mostrarToast("Completa los campos obligatorios.", "error");
      return;
    }

    try {
      await api.post("/turnos", {
        cliente_id: Number(nuevoClienteId),
        campo_id: Number(nuevoCampoId),
        fecha_hora: construirFechaHora(nuevoFecha, nuevoHora),
        observacion: nuevoObservacion || null,
      });
      setNuevoFecha("");
      setNuevoHora("");
      setNuevoClienteId("");
      setNuevoCampoId("");
      setNuevoObservacion("");

      const [resT, resC, resCp] = await Promise.all([
        api.get("/turnos").catch(() => ({ data: [] })),
        api.get("/clientes").catch(() => ({ data: [] })),
        api.get("/campos").catch(() => ({ data: [] })),
      ]);
      setTurnos(resT.data);
      setClientes(resC.data);
      setCampos(resCp.data);

      mostrarToast("Turno agendado correctamente.");
    } catch {
      mostrarToast("No se pudo registrar el turno.", "error");
    }
  };

  const ejecutarEliminarTurno = async () => {
    if (!turnoAEliminar) return;
    try {
      await api.delete(`/turnos/${turnoAEliminar}`);

      const [resT, resC, resCp] = await Promise.all([
        api.get("/turnos").catch(() => ({ data: [] })),
        api.get("/clientes").catch(() => ({ data: [] })),
        api.get("/campos").catch(() => ({ data: [] })),
      ]);
      setTurnos(resT.data);
      setClientes(resC.data);
      setCampos(resCp.data);

      mostrarToast("Turno eliminado.");
    } catch {
      mostrarToast("Error al eliminar.", "error");
    } finally {
      setTurnoAEliminar(null);
    }
  };

  const iniciarEdicion = (item) => {
    setEditId(item.id);
    if (item.fecha_hora) {
      const normalizado = item.fecha_hora.replace("T", " ");
      const [f, h] = normalizado.split(" ");
      setEditFecha(f || "");
      setEditHora(h ? h.slice(0, 5) : "");
    }
    setEditClienteId(item.cliente_id?.toString() || "");
    setEditCampoId(item.campo_id?.toString() || "");
    setEditObservacion(item.observacion || "");
  };

  const handleGuardarEdicion = async (id) => {
    try {
      await api.put(`/turnos/${id}`, {
        cliente_id: Number(editClienteId),
        campo_id: Number(editCampoId),
        fecha_hora: construirFechaHora(editFecha, editHora),
        observacion: editObservacion || null,
      });
      setEditId(null);

      const [resT, resC, resCp] = await Promise.all([
        api.get("/turnos").catch(() => ({ data: [] })),
        api.get("/clientes").catch(() => ({ data: [] })),
        api.get("/campos").catch(() => ({ data: [] })),
      ]);
      setTurnos(resT.data);
      setClientes(resC.data);
      setCampos(resCp.data);

      mostrarToast("Turno actualizado.");
    } catch {
      mostrarToast("Error al actualizar.", "error");
    }
  };

  const turnosFiltradosYOrdenados = useMemo(() => {
    const ahora = new Date();
    const hoyIsoStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}-${String(ahora.getDate()).padStart(2, "0")}`;

    return turnos
      .filter((t) => {
        if (!t.fecha_hora) return true;
        const fechaSolo = t.fecha_hora.replace("T", " ").split(" ")[0];
        return fechaSolo >= hoyIsoStr;
      })
      .sort((a, b) => {
        const normA = (a.fecha_hora || "").replace("T", " ");
        const normB = (b.fecha_hora || "").replace("T", " ");
        return normA.localeCompare(normB);
      });
  }, [turnos]);

  const cambiarMes = (delta) => {
    setFechaCalendario(
      new Date(
        fechaCalendario.getFullYear(),
        fechaCalendario.getMonth() + delta,
        1,
      ),
    );
  };

  const nombreMesAnio = useMemo(() => {
    return fechaCalendario.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  }, [fechaCalendario]);

  const matrizDiasMes = useMemo(() => {
    const year = fechaCalendario.getFullYear();
    const month = fechaCalendario.getMonth();
    const primerDiaDelMes = new Date(year, month, 1);
    const ultimoDiaDelMes = new Date(year, month + 1, 0);

    let diaSemanaInicio = primerDiaDelMes.getDay();
    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

    const diasEnMes = ultimoDiaDelMes.getDate();
    const celdas = [];

    const ultimoDiaMesAnterior = new Date(year, month, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      celdas.push({
        fechaObj: new Date(year, month - 1, ultimoDiaMesAnterior - i),
        esMesActual: false,
      });
    }

    for (let i = 1; i <= diasEnMes; i++) {
      celdas.push({ fechaObj: new Date(year, month, i), esMesActual: true });
    }

    const totalCeldasRestantes = (7 - (celdas.length % 7)) % 7;
    for (let i = 1; i <= totalCeldasRestantes; i++) {
      celdas.push({
        fechaObj: new Date(year, month + 1, i),
        esMesActual: false,
      });
    }

    return celdas;
  }, [fechaCalendario]);

  const ahoraIso = new Date();
  const hoyIso = `${ahoraIso.getFullYear()}-${String(ahoraIso.getMonth() + 1).padStart(2, "0")}-${String(ahoraIso.getDate()).padStart(2, "0")}`;

  return (
    <div style={styles.container}>
      <div style={styles.toastContainer}>
        {toasts.map((t) => (
          <div key={t.id} style={styles.toast(t.tipo)}>
            {t.mensaje}
          </div>
        ))}
      </div>

      <div style={styles.headerContainer}>
        <button
          style={vista === "tabla" ? styles.btnPrimary : styles.btnSecondary}
          onClick={() => setVista("tabla")}
        >
          Vista Tabla
        </button>
        <button
          style={
            vista === "almanaque" ? styles.btnPrimary : styles.btnSecondary
          }
          onClick={() => setVista("almanaque")}
        >
          Vista Almanaque
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={{ margin: "0 0 12px 0", color: "#334155" }}>
          Agendar Nuevo Turno
        </h3>
        <form onSubmit={handleCrearTurno} style={styles.formAlta}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Fecha *</label>
            <input
              type="date"
              required
              value={nuevoFecha}
              onChange={(e) => setNuevoFecha(e.target.value)}
              style={styles.inputControl}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Hora</label>
            <input
              type="time"
              value={nuevoHora}
              onChange={(e) => setNuevoHora(e.target.value)}
              style={styles.inputControl}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Cliente *</label>
            <select
              value={nuevoClienteId}
              onChange={(e) => setNuevoClienteId(e.target.value)}
              style={styles.inputControl}
            >
              <option value="">-- Seleccionar --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Campo *</label>
            <select
              value={nuevoCampoId}
              onChange={(e) => setNuevoCampoId(e.target.value)}
              style={styles.inputControl}
            >
              <option value="">-- Seleccionar --</option>
              {camposFiltradosAlta.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Observación</label>
            <input
              type="text"
              placeholder="Detalle..."
              value={nuevoObservacion}
              onChange={(e) => setNuevoObservacion(e.target.value)}
              style={styles.inputControl}
            />
          </div>
          <div style={styles.fieldGroup}>
            <button type="submit" style={styles.btnSuccess}>
              + Agendar
            </button>
          </div>
        </form>
      </div>

      {vista === "tabla" && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: "135px" }}>Fecha</th>
                <th style={{ ...styles.th, width: "100px" }}>Hora</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Campo</th>
                <th style={styles.th}>Observación</th>
                <th
                  style={{ ...styles.th, textAlign: "center", width: "180px" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {turnosFiltradosYOrdenados.length > 0 ? (
                turnosFiltradosYOrdenados.map((item) => {
                  const enEdicion = editId === item.id;
                  const clienteObj = clientes.find(
                    (c) => Number(c.id) === Number(item.cliente_id),
                  );
                  const campoObj = campos.find(
                    (cp) => Number(cp.id) === Number(item.campo_id),
                  );

                  let fechaFormateada = "-";
                  let horaFormateada = "Sin horario";
                  if (item.fecha_hora) {
                    const norm = item.fecha_hora.replace("T", " ");
                    const [fPart, hPart] = norm.split(" ");
                    if (fPart) {
                      const [anio, mes, dia] = fPart.split("-");
                      fechaFormateada = `${dia}/${mes}/${anio}`;
                    }
                    if (hPart) {
                      horaFormateada = `${hPart.slice(0, 5)} hs`;
                    }
                  }

                  return (
                    <tr key={item.id}>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <input
                            type="date"
                            value={editFecha}
                            onChange={(e) => setEditFecha(e.target.value)}
                            style={styles.inputControl}
                          />
                        ) : (
                          fechaFormateada
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <input
                            type="time"
                            value={editHora}
                            onChange={(e) => setEditHora(e.target.value)}
                            style={styles.inputControl}
                          />
                        ) : (
                          horaFormateada
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <select
                            value={editClienteId}
                            onChange={(e) => setEditClienteId(e.target.value)}
                            style={styles.inputControl}
                          >
                            {clientes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nombre}
                              </option>
                            ))}
                          </select>
                        ) : (
                          clienteObj?.nombre || "Sin cliente"
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <select
                            value={editCampoId}
                            onChange={(e) => setEditCampoId(e.target.value)}
                            style={styles.inputControl}
                          >
                            {camposFiltradosEdit.map((cp) => (
                              <option key={cp.id} value={cp.id}>
                                {cp.nombre}
                              </option>
                            ))}
                          </select>
                        ) : (
                          campoObj?.nombre || "Sin campo"
                        )}
                      </td>
                      <td style={styles.td}>
                        {enEdicion ? (
                          <input
                            type="text"
                            value={editObservacion}
                            onChange={(e) => setEditObservacion(e.target.value)}
                            style={styles.inputControl}
                          />
                        ) : (
                          item.observacion || "-"
                        )}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "center",
                          width: "180px",
                        }}
                      >
                        {enEdicion ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() => handleGuardarEdicion(item.id)}
                              style={styles.btnSuccess}
                            >
                              Guarda
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              style={styles.btnSecondary}
                            >
                              Cancela
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: "6px",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() => iniciarEdicion(item)}
                              style={styles.btnPrimary}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => setTurnoAEliminar(item.id)}
                              style={styles.btnDanger}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    No hay turnos próximos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {vista === "almanaque" && (
        <div style={styles.card}>
          <div style={styles.calendarHeaderNav}>
            <button
              type="button"
              onClick={() => cambiarMes(-1)}
              style={styles.btnSecondary}
            >
              ◀ Mes Anterior
            </button>
            <h2
              style={{
                margin: 0,
                textTransform: "capitalize",
                fontSize: "1.2rem",
                color: "#1e293b",
              }}
            >
              {nombreMesAnio}
            </h2>
            <button
              type="button"
              onClick={() => cambiarMes(1)}
              style={styles.btnSecondary}
            >
              Mes Siguiente ▶
            </button>
          </div>

          <table style={styles.calendarTable}>
            <thead>
              <tr>
                {[
                  "Lunes",
                  "Martes",
                  "Miércoles",
                  "Jueves",
                  "Viernes",
                  "Sábado",
                  "Domingo",
                ].map((dia, i) => (
                  <th key={i} style={styles.calendarTh}>
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(matrizDiasMes.length / 7) }).map(
                (_, semanaIdx) => (
                  <tr key={semanaIdx}>
                    {matrizDiasMes
                      .slice(semanaIdx * 7, (semanaIdx + 1) * 7)
                      .map((celda, diaIdx) => {
                        const fechaIso = `${celda.fechaObj.getFullYear()}-${String(celda.fechaObj.getMonth() + 1).padStart(2, "0")}-${String(celda.fechaObj.getDate()).padStart(2, "0")}`;
                        const esHoy = fechaIso === hoyIso;

                        const turnosDelDia = turnos.filter((t) => {
                          if (!t.fecha_hora) return false;
                          const normalizado = t.fecha_hora.replace("T", " ");
                          return normalizado.split(" ")[0] === fechaIso;
                        });

                        let cellStyle = styles.calendarCell;
                        if (esHoy) {
                          cellStyle = styles.calendarCellToday;
                        } else if (!celda.esMesActual) {
                          cellStyle = styles.calendarCellOutside;
                        }

                        return (
                          <td key={diaIdx} style={cellStyle}>
                            <span style={styles.dayNumber}>
                              {celda.fechaObj.getDate()}
                            </span>
                            <div
                              style={{ maxHeight: "75px", overflowY: "auto" }}
                            >
                              {turnosDelDia.map((t) => {
                                const clienteObj = clientes.find(
                                  (c) => Number(c.id) === Number(t.cliente_id),
                                );
                                const nombreCli = clienteObj
                                  ? clienteObj.nombre
                                  : "Turno";
                                const normalizado = t.fecha_hora.replace(
                                  "T",
                                  " ",
                                );
                                const partesFecha = normalizado.split(" ");
                                const hora = partesFecha[1]
                                  ? partesFecha[1].slice(0, 5)
                                  : "";

                                return (
                                  <div
                                    key={t.id}
                                    style={styles.turnoBadge}
                                    onClick={() => iniciarEdicion(t)}
                                    title={`${hora} - ${nombreCli}`}
                                  >
                                    {hora ? `${hora} ` : ""}
                                    {nombreCli}
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      {turnoAEliminar && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>¿Eliminar turno?</h3>
            <p style={styles.modalText}>
              Esta acción borrará el turno seleccionado.
            </p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setTurnoAEliminar(null)}
                style={styles.btnSecondary}
              >
                Cancelar
              </button>
              <button onClick={ejecutarEliminarTurno} style={styles.btnDanger}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
