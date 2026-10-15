const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Importar y arrancar el programador de respaldos
const {
  iniciarProgramadorDeRespaldos,
  generarRespaldoSQL,
} = require("./services/backupService");
iniciarProgramadorDeRespaldos();

// Importar Enrutadores (Routers)
const clientesRoutes = require("./routes/clientesRoutes");
const camposRoutes = require("./routes/camposRoutes");
const empleadosRoutes = require("./routes/empleadosRoutes");
const maquinasRoutes = require("./routes/maquinasRoutes");
const insumosRoutes = require("./routes/insumosRoutes");
const proveedoresRoutes = require("./routes/proveedoresRoutes");
const pagosEmpleadosRoutes = require("./routes/pagosEmpleadosRoutes");
const mantenimientoRoutes = require("./routes/mantenimientoRoutes");
const turnosRoutes = require("./routes/turnosRoutes");
const trabajosRoutes = require("./routes/trabajosRoutes");
const lotesRoutes = require("./routes/lotesRoutes");
const pagosClientesRoutes = require("./routes/pagosClientesRoutes");
const empleadosMaquinasRoutes = require("./routes/empleadosMaquinasRouter");

// Definir Endpoints / Rutas Base
app.use("/api/clientes", clientesRoutes);
app.use("/api/campos", camposRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/maquinas", maquinasRoutes);
app.use("/api/insumos", insumosRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/pagos-empleados", pagosEmpleadosRoutes);
app.use("/api/mantenimiento", mantenimientoRoutes);
app.use("/api/turnos", turnosRoutes);
app.use("/api/trabajos", trabajosRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/pagos-clientes", pagosClientesRoutes);
app.use("/api/empleados-maquinas", empleadosMaquinasRoutes);

// Endpoint para el botón de Backup Manual desde el Sidebar
app.post("/api/backup-manual", async (req, res) => {
  const resultado = await generarRespaldoSQL();
  if (resultado.success) {
    res.json({ success: true, message: "Backup realizado correctamente" });
  } else {
    res.status(500).json({ success: false, error: resultado.error });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "API Pulverización Amanda funcionando correctamente" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
