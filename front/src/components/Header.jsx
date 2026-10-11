import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Header({ activeSection, setActiveSection }) {
  const [fechaHora, setFechaHora] = useState("");

  // Mapa de nombres legibles para cada módulo
  const titulosModulos = {
    inicio: "Inicio",
    clientes: "Clientes y Campos",
    resumen: "Resumen / General",
    maquinas: "Máquinas",
    empleados: "Empleados",
    insumos: "Insumos",
    proveedores: "Proveedores",
    contador: "Contador",
    turnos: "Turnos",
  };

  useEffect(() => {
    const actualizarFechaHora = () => {
      const ahora = new Date();

      // Formatear día y fecha (Ej: "Sábado, 10 de octubre")
      const fechaFormateada = ahora.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      // Formatear hora (Ej: "17:10 hs")
      const horaFormateada = ahora.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Capitalizar la primera letra del día de la semana
      const fechaCapitalizada =
        fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

      setFechaHora(`${fechaCapitalizada} - ${horaFormateada} hs`);
    };

    actualizarFechaHora();
    const interval = setInterval(actualizarFechaHora, 1000); // Actualiza cada segundo

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header-container">
      {/* Izquierda: Logo */}
      <div className="header-left">
        <div
          className="clickable-logo"
          onClick={() => setActiveSection("inicio")}
        >
          <img src={logo} alt="Pulverización Amanda" className="logo" />
        </div>
      </div>

      {/* Centro: Título del Módulo Seleccionado */}
      <div
        className="header-center"
        style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#38bdf8" }}
      >
        <span>{titulosModulos[activeSection] || "Inicio"}</span>
      </div>

      {/* Derecha: Fecha y Hora en vivo */}
      <div
        className="header-right"
        style={{ fontSize: "1rem", color: "#e2e8f0" }}
      >
        <span>{fechaHora}</span>
      </div>
    </header>
  );
}
