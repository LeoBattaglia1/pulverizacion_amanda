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
  badgeDeuda: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },
  badgeSaldado: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "bold",
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

  const [toasts, setToasts] = useState([]);

  const mostrarToast = (mensaje, tipo = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
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

  const cargarDatos = async () => {
    try {
      const [resProv, resPagos] = await Promise.all([
        api.get("/proveedores").catch(() => ({ data: [] })),
        api.get("/proveedores/pagos").catch(() => ({ data: [] })),
      ]);
      setProveedores(resProv.data);
      setPagosProveedores(resPagos.data);

      setProveedorSeleccionado((prev) => {
        if (!prev) return null;
        return resProv.data.find((p) => p.id === prev.id) || null;
      });
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
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
        await cargarDatos();
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
        await cargarDatos();
        setProveedorSeleccionado(res.data);
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
      await cargarDatos();
      mostrarToast("Factura registrada correctamente.");
    } catch (error) {
      mostrarToast(
        error.response?.data?.error || "Error al registrar la factura.",
        "error",
      );
    }
  };

  const abrirModalAbono = (f) => {
    setFacturaSeleccionada(f);
    // Entero en el modal de abonar
    setMontoAbono(Math.round(Number(f.monto_pendiente) || 0));
    setFechaAbono(new Date().toISOString().split("T")[0]);
  };

  const handleRegistrarAbono = async (e) => {
    e.preventDefault();
    if (!facturaSeleccionada || !montoAbono) return;

    const abono = Number(montoAbono);
    const actualPendiente = Number(facturaSeleccionada.monto_pendiente);
    if (abono > actualPendiente) {
      mostrarToast("El monto a abonar supera la deuda pendiente.", "error");
      return;
    }

    try {
      await api.post("/proveedores/pagos/abonar", {
        id: facturaSeleccionada.id,
        proveedor_id: proveedorSeleccionado.id,
        numero_factura: facturaSeleccionada.numero_factura,
        monto_abona: abono,
        monto_pendiente_anterior: actualPendiente,
        fecha: fechaAbono,
      });
      setFacturaSeleccionada(null);
      setMontoAbono("");
      await cargarDatos();
      mostrarToast("Abono registrado con éxito.");
    } catch (error) {
      mostrarToast(
        error.response?.data?.error || "Error al registrar el abono.",
        "error",
      );
    }
  };

  const totalMontoGeneral = facturasDelProveedor.reduce(
    (sum, f) => sum + (Number(f.monto_total) || 0),
    0,
  );
  const totalPagadoGeneral = facturasDelProveedor.reduce(
    (sum, f) =>
      sum + (Number(f.monto_total || 0) - Number(f.monto_pendiente || 0)),
    0,
  );
  const totalPendienteGeneral = facturasDelProveedor.reduce(
    (sum, f) => sum + (Number(f.monto_pendiente) || 0),
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
                    // Verificar si el proveedor tiene pagos pendientes
                    const tieneDeuda = pagosProveedores.some(
                      (fp) =>
                        Number(fp.proveedor_id) === Number(p.id) &&
                        Number(fp.monto_pendiente) > 0,
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
              {facturasDelProveedor.length === 0 ? (
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
                      <th style={styles.th}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasDelProveedor.map((f) => {
                      const total = Number(f.monto_total || 0);
                      const pendiente = Number(f.monto_pendiente || 0);
                      const pagado = total - pendiente;
                      const esDeudor = pendiente > 0;
                      return (
                        <tr key={f.id}>
                          <td style={styles.td}>
                            {f.fecha ? f.fecha.split("T")[0] : "-"}
                          </td>
                          <td style={styles.td}>{f.numero_factura}</td>
                          <td style={styles.td}>${total.toLocaleString()}</td>
                          <td style={styles.td}>${pagado.toLocaleString()}</td>
                          <td style={styles.td}>
                            ${pendiente.toLocaleString()}
                          </td>
                          <td style={styles.td}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {esDeudor ? (
                                <>
                                  <span style={styles.badgeDeuda}>Deudor</span>
                                  <button
                                    onClick={() => abrirModalAbono(f)}
                                    style={{
                                      ...styles.btnPrimary,
                                      padding: "3px 8px",
                                      fontSize: "0.75rem",
                                    }}
                                  >
                                    Abonar
                                  </button>
                                </>
                              ) : (
                                <span style={styles.badgeSaldado}>Saldado</span>
                              )}
                            </div>
                          </td>
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
                      <td style={styles.td}></td>
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
              {Number(facturaSeleccionada.monto_pendiente).toLocaleString()}
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
