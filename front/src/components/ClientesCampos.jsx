import { useState, useEffect, useMemo, useCallback } from "react";
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
    tableLayout: "fixed",
    fontSize: "0.85rem",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "2px solid #cbd5e1",
    color: "#334155",
    fontWeight: "700",
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
  },
  td: {
    padding: "10px 12px",
    textAlign: "left",
    borderBottom: "1px solid #f1f5f9",
    color: "#1e293b",
    verticalAlign: "middle",
    wordBreak: "break-word",
  },
  input: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    width: "100%",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "130px",
    flex: "1",
  },
  inputGroupDestacado: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: "160px",
    flex: "1.2",
    backgroundColor: "#eff6ff",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px dashed #3b82f6",
  },
  labelDestacado: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#1d4ed8",
    whiteSpace: "nowrap",
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
    padding: "10px 22px",
    background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
    transition: "all 0.25s ease",
  },
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
  btnIconOnly: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "color 0.2s",
  },
  puntoEstado: (tieneDeuda) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: tieneDeuda ? "#dc2626" : "#10b981",
    display: "inline-block",
    boxShadow: `0 0 4px ${tieneDeuda ? "#dc2626" : "#10b981"}`,
  }),
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
      gap: "6px",
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
    padding: "28px",
    borderRadius: "12px",
    maxWidth: "500px",
    width: "95%",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxHeight: "90vh",
    overflowY: "auto",
    textAlign: "left",
    position: "relative",
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
    borderRadius: "12px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    position: "relative",
  },
  btnCloseX: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "transparent",
    border: "none",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#64748b",
    cursor: "pointer",
  },
  filtrosContainer: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "16px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "flex-end",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#475569",
    whiteSpace: "nowrap",
  },
  toastContainer: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  toast: (tipo) => ({
    padding: "12px 18px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)",
    backgroundColor: tipo === "error" ? "#dc2626" : "#10b981",
    animation: "fadeIn 0.3s ease-in-out",
  }),
};

