const db = require("../config/db");

const getMaquinas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM maquinas");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMaquina = async (req, res) => {
  try {
    const { nombre } = req.body;
    const [result] = await db.query(
      "INSERT INTO maquinas (nombre) VALUES (?)",
      [nombre],
    );
    res.status(201).json({ id: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMaquina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    await db.query("UPDATE maquinas SET nombre = ? WHERE id = ?", [nombre, id]);
    res.json({ message: "Máquina actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMaquina = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM maquinas WHERE id = ?", [id]);
    res.json({ message: "Máquina eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMaquinas, createMaquina, updateMaquina, deleteMaquina };
