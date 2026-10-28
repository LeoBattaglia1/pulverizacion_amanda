const db = require("../config/db");

// Obtener todos los trabajos con sus hectáreas pagadas acumuladas
const getTrabajos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, 
             COALESCE(SUM(p.hectareas_pagadas), 0) AS total_hectareas_pagadas
      FROM trabajos t
      LEFT JOIN pagos_clientes p ON t.id = p.trabajo_id
      GROUP BY t.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un trabajo operativo
const createTrabajo = async (req, res) => {
  try {
    const {
      lote_id,
      maquina_id,
      empleado_id,
      fecha,
      tipo_cultivo,
      tratamiento,
      cantidad_hectareas,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO trabajos (lote_id, maquina_id, empleado_id, fecha, tipo_cultivo, tratamiento, cantidad_hectareas) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        lote_id,
        maquina_id,
        empleado_id,
        fecha,
        tipo_cultivo,
        tratamiento,
        cantidad_hectareas,
      ],
    );

    res.status(201).json({
      id: result.insertId,
      lote_id,
      maquina_id,
      empleado_id,
      fecha,
      tipo_cultivo,
      tratamiento,
      cantidad_hectareas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM trabajos WHERE id = ?", [id]);
    res.json({ message: "Trabajo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ejemplo de la función en tu controlador de trabajos
async function obtenerTrabajosPendientes(req, res) {
  try {
    const query = `
      SELECT t.*, 
             l.numero_lote, 
             f.nombre AS campo_nombre, 
             c.nombre AS cliente_nombre,
             e.nombre AS empleado_nombre, e.apellido AS empleado_apellido,
             m.nombre AS maquina_nombre
      FROM trabajos t
      LEFT JOIN lotes l ON t.lote_id = l.id
      LEFT JOIN campos f ON l.campo_id = f.id
      LEFT JOIN clientes c ON f.cliente_id = c.id
      LEFT JOIN empleados e ON t.empleado_id = e.id
      LEFT JOIN maquinas m ON t.maquina_id = m.id
      LEFT JOIN pagos_clientes p ON t.id = p.trabajo_id
      WHERE p.id IS NULL
      ORDER BY t.fecha DESC;
    `;

    // Ejecutás la consulta según la librería que uses (por ejemplo: pool.query o db.query)
    const [rows] = await pool.query(query);
    return res.json(rows);
  } catch (error) {
    console.error("Error al obtener trabajos pendientes:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener trabajos pendientes" });
  }
}

module.exports = {
  getTrabajos,
  createTrabajo,
  deleteTrabajo,
  obtenerTrabajosPendientes,
};
