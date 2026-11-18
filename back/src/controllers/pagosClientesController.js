const db = require("../config/db");

// Obtener pagos (todos o filtrados por trabajo_id)
const getPagosClientes = async (req, res) => {
  try {
    const { trabajo_id } = req.query;
    let query = "SELECT * FROM pagos_clientes";
    let params = [];

    if (trabajo_id) {
      query += " WHERE trabajo_id = ?";
      params.push(trabajo_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar un nuevo pago/cobro (total o parcial guardando el monto pendiente en dinero)
const createPagoCliente = async (req, res) => {
  try {
    const {
      trabajo_id,
      fecha,
      monto_pendiente, // Almacena la diferencia/deuda en dinero
      subtotal,
      iva,
      total,
      precio_por_hectarea, // <-- Añadido aquí para recibirlo del frontend
    } = req.body;

    // 1. Verificar que el trabajo exista
    const [trabajoRows] = await db.query(
      "SELECT id FROM trabajos WHERE id = ?",
      [trabajo_id],
    );
    if (trabajoRows.length === 0) {
      return res
        .status(404)
        .json({ error: "El trabajo especificado no existe." });
    }

    // 2. Insertar el pago incluyendo el precio_por_hectarea
    const [result] = await db.query(
      `INSERT INTO pagos_clientes (trabajo_id, fecha, monto_pendiente, subtotal, iva, total, precio_por_hectarea) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        trabajo_id,
        fecha,
        monto_pendiente,
        subtotal,
        iva,
        total,
        precio_por_hectarea || 0, // <-- Guardado correctamente
      ],
    );

    res.status(201).json({
      id: result.insertId,
      trabajo_id,
      fecha,
      monto_pendiente,
      subtotal,
      iva,
      total,
      precio_por_hectarea: precio_por_hectarea || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar el monto pendiente de un pago existente
const updatePagoCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pendiente } = req.body;

    const [result] = await db.query(
      `UPDATE pagos_clientes SET monto_pendiente = ? WHERE id = ?`,
      [monto_pendiente, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro de pago no encontrado." });
    }

    res.json({ message: "Pago actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Liquidar un pago existente actualizando todos sus valores financieros
const liquidarPagoCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pendiente, subtotal, iva, total, precio_por_hectarea } =
      req.body;

    const [result] = await db.query(
      `UPDATE pagos_clientes 
       SET monto_pendiente = ?, subtotal = ?, iva = ?, total = ?, precio_por_hectarea = ? 
       WHERE id = ?`,
      [monto_pendiente, subtotal, iva, total, precio_por_hectarea, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro de pago no encontrado." });
    }

    res.json({ message: "Trabajo liquidado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar el precio por hectárea y recalcular los valores financieros del pago
const updatePrecioPorHectarea = async (req, res) => {
  try {
    const { id } = req.params; // ID del registro en pagos_clientes
    const { precio_por_hectarea } = req.body;

    // 1. Buscar el pago actual para saber qué trabajo está asociado
    const [pagoRows] = await db.query(
      "SELECT * FROM pagos_clientes WHERE id = ?",
      [id],
    );

    if (pagoRows.length === 0) {
      return res.status(404).json({ error: "Registro de pago no encontrado." });
    }

    const pagoActual = pagoRows[0];

    // 2. Obtener las hectáreas del trabajo asociado para recalcular subtotal, iva y total
    const [trabajoRows] = await db.query(
      "SELECT cantidad_hectareas FROM trabajos WHERE id = ?",
      [pagoActual.trabajo_id],
    );

    if (trabajoRows.length === 0) {
      return res.status(404).json({ error: "Trabajo asociado no encontrado." });
    }

    const cantidadHectareas = Number(trabajoRows[0].cantidad_hectareas) || 0;
    const nuevoPrecio = Number(precio_por_hectarea) || 0;

    // 3. Recalcular valores financieros
    const nuevoSubtotal = cantidadHectareas * nuevoPrecio;
    const nuevoIva = nuevoSubtotal * 0.105; // 10.5% de IVA
    const nuevoTotal = nuevoSubtotal + nuevoIva;

    // 4. Actualizar en la base de datos
    const [result] = await db.query(
      `UPDATE pagos_clientes 
       SET precio_por_hectarea = ?, subtotal = ?, iva = ?, total = ? 
       WHERE id = ?`,
      [nuevoPrecio, nuevoSubtotal, nuevoIva, nuevoTotal, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No se pudo actualizar el precio." });
    }

    res.json({
      message: "Precio por hectárea actualizado correctamente",
      precio_por_hectarea: nuevoPrecio,
      subtotal: nuevoSubtotal,
      iva: nuevoIva,
      total: nuevoTotal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPagosClientes,
  createPagoCliente,
  updatePagoCliente,
  liquidarPagoCliente,
  updatePrecioPorHectarea,
};
