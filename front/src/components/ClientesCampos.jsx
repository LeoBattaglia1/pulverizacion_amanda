import { useState, useEffect, useMemo } from "react";
import api from "../services/api";

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  searchBarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: "20px",
    alignItems: "start",
  },
  cardLeft: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardRight: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    minHeight: "380px",
    position: "sticky",
    top: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "8px",
    borderBottom: "2px solid #e2e8f0",
    color: "#4a5568",
    fontSize: "0.85rem",
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #edf2f7",
    fontSize: "0.85rem",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    width: "100%",
  },
  btnPrimary: {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnSecondary: {
    padding: "8px 16px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  btnSuccess: {
    padding: "8px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  // Botón Historial con efectos atractivos de hover y gradiente
  btnHistorial: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
    transition: "all 0.2s ease",
  },
  btnFilter: (isActive) => ({
    padding: "6px 14px",
    backgroundColor: isActive ? "#2563eb" : "#e2e8f0",
    color: isActive ? "#fff" : "#334155",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.85rem",
  }),
  btnIconOnly: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "2px 6px",
  },
  // Tarjetas de campo con colores de fondo dinámicos y elegantes
  campoCard: (index) => {
    const paletaFondos = [
      "#f8fafc",
      "#fef3c7",
      "#ecfdf5",
      "#eff6ff",
      "#fdf4ff",
    ];
    const paletaBordes = [
      "#cbd5e1",
      "#fcd34d",
      "#6ee7b7",
      "#bfdbfe",
      "#f5d0fe",
    ];
    const bg = paletaFondos[index % paletaFondos.length];
    const border = paletaBordes[index % paletaBordes.length];
    return {
      padding: "10px 12px",
      border: `1px solid ${border}`,
      borderRadius: "6px",
      backgroundColor: bg,
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
    };
  },
  estadoCuentaBox: (hasDeuda) => ({
    padding: "10px 14px",
    borderRadius: "6px",
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: hasDeuda ? "#fef2f2" : "#f0fdf4",
    color: hasDeuda ? "#991b1b" : "#166534",
    border: `1px solid ${hasDeuda ? "#fecaca" : "#bbf7d0"}`,
    fontWeight: "600",
    fontSize: "0.9rem",
  }),
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
    textAlign: "left",
  },
  modalFullScreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modalFullScreenContent: {
    backgroundColor: "#ffffff",
    width: "95vw",
    height: "90vh",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    overflowY: "auto",
  },
};

