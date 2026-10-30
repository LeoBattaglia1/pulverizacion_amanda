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
  btnNuevoInsumo: {
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
  btnReporteGeneral: {
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
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  tanqueCard: (colorBorde) => ({
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: `3.5px solid ${colorBorde}`,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  }),
  tanqueHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  tanqueNombre: {
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
  tanqueContenedorGrafico: {
    width: "120px",
    height: "190px",
    backgroundColor: "#f1f5f9",
    borderRadius: "16px",
    border: "3px solid #cbd5e1",
    position: "relative",
    overflow: "hidden",
    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1)",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  liquidoTanque: {
    width: "100%",
    transition: "height 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    backgroundImage:
      "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%)",
  },
  reflejoLiquido: {
    position: "absolute",
    top: 0,
    left: "15%",
    width: "25%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    filter: "blur(2px)",
  },
  tapaSuperiorTanque: {
    position: "absolute",
    top: "-6px",
    left: "25%",
    width: "50%",
    height: "6px",
    backgroundColor: "#64748b",
    borderRadius: "3px 3px 0 0",
  },
  infoTotales: {
    textAlign: "center",
    marginBottom: "16px",
  },
  cantidadActualText: {
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "#0f172a",
  },
  capacidadMaxText: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  botonesAccion: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  btnCargarStock: {
    flex: 1,
    padding: "9px",
    background:
      "linear-gradient(to right, #16a34a 50%, rgba(255, 255, 255, 0.9) 50%)",
    backgroundSize: "200% 100%",
    backgroundPosition: "right bottom",
    color: "#166534",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
    transition: "all 0.35s ease-in-out",
  },
  btnUsarStock: {
    flex: 1,
    padding: "9px",
    background:
      "linear-gradient(to right, #dc2626 50%, rgba(255, 255, 255, 0.9) 50%)",
    backgroundSize: "200% 100%",
    backgroundPosition: "right bottom",
    color: "#991b1b",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
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
    maxWidth: "1000px",
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
    minWidth: "130px",
    flex: "1",
  },
  inputGroupDestacado: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "160px",
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginTop: "8px",
    tableLayout: "fixed",
  },
  th: {
    backgroundColor: "#e0f2fe",
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: "2px solid #7dd3fc",
    color: "#0369a1",
    fontWeight: "700",
  },
  td: {
    padding: "10px 12px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    wordBreak: "break-word",
  },
  btnToggleLink: (isLinked) => ({
    background: "none",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "2px 8px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "600",
    backgroundColor: isLinked ? "#eff6ff" : "#f1f5f9",
    color: isLinked ? "#1d4ed8" : "#64748b",
  }),
  sectionHeaderFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
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
  alertaBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    marginBottom: "16px",
    fontWeight: "500",
  },
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

const paletaColoresBarril = [
  "#0284c7",
  "#16a34a",
  "#d97706",
  "#9333ea",
  "#db2777",
  "#0d9488",
  "#4f46e5",
  "#ca8a04",
];

