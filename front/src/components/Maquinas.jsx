import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import maquinaImg from "../assets/maquina.png";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1300px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginBottom: "28px",
  },
  btnNuevo: {
    padding: "10px 22px",
    background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
    transition: "all 0.25s ease",
  },
  btnDetalle: {
    padding: "10px 18px",
    backgroundColor: "#0284c7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)",
    transition: "all 0.2s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: (colorBorde) => ({
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: `3.5px solid ${colorBorde}`,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  }),
  cardHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  cardNombre: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
  },
  btnEditarLapiz: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  },
  imagenContenedor: {
    width: "100%",
    height: "130px",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  imagenEstilizada: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  infoSeccion: {
    width: "100%",
    fontSize: "0.85rem",
    color: "#475569",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    backgroundColor: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "14px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  btnServiceCard: {
    width: "100%",
    padding: "9px",
    background:
      "linear-gradient(to right, #94a3b8 50%, rgba(255, 255, 255, 0.9) 50%)",
    backgroundSize: "200% 100%",
    backgroundPosition: "right bottom",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "700",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
    transition: "all 0.35s ease-in-out",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    maxWidth: "1200px",
    width: "95%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  btnCloseX: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "transparent",
    border: "none",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#64748b",
    cursor: "pointer",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#475569",
    whiteSpace: "nowrap",
  },
  labelDestacado: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#1d4ed8",
    whiteSpace: "nowrap",
  },
  input: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    width: "100%",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "110px",
    flex: "1",
  },
  inputGroupDestacado: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "140px",
    flex: "1.2",
    backgroundColor: "#eff6ff",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px dashed #3b82f6",
  },
  btnModalSubmit: {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnModalCancel: {
    padding: "10px 16px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  tabsContainer: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "8px",
    marginBottom: "12px",
  },
  tabBtn: (isActive) => ({
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: isActive ? "#0284c7" : "#f1f5f9",
    color: isActive ? "#ffffff" : "#475569",
    transition: "all 0.2s",
  }),
  filtrosContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    border: "1px solid #e2e8f0",
  },
  sectionSubTitle: (colorTema) => ({
    fontSize: "1rem",
    fontWeight: "700",
    color: colorTema,
    marginTop: "20px",
    marginBottom: "8px",
  }),
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginBottom: "16px",
    tableLayout: "fixed",
  },
  th: (bgColor, borderColor) => ({
    backgroundColor: bgColor,
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: `2px solid ${borderColor}`,
    color: "#1e293b",
    fontWeight: "700",
    cursor: "pointer",
    userSelect: "none",
  }),
  thStatic: (bgColor, borderColor) => ({
    backgroundColor: bgColor,
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: `2px solid ${borderColor}`,
    color: "#1e293b",
    fontWeight: "700",
  }),
  td: {
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    wordBreak: "break-word",
  },
  tfoot: {
    backgroundColor: "#f8fafc",
    fontWeight: "700",
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
};

