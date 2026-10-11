const db = require("../config/db");

const getPagosEmpleados = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT pe.*, e.nombre AS empleado_nombre 
            FROM pagos_empleados pe
            JOIN empleados e ON pe.empleado_id = e.id
        `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPagoEmpleado = async (req, res) => {
  try {
    const { empleado_id, monto, fecha, concepto } = req.body;
    const [result] = await db.query(
      "INSERT INTO pagos_empleados (empleado_id, monto, fecha, concepto) VALUES (?, ?, ?, ?)",
      [empleado_id, monto, fecha, concepto],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Pago a empleado registrado correctamente",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPagosEmpleados, createPagoEmpleado };
