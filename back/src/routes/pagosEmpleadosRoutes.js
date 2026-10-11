const express = require("express");
const router = express.Router();
const {
  getPagosEmpleados,
  createPagoEmpleado,
} = require("../controllers/pagosEmpleadosController");

router.get("/", getPagosEmpleados);
router.post("/", createPagoEmpleado);

module.exports = router;
