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

// Registrar un nuevo pago/cobro (parcial o total) sin modificar el trabajo original
const createPagoCliente = async (req, res) => {
  try {
    const {
      trabajo_id,
      fecha,
      hectareas_pagadas,
      precio_por_hectarea,
      subtotal,
      iva,
      total,
    } = req.body;

    // 1. Verificar que el trabajo exista y obtener su total de hectáreas
    const [trabajoRows] = await db.query(
      "SELECT cantidad_hectareas FROM trabajos WHERE id = ?",
      [trabajo_id],
    );
    if (trabajoRows.length === 0) {
      return res
        .status(404)
        .json({ error: "El trabajo especificado no existe." });
    }
    const trabajo = trabajoRows[0];

    // 2. Calcular cuántas hectáreas ya se pagaron previamente
    const [pagosRows] = await db.query(
      "SELECT COALESCE(SUM(hectareas_pagadas), 0) AS pagadas FROM pagos_clientes WHERE trabajo_id = ?",
      [trabajo_id],
    );
    const yaPagadas = Number(pagosRows[0].pagadas);
    const pendientes = Number(trabajo.cantidad_hectareas) - yaPagadas;

    // 3. Validar que no se intente pagar más de lo pendiente
    if (Number(hectareas_pagadas) > pendientes) {
      return res.status(400).json({
        error: `No se pueden cobrar ${hectareas_pagadas} ha. Solo quedan ${pendientes} ha pendientes.`,
      });
    }

    // 4. Insertar el nuevo pago en la tabla inmutable
    const [result] = await db.query(
      `INSERT INTO pagos_clientes (trabajo_id, fecha, hectareas_pagadas, precio_por_hectarea, subtotal, iva, total) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        trabajo_id,
        fecha,
        hectareas_pagadas,
        precio_por_hectarea,
        subtotal,
        iva,
        total,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      trabajo_id,
      fecha,
      hectareas_pagadas,
      precio_por_hectarea,
      subtotal,
      iva,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPagosClientes, createPagoCliente };
