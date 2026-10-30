const db = require("../config/db");

const getRendimientoData = async (req, res) => {
  try {
    // 1. Obtener trabajos para calcular hectáreas por máquina/fecha
    const [trabajos] = await db.query(`
      t.*, m.nombre as maquina_nombre 
      FROM trabajos t 
      LEFT JOIN maquinas m ON t.maquina_id = m.id
    `);

    // 2. Obtener ingresos de insumos (para filtrar gasoil y costos)
    const [ingresos] = await db.query(`
      ii.*, i.nombre as insumo_nombre, m.nombre as maquina_nombre 
      FROM ingresos_insumos ii
      LEFT JOIN insumos i ON ii.insumo_id = i.id
      LEFT JOIN maquinas m ON ii.maquina_id = m.id
    `);

    // 3. Obtener máquinas para el control de services (hectáreas acumuladas)
    const [maquinas] = await db.query("SELECT * FROM maquinas");

    res.json({
      trabajos,
      ingresos,
      maquinas,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRendimientoData,
};