export default function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [retiros, setRetiros] = useState([]);

  const [toasts, setToasts] = useState([]);

  const mostrarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const [modalInsumoAbierto, setModalInsumoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalCargarAbierto, setModalCargarAbierto] = useState(false);
  const [modalUsarAbierto, setModalUsarAbierto] = useState(false);
  const [modalResumenGeneralAbierto, setModalResumenGeneralAbierto] =
    useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

  const [solapaActiva, setSolapaActiva] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todo");
  const [valorFecha, setValorFecha] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [nombreInsumo, setNombreInsumo] = useState("");
  const [cantidadCargar, setCantidadCargar] = useState("");
  const [montoTotal, setMontoTotal] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [cantidadUsar, setCantidadUsar] = useState("");
  const [fechaUso, setFechaUso] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [empleadoId, setEmpleadoId] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [vinculacionActiva, setVinculacionActiva] = useState(true);
  const [errorStock, setErrorStock] = useState("");

  const fetchData = async () => {
    try {
      const [resInsumos, resMaq, resEmp, resAsig, resIng, resRet] =
        await Promise.all([
          api.get("/insumos").catch(() => ({ data: [] })),
          api.get("/maquinas").catch(() => ({ data: [] })),
          api.get("/empleados").catch(() => ({ data: [] })),
          api.get("/empleados-maquinas").catch(() => ({ data: [] })),
          api.get("/insumos/ingresos").catch(() => ({ data: [] })),
          api.get("/insumos/retiros").catch(() => ({ data: [] })),
        ]);
      setInsumos(resInsumos.data);
      setMaquinas(resMaq.data);
      setEmpleados(resEmp.data);
      setAsignaciones(resAsig.data);
      setIngresos(resIng.data);
      setRetiros(resRet.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
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

  const handleEmpleadoChange = (e) => {
    const empId = e.target.value;
    setEmpleadoId(empId);
    if (!empId || !vinculacionActiva) return;
    const relacion = asignaciones.find(
      (a) => String(a.empleado_id || a.empleadoId) === String(empId),
    );
    if (relacion) {
      setMaquinaId(String(relacion.maquina_id || relacion.maquinaId));
    }
  };

  const handleMaquinaChange = (e) => {
    const maqId = e.target.value;
    setMaquinaId(maqId);
    if (!maqId || !vinculacionActiva) return;
    const relacion = asignaciones.find(
      (a) => String(a.maquina_id || a.maquinaId) === String(maqId),
    );
    if (relacion) {
      setEmpleadoId(String(relacion.empleado_id || relacion.empleadoId));
    }
  };

  const handleCrearInsumo = async (e) => {
    e.preventDefault();
    const nombreLimpio = nombreInsumo.trim();

    const existe = insumos.some(
      (i) => i.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase(),
    );
    if (existe) {
      mostrarToast("Ya existe un insumo registrado con ese nombre.", "error");
      return;
    }

    try {
      await api.post("/insumos", { nombre: nombreLimpio });
      setModalInsumoAbierto(false);
      setNombreInsumo("");
      mostrarToast("Insumo creado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al crear insumo:", error);
      mostrarToast("Error al registrar el insumo", "error");
    }
  };

  const handleEditarInsumo = async (e) => {
    e.preventDefault();
    if (!insumoSeleccionado) return;
    const nombreLimpio = nombreInsumo.trim();

    try {
      await api.put(`/insumos/${insumoSeleccionado.id}`, {
        nombre: nombreLimpio,
      });
      setModalEditarAbierto(false);
      setNombreInsumo("");
      setInsumoSeleccionado(null);
      mostrarToast("Insumo actualizado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al editar insumo:", error);
      mostrarToast("Error al actualizar el insumo", "error");
    }
  };

  const handleCargarStock = async (e) => {
    e.preventDefault();
    if (!insumoSeleccionado) return;

    try {
      await api.post("/insumos/ingresos", {
        insumo_id: Number(insumoSeleccionado.id),
        cantidad: Number(cantidadCargar),
        monto_total: montoTotal ? Number(montoTotal) : null,
        fecha: fechaIngreso,
        empleado_id: empleadoId ? Number(empleadoId) : null,
        maquina_id: maquinaId ? Number(maquinaId) : null,
      });

      setModalCargarAbierto(false);
      setCantidadCargar("");
      setMontoTotal("");
      setEmpleadoId("");
      setMaquinaId("");
      mostrarToast("Stock cargado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al registrar ingreso de insumo:", error);
      mostrarToast("Error al registrar el ingreso", "error");
    }
  };

  const handleUsarInsumo = async (e) => {
    e.preventDefault();
    if (!insumoSeleccionado) return;

    const cantidadRetiro = Number(cantidadUsar);
    const stockActual = Number(insumoSeleccionado.stock_actual) || 0;

    if (cantidadRetiro > stockActual) {
      setErrorStock(
        "La cantidad a retirar supera el stock actual disponible (" +
          stockActual +
          ").",
      );
      return;
    }

    try {
      await api.post("/insumos/retiros", {
        insumo_id: Number(insumoSeleccionado.id),
        empleado_id: Number(empleadoId),
        maquina_id: Number(maquinaId),
        cantidad: cantidadRetiro,
        fecha: fechaUso,
      });

      setModalUsarAbierto(false);
      setCantidadUsar("");
      setEmpleadoId("");
      setMaquinaId("");
      setErrorStock("");
      mostrarToast("Uso registrado con éxito");
      fetchData();
    } catch (error) {
      console.error("Error al registrar retiro de insumo:", error);
      mostrarToast("Error al registrar el retiro", "error");
    }
  };

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
            setSolapaActiva("todos");
            setTipoFiltro("todo");
            setModalResumenGeneralAbierto(true);
          }}
          style={styles.btnReporteGeneral}
        >
          📄 Ver Detalle
        </button>
        <button
          onClick={() => {
            setNombreInsumo("");
            setModalInsumoAbierto(true);
          }}
          style={styles.btnNuevoInsumo}
        >
          + Agregar Nuevo Consumo
        </button>
      </div>

      <div style={styles.grid}>
        {insumos.map((i, index) => {
          const colorBordeCard =
            paletaBordesCards[index % paletaBordesCards.length];
          const stockActual = Math.round(Number(i.stock_actual) || 0);

          const esGasoil = i.nombre.toLowerCase().includes("gasoil");
          const capacidadMaxRef = esGasoil ? 1500 : 200;
          const umbralAlerta = esGasoil ? 100 : 20;

          const porcentaje = Math.min(
            Math.round((stockActual / capacidadMaxRef) * 100),
            100,
          );

          let colorLiquido =
            paletaColoresBarril[index % paletaColoresBarril.length];
          if (stockActual <= 0) {
            colorLiquido = "#94a3b8";
          } else if (stockActual <= umbralAlerta) {
            colorLiquido = "#dc2626";
          }

          return (
            <div key={i.id} style={styles.tanqueCard(colorBordeCard)}>
              <div style={styles.tanqueHeader}>
                <div style={styles.tanqueNombre}>{i.nombre}</div>
                <button
                  onClick={() => {
                    setInsumoSeleccionado(i);
                    setNombreInsumo(i.nombre);
                    setModalEditarAbierto(true);
                  }}
                  style={styles.btnEditarLapiz}
                  title="Editar Nombre del Insumo"
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

              {stockActual <= umbralAlerta && stockActual > 0 && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    backgroundColor: "#fee2e2",
                    color: "#991b1b",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    marginBottom: "6px",
                    fontWeight: "700",
                  }}
                >
                  ⚠️ Stock Bajo (≤ {umbralAlerta}L)
                </div>
              )}

              <div style={styles.tanqueContenedorGrafico}>
                <div style={styles.tapaSuperiorTanque}></div>
                <div
                  style={{
                    ...styles.liquidoTanque,
                    height: `${stockActual > 0 ? Math.max(porcentaje, 6) : 0}%`,
                    backgroundColor: colorLiquido,
                  }}
                >
                  <div style={styles.reflejoLiquido}></div>
                </div>
              </div>

              <div style={styles.infoTotales}>
                <div style={styles.cantidadActualText}>
                  {stockActual.toLocaleString()} L
                </div>
                <div style={styles.capacidadMaxText}>
                  Capacidad ref: {capacidadMaxRef} L
                </div>
              </div>

              <div style={styles.botonesAccion}>
                <button
                  onClick={() => {
                    setInsumoSeleccionado(i);
                    setCantidadCargar("");
                    setMontoTotal("");
                    setEmpleadoId("");
                    setMaquinaId("");
                    setModalCargarAbierto(true);
                  }}
                  style={styles.btnCargarStock}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundPosition = "left bottom";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(100, 116, 139, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundPosition = "right bottom";
                    e.currentTarget.style.color = "#166534";
                    e.currentTarget.style.boxShadow =
                      "0 2px 6px rgba(0,0,0,0.03)";
                  }}
                >
                  Reponer
                </button>
                <button
                  onClick={() => {
                    setInsumoSeleccionado(i);
                    setCantidadUsar("");
                    setEmpleadoId("");
                    setMaquinaId("");
                    setErrorStock("");
                    setModalUsarAbierto(true);
                  }}
                  style={styles.btnUsarStock}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundPosition = "left bottom";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(100, 116, 139, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundPosition = "right bottom";
                    e.currentTarget.style.color = "#991b1b";
                    e.currentTarget.style.boxShadow =
                      "0 2px 6px rgba(0,0,0,0.03)";
                  }}
                >
                  Retirar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {modalInsumoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalInsumoAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Nuevo Consumo
            </h3>
            <form onSubmit={handleCrearInsumo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del consumo</label>
                <input
                  type="text"
                  placeholder="Ej: Aceite motor"
                  required
                  value={nombreInsumo}
                  onChange={(e) => setNombreInsumo(e.target.value)}
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
                  onClick={() => setModalInsumoAbierto(false)}
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

      {modalEditarAbierto && insumoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalEditarAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Editar Nombre de Consumo
            </h3>
            <form onSubmit={handleEditarInsumo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nuevo Nombre</label>
                <input
                  type="text"
                  required
                  value={nombreInsumo}
                  onChange={(e) => setNombreInsumo(e.target.value)}
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

      {modalCargarAbierto && insumoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalCargarAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
              Cargar Stock: {insumoSeleccionado.nombre}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Stock actual:{" "}
              <b>{Math.round(Number(insumoSeleccionado.stock_actual) || 0)}</b>
            </p>
            <form onSubmit={handleCargarStock}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Cantidad a Ingresar (Litros/Unidades)
                </label>
                <input
                  type="number"
                  step="1"
                  placeholder="Ej: 200"
                  required
                  value={cantidadCargar}
                  onChange={(e) => setCantidadCargar(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Monto Total Gastado ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 150000"
                  value={montoTotal}
                  onChange={(e) => setMontoTotal(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha</label>
                <input
                  type="date"
                  required
                  value={fechaIngreso}
                  onChange={(e) => setFechaIngreso(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.sectionHeaderFlex, marginTop: "12px" }}>
                <label style={styles.label}>
                  Personal / Responsable de Reposicion (Opcional)
                </label>
                <button
                  type="button"
                  onClick={() => setVinculacionActiva(!vinculacionActiva)}
                  style={styles.btnToggleLink(vinculacionActiva)}
                >
                  {vinculacionActiva
                    ? "🔗 Vinculación Activa"
                    : "🔓 Desvinculado (Libre)"}
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}></label>
                <select
                  value={empleadoId}
                  onChange={handleEmpleadoChange}
                  style={styles.select}
                >
                  <option value=""></option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre || emp.apellido
                        ? `${emp.nombre || ""} ${emp.apellido || ""}`
                        : emp.username}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Máquina</label>
                <select
                  value={maquinaId}
                  onChange={handleMaquinaChange}
                  style={styles.select}
                >
                  <option value="">Seleccionar Máquina...</option>
                  {maquinas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre || m.patente}
                    </option>
                  ))}
                </select>
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
                  onClick={() => setModalCargarAbierto(false)}
                  style={styles.btnModalCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.btnModalSubmit,
                    backgroundColor: "#16a34a",
                  }}
                >
                  Confirmar Reposicion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalUsarAbierto && insumoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalUsarAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
              Registrar Uso: {insumoSeleccionado.nombre}
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Stock actual disponible:{" "}
              <b>{Math.round(Number(insumoSeleccionado.stock_actual) || 0)}</b>
            </p>

            {errorStock && <div style={styles.alertaBox}>{errorStock}</div>}

            <form onSubmit={handleUsarInsumo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad a Retirar</label>
                <input
                  type="number"
                  step="1"
                  placeholder="Ej: 50"
                  required
                  value={cantidadUsar}
                  onChange={(e) => {
                    setCantidadUsar(e.target.value);
                    if (errorStock) setErrorStock("");
                  }}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha</label>
                <input
                  type="date"
                  required
                  value={fechaUso}
                  onChange={(e) => setFechaUso(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.sectionHeaderFlex}>
                <label style={styles.label}>
                  Asignación de Personal y Máquina
                </label>
                <button
                  type="button"
                  onClick={() => setVinculacionActiva(!vinculacionActiva)}
                  style={styles.btnToggleLink(vinculacionActiva)}
                >
                  {vinculacionActiva
                    ? "🔗 Vinculación Activa"
                    : "🔓 Desvinculado (Libre)"}
                </button>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Empleado</label>
                <select
                  value={empleadoId}
                  onChange={handleEmpleadoChange}
                  style={styles.select}
                  required
                >
                  <option value="">Seleccionar Empleado...</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre || emp.apellido
                        ? `${emp.nombre || ""} ${emp.apellido || ""}`
                        : emp.username}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Máquina</label>
                <select
                  value={maquinaId}
                  onChange={handleMaquinaChange}
                  style={styles.select}
                  required
                >
                  <option value="">Seleccionar Máquina...</option>
                  {maquinas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre || m.patente}
                    </option>
                  ))}
                </select>
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
                  onClick={() => setModalUsarAbierto(false)}
                  style={styles.btnModalCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.btnModalSubmit,
                    backgroundColor: "#dc2626",
                  }}
                >
                  Confirmar Retiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalResumenGeneralAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalResumenGeneralAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
              Detalle de Movimientos de Insumos
            </h3>

            <div style={styles.tabsContainer}>
              <button
                onClick={() => setSolapaActiva("todos")}
                style={styles.tabBtn(solapaActiva === "todos")}
              >
                Historial General
              </button>
              {insumos.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setSolapaActiva(i.id)}
                  style={styles.tabBtn(solapaActiva === i.id)}
                >
                  {i.nombre}
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
            </div>

            <div style={{ maxHeight: "380px", overflowY: "auto" }}>
              <table style={styles.table}>
                <colgroup>
                  {solapaActiva === "todos" ? (
                    <>
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "14%" }} />
                      <col style={{ width: "13%" }} />
                      <col style={{ width: "13%" }} />
                    </>
                  ) : (
                    <>
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "16%" }} />
                    </>
                  )}
                </colgroup>
                <thead>
                  <tr>
                    <th style={styles.th}>Fecha</th>
                    {solapaActiva === "todos" && (
                      <th style={styles.th}>Consumos</th>
                    )}
                    <th style={styles.th}>Tipo</th>
                    <th style={styles.th}>Cant.</th>
                    <th style={styles.th}>Monto ($)</th>
                    <th style={styles.th}>Empleado</th>
                    <th style={styles.th}>Máquina</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const ingMapeados = ingresos.pop
                      ? ingresos.map((ing) => {
                          const ins = insumos.find(
                            (i) =>
                              Number(i.id) ===
                              Number(ing.insumo_id || ing.insumoId),
                          );
                          const empIdBusqueda =
                            ing.empleado_id || ing.empleadoId;
                          const maqIdBusqueda = ing.maquina_id || ing.maquinaId;

                          const emp = empleados.find(
                            (e) => Number(e.id) === Number(empIdBusqueda),
                          );
                          const maq = maquinas.find(
                            (m) => Number(m.id) === Number(maqIdBusqueda),
                          );

                          return {
                            ...ing,
                            insumoId: ing.insumo_id || ing.insumoId,
                            insumoNombre: ins ? ins.nombre : "N/A",
                            tipo: "Carga (Ingreso)",
                            montoTotal:
                              ing.monto_total || ing.montoTotal || null,
                            empleadoNombre: emp
                              ? emp.nombre
                                ? `${emp.nombre} ${emp.apellido || ""}`
                                : emp.username
                              : "-",
                            maquinaNombre: maq
                              ? maq.nombre || maq.patente
                              : "-",
                          };
                        })
                      : [];

                    const retMapeados = retiros.pop
                      ? retiros.map((ret) => {
                          const ins = insumos.find(
                            (i) =>
                              Number(i.id) ===
                              Number(ret.insumo_id || ret.insumoId),
                          );
                          const empIdBusqueda =
                            ret.empleado_id || ret.empleadoId;
                          const maqIdBusqueda = ret.maquina_id || ret.maquinaId;

                          const emp = empleados.find(
                            (e) => Number(e.id) === Number(empIdBusqueda),
                          );
                          const maq = maquinas.find(
                            (m) => Number(m.id) === Number(maqIdBusqueda),
                          );

                          return {
                            ...ret,
                            insumoId: ret.insumo_id || ret.insumoId,
                            insumoNombre: ins ? ins.nombre : "N/A",
                            tipo: "Uso (Retiro)",
                            montoTotal: null,
                            empleadoNombre: emp
                              ? emp.nombre
                                ? `${emp.nombre} ${emp.apellido || ""}`
                                : emp.username
                              : "N/A",
                            maquinaNombre: maq
                              ? maq.nombre || maq.patente
                              : "N/A",
                          };
                        })
                      : [];

                    const movimientos = [...ingMapeados, ...retMapeados].sort(
                      (a, b) => new Date(b.fecha) - new Date(a.fecha),
                    );

                    const movimientosFiltrados = movimientos.filter((m) => {
                      if (
                        solapaActiva !== "todos" &&
                        Number(m.insumoId) !== Number(solapaActiva)
                      )
                        return false;
                      return cumpleFiltroFecha(m.fecha);
                    });

                    if (movimientosFiltrados.length === 0) {
                      const colSpanCount = solapaActiva === "todos" ? 7 : 6;
                      return (
                        <tr>
                          <td
                            colSpan={colSpanCount}
                            style={{
                              ...styles.td,
                              textAlign: "center",
                              color: "#64748b",
                              padding: "20px",
                            }}
                          >
                            No hay movimientos registrados para esta selección.
                          </td>
                        </tr>
                      );
                    }

                    return movimientosFiltrados.map((m, idx) => {
                      const cantidadEntera = Math.round(
                        Number(m.cantidad) || 0,
                      );
                      return (
                        <tr key={idx}>
                          <td style={styles.td}>{formatearFecha(m.fecha)}</td>
                          {solapaActiva === "todos" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {m.insumoNombre}
                            </td>
                          )}
                          <td
                            style={{
                              ...styles.td,
                              color: m.tipo.includes("Carga")
                                ? "#16a34a"
                                : "#dc2626",
                              fontWeight: "600",
                            }}
                          >
                            {m.tipo}
                          </td>
                          <td style={styles.td}>{cantidadEntera}</td>
                          <td style={styles.td}>
                            {m.montoTotal
                              ? `$${Number(m.montoTotal).toLocaleString()}`
                              : "-"}
                          </td>
                          <td style={styles.td}>{m.empleadoNombre || "-"}</td>
                          <td style={styles.td}>{m.maquinaNombre || "-"}</td>
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
