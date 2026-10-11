const db = require("../config/db");

const getEmpleadosMaquinas = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM empleado_maquina");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEmpleadosMaquinas,
};
