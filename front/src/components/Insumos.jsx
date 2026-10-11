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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  btnNuevoInsumo: {
    padding: "10px 18px",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "24px",
  },
  tanqueCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
  },
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
  btnHistorial: {
    background: "none",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "4px 8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "background 0.2s",
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
    padding: "8px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  btnUsarStock: {
    flex: 1,
    padding: "8px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
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
    maxWidth: "680px", // Ampliado para que la tabla luzca más cómoda
    width: "100%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxHeight: "85vh",
    overflowY: "auto",
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginTop: "12px",
  },
  th: {
    backgroundColor: "#f1f5f9",
    padding: "10px",
    textAlign: "left",
    borderBottom: "1px solid #cbd5e1",
    color: "#334155",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
  },
};

export default function Insumos() {
  const [insumos, setInsumos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [retiros, setRetiros] = useState([]);

  // Modales
  const [modalInsumoAbierto, setModalInsumoAbierto] = useState(false);
  const [modalCargarAbierto, setModalCargarAbierto] = useState(false);
  const [modalUsarAbierto, setModalUsarAbierto] = useState(false);
  const [modalResumenAbierto, setModalResumenAbierto] = useState(false);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

  // Form Nuevo Insumo
  const [nombreInsumo, setNombreInsumo] = useState("");

  // Form Cargar Stock
  const [cantidadCargar, setCantidadCargar] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Form Usar Insumo
  const [cantidadUsar, setCantidadUsar] = useState("");
  const [fechaUso, setFechaUso] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [empleadoId, setEmpleadoId] = useState("");
  const [maquinaId, setMaquinaId] = useState("");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Formatear fecha a DD/MM/AAAA
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const parteFecha = fechaStr.split("T")[0];
    const [anio, mes, dia] = parteFecha.split("-");
    if (anio && mes && dia) {
      return `${dia}/${mes}/${anio}`;
    }
    return fechaStr;
  };

  // Autocompletado cruzado mediante tabla intermedia empleado_maquina
  const handleEmpleadoChange = (e) => {
    const empId = e.target.value;
    setEmpleadoId(empId);
    if (!empId) {
      setMaquinaId("");
      return;
    }
    const relacion = asignaciones.find(
      (a) => Number(a.empleado_id) === Number(empId),
    );
    if (relacion) {
      setMaquinaId(String(relacion.maquina_id));
    }
  };

  const handleMaquinaChange = (e) => {
    const maqId = e.target.value;
    setMaquinaId(maqId);
    if (!maqId) {
      setEmpleadoId("");
      return;
    }
    const relacion = asignaciones.find(
      (a) => Number(a.maquina_id) === Number(maqId),
    );
    if (relacion) {
      setEmpleadoId(String(relacion.empleado_id));
    }
  };

  const handleCrearInsumo = async (e) => {
    e.preventDefault();
    const nombreLimpio = nombreInsumo.trim();

    const existe = insumos.some(
      (i) => i.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase(),
    );
    if (existe) {
      alert("Ya existe un insumo registrado con ese nombre.");
      return;
    }

    try {
      await api.post("/insumos", { nombre: nombreLimpio });
      setModalInsumoAbierto(false);
      setNombreInsumo("");
      fetchData();
    } catch (error) {
      console.error("Error al crear insumo:", error);
    }
  };

  const handleCargarStock = async (e) => {
    e.preventDefault();
    if (!insumoSeleccionado) return;

    try {
      await api.post("/insumos/ingresos", {
        insumo_id: Number(insumoSeleccionado.id),
        cantidad: Number(cantidadCargar),
        fecha: fechaIngreso,
      });

      setModalCargarAbierto(false);
      setCantidadCargar("");
      fetchData();
    } catch (error) {
      console.error("Error al registrar ingreso de insumo:", error);
    }
  };

  const handleUsarInsumo = async (e) => {
    e.preventDefault();
    if (!insumoSeleccionado) return;

    const cantidadRetiro = Number(cantidadUsar);
    const stockActual = Number(insumoSeleccionado.stock_actual) || 0;

    if (cantidadRetiro > stockActual) {
      alert("La cantidad a retirar supera el stock actual disponible.");
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
      fetchData();
    } catch (error) {
      console.error("Error al registrar retiro de insumo:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h2 style={styles.title}>🛢️ Control de Stock y Tanques de Insumos</h2>
        <button
          onClick={() => setModalInsumoAbierto(true)}
          style={styles.btnNuevoInsumo}
        >
          + Agregar Nuevo Insumo
        </button>
      </div>

      <div style={styles.grid}>
        {insumos.map((i) => {
          const stockActual = Number(i.stock_actual) || 0;
          const capacidadRef = Math.max(stockActual * 1.5, 100);
          const porcentaje = Math.min(
            Math.round((stockActual / capacidadRef) * 100),
            100,
          );

          let colorLiquido = "#0284c7";
          if (stockActual <= 0) colorLiquido = "#94a3b8";
          else if (porcentaje <= 20) colorLiquido = "#dc2626";

          return (
            <div key={i.id} style={styles.tanqueCard}>
              <div style={styles.tanqueHeader}>
                <div style={styles.tanqueNombre}>{i.nombre}</div>
                <button
                  onClick={() => {
                    setInsumoSeleccionado(i);
                    setModalResumenAbierto(true);
                  }}
                  style={styles.btnHistorial}
                  title="Ver Resumen de Movimientos"
                >
                  📋
                </button>
              </div>

              <div style={styles.tanqueContenedorGrafico}>
                <div style={styles.tapaSuperiorTanque}></div>
                <div
                  style={{
                    ...styles.liquidoTanque,
                    height: `${stockActual > 0 ? Math.max(porcentaje, 10) : 0}%`,
                    backgroundColor: colorLiquido,
                  }}
                >
                  <div style={styles.reflejoLiquido}></div>
                </div>
              </div>

              <div style={styles.infoTotales}>
                <div style={styles.cantidadActualText}>
                  {stockActual.toLocaleString()}
                </div>
                <div style={styles.capacidadMaxText}>Stock Actual</div>
              </div>

              <div style={styles.botonesAccion}>
                <button
                  onClick={() => {
                    setInsumoSeleccionado(i);
                    setModalCargarAbierto(true);
                  }}
                  style={styles.btnCargarStock}
                >
                  Cargar
                </button>
                <button
                  onClick={() => {
                    setInsumoSeleccionado(i);
                    setModalUsarAbierto(true);
                  }}
                  style={styles.btnUsarStock}
                >
                  Usar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL NUEVO INSUMO */}
      {modalInsumoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#0f172a" }}>
              Nuevo Insumo
            </h3>
            <form onSubmit={handleCrearInsumo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del Insumo</label>
                <input
                  type="text"
                  placeholder="Ej: Glifosato"
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

      {/* MODAL CARGAR STOCK */}
      {modalCargarAbierto && insumoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
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
              Stock actual: <b>{insumoSeleccionado.stock_actual}</b>
            </p>
            <form onSubmit={handleCargarStock}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad a Ingresar</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: 200"
                  required
                  value={cantidadCargar}
                  onChange={(e) => setCantidadCargar(e.target.value)}
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
                  Confirmar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USAR INSUMO */}
      {modalUsarAbierto && insumoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
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
              Stock actual disponible: <b>{insumoSeleccionado.stock_actual}</b>
            </p>
            <form onSubmit={handleUsarInsumo}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cantidad a Retirar</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: 50"
                  required
                  value={cantidadUsar}
                  onChange={(e) => setCantidadUsar(e.target.value)}
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

      {/* MODAL RESUMEN / HISTORIAL DE MOVIMIENTOS (Tabla grande y formato DD/MM/AAAA) */}
      {modalResumenAbierto && insumoSeleccionado && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "12px", color: "#0f172a" }}>
              Resumen de Movimientos: {insumoSeleccionado.nombre}
            </h3>

            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>Tipo</th>
                    <th style={styles.th}>Cant.</th>
                    <th style={styles.th}>Empleado</th>
                    <th style={styles.th}>Máquina</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const ingFiltrados = ingresos
                      .filter(
                        (ing) =>
                          Number(ing.insumo_id) ===
                          Number(insumoSeleccionado.id),
                      )
                      .map((ing) => ({ ...ing, tipo: "Carga (Ingreso)" }));

                    const retFiltrados = retiros
                      .filter(
                        (ret) =>
                          Number(ret.insumo_id) ===
                          Number(insumoSeleccionado.id),
                      )
                      .map((ret) => {
                        const emp = empleados.find(
                          (e) => Number(e.id) === Number(ret.empleado_id),
                        );
                        const maq = maquinas.find(
                          (m) => Number(m.id) === Number(ret.maquina_id),
                        );
                        return {
                          ...ret,
                          tipo: "Uso (Retiro)",
                          empleadoNombre: emp
                            ? emp.nombre
                              ? `${emp.nombre} ${emp.apellido || ""}`
                              : emp.username
                            : "N/A",
                          maquinaNombre: maq
                            ? maq.nombre || maq.patente
                            : "N/A",
                        };
                      });

                    const movimientos = [...ingFiltrados, ...retFiltrados].sort(
                      (a, b) => new Date(b.fecha) - new Date(a.fecha),
                    );

                    if (movimientos.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan="5"
                            style={{
                              ...styles.td,
                              textAlign: "center",
                              color: "#64748b",
                              padding: "20px",
                            }}
                          >
                            No hay movimientos registrados para este insumo.
                          </td>
                        </tr>
                      );
                    }

                    return movimientos.map((m, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{formatearFecha(m.fecha)}</td>
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
                        <td style={styles.td}>{m.cantidad}</td>
                        <td style={styles.td}>{m.empleadoNombre || "-"}</td>
                        <td style={styles.td}>{m.maquinaNombre || "-"}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setModalResumenAbierto(false)}
                style={styles.btnModalCancel}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
