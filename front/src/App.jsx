import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ClientesCampos from "./components/ClientesCampos";
import fondo from "./assets/fondo.png";
import "./App.css";

export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");

  return (
    <div className="app-container">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="main-layout">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main
          className="content-area"
          style={{
            backgroundImage:
              activeSection === "inicio" ? `url(${fondo})` : "none",
          }}
        >
          {activeSection === "inicio" && (
            <div className="welcome-screen-clean"></div>
          )}
          {activeSection === "clientes" && <ClientesCampos />}
          {activeSection === "resumen" && <h2>Panel de Resumen General</h2>}
          {activeSection === "maquinas" && (
            <h2>Control de Máquinas y Services</h2>
          )}
          {activeSection === "empleados" && (
            <h2>Gestión de Empleados y Pagos</h2>
          )}
          {activeSection === "insumos" && (
            <h2>Control de Stock (Gasoil y Aceites)</h2>
          )}
          {activeSection === "proveedores" && <h2>Proveedores y Compras</h2>}
          {activeSection === "contador" && <h2>Módulo de Contador e IVA</h2>}
          {activeSection === "turnos" && <h2>Agenda de Turnos</h2>}
        </main>
      </div>
    </div>
  );
}
