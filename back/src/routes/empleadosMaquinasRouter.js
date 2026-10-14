// routes/empleadosMaquinas.js (o archivo de rutas correspondiente)
const express = require("express");
const router = express.Router();
const {
  getEmpleadosMaquinas,
  createEmpleadosMaquina,
  deleteEmpleadosMaquina,
} = require("../controllers/empleadosMaquinasController");

router.get("/", getEmpleadosMaquinas);
router.post("/", createEmpleadosMaquina);
router.delete("/", deleteEmpleadosMaquina);

module.exports = router;
