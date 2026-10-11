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

module.exports = { getTrabajos, createTrabajo, deleteTrabajo };
