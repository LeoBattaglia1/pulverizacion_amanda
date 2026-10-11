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
    const {
      proveedor_id,
      numero_factura,
      monto_total,
      monto_pendiente,
      fecha,
    } = req.body;
    const [result] = await db.query(
      "INSERT INTO pagos_proveedores (proveedor_id, numero_factura, monto_total, monto_pendiente, fecha) VALUES (?, ?, ?, ?, ?)",
      [
        proveedor_id,
        numero_factura,
        monto_total,
        monto_pendiente || 0.0,
        fecha,
      ],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Pago a proveedor registrado con éxito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProveedores,
  createProveedor,
  getPagosProveedores,
  createPagoProveedor,
};
