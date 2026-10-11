const db = require("../config/db");

const getMantenimientos = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT mm.*, m.nombre AS maquina_nombre 
            FROM mantenimiento_maquinas mm
            JOIN maquinas m ON mm.maquina_id = m.id
        `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMantenimiento = async (req, res) => {
  try {
    const { maquina_id, tipo_mantenimiento, costo, observacion, fecha } =
      req.body;
    const [result] = await db.query(
      "INSERT INTO mantenimiento_maquinas (maquina_id, tipo_mantenimiento, costo, observacion, fecha) VALUES (?, ?, ?, ?, ?)",
      [maquina_id, tipo_mantenimiento, costo, observacion, fecha],
    );
    res.status(201).json({
      id: result.insertId,
      message: "Mantenimiento registrado con éxito",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMantenimientos, createMantenimiento };
