const express = require("express");
const router = express.Router();
const {
  getEmpleados,
  createEmpleado,
  getMaquinaByEmpleado,
  vincularMaquina,
  desvincularMaquina,
  updateEmpleado,
  verificarClaveEmpleado,
} = require("../controllers/empleadosController");

router.get("/", getEmpleados);
router.post("/", createEmpleado);
router.get("/:id/maquina", getMaquinaByEmpleado);
router.post("/vincular", vincularMaquina);
router.post("/desvincular", desvincularMaquina);
router.put("/:id", updateEmpleado);
router.post("/:id/verificar-clave", verificarClaveEmpleado);
module.exports = router;
