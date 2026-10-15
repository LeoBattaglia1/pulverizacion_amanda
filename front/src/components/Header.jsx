import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

export default function Header({ activeSection, setActiveSection }) {
  const [fechaData, setFechaData] = useState({ fecha: "", hora: "" });
  const [climaPronostico, setClimaPronostico] = useState([]);
  const [estadoClima, setEstadoClima] = useState("Cargando...");

  const isInicio = activeSection === "inicio";

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

  // 1. Reloj de Fecha y Hora local[cite: 1]
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

  // 2. Consumo por Coordenadas (Ayacucho, Buenos Aires) para mayor estabilidad[cite: 1]
  useEffect(() => {
    const obtenerClimaOpenWeather = async () => {
      try {
        const apiKey = "25f11e1d61bf1271dbec86e032a44939";
        // Coordenadas exactas de Ayacucho para evitar errores de búsqueda por nombre
        const lat = -37.15;
        const lon = -58.48;

        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${apiKey}`;

        const respuesta = await fetch(url);
        if (!respuesta.ok)
          throw new Error("Error al conectar con OpenWeatherMap");

        const data = await respuesta.json();

        const diasAgrupados = {};
        const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        data.list.forEach((item) => {
          const fechaTexto = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
          if (!diasAgrupados[fechaTexto]) {
            diasAgrupados[fechaTexto] = {
              temps: [],
              descripciones: [],
              iconos: [],
            };
          }
          diasAgrupados[fechaTexto].temps.push(item.main.temp);
          diasAgrupados[fechaTexto].descripciones.push(
            item.weather[0].description,
          );
          diasAgrupados[fechaTexto].iconos.push(item.weather[0].icon);
        });

        const pronostico5Dias = Object.keys(diasAgrupados)
          .slice(0, 5)
          .map((fechaStr, index) => {
            const diaData = diasAgrupados[fechaStr];
            const max = Math.round(Math.max(...diaData.temps));
            const min = Math.round(Math.min(...diaData.temps));

            const desc = diaData.descripciones[0];

            const iconoRaw = diaData.iconos[0];
            let emoji = "☁️";
            if (iconoRaw.includes("01")) emoji = "☀️";
            else if (
              iconoRaw.includes("02") ||
              iconoRaw.includes("03") ||
              iconoRaw.includes("04")
            )
              emoji = "⛅";
            else if (iconoRaw.includes("09") || iconoRaw.includes("10"))
              emoji = "🌧️";
            else if (iconoRaw.includes("11")) emoji = "⚡";

            const fechaObj = new Date(fechaStr + "T00:00:00");
            const nombreDia =
              index === 0 ? "Hoy" : diasSemana[fechaObj.getDay()];

            return {
              dia: nombreDia,
              max,
              min,
              descripcion: desc,
              icono: emoji,
            };
          });

        setClimaPronostico(pronostico5Dias);
        setEstadoClima("OK");
      } catch (error) {
        console.error("Error OpenWeather:", error);
        setEstadoClima("Error de conexión");
        setClimaPronostico([]);
      }
    };

    obtenerClimaOpenWeather();
    const intervaloClima = setInterval(obtenerClimaOpenWeather, 600000); // Cada 10 minutos[cite: 1]
    return () => clearInterval(intervaloClima);
  }, []);

  return (
    <header
      className="header-container"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* Izquierda: Logo[cite: 1] */}
      <div className="header-left">
        <div
          className="clickable-logo"
          onClick={() => setActiveSection("inicio")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="Pulverización Amanda" className="logo" />
        </div>
      </div>

      {/* Centro: Widget de Pronóstico Extendido OpenWeatherMap */}
      <div
        className="header-center"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          zIndex: 4,
        }}
      >
        {isInicio ? (
          <a
            href="https://www.accuweather.com/es/ar/ayacucho/7382/weather-forecast/7382"
            target="_blank"
            rel="noopener noreferrer"
            title="Click para ver pronóstico detallado en la web"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(30, 41, 59, 0.75)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              padding: "5px 12px",
              borderRadius: "12px",
              backdropFilter: "blur(6px)",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.7)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)")
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRight: "1px solid rgba(148, 163, 184, 0.25)",
                paddingRight: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#38bdf8",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Ayacucho 📍
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#f8fafc",
                  fontWeight: "600",
                }}
              >
                5 Días
              </span>
            </div>

            {estadoClima === "OK" && climaPronostico.length > 0 ? (
              <div style={{ display: "flex", gap: "6px" }}>
                {climaPronostico.map((p, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      backgroundColor: "rgba(15, 23, 42, 0.5)",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      minWidth: "62px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem" }}>{p.icono}</span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: "#94a3b8",
                          fontWeight: "600",
                        }}
                      >
                        {p.dia}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#ffffff",
                        fontWeight: "700",
                      }}
                    >
                      {p.max}° /{" "}
                      <span style={{ color: "#94a3b8" }}>{p.min}°</span>
                    </span>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        color: "#38bdf8",
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "60px",
                      }}
                    >
                      {p.descripcion}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span
                style={{
                  fontSize: "0.8rem",
                  color:
                    estadoClima === "Error de conexión" ? "#ef4444" : "#f8fafc",
                  fontWeight: "600",
                  padding: "0 10px",
                }}
              >
                {estadoClima}
              </span>
            )}
          </a>
        ) : (
          <span
            style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#38bdf8" }}
          >
            {titulosModulos[activeSection] || ""}
          </span>
        )}
      </div>

      {/* Derecha: Fecha y Hora[cite: 1] */}
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
          zIndex: 5,
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
