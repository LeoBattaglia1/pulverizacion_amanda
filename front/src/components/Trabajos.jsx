import { useState, useEffect } from "react";
import api from "../services/api";

const styles = {
  container: {
    padding: "16px 24px",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  mainTabsHeader: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "12px",
  },
  tabButton: (activo) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    border: "none",
    backgroundColor: activo ? "#2563eb" : "#f1f5f9",
    color: activo ? "#ffffff" : "#475569",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  }),
  dotIndicator: {
    width: "10px",
    height: "10px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    display: "inline-block",
    boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.2)",
  },
  wizardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "16px",
  },
  stepIndicatorContainer: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  stepBadge: (activo, completado) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "700",
    backgroundColor: activo ? "#2563eb" : completado ? "#dcfce7" : "#f1f5f9",
    color: activo ? "#ffffff" : completado ? "#15803d" : "#64748b",
    border: `1px solid ${activo ? "#2563eb" : completado ? "#86efac" : "#cbd5e1"}`,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }),
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  btnToggleLink: (isLinked) => ({
    background: "none",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "600",
    backgroundColor: isLinked ? "#eff6ff" : "#f1f5f9",
    color: isLinked ? "#1d4ed8" : "#64748b",
  }),
  bloquesPrincipalesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  bloqueCard: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  bloqueHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    borderBottom: "1px solid #cbd5e1",
    paddingBottom: "6px",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  inputDestacado: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #f59e0b",
    fontSize: "0.85rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fffbeb",
  },
  select: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  lotesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: "10px",
    marginBottom: "16px",
  },
  loteChip: (seleccionado) => ({
    padding: "12px 14px",
    borderRadius: "8px",
    border: `2px solid ${seleccionado ? "#2563eb" : "#cbd5e1"}`,
    backgroundColor: seleccionado ? "#eff6ff" : "#ffffff",
    color: seleccionado ? "#1d4ed8" : "#334155",
    fontWeight: seleccionado ? "700" : "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.15s ease",
    boxShadow: seleccionado ? "0 2px 4px rgba(37,99,235,0.15)" : "none",
  }),
  configContainer: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  },
  configCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginTop: "12px",
    marginBottom: "16px",
  },
  th: {
    backgroundColor: "#e0f2fe",
    padding: "10px",
    textAlign: "left",
    color: "#0369a1",
    fontWeight: "700",
    borderBottom: "2px solid #7dd3fc",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    verticalAlign: "middle",
  },
  totalesBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px 20px",
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    alignItems: "center",
  },
  totalItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  totalLabel: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#64748b",
  },
  totalValue: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#0f172a",
  },
  totalDestacado: {
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "#166534",
  },
  btnNuevoLoteContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    alignItems: "center",
  },
  actionsRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  btnAtras: {
    padding: "10px 20px",
    backgroundColor: "#64748b",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  btnSiguiente: (isDisabled) => ({
    padding: "10px 24px",
    backgroundColor: isDisabled ? "#cbd5e1" : "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontSize: "0.9rem",
    fontWeight: "700",
    transition: "all 0.2s ease",
  }),
  btnSubmit: (isDisabled) => ({
    padding: "12px 28px",
    background: isDisabled
      ? "#94a3b8"
      : "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    boxShadow: isDisabled ? "none" : "0 4px 15px rgba(16, 185, 129, 0.4)",
    transition: "all 0.25s ease",
  }),
  btnLiquidar: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  emptyCard: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
  },
  toastAlert: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    zIndex: 2000,
    fontSize: "0.9rem",
    fontWeight: "600",
    borderLeft: "4px solid #10b981",
  },
};

