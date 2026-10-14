// controllers/empleadosMaquinasController.js
const db = require("../config/db");

const getEmpleadosMaquinas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM empleado_maquina");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmpleadosMaquina = async (req, res) => {
  try {
    const { empleado_id, maquina_id } = req.body;
    // Si la máquina ya está asignada a otro, la reasignamos o actualizamos
    await db.query("DELETE FROM empleado_maquina WHERE maquina_id = ?", [
      maquina_id,
    ]);
    await db.query(
      "INSERT INTO empleado_maquina (empleado_id, maquina_id) VALUES (?, ?)",
      [empleado_id, maquina_id],
    );
    res.status(201).json({ message: "Máquina vinculada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEmpleadosMaquina = async (req, res) => {
  try {
    const { empleado_id, maquina_id } = req.body;
    await db.query(
      "DELETE FROM empleado_maquina WHERE empleado_id = ? AND maquina_id = ?",
      [empleado_id, maquina_id],
    );
    res.json({ message: "Vinculación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEmpleadosMaquinas,
  createEmpleadosMaquina,
  deleteEmpleadosMaquina,
};
