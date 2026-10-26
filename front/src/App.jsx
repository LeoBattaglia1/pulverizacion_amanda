import { useState, useEffect } from "react";
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
import mascotaGif from "./assets/mascota.gif";
import api from "./services/api";
import "./App.css";

export default function App() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [insumosBajoStock, setInsumosBajoStock] = useState([]);
  const [mostrarMascota, setMostrarMascota] = useState(false);
  const [mostrarBocadillo, setMostrarBocadillo] = useState(false);
  const [animandoSalida, setAnimandoSalida] = useState(false);

  // Función centralizada para navegar y controlar la mascota al volver a inicio
  const handleCambiarSeccion = (seccion) => {
    setActiveSection(seccion);

    if (seccion === "inicio") {
      verificarStockYMostrar();
    } else {
      // Ocultamos de inmediato al entrar a cualquier módulo sin usar useEffect para estados
      setMostrarMascota(false);
      setMostrarBocadillo(false);
      setAnimandoSalida(false);
    }
  };

  const verificarStockYMostrar = async () => {
    try {
      const res = await api.get("/insumos");
      if (res.data && Array.isArray(res.data)) {
        const faltantes = res.data.filter((item) => {
          const stockNum = parseFloat(item.stock_actual ?? item.stock) || 0;
          return stockNum <= 200;
        });

        setInsumosBajoStock(faltantes);

        if (faltantes.length > 0) {
          setAnimandoSalida(false);
          setMostrarMascota(true);
          setMostrarBocadillo(true);

          // A los 5 segundos inicia la animación de salida (humo de 1 segundo)
          setTimeout(() => {
            setAnimandoSalida(true);
          }, 5000);

          // A los 6 segundos se ocultan y desmontan por completo
          setTimeout(() => {
            setMostrarMascota(false);
            setMostrarBocadillo(false);
            setAnimandoSalida(false);
          }, 8000);
        } else {
          setMostrarMascota(false);
          setMostrarBocadillo(false);
        }
      }
    } catch (error) {
      console.error("Error al consultar stock de insumos:", error);
    }
  };

  // Verificación inicial al cargar la app
  useEffect(() => {
    verificarStockYMostrar();
  }, []);

  return (
    <div className="app-container" style={{ position: "relative" }}>
      {/* Animaciones CSS de entrada y salida con efecto humo/desvanecimiento */}
      <style>
        {`
          @keyframes humoAparicion {
            0% {
              opacity: 0;
              transform: scale(0.2) translateY(-30px);
              filter: blur(15px) brightness(2);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1) translateY(5px);
              filter: blur(5px) brightness(1.3);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0px) brightness(1);
            }
          }

          @keyframes humoSalida {
            0% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0px);
            }
            100% {
              opacity: 0;
              transform: scale(0.3) translateY(-25px);
              filter: blur(12px) brightness(1.8);
            }
          }

          @keyframes flotarLento {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          @keyframes aparecerBocadillo {
            from {
              opacity: 0;
              transform: scale(0.8) translateY(10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>

      {/* Mascota y cartel (salen juntos con la animación de humo a los 6s) */}
      {mostrarMascota && activeSection === "inicio" && (
        <div
          style={{
            ...styles.contenedorMascotaArriba,
            animation: animandoSalida
              ? "humoSalida 1s cubic-bezier(0.4, 0, 0.2, 1) forwards"
              : "none",
          }}
          onClick={() => handleCambiarSeccion("insumos")}
          title="Clic para ir al módulo de Insumos"
        >
          {mostrarBocadillo && (
            <div style={styles.bocadilloAlerta}>
              <div style={styles.bocadilloTitulo}>
                ⚠️ ¡Atención! Stock bajo:
              </div>
              <ul style={styles.listaInsumos}>
                {insumosBajoStock.map((ins) => (
                  <li key={ins.id || ins.nombre} style={styles.itemInsumo}>
                    <span>{ins.nombre || ins.descripcion}</span>
                    <strong style={{ color: "#f87171" }}>
                      {ins.stock_actual} u.
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <img
            src={mascotaGif}
            alt="Mascota Alerta"
            style={styles.imagenMascotaGrande}
          />
        </div>
      )}

      <Header
        activeSection={activeSection}
        setActiveSection={handleCambiarSeccion}
      />
      <div className="main-layout">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={handleCambiarSeccion}
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

const styles = {
  contenedorMascotaArriba: {
    position: "fixed",
    top: "90px",
    right: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    cursor: "pointer",
    zIndex: 9999,
  },
  imagenMascotaGrande: {
    width: "90px",
    height: "90px",
    objectFit: "contain",
    animation:
      "humoAparicion 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, flotarLento 4.5s ease-in-out infinite 1.2s",
    filter: "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.7))",
  },
  bocadilloAlerta: {
    position: "absolute",
    top: "90px",
    right: "0px",
    backgroundColor: "#1e293b",
    border: "1px solid #38bdf8",
    borderRadius: "12px",
    padding: "10px 14px",
    minWidth: "200px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.7)",
    animation: "aparecerBocadillo 0.3s ease forwards",
    zIndex: 10000,
  },
  bocadilloTitulo: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#f87171",
    marginBottom: "6px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "4px",
  },
  listaInsumos: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    maxHeight: "120px",
    overflowY: "auto",
  },
  itemInsumo: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.78rem",
    color: "#f8fafc",
    padding: "3px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    gap: "12px",
  },
};
