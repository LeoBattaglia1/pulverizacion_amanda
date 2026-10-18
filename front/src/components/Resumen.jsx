import { useState, useEffect, useMemo, useRef } from "react";
import api from "../services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const styles = {
  container: {
    padding: "16px",
    maxWidth: "100%",
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginBottom: "12px",
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
  label: {
    fontSize: "0.75rem",
    fontWeight: "600",
    color: "#475569",
    whiteSpace: "nowrap",
  },
  labelDestacado: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#1d4ed8",
    whiteSpace: "nowrap",
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
  tableCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "0 12px 12px 12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    maxHeight: "65vh",
    overflowY: "auto",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.8rem",
    whiteSpace: "nowrap",
  },
  th: {
    textAlign: "left",
    padding: "12px 8px",
    color: "#ffffff",
    fontWeight: "600",
    backgroundColor: "#334155",
    position: "sticky",
    top: 0,
    zIndex: 20,
    boxShadow: "0 2px 2px rgba(0,0,0,0.15)",
  },
  td: {
    padding: "8px",
    textAlign: "left",
    verticalAlign: "middle",
    borderBottom: "1px solid #edf2f7",
    color: "#1e293b",
  },
  tfootTr: {
    backgroundColor: "#e2e8f0",
    fontWeight: "700",
  },
  btnReset: {
    padding: "6px 10px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "500",
    height: "32px",
    whiteSpace: "nowrap",
  },
  btnPdf: {
    padding: "10px 18px",
    backgroundColor: "black",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(71, 85, 105, 0.3)",
    transition: "all 0.2s ease",
  },
  btnEnviarResumen: {
    padding: "10px 22px",
    backgroundColor: "red",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.3)",
    transition: "all 0.25s ease",
  },
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
    borderRadius: "10px",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  checkboxDropdown: {
    position: "relative",
    width: "100%",
  },
  checkboxToggleBtn: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    fontSize: "0.85rem",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    marginTop: "4px",
    maxHeight: "150px",
    overflowY: "auto",
    zIndex: 10,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    padding: "6px",
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};

