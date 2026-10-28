import { useState, useEffect } from "react";
import api from "../services/api";

export default function TrabajosPendientes({ onLiquidarTrabajo }) {
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    try {
      setCargando(true);
      const res = await api.get("/trabajos/pendientes");
      setPendientes(res.data);
    } catch (error) {
      console.error("Error al cargar trabajos pendientes:", error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ padding: "20px", color: "#64748b" }}>
        Cargando pendientes...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.titulo}>
          🚜 Trabajos Pendientes de Liquidación
          {pendientes.length > 0 && (
            <span style={styles.badgeCount}>{pendientes.length}</span>
          )}
        </h3>
        <button onClick={cargarPendientes} style={styles.btnActualizar}>
          🔄 Actualizar Lista
        </button>
      </div>

      {pendientes.length === 0 ? (
        <div style={styles.emptyCard}>
          <span>✅</span>
          <p>No hay trabajos pendientes de liquidación. ¡Todo al día!</p>
        </div>
      ) : (
        <div style={styles.tableResponsive}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Campo / Lote</th>
                <th style={styles.th}>Hectáreas</th>
                <th style={styles.th}>Tratamiento / Cultivo</th>
                <th style={styles.th}>Operario / Máquina</th>
                <th style={styles.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((item) => (
                <tr key={item.id} style={styles.tr}>
                  <td style={styles.td}>
                    {item.fecha ? item.fecha.split("T")[0] : "-"}
                  </td>
                  <td style={{ ...styles.td, fontWeight: "700" }}>
                    {item.cliente_nombre || "Cliente " + item.cliente_id}
                  </td>
                  <td style={styles.td}>
                    {item.campo_nombre} - Lote{" "}
                    {item.numero_lote || item.lote_id}
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
                    <br />
                    <small style={{ color: "#64748b" }}>
                      {item.maquina_nombre}
                    </small>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => onLiquidarTrabajo(item)}
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
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  titulo: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badgeCount: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "2px 8px",
    fontSize: "0.8rem",
    fontWeight: "700",
  },
  btnActualizar: {
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
  },
  emptyCard: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px dashed #cbd5e1",
    color: "#64748b",
  },
  tableResponsive: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  th: {
    backgroundColor: "#f8fafc",
    padding: "10px 12px",
    textAlign: "left",
    fontWeight: "700",
    color: "#475569",
    borderBottom: "2px solid #e2e8f0",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "12px",
    color: "#1e293b",
    verticalAlign: "middle",
  },
  btnLiquidar: {
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    fontWeight: "700",
    fontSize: "0.85rem",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(22, 163, 74, 0.2)",
  },
};