export default function Trabajos() {
  const [vistaTab, setVistaTab] = useState("nuevo"); // "nuevo" | "pendiente"
  const [trabajosPendientes, setTrabajosPendientes] = useState([]);
  const [trabajoALiquidar, setTrabajoALiquidar] = useState(null);

  const [pasoActual, setPasoActual] = useState(1);

  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  // Paso 1: Encabezado
  const [fechaTrabajo, setFechaTrabajo] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [empleadoId, setEmpleadoId] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [vinculacionActiva, setVinculacionActiva] = useState(true);
  const [clienteId, setClienteId] = useState("");
  const [campoId, setCampoId] = useState("");

  // Paso 2: Lotes y su configuración
  const [lotesSeleccionadosData, setLotesSeleccionadosData] = useState({});
  const [nuevoLoteNombre, setNuevoLoteNombre] = useState("");

  // Paso 3: Precios por lote
  const [preciosLote, setPreciosLote] = useState({});

  // Control de interfaz y servidor
  const [guardando, setGuardando] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    cargarDatosIniciales();
    cargarPendientes();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [resCli, resCam, resLot, resEmp, resMaq, resAsig] =
        await Promise.all([
          api.get("/clientes").catch(() => ({ data: [] })),
          api.get("/campos").catch(() => ({ data: [] })),
          api.get("/lotes").catch(() => ({ data: [] })),
          api.get("/empleados").catch(() => ({ data: [] })),
          api.get("/maquinas").catch(() => ({ data: [] })),
          api.get("/empleados-maquinas").catch(() => ({ data: [] })),
        ]);
      setClientes(resCli.data);
      setCampos(resCam.data);
      setLotes(resLot.data);
      setEmpleados(resEmp.data);
      setMaquinas(resMaq.data);
      setAsignaciones(resAsig.data);
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  };

  const cargarPendientes = async () => {
    try {
      const res = await api.get("/trabajos/pendientes");
      setTrabajosPendientes(res.data);
    } catch (error) {
      console.error("Error al cargar trabajos pendientes:", error);
    }
  };

  const handleLiquidarPendiente = (item) => {
    setTrabajoALiquidar(item);
    // Precargamos los datos en los estados del formulario para ir directo al paso 3
    setFechaTrabajo(
      item.fecha
        ? item.fecha.split("T")[0]
        : new Date().toISOString().split("T")[0],
    );
    setEmpleadoId(String(item.empleado_id));
    setMaquinaId(String(item.maquina_id));

    // Asignamos el lote único cargado por el empleado
    setLotesSeleccionadosData({
      [item.lote_id]: {
        hectareas: item.cantidad_hectareas,
        tratamiento: item.tratamiento,
        tratamientoOtro: "",
        tipoCultivo: item.tipo_cultivo,
        tipoCultivoOtro: "",
      },
    });

    setPreciosLote({});
    setVistaTab("nuevo");
    setPasoActual(3); // Salta directo a la carga de precios
  };

  const handleCampoChange = (e) => {
    const nuevoCampoId = e.target.value;
    setCampoId(nuevoCampoId);
    setLotesSeleccionadosData({});
    setPreciosLote({});
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

  const toggleSeleccionLote = (loteId) => {
    setLotesSeleccionadosData((prev) => {
      const yaSeleccionado = !!prev[loteId];
      if (yaSeleccionado) {
        const copia = { ...prev };
        delete copia[loteId];
        return copia;
      } else {
        const lotesAnteriores = Object.values(prev);
        const ultimoLote = lotesAnteriores[lotesAnteriores.length - 1] || {};

        return {
          ...prev,
          [loteId]: {
            hectareas: "",
            tratamiento: ultimoLote.tratamiento || "",
            tratamientoOtro: ultimoLote.tratamientoOtro || "",
            tipoCultivo: ultimoLote.tipoCultivo || "",
            tipoCultivoOtro: ultimoLote.tipoCultivoOtro || "",
          },
        };
      }
    });
  };

  const handleActualizarLoteData = (loteIdTarget, campo, valor) => {
    setLotesSeleccionadosData((prev) => {
      const keys = Object.keys(prev);
      const targetIndex = keys.indexOf(String(loteIdTarget));

      if (targetIndex === -1) return prev;

      const actualizado = { ...prev };
      const esCascada =
        campo === "tratamiento" ||
        campo === "tratamientoOtro" ||
        campo === "tipoCultivo" ||
        campo === "tipoCultivoOtro";

      if (esCascada) {
        for (let i = targetIndex; i < keys.length; i++) {
          const k = keys[i];
          actualizado[k] = {
            ...actualizado[k],
            [campo]: valor,
          };
          if (campo === "tratamiento" && valor !== "otro") {
            actualizado[k].tratamientoOtro = "";
          }
          if (campo === "tipoCultivo" && valor !== "otro") {
            actualizado[k].tipoCultivoOtro = "";
          }
        }
      } else {
        actualizado[loteIdTarget] = {
          ...actualizado[loteIdTarget],
          [campo]: valor,
        };
      }

      return actualizado;
    });
  };

  const agregarNuevoLoteDirecto = async () => {
    if (!nuevoLoteNombre.trim() || !campoId) return;

    try {
      const res = await api.post("/lotes", {
        campo_id: Number(campoId),
        numero_lote: nuevoLoteNombre.trim(),
      });

      const nuevoLoteObj = {
        id: res.data.id || Date.now(),
        campo_id: Number(campoId),
        numero_lote: nuevoLoteNombre.trim(),
      };

      setLotes((prev) => [...prev, nuevoLoteObj]);

      const lotesAnteriores = Object.values(lotesSeleccionadosData);
      const ultimoLote = lotesAnteriores[lotesAnteriores.length - 1] || {};

      setLotesSeleccionadosData((prev) => ({
        ...prev,
        [nuevoLoteObj.id]: {
          hectareas: "",
          tratamiento: ultimoLote.tratamiento || "",
          tratamientoOtro: ultimoLote.tratamientoOtro || "",
          tipoCultivo: ultimoLote.tipoCultivo || "",
          tipoCultivoOtro: ultimoLote.tipoCultivoOtro || "",
        },
      }));

      setNuevoLoteNombre("");
    } catch (error) {
      console.error("Error al crear nuevo lote:", error);
      alert("No se pudo agregar el nuevo lote.");
    }
  };

  const handlePrecioChange = (loteIdTarget, valor) => {
    setPreciosLote((prev) => {
      const keys = Object.keys(lotesSeleccionadosData);
      const targetIndex = keys.indexOf(String(loteIdTarget));

      if (targetIndex === -1) return prev;

      const actualizado = { ...prev };
      for (let i = targetIndex; i < keys.length; i++) {
        const k = keys[i];
        actualizado[k] = valor;
      }
      return actualizado;
    });
  };

  const paso1Valido = Boolean(
    fechaTrabajo && empleadoId && maquinaId && clienteId && campoId,
  );

  const lotesActivosArray = Object.entries(lotesSeleccionadosData);

  const paso2Valido =
    lotesActivosArray.length > 0 &&
    lotesActivosArray.every(
      ([, data]) =>
        Number(data.hectareas) > 0 &&
        (data.tratamiento !== "otro"
          ? data.tratamiento
          : data.tratamientoOtro) &&
        (data.tipoCultivo !== "otro" ? data.tipoCultivo : data.tipoCultivoOtro),
    );

  const paso3Valido =
    paso2Valido &&
    lotesActivosArray.every(
      ([loteIdStr]) => Number(preciosLote[loteIdStr]) > 0,
    );

  const totalHectareasRealizadas = lotesActivosArray.reduce(
    (sum, [, data]) => sum + (Number(data.hectareas) || 0),
    0,
  );

  const subtotal = lotesActivosArray.reduce((sum, [loteIdStr, data]) => {
    const ha = Number(data.hectareas) || 0;
    const precio = Number(preciosLote[loteIdStr]) || 0;
    return sum + ha * precio;
  }, 0);

  const iva = subtotal * 0.105;
  const total = subtotal + iva;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paso3Valido) {
      alert("Por favor complete todos los precios por hectárea adecuadamente.");
      return;
    }

    setGuardando(true);

    try {
      for (const [loteIdStr, data] of lotesActivosArray) {
        const loteIdNum = Number(loteIdStr);
        const haRealizadas = Number(data.hectareas) || 0;
        const precioLote = Number(preciosLote[loteIdStr]) || 0;
        const subtotalLote = haRealizadas * precioLote;
        const ivaLote = subtotalLote * 0.105;
        const totalLote = subtotalLote + ivaLote;

        let trabajoId = trabajoALiquidar ? trabajoALiquidar.id : null;

        // Si es un trabajo completamente nuevo creado por el jefe, hacemos el POST a trabajos
        if (!trabajoId) {
          const tratamientoFinal =
            data.tratamiento === "otro"
              ? data.tratamientoOtro
              : data.tratamiento;
          const cultivoFinal =
            data.tipoCultivo === "otro"
              ? data.tipoCultivoOtro
              : data.tipoCultivo;

          const datosTrabajo = {
            lote_id: loteIdNum,
            maquina_id: Number(maquinaId),
            empleado_id: Number(empleadoId),
            cantidad_hectareas: haRealizadas,
            tratamiento: tratamientoFinal || "General",
            tipo_cultivo: cultivoFinal || "General",
            fecha: fechaTrabajo,
          };

          const resTrabajo = await api.post("/trabajos", datosTrabajo);
          trabajoId = resTrabajo.data.id || resTrabajo.data.insertId;
        }

        // Siempre registramos el pago asociado (esto liquida el pendiente si venía del campo)
        if (trabajoId) {
          await api.post("/pagos-clientes", {
            trabajo_id: Number(trabajoId),
            hectareas_pagadas: haRealizadas,
            precio_por_hectarea: precioLote,
            subtotal: subtotalLote,
            iva: ivaLote,
            total: totalLote,
            fecha: fechaTrabajo,
          });
        }
      }

      setMostrarAlerta(true);
      setTimeout(() => {
        setMostrarAlerta(false);
        setGuardando(false);
      }, 3000);

      // Limpiar y recargar
      setTrabajoALiquidar(null);
      setPasoActual(1);
      setClienteId("");
      setCampoId("");
      setLotesSeleccionadosData({});
      setEmpleadoId("");
      setMaquinaId("");
      setPreciosLote({});
      cargarPendientes();
    } catch (error) {
      console.error("Error al registrar liquidación:", error);
      alert("Hubo un error al registrar la liquidación.");
      setGuardando(false);
    }
  };

  const lotesDelCampoActual = lotes.filter(
    (l) => Number(l.campo_id) === Number(campoId),
  );

  return (
    <div style={styles.container}>
      {/* PESTAÑAS PRINCIPALES: NUEVO Y PENDIENTE */}
      <div style={styles.mainTabsHeader}>
        <button
          onClick={() => {
            setTrabajoALiquidar(null);
            setVistaTab("nuevo");
            setPasoActual(1);
          }}
          style={styles.tabButton(vistaTab === "nuevo")}
        >
          ➕ Nuevo / Cargar
        </button>

        <button
          onClick={() => {
            setVistaTab("pendiente");
            cargarPendientes();
          }}
          style={styles.tabButton(vistaTab === "pendiente")}
        >
          ⏳ Pendientes de Liquidación
          {trabajosPendientes.length > 0 && (
            <span
              style={styles.dotIndicator}
              title="Hay trabajos pendientes"
            ></span>
          )}
        </button>
      </div>

      <div style={styles.card}>
        {/* VISTA DE TRABAJOS PENDIENTES */}
        {vistaTab === "pendiente" ? (
          <div>
            <h3 style={{ ...styles.sectionTitle, marginBottom: "16px" }}>
              Trabajos enviados desde el campo (Pendientes de Liquidación)
            </h3>

            {trabajosPendientes.length === 0 ? (
              <div style={styles.emptyCard}>
                <p style={{ fontSize: "1.1rem", margin: 0 }}>
                  ✅ No hay trabajos pendientes. ¡Todo al día!
                </p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Fecha</th>
                      <th style={styles.th}>Cliente / Campo</th>
                      <th style={styles.th}>Lote</th>
                      <th style={styles.th}>Hectáreas</th>
                      <th style={styles.th}>Tratamiento / Cultivo</th>
                      <th style={styles.th}>Operario</th>
                      <th style={styles.th}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trabajosPendientes.map((item) => (
                      <tr key={item.id}>
                        <td style={styles.td}>
                          {item.fecha ? item.fecha.split("T")[0] : "-"}
                        </td>
                        <td style={{ ...styles.td, fontWeight: "700" }}>
                          {item.cliente_nombre || "Cliente"} -{" "}
                          {item.campo_nombre}
                        </td>
                        <td style={styles.td}>
                          Lote {item.numero_lote || item.lote_id}
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            color: "#1d4ed8",
                            fontWeight: "700",
                          }}
                        >
                          {item.cantidad_hectareas} ha
                        </td>
                        <td style={styles.td}>
                          {item.tratamiento} / {item.tipo_cultivo}
                        </td>
                        <td style={styles.td}>
                          {item.empleado_nombre
                            ? `${item.empleado_nombre} ${item.empleado_apellido || ""}`
                            : "Operario"}
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleLiquidarPendiente(item)}
                            style={styles.btnLiquidar}
                          >
                            💲 Liquidar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* VISTA DE NUEVO / FORMULARIO EN PASOS */
          <div>
            {/* NAVEGADOR DE PASOS */}
            <div style={styles.wizardHeader}>
              <div style={styles.stepIndicatorContainer}>
                <div style={styles.stepBadge(pasoActual === 1, pasoActual > 1)}>
                  <span>1</span> Datos Principales
                </div>
                <span style={{ color: "#cbd5e1" }}>➔</span>
                <div style={styles.stepBadge(pasoActual === 2, pasoActual > 2)}>
                  <span>2</span> Lotes
                </div>
                <span style={{ color: "#cbd5e1" }}>➔</span>
                <div style={styles.stepBadge(pasoActual === 3, false)}>
                  <span>3</span> Precios y Resumen
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* PÁGINA 1: DATOS PRINCIPALES */}
              {pasoActual === 1 && (
                <div>
                  <h3 style={{ ...styles.sectionTitle, marginBottom: "16px" }}>
                    Paso 1: Datos Principales de Ubicación y Personal
                  </h3>
                  <div style={styles.bloquesPrincipalesGrid}>
                    {/* FECHA */}
                    <div style={styles.bloqueCard}>
                      <div style={styles.bloqueHeader}>
                        <span>📅 Fecha</span>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Fecha del Trabajo *</label>
                        <input
                          type="date"
                          value={fechaTrabajo}
                          onChange={(e) => setFechaTrabajo(e.target.value)}
                          style={styles.input}
                          required
                        />
                      </div>
                    </div>

                    {/* PERSONAL / EQUIPO */}
                    <div style={styles.bloqueCard}>
                      <div style={styles.bloqueHeader}>
                        <span>🚜 Personal / Equipo</span>
                        <button
                          type="button"
                          onClick={() =>
                            setVinculacionActiva(!vinculacionActiva)
                          }
                          style={styles.btnToggleLink(vinculacionActiva)}
                        >
                          {vinculacionActiva ? "🔗 Vinculado" : "🔓 Libre"}
                        </button>
                      </div>
                      <div style={styles.gridRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Empleado *</label>
                          <select
                            value={empleadoId}
                            onChange={handleEmpleadoChange}
                            style={styles.select}
                            required
                          >
                            <option value="">Seleccionar...</option>
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
                          <label style={styles.label}>Máquina *</label>
                          <select
                            value={maquinaId}
                            onChange={handleMaquinaChange}
                            style={styles.select}
                            required
                          >
                            <option value="">Seleccionar...</option>
                            {maquinas.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.nombre || m.patente}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* UBICACIÓN */}
                    <div style={styles.bloqueCard}>
                      <div style={styles.bloqueHeader}>
                        <span>🏡 Ubicación</span>
                      </div>
                      <div style={styles.gridRow}>
                        <div style={styles.formGroup}>
                          <label style={styles.label}>Cliente *</label>
                          <select
                            value={clienteId}
                            onChange={(e) => {
                              setClienteId(e.target.value);
                              setCampoId("");
                              setLotesSeleccionadosData({});
                            }}
                            style={styles.select}
                            required
                          >
                            <option value="">Seleccionar...</option>
                            {clientes.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nombre}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div style={styles.formGroup}>
                          <label style={styles.label}>Campo *</label>
                          <select
                            value={campoId}
                            onChange={handleCampoChange}
                            style={styles.select}
                            required
                            disabled={!clienteId}
                          >
                            <option value="">Seleccionar...</option>
                            {campos
                              .filter(
                                (c) =>
                                  !clienteId ||
                                  Number(c.cliente_id) === Number(clienteId),
                              )
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.nombre}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ ...styles.actionsRow, justifyContent: "flex-end" }}
                  >
                    <button
                      type="button"
                      onClick={() => setPasoActual(2)}
                      disabled={!paso1Valido}
                      style={styles.btnSiguiente(!paso1Valido)}
                    >
                      Siguiente ➔
                    </button>
                  </div>
                </div>
              )}

              {/* PÁGINA 2: SELECCIÓN Y CONFIGURACIÓN DE LOTES */}
              {pasoActual === 2 && (
                <div>
                  <h3 style={{ ...styles.sectionTitle, marginBottom: "16px" }}>
                    Paso 2: Seleccionar Lotes y Cargar Datos
                  </h3>

                  <div style={styles.lotesGrid}>
                    {lotesDelCampoActual.map((lote) => {
                      const seleccionado = !!lotesSeleccionadosData[lote.id];
                      return (
                        <div
                          key={lote.id}
                          onClick={() => toggleSeleccionLote(lote.id)}
                          style={styles.loteChip(seleccionado)}
                        >
                          Lote {lote.numero_lote}
                        </div>
                      );
                    })}
                  </div>

                  <div style={styles.btnNuevoLoteContainer}>
                    <input
                      type="text"
                      placeholder="Nombre o Nº de nuevo lote..."
                      value={nuevoLoteNombre}
                      onChange={(e) => setNuevoLoteNombre(e.target.value)}
                      style={{ ...styles.input, maxWidth: "220px" }}
                    />
                    <button
                      type="button"
                      onClick={agregarNuevoLoteDirecto}
                      style={{
                        padding: "8px 14px",
                        backgroundColor: "#0284c7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      + Agregar Nuevo Lote
                    </button>
                  </div>

                  {lotesActivosArray.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h4
                        style={{
                          fontSize: "0.85rem",
                          color: "#475569",
                          marginBottom: "10px",
                          textTransform: "uppercase",
                        }}
                      >
                        Configurar Lotes Seleccionados (
                        {lotesActivosArray.length})
                      </h4>
                      <div style={styles.configContainer}>
                        {lotesActivosArray.map(([loteIdStr, datos]) => {
                          const loteObj = lotes.find(
                            (l) => Number(l.id) === Number(loteIdStr),
                          );
                          return (
                            <div key={loteIdStr} style={styles.configCard}>
                              <div
                                style={{
                                  fontWeight: "700",
                                  color: "#1e293b",
                                  marginBottom: "8px",
                                }}
                              >
                                Lote {loteObj?.numero_lote || loteIdStr}
                              </div>
                              <div style={styles.gridRow}>
                                <div style={styles.formGroup}>
                                  <label style={styles.label}>
                                    Cantidad Hectáreas *
                                  </label>
                                  <input
                                    type="number"
                                    step="any"
                                    value={datos.hectareas}
                                    onChange={(e) =>
                                      handleActualizarLoteData(
                                        loteIdStr,
                                        "hectareas",
                                        e.target.value,
                                      )
                                    }
                                    style={styles.input}
                                    required
                                  />
                                </div>

                                <div style={styles.formGroup}>
                                  <label style={styles.label}>
                                    Tratamiento *
                                  </label>
                                  <select
                                    value={datos.tratamiento}
                                    onChange={(e) =>
                                      handleActualizarLoteData(
                                        loteIdStr,
                                        "tratamiento",
                                        e.target.value,
                                      )
                                    }
                                    style={styles.select}
                                    required
                                  >
                                    <option value="">Seleccionar...</option>
                                    <option value="Barbecho">Barbecho</option>
                                    <option value="Pre-emergente">
                                      Pre-emergente
                                    </option>
                                    <option value="Post-emergente">
                                      Post-emergente
                                    </option>
                                    <option value="Clearsol">Clearsol</option>
                                    <option value="Hoja Ancha">
                                      Hoja Ancha
                                    </option>
                                    <option value="otro">Otro</option>
                                  </select>
                                  {datos.tratamiento === "otro" && (
                                    <input
                                      type="text"
                                      placeholder="Detalle tratamiento..."
                                      value={datos.tratamientoOtro}
                                      onChange={(e) =>
                                        handleActualizarLoteData(
                                          loteIdStr,
                                          "tratamientoOtro",
                                          e.target.value,
                                        )
                                      }
                                      style={{
                                        ...styles.inputDestacado,
                                        marginTop: "4px",
                                      }}
                                      required
                                    />
                                  )}
                                </div>

                                <div style={styles.formGroup}>
                                  <label style={styles.label}>Cultivo *</label>
                                  <select
                                    value={datos.tipoCultivo}
                                    onChange={(e) =>
                                      handleActualizarLoteData(
                                        loteIdStr,
                                        "tipoCultivo",
                                        e.target.value,
                                      )
                                    }
                                    style={styles.select}
                                    required
                                  >
                                    <option value="">Seleccionar...</option>
                                    <option value="Girasol">Girasol</option>
                                    <option value="Maíz">Maíz</option>
                                    <option value="Soja">Soja</option>
                                    <option value="Trigo">Trigo</option>
                                    <option value="Sorgo">Sorgo</option>
                                    <option value="Avena">Avena</option>
                                    <option value="Cebada">Cebada</option>
                                    <option value="otro">Otro</option>
                                  </select>
                                  {datos.tipoCultivo === "otro" && (
                                    <input
                                      type="text"
                                      placeholder="Detalle cultivo..."
                                      value={datos.tipoCultivoOtro}
                                      onChange={(e) =>
                                        handleActualizarLoteData(
                                          loteIdStr,
                                          "tipoCultivoOtro",
                                          e.target.value,
                                        )
                                      }
                                      style={{
                                        ...styles.inputDestacado,
                                        marginTop: "4px",
                                      }}
                                      required
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={styles.actionsRow}>
                    <button
                      type="button"
                      onClick={() => setPasoActual(1)}
                      style={styles.btnAtras}
                    >
                      ⬅ Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setPasoActual(3)}
                      disabled={!paso2Valido}
                      style={styles.btnSiguiente(!paso2Valido)}
                    >
                      Siguiente ➔
                    </button>
                  </div>
                </div>
              )}

              {/* PÁGINA 3: PRECIOS Y RESUMEN MONETARIO */}
              {pasoActual === 3 && (
                <div>
                  <h3 style={{ ...styles.sectionTitle, marginBottom: "16px" }}>
                    {trabajoALiquidar
                      ? "Liquidar Trabajo Pendiente del Campo"
                      : "Paso 3: Carga de Precios y Resumen Monetario"}
                  </h3>

                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Lote</th>
                        <th style={styles.th}>Hectáreas</th>
                        <th style={styles.th}>Tratamiento / Cultivo</th>
                        <th style={styles.th}>Precio x Hectárea ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lotesActivosArray.map(([loteIdStr, data]) => {
                        const loteObj = lotes.find(
                          (l) => Number(l.id) === Number(loteIdStr),
                        );
                        const precioActual = preciosLote[loteIdStr] || "";
                        const ha = Number(data.hectareas) || 0;

                        return (
                          <tr key={loteIdStr}>
                            <td style={{ ...styles.td, fontWeight: "700" }}>
                              Lote {loteObj?.numero_lote || loteIdStr}
                            </td>
                            <td style={styles.td}>{ha} ha</td>
                            <td style={styles.td}>
                              {data.tratamiento === "otro"
                                ? data.tratamientoOtro
                                : data.tratamiento}{" "}
                              /{" "}
                              {data.tipoCultivo === "otro"
                                ? data.tipoCultivoOtro
                                : data.tipoCultivo}
                            </td>
                            <td style={styles.td}>
                              <input
                                type="number"
                                step="any"
                                placeholder="Ej: 15000"
                                value={precioActual}
                                onChange={(e) =>
                                  handlePrecioChange(loteIdStr, e.target.value)
                                }
                                style={{ ...styles.input, maxWidth: "180px" }}
                                required
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div style={styles.totalesBox}>
                    <div style={styles.totalItem}>
                      <span style={styles.totalLabel}>Total Hectáreas</span>
                      <span style={styles.totalValue}>
                        {totalHectareasRealizadas.toLocaleString()} ha
                      </span>
                    </div>
                    <div style={styles.totalItem}>
                      <span style={styles.totalLabel}>Subtotal</span>
                      <span style={styles.totalValue}>
                        $
                        {subtotal.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div style={styles.totalItem}>
                      <span style={styles.totalLabel}>IVA (10.5%)</span>
                      <span style={styles.totalValue}>
                        $
                        {iva.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div style={styles.totalItem}>
                      <span style={styles.totalLabel}>Total General</span>
                      <span
                        style={{
                          ...styles.totalValue,
                          ...styles.totalDestacado,
                        }}
                      >
                        $
                        {total.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>

                  <div style={styles.actionsRow}>
                    {!trabajoALiquidar && (
                      <button
                        type="button"
                        onClick={() => setPasoActual(2)}
                        style={styles.btnAtras}
                      >
                        ⬅ Atrás
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!paso3Valido || guardando}
                      style={{
                        ...styles.btnSubmit(!paso3Valido || guardando),
                        marginLeft: "auto",
                      }}
                    >
                      {guardando
                        ? "Guardando Liquidación..."
                        : "CONFIRMAR Y LIQUIDAR"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {mostrarAlerta && (
        <div style={styles.toastAlert}>
          <span style={{ fontSize: "1.2rem" }}>👍</span>
          <span>¡Trabajo liquidado con éxito!</span>
        </div>
      )}
    </div>
  );
}
