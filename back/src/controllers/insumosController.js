const db = require("../config/db");

const getInsumos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM insumos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createInsumo = async (req, res) => {
  try {
    const { nombre } = req.body;
    const [result] = await db.query(
      "INSERT INTO insumos (nombre, stock_actual) VALUES (?, 0.00)",
      [nombre],
    );
    res.status(201).json({ id: result.insertId, nombre, stock_actual: 0.0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial de ingresos
const getIngresos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM ingresos_insumos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar ingreso y actualizar stock
const registrarIngreso = async (req, res) => {
  try {
    const { insumo_id, cantidad, fecha } = req.body;
    await db.query(
      "INSERT INTO ingresos_insumos (insumo_id, cantidad, fecha) VALUES (?, ?, ?)",
      [insumo_id, cantidad, fecha || new Date()],
    );
    await db.query(
      "UPDATE insumos SET stock_actual = stock_actual + ? WHERE id = ?",
      [cantidad, insumo_id],
    );
    res.status(201).json({ message: "Ingreso registrado y stock actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener historial de retiros
const getRetiros = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM retiros_insumos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar retiro y descontar stock
const registrarRetiro = async (req, res) => {
  try {
    const { insumo_id, empleado_id, maquina_id, cantidad, fecha } = req.body;
    await db.query(
      "INSERT INTO retiros_insumos (insumo_id, empleado_id, maquina_id, cantidad, fecha) VALUES (?, ?, ?, ?, ?)",
      [insumo_id, empleado_id, maquina_id, cantidad, fecha || new Date()],
    );
    await db.query(
      "UPDATE insumos SET stock_actual = stock_actual - ? WHERE id = ?",
      [cantidad, insumo_id],
    );
    res.status(201).json({ message: "Retiro registrado y stock actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInsumos,
  createInsumo,
  getIngresos,
  registrarIngreso,
  getRetiros,
  registrarRetiro,
};
