const db = require("../config/db");

const getCampos = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT c.*, cl.nombre AS cliente_nombre 
            FROM campos c 
            JOIN clientes cl ON c.cliente_id = cl.id
        `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCampo = async (req, res) => {
  try {
    const { cliente_id, nombre, ubicacion } = req.body;
    const [result] = await db.query(
      "INSERT INTO campos (cliente_id, nombre, ubicacion) VALUES (?, ?, ?)",
      [cliente_id, nombre, ubicacion],
    );
    res
      .status(201)
      .json({ id: result.insertId, cliente_id, nombre, ubicacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCampo = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, nombre, ubicacion } = req.body;
    await db.query(
      "UPDATE campos SET cliente_id = ?, nombre = ?, ubicacion = ? WHERE id = ?",
      [cliente_id, nombre, ubicacion, id],
    );
    res.json({ message: "Campo actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCampo = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM campos WHERE id = ?", [id]);
    res.json({ message: "Campo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCampos, createCampo, updateCampo, deleteCampo };
