import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Header({ activeSection, setActiveSection }) {
  const [fechaHora, setFechaHora] = useState("");

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

      // Obtener horas y minutos en formato 24h estricto con ceros iniciales
      const horas = String(ahora.getHours()).padStart(2, "0");
      const minutos = String(ahora.getMinutes()).padStart(2, "0");
      const horaFormateada = `${horas}:${minutos}`;

      const fechaCapitalizada =
        fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

      setFechaHora(`${fechaCapitalizada}\n${horaFormateada}`);
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

      <div
        className="header-right"
        style={{
          fontSize: "1rem",
          color: "#e2e8f0",
          whiteSpace: "pre-line",
          textAlign: "right",
        }}
      >
        <span>{fechaHora}</span>
      </div>
    </header>
  );
}