export default function ClientesCampos() {
  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [pagosClientes, setPagosClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [filtroTipo, setFiltroTipo] = useState("todo");
  const [filtroMesSeleccionado, setFiltroMesSeleccionado] = useState("");
  const [filtroAnioSeleccionado, setFiltroAnioSeleccionado] = useState("");

  const [sortFieldTrabajo, setSortFieldTrabajo] = useState("fecha");
  const [sortOrderTrabajo, setSortOrderTrabajo] = useState("asc");
  const [sortOrderPago, setSortOrderPago] = useState("asc");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [modalCampoAbierto, setModalCampoAbierto] = useState(false);
  const [campoEditando, setCampoEditando] = useState(null);
  const [formCampoIndividual, setFormCampoIndividual] = useState({
    nombre: "",
    ubicacion: "",
  });
  const [nuevoLoteTexto, setNuevoLoteTexto] = useState("");

  const [modalLoteAbierto, setModalLoteAbierto] = useState(false);
  const [loteEditando, setLoteEditando] = useState(null);
  const [numeroLoteInput, setNumeroLoteInput] = useState("");

  const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);
  const [modalDeudaAbierto, setModalDeudaAbierto] = useState(false);

  const [modalCobroAbierto, setModalCobroAbierto] = useState(false);
  const [modalConfirmarCobroAbierto, setModalConfirmarCobroAbierto] =
    useState(false);
  const [trabajoACobrar, setTrabajoACobrar] = useState(null);
  const [formCobro, setFormCobro] = useState({
    hectareas: "",
    precioPorHa: "",
  });
  const [calculoCobro, setCalculoCobro] = useState(null);

  const [formCliente, setFormCliente] = useState({
    id: "",
    nombre: "",
    cuil: "",
    telefono: "",
  });
  const [formCampos, setFormCampos] = useState([
    { nombre: "", ubicacion: "", lotes: "" },
  ]);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [resCli, resCam, resLot, resTrab, resPagos, resMaq] =
        await Promise.all([
          api.get("/clientes"),
          api.get("/campos"),
          api.get("/lotes").catch(() => ({ data: [] })),
          api.get("/trabajos"),
          api.get("/pagos-clientes").catch(() => ({ data: [] })),
          api.get("/maquinas").catch(() => ({ data: [] })),
        ]);
      setClientes(resCli.data);
      setCampos(resCam.data);
      setLotes(resLot.data);
      setTrabajos(resTrab.data);
      setPagosClientes(resPagos.data);
      setMaquinas(resMaq.data);

      setClienteSeleccionado((prev) => {
        if (!prev) return null;
        return resCli.data.find((c) => c.id === prev.id) || null;
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const partes = fechaStr.split("T")[0].split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return fechaStr;
  };

  const clientesFiltrados = clientes.filter((cli) => {
    const term = busqueda.toLowerCase();
    return cli.nombre?.toLowerCase().includes(term);
  });

  const camposDelCliente = campos.filter(
    (c) => Number(c.cliente_id) === Number(clienteSeleccionado?.id),
  );
  const idsCamposCliente = camposDelCliente.map((c) => c.id);
  const lotesDelCliente = lotes.filter((l) =>
    idsCamposCliente.includes(Number(l.campo_id)),
  );
  const idsLotesCliente = lotesDelCliente.map((l) => l.id);

  const trabajosDelCliente = trabajos.filter((t) =>
    idsLotesCliente.includes(Number(t.lote_id)),
  );

  const pagosDelCliente = pagosClientes.filter((p) => {
    const trabajoRel = trabajos.find(
      (t) => Number(t.id) === Number(p.trabajo_id),
    );
    return trabajoRel && idsLotesCliente.includes(Number(trabajoRel.lote_id));
  });

  const deudasCliente = trabajosDelCliente.filter((t) => {
    const totalHa = Number(t.cantidad_hectareas) || 0;
    const pagadasHa = Number(t.total_hectareas_pagadas) || 0;
    return totalHa - pagadasHa > 0;
  });

  const opcionesMesesYAños = useMemo(() => {
    const fechas = [
      ...trabajosDelCliente.map((t) => t.fecha),
      ...pagosDelCliente.map((p) => p.fecha),
    ].filter(Boolean);

    const mesesSet = new Set();
    const aniosSet = new Set();

    fechas.forEach((f) => {
      const parteStr = f.split("T")[0];
      const [anio, mes] = parteStr.split("-");
      if (anio && mes) {
        mesesSet.add(`${anio}-${mes}`);
        aniosSet.add(anio);
      }
    });

    const mesesArray = Array.from(mesesSet).sort().reverse();
    const aniosArray = Array.from(aniosSet).sort().reverse();

    return { meses: mesesArray, anios: aniosArray };
  }, [trabajosDelCliente, pagosDelCliente]);

  const trabajosFiltradosHistorial = useMemo(() => {
    return trabajosDelCliente.filter((t) => {
      if (!t.fecha) return false;
      const partes = t.fecha.split("T")[0].split("-");
      const anio = partes[0];
      const mes = `${partes[0]}-${partes[1]}`;

      if (filtroTipo === "mes") return mes === filtroMesSeleccionado;
      if (filtroTipo === "anio") return anio === filtroAnioSeleccionado;
      return true;
    });
  }, [
    trabajosDelCliente,
    filtroTipo,
    filtroMesSeleccionado,
    filtroAnioSeleccionado,
  ]);

  const pagosFiltradosHistorial = useMemo(() => {
    return pagosDelCliente.filter((p) => {
      if (!p.fecha) return false;
      const partes = p.fecha.split("T")[0].split("-");
      const anio = partes[0];
      const mes = `${partes[0]}-${partes[1]}`;

      if (filtroTipo === "mes") return mes === filtroMesSeleccionado;
      if (filtroTipo === "anio") return anio === filtroAnioSeleccionado;
      return true;
    });
  }, [
    pagosDelCliente,
    filtroTipo,
    filtroMesSeleccionado,
    filtroAnioSeleccionado,
  ]);

  const handleSortTrabajo = (field) => {
    if (sortFieldTrabajo === field) {
      setSortOrderTrabajo(sortOrderTrabajo === "asc" ? "desc" : "asc");
    } else {
      setSortFieldTrabajo(field);
      setSortOrderTrabajo("asc");
    }
  };

  const trabajosOrdenados = useMemo(() => {
    return [...trabajosFiltradosHistorial].sort((a, b) => {
      let valA, valB;
      const loteA = lotes.find((l) => Number(l.id) === Number(a.lote_id));
      const campoA = campos.find(
        (c) => Number(c.id) === Number(loteA?.campo_id),
      );

      const loteB = lotes.find((l) => Number(l.id) === Number(b.lote_id));
      const campoB = campos.find(
        (c) => Number(c.id) === Number(loteB?.campo_id),
      );

      if (sortFieldTrabajo === "fecha") {
        valA = a.fecha || "";
        valB = b.fecha || "";
      } else if (sortFieldTrabajo === "campo") {
        valA = campoA?.nombre || "";
        valB = campoB?.nombre || "";
      } else if (sortFieldTrabajo === "lote") {
        valA = loteA?.numero_lote || "";
        valB = loteB?.numero_lote || "";
      } else if (sortFieldTrabajo === "tratamiento") {
        valA = a.tratamiento || "";
        valB = b.tratamiento || "";
      } else if (sortFieldTrabajo === "cultivo") {
        valA = a.tipo_cultivo || "";
        valB = b.tipo_cultivo || "";
      }

      if (valA < valB) return sortOrderTrabajo === "asc" ? -1 : 1;
      if (valA > valB) return sortOrderTrabajo === "asc" ? 1 : -1;
      return 0;
    });
  }, [
    trabajosFiltradosHistorial,
    sortFieldTrabajo,
    sortOrderTrabajo,
    lotes,
    campos,
  ]);

  const pagosOrdenados = useMemo(() => {
    return [...pagosFiltradosHistorial].sort((a, b) => {
      const valA = a.fecha || "";
      const valB = b.fecha || "";
      if (valA < valB) return sortOrderPago === "asc" ? -1 : 1;
      if (valA > valB) return sortOrderPago === "asc" ? 1 : -1;
      return 0;
    });
  }, [pagosFiltradosHistorial, sortOrderPago]);

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setFormCliente({ id: "", nombre: "", cuil: "", telefono: "" });
    setFormCampos([{ nombre: "", ubicacion: "", lotes: "" }]);
    setModalAbierto(true);
  };

  const abrirModalEdicionCliente = (cli) => {
    setModoEdicion(true);
    setFormCliente({
      id: cli.id,
      nombre: cli.nombre,
      cuil: cli.cuil,
      telefono: cli.telefono,
    });
    setModalAbierto(true);
  };

  const abrirModalEdicionCampo = (cmp) => {
    setCampoEditando(cmp);
    setFormCampoIndividual({
      nombre: cmp.nombre,
      ubicacion: cmp.ubicacion || "",
    });
    setNuevoLoteTexto("");
    setModalCampoAbierto(true);
  };

  const abrirModalLoteEdicion = (lote) => {
    setLoteEditando(lote);
    setNumeroLoteInput(lote.numero_lote);
    setModalLoteAbierto(true);
  };

  const guardarLoteIndividual = async (e) => {
    e.preventDefault();
    try {
      if (loteEditando) {
        await api
          .put(`/lotes/${loteEditando.id}`, {
            campo_id: loteEditando.campo_id,
            numero_lote: numeroLoteInput,
          })
          .catch(() => {});
        setLotes(
          lotes.map((l) =>
            l.id === loteEditando.id
              ? { ...l, numero_lote: numeroLoteInput }
              : l,
          ),
        );
      }
      setModalLoteAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar lote:", error);
    }
  };

  const agregarNuevoLoteEnCampo = async () => {
    if (!nuevoLoteTexto.trim() || !campoEditando) return;
    try {
      const res = await api.post("/lotes", {
        campo_id: campoEditando.id,
        numero_lote: nuevoLoteTexto.trim(),
      });
      setLotes([...lotes, res.data]);
      setNuevoLoteTexto("");
      cargarDatos();
    } catch (error) {
      console.error("Error al agregar nuevo lote:", error);
    }
  };

  const guardarCampoIndividual = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/campos/${campoEditando.id}`, {
        cliente_id: clienteSeleccionado.id,
        nombre: formCampoIndividual.nombre,
        ubicacion: formCampoIndividual.ubicacion,
      });
      setCampos(
        campos.map((c) =>
          c.id === campoEditando.id
            ? {
                ...c,
                nombre: formCampoIndividual.nombre,
                ubicacion: formCampoIndividual.ubicacion,
              }
            : c,
        ),
      );
      setModalCampoAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar campo:", error);
    }
  };

  const guardarClienteYCampos = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await api.put(`/clientes/${formCliente.id}`, formCliente);
        setClientes(
          clientes.map((c) =>
            c.id === formCliente.id ? { ...c, ...formCliente } : c,
          ),
        );
        if (clienteSeleccionado?.id === formCliente.id) {
          setClienteSeleccionado({ ...clienteSeleccionado, ...formCliente });
        }
      } else {
        const resCli = await api.post("/clientes", formCliente);
        const nuevoCliId = resCli.data.id;

        for (const camp of formCampos) {
          if (!camp.nombre) continue;
          const resCamp = await api.post("/campos", {
            cliente_id: nuevoCliId,
            nombre: camp.nombre,
            ubicacion: camp.ubicacion,
          });
          const nuevoCampId = resCamp.data.id;

          if (camp.lotes) {
            const listaLotes = camp.lotes.split(",").map((l) => l.trim());
            for (const lName of listaLotes) {
              await api
                .post("/lotes", {
                  campo_id: nuevoCampId,
                  numero_lote: lName,
                })
                .catch(() => {});
            }
          }
        }
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const abrirModalCobro = (trabajo) => {
    const totalHa = Number(trabajo.cantidad_hectareas) || 0;
    const pagadasHa = Number(trabajo.total_hectareas_pagadas) || 0;
    const pendienteHa = totalHa - pagadasHa;

    setTrabajoACobrar(trabajo);
    setFormCobro({
      hectareas: pendienteHa,
      precioPorHa: "",
    });
    setCalculoCobro(null);
    setModalCobroAbierto(true);
  };

  const calcularTotalesCobro = () => {
    const has = Number(formCobro.hectareas) || 0;
    const precio = Number(formCobro.precioPorHa) || 0;
    const subTotal = has * precio;
    const iva = subTotal * 0.105;
    const total = subTotal + iva;
    setCalculoCobro({ subTotal, iva, total });
  };

  const solicitarConfirmacionCobro = () => {
    setModalCobroAbierto(false);
    setModalConfirmarCobroAbierto(true);
  };

  const confirmarCobroFinal = async () => {
    if (!calculoCobro || !trabajoACobrar) return;

    try {
      const fechaHoy = new Date().toISOString().split("T")[0];
      await api.post("/pagos-clientes", {
        trabajo_id: trabajoACobrar.id,
        fecha: fechaHoy,
        hectareas_pagadas: Number(formCobro.hectareas),
        precio_por_hectarea: Number(formCobro.precioPorHa),
        subtotal: calculoCobro.subTotal,
        iva: calculoCobro.iva,
        total: calculoCobro.total,
      });

      setModalConfirmarCobroAbierto(false);
      setModalDeudaAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al registrar el cobro:", error);
      alert(
        error.response?.data?.error || "Hubo un error al registrar el pago.",
      );
    }
  };

  const totalIvaGeneral = pagosFiltradosHistorial.reduce(
    (sum, p) => sum + (Number(p.iva) || 0),
    0,
  );
  const totalGeneralPagos = pagosFiltradosHistorial.reduce(
    (sum, p) => sum + (Number(p.total) || 0),
    0,
  );

  return (
    <div style={styles.container}>
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...styles.input, maxWidth: "280px" }}
        />
        <button onClick={abrirModalNuevo} style={styles.btnSuccess}>
          + Nuevo Cliente
        </button>
      </div>

      <div style={styles.panelGrid}>
        <div style={styles.cardLeft}>
          <div style={{ maxHeight: "520px", overflowY: "auto" }}>
            <table style={styles.table}>
              <tbody>
                {clientesFiltrados.length === 0 ? (
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No se encontraron clientes.
                    </td>
                  </tr>
                ) : (
                  clientesFiltrados.map((cli) => {
                    const seleccionado = clienteSeleccionado?.id === cli.id;
                    return (
                      <tr
                        key={cli.id}
                        onClick={() => setClienteSeleccionado(cli)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: seleccionado
                            ? "#e0f2fe"
                            : "transparent",
                        }}
                      >
                        <td style={{ ...styles.td, fontWeight: "600" }}>
                          {cli.nombre}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.cardRight}>
          {clienteSeleccionado ? (
            <div>
              {/* CABECERA REDISEÑADA: Nombre + Lápiz al lado, y Botón Historial Arriba a la Derecha */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                  borderBottom: "1px solid #e2e8f0",
                  paddingBottom: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      {clienteSeleccionado.nombre}
                    </h3>
                    <button
                      onClick={() =>
                        abrirModalEdicionCliente(clienteSeleccionado)
                      }
                      style={styles.btnIconOnly}
                      title="Modificar datos del cliente"
                    >
                      ✏️
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      margin: "2px 0 0 0",
                    }}
                  >
                    CUIL: {clienteSeleccionado.cuil || "-"} | Tel:{" "}
                    {clienteSeleccionado.telefono || "-"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFiltroTipo("todo");
                    setModalHistorialAbierto(true);
                  }}
                  style={styles.btnHistorial}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 16px rgba(37, 99, 235, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(37, 99, 235, 0.25)";
                  }}
                >
                  📜 Ver Historial
                </button>
              </div>

              {/* CAMPOS Y LOTES (Sin título, con colores de fondo dinámicos) */}
              <div style={{ marginBottom: "12px" }}>
                {camposDelCliente.length === 0 ? (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontStyle: "italic",
                    }}
                  >
                    Sin campos asociados.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {camposDelCliente.map((cmp, idx) => {
                      const lotesCamp = lotes.filter(
                        (l) => Number(l.campo_id) === Number(cmp.id),
                      );
                      return (
                        <div key={cmp.id} style={styles.campoCard(idx)}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#0f172a",
                                fontSize: "0.95rem",
                              }}
                            >
                              {cmp.nombre}
                            </span>
                            <button
                              onClick={() => abrirModalEdicionCampo(cmp)}
                              style={styles.btnIconOnly}
                              title="Editar campo y lotes"
                            >
                              ✏️
                            </button>
                          </div>
                          {cmp.ubicacion && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#64748b",
                              }}
                            >
                              📍 {cmp.ubicacion}
                            </span>
                          )}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                              marginTop: "2px",
                            }}
                          >
                            {lotesCamp.length > 0 ? (
                              lotesCamp.map((lt) => (
                                <span
                                  key={lt.id}
                                  style={{
                                    fontSize: "0.8rem",
                                    color: "#475569",
                                  }}
                                >
                                  * {lt.numero_lote}
                                </span>
                              ))
                            ) : (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#94a3b8",
                                  fontStyle: "italic",
                                }}
                              >
                                Sin lotes
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ESTADO DE CUENTA: Etiqueta y respuesta en la misma línea */}
              <div style={styles.estadoCuentaBox(deudasCliente.length > 0)}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>Estado de Cuenta:</span>
                  <span style={{ fontWeight: "normal" }}>
                    {deudasCliente.length === 0
                      ? "Cliente sin pagos pendientes"
                      : "Cliente con pagos pendientes"}
                  </span>
                </div>
                {deudasCliente.length > 0 && (
                  <button
                    onClick={() => setModalDeudaAbierto(true)}
                    style={{
                      ...styles.btnPrimary,
                      padding: "3px 10px",
                      fontSize: "0.8rem",
                    }}
                  >
                    Ver Deudas
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                minHeight: "250px",
              }}
            >
              Selecciona un cliente de la lista para ver su ficha completa.
            </div>
          )}
        </div>
      </div>

      {modalDeudaAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              Pagos Pendientes
            </h3>
            <div
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                marginBottom: "16px",
              }}
            >
              {deudasCliente.map((t) => {
                const loteObj = lotes.find(
                  (l) => Number(l.id) === Number(t.lote_id),
                );
                const campoObj = campos.find(
                  (c) => Number(c.id) === Number(loteObj?.campo_id),
                );
                const pagadasHa = Number(t.total_hectareas_pagadas) || 0;
                const pendienteHa = Number(t.cantidad_hectareas) - pagadasHa;
                return (
                  <div
                    key={t.id}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #e2e8f0",
                      fontSize: "0.9rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p>
                        <b>Fecha:</b> {formatearFecha(t.fecha)}
                      </p>
                      <p>
                        <b>Campo:</b> {campoObj?.nombre || "N/A"} | <b>Lote:</b>{" "}
                        {loteObj?.numero_lote || "N/A"}
                      </p>
                      <p>
                        <b>Pendiente:</b> {pendienteHa} ha (de{" "}
                        {t.cantidad_hectareas} ha)
                      </p>
                      <p>
                        <b>Cultivo:</b> {t.tipo_cultivo} ({t.tratamiento})
                      </p>
                    </div>
                    <button
                      onClick={() => abrirModalCobro(t)}
                      style={styles.btnSuccess}
                    >
                      Cobrar
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setModalDeudaAbierto(false)}
                style={styles.btnSecondary}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalCobroAbierto && trabajoACobrar && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              Registrar Cobro
            </h3>
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: "#475569",
                }}
              >
                Hectáreas a cobrar
              </label>
              <input
                type="number"
                value={formCobro.hectareas}
                onChange={(e) =>
                  setFormCobro({ ...formCobro, hectareas: e.target.value })
                }
                style={styles.input}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  marginBottom: "4px",
                  color: "#475569",
                }}
              >
                Precio por hectárea ($)
              </label>
              <input
                type="number"
                value={formCobro.precioPorHa}
                onChange={(e) =>
                  setFormCobro({ ...formCobro, precioPorHa: e.target.value })
                }
                style={styles.input}
              />
            </div>

            <button
              onClick={calcularTotalesCobro}
              style={{
                ...styles.btnPrimary,
                width: "100%",
                marginBottom: "16px",
              }}
            >
              Calcular
            </button>

            {calculoCobro && (
              <div
                style={{
                  backgroundColor: "#f1f5f9",
                  padding: "12px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  fontSize: "0.9rem",
                }}
              >
                <p>
                  <b>Subtotal:</b> ${calculoCobro.subTotal.toLocaleString()}
                </p>
                <p>
                  <b>IVA (10.5%):</b> ${calculoCobro.iva.toLocaleString()}
                </p>
                <p style={{ fontSize: "1.05rem", marginTop: "4px" }}>
                  <b>Total:</b> ${calculoCobro.total.toLocaleString()}
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "12px",
              }}
            >
              <button
                onClick={() => setModalCobroAbierto(false)}
                style={styles.btnSecondary}
              >
                Cancelar
              </button>
              {calculoCobro && (
                <button
                  onClick={solicitarConfirmacionCobro}
                  style={styles.btnSuccess}
                >
                  Continuar Cobro
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {modalConfirmarCobroAbierto && calculoCobro && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              Confirmar Pago
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#334155",
                marginBottom: "16px",
              }}
            >
              ¿Está seguro de registrar este cobro por un total de{" "}
              <b>${calculoCobro.total.toLocaleString()}</b> para el cliente{" "}
              <b>{clienteSeleccionado?.nombre}</b>?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "12px",
              }}
            >
              <button
                onClick={() => setModalConfirmarCobroAbierto(false)}
                style={styles.btnSecondary}
              >
                No, cancelar
              </button>
              <button onClick={confirmarCobroFinal} style={styles.btnSuccess}>
                Sí, confirmar pago
              </button>
            </div>
          </div>
        </div>
      )}

      {modalHistorialAbierto && (
        <div style={styles.modalFullScreenOverlay}>
          <div style={styles.modalFullScreenContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "12px",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "1.4rem", color: "#1e293b", margin: 0 }}>
                Historial General - {clienteSeleccionado?.nombre}
              </h3>
              <button
                onClick={() => setModalHistorialAbierto(false)}
                style={styles.btnSecondary}
              >
                Cerrar
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                backgroundColor: "#f1f5f9",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Filtrar por:
              </span>
              <button
                onClick={() => setFiltroTipo("todo")}
                style={styles.btnFilter(filtroTipo === "todo")}
              >
                Todo
              </button>
              <button
                onClick={() => {
                  setFiltroTipo("mes");
                  if (
                    !filtroMesSeleccionado &&
                    opcionesMesesYAños.meses.length > 0
                  ) {
                    setFiltroMesSeleccionado(opcionesMesesYAños.meses[0]);
                  }
                }}
                style={styles.btnFilter(filtroTipo === "mes")}
              >
                Mes
              </button>
              <button
                onClick={() => {
                  setFiltroTipo("anio");
                  if (
                    !filtroAnioSeleccionado &&
                    opcionesMesesYAños.anios.length > 0
                  ) {
                    setFiltroAnioSeleccionado(opcionesMesesYAños.anios[0]);
                  }
                }}
                style={styles.btnFilter(filtroTipo === "anio")}
              >
                Año
              </button>

              {filtroTipo === "mes" && (
                <select
                  value={filtroMesSeleccionado}
                  onChange={(e) => setFiltroMesSeleccionado(e.target.value)}
                  style={{
                    ...styles.input,
                    maxWidth: "180px",
                    padding: "6px 8px",
                  }}
                >
                  {opcionesMesesYAños.meses.map((m) => {
                    const [anio, mesNum] = m.split("-");
                    return (
                      <option key={m} value={m}>
                        {mesNum}/{anio}
                      </option>
                    );
                  })}
                </select>
              )}

              {filtroTipo === "anio" && (
                <select
                  value={filtroAnioSeleccionado}
                  onChange={(e) => setFiltroAnioSeleccionado(e.target.value)}
                  style={{
                    ...styles.input,
                    maxWidth: "140px",
                    padding: "6px 8px",
                  }}
                >
                  {opcionesMesesYAños.anios.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "1.1rem",
                    color: "#1e293b",
                    marginBottom: "10px",
                  }}
                >
                  Historial de Trabajos
                </h4>
                {trabajosOrdenados.length === 0 ? (
                  <p style={{ color: "#64748b", fontStyle: "italic" }}>
                    No hay trabajos registrados para este filtro.
                  </p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th
                          style={styles.th}
                          onClick={() => handleSortTrabajo("fecha")}
                        >
                          Fecha{" "}
                          {sortFieldTrabajo === "fecha"
                            ? sortOrderTrabajo === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th
                          style={styles.th}
                          onClick={() => handleSortTrabajo("campo")}
                        >
                          Campo{" "}
                          {sortFieldTrabajo === "campo"
                            ? sortOrderTrabajo === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th
                          style={styles.th}
                          onClick={() => handleSortTrabajo("lote")}
                        >
                          Lote{" "}
                          {sortFieldTrabajo === "lote"
                            ? sortOrderTrabajo === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th
                          style={styles.th}
                          onClick={() => handleSortTrabajo("tratamiento")}
                        >
                          Tratamiento{" "}
                          {sortFieldTrabajo === "tratamiento"
                            ? sortOrderTrabajo === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th
                          style={styles.th}
                          onClick={() => handleSortTrabajo("cultivo")}
                        >
                          Cultivo{" "}
                          {sortFieldTrabajo === "cultivo"
                            ? sortOrderTrabajo === "asc"
                              ? "▲"
                              : "▼"
                            : "↕"}
                        </th>
                        <th style={styles.th}>Hectáreas Totales</th>
                        <th style={styles.th}>Máquina</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trabajosOrdenados.map((t) => {
                        const loteObj = lotes.find(
                          (l) => Number(l.id) === Number(t.lote_id),
                        );
                        const campoObj = campos.find(
                          (c) => Number(c.id) === Number(loteObj?.campo_id),
                        );
                        const maquinaObj = maquinas.find(
                          (m) => Number(m.id) === Number(t.maquina_id),
                        );
                        const pagadasHa =
                          Number(t.total_hectareas_pagadas) || 0;
                        const pendienteHa =
                          Number(t.cantidad_hectareas) - pagadasHa;
                        return (
                          <tr key={t.id}>
                            <td style={styles.td}>{formatearFecha(t.fecha)}</td>
                            <td style={styles.td}>
                              {campoObj?.nombre || "N/A"}
                            </td>
                            <td style={styles.td}>
                              {loteObj?.numero_lote || "N/A"}
                            </td>
                            <td style={styles.td}>{t.tratamiento}</td>
                            <td style={styles.td}>{t.tipo_cultivo}</td>
                            <td style={styles.td}>{t.cantidad_hectareas} ha</td>
                            <td style={styles.td}>
                              {maquinaObj?.nombre ||
                                maquinaObj?.patente ||
                                "N/A"}{" "}
                              {pendienteHa > 0 && "*"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {trabajosDelCliente.some(
                  (t) =>
                    Number(t.cantidad_hectareas) -
                      Number(t.total_hectareas_pagadas || 0) >
                    0,
                ) && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#dc2626",
                      marginTop: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    * Trabajo con saldo pendiente
                  </p>
                )}
              </div>

              <div
                style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}
              >
                <h4
                  style={{
                    fontSize: "1.1rem",
                    color: "#1e293b",
                    marginBottom: "10px",
                  }}
                >
                  Historial de Pagos
                </h4>
                {pagosOrdenados.length === 0 ? (
                  <p style={{ color: "#64748b", fontStyle: "italic" }}>
                    No hay pagos registrados para este filtro.
                  </p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th
                          style={styles.th}
                          onClick={() =>
                            setSortOrderPago(
                              sortOrderPago === "asc" ? "desc" : "asc",
                            )
                          }
                        >
                          Fecha {sortOrderPago === "asc" ? "▲" : "▼"}
                        </th>
                        <th style={styles.th}>Hectáreas Pagadas</th>
                        <th style={styles.th}>Precio por Hectárea</th>
                        <th style={styles.th}>Subtotal</th>
                        <th style={styles.th}>IVA (10.5%)</th>
                        <th style={styles.th}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosOrdenados.map((p) => (
                        <tr key={p.id}>
                          <td style={styles.td}>{formatearFecha(p.fecha)}</td>
                          <td style={styles.td}>{p.hectareas_pagadas} ha</td>
                          <td style={styles.td}>
                            $
                            {Number(
                              p.precio_por_hectarea || 0,
                            ).toLocaleString()}
                          </td>
                          <td style={styles.td}>
                            ${Number(p.subtotal).toLocaleString()}
                          </td>
                          <td style={styles.td}>
                            ${Number(p.iva).toLocaleString()}
                          </td>
                          <td style={{ ...styles.td, fontWeight: "bold" }}>
                            ${Number(p.total).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr
                        style={{
                          backgroundColor: "#f1f5f9",
                          fontWeight: "bold",
                        }}
                      >
                        <td
                          colSpan="4"
                          style={{ ...styles.td, textAlign: "right" }}
                        >
                          Totales Generales:
                        </td>
                        <td style={styles.td}>
                          ${totalIvaGeneral.toLocaleString()}
                        </td>
                        <td style={styles.td}>
                          ${totalGeneralPagos.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalCampoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              Modificar Campo y Lotes
            </h3>
            <form onSubmit={guardarCampoIndividual}>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Nombre del Campo
                </label>
                <input
                  type="text"
                  required
                  value={formCampoIndividual.nombre}
                  onChange={(e) =>
                    setFormCampoIndividual({
                      ...formCampoIndividual,
                      nombre: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formCampoIndividual.ubicacion}
                  onChange={(e) =>
                    setFormCampoIndividual({
                      ...formCampoIndividual,
                      ubicacion: e.target.value,
                    })
                  }
                  style={styles.input}
                />
              </div>

              <div
                style={{
                  marginBottom: "16px",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "12px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#334155",
                  }}
                >
                  Lotes Existentes
                </label>
                <div
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    marginBottom: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {lotes
                    .filter(
                      (l) => Number(l.campo_id) === Number(campoEditando?.id),
                    )
                    .map((lt) => (
                      <div
                        key={lt.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 10px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <span style={{ fontSize: "0.85rem", color: "#334155" }}>
                          * {lt.numero_lote}
                        </span>
                        <button
                          type="button"
                          onClick={() => abrirModalLoteEdicion(lt)}
                          style={styles.btnIconOnly}
                          title="Editar lote"
                        >
                          ✏️
                        </button>
                      </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Nuevo lote..."
                    value={nuevoLoteTexto}
                    onChange={(e) => setNuevoLoteTexto(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={agregarNuevoLoteEnCampo}
                    style={styles.btnPrimary}
                  >
                    Agregar nuevo lote
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalCampoAbierto(false)}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSuccess}>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalLoteAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              Modificar Lote
            </h3>
            <form onSubmit={guardarLoteIndividual}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Nombre / Número del Lote
                </label>
                <input
                  type="text"
                  required
                  value={numeroLoteInput}
                  onChange={(e) => setNumeroLoteInput(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalLoteAbierto(false)}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSuccess}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              {modoEdicion
                ? "Modificar Cliente"
                : "Nuevo Cliente, Campos y Lotes"}
            </h3>
            <form onSubmit={guardarClienteYCampos}>
              <div style={{ marginBottom: "12px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formCliente.nombre}
                  onChange={(e) =>
                    setFormCliente({ ...formCliente, nombre: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "4px",
                      color: "#475569",
                    }}
                  >
                    CUIL
                  </label>
                  <input
                    type="text"
                    value={formCliente.cuil}
                    onChange={(e) =>
                      setFormCliente({ ...formCliente, cuil: e.target.value })
                    }
                    style={styles.input}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      marginBottom: "4px",
                      color: "#475569",
                    }}
                  >
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formCliente.telefono}
                    onChange={(e) =>
                      setFormCliente({
                        ...formCliente,
                        telefono: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>
              </div>

              {!modoEdicion && (
                <div
                  style={{
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "12px",
                    marginTop: "12px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.95rem",
                      marginBottom: "8px",
                      color: "#334155",
                    }}
                  >
                    Campos y Lotes Asociados
                  </h4>
                  {formCampos.map((camp, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: "8px",
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Nombre del Campo *"
                        required
                        value={camp.nombre}
                        onChange={(e) => {
                          const nuevos = [...formCampos];
                          nuevos[idx].nombre = e.target.value;
                          setFormCampos(nuevos);
                        }}
                        style={{ ...styles.input, marginBottom: "6px" }}
                      />
                      <input
                        type="text"
                        placeholder="Ubicación"
                        value={camp.ubicacion}
                        onChange={(e) => {
                          const nuevos = [...formCampos];
                          nuevos[idx].ubicacion = e.target.value;
                          setFormCampos(nuevos);
                        }}
                        style={{ ...styles.input, marginBottom: "6px" }}
                      />
                      <input
                        type="text"
                        placeholder="Lotes separados por coma"
                        value={camp.lotes}
                        onChange={(e) => {
                          const nuevos = [...formCampos];
                          nuevos[idx].lotes = e.target.value;
                          setFormCampos(nuevos);
                        }}
                        style={styles.input}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormCampos([
                        ...formCampos,
                        { nombre: "", ubicacion: "", lotes: "" },
                      ])
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#2563eb",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                    }}
                  >
                    + Agregar otro campo
                  </button>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "20px",
                  borderTop: "1px solid #e2e8f0",
                  paddingTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSuccess}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
