import { useState, useEffect } from "react";
import api from "../services/api";

export default function Sidebar({ activeSection, setActiveSection }) {
  const [alertaTurno, setAlertaTurno] = useState(null);
  const [cantidadPagosPendientes, setCantidadPagosPendientes] = useState(0);
  const [
    tieneTrabajosPendientesLiquidacion,
    setTieneTrabajosPendientesLiquidacion,
  ] = useState(false);
  const [tieneClientesConDeuda, setTieneClientesConDeuda] = useState(false);
  const [tieneClientesSinCuil, setTieneClientesSinCuil] = useState(false);
  const [tieneInsumosBajoStock, setTieneInsumosBajoStock] = useState(false);

  const isInicio = activeSection === "inicio";

  const modulos = [
    { id: "nuevo-trabajo", nombre: "Nuevo trabajo", icono: "➕" },
    { id: "resumen", nombre: "Resumen General", icono: "📊" },
    { id: "rendimiento", nombre: "Rendimiento", icono: "📈" }, // <-- Módulo nuevo agregado
    { id: "clientes", nombre: "Clientes y Campos", icono: "🌾" },
    { id: "insumos", nombre: "Consumos", icono: "🛢️" },
    { id: "maquinas", nombre: "Máquinas", icono: "🚜" },
    { id: "empleados", nombre: "Empleados", icono: "👷" },
    { id: "proveedores", nombre: "Proveedores", icono: "📦" },
    { id: "turnos", nombre: "Turnos", icono: "📅" },
  ];

  useEffect(() => {
    const verificarAlertas = async () => {
      try {
        const ahora = new Date();

        // 1. Verificación de Turnos
        const resTurnos = await api.get("/turnos");
        if (
          resTurnos.data &&
          Array.isArray(resTurnos.data) &&
          resTurnos.data.length > 0
        ) {
          const turnosValidos = resTurnos.data
            .map((t) => {
              const rawFecha = t.fecha_hora || t.fecha || t.fecha_turno;
              if (!rawFecha) return null;
              const fechaObj = new Date(rawFecha);
              if (isNaN(fechaObj)) return null;
              return { ...t, fechaObj };
            })
            .filter((t) => t && t.fechaObj >= ahora)
            .sort((a, b) => a.fechaObj - b.fechaObj);

          if (turnosValidos.length > 0) {
            const proximo = turnosValidos[0];
            const hoyMedianoche = new Date(
              ahora.getFullYear(),
              ahora.getMonth(),
              ahora.getDate(),
            );
            const turnoMedianoche = new Date(
              proximo.fechaObj.getFullYear(),
              proximo.fechaObj.getMonth(),
              proximo.fechaObj.getDate(),
            );

            const diferenciaTiempo = turnoMedianoche - hoyMedianoche;
            const diasRestantes = Math.round(
              diferenciaTiempo / (1000 * 60 * 60 * 24),
            );

            if (diasRestantes === 0) {
              setAlertaTurno({
                texto: "Tenés un turno para hoy",
                color: "#ffffff",
              });
            } else if (diasRestantes === 1) {
              setAlertaTurno({
                texto: "Próximo turno mañana",
                color: "#ef4444",
              });
            } else if (diasRestantes > 0 && diasRestantes <= 3) {
              setAlertaTurno({ texto: "Próximo a 3 días", color: "#f97316" });
            } else if (diasRestantes === 5) {
              setAlertaTurno({ texto: "Próximo a 5 días", color: "#ec4899" });
            } else {
              setAlertaTurno(null);
            }
          } else {
            setAlertaTurno(null);
          }
        } else {
          setAlertaTurno(null);
        }

        // 2. Verificación de Proveedores Pagos Pendientes
        const resPagos = await api.get("/proveedores/pagos");
        if (resPagos.data && Array.isArray(resPagos.data)) {
          const mapaFacturas = {};
          resPagos.data.forEach((p) => {
            const clave = `${p.proveedor_id}_${String(p.numero_factura).trim()}`;
            if (!mapaFacturas[clave]) {
              mapaFacturas[clave] = [];
            }
            mapaFacturas[clave].push(p);
          });

          let contadorPendientes = 0;
          Object.values(mapaFacturas).forEach((movs) => {
            movs.sort(
              (a, b) => new Date(a.fecha) - new Date(b.fecha) || a.id - b.id,
            );
            const ultimoMov = movs[movs.length - 1];
            const pendienteActual = Number(ultimoMov?.monto_pendiente || 0);
            if (pendienteActual > 0) {
              contadorPendientes++;
            }
          });

          setCantidadPagosPendientes(contadorPendientes);
        } else {
          setCantidadPagosPendientes(0);
        }

        // 3. Verificación para "Nuevo trabajo"
        const resPagosClientes = await api
          .get("/pagos-clientes")
          .catch(() => ({ data: [] }));
        if (resPagosClientes.data && Array.isArray(resPagosClientes.data)) {
          const hayPendienteLiq = resPagosClientes.data.some(
            (p) =>
              Number(p.precio_por_hectarea) === 0 ||
              p.precio_por_hectarea === null ||
              p.precio_por_hectarea === undefined,
          );
          setTieneTrabajosPendientesLiquidacion(hayPendienteLiq);
        } else {
          setTieneTrabajosPendientesLiquidacion(false);
        }

        // 4. Verificación para "Clientes y Campos"
        const resClientes = await api
          .get("/clientes")
          .catch(() => ({ data: [] }));
        if (resClientes.data && Array.isArray(resClientes.data)) {
          const sinCuil = resClientes.data.some(
            (c) => !c.cuil || String(c.cuil).trim() === "",
          );
          setTieneClientesSinCuil(sinCuil);

          const pagosCli = resPagosClientes.data || [];
          const deudaClientes = pagosCli.some(
            (p) => Number(p.monto_pendiente || 0) > 0,
          );
          setTieneClientesConDeuda(deudaClientes);
        } else {
          setTieneClientesSinCuil(false);
          setTieneClientesConDeuda(false);
        }

        // 5. Verificación de Insumos (Stock bajo <= 200)
        const resInsumos = await api
          .get("/insumos")
          .catch(() => ({ data: [] }));
        if (resInsumos.data && Array.isArray(resInsumos.data)) {
          const hayBajoStock = resInsumos.data.some((item) => {
            const stockNum = parseFloat(item.stock_actual ?? item.stock) || 0;
            return stockNum <= 200;
          });
          setTieneInsumosBajoStock(hayBajoStock);
        } else {
          setTieneInsumosBajoStock(false);
        }
      } catch (error) {
        console.error("Error al verificar alertas del sidebar:", error);
      }
    };

    verificarAlertas();
    const interval = setInterval(verificarAlertas, 60000);
    return () => clearInterval(interval);
  }, [activeSection]);

  return (
    <aside
      style={{
        ...styles.sidebar,
        width: isInicio ? "240px" : "72px",
      }}
    >
      <ul style={styles.ul}>
        {modulos.map((mod) => {
          const isActive = activeSection === mod.id;
          const esTurnos = mod.id === "turnos";
          const esProveedores = mod.id === "proveedores";
          const esNuevoTrabajo = mod.id === "nuevo-trabajo";
          const esClientes = mod.id === "clientes";
          const esConsumos = mod.id === "insumos";

          return (
            <li
              key={mod.id}
              onClick={() => setActiveSection(mod.id)}
              style={{
                ...styles.li,
                backgroundColor: isActive ? "#2563eb" : "transparent",
                color: isActive ? "#ffffff" : "#cbd5e1",
                boxShadow: isActive
                  ? "0 4px 12px rgba(37, 99, 235, 0.4)"
                  : "none",
                justifyContent: isInicio ? "flex-start" : "center",
                paddingLeft: isInicio ? "16px" : "0",
                width: isInicio ? "210px" : "48px",
              }}
            >
              <span style={styles.icono}>{mod.icono}</span>
              {isInicio && <span style={styles.textoModulo}>{mod.nombre}</span>}

              {esTurnos && alertaTurno && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: isInicio ? "14px" : "8px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: alertaTurno.color,
                    boxShadow: `0 0 8px ${alertaTurno.color}`,
                  }}
                />
              )}

              {esProveedores && cantidadPagosPendientes > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: isInicio ? "14px" : "8px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    boxShadow: "0 0 8px #ef4444",
                  }}
                />
              )}

              {esNuevoTrabajo && tieneTrabajosPendientesLiquidacion && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: isInicio ? "14px" : "8px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    boxShadow: "0 0 8px #ef4444",
                  }}
                />
              )}

              {esConsumos && tieneInsumosBajoStock && (
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: isInicio ? "14px" : "8px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    boxShadow: "0 0 8px #ef4444",
                  }}
                />
              )}

              {esClientes && (
                <>
                  {tieneClientesConDeuda ? (
                    <span
                      style={{
                        position: "absolute",
                        top: "18px",
                        right: isInicio ? "14px" : "8px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#ef4444",
                        boxShadow: "0 0 8px #ef4444",
                      }}
                    />
                  ) : (
                    tieneClientesSinCuil && (
                      <span
                        style={{
                          position: "absolute",
                          top: "18px",
                          right: isInicio ? "14px" : "8px",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#eab308",
                          boxShadow: "0 0 8px #eab308",
                        }}
                      />
                    )
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

const styles = {
  sidebar: {
    backgroundColor: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "12px",
    paddingBottom: "12px",
    height: "calc(100vh - 70px)",
    boxSizing: "border-box",
    borderRight: "1px solid #1e293b",
    position: "relative",
    zIndex: 100,
    transition: "width 0.3s ease",
    overflow: "visible",
  },
  ul: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    overflowY: "hidden",
  },
  li: {
    position: "relative",
    height: "46px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    userSelect: "none",
    gap: "12px",
    width: "100%",
  },
  icono: {
    fontSize: "1.2rem",
    minWidth: "24px",
    textAlign: "center",
  },
  textoModulo: {
    fontSize: "0.9rem",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
