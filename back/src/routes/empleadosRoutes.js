const express = require("express");
const router = express.Router();
const {
  getEmpleados,
  createEmpleado,
  getMaquinaByEmpleado,
  vincularMaquina,
  desvincularMaquina,
} = require("../controllers/empleadosController");

router.get("/", getEmpleados);
router.post("/", createEmpleado);
router.get("/:id/maquina", getMaquinaByEmpleado);
router.post("/vincular", vincularMaquina);
router.post("/desvincular", desvincularMaquina);

module.exports = router;
