import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ClientesCampos from "./components/ClientesCampos";
import Resumen from "./components/Resumen";
import Insumos from "./components/Insumos";
import Trabajos from "./components/Trabajos";
import Maquinas from "./components/Maquinas";
import Empleados from "./components/Empleados";
import Turnos from "./components/Turnos";
import Proveedores from "./components/Proveedores";
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
          {activeSection === "nuevo-trabajo" && <Trabajos />}
          {activeSection === "resumen" && <Resumen />}
          {activeSection === "clientes" && <ClientesCampos />}
          {activeSection === "insumos" && <Insumos />}
          {activeSection === "maquinas" && <Maquinas />}
          {activeSection === "empleados" && <Empleados />}
          {activeSection === "proveedores" && <Proveedores />}
          {activeSection === "turnos" && <Turnos />}
        </main>
      </div>
    </div>
  );
}
