const db = require("../config/db");

const getTurnos = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT t.*, c.nombre AS cliente_nombre, cp.nombre AS campo_nombre 
            FROM turnos t
            JOIN clientes c ON t.cliente_id = c.id
            JOIN campos cp ON t.campo_id = cp.id
        `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTurno = async (req, res) => {
  try {
    const { cliente_id, campo_id, fecha_hora, observacion } = req.body;
    const [result] = await db.query(
      "INSERT INTO turnos (cliente_id, campo_id, fecha_hora, observacion) VALUES (?, ?, ?, ?)",
      [cliente_id, campo_id, fecha_hora, observacion],
    );
    res
      .status(201)
      .json({ id: result.insertId, message: "Turno agendado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTurno = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM turnos WHERE id = ?", [id]);
    res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getTurnos, createTurno, deleteTurno };
