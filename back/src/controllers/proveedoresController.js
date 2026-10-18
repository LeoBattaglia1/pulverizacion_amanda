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
    const nombreLimpio = nombre ? nombre.trim() : "";

    const [duplicados] = await db.query(
      "SELECT id FROM proveedores WHERE LOWER(nombre) = LOWER(?)",
      [nombreLimpio],
    );
    if (duplicados.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe un proveedor con ese nombre." });
    }

    const [result] = await db.query(
      "INSERT INTO proveedores (nombre, telefono) VALUES (?, ?)",
      [nombreLimpio, telefono],
    );
    res
      .status(201)
      .json({ id: result.insertId, nombre: nombreLimpio, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono } = req.body;
    const nombreLimpio = nombre ? nombre.trim() : "";

    const [duplicados] = await db.query(
      "SELECT id FROM proveedores WHERE LOWER(nombre) = LOWER(?) AND id <> ?",
      [nombreLimpio, id],
    );
    if (duplicados.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe otro proveedor con ese nombre." });
    }

    await db.query(
      "UPDATE proveedores SET nombre = ?, telefono = ? WHERE id = ?",
      [nombreLimpio, telefono, id],
    );
    res.json({ message: "Proveedor actualizado con éxito" });
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
      ORDER BY pp.fecha DESC, pp.id DESC
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
    const nroFacturaLimpio = numero_factura ? numero_factura.trim() : "";

    const [duplicadas] = await db.query(
      "SELECT id FROM pagos_proveedores WHERE LOWER(numero_factura) = LOWER(?)",
      [nroFacturaLimpio],
    );
    if (duplicadas.length > 0) {
      return res
        .status(400)
        .json({ error: "Ya existe una factura registrada con ese número." });
    }

    const total = Number(monto_total) || 0;
    const pagado = monto_pagado !== undefined ? Number(monto_pagado) : total;
    const monto_pendiente = Math.max(0, total - pagado);

    const [result] = await db.query(
      "INSERT INTO pagos_proveedores (proveedor_id, numero_factura, monto_total, monto_pendiente, fecha) VALUES (?, ?, ?, ?, ?)",
      [proveedor_id, nroFacturaLimpio, total, monto_pendiente, fecha],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Factura registrada con éxito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Abonar saldo: el registro anterior pasa a saldo 0 y se crea un nuevo post con el saldo pendiente restante
const abonarPagoProveedor = async (req, res) => {
  try {
    const {
      id,
      proveedor_id,
      numero_factura,
      monto_abona,
      monto_pendiente_anterior,
      fecha,
    } = req.body;

    const abono = Number(monto_abona) || 0;
    const pendienteAnterior = Number(monto_pendiente_anterior) || 0;
    const nuevoPendiente = Math.max(0, pendienteAnterior - abono);

    // 1. Actualizar el registro anterior a saldado (pendiente = 0)
    await db.query(
      "UPDATE pagos_proveedores SET monto_pendiente = 0 WHERE id = ?",
      [id],
    );

    // 2. Si queda saldo pendiente, insertar un nuevo registro con el remanente
    if (nuevoPendiente > 0) {
      await db.query(
        "INSERT INTO pagos_proveedores (proveedor_id, numero_factura, monto_total, monto_pendiente, fecha) VALUES (?, ?, ?, ?, ?)",
        [proveedor_id, numero_factura, nuevoPendiente, nuevoPendiente, fecha],
      );
    }

    res.json({ message: "Abono registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProveedores,
  createProveedor,
  updateProveedor,
  getPagosProveedores,
  createPagoProveedor,
  abonarPagoProveedor,
};
