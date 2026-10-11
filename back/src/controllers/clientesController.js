const db = require("../config/db"); // Ajusta la ruta de tu conexión

const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCliente = async (req, res) => {
  try {
    const { nombre, cuil, telefono } = req.body;
    const [result] = await db.query(
      "INSERT INTO clientes (nombre, cuil, telefono) VALUES (?, ?, ?)",
      [nombre, cuil, telefono],
    );
    res.status(201).json({ id: result.insertId, nombre, cuil, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cuil, telefono } = req.body;
    await db.query(
      "UPDATE clientes SET nombre = ?, cuil = ?, telefono = ? WHERE id = ?",
      [nombre, cuil, telefono, id],
    );
    res.json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM clientes WHERE id = ?", [id]);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getClientes, createCliente, updateCliente, deleteCliente };