const paletaBordesCards = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [toasts, setToasts] = useState([]);

  const mostrarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const [modalNuevaAbierto, setModalNuevaAbierto] = useState(false);
  const [modalServiceAbierto, setModalServiceAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);

  const [nombreMaquina, setNombreMaquina] = useState("");
  const [maquinaSeleccionadaId, setMaquinaSeleccionadaId] = useState("");
  const [tipoMantenimiento, setTipoMantenimiento] = useState("");
  const [fechaService, setFechaService] = useState("");
  const [costoService, setCostoService] = useState("");
  const [observacionService, setObservacionService] = useState("");
  const [maquinaAEditar, setMaquinaAEditar] = useState(null);
  const [nuevoNombreMaquina, setNuevoNombreMaquina] = useState("");

  const [solapaActiva, setSolapaActiva] = useState("todas");
  const [tipoFiltro, setTipoFiltro] = useState("todo");
  const [valorFecha, setValorFecha] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [filtroTratamiento, setFiltroTratamiento] = useState("");
  const [filtroTratamientoOtro, setFiltroTratamientoOtro] = useState("");
  const [filtroCultivo, setFiltroCultivo] = useState("");
  const [filtroCultivoOtro, setFiltroCultivoOtro] = useState("");

  const [sortFieldTrabajo, setSortFieldTrabajo] = useState("fecha");
  const [sortOrderTrabajo, setSortOrderTrabajo] = useState("asc");

  const fetchData = useCallback(async () => {
    try {
      const [
        resMaq,
        resEmp,
        resAsig,
        resMant,
        resTrab,
        resLot,
        resCamp,
        resCli,
      ] = await Promise.all([
        api.get("/maquinas").catch(() => ({ data: [] })),
        api.get("/empleados").catch(() => ({ data: [] })),
        api.get("/empleados-maquinas").catch(() => ({ data: [] })),
        api.get("/mantenimiento").catch(() => ({ data: [] })),
        api.get("/trabajos").catch(() => ({ data: [] })),
        api.get("/lotes").catch(() => ({ data: [] })),
        api.get("/campos").catch(() => ({ data: [] })),
        api.get("/clientes").catch(() => ({ data: [] })),
      ]);
      setMaquinas(resMaq.data);
      setEmpleados(resEmp.data);
      setAsignaciones(resAsig.data);
      setMantenimientos(resMant.data);
      setTrabajos(resTrab.data);
      setLotes(resLot.data);
      setCampos(resCamp.data);
      setClientes(resCli.data);
    } catch (error) {
      console.error("Error al cargar datos de máquinas:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const parteFecha = fechaStr.split("T")[0];
    const [anio, mes, dia] = parteFecha.split("-");
    if (anio && mes && dia) {
      return `${dia}/${mes}/${anio}`;
    }
    return fechaStr;
  };

  const handleCrearMaquina = async (e) => {
    e.preventDefault();
    const nombreLimpio = nombreMaquina.trim();
    if (!nombreLimpio) return;

    const existe = maquinas.some(
      (m) => m.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase(),
    );
    if (existe) {
      mostrarToast("Ya existe una máquina registrada con ese nombre.", "error");
      return;
    }

    try {
      await api.post("/maquinas", { nombre: nombreLimpio });
      setModalNuevaAbierto(false);
      setNombreMaquina("");
      mostrarToast("Máquina creada correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al registrar máquina:", error);
      mostrarToast("Error al registrar la máquina", "error");
    }
  };

  const handleEditarMaquina = async (e) => {
    e.preventDefault();
    if (!maquinaAEditar || !nuevoNombreMaquina.trim()) return;

    const nombreLimpio = nuevoNombreMaquina.trim();

    const existe = maquinas.some(
      (m) =>
        Number(m.id) !== Number(maquinaAEditar.id) &&
        m.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase(),
    );
    if (existe) {
      mostrarToast(
        "Ya existe otra máquina registrada con ese nombre.",
        "error",
      );
      return;
    }

    try {
      await api.put(`/maquinas/${maquinaAEditar.id}`, {
        nombre: nombreLimpio,
      });
      setModalEditarAbierto(false);
      setMaquinaAEditar(null);
      setNuevoNombreMaquina("");
      mostrarToast("Máquina actualizada correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al actualizar máquina:", error);
      mostrarToast("Error al actualizar la máquina", "error");
    }
  };

  const handleCrearService = async (e) => {
    e.preventDefault();
    if (!maquinaSeleccionadaId || !tipoMantenimiento.trim()) return;

    try {
      await api.post("/mantenimiento", {
        maquina_id: maquinaSeleccionadaId,
        tipo_mantenimiento: tipoMantenimiento.trim(),
        fecha: fechaService || new Date().toISOString().split("T")[0],
        costo: costoService ? Number(costoService) : 0,
        observacion: observacionService.trim(),
      });
      setModalServiceAbierto(false);
      setMaquinaSeleccionadaId("");
      setTipoMantenimiento("");
      setFechaService("");
      setCostoService("");
      setObservacionService("");
      mostrarToast("Service registrado con éxito");
      fetchData();
    } catch (error) {
      console.error("Error al registrar service:", error);
      mostrarToast("Error al registrar el service", "error");
    }
  };

  const cumpleFiltroFecha = (fechaStr) => {
    if (!fechaStr) return false;
    const fechaSolo = fechaStr.split("T")[0];

    if (tipoFiltro === "dia" && valorFecha) {
      return fechaSolo === valorFecha;
    }
    if (tipoFiltro === "rango") {
      if (fechaDesde && fechaSolo < fechaDesde) return false;
      if (fechaHasta && fechaSolo > fechaHasta) return false;
      return true;
    }
    if (tipoFiltro === "mes" && valorFecha) {
      return fechaSolo.startsWith(valorFecha);
    }
    if (tipoFiltro === "anio" && valorFecha) {
      return fechaSolo.startsWith(valorFecha);
    }
    return true;
  };

  const handleSortTrabajo = (field) => {
    if (sortFieldTrabajo === field) {
      setSortOrderTrabajo(sortOrderTrabajo === "asc" ? "desc" : "asc");
    } else {
      setSortFieldTrabajo(field);
      setSortOrderTrabajo("asc");
    }
  };

  const maquinaActivaObj = maquinas.find(
    (m) => Number(m.id) === Number(maquinaSeleccionadaId),
  );

  return (
    <div style={styles.container}>
      <div style={styles.toastContainer}>
        {toasts.map((t) => (
          <div key={t.id} style={styles.toast(t.tipo)}>
            {t.mensaje}
          </div>
        ))}
      </div>

      <div style={styles.topBar}>
        <button
          onClick={() => {
            setSolapaActiva("todas");
            setTipoFiltro("todo");
            setFiltroTratamiento("");
            setFiltroTratamientoOtro("");
            setFiltroCultivo("");
            setFiltroCultivoOtro("");
            setModalDetalleAbierto(true);
          }}
          style={styles.btnDetalle}
        >
          📄 Ver Detalle
        </button>
        <button
          onClick={() => {
            setNombreMaquina("");
            setModalNuevaAbierto(true);
          }}
          style={styles.btnNuevo}
        >
          + Agregar Nueva Máquina
        </button>
      </div>

      <div style={styles.grid}>
        {maquinas.map((m, index) => {
          const colorBordeCard =
            paletaBordesCards[index % paletaBordesCards.length];
          const relChofer = asignaciones.find(
            (a) => Number(a.maquina_id || a.maquinaId) === Number(m.id),
          );
          const empObj = empleados.find(
            (e) =>
              Number(e.id) ===
              Number(relChofer?.empleado_id || relChofer?.empleadoId),
          );
          const nombreChofer = empObj
            ? empObj.nombre || empObj.apellido
              ? `${empObj.nombre || ""} ${empObj.apellido || ""}`.trim()
              : empObj.username
            : "Sin chofer asignado";

          const mantsMaquina = mantenimientos.filter(
            (mnt) => Number(mnt.maquina_id || mnt.maquinaId) === Number(m.id),
          );
          mantsMaquina.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
          const ultimoMant = mantsMaquina[0];

          return (
            <div key={m.id} style={styles.card(colorBordeCard)}>
              <div>
                <div style={styles.cardHeader}>
                  <div style={styles.cardNombre}>{m.nombre}</div>
                  <button
                    title="Editar nombre"
                    onClick={() => {
                      setMaquinaAEditar(m);
                      setNuevoNombreMaquina(m.nombre);
                      setModalEditarAbierto(true);
                    }}
                    style={styles.btnEditarLapiz}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                </div>

                <div style={styles.imagenContenedor}>
                  <img
                    src={maquinaImg}
                    alt={m.nombre}
                    style={styles.imagenEstilizada}
                  />
                </div>

                <div style={styles.infoSeccion}>
                  <div style={styles.infoRow}>
                    <span>
                      <b>Chofer:</b>
                    </span>
                    <span>{nombreChofer}</span>
                  </div>
                  <div
                    style={{ borderTop: "1px solid #cbd5e1", margin: "4px 0" }}
                  ></div>
                  <div style={styles.infoRow}>
                    <span>
                      <b>Último Service:</b>
                    </span>
                    <span>
                      {ultimoMant
                        ? formatearFecha(ultimoMant.fecha)
                        : "Sin registros"}
                    </span>
                  </div>
                  {ultimoMant && (
                    <>
                      <div style={styles.infoRow}>
                        <span>
                          <b>Tipo:</b>
                        </span>
                        <span>
                          {ultimoMant.tipo_mantenimiento ||
                            ultimoMant.tipoMantenimiento}
                        </span>
                      </div>
                      {ultimoMant.observacion && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#64748b",
                            marginTop: "2px",
                          }}
                        >
                          <b>Obs:</b> {ultimoMant.observacion}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setMaquinaSeleccionadaId(String(m.id));
                  setTipoMantenimiento("");
                  setFechaService("");
                  setCostoService("");
                  setObservacionService("");
                  setModalServiceAbierto(true);
                }}
                style={styles.btnServiceCard}
              >
                + Agregar Service
              </button>
            </div>
          );
        })}
      </div>

      {modalNuevaAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalNuevaAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Nueva Máquina
            </h3>
            <form onSubmit={handleCrearMaquina}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre de la Máquina</label>
                <input
                  type="text"
                  placeholder="Ej: Pulverizadora Autopropulsada 01"
                  required
                  value={nombreMaquina}
                  onChange={(e) => setNombreMaquina(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalNuevaAbierto(false)}
                  style={styles.btnModalCancel}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnModalSubmit}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditarAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalEditarAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Editar Nombre de Máquina
            </h3>
            <form onSubmit={handleEditarMaquina}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nuevo Nombre</label>
                <input
                  type="text"
                  required
                  value={nuevoNombreMaquina}
                  onChange={(e) => setNuevoNombreMaquina(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalEditarAbierto(false)}
                  style={styles.btnModalCancel}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnModalSubmit}>
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalServiceAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalServiceAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Registrar Service / Mantenimiento:{" "}
              <span style={{ color: "#475569" }}>
                {maquinaActivaObj ? maquinaActivaObj.nombre : ""}
              </span>
            </h3>
            <form onSubmit={handleCrearService}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tipo de Mantenimiento</label>
                <input
                  type="text"
                  placeholder="Ej: Cambio de filtros y aceite"
                  required
                  value={tipoMantenimiento}
                  onChange={(e) => setTipoMantenimiento(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha</label>
                <input
                  type="date"
                  value={fechaService}
                  onChange={(e) => setFechaService(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Costo ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={costoService}
                  onChange={(e) => setCostoService(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Observaciones</label>
                <input
                  type="text"
                  placeholder="Detalles adicionales..."
                  value={observacionService}
                  onChange={(e) => setObservacionService(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalServiceAbierto(false)}
                  style={styles.btnModalCancel}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnModalSubmit}>
                  Guardar Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalDetalleAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalDetalleAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
              Detalle de Operaciones y Mantenimiento
            </h3>

            <div style={styles.tabsContainer}>
              <button
                onClick={() => setSolapaActiva("todas")}
                style={styles.tabBtn(solapaActiva === "todas")}
              >
                Todas las Máquinas
              </button>
              {maquinas.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSolapaActiva(m.id)}
                  style={styles.tabBtn(solapaActiva === m.id)}
                >
                  {m.nombre}
                </button>
              ))}
            </div>

            <div style={styles.filtrosContainer}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Período</label>
                <select
                  value={tipoFiltro}
                  onChange={(e) => {
                    setTipoFiltro(e.target.value);
                    setValorFecha("");
                    setFechaDesde("");
                    setFechaHasta("");
                  }}
                  style={styles.select}
                >
                  <option value="todo">Todo</option>
                  <option value="dia">Por Día</option>
                  <option value="rango">Por Rango de Fechas</option>
                  <option value="mes">Por Mes</option>
                  <option value="anio">Por Año</option>
                </select>
              </div>

              {tipoFiltro === "dia" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Día</label>
                  <input
                    type="date"
                    value={valorFecha}
                    onChange={(e) => setValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              {tipoFiltro === "rango" && (
                <>
                  <div style={styles.inputGroupDestacado}>
                    <label style={styles.labelDestacado}>Desde</label>
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroupDestacado}>
                    <label style={styles.labelDestacado}>Hasta</label>
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </>
              )}

              {tipoFiltro === "mes" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Mes</label>
                  <input
                    type="month"
                    value={valorFecha}
                    onChange={(e) => setValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              {tipoFiltro === "anio" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Año</label>
                  <input
                    type="number"
                    placeholder="2026"
                    value={valorFecha}
                    onChange={(e) => setValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tratamiento</label>
                <select
                  value={filtroTratamiento}
                  onChange={(e) => {
                    setFiltroTratamiento(e.target.value);
                    if (e.target.value !== "otros")
                      setFiltroTratamientoOtro("");
                  }}
                  style={styles.select}
                >
                  <option value="">Todos</option>
                  <option value="Barbecho">Barbecho</option>
                  <option value="Hoja Ancha">Hoja Ancha</option>
                  <option value="Post-emergente Clearsol">
                    Post-emergente Clearsol
                  </option>
                  <option value="Pre-emergente">Pre-emergente</option>
                  <option value="otros">Otro</option>
                </select>
              </div>

              {filtroTratamiento === "otros" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>
                    Espec. Tratamiento
                  </label>
                  <input
                    type="text"
                    placeholder="Detalle..."
                    value={filtroTratamientoOtro}
                    onChange={(e) => setFiltroTratamientoOtro(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Cultivo</label>
                <select
                  value={filtroCultivo}
                  onChange={(e) => {
                    setFiltroCultivo(e.target.value);
                    if (e.target.value !== "otro") setFiltroCultivoOtro("");
                  }}
                  style={styles.select}
                >
                  <option value="">Todos</option>
                  <option value="avena">Avena</option>
                  <option value="cebada">Cebada</option>
                  <option value="girasol">Girasol</option>
                  <option value="maiz">Maíz</option>
                  <option value="soja">Soja</option>
                  <option value="sorgo">Sorgo</option>
                  <option value="trigo">Trigo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {filtroCultivo === "otro" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Espec. Cultivo</label>
                  <input
                    type="text"
                    placeholder="Detalle..."
                    value={filtroCultivoOtro}
                    onChange={(e) => setFiltroCultivoOtro(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                maxHeight: "480px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              <div style={styles.sectionSubTitle("#166534")}>
                Trabajos Realizados
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th
                      style={styles.th("#dcfce7", "#86efac")}
                      onClick={() => handleSortTrabajo("fecha")}
                    >
                      Fecha{" "}
                      {sortFieldTrabajo === "fecha"
                        ? sortOrderTrabajo === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    {solapaActiva === "todas" && (
                      <th style={styles.thStatic("#dcfce7", "#86efac")}>
                        Máquina
                      </th>
                    )}
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>Lote</th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>Campo</th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>
                      Cliente
                    </th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>
                      Hectáreas
                    </th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>
                      Cultivo
                    </th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>
                      Tratamiento
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtrados = trabajos.filter((t) => {
                      const maqId = t.maquina_id || t.maquinaId;
                      if (
                        solapaActiva !== "todas" &&
                        Number(maqId) !== Number(solapaActiva)
                      )
                        return false;
                      if (!cumpleFiltroFecha(t.fecha)) return false;

                      const tramientoT = t.tratamiento || "";
                      if (filtroTratamiento) {
                        if (filtroTratamiento === "otros") {
                          if (
                            filtroTratamientoOtro &&
                            !tramientoT
                              .toLowerCase()
                              .includes(filtroTratamientoOtro.toLowerCase())
                          )
                            return false;
                        } else {
                          if (
                            !tramientoT
                              .toLowerCase()
                              .includes(filtroTratamiento.toLowerCase())
                          )
                            return false;
                        }
                      }

                      const cultivoT = t.tipo_cultivo || t.tipoCultivo || "";
                      if (filtroCultivo) {
                        if (filtroCultivo === "otro") {
                          if (
                            filtroCultivoOtro &&
                            !cultivoT
                              .toLowerCase()
                              .includes(filtroCultivoOtro.toLowerCase())
                          )
                            return false;
                        } else {
                          if (
                            !cultivoT
                              .toLowerCase()
                              .includes(filtroCultivo.toLowerCase())
                          )
                            return false;
                        }
                      }

                      return true;
                    });

                    if (filtrados.length === 0) {
                      const colSpanCount = solapaActiva === "todas" ? 8 : 7;
                      return (
                        <tr>
                          <td
                            colSpan={colSpanCount}
                            style={{
                              ...styles.td,
                              textAlign: "center",
                              color: "#64748b",
                            }}
                          >
                            No hay trabajos registrados.
                          </td>
                        </tr>
                      );
                    }

                    return filtrados.map((t) => {
                      const loteObj = lotes.find(
                        (l) => Number(l.id) === Number(t.lote_id || t.loteId),
                      );
                      const campoObj = campos.find(
                        (c) =>
                          Number(c.id) ===
                          Number(loteObj?.campo_id || loteObj?.campoId),
                      );
                      const clienteObj = clientes.find(
                        (cli) =>
                          Number(cli.id) ===
                          Number(campoObj?.cliente_id || campoObj?.clienteId),
                      );
                      const maqObj = maquinas.find(
                        (m) =>
                          Number(m.id) === Number(t.maquina_id || t.maquinaId),
                      );

                      const hectareasEnteras = Math.round(
                        Number(t.cantidad_hectareas || t.cantidadHectareas) ||
                          0,
                      );

                      return (
                        <tr key={t.id}>
                          <td style={styles.td}>{formatearFecha(t.fecha)}</td>
                          {solapaActiva === "todas" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {maqObj ? maqObj.nombre : "-"}
                            </td>
                          )}
                          <td style={styles.td}>
                            {loteObj ? loteObj.numero_lote : "-"}
                          </td>
                          <td style={styles.td}>
                            {campoObj ? campoObj.nombre : "-"}
                          </td>
                          <td style={styles.td}>
                            {clienteObj ? clienteObj.nombre : "-"}
                          </td>
                          <td style={styles.td}>{hectareasEnteras} ha</td>
                          <td style={styles.td}>
                            {t.tipo_cultivo || t.tipoCultivo || "-"}
                          </td>
                          <td style={styles.td}>{t.tratamiento || "-"}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