export default function ClientesCampos() {
  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [pagosClientes, setPagosClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [toasts, setToasts] = useState([]);

  const mostrarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const [tipoFiltro, setTipoFiltro] = useState("todo");
  const [valorFecha, setValorFecha] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [sortFieldTrabajo, setSortFieldTrabajo] = useState("fecha");
  const [sortOrderTrabajo, setSortOrderTrabajo] = useState("asc");
  const [sortOrderPago, setSortOrderPago] = useState("asc");

  // Estados para desplegar/plegar las tablas inicialmente colapsadas
  const [mostrarTrabajos, setMostrarTrabajos] = useState(false);
  const [mostrarPagos, setMostrarPagos] = useState(false);

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
    cuit: "",
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
      const [resCli, resCam, resLot, resTrab, resPagos, resMaq, resEmp] =
        await Promise.all([
          api.get("/clientes"),
          api.get("/campos"),
          api.get("/lotes").catch(() => ({ data: [] })),
          api.get("/trabajos"),
          api.get("/pagos-clientes").catch(() => ({ data: [] })),
          api.get("/maquinas").catch(() => ({ data: [] })),
          api.get("/empleados").catch(() => ({ data: [] })),
        ]);
      setClientes(resCli.data);
      setCampos(resCam.data);
      setLotes(resLot.data);
      setTrabajos(resTrab.data);
      setPagosClientes(resPagos.data);
      setMaquinas(resMaq.data);
      setEmpleados(resEmp.data);

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
    const totalHa = Math.round(Number(t.cantidad_hectareas) || 0);
    const pagadasHa = Math.round(Number(t.total_hectareas_pagadas) || 0);
    return totalHa - pagadasHa > 0;
  });

  const clienteTieneDeuda = (clienteId) => {
    const camposCli = campos.filter(
      (c) => Number(c.cliente_id) === Number(clienteId),
    );
    const idsCamposCli = camposCli.map((c) => c.id);
    const lotesCli = lotes.filter((l) =>
      idsCamposCli.includes(Number(l.campo_id)),
    );
    const idsLotesCli = lotesCli.map((l) => l.id);
    const trabajosCli = trabajos.filter((t) =>
      idsLotesCli.includes(Number(t.lote_id)),
    );

    return trabajosCli.some((t) => {
      const totalHa = Math.round(Number(t.cantidad_hectareas) || 0);
      const pagadasHa = Math.round(Number(t.total_hectareas_pagadas) || 0);
      return totalHa - pagadasHa > 0;
    });
  };

  const cumpleFiltroFecha = useCallback(
    (fechaStr) => {
      if (!fechaStr) return false;
      const fechaSolo = fechaStr.split("T")[0];

      if (tipoFiltro === "dia" && valorFecha) {
        return fechaSolo === valorFecha;
      }
      if (tipoFiltro === "rango") {
        if (fechaDesde && fechaSolo < fechaDesde) return false;
        if (fechaHasta && fechaSolo > fechaHasta) return false;
        return true;
      }
      if (tipoFiltro === "mes" && valorFecha) {
        return fechaSolo.startsWith(valorFecha);
      }
      if (tipoFiltro === "anio" && valorFecha) {
        return fechaSolo.startsWith(valorFecha);
      }
      return true;
    },
    [tipoFiltro, valorFecha, fechaDesde, fechaHasta],
  );

  const trabajosFiltradosHistorial = useMemo(() => {
    return trabajosDelCliente.filter((t) => cumpleFiltroFecha(t.fecha));
  }, [trabajosDelCliente, cumpleFiltroFecha]);

  const pagosFiltradosHistorial = useMemo(() => {
    return pagosDelCliente.filter((p) => cumpleFiltroFecha(p.fecha));
  }, [pagosDelCliente, cumpleFiltroFecha]);

  // Agrupamiento de Trabajos por: fecha, campo, tratamiento, cultivo, empleado y maquina
  const trabajosAgrupados = useMemo(() => {
    const mapa = {};
    trabajosFiltradosHistorial.forEach((t) => {
      const loteObj = lotes.find((l) => Number(l.id) === Number(t.lote_id));
      const campoId = loteObj?.campo_id || "N/A";
      const fechaKey = t.fecha ? t.fecha.split("T")[0] : "";
      const tratamientoKey = t.tratamiento || "";
      const cultivoKey = t.tipo_cultivo || "";
      const empleadoKey = t.empleado_id || "";
      const maquinaKey = t.maquina_id || "";

      const claveUnica = `${fechaKey}_${campoId}_${tratamientoKey}_${cultivoKey}_${empleadoKey}_${maquinaKey}`;

      if (!mapa[claveUnica]) {
        mapa[claveUnica] = {
          ...t,
          cantidad_hectareas_total: 0,
          total_hectareas_pagadas_total: 0,
          cantidad_lotes: 0,
          tieneDeudaGrupo: false,
        };
      }

      const ha = Math.round(Number(t.cantidad_hectareas) || 0);
      const haPagada = Math.round(Number(t.total_hectareas_pagadas) || 0);
      mapa[claveUnica].cantidad_hectareas_total += ha;
      mapa[claveUnica].total_hectareas_pagadas_total += haPagada;
      mapa[claveUnica].cantidad_lotes += 1;
      if (ha - haPagada > 0) {
        mapa[claveUnica].tieneDeudaGrupo = true;
      }
    });

    return Object.values(mapa);
  }, [trabajosFiltradosHistorial, lotes]);

  // Agrupamiento de Pagos por: fecha y precio por hectárea
  const pagosAgrupados = useMemo(() => {
    const mapa = {};
    pagosFiltradosHistorial.forEach((p) => {
      const fechaKey = p.fecha ? p.fecha.split("T")[0] : "";
      const precioKey = Number(p.precio_por_hectarea || 0);
      const claveUnica = `${fechaKey}_${precioKey}`;

      if (!mapa[claveUnica]) {
        mapa[claveUnica] = {
          ...p,
          hectareas_pagadas_total: 0,
          subtotal_total: 0,
          iva_total: 0,
          total_general: 0,
        };
      }

      mapa[claveUnica].hectareas_pagadas_total += Math.round(
        Number(p.hectareas_pagadas) || 0,
      );
      mapa[claveUnica].subtotal_total += Number(p.subtotal || 0);
      mapa[claveUnica].iva_total += Number(p.iva || 0);
      mapa[claveUnica].total_general += Number(p.total || 0);
    });

    return Object.values(mapa);
  }, [pagosFiltradosHistorial]);

  const handleSortTrabajo = (field) => {
    if (sortFieldTrabajo === field) {
      setSortOrderTrabajo(sortOrderTrabajo === "asc" ? "desc" : "asc");
    } else {
      setSortFieldTrabajo(field);
      setSortOrderTrabajo("asc");
    }
  };

  const trabajosOrdenados = useMemo(() => {
    return [...trabajosAgrupados].sort((a, b) => {
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
  }, [trabajosAgrupados, sortFieldTrabajo, sortOrderTrabajo, lotes, campos]);

  const pagosOrdenados = useMemo(() => {
    return [...pagosAgrupados].sort((a, b) => {
      const valA = a.fecha || "";
      const valB = b.fecha || "";
      if (valA < valB) return sortOrderPago === "asc" ? -1 : 1;
      if (valA > valB) return sortOrderPago === "asc" ? 1 : -1;
      return 0;
    });
  }, [pagosAgrupados, sortOrderPago]);

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setFormCliente({ id: "", nombre: "", cuit: "", telefono: "" });
    setFormCampos([{ nombre: "", ubicacion: "", lotes: "" }]);
    setModalAbierto(true);
  };

  const abrirModalEdicionCliente = (cli) => {
    setModoEdicion(true);
    setFormCliente({
      id: cli.id,
      nombre: cli.nombre,
      cuit: cli.cuit || cli.cuil || "",
      telefono: cli.telefono,
    });
    setFormCampos([{ nombre: "", ubicacion: "", lotes: "" }]);
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
    if (!numeroLoteInput.trim() || !loteEditando) return;

    const lotesActualesCampo = lotes.filter(
      (l) =>
        Number(l.campo_id) === Number(loteEditando.campo_id) &&
        Number(l.id) !== Number(loteEditando.id),
    );
    const loteDuplicado = lotesActualesCampo.some(
      (l) =>
        l.numero_lote.trim().toLowerCase() ===
        numeroLoteInput.trim().toLowerCase(),
    );

    if (loteDuplicado) {
      mostrarToast(
        "Ya existe un lote con ese mismo nombre en este campo.",
        "error",
      );
      return;
    }

    try {
      await api.put(`/lotes/${loteEditando.id}`, {
        campo_id: loteEditando.campo_id,
        numero_lote: numeroLoteInput.trim(),
      });
      setLotes(
        lotes.map((l) =>
          l.id === loteEditando.id
            ? { ...l, numero_lote: numeroLoteInput.trim() }
            : l,
        ),
      );
      setModalLoteAbierto(false);
      mostrarToast("Lote actualizado correctamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar lote:", error);
      mostrarToast("Error al actualizar el lote", "error");
    }
  };

  const agregarNuevoLoteEnCampo = async () => {
    if (!nuevoLoteTexto.trim() || !campoEditando) return;

    const listaNuevosLotes = nuevoLoteTexto
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    if (listaNuevosLotes.length === 0) return;

    const lotesActualesCampo = lotes.filter(
      (l) => Number(l.campo_id) === Number(campoEditando.id),
    );

    const nombresExistentes = new Set(
      lotesActualesCampo.map((l) => l.numero_lote.trim().toLowerCase()),
    );

    const nombresNuevosSet = new Set();
    for (const lName of listaNuevosLotes) {
      const lowerName = lName.toLowerCase();
      if (nombresExistentes.has(lowerName) || nombresNuevosSet.has(lowerName)) {
        mostrarToast(
          `El lote "${lName}" ya existe o está duplicado en la entrada.`,
          "error",
        );
        return;
      }
      nombresNuevosSet.add(lowerName);
    }

    try {
      for (const lName of listaNuevosLotes) {
        await api.post("/lotes", {
          campo_id: campoEditando.id,
          numero_lote: lName,
        });
      }
      setNuevoLoteTexto("");
      mostrarToast("Lotes agregados correctamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al agregar nuevos lotes:", error);
      mostrarToast("Error al agregar los lotes", "error");
    }
  };

  const guardarCampoIndividual = async (e) => {
    e.preventDefault();
    if (!formCampoIndividual.nombre.trim() || !clienteSeleccionado) return;

    const camposCliente = campos.filter(
      (c) =>
        Number(c.cliente_id) === Number(clienteSeleccionado.id) &&
        Number(c.id) !== Number(campoEditando?.id),
    );
    const campoDuplicado = camposCliente.some(
      (c) =>
        c.nombre.trim().toLowerCase() ===
        formCampoIndividual.nombre.trim().toLowerCase(),
    );

    if (campoDuplicado) {
      mostrarToast(
        "Este cliente ya posee un campo registrado con ese nombre.",
        "error",
      );
      return;
    }

    try {
      await api.put(`/campos/${campoEditando.id}`, {
        cliente_id: clienteSeleccionado.id,
        nombre: formCampoIndividual.nombre.trim(),
        ubicacion: formCampoIndividual.ubicacion.trim(),
      });
      setCampos(
        campos.map((c) =>
          c.id === campoEditando.id
            ? {
                ...c,
                nombre: formCampoIndividual.nombre.trim(),
                ubicacion: formCampoIndividual.ubicacion.trim(),
              }
            : c,
        ),
      );
      setModalCampoAbierto(false);
      mostrarToast("Campo actualizado correctamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar campo:", error);
      mostrarToast("Error al actualizar el campo", "error");
    }
  };

  const guardarClienteYCampos = async (e) => {
    e.preventDefault();
    const nombreClienteLimpio = formCliente.nombre.trim();
    const cuitLimpio = formCliente.cuit ? formCliente.cuit.trim() : "";

    if (cuitLimpio) {
      const cuitDuplicado = clientes.some(
        (c) =>
          (c.cuit?.trim() === cuitLimpio || c.cuil?.trim() === cuitLimpio) &&
          Number(c.id) !== Number(formCliente.id),
      );
      if (cuitDuplicado) {
        mostrarToast(
          "Ya existe otro cliente registrado con este mismo CUIT.",
          "error",
        );
        return;
      }
    }

    const nombresCamposVistos = new Set();
    for (const camp of formCampos) {
      const nombreCamp = camp.nombre.trim();
      if (!nombreCamp) continue;
      if (nombresCamposVistos.has(nombreCamp.toLowerCase())) {
        mostrarToast(
          "No puedes registrar dos campos con el mismo nombre en el formulario.",
          "error",
        );
        return;
      }
      nombresCamposVistos.add(nombreCamp.toLowerCase());

      if (!modoEdicion) {
        const campoBDDuplicado = campos.some(
          (c) =>
            Number(c.cliente_id) === Number(formCliente.id) &&
            c.nombre.trim().toLowerCase() === nombreCamp.toLowerCase(),
        );
        if (campoBDDuplicado) {
          mostrarToast(
            `El campo "${nombreCamp}" ya se encuentra registrado para este cliente.`,
            "error",
          );
          return;
        }
      }
    }

    try {
      if (modoEdicion) {
        await api.put(`/clientes/${formCliente.id}`, {
          nombre: nombreClienteLimpio,
          cuit: cuitLimpio,
          telefono: formCliente.telefono.trim(),
        });

        for (const camp of formCampos) {
          const nombreCamp = camp.nombre.trim();
          if (!nombreCamp) continue;

          const existeCampo = campos.some(
            (c) =>
              Number(c.cliente_id) === Number(formCliente.id) &&
              c.nombre.trim().toLowerCase() === nombreCamp.toLowerCase(),
          );
          if (existeCampo) continue;

          const resCamp = await api.post("/campos", {
            cliente_id: formCliente.id,
            nombre: nombreCamp,
            ubicacion: camp.ubicacion.trim(),
          });
          const nuevoCampId = resCamp.data.id;

          if (camp.lotes) {
            const listaLotes = camp.lotes
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean);
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

        setClientes(
          clientes.map((c) =>
            c.id === formCliente.id
              ? { ...c, ...formCliente, cuit: cuitLimpio }
              : c,
          ),
        );
        if (clienteSeleccionado?.id === formCliente.id) {
          setClienteSeleccionado({
            ...clienteSeleccionado,
            ...formCliente,
            cuit: cuitLimpio,
          });
        }
        mostrarToast("Cliente modificado correctamente");
      } else {
        const resCli = await api.post("/clientes", {
          nombre: nombreClienteLimpio,
          cuit: cuitLimpio,
          telefono: formCliente.telefono.trim(),
        });
        const nuevoCliId = resCli.data.id;

        for (const camp of formCampos) {
          const nombreCamp = camp.nombre.trim();
          if (!nombreCamp) continue;
          const resCamp = await api.post("/campos", {
            cliente_id: nuevoCliId,
            nombre: nombreCamp,
            ubicacion: camp.ubicacion.trim(),
          });
          const nuevoCampId = resCamp.data.id;

          if (camp.lotes) {
            const listaLotes = camp.lotes
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean);
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
        mostrarToast("Cliente creado correctamente");
      }
      setModalAbierto(false);
      cargarDatos();
    } catch (error) {
      console.error("Error al guardar:", error);
      mostrarToast(
        error.response?.data?.error || "Ocurrió un error al guardar los datos.",
        "error",
      );
    }
  };

  const abrirModalCobro = (trabajo) => {
    const totalHa = Math.round(Number(trabajo.cantidad_hectareas) || 0);
    const pagadasHa = Math.round(Number(trabajo.total_hectareas_pagadas) || 0);
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
    const has = Math.round(Number(formCobro.hectareas) || 0);
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
        hectareas_pagadas: Math.round(Number(formCobro.hectareas)),
        precio_por_hectarea: Number(formCobro.precioPorHa),
        subtotal: calculoCobro.subTotal,
        iva: calculoCobro.iva,
        total: calculoCobro.total,
      });

      setModalConfirmarCobroAbierto(false);
      setModalDeudaAbierto(false);
      mostrarToast("Cobro registrado con éxito");
      cargarDatos();
    } catch (error) {
      console.error("Error al registrar el cobro:", error);
      mostrarToast(
        error.response?.data?.error || "Hubo un error al registrar el pago.",
        "error",
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
      <div style={styles.toastContainer}>
        {toasts.map((t) => (
          <div key={t.id} style={styles.toast(t.tipo)}>
            {t.mensaje}
          </div>
        ))}
      </div>

      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...styles.input, maxWidth: "280px" }}
        />
        <button
          onClick={abrirModalNuevo}
          style={styles.btnSuccess}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(16, 185, 129, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 15px rgba(16, 185, 129, 0.4)";
          }}
        >
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
                    const tieneDeuda = clienteTieneDeuda(cli.id);
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <span>{cli.nombre}</span>
                            <span
                              style={styles.puntoEstado(tieneDeuda)}
                              title={
                                tieneDeuda ? "Tiene pagos pendientes" : "Al día"
                              }
                            />
                          </div>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      margin: "2px 0 0 0",
                    }}
                  >
                    CUIT:{" "}
                    {clienteSeleccionado.cuit ||
                      clienteSeleccionado.cuil ||
                      "-"}{" "}
                    | Tel: {clienteSeleccionado.telefono || "-"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setTipoFiltro("todo");
                    setValorFecha("");
                    setFechaDesde("");
                    setFechaHasta("");
                    setModalHistorialAbierto(true);
                  }}
                  style={styles.btnHistorial}
                >
                  📜 Ver Historial
                </button>
              </div>

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
                      gap: "10px",
                    }}
                  >
                    {camposDelCliente.map((cmp, idx) => {
                      const lotesCamp = lotes.filter(
                        (l) => Number(l.campo_id) === Number(cmp.id),
                      );
                      const nombresLotesStr = lotesCamp
                        .map((l) => l.numero_lote)
                        .join(", ");
                      return (
                        <div key={cmp.id} style={styles.campoCard(idx)}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                maxWidth: "85%",
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: "800",
                                  color: "#0f172a",
                                  fontSize: "1.05rem",
                                }}
                              >
                                {cmp.nombre}
                              </span>
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
                            </div>
                            <button
                              onClick={() => abrirModalEdicionCampo(cmp)}
                              style={styles.btnIconOnly}
                              title="Editar campo y lotes"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              </svg>
                            </button>
                          </div>

                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#334155",
                              borderTop: "1px solid rgba(0,0,0,0.06)",
                              paddingTop: "4px",
                              marginTop: "2px",
                              wordBreak: "break-word",
                            }}
                          >
                            <b>Lotes:</b>{" "}
                            {nombresLotesStr || (
                              <span
                                style={{
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

      {modalHistorialAbierto && (
        <div style={styles.modalFullScreenOverlay}>
          <div style={styles.modalFullScreenContent}>
            <button
              onClick={() => setModalHistorialAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <div
              style={{
                borderBottom: "1px solid #e2e8f0",
                paddingBottom: "12px",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "1.4rem", color: "#1e293b", margin: 0 }}>
                Historial General - {clienteSeleccionado?.nombre}
              </h3>
            </div>

            <div style={styles.filtrosContainer}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Período</label>
                <select
                  value={tipoFiltro}
                  onChange={(e) => {
                    setTipoFiltro(e.target.value);
                    setValorFecha("");
                    setFechaDesde("");
                    setFechaHasta("");
                  }}
                  style={styles.select}
                >
                  <option value="todo">Todo</option>
                  <option value="dia">Por Día</option>
                  <option value="rango">Por Rango de Fechas</option>
                  <option value="mes">Por Mes</option>
                  <option value="anio">Por Año</option>
                </select>
              </div>

              {tipoFiltro === "dia" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Día</label>
                  <input
                    type="date"
                    value={valorFecha}
                    onChange={(e) => setValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              {tipoFiltro === "rango" && (
                <>
                  <div style={styles.inputGroupDestacado}>
                    <label style={styles.labelDestacado}>Desde</label>
                    <input
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroupDestacado}>
                    <label style={styles.labelDestacado}>Hasta</label>
                    <input
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </>
              )}

              {tipoFiltro === "mes" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Mes</label>
                  <input
                    type="month"
                    value={valorFecha}
                    onChange={(e) => setValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              {tipoFiltro === "anio" && (
                <div style={styles.inputGroupDestacado}>
                  <label style={styles.labelDestacado}>Año</label>
                  <input
                    type="number"
                    placeholder="2026"
                    value={valorFecha}
                    onChange={(e) => setValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
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
              {/* HISTORIAL DE TRABAJOS (INICIALMENTE PLEGADO) */}
              <div>
                <div
                  onClick={() => setMostrarTrabajos(!mostrarTrabajos)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8fafc",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{ fontSize: "1.1rem", color: "#1e293b", margin: 0 }}
                  >
                    Historial de Trabajos {mostrarTrabajos ? "▼" : "▶"}
                  </h4>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {mostrarTrabajos ? "Ocultar" : "Mostrar"}
                  </span>
                </div>

                {mostrarTrabajos && (
                  <div style={{ marginTop: "12px" }}>
                    {trabajosOrdenados.length === 0 ? (
                      <p style={{ color: "#64748b", fontStyle: "italic" }}>
                        No hay trabajos registrados para este filtro.
                      </p>
                    ) : (
                      <table style={styles.table}>
                        <colgroup>
                          <col style={{ width: "12%" }} />
                          <col style={{ width: "16%" }} />
                          <col style={{ width: "10%" }} />
                          <col style={{ width: "16%" }} />
                          <col style={{ width: "15%" }} />
                          <col style={{ width: "11%" }} />
                          <col style={{ width: "10%" }} />
                          <col style={{ width: "10%" }} />
                        </colgroup>
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
                            <th style={styles.th}>Lotes</th>
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
                            <th style={styles.th}>Hectáreas</th>
                            <th style={styles.th}>Empleado</th>
                            <th style={styles.th}>Máquina</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trabajosOrdenados.map((t, idx) => {
                            const loteObj = lotes.find(
                              (l) => Number(l.id) === Number(t.lote_id),
                            );
                            const campoObj = campos.find(
                              (c) => Number(c.id) === Number(loteObj?.campo_id),
                            );
                            const maquinaObj = maquinas.find(
                              (m) => Number(m.id) === Number(t.maquina_id),
                            );
                            const empleadoObj = empleados.find(
                              (e) => Number(e.id) === Number(t.empleado_id),
                            );
                            const nombreEmp = empleadoObj
                              ? empleadoObj.nombre || empleadoObj.apellido
                                ? `${empleadoObj.nombre || ""} ${empleadoObj.apellido || ""}`.trim()
                                : empleadoObj.username
                              : "-";

                            return (
                              <tr
                                key={idx}
                                style={{
                                  backgroundColor: t.tieneDeudaGrupo
                                    ? "#fef2f2"
                                    : "transparent",
                                }}
                              >
                                <td style={styles.td}>
                                  {formatearFecha(t.fecha)}
                                </td>
                                <td style={styles.td}>
                                  {campoObj?.nombre || "N/A"}
                                </td>
                                <td style={styles.td}>
                                  {t.cantidad_lotes} lote(s)
                                </td>
                                <td style={styles.td}>{t.tratamiento}</td>
                                <td style={styles.td}>{t.tipo_cultivo}</td>
                                <td style={styles.td}>
                                  {t.cantidad_hectareas_total} ha
                                </td>
                                <td style={styles.td}>{nombreEmp}</td>
                                <td style={styles.td}>
                                  {maquinaObj?.nombre ||
                                    maquinaObj?.patente ||
                                    "N/A"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              {/* HISTORIAL DE PAGOS (INICIALMENTE PLEGADO) */}
              <div
                style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}
              >
                <div
                  onClick={() => setMostrarPagos(!mostrarPagos)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: "#f8fafc",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h4
                    style={{ fontSize: "1.1rem", color: "#1e293b", margin: 0 }}
                  >
                    Historial de Pagos {mostrarPagos ? "▼" : "▶"}
                  </h4>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {mostrarPagos ? "Ocultar" : "Mostrar"}
                  </span>
                </div>

                {mostrarPagos && (
                  <div style={{ marginTop: "12px" }}>
                    {pagosOrdenados.length === 0 ? (
                      <p style={{ color: "#64748b", fontStyle: "italic" }}>
                        No hay pagos registrados para este filtro.
                      </p>
                    ) : (
                      <table style={styles.table}>
                        <colgroup>
                          <col style={{ width: "16%" }} />
                          <col style={{ width: "18%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "16%" }} />
                          <col style={{ width: "14%" }} />
                          <col style={{ width: "16%" }} />
                        </colgroup>
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
                          {pagosOrdenados.map((p, idx) => (
                            <tr key={idx}>
                              <td style={styles.td}>
                                {formatearFecha(p.fecha)}
                              </td>
                              <td style={styles.td}>
                                {p.hectareas_pagadas_total} ha
                              </td>
                              <td style={styles.td}>
                                $
                                {Number(
                                  p.precio_por_hectarea || 0,
                                ).toLocaleString()}
                              </td>
                              <td style={styles.td}>
                                ${Number(p.subtotal_total).toLocaleString()}
                              </td>
                              <td style={styles.td}>
                                ${Number(p.iva_total).toLocaleString()}
                              </td>
                              <td style={{ ...styles.td, fontWeight: "bold" }}>
                                ${Number(p.total_general).toLocaleString()}
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalDeudaAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalDeudaAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
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
                const pagadasHa = Math.round(
                  Number(t.total_hectareas_pagadas) || 0,
                );
                const pendienteHa =
                  Math.round(Number(t.cantidad_hectareas)) - pagadasHa;
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
                        {Math.round(Number(t.cantidad_hectareas))} ha)
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
            <button
              onClick={() => setModalCobroAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
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
            <button
              onClick={() => setModalConfirmarCobroAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
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

      {modalCampoAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalCampoAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Nuevos lotes separados por coma..."
                    value={nuevoLoteTexto}
                    onChange={(e) => setNuevoLoteTexto(e.target.value)}
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={agregarNuevoLoteEnCampo}
                    style={styles.btnPrimary}
                  >
                    Agregar lotes
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
            <button
              onClick={() => setModalLoteAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
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
            <button
              onClick={() => setModalAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3 style={{ marginBottom: "16px", color: "#1e293b" }}>
              {modoEdicion
                ? "Modificar Cliente y Añadir Campos"
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
                    CUIT
                  </label>
                  <input
                    type="text"
                    value={formCliente.cuit}
                    onChange={(e) =>
                      setFormCliente({ ...formCliente, cuit: e.target.value })
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
                  {modoEdicion
                    ? "Agregar Nuevos Campos y Lotes"
                    : "Campos y Lotes Asociados"}
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
                      required={!modoEdicion && idx === 0}
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
