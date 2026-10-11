import { useState } from "react";

export default function Sidebar({ activeSection, setActiveSection }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredTop, setHoveredTop] = useState(0);

  const isInicio = activeSection === "inicio";

  const modulos = [
    { id: "nuevo-trabajo", nombre: "Nuevo trabajo", icono: "➕" },
    { id: "resumen", nombre: "Resumen / General", icono: "📊" },
    { id: "clientes", nombre: "Clientes y Campos", icono: "🌾" },
    { id: "insumos", nombre: "Insumos", icono: "🛢️" },
    { id: "maquinas", nombre: "Máquinas", icono: "🚜" },
    { id: "empleados", nombre: "Empleados", icono: "👷" },

    { id: "proveedores", nombre: "Proveedores", icono: "📦" },
    { id: "turnos", nombre: "Turnos", icono: "📅" },
  ];

  const handleMouseEnter = (e, id) => {
    if (!isInicio) {
      const rect = e.currentTarget.getBoundingClientRect();
      setHoveredTop(rect.top);
      setHoveredId(id);
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
          @keyframes abrirCajon {
            0% {
              opacity: 0;
              transform: translateX(-15px) scaleX(0.9);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scaleX(1);
            }
          }
        `}
      </style>

      <ul style={styles.ul}>
        {modulos.map((mod) => {
          const isActive = activeSection === mod.id;
          const isHovered = hoveredId === mod.id;

          return (
            <li
              key={mod.id}
              onClick={() => setActiveSection(mod.id)}
              onMouseEnter={(e) => handleMouseEnter(e, mod.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                ...styles.li,
                backgroundColor: isActive
                  ? "#2563eb"
                  : isHovered && !isInicio
                    ? "#334155"
                    : "transparent",
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
            </li>
          );
        })}
      </ul>

      {!isInicio && hoveredId && (
        <div
          style={{
            ...styles.cajonFlotante,
            top: `${hoveredTop}px`,
          }}
        >
          {modulos.find((m) => m.id === hoveredId)?.nombre}
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
  cajonFlotante: {
    position: "fixed",
    left: "78px",
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "0 8px 8px 0",
    fontSize: "0.9rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    boxShadow: "4px 10px 25px rgba(0, 0, 0, 0.4)",
    border: "1px solid #334155",
    borderLeft: "3px solid #2563eb",
    zIndex: 9999,
    pointerEvents: "none",
    transformOrigin: "left center",
    animation: "abrirCajon 0.2s cubic-bezier(0, 0, 0.2, 1) forwards",
  },
};
