import { useState, useEffect } from "react";
import api from "../services/api";

export default function Sidebar({ activeSection, setActiveSection }) {
  const [cargandoBackup, setCargandoBackup] = useState(false);
  const [alertaTurno, setAlertaTurno] = useState(null);
  const [cantidadPagosPendientes, setCantidadPagosPendientes] = useState(0);
  const [toastNotificacion, setToastNotificacion] = useState({
    visible: false,
    mensaje: "",
    error: false,
  });

  const isInicio = activeSection === "inicio";

  const modulos = [
    { id: "nuevo-trabajo", nombre: "Nuevo trabajo", icono: "➕" },
    { id: "resumen", nombre: "Resumen General", icono: "📊" },
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
      } catch (error) {
        console.error("Error al verificar alertas del sidebar:", error);
      }
    };

    verificarAlertas();
    const interval = setInterval(verificarAlertas, 60000);
    return () => clearInterval(interval);
  }, [activeSection]);

  const mostrarToast = (mensaje, error = false) => {
    setToastNotificacion({ visible: true, mensaje, error });
    setTimeout(() => {
      setToastNotificacion({ visible: false, mensaje: "", error: false });
    }, 4000);
  };

  const handleBackupManual = async () => {
    if (cargandoBackup) return;
    try {
      setCargandoBackup(true);
      const res = await api.post("/backup-manual");
      if (res.data.success) {
        mostrarToast("¡Backup realizado correctamente!");
      } else {
        mostrarToast("Hubo un error al realizar el respaldo.", true);
      }
    } catch (error) {
      console.error(error);
      mostrarToast("Error de conexión al intentar realizar el backup.", true);
    } finally {
      setCargandoBackup(false);
    }
  };

  return (
    <aside
      style={{
        ...styles.sidebar,
        width: isInicio ? "240px" : "72px",
      }}
    >
      <style>
        {`
          @keyframes slideUpToast {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <ul style={styles.ul}>
        {modulos.map((mod) => {
          const isActive = activeSection === mod.id;
          const esTurnos = mod.id === "turnos";
          const esProveedores = mod.id === "proveedores";

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
                    top: isInicio ? "18px" : "8px",
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
                    top: isInicio ? "18px" : "8px",
                    right: isInicio ? "14px" : "8px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    boxShadow: "0 0 8px #ef4444",
                  }}
                />
              )}
            </li>
          );
        })}

        <li>
          <button
            onClick={handleBackupManual}
            disabled={cargandoBackup}
            style={{
              ...styles.li,
              backgroundColor: "transparent",
              color: "#cbd5e1",
              justifyContent: isInicio ? "flex-start" : "center",
              paddingLeft: isInicio ? "16px" : "0",
              width: isInicio ? "210px" : "48px",
              border: "none",
              cursor: cargandoBackup ? "not-allowed" : "pointer",
              opacity: cargandoBackup ? 0.7 : 1,
              marginTop: "4px",
            }}
          >
            <span style={styles.icono}>💾</span>
            {isInicio && (
              <span style={styles.textoModulo}>
                {cargandoBackup ? "Guardando..." : "Guardar"}
              </span>
            )}
          </button>
        </li>
      </ul>

      {toastNotificacion.visible && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toastNotificacion.error ? "#991b1b" : "#065f46",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            fontSize: "0.9rem",
            fontWeight: "600",
            zIndex: 10000,
            animation: "slideUpToast 0.3s ease forwards",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{toastNotificacion.error ? "⚠️" : "✅"}</span>
          <span>{toastNotificacion.mensaje}</span>
        </div>
      )}
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
