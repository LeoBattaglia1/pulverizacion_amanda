import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import empleadoImg from "../assets/empleado.png";

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
  btnPagarCard: {
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
    maxWidth: "1150px",
    width: "95%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  modalConfirmCard: {
    backgroundColor: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    maxWidth: "450px",
    width: "90%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
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
  btnAlertaConfirmar: {
    padding: "10px 18px",
    backgroundColor: "#d97706",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
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
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "16px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "flex-end",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [pagosEmpleados, setPagosEmpleados] = useState([]);
  const [retirosInsumos, setRetirosInsumos] = useState([]);
  const [insumos, setInsumos] = useState([]);
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

  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);

  const [modalAlertaAbierto, setModalAlertaAbierto] = useState(false);
  const [datosReasignacionPendiente, setDatosReasignacionPendiente] =
    useState(null);

  const [nombreCompletoInput, setNombreCompletoInput] = useState("");
  const [telefonoEmpleado, setTelefonoEmpleado] = useState("");
  const [maquinaIdAsignar, setMaquinaIdAsignar] = useState("");

  const [empleadoSeleccionadoId, setEmpleadoSeleccionadoId] = useState("");
  const [montoPago, setMontoPago] = useState("");
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [conceptoPago, setConceptoPago] = useState("");

  const [empleadoAEditar, setEmpleadoAEditar] = useState(null);

  // Filtro de Tiempo con "todo" por defecto
  const [solapaActiva, setSolapaActiva] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todo");
  const [valorFecha, setValorFecha] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [sortFieldTrabajo, setSortFieldTrabajo] = useState("fecha");
  const [sortOrderTrabajo, setSortOrderTrabajo] = useState("asc");

  const fetchData = useCallback(async () => {
    try {
      const [
        resEmp,
        resMaq,
        resAsig,
        resTrab,
        resPagos,
        resRet,
        resIns,
        resLot,
        resCamp,
        resCli,
      ] = await Promise.all([
        api.get("/empleados").catch(() => ({ data: [] })),
        api.get("/maquinas").catch(() => ({ data: [] })),
        api.get("/empleados-maquinas").catch(() => ({ data: [] })),
        api.get("/trabajos").catch(() => ({ data: [] })),
        api.get("/pagos-empleados").catch(() => ({ data: [] })),
        api.get("/insumos/retiros").catch(() => ({ data: [] })),
        api.get("/insumos").catch(() => ({ data: [] })),
        api.get("/lotes").catch(() => ({ data: [] })),
        api.get("/campos").catch(() => ({ data: [] })),
        api.get("/clientes").catch(() => ({ data: [] })),
      ]);
      setEmpleados(resEmp.data);
      setMaquinas(resMaq.data);
      setAsignaciones(resAsig.data);
      setTrabajos(resTrab.data);
      setPagosEmpleados(resPagos.data);
      setRetirosInsumos(resRet.data);
      setInsumos(resIns.data);
      setLotes(resLot.data);
      setCampos(resCamp.data);
      setClientes(resCli.data);
    } catch (error) {
      console.error("Error al cargar datos de empleados:", error);
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

  const ejecutarVinculacionReal = async (
    empleadoId,
    maquinaId,
    idChoferActual,
  ) => {
    if (idChoferActual) {
      await api
        .post("/empleados/desvincular", {
          empleado_id: Number(idChoferActual),
          maquina_id: Number(maquinaId),
        })
        .catch(() => {});
    }
    await api.post("/empleados/vincular", {
      empleado_id: Number(empleadoId),
      maquina_id: Number(maquinaId),
    });
  };

  const gestionarAsignacionMaquina = async (
    empleadoId,
    maquinaId,
    nombreEmpleadoNuevo,
  ) => {
    if (!maquinaId) return true;

    const asignacionExistente = asignaciones.find(
      (a) => Number(a.maquina_id || a.maquinaId) === Number(maquinaId),
    );

    if (asignacionExistente) {
      const idChoferActual =
        asignacionExistente.empleado_id || asignacionExistente.empleadoId;
      const choferActualObj = empleados.find(
        (e) => Number(e.id) === Number(idChoferActual),
      );
      const nombreChoferActual = choferActualObj
        ? choferActualObj.nombre || choferActualObj.username
        : "otro empleado";
      const maquinaObj = maquinas.find(
        (m) => Number(m.id) === Number(maquinaId),
      );
      const nombreMaquina = maquinaObj
        ? maquinaObj.nombre || maquinaObj.patente
        : "esta máquina";

      return new Promise((resolve) => {
        setDatosReasignacionPendiente({
          empleadoId,
          maquinaId,
          idChoferActual,
          mensajeTexto: `Atención: ${nombreChoferActual} ya es el chofer asignado a ${nombreMaquina}. ¿Desea reasignarla a ${nombreEmpleadoNuevo}? El chofer anterior quedará sin máquina.`,
          onConfirmar: async () => {
            await ejecutarVinculacionReal(
              empleadoId,
              maquinaId,
              idChoferActual,
            );
            setModalAlertaAbierto(false);
            resolve(true);
          },
          onCancelar: () => {
            setModalAlertaAbierto(false);
            resolve(false);
          },
        });
        setModalAlertaAbierto(true);
      });
    }

    await api.post("/empleados/vincular", {
      empleado_id: Number(empleadoId),
      maquina_id: Number(maquinaId),
    });
    return true;
  };

  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/empleados", {
        nombre: nombreCompletoInput.trim(),
        telefono: telefonoEmpleado.trim(),
      });
      const nuevoEmpId = res.data.id || res.data.insertId;

      if (maquinaIdAsignar && nuevoEmpId) {
        await gestionarAsignacionMaquina(
          nuevoEmpId,
          maquinaIdAsignar,
          nombreCompletoInput.trim(),
        );
      }

      setModalNuevoAbierto(false);
      setNombreCompletoInput("");
      setTelefonoEmpleado("");
      setMaquinaIdAsignar("");
      mostrarToast("Empleado registrado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      mostrarToast("Error al registrar el empleado", "error");
    }
  };

  const handleEditarEmpleado = async (e) => {
    e.preventDefault();
    if (!empleadoAEditar) return;
    try {
      await api.put(`/empleados/${empleadoAEditar.id}`, {
        nombre: nombreCompletoInput.trim(),
        telefono: telefonoEmpleado.trim(),
      });

      if (maquinaIdAsignar) {
        await gestionarAsignacionMaquina(
          empleadoAEditar.id,
          maquinaIdAsignar,
          nombreCompletoInput.trim(),
        );
      }

      setModalEditarAbierto(false);
      setEmpleadoAEditar(null);
      mostrarToast("Empleado actualizado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      mostrarToast("Error al actualizar el empleado", "error");
    }
  };

  const handleRegistrarPago = async (e) => {
    e.preventDefault();
    if (!empleadoSeleccionadoId || !montoPago) return;

    try {
      await api.post("/pagos-empleados", {
        empleado_id: Number(empleadoSeleccionadoId),
        monto: Number(montoPago),
        fecha: fechaPago || new Date().toISOString().split("T")[0],
        concepto: conceptoPago.trim(),
      });
      setModalPagoAbierto(false);
      setMontoPago("");
      setConceptoPago("");
      mostrarToast("Pago registrado con éxito");
      fetchData();
    } catch (error) {
      console.error("Error al registrar pago al empleado:", error);
      mostrarToast("Error al registrar el pago", "error");
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

  const empleadoActivoObj = empleados.find(
    (e) => Number(e.id) === Number(empleadoSeleccionadoId),
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
            setSolapaActiva("todos");
            setTipoFiltro("todo");
            setModalDetalleAbierto(true);
          }}
          style={styles.btnDetalle}
        >
          📄 Ver Detalle
        </button>
        <button
          onClick={() => {
            setNombreCompletoInput("");
            setTelefonoEmpleado("");
            setMaquinaIdAsignar("");
            setModalNuevoAbierto(true);
          }}
          style={styles.btnNuevo}
        >
          + Agregar Nuevo Empleado
        </button>
      </div>

      <div style={styles.grid}>
        {empleados.map((emp, index) => {
          const colorBordeCard =
            paletaBordesCards[index % paletaBordesCards.length];
          const nombreCompleto = emp.nombre || emp.username || "Sin nombre";

          const relMaq = asignaciones.find(
            (a) => Number(a.empleado_id || a.empleadoId) === Number(emp.id),
          );
          const maqObj = maquinas.find(
            (m) =>
              Number(m.id) === Number(relMaq?.maquina_id || relMaq?.maquinaId),
          );
          const nombreMaquina = maqObj
            ? maqObj.nombre || maqObj.patente
            : "Sin máquina asignada";

          return (
            <div key={emp.id} style={styles.card(colorBordeCard)}>
              <div>
                <div style={styles.cardHeader}>
                  <div style={styles.cardNombre}>{nombreCompleto}</div>
                  <button
                    title="Editar datos"
                    onClick={() => {
                      setEmpleadoAEditar(emp);
                      setNombreCompletoInput(emp.nombre || "");
                      setTelefonoEmpleado(emp.telefono || "");
                      setMaquinaIdAsignar("");
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
                    src={empleadoImg}
                    alt={nombreCompleto}
                    style={styles.imagenEstilizada}
                  />
                </div>

                <div style={styles.infoSeccion}>
                  <div style={styles.infoRow}>
                    <span>
                      <b>Teléfono:</b>
                    </span>
                    <span>{emp.telefono || "Sin teléfono"}</span>
                  </div>
                  <div
                    style={{ borderTop: "1px solid #cbd5e1", margin: "4px 0" }}
                  ></div>
                  <div style={styles.infoRow}>
                    <span>
                      <b>Máquina:</b>
                    </span>
                    <span>{nombreMaquina}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setEmpleadoSeleccionadoId(String(emp.id));
                  setMontoPago("");
                  setFechaPago(new Date().toISOString().split("T")[0]);
                  setConceptoPago("");
                  setModalPagoAbierto(true);
                }}
                style={styles.btnPagarCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundPosition = "left bottom";
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(100, 116, 139, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundPosition = "right bottom";
                  e.currentTarget.style.color = "#334155";
                  e.currentTarget.style.boxShadow =
                    "0 2px 6px rgba(0,0,0,0.03)";
                }}
              >
                + Registrar Pago
              </button>
            </div>
          );
        })}
      </div>

      {modalNuevoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalNuevoAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Nuevo Empleado
            </h3>
            <form onSubmit={handleCrearEmpleado}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre y Apellido</label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  required
                  value={nombreCompletoInput}
                  onChange={(e) => setNombreCompletoInput(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Teléfono</label>
                <input
                  type="text"
                  placeholder="Ej: 2245412345"
                  value={telefonoEmpleado}
                  onChange={(e) => setTelefonoEmpleado(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Máquina a Utilizar (Opcional)
                </label>
                <select
                  value={maquinaIdAsignar}
                  onChange={(e) => setMaquinaIdAsignar(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Sin máquina asignada por ahora...</option>
                  {maquinas.map((m) => {
                    const rel = asignaciones.find(
                      (a) =>
                        Number(a.maquina_id || a.maquinaId) === Number(m.id),
                    );
                    const empAsignado = empleados.find(
                      (emp) =>
                        Number(emp.id) ===
                        Number(rel?.empleado_id || rel?.empleadoId),
                    );
                    const labelChofer = empAsignado
                      ? ` (Chofer actual: ${empAsignado.nombre})`
                      : " (Libre)";
                    return (
                      <option key={m.id} value={m.id}>
                        {m.nombre || m.patente} {labelChofer}
                      </option>
                    );
                  })}
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
                  onClick={() => setModalNuevoAbierto(false)}
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
              Editar Datos de Empleado
            </h3>
            <form onSubmit={handleEditarEmpleado}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre y Apellido</label>
                <input
                  type="text"
                  required
                  value={nombreCompletoInput}
                  onChange={(e) => setNombreCompletoInput(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Teléfono</label>
                <input
                  type="text"
                  value={telefonoEmpleado}
                  onChange={(e) => setTelefonoEmpleado(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Asignar o Cambiar Máquina</label>
                <select
                  value={maquinaIdAsignar}
                  onChange={(e) => setMaquinaIdAsignar(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Mantener / No modificar máquina...</option>
                  {maquinas.map((m) => {
                    const rel = asignaciones.find(
                      (a) =>
                        Number(a.maquina_id || a.maquinaId) === Number(m.id),
                    );
                    const empAsignado = empleados.find(
                      (emp) =>
                        Number(emp.id) ===
                        Number(rel?.empleado_id || rel?.empleadoId),
                    );
                    const labelChofer = empAsignado
                      ? ` (Chofer actual: ${empAsignado.nombre})`
                      : " (Libre)";
                    return (
                      <option key={m.id} value={m.id}>
                        {m.nombre || m.patente} {labelChofer}
                      </option>
                    );
                  })}
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

      {modalAlertaAbierto && datosReasignacionPendiente && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalConfirmCard}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⚠️</div>
            <h3
              style={{
                marginBottom: "12px",
                color: "#1e293b",
                fontSize: "1.1rem",
              }}
            >
              Reasignación de Máquina
            </h3>
            <p
              style={{
                color: "#475569",
                fontSize: "0.9rem",
                lineHeight: "1.5",
                marginBottom: "24px",
              }}
            >
              {datosReasignacionPendiente.mensajeTexto}
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: "12px" }}
            >
              <button
                onClick={datosReasignacionPendiente.onCancelar}
                style={styles.btnModalCancel}
              >
                Cancelar
              </button>
              <button
                onClick={datosReasignacionPendiente.onConfirmar}
                style={styles.btnAlertaConfirmar}
              >
                Sí, Reasignar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalPagoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalPagoAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Registrar Pago a:{" "}
              <span style={{ color: "#475569" }}>
                {empleadoActivoObj ? empleadoActivoObj.nombre : ""}
              </span>
            </h3>
            <form onSubmit={handleRegistrarPago}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Monto ($)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: 50000"
                  required
                  value={montoPago}
                  onChange={(e) => setMontoPago(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Fecha</label>
                <input
                  type="date"
                  required
                  value={fechaPago}
                  onChange={(e) => setFechaPago(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Concepto</label>
                <input
                  type="text"
                  placeholder="Ej: Adelanto quincena..."
                  value={conceptoPago}
                  onChange={(e) => setConceptoPago(e.target.value)}
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
                  onClick={() => setModalPagoAbierto(false)}
                  style={styles.btnModalCancel}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnModalSubmit}>
                  Guardar Pago
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
              Detalle de Actividad y Pagos de Empleados
            </h3>

            <div style={styles.tabsContainer}>
              <button
                onClick={() => setSolapaActiva("todos")}
                style={styles.tabBtn(solapaActiva === "todos")}
              >
                Todos los Empleados
              </button>
              {empleados.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => setSolapaActiva(emp.id)}
                  style={styles.tabBtn(solapaActiva === emp.id)}
                >
                  {emp.nombre}
                </button>
              ))}
            </div>

            {/* Filtro de Período Modernizado */}
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

            <div
              style={{
                maxHeight: "480px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              <div style={styles.sectionSubTitle("#166534")}>Pagos</div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>Fecha</th>
                    {solapaActiva === "todos" && (
                      <th style={styles.thStatic("#dcfce7", "#86efac")}>
                        Empleado
                      </th>
                    )}
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>
                      Concepto
                    </th>
                    <th style={styles.thStatic("#dcfce7", "#86efac")}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtrados = pagosEmpleados.filter((p) => {
                      const empId = p.empleado_id || p.empleadoId;
                      if (
                        solapaActiva !== "todos" &&
                        Number(empId) !== Number(solapaActiva)
                      )
                        return false;
                      return cumpleFiltroFecha(p.fecha);
                    });

                    if (filtrados.length === 0) {
                      const colSpanCount = solapaActiva === "todos" ? 4 : 3;
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
                            No hay pagos registrados.
                          </td>
                        </tr>
                      );
                    }

                    return filtrados.map((p) => {
                      const empObj = empleados.find(
                        (e) =>
                          Number(e.id) ===
                          Number(p.empleado_id || p.empleadoId),
                      );

                      return (
                        <tr key={p.id}>
                          <td style={styles.td}>{formatearFecha(p.fecha)}</td>
                          {solapaActiva === "todos" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {empObj ? empObj.nombre : "N/A"}
                            </td>
                          )}
                          <td style={styles.td}>{p.concepto || "-"}</td>
                          <td
                            style={{
                              ...styles.td,
                              fontWeight: "600",
                              color: "#166534",
                            }}
                          >
                            ${Number(p.monto || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                {(() => {
                  const filtrados = pagosEmpleados.filter((p) => {
                    const empId = p.empleado_id || p.empleadoId;
                    if (
                      solapaActiva !== "todos" &&
                      Number(empId) !== Number(solapaActiva)
                    )
                      return false;
                    return cumpleFiltroFecha(p.fecha);
                  });
                  const totalMonto = filtrados.reduce(
                    (sum, p) => sum + (Number(p.monto) || 0),
                    0,
                  );
                  if (filtrados.length === 0) return null;
                  const colSpanLabel = solapaActiva === "todos" ? 3 : 2;
                  return (
                    <tfoot style={styles.tfoot}>
                      <tr>
                        <td
                          colSpan={colSpanLabel}
                          style={{ ...styles.td, textAlign: "right" }}
                        >
                          Total Monto:
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontWeight: "700",
                            color: "#166534",
                          }}
                        >
                          ${totalMonto.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>

              <div style={styles.sectionSubTitle("#0369a1")}>
                Trabajos Realizados
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th
                      style={styles.th("#e0f2fe", "#7dd3fc")}
                      onClick={() => handleSortTrabajo("fecha")}
                    >
                      Fecha{" "}
                      {sortFieldTrabajo === "fecha"
                        ? sortOrderTrabajo === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    {solapaActiva === "todos" && (
                      <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                        Empleado
                      </th>
                    )}
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                      Cliente
                    </th>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>Campo</th>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>Lote</th>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                      Cultivo
                    </th>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                      Tratamiento
                    </th>
                    <th style={styles.thStatic("#e0f2fe", "#7dd3fc")}>
                      Hectáreas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtrados = trabajos.filter((t) => {
                      const empId = t.empleado_id || t.empleadoId;
                      if (
                        solapaActiva !== "todos" &&
                        Number(empId) !== Number(solapaActiva)
                      )
                        return false;
                      return cumpleFiltroFecha(t.fecha);
                    });

                    if (filtrados.length === 0) {
                      const colSpanCount = solapaActiva === "todos" ? 8 : 7;
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
                      let valA = a.fecha || "";
                      let valB = b.fecha || "";
                      if (valA < valB)
                        return sortOrderTrabajo === "asc" ? -1 : 1;
                      if (valA > valB)
                        return sortOrderTrabajo === "asc" ? 1 : -1;
                      return 0;
                    });

                    return ordenados.map((t) => {
                      const empObj = empleados.find(
                        (e) =>
                          Number(e.id) ===
                          Number(t.empleado_id || t.empleadoId),
                      );
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

                      return (
                        <tr key={t.id}>
                          <td style={styles.td}>{formatearFecha(t.fecha)}</td>
                          {solapaActiva === "todos" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {empObj ? empObj.nombre : "N/A"}
                            </td>
                          )}
                          <td style={styles.td}>
                            {clienteObj ? clienteObj.nombre : "-"}
                          </td>
                          <td style={styles.td}>
                            {campoObj ? campoObj.nombre : "-"}
                          </td>
                          <td style={styles.td}>
                            {loteObj ? loteObj.numero_lote : "-"}
                          </td>
                          <td style={styles.td}>
                            {t.tipo_cultivo || t.tipoCultivo || "-"}
                          </td>
                          <td style={styles.td}>{t.tratamiento || "-"}</td>
                          <td style={styles.td}>
                            {Math.round(
                              Number(
                                t.cantidad_hectareas || t.cantidadHectareas,
                              ) || 0,
                            )}{" "}
                            ha
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                {(() => {
                  const filtrados = trabajos.filter((t) => {
                    const empId = t.empleado_id || t.empleadoId;
                    if (
                      solapaActiva !== "todos" &&
                      Number(empId) !== Number(solapaActiva)
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
                  const colSpanLabel = solapaActiva === "todos" ? 7 : 6;
                  return (
                    <tfoot style={styles.tfoot}>
                      <tr>
                        <td
                          colSpan={colSpanLabel}
                          style={{ ...styles.td, textAlign: "right" }}
                        >
                          Total Hectáreas:
                        </td>
                        <td style={styles.td}>{totalHa.toLocaleString()} ha</td>
                      </tr>
                    </tfoot>
                  );
                })()}
              </table>

              <div style={styles.sectionSubTitle("#c2410c")}>
                Insumos Retirados
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>Fecha</th>
                    {solapaActiva === "todos" && (
                      <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                        Empleado
                      </th>
                    )}
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                      Máquina
                    </th>
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                      Insumo
                    </th>
                    <th style={styles.thStatic("#ffedd5", "#fdba74")}>
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtrados = retirosInsumos.filter((r) => {
                      const empId = r.empleado_id || r.empleadoId;
                      if (
                        solapaActiva !== "todos" &&
                        Number(empId) !== Number(solapaActiva)
                      )
                        return false;
                      return cumpleFiltroFecha(r.fecha);
                    });

                    if (filtrados.length === 0) {
                      const colSpanCount = solapaActiva === "todos" ? 5 : 4;
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
                            No hay retiros registrados.
                          </td>
                        </tr>
                      );
                    }

                    return filtrados.map((r) => {
                      const empObj = empleados.find(
                        (e) =>
                          Number(e.id) ===
                          Number(r.empleado_id || r.empleadoId),
                      );
                      const maqObj = maquinas.find(
                        (m) =>
                          Number(m.id) === Number(r.maquina_id || r.maquinaId),
                      );
                      const insObj = insumos.find(
                        (i) =>
                          Number(i.id) === Number(r.insumo_id || r.insumoId),
                      );

                      return (
                        <tr key={r.id}>
                          <td style={styles.td}>{formatearFecha(r.fecha)}</td>
                          {solapaActiva === "todos" && (
                            <td style={{ ...styles.td, fontWeight: "600" }}>
                              {empObj ? empObj.nombre : "N/A"}
                            </td>
                          )}
                          <td style={styles.td}>
                            {maqObj ? maqObj.nombre : "-"}
                          </td>
                          <td style={styles.td}>
                            {insObj ? insObj.nombre : "N/A"}
                          </td>
                          <td style={styles.td}>
                            {Math.round(Number(r.cantidad) || 0)}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>

              {(() => {
                const filtrados = retirosInsumos.filter((r) => {
                  const empId = r.empleado_id || r.empleadoId;
                  if (
                    solapaActiva !== "todos" &&
                    Number(empId) !== Number(solapaActiva)
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
                    <b>Totales de Insumos Retirados:</b>{" "}
                    {Object.entries(agrupados)
                      .map(
                        ([nombre, total]) =>
                          `${nombre}: ${total.toLocaleString()}`,
                      )
                      .join(" | ")}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
