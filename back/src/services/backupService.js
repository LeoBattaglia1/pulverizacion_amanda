const mysqldump = require("mysqldump");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

// Función para encontrar automáticamente una unidad USB / Pendrive en Windows
const encontrarUnidadPendrive = () => {
  const letras = [
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  for (const letra of letras) {
    const rutaUnidad = `${letra}:\\`;
    try {
      if (fs.existsSync(rutaUnidad)) {
        fs.readdirSync(rutaUnidad);
        return rutaUnidad;
      }
    } catch (e) {
      // Ignorar unidades no listas o inaccesibles
    }
  }
  return null;
};

const generarRespaldoSQL = async () => {
  try {
    const unidadDetectada = encontrarUnidadPendrive();

    if (!unidadDetectada) {
      throw new Error(
        "No se detectó ningún pendrive o memoria extraíble conectada a la PC.",
      );
    }

    const dbConfig = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "pulverizacion_amanda",
    };

    // Nombre fijo para que se sobrescriba siempre el mismo archivo
    const nombreArchivo = "Base de datos Pulverizacion Amanda.sql";
    const rutaDestino = path.join(unidadDetectada, nombreArchivo);

    await mysqldump({
      connection: dbConfig,
      dumpToFile: rutaDestino,
    });

    if (fs.existsSync(rutaDestino)) {
      return { success: true, path: rutaDestino, archivo: nombreArchivo };
    } else {
      throw new Error(
        `No se pudo escribir el archivo en la unidad ${unidadDetectada}.`,
      );
    }
  } catch (error) {
    console.error("Error al generar el respaldo:", error.message);
    return { success: false, error: error.message };
  }
};

// Programador automático para las 10hs, 12hs, 16hs, 18hs y 20hs
const iniciarProgramadorDeRespaldos = () => {
  cron.schedule("0 10,12,16,18,20 * * *", async () => {
    console.log("Ejecutando respaldo automático programado en pendrive...");
    const resultado = await generarRespaldoSQL();
    if (resultado.success) {
      console.log(
        `Respaldo automático actualizado con éxito en: ${resultado.path}`,
      );
    } else {
      console.warn(`Respaldo automático omitido/fallido: ${resultado.error}`);
    }
  });
};

module.exports = {
  generarRespaldoSQL,
  iniciarProgramadorDeRespaldos,
};
