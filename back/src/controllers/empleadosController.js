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
    const { nombre, telefono, clave, maquina_id } = req.body; // Se agrega clave
    const [result] = await db.query(
      "INSERT INTO empleados (nombre, telefono, clave) VALUES (?, ?, ?)",
      [nombre, telefono, clave],
    );
    const empleadoId = result.insertId;

    if (maquina_id) {
      await db.query(
        "INSERT INTO empleado_maquina (empleado_id, maquina_id) VALUES (?, ?)",
        [empleadoId, maquina_id],
      );
    }

    res.status(201).json({ id: empleadoId, nombre, telefono, clave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    const { nombre, telefono, clave } = req.body; // Se agrega clave

    await db.query(
      "UPDATE empleados SET nombre = ?, telefono = ?, clave = ? WHERE id = ?",
      [nombre, telefono, clave, id],
    );

    res.json({ message: "Empleado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verificar clave de acceso del empleado
const verificarClaveEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { clave } = req.body;

    const [rows] = await db.query(
      "SELECT id, nombre, clave FROM empleados WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }

    const empleado = rows[0];

    // Compara la clave ingresada con la de la base de datos
    if (empleado.clave === clave) {
      res.json({ success: true, message: "Clave correcta" });
    } else {
      res.status(401).json({ success: false, message: "Clave incorrecta" });
    }
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
  verificarClaveEmpleado,
};
