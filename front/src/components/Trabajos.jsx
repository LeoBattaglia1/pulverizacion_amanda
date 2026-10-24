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
    padding: "20px 24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #f1f5f9",
    marginTop: "14px",
    marginBottom: "10px",
    paddingBottom: "4px",
  },
  sectionTitle: {
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: 0,
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
  gridRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "12px",
    marginBottom: "10px",
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
    padding: "7px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  inputDestacado: {
    padding: "7px 10px",
    borderRadius: "6px",
    border: "1px solid #f59e0b",
    fontSize: "0.85rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fffbeb",
  },
  select: {
    padding: "7px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#fff",
  },
  btnVerLotes: {
    padding: "8px 16px",
    backgroundColor: "#0284c7",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  lotesResumenBox: {
    backgroundColor: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "950px",
    width: "95%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  btnCloseX: {
    position: "absolute",
    top: "16px",
    right: "16px",
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#64748b",
    cursor: "pointer",
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
    padding: "12px 16px",
    marginTop: "12px",
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
    fontSize: "1.15rem",
    fontWeight: "800",
    color: "#166534",
  },
  btnSubmit: (isDisabled) => ({
    marginTop: "16px",
    padding: "10px 20px",
    background: isDisabled
      ? "#94a3b8"
      : "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    width: "100%",
    boxShadow: isDisabled ? "none" : "0 4px 15px rgba(16, 185, 129, 0.4)",
    transition: "all 0.25s ease",
  }),
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
  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  // Estados del formulario general
  const [fechaTrabajo, setFechaTrabajo] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [clienteId, setClienteId] = useState("");
  const [campoId, setCampoId] = useState("");

  // Modal de Lotes
  const [modalLotesAbierto, setModalLotesAbierto] = useState(false);
  const [lotesSeleccionadosData, setLotesSeleccionadosData] = useState({});

  // Valores globales dentro del modal
  const [hectareasGlobal, setHectareasGlobal] = useState("");
  const [tratamientoGlobal, setTratamientoGlobal] = useState("");
  const [tratamientoGlobalOtro, setTratamientoGlobalOtro] = useState("");
  const [tipoCultivoGlobal, setTipoCultivoGlobal] = useState("");
  const [tipoCultivoGlobalOtro, setTipoCultivoGlobalOtro] = useState("");

  const [empleadoId, setEmpleadoId] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [vinculacionActiva, setVinculacionActiva] = useState(true);
  const [precioPorHa, setPrecioPorHa] = useState("");

  // Control de carga para evitar doble envío y deshabilitar botón
  const [guardando, setGuardando] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleCampoChange = (e) => {
    const nuevoCampoId = e.target.value;
    setCampoId(nuevoCampoId);

    const lotesDelCampo = lotes.filter(
      (l) => Number(l.campo_id) === Number(nuevoCampoId),
    );
    const nuevoMapa = {};
    lotesDelCampo.forEach((l) => {
      nuevoMapa[l.id] = {
        seleccionado: true,
        hectareas: "",
        tratamiento: "",
        tratamientoOtro: "",
        tipoCultivo: "",
        tipoCultivoOtro: "",
      };
    });
    setLotesSeleccionadosData(nuevoMapa);
  };

  const aplicarMasivo = () => {
    const tratFinal =
      tratamientoGlobal === "otro" ? tratamientoGlobalOtro : tratamientoGlobal;
    const cultFinal =
      tipoCultivoGlobal === "otro" ? tipoCultivoGlobalOtro : tipoCultivoGlobal;

    setLotesSeleccionadosData((prev) => {
      const actualizado = { ...prev };
      Object.keys(actualizado).forEach((loteId) => {
        if (actualizado[loteId].seleccionado) {
          if (hectareasGlobal) actualizado[loteId].hectareas = hectareasGlobal;
          if (tratamientoGlobal) {
            actualizado[loteId].tratamiento = tratamientoGlobal;
            actualizado[loteId].tratamientoOtro = tratamientoGlobalOtro;
          }
          if (tipoCultivoGlobal) {
            actualizado[loteId].tipoCultivo = tipoCultivoGlobal;
            actualizado[loteId].tipoCultivoOtro = tipoCultivoGlobalOtro;
          }
        }
      });
      return actualizado;
    });
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

  const lotesActivosArray = Object.entries(lotesSeleccionadosData).filter(
    ([, data]) => data.seleccionado,
  );

  const totalHectareasRealizadas = lotesActivosArray.reduce(
    (sum, [, data]) => sum + (Number(data.hectareas) || 0),
    0,
  );

  const precioCalc = Number(precioPorHa) || 0;
  const subtotal = totalHectareasRealizadas * precioCalc;
  const iva = subtotal * 0.105;
  const total = subtotal + iva;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lotesActivosArray.length === 0) {
      alert("Debe seleccionar y configurar al menos un lote.");
      return;
    }

    setGuardando(true);

    try {
      for (const [loteIdStr, data] of lotesActivosArray) {
        const loteIdNum = Number(loteIdStr);
        const haRealizadas = Number(data.hectareas) || 0;
        const subtotalLote = haRealizadas * precioCalc;
        const ivaLote = subtotalLote * 0.105;
        const totalLote = subtotalLote + ivaLote;

        const tratamientoFinal =
          data.tratamiento === "otro" ? data.tratamientoOtro : data.tratamiento;
        const cultivoFinal =
          data.tipoCultivo === "otro" ? data.tipoCultivoOtro : data.tipoCultivo;

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
        const trabajoId = resTrabajo.data.id || resTrabajo.data.insertId;

        if (trabajoId) {
          await api.post("/pagos-clientes", {
            trabajo_id: Number(trabajoId),
            hectareas_pagadas: haRealizadas,
            precio_por_hectarea: precioCalc,
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

      // Limpiar formulario
      setClienteId("");
      setCampoId("");
      setLotesSeleccionadosData({});
      setHectareasGlobal("");
      setTratamientoGlobal("");
      setTratamientoGlobalOtro("");
      setTipoCultivoGlobal("");
      setTipoCultivoGlobalOtro("");
      setEmpleadoId("");
      setMaquinaId("");
      setPrecioPorHa("");
    } catch (error) {
      console.error("Error al registrar los trabajos:", error);
      alert("Hubo un error al registrar los trabajos.");
      setGuardando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* SECCIÓN 1: FECHA Y UBICACIÓN */}
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>1. Fecha y Ubicación</h3>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fecha del Trabajo</label>
              <input
                type="date"
                value={fechaTrabajo}
                onChange={(e) => setFechaTrabajo(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cliente</label>
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
              <label style={styles.label}>Campo</label>
              <select
                value={campoId}
                onChange={handleCampoChange}
                style={styles.select}
                required
              >
                <option value="">Seleccionar...</option>
                {campos
                  .filter(
                    (c) =>
                      !clienteId || Number(c.cliente_id) === Number(clienteId),
                  )
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* SECCIÓN 2: LOTES Y BOTÓN CARGAR LOTES */}
          {campoId && (
            <>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>2. Lotes</h3>
              </div>
              <div style={styles.lotesResumenBox}>
                <div>
                  <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                    Lotes seleccionados: <b>{lotesActivosArray.length}</b> |
                    Hectáreas totales: <b>{totalHectareasRealizadas} ha</b>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalLotesAbierto(true)}
                  style={styles.btnVerLotes}
                >
                  ⚙️ Cargar Lotes
                </button>
              </div>
            </>
          )}

          {/* SECCIÓN 3: PERSONAL Y MAQUINARIA */}
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>3. Personal y Maquinaria</h3>
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
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Empleado</label>
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
              <label style={styles.label}>Máquina</label>
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Precio por Hectárea ($)</label>
              <input
                type="number"
                step="any"
                placeholder="Ej: 15000"
                value={precioPorHa}
                onChange={(e) => setPrecioPorHa(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* TOTALES */}
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
              <span style={{ ...styles.totalValue, ...styles.totalDestacado }}>
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <button
            type="submit"
            style={styles.btnSubmit(guardando)}
            disabled={guardando}
          >
            {guardando ? "Guardando..." : "GUARDAR TRABAJO"}
          </button>
        </form>
      </div>

      {/* MODAL DE CARGAR LOTES */}
      {modalLotesAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalLotesAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "8px", color: "#0f172a" }}>
              Cargar Lotes del Campo
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                marginBottom: "16px",
              }}
            >
              Todos los lotes están seleccionados por defecto. Puede rellenar
              valores generales arriba para aplicarlos a todos, o modificarlos
              fila por fila.
            </p>

            {/* Fila de aplicación rápida para todos */}
            <div
              style={{
                backgroundColor: "#f1f5f9",
                padding: "12px",
                borderRadius: "8px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: "10px",
                alignItems: "flex-end",
                marginBottom: "16px",
              }}
            >
              <div style={styles.formGroup}>
                <label style={styles.label}>Hctas. Generales</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: 50"
                  value={hectareasGlobal}
                  onChange={(e) => setHectareasGlobal(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tratamiento General</label>
                <select
                  value={tratamientoGlobal}
                  onChange={(e) => {
                    setTratamientoGlobal(e.target.value);
                    if (e.target.value !== "otro") setTratamientoGlobalOtro("");
                  }}
                  style={styles.select}
                >
                  <option value="">Seleccionar...</option>
                  <option value="Barbecho">Barbecho</option>
                  <option value="Pre-emergente">Pre-emergente</option>
                  <option value="Post-emergente">Post-emergente</option>
                  <option value="Clearsol">Clearsol</option>
                  <option value="Hoja Ancha">Hoja Ancha</option>
                  <option value="otro">Otro</option>
                </select>
                {tratamientoGlobal === "otro" && (
                  <input
                    type="text"
                    placeholder="Detalle tratamiento..."
                    value={tratamientoGlobalOtro}
                    onChange={(e) => setTratamientoGlobalOtro(e.target.value)}
                    style={{ ...styles.inputDestacado, marginTop: "4px" }}
                  />
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Cultivo General</label>
                <select
                  value={tipoCultivoGlobal}
                  onChange={(e) => {
                    setTipoCultivoGlobal(e.target.value);
                    if (e.target.value !== "otro") setTipoCultivoGlobalOtro("");
                  }}
                  style={styles.select}
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
                {tipoCultivoGlobal === "otro" && (
                  <input
                    type="text"
                    placeholder="Detalle cultivo..."
                    value={tipoCultivoGlobalOtro}
                    onChange={(e) => setTipoCultivoGlobalOtro(e.target.value)}
                    style={{ ...styles.inputDestacado, marginTop: "4px" }}
                  />
                )}
              </div>

              <button
                type="button"
                onClick={aplicarMasivo}
                style={{
                  padding: "7px 12px",
                  backgroundColor: "#334155",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  height: "35px",
                }}
              >
                Aplicar a Todos
              </button>
            </div>

            {/* Tabla de Lotes */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Incluir</th>
                  <th style={styles.th}>Nº de Lote</th>
                  <th style={styles.th}>Hectáreas</th>
                  <th style={styles.th}>Tratamiento</th>
                  <th style={styles.th}>Cultivo</th>
                </tr>
              </thead>
              <tbody>
                {lotes
                  .filter((l) => Number(l.campo_id) === Number(campoId))
                  .map((lote) => {
                    const datosLote = lotesSeleccionadosData[lote.id] || {
                      seleccionado: true,
                      hectareas: "",
                      tratamiento: "",
                      tratamientoOtro: "",
                      tipoCultivo: "",
                      tipoCultivoOtro: "",
                    };

                    return (
                      <tr key={lote.id}>
                        <td style={styles.td}>
                          <input
                            type="checkbox"
                            checked={datosLote.seleccionado}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setLotesSeleccionadosData((prev) => ({
                                ...prev,
                                [lote.id]: {
                                  ...prev[lote.id],
                                  seleccionado: checked,
                                },
                              }));
                            }}
                            style={{
                              width: "16px",
                              height: "16px",
                              cursor: "pointer",
                            }}
                          />
                        </td>
                        <td style={{ ...styles.td, fontWeight: "700" }}>
                          Lote {lote.numero_lote}
                        </td>
                        <td style={styles.td}>
                          <input
                            type="number"
                            step="any"
                            value={datosLote.hectareas}
                            disabled={!datosLote.seleccionado}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLotesSeleccionadosData((prev) => ({
                                ...prev,
                                [lote.id]: {
                                  ...prev[lote.id],
                                  hectareas: val,
                                },
                              }));
                            }}
                            style={styles.input}
                          />
                        </td>
                        <td style={styles.td}>
                          <select
                            value={datosLote.tratamiento}
                            disabled={!datosLote.seleccionado}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLotesSeleccionadosData((prev) => ({
                                ...prev,
                                [lote.id]: {
                                  ...prev[lote.id],
                                  tratamiento: val,
                                  tratamientoOtro:
                                    val !== "otro"
                                      ? ""
                                      : prev[lote.id].tratamientoOtro,
                                },
                              }));
                            }}
                            style={styles.select}
                          >
                            <option value="">Seleccionar...</option>
                            <option value="Barbecho">Barbecho</option>
                            <option value="Pre-emergente">Pre-emergente</option>
                            <option value="Post-emergente">
                              Post-emergente
                            </option>
                            <option value="Clearsol">Clearsol</option>
                            <option value="Hoja Ancha">Hoja Ancha</option>
                            <option value="otro">Otro</option>
                          </select>
                          {datosLote.tratamiento === "otro" && (
                            <input
                              type="text"
                              placeholder="Detalle..."
                              value={datosLote.tratamientoOtro}
                              disabled={!datosLote.seleccionado}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLotesSeleccionadosData((prev) => ({
                                  ...prev,
                                  [lote.id]: {
                                    ...prev[lote.id],
                                    tratamientoOtro: val,
                                  },
                                }));
                              }}
                              style={{
                                ...styles.inputDestacado,
                                marginTop: "4px",
                              }}
                            />
                          )}
                        </td>
                        <td style={styles.td}>
                          <select
                            value={datosLote.tipoCultivo}
                            disabled={!datosLote.seleccionado}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLotesSeleccionadosData((prev) => ({
                                ...prev,
                                [lote.id]: {
                                  ...prev[lote.id],
                                  tipoCultivo: val,
                                  tipoCultivoOtro:
                                    val !== "otro"
                                      ? ""
                                      : prev[lote.id].tipoCultivoOtro,
                                },
                              }));
                            }}
                            style={styles.select}
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
                          {datosLote.tipoCultivo === "otro" && (
                            <input
                              type="text"
                              placeholder="Detalle..."
                              value={datosLote.tipoCultivoOtro}
                              disabled={!datosLote.seleccionado}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLotesSeleccionadosData((prev) => ({
                                  ...prev,
                                  [lote.id]: {
                                    ...prev[lote.id],
                                    tipoCultivoOtro: val,
                                  },
                                }));
                              }}
                              style={{
                                ...styles.inputDestacado,
                                marginTop: "4px",
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => setModalLotesAbierto(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Aceptar y Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarAlerta && (
        <div style={styles.toastAlert}>
          <span style={{ fontSize: "1.2rem" }}>👍</span>
          <span>
            ¡Trabajos registrados con éxito en la base de datos![cite: 2]
          </span>
        </div>
      )}
    </div>
  );
}
