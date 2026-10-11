const db = require("../config/db");

const getLotes = async (req, res) => {
  try {
    const { campo_id } = req.query;
    let query = "SELECT * FROM lotes";
    let params = [];

    if (campo_id) {
      query += " WHERE campo_id = ?";
      params.push(campo_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLote = async (req, res) => {
  try {
    const { campo_id, numero_lote } = req.body;
    const [result] = await db.query(
      "INSERT INTO lotes (campo_id, numero_lote) VALUES (?, ?)",
      [campo_id, numero_lote],
    );
    res.status(201).json({ id: result.insertId, campo_id, numero_lote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLote = async (req, res) => {
  try {
    const { id } = req.params;
    const { campo_id, numero_lote } = req.body;
    await db.query(
      "UPDATE lotes SET campo_id = ?, numero_lote = ? WHERE id = ?",
      [campo_id, numero_lote, id],
    );
    res.json({ message: "Lote actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLote = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM lotes WHERE id = ?", [id]);
    res.json({ message: "Lote eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLotes, createLote, updateLote, deleteLote };
