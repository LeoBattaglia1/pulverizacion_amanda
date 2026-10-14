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
  btnSubmit: {
    marginTop: "16px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    width: "100%",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
    transition: "all 0.25s ease",
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
    animation: "fadeInOut 3s ease forwards",
  },
};

export default function Trabajos() {
  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  // Estados del formulario
  const [clienteId, setClienteId] = useState("");
  const [campoId, setCampoId] = useState("");
  const [loteId, setLoteId] = useState("");
  const [cantidadHectareas, setCantidadHectareas] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [tratamientoOtro, setTratamientoOtro] = useState("");
  const [tipoCultivo, setTipoCultivo] = useState("");
  const [tipoCultivoOtro, setTipoCultivoOtro] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [vinculacionActiva, setVinculacionActiva] = useState(true);
  const [hectareasPagadas, setHectareasPagadas] = useState("");
  const [precioPorHa, setPrecioPorHa] = useState("");

  // Estado para la alerta flotante de éxito
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

  const handleHectareasChange = (e) => {
    const val = e.target.value;
    setCantidadHectareas(val);
    if (!hectareasPagadas || hectareasPagadas === cantidadHectareas) {
      setHectareasPagadas(val);
    }
  };

  const handleHectareasPagadasChange = (e) => {
    const val = e.target.value;
    const realizadasNum = Number(cantidadHectareas) || 0;
    const pagadasNum = Number(val) || 0;

    if (realizadasNum > 0 && pagadasNum > realizadasNum) {
      alert("Las hectáreas pagadas no pueden ser mayores que las realizadas.");
      setHectareasPagadas(cantidadHectareas);
      return;
    }
    setHectareasPagadas(val);
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

  const haPagadasCalc =
    Number(hectareasPagadas) || Number(cantidadHectareas) || 0;
  const precioCalc = Number(precioPorHa) || 0;
  const subtotal = haPagadasCalc * precioCalc;
  const iva = subtotal * 0.105;
  const total = subtotal + iva;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const realizadasNum = Number(cantidadHectareas) || 0;
    const pagadasNum = Number(hectareasPagadas) || 0;
    if (pagadasNum > realizadasNum) {
      alert("Las hectáreas pagadas no pueden ser mayores que las realizadas.");
      return;
    }

    const tratamientoFinal =
      tratamiento === "otro" ? tratamientoOtro : tratamiento;
    const cultivoFinal = tipoCultivo === "otro" ? tipoCultivoOtro : tipoCultivo;

    const fechaHoy = new Date().toISOString().split("T")[0];

    const datosTrabajo = {
      lote_id: Number(loteId),
      maquina_id: Number(maquinaId),
      empleado_id: Number(empleadoId),
      cantidad_hectareas: realizadasNum,
      tratamiento: tratamientoFinal,
      tipo_cultivo: cultivoFinal,
      fecha: fechaHoy,
    };

    try {
      const resTrabajo = await api.post("/trabajos", datosTrabajo);
      const trabajoId = resTrabajo.data.id || resTrabajo.data.insertId;

      if (trabajoId) {
        await api.post("/pagos-clientes", {
          trabajo_id: Number(trabajoId),
          hectareas_pagadas: pagadasNum,
          precio_por_hectarea: precioCalc,
          subtotal: subtotal,
          iva: iva,
          total: total,
          fecha: fechaHoy,
        });
      }

      // Activar alerta flotante y programar cierre automático a los 3 segundos
      setMostrarAlerta(true);
      setTimeout(() => {
        setMostrarAlerta(false);
      }, 3000);

      // Limpiar formulario
      setClienteId("");
      setCampoId("");
      setLoteId("");
      setCantidadHectareas("");
      setTratamiento("");
      setTratamientoOtro("");
      setTipoCultivo("");
      setTipoCultivoOtro("");
      setEmpleadoId("");
      setMaquinaId("");
      setHectareasPagadas("");
      setPrecioPorHa("");
    } catch (error) {
      console.error("Error al registrar el trabajo:", error);
      alert("Hubo un error al registrar el trabajo.");
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            15% { opacity: 1; transform: translateY(0); }
            85% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
          }
        `}
      </style>

      <div style={styles.card}>
        <form onSubmit={handleSubmit}>
          {/* SECCIÓN 1 */}
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>1. Ubicación y Superficie</h3>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cliente</label>
              <select
                value={clienteId}
                onChange={(e) => {
                  setClienteId(e.target.value);
                  setCampoId("");
                  setLoteId("");
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
                onChange={(e) => {
                  setCampoId(e.target.value);
                  setLoteId("");
                }}
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Lote</label>
              <select
                value={loteId}
                onChange={(e) => setLoteId(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Seleccionar...</option>
                {lotes
                  .filter(
                    (l) => !campoId || Number(l.campo_id) === Number(campoId),
                  )
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.numero_lote}
                    </option>
                  ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Hectáreas Realizadas</label>
              <input
                type="number"
                step="any"
                placeholder="Ej: 50"
                value={cantidadHectareas}
                onChange={handleHectareasChange}
                style={styles.input}
                required
              />
            </div>
          </div>

          {/* SECCIÓN 2 */}
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>2. Labor Agronómica</h3>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tratamiento</label>
              <select
                value={tratamiento}
                onChange={(e) => {
                  setTratamiento(e.target.value);
                  if (e.target.value !== "otro") setTratamientoOtro("");
                }}
                style={styles.select}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="Barbecho">Barbecho</option>
                <option value="Pre-emergente">Pre-emergente</option>
                <option value="Post-emergente">Post-emergente</option>
                <option value="Clearsol">Clearsol</option>
                <option value="Hoja Ancha">Hoja Ancha</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {tratamiento === "otro" && (
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: "#d97706" }}>
                  Especificar Tratamiento
                </label>
                <input
                  type="text"
                  placeholder="Detalle..."
                  value={tratamientoOtro}
                  onChange={(e) => setTratamientoOtro(e.target.value)}
                  style={styles.inputDestacado}
                  required
                />
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo de Cultivo</label>
              <select
                value={tipoCultivo}
                onChange={(e) => {
                  setTipoCultivo(e.target.value);
                  if (e.target.value !== "otro") setTipoCultivoOtro("");
                }}
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
            </div>

            {tipoCultivo === "otro" && (
              <div style={styles.formGroup}>
                <label style={{ ...styles.label, color: "#d97706" }}>
                  Especificar Cultivo
                </label>
                <input
                  type="text"
                  placeholder="Detalle..."
                  value={tipoCultivoOtro}
                  onChange={(e) => setTipoCultivoOtro(e.target.value)}
                  style={styles.inputDestacado}
                  required
                />
              </div>
            )}
          </div>

          {/* SECCIÓN 3 */}
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>3. Personal y Maquinaria</h3>
            <button
              type="button"
              onClick={() => setVinculacionActiva(!vinculacionActiva)}
              style={styles.btnToggleLink(vinculacionActiva)}
              title={
                vinculacionActiva
                  ? "Desvincular para cambio temporal"
                  : "Vincular automáticamente"
              }
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
          </div>

          {/* SECCIÓN 4 */}
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>4. Liquidación y Pagos</h3>
          </div>
          <div style={styles.gridRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Hectáreas Pagadas</label>
              <input
                type="number"
                step="any"
                value={hectareasPagadas}
                onChange={handleHectareasPagadasChange}
                style={styles.input}
                required
              />
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

          <button type="submit" style={styles.btnSubmit}>
            Registrar Trabajo y Pago
          </button>
        </form>
      </div>

      {/* NOTIFICACIÓN FLOTANTE (TOAST) DE ÉXITO */}
      {mostrarAlerta && (
        <div style={styles.toastAlert}>
          <span style={{ fontSize: "1.2rem" }}>👍</span>
          <span>Trabajo registrado con éxito</span>
        </div>
      )}
    </div>
  );
}
