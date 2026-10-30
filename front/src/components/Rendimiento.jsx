import { useState, useEffect } from "react";
import api from "../services/api";

export default function Rendimiento() {
  const [trabajos, setTrabajos] = useState([]);
  const [ingresosInsumos, setIngresosInsumos] = useState([]);
  const [retirosInsumos, setRetirosInsumos] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [filtroTipo, setFiltroTipo] = useState("mes");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [toleranciaTraslado, setToleranciaTraslado] = useState(15);

  useEffect(() => {
    const fetchRendimientoData = async () => {
      try {
        setCargando(true);
        const [resTrabajos, resIngresos, resRetiros, resInsumos, resMaquinas] =
          await Promise.all([
            api.get("/trabajos").catch(() => ({ data: [] })),
            api.get("/insumos/ingresos").catch(() => ({ data: [] })),
            api.get("/insumos/retiros").catch(() => ({ data: [] })),
            api.get("/insumos").catch(() => ({ data: [] })),
            api.get("/maquinas").catch(() => ({ data: [] })),
          ]);

        setTrabajos(resTrabajos.data || []);
        setIngresosInsumos(resIngresos.data || []);
        setRetirosInsumos(resRetiros.data || []);
        setInsumos(resInsumos.data || []);
        setMaquinas(resMaquinas.data || []);
      } catch (error) {
        console.error("Error al cargar datos de rendimiento:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchRendimientoData();
  }, []);

  const filtrarPorFecha = (fechaStr) => {
    if (!fechaStr || filtroTipo === "todo") return true;
    const fechaItem = fechaStr.split("T")[0];

    if (filtroTipo === "dia") {
      return fechaItem === fechaSeleccionada;
    }
    if (filtroTipo === "mes") {
      return fechaItem.substring(0, 7) === fechaSeleccionada.substring(0, 7);
    }
    if (filtroTipo === "semana") {
      if (fechaDesde && fechaItem < fechaDesde) return false;
      if (fechaHasta && fechaItem > fechaHasta) return false;
      return true;
    }
    return true;
  };

  const trabajosFiltrados = trabajos.filter((t) => filtrarPorFecha(t.fecha));
  const ingresosFiltrados = ingresosInsumos.filter((i) =>
    filtrarPorFecha(i.fecha || i.fecha_ingreso),
  );
  const retirosFiltrados = retirosInsumos.filter((r) =>
    filtrarPorFecha(r.fecha || r.fecha_retiro),
  );

  const idsGasoil = insumos
    .filter((i) => (i.nombre || "").toLowerCase().includes("gasoil"))
    .map((i) => Number(i.id));

  const totalHectareas = trabajosFiltrados.reduce(
    (acc, t) => acc + (Number(t.cantidad_hectareas) || 0),
    0,
  );

  const ingresosGasoilFiltrados = ingresosFiltrados.filter((i) =>
    idsGasoil.includes(Number(i.insumo_id || i.insumoId)),
  );

  const totalGastoGasoilPesos = ingresosGasoilFiltrados.reduce(
    (acc, i) => acc + (Number(i.monto_total || i.montoTotal || i.monto) || 0),
    0,
  );

  const totalLitrosGasoilCargados = ingresosGasoilFiltrados.reduce(
    (acc, i) => acc + (Number(i.cantidad) || 0),
    0,
  );

  const formatearNombreMaquina = (nombre) => {
    if (!nombre) return "";
    const palabras = nombre.trim().split(" ");
    const renglones = [];
    for (let i = 0; i < palabras.length; i += 2) {
      renglones.push(palabras.slice(i, i + 2).join(" "));
    }
    return renglones.map((renglon, idx) => (
      <span key={idx} style={{ display: "block" }}>
        {renglon}
      </span>
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.titulo}>Rendimiento y Eficiencia Operativa</h2>
          <p style={styles.subtitulo}>Monitoreo y análisis por máquina.</p>
        </div>

        <div style={styles.filtrosBar}>
          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value);
              if (e.target.value === "semana") {
                setFechaDesde("");
                setFechaHasta("");
              }
            }}
            style={styles.selectFiltro}
          >
            <option value="dia">Por Día</option>
            <option value="semana">Por Semana (Rango)</option>
            <option value="mes">Por Mes</option>
            <option value="todo">Histórico Completo</option>
          </select>

          {filtroTipo === "dia" && (
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              style={styles.inputFecha}
            />
          )}

          {filtroTipo === "mes" && (
            <input
              type="month"
              value={fechaSeleccionada.substring(0, 7)}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              style={styles.inputFecha}
            />
          )}

          {filtroTipo === "semana" && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                style={styles.inputFecha}
              />
              <span style={{ color: "#64748b", fontWeight: "700" }}>a</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                style={styles.inputFecha}
              />
            </div>
          )}
        </div>
      </div>

      {cargando ? (
        <div style={styles.loading}>Cargando datos...</div>
      ) : (
        <>
          <div style={styles.kpiGridCompacto}>
            <div style={styles.kpiCardMin}>
              <span style={styles.kpiLabelMin}>Hectáreas Realizadas:</span>
              <span style={styles.kpiValueMin}>
                {totalHectareas.toLocaleString()} ha
              </span>
            </div>
            <div style={styles.kpiCardMin}>
              <span style={styles.kpiLabelMin}>Gasoil Cargado:</span>
              <span style={styles.kpiValueMin}>
                {totalLitrosGasoilCargados.toLocaleString()} L
              </span>
            </div>
            <div style={styles.kpiCardMin}>
              <span style={styles.kpiLabelMin}>Inversión Gasoil:</span>
              <span style={styles.kpiValueMin}>
                ${totalGastoGasoilPesos.toLocaleString()}
              </span>
            </div>
          </div>

          <div style={styles.graficosGridTablet}>
            {/* Tabla 1: Total de Hectáreas y Total de Gasoil */}
            <div style={styles.cardBox}>
              <h3 style={styles.cardTitleConEspacio}>
                Total de Hectáreas y Total de Gasoil
              </h3>
              <div style={styles.verticalChartContainer}>
                {maquinas.map((maq) => {
                  const haMaq = trabajosFiltrados
                    .filter(
                      (t) =>
                        Number(t.maquina_id || t.maquinaId) === Number(maq.id),
                    )
                    .reduce(
                      (acc, t) => acc + (Number(t.cantidad_hectareas) || 0),
                      0,
                    );

                  const gasoilMaq = retirosFiltrados
                    .filter(
                      (r) =>
                        Number(r.maquina_id || r.maquinaId) ===
                          Number(maq.id) &&
                        idsGasoil.includes(Number(r.insumo_id || r.insumoId)),
                    )
                    .reduce((acc, r) => acc + (Number(r.cantidad) || 0), 0);

                  const maxValMaq = Math.max(haMaq, gasoilMaq, 10);
                  const altoHa = Math.min(
                    Math.round((haMaq / maxValMaq) * 100),
                    100,
                  );
                  const altoGasoil = Math.min(
                    Math.round((gasoilMaq / maxValMaq) * 100),
                    100,
                  );

                  return (
                    <div key={maq.id} style={styles.verticalColGroup}>
                      <div style={styles.columnsWrapper}>
                        <div style={styles.columnContainer}>
                          <span style={styles.colValueTag}>{haMaq}</span>
                          <div style={styles.columnTrack}>
                            <div
                              style={{
                                ...styles.columnFill,
                                height: `${altoHa}%`,
                                backgroundColor: "#0284c7",
                              }}
                            ></div>
                          </div>
                        </div>
                        <div style={styles.columnContainer}>
                          <span style={styles.colValueTag}>{gasoilMaq}L</span>
                          <div style={styles.columnTrack}>
                            <div
                              style={{
                                ...styles.columnFill,
                                height: `${altoGasoil}%`,
                                backgroundColor: "#d97706",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.columnLabelMaqMultiLine}>
                        {formatearNombreMaquina(maq.nombre || maq.patente)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.leyendaGrafico}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      ...styles.puntoLeyenda,
                      backgroundColor: "#0284c7",
                    }}
                  ></span>{" "}
                  Hectáreas
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      ...styles.puntoLeyenda,
                      backgroundColor: "#d97706",
                    }}
                  ></span>{" "}
                  Gasoil
                </span>
              </div>
            </div>

            {/* Tabla 2: Hectáreas por litro (Óptimo, Esperado y Línea Real Roja estables y proporcionadas) */}
            <div style={styles.cardBox}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <h3 style={styles.cardTitle}>
                  Hectáreas por litro (Niveles de Rendimiento)
                </h3>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "750",
                      color: "#475569",
                    }}
                  >
                    Traslado (%):
                  </span>
                  <input
                    type="number"
                    value={toleranciaTraslado}
                    onChange={(e) =>
                      setToleranciaTraslado(Number(e.target.value))
                    }
                    style={styles.inputConfigInline}
                  />
                </div>
              </div>
              <div style={{ height: "4px" }}></div>

              <div style={styles.verticalChartContainer}>
                {maquinas.map((maq) => {
                  const haMaq = trabajosFiltrados
                    .filter(
                      (t) =>
                        Number(t.maquina_id || t.maquinaId) === Number(maq.id),
                    )
                    .reduce(
                      (acc, t) => acc + (Number(t.cantidad_hectareas) || 0),
                      0,
                    );

                  const gasoilMaq = retirosFiltrados
                    .filter(
                      (r) =>
                        Number(r.maquina_id || r.maquinaId) ===
                          Number(maq.id) &&
                        idsGasoil.includes(Number(r.insumo_id || r.insumoId)),
                    )
                    .reduce((acc, r) => acc + (Number(r.cantidad) || 0), 0);

                  const optimoHa =
                    gasoilMaq > 0 ? gasoilMaq : haMaq > 0 ? haMaq : 1;
                  const factorDiferencia = 100 - toleranciaTraslado;
                  const esperadoHa = Math.round(
                    optimoHa * (factorDiferencia / 100),
                  );

                  // Porcentajes relativos internos para la barra de 2 colores de esta máquina
                  const porcentajeEsperadoRelativo =
                    optimoHa > 0
                      ? Math.min(Math.round((esperadoHa / optimoHa) * 100), 100)
                      : 0;
                  const porcentajeOptimoRelativo =
                    100 - porcentajeEsperadoRelativo;

                  // Posición porcentual de la línea real dentro de su propia barra (100% = óptimo)
                  const porcentajeRealPosicion =
                    optimoHa > 0
                      ? Math.min(Math.round((haMaq / optimoHa) * 100), 100)
                      : 0;

                  const diferenciaPorcentual =
                    esperadoHa > 0
                      ? Math.round(((haMaq - esperadoHa) / esperadoHa) * 100)
                      : 0;
                  const signoPorcentaje =
                    diferenciaPorcentual >= 0
                      ? `+${diferenciaPorcentual}%`
                      : `${diferenciaPorcentual}%`;

                  return (
                    <div key={maq.id} style={styles.verticalColGroup}>
                      <div style={styles.columnsWrapperSingle}>
                        <div style={styles.columnContainerSingle}>
                          <span style={styles.colValueTag}>
                            Opt: {optimoHa} ha
                          </span>

                          <div style={styles.columnTrackStackFixed}>
                            <div
                              style={{
                                width: "100%",
                                height: `${porcentajeEsperadoRelativo}%`,
                                backgroundColor: "#16a34a",
                              }}
                              title={`Esperado: ${esperadoHa} ha`}
                            ></div>
                            <div
                              style={{
                                width: "100%",
                                height: `${porcentajeOptimoRelativo}%`,
                                backgroundColor: "#64748b",
                              }}
                              title={`Óptimo: ${optimoHa} ha`}
                            ></div>

                            {/* Línea horizontal ROJA posicionada proporcionalmente a su propia escala */}
                            <div
                              style={{
                                ...styles.lineaRealHorizontalRoja,
                                bottom: `${porcentajeRealPosicion}%`,
                              }}
                              title={`Real: ${haMaq} ha (${signoPorcentaje})`}
                            >
                              <span style={styles.etiquetaRealLineaRoja}>
                                {haMaq} ha
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={styles.columnLabelMaqMultiLineGrande}>
                        {formatearNombreMaquina(maq.nombre || maq.patente)}
                        <span style={styles.subLabelEsperado}>
                          Esp: <b>{esperadoHa} ha</b>
                        </span>
                        <span style={styles.subLabelReal}>
                          Real: <b>{haMaq} ha</b>{" "}
                          <span
                            style={{
                              color:
                                diferenciaPorcentual >= 0
                                  ? "#16a34a"
                                  : "#dc2626",
                            }}
                          >
                            ({signoPorcentaje})
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.leyendaGrafico}>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      ...styles.puntoLeyenda,
                      backgroundColor: "#64748b",
                    }}
                  ></span>{" "}
                  Óptimo
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      ...styles.puntoLeyenda,
                      backgroundColor: "#16a34a",
                    }}
                  ></span>{" "}
                  Esperado
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      ...styles.puntoLeyenda,
                      backgroundColor: "#dc2626",
                    }}
                  ></span>{" "}
                  Línea Real (ha)
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    maxWidth: "950px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  titulo: {
    fontSize: "1.9rem",
    fontWeight: "950",
    color: "#0f172a",
    margin: 0,
  },
  subtitulo: {
    fontSize: "0.95rem",
    color: "#64748b",
    marginTop: "4px",
  },
  filtrosBar: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  selectFiltro: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "2px solid #cbd5e1",
    fontSize: "0.95rem",
    fontWeight: "700",
    backgroundColor: "#fff",
    color: "#0f172a",
    outline: "none",
  },
  inputFecha: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "2px solid #cbd5e1",
    fontSize: "0.95rem",
    fontWeight: "700",
    backgroundColor: "#fff",
    color: "#0f172a",
    outline: "none",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#64748b",
  },
  kpiGridCompacto: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  kpiCardMin: {
    backgroundColor: "#f8fafc",
    padding: "12px 18px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flex: 1,
    minWidth: "220px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.01)",
  },
  kpiLabelMin: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#64748b",
  },
  kpiValueMin: {
    fontSize: "1.1rem",
    fontWeight: "900",
    color: "#0f172a",
  },
  inputConfigInline: {
    width: "60px",
    padding: "6px",
    borderRadius: "8px",
    border: "2px solid #cbd5e1",
    fontWeight: "700",
    textAlign: "center",
    fontSize: "0.9rem",
    outline: "none",
  },
  graficosGridTablet: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    marginBottom: "32px",
  },
  cardBox: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid #e2e8f0",
    boxShadow: "0 6px 16px rgba(0,0,0,0.03)",
    width: "100%",
    boxSizing: "border-box",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "900",
    color: "#0f172a",
    margin: 0,
  },
  cardTitleConEspacio: {
    fontSize: "1.2rem",
    fontWeight: "900",
    color: "#0f172a",
    margin: 0,
    marginBottom: "20px",
  },
  verticalChartContainer: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: "320px",
    backgroundColor: "#f8fafc",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "300px 12px 75px 12px",
    gap: "16px",
    overflowX: "auto",
  },
  verticalColGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    flex: 1,
    minWidth: "95px",
  },
  columnsWrapper: {
    display: "flex",
    gap: "8px",
    height: "190px",
    alignItems: "flex-end",
    width: "100%",
    justifyContent: "center",
  },
  columnsWrapperSingle: {
    display: "flex",
    height: "190px",
    alignItems: "flex-end",
    width: "100%",
    justifyContent: "center",
  },
  columnContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    flex: 1,
  },
  columnContainerSingle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    width: "75px",
  },
  colValueTag: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "6px",
    whiteSpace: "nowrap",
  },
  columnTrack: {
    width: "100%",
    height: "160px",
    backgroundColor: "#e2e8f0",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  columnTrackStackFixed: {
    width: "100%",
    height: "160px",
    backgroundColor: "#e2e8f0",
    borderRadius: "8px 8px 0 0",
    display: "flex",
    flexDirection: "column-reverse",
    overflow: "hidden",
    position: "relative",
  },
  columnFill: {
    width: "100%",
    borderRadius: "8px 8px 0 0",
    transition: "height 0.5s ease",
  },
  lineaRealHorizontalRoja: {
    position: "absolute",
    left: "-6px",
    right: "-6px",
    height: "5px",
    backgroundColor: "#dc2626",
    zIndex: 20,
    boxShadow: "0 0 8px rgba(220, 38, 38, 0.95)",
    borderRadius: "2px",
  },
  etiquetaRealLineaRoja: {
    position: "absolute",
    right: "-48px",
    top: "-11px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    fontSize: "0.65rem",
    padding: "2px 5px",
    borderRadius: "4px",
    fontWeight: "900",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
  },
  columnLabelMaqMultiLineGrande: {
    height: "75px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "8px",
    width: "100%",
    fontSize: "0.75rem",
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: "1.2",
  },
  subLabelEsperado: {
    fontSize: "0.7rem",
    color: "#334155",
    fontWeight: "700",
    marginTop: "3px",
  },
  subLabelReal: {
    fontSize: "0.7rem",
    color: "#0f172a",
    fontWeight: "800",
    marginTop: "2px",
  },
  columnLabelMaqMultiLine: {
    height: "75px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: "8px",
    width: "100%",
    fontSize: "0.75rem",
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: "1.2",
  },
  leyendaGrafico: {
    display: "flex",
    gap: "24px",
    marginTop: "16px",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#475569",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  puntoLeyenda: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    display: "inline-block",
  },
};
