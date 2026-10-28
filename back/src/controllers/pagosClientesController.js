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

    // 2. Insertar el pago con el saldo pendiente monetario
    const [result] = await db.query(
      `INSERT INTO pagos_clientes (trabajo_id, fecha, monto_pendiente, subtotal, iva, total) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [trabajo_id, fecha, monto_pendiente, subtotal, iva, total],
    );

    res.status(201).json({
      id: result.insertId,
      trabajo_id,
      fecha,
      monto_pendiente,
      subtotal,
      iva,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPagosClientes, createPagoCliente };
