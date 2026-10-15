const db = require("../config/db");

const getProveedores = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM proveedores");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProveedor = async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    const [result] = await db.query(
      "INSERT INTO proveedores (nombre, telefono) VALUES (?, ?)",
      [nombre, telefono],
    );
    res.status(201).json({ id: result.insertId, nombre, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPagosProveedores = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pp.*, p.nombre AS proveedor_nombre 
      FROM pagos_proveedores pp
      JOIN proveedores p ON pp.proveedor_id = p.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPagoProveedor = async (req, res) => {
  try {
    const { proveedor_id, numero_factura, monto_total, monto_pagado, fecha } =
      req.body;

    const total = Number(monto_total) || 0;
    const pagado = monto_pagado !== undefined ? Number(monto_pagado) : total;
    const monto_pendiente = Math.max(0, total - pagado);

    const [result] = await db.query(
      "INSERT INTO pagos_proveedores (proveedor_id, numero_factura, monto_total, monto_pendiente, fecha) VALUES (?, ?, ?, ?, ?)",
      [proveedor_id, numero_factura, total, monto_pendiente, fecha],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Factura registrada con éxito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarPagoProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pendiente } = req.body;
    await db.query(
      "UPDATE pagos_proveedores SET monto_pendiente = ? WHERE id = ?",
      [monto_pendiente, id],
    );
    res.json({ message: "Estado de factura actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProveedores,
  createProveedor,
  getPagosProveedores,
  createPagoProveedor,
  actualizarPagoProveedor,
};
