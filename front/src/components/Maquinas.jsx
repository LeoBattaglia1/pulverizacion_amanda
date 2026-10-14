import { useState, useEffect } from "react";
import api from "../services/api";

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
  btnService: {
    padding: "10px 22px",
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
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
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
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
    maxWidth: "1150px",
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
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
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
    alignItems: "center",
    flexWrap: "wrap",
    backgroundColor: "#f8fafc",
    padding: "10px",
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
  resumenTotalesBox: {
    backgroundColor: "#eff6ff",
    padding: "10px 12px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    color: "#1e40af",
    marginTop: "-8px",
    marginBottom: "16px",
    border: "1px solid #bfdbfe",
  },
};

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [retirosInsumos, setRetirosInsumos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Modales
  const [modalNuevaAbierto, setModalNuevaAbierto] = useState(false);
  const [modalServiceAbierto, setModalServiceAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);

  // Form states
  const [nombreMaquina, setNombreMaquina] = useState("");
  const [maquinaSeleccionadaId, setMaquinaSeleccionadaId] = useState("");
  const [tipoMantenimiento, setTipoMantenimiento] = useState("");
  const [fechaService, setFechaService] = useState("");
  const [costoService, setCostoService] = useState("");
  const [observacionService, setObservacionService] = useState("");
  const [maquinaAEditar, setMaquinaAEditar] = useState(null);
  const [nuevoNombreMaquina, setNuevoNombreMaquina] = useState("");

  // Solapa y Filtros de Tiempo dentro del modal de detalle
  const [solapaActiva, setSolapaActiva] = useState("todas");
  const [tipoFiltro, setTipoFiltro] = useState("todo");
  const [valorFecha, setValorFecha] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Estados de Ordenamiento para la tabla de Trabajos
  const [sortFieldTrabajo, setSortFieldTrabajo] = useState("fecha");
  const [sortOrderTrabajo, setSortOrderTrabajo] = useState("asc");

  const fetchData = async () => {
    try {
      const [
        resMaq,
        resEmp,
        resAsig,
        resMant,
        resTrab,
        resRet,
        resIns,
        resLot,
        resCamp,
        resCli,
      ] = await Promise.all([
        api.get("/maquinas").catch(() => ({ data: [] })),
        api.get("/empleados").catch(() => ({ data: [] })),
        api.get("/empleados-maquinas").catch(() => ({ data: [] })),
        api.get("/mantenimiento").catch(() => ({ data: [] })),
        api.get("/trabajos").catch(() => ({ data: [] })),
        api.get("/insumos/retiros").catch(() => ({ data: [] })),
        api.get("/insumos").catch(() => ({ data: [] })),
        api.get("/lotes").catch(() => ({ data: [] })),
        api.get("/campos").catch(() => ({ data: [] })),
        api.get("/clientes").catch(() => ({ data: [] })),
      ]);
      setMaquinas(resMaq.data);
      setEmpleados(resEmp.data);
      setAsignaciones(resAsig.data);
      setMantenimientos(resMant.data);
      setTrabajos(resTrab.data);
      setRetirosInsumos(resRet.data);
      setInsumos(resIns.data);
      setLotes(resLot.data);
      setCampos(resCamp.data);
      setClientes(resCli.data);
    } catch (error) {
      console.error("Error al cargar datos de máquinas:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

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

    try {
      await api.post("/maquinas", { nombre: nombreLimpio });
      setModalNuevaAbierto(false);
      setNombreMaquina("");
      fetchData();
    } catch (error) {
      console.error("Error al registrar máquina:", error);
    }
  };

  const handleEditarMaquina = async (e) => {
    e.preventDefault();
    if (!maquinaAEditar || !nuevoNombreMaquina.trim()) return;

    try {
      await api.put(`/maquinas/${maquinaAEditar.id}`, {
        nombre: nuevoNombreMaquina.trim(),
      });
      setModalEditarAbierto(false);
      setMaquinaAEditar(null);
      setNuevoNombreMaquina("");
      fetchData();
    } catch (error) {
      console.error("Error al actualizar máquina:", error);
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
      fetchData();
    } catch (error) {
      console.error("Error al registrar service:", error);
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

  return (
    <div style={styles.container}>
      {/* BARRA SUPERIOR */}
      <div style={styles.topBar}>
        <button
          onClick={() => {
            setSolapaActiva("todas");
            setTipoFiltro("todo");
            setModalDetalleAbierto(true);
          }}
          style={styles.btnDetalle}
        >
          📄 Ver Detalle
        </button>
        <button
          onClick={() => {
            setMaquinaSeleccionadaId("");
            setTipoMantenimiento("");
            setFechaService("");
            setCostoService("");
            setObservacionService("");
            setModalServiceAbierto(true);
          }}
          style={styles.btnService}
        >
          + Agregar Service
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

      {/* GRILLA DE MÁQUINAS */}
      <div style={styles.grid}>
        {maquinas.map((m) => {
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
            <div key={m.id} style={styles.card}>
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
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80"
                  alt="Pulverizadora / Maquinaria"
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
          );
        })}
      </div>

      {/* MODAL NUEVA MÁQUINA */}
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

      {/* MODAL EDITAR MÁQUINA */}
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

      {/* MODAL AGREGAR SERVICE */}
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
              Registrar Service / Mantenimiento
            </h3>
            <form onSubmit={handleCrearService}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Máquina</label>
                <select
                  required
                  value={maquinaSeleccionadaId}
                  onChange={(e) => setMaquinaSeleccionadaId(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Seleccione una máquina...</option>
                  {maquinas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
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

      {/* MODAL VER DETALLE AMPLIADO */}
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

            {/* Solapas por Máquina */}
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

            {/* Filtros de Tiempo */}
            <div style={styles.filtrosContainer}>
              <label style={styles.label}>Período:</label>
              <select
                value={tipoFiltro}
                onChange={(e) => {
                  setTipoFiltro(e.target.value);
                  setValorFecha("");
                  setFechaDesde("");
                  setFechaHasta("");
                }}
                style={{ ...styles.select, width: "160px" }}
              >
                <option value="todo">Todo el Histórico</option>
                <option value="dia">Por Día</option>
                <option value="rango">Por Rango de Fechas</option>
                <option value="mes">Por Mes</option>
                <option value="anio">Por Año</option>
              </select>

              {tipoFiltro === "dia" && (
                <input
                  type="date"
                  value={valorFecha}
                  onChange={(e) => setValorFecha(e.target.value)}
                  style={{ ...styles.input, width: "150px" }}
                />
              )}

              {tipoFiltro === "rango" && (
                <>
                  <input
                    type="date"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                    style={{ ...styles.input, width: "140px" }}
                    placeholder="Desde"
                  />
                  <input
                    type="date"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                    style={{ ...styles.input, width: "140px" }}
                    placeholder="Hasta"
                  />
                </>
              )}

              {tipoFiltro === "mes" && (
                <input
                  type="month"
                  value={valorFecha}
                  onChange={(e) => setValorFecha(e.target.value)}
                  style={{ ...styles.input, width: "150px" }}
                />
              )}

              {tipoFiltro === "anio" && (
                <input
                  type="number"
                  placeholder="2026"
                  value={valorFecha}
                  onChange={(e) => setValorFecha(e.target.value)}
                  style={{ ...styles.input, width: "110px" }}
                />
              )}
            </div>

            <div
              style={{
                maxHeight: "480px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {/* --- 1. TRABAJOS REALIZADOS (Tono Verde) --- */}
              <div style={styles.sectionSubTitle("#166534")}>
                Trabajos Realizados
              </div>
              <table style={styles.table}>
                <colgroup>
                  {solapaActiva === "todas" ? (
                    <>
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "10%" }} />
                    </>
                  ) : (
                    <>
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "12%" }} />
                    </>
                  )}
                </colgroup>
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
                    <th
                      style={styles.th("#dcfce7", "#86efac")}
                      onClick={() => handleSortTrabajo("campo")}
                    >
                      Campo{" "}
                      {sortFieldTrabajo === "campo"
                        ? sortOrderTrabajo === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    <th
                      style={styles.th("#dcfce7", "#86efac")}
                      onClick={() => handleSortTrabajo("cliente")}
                    >
                      Cliente{" "}
                      {sortFieldTrabajo === "cliente"
                        ? sortOrderTrabajo === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>
                      Hectáreas
                    </th>
                    <th
                      style={styles.th("#dcfce7", "#86efac")}
                      onClick={() => handleSortTrabajo("cultivo")}
                    >
                      Cultivo{" "}
                      {sortFieldTrabajo === "cultivo"
                        ? sortOrderTrabajo === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    <th
                      style={styles.th("#dcfce7", "#86efac")}
                      onClick={() => handleSortTrabajo("tratamiento")}
                    >
                      Tratamiento{" "}
                      {sortFieldTrabajo === "tratamiento"
                        ? sortOrderTrabajo === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
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
                      return cumpleFiltroFecha(t.fecha);
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

                    const ordenados = [...filtrados].sort((a, b) => {
                      const loteA = lotes.find(
                        (l) => Number(l.id) === Number(a.lote_id || a.loteId),
                      );
                      const campoA = campos.find(
                        (c) =>
                          Number(c.id) ===
                          Number(loteA?.campo_id || loteA?.campoId),
                      );
                      const clienteA = clientes.find(
                        (cli) =>
                          Number(cli.id) ===
                          Number(campoA?.cliente_id || campoA?.clienteId),
                      );

                      const loteB = lotes.find(
                        (l) => Number(l.id) === Number(b.lote_id || b.loteId),
                      );
                      const campoB = campos.find(
                        (c) =>
                          Number(c.id) ===
                          Number(loteB?.campo_id || loteB?.campoId),
                      );
                      const clienteB = clientes.find(
                        (cli) =>
                          Number(cli.id) ===
                          Number(campoB?.cliente_id || campoB?.clienteId),
                      );

                      let valA = "",
                        valB = "";
                      if (sortFieldTrabajo === "fecha") {
                        valA = a.fecha || "";
                        valB = b.fecha || "";
                      } else if (sortFieldTrabajo === "campo") {
                        valA = campoA?.nombre || "";
                        valB = campoB?.nombre || "";
                      } else if (sortFieldTrabajo === "cliente") {
                        valA = clienteA?.nombre || "";
                        valB = clienteB?.nombre || "";
                      } else if (sortFieldTrabajo === "cultivo") {
                        valA = a.tipo_cultivo || a.tipoCultivo || "";
                        valB = b.tipo_cultivo || b.tipoCultivo || "";
                      } else if (sortFieldTrabajo === "tratamiento") {
                        valA = a.tratamiento || "";
                        valB = b.tratamiento || "";
                      }

                      if (valA < valB)
                        return sortOrderTrabajo === "asc" ? -1 : 1;
                      if (valA > valB)
                        return sortOrderTrabajo === "asc" ? 1 : -1;
                      return 0;
                    });

                    return ordenados.map((t) => {
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
                {(() => {
                  const filtrados = trabajos.filter((t) => {
                    const maqId = t.maquina_id || t.maquinaId;
                    if (
                      solapaActiva !== "todas" &&
                      Number(maqId) !== Number(solapaActiva)
                    )
                      return false;
                    return cumpleFiltroFecha(t.fecha);
                  });
                  const totalHa = filtrados.reduce(
                    (sum, t) =>
                      sum +
                      Math.round(
                        Number(t.cantidad_hectareas || t.cantidadHectareas) ||
                          0,
                      ),
                    0,
                  );
                  if (filtrados.length === 0) return null;
                  const colSpanLabel = solapaActiva === "todas" ? 5 : 4;
                  const colSpanValue = solapaActiva === "todas" ? 3 : 3;
                  return (
                    <tfoot style={styles.tfoot}>
                      <tr>
                        <td
                          colSpan={colSpanLabel}
                          style={{ ...styles.td, textAlign: "right" }}
                        >
                          Total Hectáreas:
                        </td>
                        <td colSpan={colSpanValue} style={styles.td}>
                          {totalHa.toLocaleString()} ha
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>

              {/* --- 2. INSUMOS UTILIZADOS (Tono Celeste) --- */}
              <div style={styles.sectionSubTitle("#0369a1")}>
                Insumos Utilizados (Retiros)
              </div>
              <table style={styles.table}>
                <colgroup>
                  {solapaActiva === "todas" ? (
                    <>
                      <col style={{ width: "25%" }} />
                      <col style={{ width: "25%" }} />
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "15%" }} />
                    </>
                  ) : (
                    <>
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "45%" }} />
                      <col style={{ width: "25%" }} />
                    </>
                  )}
                </colgroup>
                <thead>
                  <tr>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>Fecha</th>
                    {solapaActiva === "todas" && (
                      <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                        Máquina
                      </th>
                    )}
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                      Nombre del Insumo
                    </th>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtrados = retirosInsumos.filter((r) => {
                      const maqId = r.maquina_id || r.maquinaId;
                      if (
                        solapaActiva !== "todas" &&
                        Number(maqId) !== Number(solapaActiva)
                      )
                        return false;
                      return cumpleFiltroFecha(r.fecha);
                    });

                    if (filtrados.length === 0) {
                      const colSpanCount = solapaActiva === "todas" ? 4 : 3;
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
                            No hay insumos retirados registrados.
                          </td>
                        </tr>
                      );
                    }

                    return filtrados.map((r) => {
                      const insObj = insumos.find(
                        (i) =>
                          Number(i.id) === Number(r.insumo_id || r.insumoId),
                      );
                      const maqObj = maquinas.find(
                        (m) =>
                          Number(m.id) === Number(r.maquina_id || r.maquinaId),
                      );
                      const cantidadEntera = Math.round(
                        Number(r.cantidad) || 0,
                      );

                      return (
                        <tr key={r.id}>
                          <td style={styles.td}>{formatearFecha(r.fecha)}</td>
                          {solapaActiva === "todas" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {maqObj ? maqObj.nombre : "-"}
                            </td>
                          )}
                          <td style={{ ...styles.td, fontWeight: "600" }}>
                            {insObj ? insObj.nombre : "Insumo N/A"}
                          </td>
                          <td style={styles.td}>{cantidadEntera}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>

              {/* Resumen de totales por tipo de insumo */}
              {(() => {
                const filtrados = retirosInsumos.filter((r) => {
                  const maqId = r.maquina_id || r.maquinaId;
                  if (
                    solapaActiva !== "todas" &&
                    Number(maqId) !== Number(solapaActiva)
                  )
                    return false;
                  return cumpleFiltroFecha(r.fecha);
                });

                if (filtrados.length === 0) return null;

                const agrupados = {};
                filtrados.forEach((r) => {
                  const insObj = insumos.find(
                    (i) => Number(i.id) === Number(r.insumo_id || r.insumoId),
                  );
                  const nombreInsumo = insObj ? insObj.nombre : "Insumo N/A";
                  const cant = Math.round(Number(r.cantidad) || 0);
                  agrupados[nombreInsumo] =
                    (agrupados[nombreInsumo] || 0) + cant;
                });

                return (
                  <div style={styles.resumenTotalesBox}>
                    <b>Totales por Insumo:</b>{" "}
                    {Object.entries(agrupados)
                      .map(
                        ([nombre, total]) =>
                          `${nombre}: ${total.toLocaleString()}`,
                      )
                      .join(" | ")}
                  </div>
                );
              })()}

              {/* --- 3. MANTENIMIENTO (Tono Ámbar/Naranja) --- */}
              <div style={styles.sectionSubTitle("#c2410c")}>
                Mantenimientos y Services
              </div>
              <table style={styles.table}>
                <colgroup>
                  {solapaActiva === "todas" ? (
                    <>
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "25%" }} />
                      <col style={{ width: "25%" }} />
                      <col style={{ width: "12%" }} />
                    </>
                  ) : (
                    <>
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "30%" }} />
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "15%" }} />
                    </>
                  )}
                </colgroup>
                <thead>
                  <tr>
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>Fecha</th>
                    {solapaActiva === "todas" && (
                      <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                        Máquina
                      </th>
                    )}
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                      Tipo de Mantenimiento
                    </th>
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                      Observación
                    </th>
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>Costo</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtrados = mantenimientos.filter((mnt) => {
                      const maqId = mnt.maquina_id || mnt.maquinaId;
                      if (
                        solapaActiva !== "todas" &&
                        Number(maqId) !== Number(solapaActiva)
                      )
                        return false;
                      return cumpleFiltroFecha(mnt.fecha);
                    });

                    if (filtrados.length === 0) {
                      const colSpanCount = solapaActiva === "todas" ? 5 : 4;
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
                            No hay mantenimientos registrados.
                          </td>
                        </tr>
                      );
                    }

                    return filtrados.map((mnt) => {
                      const maqObj = maquinas.find(
                        (m) =>
                          Number(m.id) ===
                          Number(mnt.maquina_id || mnt.maquinaId),
                      );

                      return (
                        <tr key={mnt.id}>
                          <td style={styles.td}>{formatearFecha(mnt.fecha)}</td>
                          {solapaActiva === "todas" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {maqObj ? maqObj.nombre : "-"}
                            </td>
                          )}
                          <td style={{ ...styles.td, fontWeight: "600" }}>
                            {mnt.tipo_mantenimiento ||
                              mnt.tipoMantenimiento ||
                              "-"}
                          </td>
                          <td style={styles.td}>{mnt.observacion || "-"}</td>
                          <td style={styles.td}>
                            {mnt.costo
                              ? `$${Number(mnt.costo).toLocaleString()}`
                              : "$0"}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                {(() => {
                  const filtrados = mantenimientos.filter((mnt) => {
                    const maqId = mnt.maquina_id || mnt.maquinaId;
                    if (
                      solapaActiva !== "todas" &&
                      Number(maqId) !== Number(solapaActiva)
                    )
                      return false;
                    return cumpleFiltroFecha(mnt.fecha);
                  });
                  const totalCosto = filtrados.reduce(
                    (sum, mnt) => sum + (Number(mnt.costo) || 0),
                    0,
                  );
                  if (filtrados.length === 0) return null;
                  const colSpanLabel = solapaActiva === "todas" ? 4 : 3;
                  return (
                    <tfoot style={styles.tfoot}>
                      <tr>
                        <td
                          colSpan={colSpanLabel}
                          style={{ ...styles.td, textAlign: "right" }}
                        >
                          Total Costo:
                        </td>
                        <td style={styles.td}>
                          ${totalCosto.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
