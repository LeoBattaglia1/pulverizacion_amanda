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
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    width: "100%",
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
  },
  btnPrimary: {
    padding: "6px 12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.8rem",
  },
  btnSecondary: {
    padding: "8px 16px",
    backgroundColor: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
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
  }),
};

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [pagosProveedores, setPagosProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [facturasExpandidas, setFacturasExpandidas] = useState({});

  const [toasts, setToasts] = useState([]);

  const mostrarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const parteFecha = fechaStr.split("T")[0];
    const [anio, mes, dia] = parteFecha.split("-");
    if (anio && mes && dia) {
      return `${dia}/${mes}/${anio}`;
    }
    return fechaStr;
  };

  // Modal Nuevo / Editar Proveedor
  const [modalProveedorAbierto, setModalProveedorAbierto] = useState(false);
  const [modoEdicionProv, setModoEdicionProv] = useState(false);
  const [nombreProv, setNombreProv] = useState("");
  const [telProv, setTelProv] = useState("");

  // Modal Nueva Factura
  const [modalFacturaAbierto, setModalFacturaAbierto] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState("");
  const [montoTotal, setMontoTotal] = useState("");
  const [montoPagado, setMontoPagado] = useState("");
  const [fechaFactura, setFechaFactura] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Modal Abonar Factura
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [montoAbono, setMontoAbono] = useState("");
  const [fechaAbono, setFechaAbono] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        const [resProv, resPagos] = await Promise.all([
          api.get("/proveedores").catch(() => ({ data: [] })),
          api.get("/proveedores/pagos").catch(() => ({ data: [] })),
        ]);
        if (isMounted) {
          setProveedores(resProv.data);
          setPagosProveedores(resPagos.data);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, []);

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const facturasDelProveedor = useMemo(() => {
    if (!proveedorSeleccionado) return [];
    return pagosProveedores.filter(
      (f) => Number(f.proveedor_id) === Number(proveedorSeleccionado.id),
    );
  }, [pagosProveedores, proveedorSeleccionado]);

  const facturasAgrupadas = useMemo(() => {
    const map = {};
    facturasDelProveedor.forEach((f) => {
      const nro = String(f.numero_factura).trim();
      if (!map[nro]) {
        map[nro] = {
          numero_factura: nro,
          fechaOriginal: f.fecha,
          movimientos: [],
        };
      }
      map[nro].movimientos.push(f);
      if (f.fecha < map[nro].fechaOriginal) {
        map[nro].fechaOriginal = f.fecha;
      }
    });

    const lista = Object.values(map).map((item) => {
      item.movimientos.sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha) || a.id - b.id,
      );

      const montoTotalFactura = Number(item.movimientos[0]?.monto_total || 0);
      const ultimoMovimiento = item.movimientos[item.movimientos.length - 1];
      const pendienteActual = Number(ultimoMovimiento?.monto_pendiente || 0);
      const pagadoTotal = Math.max(0, montoTotalFactura - pendienteActual);

      return {
        ...item,
        monto_total: montoTotalFactura,
        monto_pendiente_actual: pendienteActual,
        totalPagado: pagadoTotal,
      };
    });

    // Ordenar facturas de más reciente a más vieja
    lista.sort((a, b) => new Date(b.fechaOriginal) - new Date(a.fechaOriginal));

    return lista;
  }, [facturasDelProveedor]);

  const toggleExpandirFactura = (nro) => {
    setFacturasExpandidas((prev) => ({
      ...prev,
      [nro]: !prev[nro],
    }));
  };

  const abrirModalNuevoProveedor = () => {
    setModoEdicionProv(false);
    setNombreProv("");
    setTelProv("");
    setModalProveedorAbierto(true);
  };

  const abrirModalEdicionProveedor = () => {
    if (!proveedorSeleccionado) return;
    setModoEdicionProv(true);
    setNombreProv(proveedorSeleccionado.nombre);
    setTelProv(proveedorSeleccionado.telefono || "");
    setModalProveedorAbierto(true);
  };

  const handleGuardarProveedor = async (e) => {
    e.preventDefault();
    const nombreLimpio = nombreProv.trim();
    if (!nombreLimpio) return;

    const existe = proveedores.some(
      (p) =>
        p.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase() &&
        (!modoEdicionProv ||
          Number(p.id) !== Number(proveedorSeleccionado?.id)),
    );
    if (existe) {
      mostrarToast(
        "Ya existe un proveedor registrado con ese nombre.",
        "error",
      );
      return;
    }

    try {
      if (modoEdicionProv) {
        await api.put(`/proveedores/${proveedorSeleccionado.id}`, {
          nombre: nombreLimpio,
          telefono: telProv.trim(),
        });
        const [resProv, resPagos] = await Promise.all([
          api.get("/proveedores").catch(() => ({ data: [] })),
          api.get("/proveedores/pagos").catch(() => ({ data: [] })),
        ]);
        setProveedores(resProv.data);
        setPagosProveedores(resPagos.data);
        setProveedorSeleccionado((prev) => ({
          ...prev,
          nombre: nombreLimpio,
          telefono: telProv.trim(),
        }));
        mostrarToast("Proveedor actualizado con éxito.");
      } else {
        const res = await api.post("/proveedores", {
          nombre: nombreLimpio,
          telefono: telProv.trim(),
        });
        const [resProv, resPagos] = await Promise.all([
          api.get("/proveedores").catch(() => ({ data: [] })),
          api.get("/proveedores/pagos").catch(() => ({ data: [] })),
        ]);
        setProveedores(resProv.data);
        setPagosProveedores(resPagos.data);
        setProveedorSeleccionado(
          resProv.data.find((p) => p.id === res.data.id) || res.data,
        );
        mostrarToast("Proveedor registrado con éxito.");
      }
      setModalProveedorAbierto(false);
    } catch (error) {
      mostrarToast(
        error.response?.data?.error || "No se pudo guardar el proveedor.",
        "error",
      );
    }
  };

  const handleMontoTotalChange = (e) => {
    const val = e.target.value;
    setMontoTotal(val);
    setMontoPagado(val);
  };

  const handleCrearFactura = async (e) => {
    e.preventDefault();
    if (!proveedorSeleccionado || !numeroFactura || !montoTotal) return;

    const nroFacturaLimpio = numeroFactura.trim();
    const facturaExistente = pagosProveedores.some(
      (f) =>
        String(f.numero_factura).trim().toLowerCase() ===
        nroFacturaLimpio.toLowerCase(),
    );
    if (facturaExistente) {
      mostrarToast("Ya existe una factura registrada con ese número.", "error");
      return;
    }

    const total = Number(montoTotal);
    const pagado = montoPagado !== "" ? Number(montoPagado) : total;

    if (pagado > total) {
      mostrarToast(
        "El monto pagado no puede ser mayor al monto total.",
        "error",
      );
      return;
    }

    try {
      await api.post("/proveedores/pagos", {
        proveedor_id: proveedorSeleccionado.id,
        numero_factura: nroFacturaLimpio,
        monto_total: total,
        monto_pagado: pagado,
        fecha: fechaFactura,
      });
      setModalFacturaAbierto(false);
      setNumeroFactura("");
      setMontoTotal("");
      setMontoPagado("");
      const [resProv, resPagos] = await Promise.all([
        api.get("/proveedores").catch(() => ({ data: [] })),
        api.get("/proveedores/pagos").catch(() => ({ data: [] })),
      ]);
      setProveedores(resProv.data);
      setPagosProveedores(resPagos.data);
      mostrarToast("Factura registrada correctamente.");
    } catch (error) {
      mostrarToast(
        error.response?.data?.error || "Error al registrar la factura.",
        "error",
      );
    }
  };

  const abrirModalAbono = (facAgrupada) => {
    setFacturaSeleccionada(facAgrupada);
    setMontoAbono(Math.round(facAgrupada.monto_pendiente_actual));
    setFechaAbono(new Date().toISOString().split("T")[0]);
  };

  const handleRegistrarAbono = async (e) => {
    e.preventDefault();
    if (!facturaSeleccionada || !montoAbono) return;

    const abono = Number(montoAbono);
    const actualPendiente = Number(facturaSeleccionada.monto_pendiente_actual);
    if (abono > actualPendiente) {
      mostrarToast("El monto a abonar supera la deuda pendiente.", "error");
      return;
    }

    try {
      await api.post("/proveedores/pagos/abonar", {
        proveedor_id: proveedorSeleccionado.id,
        numero_factura: facturaSeleccionada.numero_factura,
        monto_abona: abono,
        monto_pendiente_anterior: actualPendiente,
        fecha: fechaAbono,
      });
      setFacturaSeleccionada(null);
      setMontoAbono("");
      const [resProv, resPagos] = await Promise.all([
        api.get("/proveedores").catch(() => ({ data: [] })),
        api.get("/proveedores/pagos").catch(() => ({ data: [] })),
      ]);
      setProveedores(resProv.data);
      setPagosProveedores(resPagos.data);
      mostrarToast("Abono registrado con éxito.");
    } catch (error) {
      mostrarToast(
        error.response?.data?.error || "Error al registrar el abono.",
        "error",
      );
    }
  };

  const totalMontoGeneral = facturasAgrupadas.reduce(
    (sum, f) => sum + (Number(f.monto_total) || 0),
    0,
  );
  const totalPagadoGeneral = facturasAgrupadas.reduce(
    (sum, f) => sum + (Number(f.totalPagado) || 0),
    0,
  );
  const totalPendienteGeneral = facturasAgrupadas.reduce(
    (sum, f) => sum + (Number(f.monto_pendiente_actual) || 0),
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
          placeholder="Buscar proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...styles.input, maxWidth: "280px" }}
        />
        <button onClick={abrirModalNuevoProveedor} style={styles.btnSuccess}>
          + Nuevo Proveedor
        </button>
      </div>

      <div style={styles.panelGrid}>
        {/* PANEL IZQUIERDO: LISTA DE PROVEEDORES */}
        <div style={styles.cardLeft}>
          <div style={{ maxHeight: "520px", overflowY: "auto" }}>
            <table style={styles.table}>
              <tbody>
                {proveedoresFiltrados.length === 0 ? (
                  <tr>
                    <td
                      style={{
                        ...styles.td,
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No se encontraron proveedores.
                    </td>
                  </tr>
                ) : (
                  proveedoresFiltrados.map((p) => {
                    const seleccionado = proveedorSeleccionado?.id === p.id;

                    const pagosDelProv = pagosProveedores.filter(
                      (fp) => Number(fp.proveedor_id) === Number(p.id),
                    );

                    const mapaFacturasProv = {};
                    pagosDelProv.forEach((fp) => {
                      const nro = String(fp.numero_factura).trim();
                      if (!mapaFacturasProv[nro]) {
                        mapaFacturasProv[nro] = [];
                      }
                      mapaFacturasProv[nro].push(fp);
                    });

                    const tieneDeuda = Object.values(mapaFacturasProv).some(
                      (movs) => {
                        movs.sort(
                          (a, b) =>
                            new Date(a.fecha) - new Date(b.fecha) ||
                            a.id - b.id,
                        );
                        const ultimoMov = movs[movs.length - 1];
                        return Number(ultimoMov?.monto_pendiente || 0) > 0;
                      },
                    );

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setProveedorSeleccionado(p)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: seleccionado
                            ? "#e0f2fe"
                            : "transparent",
                        }}
                      >
                        <td
                          style={{
                            ...styles.td,
                            fontWeight: "600",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>{p.nombre}</span>
                          {tieneDeuda && (
                            <span
                              title="Tiene pagos pendientes"
                              style={{
                                width: "8px",
                                height: "8px",
                                backgroundColor: "#dc2626",
                                borderRadius: "50%",
                                display: "inline-block",
                              }}
                            ></span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL DERECHO: DETALLE Y FACTURAS */}
        <div style={styles.cardRight}>
          {proveedorSeleccionado ? (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
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
                      {proveedorSeleccionado.nombre}
                    </h3>
                    <button
                      onClick={abrirModalEdicionProveedor}
                      style={styles.btnIconOnly}
                      title="Modificar datos del proveedor"
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
                    Teléfono: {proveedorSeleccionado.telefono || "Sin teléfono"}
                  </p>
                </div>
                <button
                  onClick={() => setModalFacturaAbierto(true)}
                  style={styles.btnPrimary}
                >
                  + Cargar Factura
                </button>
              </div>

              {/* HISTORIAL DE FACTURAS DEL PROVEEDOR */}
              <h4
                style={{
                  color: "#334155",
                  marginBottom: "8px",
                  fontSize: "1rem",
                }}
              >
                Historial de Facturas
              </h4>
              {facturasAgrupadas.length === 0 ? (
                <p
                  style={{
                    color: "#64748b",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                  }}
                >
                  No hay facturas registradas para este proveedor.
                </p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Fecha</th>
                      <th style={styles.th}>Nro Factura</th>
                      <th style={styles.th}>Total</th>
                      <th style={styles.th}>Pagado</th>
                      <th style={styles.th}>Pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasAgrupadas.map((f) => {
                      const total = Number(f.monto_total || 0);
                      const pagado = Number(f.totalPagado || 0);
                      const pendiente = Number(f.monto_pendiente_actual || 0);
                      const esDeudor = pendiente > 0;
                      const estaExpandido =
                        !!facturasExpandidas[f.numero_factura];
                      const tieneMultiplesPagos = f.movimientos.length > 1;

                      const backgroundColorRow = esDeudor
                        ? "#fef2f2"
                        : "#f0fdf4";

                      return (
                        <tr
                          key={f.numero_factura}
                          style={{ display: "contents" }}
                        >
                          <tr style={{ backgroundColor: backgroundColorRow }}>
                            <td style={styles.td}>
                              {formatearFecha(f.fechaOriginal)}
                            </td>
                            <td style={styles.td}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <span>{f.numero_factura}</span>
                                {tieneMultiplesPagos && (
                                  <button
                                    onClick={() =>
                                      toggleExpandirFactura(f.numero_factura)
                                    }
                                    title="Desplegar historial de pagos"
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: "#2563eb",
                                      cursor: "pointer",
                                      fontSize: "0.75rem",
                                      padding: "2px",
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      style={{
                                        transform: estaExpandido
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                        transition: "transform 0.2s",
                                      }}
                                    >
                                      <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                            <td style={styles.td}>${total.toLocaleString()}</td>
                            <td style={styles.td}>
                              ${pagado.toLocaleString()}
                            </td>
                            <td style={styles.td}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span>${pendiente.toLocaleString()}</span>
                                {esDeudor && (
                                  <button
                                    onClick={() => abrirModalAbono(f)}
                                    style={styles.btnPrimary}
                                  >
                                    Abonar
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* FILA DESPLEGABLE CON EL HISTORIAL PARCIAL */}
                          {estaExpandido && (
                            <tr>
                              <td
                                colSpan="5"
                                style={{
                                  ...styles.td,
                                  backgroundColor: "#ffffff",
                                  padding: "10px 16px",
                                  borderBottom: "2px solid #cbd5e1",
                                }}
                              >
                                <table
                                  style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    backgroundColor: "#f8fafc",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ backgroundColor: "#e2e8f0" }}>
                                      <th
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "0.75rem",
                                          textAlign: "left",
                                        }}
                                      >
                                        Fecha
                                      </th>
                                      <th
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "0.75rem",
                                          textAlign: "left",
                                        }}
                                      >
                                        Nro Factura
                                      </th>
                                      <th
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "0.75rem",
                                          textAlign: "left",
                                        }}
                                      >
                                        Total
                                      </th>
                                      <th
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "0.75rem",
                                          textAlign: "left",
                                        }}
                                      >
                                        Pagado
                                      </th>
                                      <th
                                        style={{
                                          padding: "6px 8px",
                                          fontSize: "0.75rem",
                                          textAlign: "left",
                                        }}
                                      >
                                        Pendiente
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {f.movimientos.map((m, idx) => {
                                      const montoTotalB = f.monto_total;
                                      const pendienteMov = Number(
                                        m.monto_pendiente || 0,
                                      );

                                      const pagadoMovRegistro =
                                        idx === 0
                                          ? Math.max(
                                              0,
                                              montoTotalB - pendienteMov,
                                            )
                                          : Number(m.monto_total || 0);

                                      return (
                                        <tr
                                          key={m.id}
                                          style={{
                                            borderBottom: "1px solid #e2e8f0",
                                          }}
                                        >
                                          <td
                                            style={{
                                              padding: "6px 8px",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            {formatearFecha(m.fecha)}
                                          </td>
                                          <td
                                            style={{
                                              padding: "6px 8px",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            {m.numero_factura}
                                          </td>
                                          <td
                                            style={{
                                              padding: "6px 8px",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            {idx === 0
                                              ? `$${montoTotalB.toLocaleString()}`
                                              : "-"}
                                          </td>
                                          <td
                                            style={{
                                              padding: "6px 8px",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            $
                                            {pagadoMovRegistro.toLocaleString()}
                                          </td>
                                          <td
                                            style={{
                                              padding: "6px 8px",
                                              fontSize: "0.75rem",
                                              fontWeight: "bold",
                                              color:
                                                pendienteMov > 0
                                                  ? "#991b1b"
                                                  : "#166534",
                                            }}
                                          >
                                            ${pendienteMov.toLocaleString()}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{ backgroundColor: "#f1f5f9", fontWeight: "bold" }}
                    >
                      <td
                        colSpan="2"
                        style={{ ...styles.td, textAlign: "right" }}
                      >
                        Totales Generales:
                      </td>
                      <td style={styles.td}>
                        ${totalMontoGeneral.toLocaleString()}
                      </td>
                      <td style={styles.td}>
                        ${totalPagadoGeneral.toLocaleString()}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          color:
                            totalPendienteGeneral > 0 ? "#991b1b" : "inherit",
                        }}
                      >
                        ${totalPendienteGeneral.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
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
              Selecciona un proveedor de la lista para ver su información y
              facturas.
            </div>
          )}
        </div>
      </div>

      {/* MODAL NUEVO / EDITAR PROVEEDOR */}
      {modalProveedorAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalProveedorAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3
              style={{ marginBottom: "16px", color: "#1e293b", marginTop: 0 }}
            >
              {modoEdicionProv ? "Modificar Proveedor" : "Nuevo Proveedor"}
            </h3>
            <form onSubmit={handleGuardarProveedor}>
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
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={nombreProv}
                  onChange={(e) => setNombreProv(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
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
                  value={telProv}
                  onChange={(e) => setTelProv(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalProveedorAbierto(false)}
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

      {/* MODAL NUEVA FACTURA */}
      {modalFacturaAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setModalFacturaAbierto(false)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3
              style={{ marginBottom: "16px", color: "#1e293b", marginTop: 0 }}
            >
              Cargar Factura a {proveedorSeleccionado?.nombre}
            </h3>
            <form onSubmit={handleCrearFactura}>
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
                  Nro Factura *
                </label>
                <input
                  type="text"
                  required
                  value={numeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  style={styles.input}
                />
              </div>
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
                  Monto Total ($) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={montoTotal}
                  onChange={handleMontoTotalChange}
                  style={styles.input}
                />
              </div>
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
                  Monto Pagado ($) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Fecha
                </label>
                <input
                  type="date"
                  value={fechaFactura}
                  onChange={(e) => setFechaFactura(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalFacturaAbierto(false)}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSuccess}>
                  Registrar Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ABONAR */}
      {facturaSeleccionada && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button
              onClick={() => setFacturaSeleccionada(null)}
              style={styles.btnCloseX}
            >
              ✕
            </button>
            <h3
              style={{ marginBottom: "16px", color: "#1e293b", marginTop: 0 }}
            >
              Abonar a Factura #{facturaSeleccionada.numero_factura}
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "#64748b",
                marginBottom: "12px",
              }}
            >
              <b>Deuda Actual:</b> $
              {Number(
                facturaSeleccionada.monto_pendiente_actual,
              ).toLocaleString()}
            </p>
            <form onSubmit={handleRegistrarAbono}>
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
                  Monto a pagar ($) *
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={montoAbono}
                  onChange={(e) => setMontoAbono(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    marginBottom: "4px",
                    color: "#475569",
                  }}
                >
                  Fecha de Abono
                </label>
                <input
                  type="date"
                  value={fechaAbono}
                  onChange={(e) => setFechaAbono(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFacturaSeleccionada(null)}
                  style={styles.btnSecondary}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.btnSuccess}>
                  Confirmar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