export default function ResumenGeneral() {
  const [trabajos, setTrabajos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [campos, setCampos] = useState([]);
  const [lotes, setLotes] = useState([]);

  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroCampo, setFiltroCampo] = useState("");
  const [filtroLote, setFiltroLote] = useState("");
  const [filtroTemporal, setFiltroTemporal] = useState("todos");
  const [valorFecha, setValorFecha] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [dropdownClientesAbierto, setDropdownClientesAbierto] = useState(false);
  const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
  const [modalTemporal, setModalTemporal] = useState("mes");
  const [modalValorFecha, setModalValorFecha] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownClientesAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTrab, resPagos, resCli, resCam, resLot] = await Promise.all([
          api.get("/trabajos"),
          api.get("/pagos-clientes").catch(() => ({ data: [] })),
          api.get("/clientes"),
          api.get("/campos"),
          api.get("/lotes").catch(() => ({ data: [] })),
        ]);
        setTrabajos(resTrab.data);
        setPagos(resPagos.data);
        setClientes(resCli.data);
        setCampos(resCam.data);
        setLotes(resLot.data);
        setClientesSeleccionados(resCli.data.map((c) => Number(c.id)));
      } catch (error) {
        console.error("Error al cargar datos del resumen:", error);
      }
    };
    fetchData();
  }, []);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const partes = fechaStr.split("T")[0].split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return fechaStr;
  };

  const obtenerFechaFormatoDDMMYYYY = () => {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const anio = hoy.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  const registrosCombinados = useMemo(() => {
    const listaExtendida = [];

    trabajos.forEach((t) => {
      const loteObj = lotes.find((l) => Number(l.id) === Number(t.lote_id));
      const campoObj = campos.find(
        (c) => Number(c.id) === Number(loteObj?.campo_id),
      );
      const clienteObj = clientes.find(
        (cli) => Number(cli.id) === Number(campoObj?.cliente_id),
      );

      const pagosDelTrabajo = pagos.filter(
        (p) => Number(p.trabajo_id) === Number(t.id),
      );

      if (pagosDelTrabajo.length > 0) {
        pagosDelTrabajo.forEach((p, idx) => {
          const hectareasPagadas = Number(p.hectareas_pagadas) || 0;
          const precioPorHa = Number(p.precio_por_hectarea) || 0;
          const subtotal = Number(p.subtotal) || hectareasPagadas * precioPorHa;
          const iva = Number(p.iva) || subtotal * 0.105;
          const total = subtotal + iva;

          listaExtendida.push({
            id: `${t.id}_pago_${p.id || idx}`,
            trabajoId: t.id,
            fecha: p.fecha || t.fecha || "",
            clienteId: clienteObj?.id || "",
            clienteNombre: clienteObj?.nombre || "N/A",
            clienteCuil:
              clienteObj?.cuil || clienteObj?.cuit || "Sin CUIT/CUIL",
            campoId: campoObj?.id || "",
            campoNombre: campoObj?.nombre || "N/A",
            loteId: loteObj?.id || "",
            loteNombre: loteObj?.numero_lote || "N/A",
            hectareasPagadas,
            precioPorHa,
            subtotal,
            iva,
            total,
          });
        });
      } else {
        const hectareasPagadas = Number(t.total_hectareas_pagadas) || 0;
        const precioPorHa = Number(t.precio_por_hectarea) || 0;
        const subtotal = hectareasPagadas * precioPorHa;
        const iva = subtotal * 0.105;
        const total = subtotal + iva;

        listaExtendida.push({
          id: `${t.id}_base`,
          trabajoId: t.id,
          fecha: t.fecha || "",
          clienteId: clienteObj?.id || "",
          clienteNombre: clienteObj?.nombre || "N/A",
          clienteCuil: clienteObj?.cuil || clienteObj?.cuit || "Sin CUIT/CUIL",
          campoId: campoObj?.id || "",
          campoNombre: campoObj?.nombre || "N/A",
          loteId: loteObj?.id || "",
          loteNombre: loteObj?.numero_lote || "N/A",
          hectareasPagadas,
          precioPorHa,
          subtotal,
          iva,
          total,
        });
      }
    });

    return listaExtendida;
  }, [trabajos, pagos, lotes, campos, clientes]);

  const registrosFiltrados = useMemo(() => {
    return registrosCombinados.filter((r) => {
      if (filtroCliente && Number(r.clienteId) !== Number(filtroCliente))
        return false;
      if (filtroCampo && Number(r.campoId) !== Number(filtroCampo))
        return false;
      if (filtroLote && Number(r.loteId) !== Number(filtroLote)) return false;

      if (filtroTemporal !== "todos" && r.fecha) {
        const fechaTrabajoStr = r.fecha.split("T")[0];

        if (filtroTemporal === "dia" && valorFecha) {
          if (fechaTrabajoStr !== valorFecha) return false;
        } else if (filtroTemporal === "semana") {
          if (fechaDesde && fechaTrabajoStr < fechaDesde) return false;
          if (fechaHasta && fechaTrabajoStr > fechaHasta) return false;
        } else if (filtroTemporal === "mes" && valorFecha) {
          if (!fechaTrabajoStr.startsWith(valorFecha)) return false;
        } else if (filtroTemporal === "anio" && valorFecha) {
          if (!fechaTrabajoStr.startsWith(valorFecha)) return false;
        }
      }

      return true;
    });
  }, [
    registrosCombinados,
    filtroCliente,
    filtroCampo,
    filtroLote,
    filtroTemporal,
    valorFecha,
    fechaDesde,
    fechaHasta,
  ]);

  const totalesGenerales = useMemo(() => {
    return registrosFiltrados.reduce(
      (acc, curr) => {
        acc.hectareasPagadas += curr.hectareasPagadas;
        acc.subtotal += curr.subtotal;
        acc.iva += curr.iva;
        acc.total += curr.total;
        return acc;
      },
      {
        hectareasPagadas: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
      },
    );
  }, [registrosFiltrados]);

  const limpiarFiltros = () => {
    setFiltroCliente("");
    setFiltroCampo("");
    setFiltroLote("");
    setFiltroTemporal("todos");
    setValorFecha("");
    setFechaDesde("");
    setFechaHasta("");
  };

  const obtenerResumenFiltrosApli = () => {
    const detalles = [];
    const clienteObj = clientes.find(
      (c) => Number(c.id) === Number(filtroCliente),
    );
    detalles.push(`Cliente: ${clienteObj ? clienteObj.nombre : "Todos"}`);

    const campoObj = campos.find((c) => Number(c.id) === Number(filtroCampo));
    detalles.push(`Campo: ${campoObj ? campoObj.nombre : "Todos"}`);

    const loteObj = lotes.find((l) => Number(l.id) === Number(filtroLote));
    detalles.push(`Lote: ${loteObj ? loteObj.numero_lote : "Todos"}`);

    let temporalStr = "Histórico Completo";
    if (filtroTemporal === "dia") temporalStr = `Día ${valorFecha || "-"}`;
    else if (filtroTemporal === "semana")
      temporalStr = `Semana Desde ${fechaDesde || "-"} Hasta ${fechaHasta || "-"}`;
    else if (filtroTemporal === "mes") temporalStr = `Mes ${valorFecha || "-"}`;
    else if (filtroTemporal === "anio")
      temporalStr = `Año ${valorFecha || "-"}`;

    detalles.push(`Período: ${temporalStr}`);
    return detalles.join(" | ");
  };

  const generarPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Pulverización Amanda - Resumen de Operaciones", 14, 12);

    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Filtros Aplicados: ${obtenerResumenFiltrosApli()}`, 14, 18);
    // Coordenada X ajustada a 285 para evitar el corte en impresión/visualización A4 Horizontal
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 285, 12, {
      align: "right",
    });

    const tableColumn = [
      "Fecha",
      "Cliente",
      "Campo",
      "Lote",
      "Hectáreas Pagadas",
      "Precio x Ha",
      "Subtotal",
      "IVA (10.5%)",
      "Total",
    ];

    const tableRows = registrosFiltrados.map((r) => [
      formatearFecha(r.fecha),
      r.clienteNombre,
      r.campoNombre,
      r.loteNombre,
      `${r.hectareasPagadas} ha`,
      `$${r.precioPorHa.toLocaleString()}`,
      `$${r.subtotal.toLocaleString()}`,
      `$${r.iva.toLocaleString()}`,
      `$${r.total.toLocaleString()}`,
    ]);

    tableRows.push([
      "Totales Generales:",
      "",
      "",
      "",
      `${totalesGenerales.hectareasPagadas.toLocaleString()} ha`,
      "-",
      `$${totalesGenerales.subtotal.toLocaleString()}`,
      `$${totalesGenerales.iva.toLocaleString()}`,
      `$${totalesGenerales.total.toLocaleString()}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
      footStyles: {
        fillColor: [226, 232, 240],
        textColor: [15, 23, 42],
        fontStyle: "bold",
      },
    });

    doc.save(`Resumen_${obtenerFechaFormatoDDMMYYYY()}.pdf`);
  };

  const ejecutarEnvioWhatsApp = () => {
    if (clientesSeleccionados.length === 0) {
      alert("Debe seleccionar al menos un cliente.");
      return;
    }

    const registrosParaEnviar = registrosCombinados.filter((r) => {
      if (!clientesSeleccionados.includes(Number(r.clienteId))) return false;
      if (modalTemporal === "mes" && modalValorFecha && r.fecha) {
        if (!r.fecha.split("T")[0].startsWith(modalValorFecha)) return false;
      } else if (modalTemporal === "anio" && modalValorFecha && r.fecha) {
        if (!r.fecha.split("T")[0].startsWith(modalValorFecha)) return false;
      }
      return true;
    });

    if (registrosParaEnviar.length === 0) {
      alert(
        "No se encontraron registros para los clientes y período seleccionados.",
      );
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const clientesMap = {};

    registrosParaEnviar.forEach((r) => {
      if (!clientesMap[r.clienteId]) {
        clientesMap[r.clienteId] = {
          nombre: r.clienteNombre,
          cuil: r.clienteCuil,
          registros: [],
        };
      }
      clientesMap[r.clienteId].registros.push(r);
    });

    let esPrimeraPagina = true;

    Object.values(clientesMap).forEach((cliente) => {
      if (!esPrimeraPagina) {
        doc.addPage();
      }
      esPrimeraPagina = false;

      doc.setFontSize(15);
      doc.setTextColor(15, 23, 42);
      doc.text("Pulverización Amanda - Resumen Contable", 14, 14);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Cliente: ${cliente.nombre}   |   CUIT/CUIL: ${cliente.cuil}`,
        14,
        21,
      );
      doc.text(`Período: ${modalValorFecha || "General"}`, 14, 27);
      // Coordenada X ajustada a 285 para evitar el corte en impresión/visualización A4 Horizontal
      doc.text(
        `Fecha de Emisión: ${new Date().toLocaleDateString()}`,
        285,
        14,
        {
          align: "right",
        },
      );

      const clienteRows = cliente.registros.map((r) => [
        formatearFecha(r.fecha),
        r.campoNombre,
        r.loteNombre,
        `${r.hectareasPagadas} ha`,
        `$${r.precioPorHa.toLocaleString()}`,
        `$${r.subtotal.toLocaleString()}`,
        `$${r.iva.toLocaleString()}`,
        `$${r.total.toLocaleString()}`,
      ]);

      const subtotalCli = cliente.registros.reduce(
        (acc, curr) => acc + curr.subtotal,
        0,
      );
      const ivaCli = cliente.registros.reduce((acc, curr) => acc + curr.iva, 0);
      const totalCli = cliente.registros.reduce(
        (acc, curr) => acc + curr.total,
        0,
      );
      const pagHaCli = cliente.registros.reduce(
        (acc, curr) => acc + curr.hectareasPagadas,
        0,
      );

      clienteRows.push([
        "Total Cliente:",
        "",
        "",
        `${pagHaCli.toLocaleString()} ha`,
        "-",
        `$${subtotalCli.toLocaleString()}`,
        `$${ivaCli.toLocaleString()}`,
        `$${totalCli.toLocaleString()}`,
      ]);

      autoTable(doc, {
        head: [
          [
            "Fecha",
            "Campo",
            "Lote",
            "Hectáreas Pagadas",
            "Precio x Ha",
            "Subtotal",
            "IVA (10.5%)",
            "Total",
          ],
        ],
        body: clienteRows,
        startY: 32,
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
        footStyles: {
          fillColor: [226, 232, 240],
          textColor: [15, 23, 42],
          fontStyle: "bold",
        },
      });
    });

    doc.save(`Resumen_Contable_${obtenerFechaFormatoDDMMYYYY()}.pdf`);

    window.open("https://web.whatsapp.com", "_blank");
    setModalAbierto(false);
  };

  const seleccionarTodosClientes = (e) => {
    if (e.target.checked) {
      setClientesSeleccionados(clientes.map((c) => Number(c.id)));
    } else {
      setClientesSeleccionados([]);
    }
  };

  const toggleCliente = (id) => {
    const numId = Number(id);
    if (clientesSeleccionados.includes(numId)) {
      setClientesSeleccionados(
        clientesSeleccionados.filter((item) => item !== numId),
      );
    } else {
      setClientesSeleccionados([...clientesSeleccionados, numId]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <button onClick={generarPDF} style={styles.btnPdf}>
          📄 Generar PDF
        </button>

        <button
          onClick={() => setModalAbierto(true)}
          style={styles.btnEnviarResumen}
        >
          Enviar Resumen
        </button>
      </div>

      <div style={styles.filtrosContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Cliente</label>
          <select
            value={filtroCliente}
            onChange={(e) => {
              setFiltroCliente(e.target.value);
              setFiltroCampo("");
              setFiltroLote("");
            }}
            style={styles.select}
          >
            <option value="">Todos</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Campo</label>
          <select
            value={filtroCampo}
            onChange={(e) => {
              setFiltroCampo(e.target.value);
              setFiltroLote("");
            }}
            style={styles.select}
          >
            <option value="">Todos</option>
            {campos
              .filter(
                (c) =>
                  !filtroCliente ||
                  Number(c.cliente_id) === Number(filtroCliente),
              )
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Lote</label>
          <select
            value={filtroLote}
            onChange={(e) => setFiltroLote(e.target.value)}
            disabled={!filtroCampo}
            style={{
              ...styles.select,
              backgroundColor: !filtroCampo ? "#f1f5f9" : "#fff",
              cursor: !filtroCampo ? "not-allowed" : "pointer",
            }}
          >
            <option value="">Todos</option>
            {lotes
              .filter(
                (l) =>
                  !filtroCampo || Number(l.campo_id) === Number(filtroCampo),
              )
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.numero_lote}
                </option>
              ))}
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Fecha</label>
          <select
            value={filtroTemporal}
            onChange={(e) => {
              setFiltroTemporal(e.target.value);
              setValorFecha("");
              setFechaDesde("");
              setFechaHasta("");
            }}
            style={styles.select}
          >
            <option value="todos">Todo</option>
            <option value="dia">Día</option>
            <option value="semana">Semana (Desde / Hasta)</option>
            <option value="mes">Mes</option>
            <option value="anio">Año</option>
          </select>
        </div>

        {filtroTemporal === "dia" && (
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

        {filtroTemporal === "semana" && (
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

        {filtroTemporal === "mes" && (
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

        {filtroTemporal === "anio" && (
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

        <div style={styles.inputGroup}>
          <button onClick={limpiarFiltros} style={styles.btnReset}>
            Limpiar
          </button>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Campo</th>
              <th style={styles.th}>Lote</th>
              <th style={styles.th}>Hectáreas Pagadas</th>
              <th style={styles.th}>Precio x Ha</th>
              <th style={styles.th}>Subtotal</th>
              <th style={styles.th}>IVA (10.5%)</th>
              <th style={styles.th}>Total</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    ...styles.td,
                    textAlign: "center",
                    color: "#64748b",
                    padding: "16px",
                  }}
                >
                  No se encontraron registros con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((r, index) => {
                const bgRow = index % 2 === 0 ? "#ffffff" : "#f8fafc";
                return (
                  <tr key={r.id} style={{ backgroundColor: bgRow }}>
                    <td style={styles.td}>{formatearFecha(r.fecha)}</td>
                    <td style={styles.td}>{r.clienteNombre}</td>
                    <td style={styles.td}>{r.campoNombre}</td>
                    <td style={styles.td}>{r.loteNombre}</td>
                    <td style={styles.td}>{r.hectareasPagadas} ha</td>
                    <td style={styles.td}>${r.precioPorHa.toLocaleString()}</td>
                    <td style={styles.td}>${r.subtotal.toLocaleString()}</td>
                    <td style={styles.td}>${r.iva.toLocaleString()}</td>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      ${r.total.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {registrosFiltrados.length > 0 && (
            <tfoot>
              <tr style={styles.tfootTr}>
                <td colSpan="4" style={{ ...styles.td, textAlign: "right" }}>
                  Totales Generales:
                </td>
                <td style={styles.td}>
                  {totalesGenerales.hectareasPagadas.toLocaleString()} ha
                </td>
                <td style={styles.td}>-</td>
                <td style={styles.td}>
                  ${totalesGenerales.subtotal.toLocaleString()}
                </td>
                <td style={styles.td}>
                  ${totalesGenerales.iva.toLocaleString()}
                </td>
                <td style={{ ...styles.td, color: "#166534" }}>
                  ${totalesGenerales.total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {modalAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3
              style={{
                marginBottom: "16px",
                color: "#1e293b",
                fontSize: "1.2rem",
              }}
            >
              Envío de Resumen
            </h3>

            <div style={{ marginBottom: "14px" }} ref={dropdownRef}>
              <label style={styles.label}>Clientes a incluir en el PDF</label>
              <div style={styles.checkboxDropdown}>
                <button
                  type="button"
                  onClick={() =>
                    setDropdownClientesAbierto(!dropdownClientesAbierto)
                  }
                  style={styles.checkboxToggleBtn}
                >
                  <span>
                    {clientesSeleccionados.length === clientes.length
                      ? "Todos los clientes seleccionados"
                      : `${clientesSeleccionados.length} cliente(s) seleccionado(s)`}
                  </span>
                  <span>▼</span>
                </button>

                {dropdownClientesAbierto && (
                  <div style={styles.checkboxList}>
                    <label
                      style={{
                        ...styles.checkboxItem,
                        fontWeight: "bold",
                        borderBottom: "1px solid #e2e8f0",
                        paddingBottom: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={
                          clientesSeleccionados.length === clientes.length
                        }
                        onChange={seleccionarTodosClientes}
                      />
                      Seleccionar Todos
                    </label>
                    {clientes.map((c) => (
                      <label key={c.id} style={styles.checkboxItem}>
                        <input
                          type="checkbox"
                          checked={clientesSeleccionados.includes(Number(c.id))}
                          onChange={() => toggleCliente(c.id)}
                        />
                        {c.nombre}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <div style={{ flex: "1" }}>
                <label style={styles.label}>Filtrar por Período</label>
                <select
                  value={modalTemporal}
                  onChange={(e) => setModalTemporal(e.target.value)}
                  style={styles.select}
                >
                  <option value="mes">Mes</option>
                  <option value="anio">Año</option>
                  <option value="todos">Histórico Completo</option>
                </select>
              </div>

              {modalTemporal === "mes" && (
                <div style={{ flex: "1" }}>
                  <label style={styles.label}>Mes</label>
                  <input
                    type="month"
                    value={modalValorFecha}
                    onChange={(e) => setModalValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}

              {modalTemporal === "anio" && (
                <div style={{ flex: "1" }}>
                  <label style={styles.label}>Año</label>
                  <input
                    type="number"
                    placeholder="2026"
                    value={modalValorFecha}
                    onChange={(e) => setModalValorFecha(e.target.value)}
                    style={styles.input}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                borderTop: "1px solid #e2e8f0",
                paddingTop: "14px",
              }}
            >
              <button
                onClick={() => setModalAbierto(false)}
                style={{ ...styles.btnReset, height: "38px" }}
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarEnvioWhatsApp}
                style={{
                  ...styles.btnEnviarResumen,
                  padding: "8px 16px",
                  fontSize: "0.9rem",
                }}
              >
                Crear PDF y Abrir WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
