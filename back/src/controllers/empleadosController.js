const db = require("../config/db");

const getEmpleados = async (req, res) => {
  try {
    const [empleados] = await db.query("SELECT * FROM empleados");
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEmpleado = async (req, res) => {
  try {
    const { nombre, telefono, maquina_id } = req.body; // maquina_id opcional para vincular de entrada
    const [result] = await db.query(
      "INSERT INTO empleados (nombre, telefono) VALUES (?, ?)",
      [nombre, telefono],
    );
    const empleadoId = result.insertId;

    if (maquina_id) {
      await db.query(
        "INSERT INTO empleado_maquina (empleado_id, maquina_id) VALUES (?, ?)",
        [empleadoId, maquina_id],
      );
    }

    res.status(201).json({ id: empleadoId, nombre, telefono });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener la máquina asignada por defecto a un empleado (para autocompletar formularios)
const getMaquinaByEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `
            SELECT m.* FROM maquinas m
            JOIN empleado_maquina em ON em.maquina_id = m.id
            WHERE em.empleado_id = ?
        `,
      [id],
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const vincularMaquina = async (req, res) => {
  try {
    const { empleado_id, maquina_id } = req.body;
    await db.query(
      "INSERT INTO empleado_maquina (empleado_id, maquina_id) VALUES (?, ?)",
      [empleado_id, maquina_id],
    );
    res.json({ message: "Máquina vinculada al empleado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const desvincularMaquina = async (req, res) => {
  try {
    const { empleado_id, maquina_id } = req.body;
    await db.query(
      "DELETE FROM empleado_maquina WHERE empleado_id = ? AND maquina_id = ?",
      [empleado_id, maquina_id],
    );
    res.json({ message: "Máquina desvinculada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono } = req.body;

    await db.query(
      "UPDATE empleados SET nombre = ?, telefono = ? WHERE id = ?",
      [nombre, telefono, id],
    );

    res.json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEmpleados,
  createEmpleado,
  getMaquinaByEmpleado,
  vincularMaquina,
  desvincularMaquina,
  updateEmpleado,
};
