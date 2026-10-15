import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Header({ activeSection, setActiveSection }) {
  const [fechaData, setFechaData] = useState({ fecha: "", hora: "" });

  const titulosModulos = {
    "nuevo-trabajo": "Nuevo trabajo",
    clientes: "Clientes y Campos",
    resumen: "Resumen / General",
    maquinas: "Máquinas",
    empleados: "Empleados",
    insumos: "Insumos",
    proveedores: "Proveedores",
    turnos: "Turnos",
  };

  useEffect(() => {
    const actualizarFechaHora = () => {
      const ahora = new Date();

      const fechaFormateada = ahora.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const horas = String(ahora.getHours()).padStart(2, "0");
      const minutos = String(ahora.getMinutes()).padStart(2, "0");

      const fechaCapitalizada =
        fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

      setFechaData({
        fecha: fechaCapitalizada,
        hora: `${horas}:${minutos}`,
      });
    };

    actualizarFechaHora();
    const interval = setInterval(actualizarFechaHora, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header-container">
      <div className="header-left">
        <div
          className="clickable-logo"
          onClick={() => setActiveSection("inicio")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="Pulverización Amanda" className="logo" />
        </div>
      </div>

      <div
        className="header-center"
        style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#38bdf8" }}
      >
        <span>{titulosModulos[activeSection] || ""}</span>
      </div>

      {/* Bloque estético de Fecha y Hora con efecto visual */}
      <div
        className="header-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          border: "1px solid rgba(56, 189, 248, 0.2)",
          padding: "6px 14px",
          borderRadius: "10px",
          boxShadow:
            "inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(6px)",
        }}
      >
        <span
          style={{
            fontSize: "0.9rem",
            color: "#94a3b8",
            fontWeight: "500",
            borderRight: "1px solid rgba(148, 163, 184, 0.2)",
            paddingRight: "12px",
            textTransform: "capitalize",
          }}
        >
          {fechaData.fecha}
        </span>
        <span
          style={{
            fontSize: "1.05rem",
            color: "#38bdf8",
            fontWeight: "700",
            letterSpacing: "0.5px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fechaData.hora}
        </span>
      </div>
    </header>
  );
}
