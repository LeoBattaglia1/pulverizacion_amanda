const express = require("express");
const router = express.Router();
const {
  getEmpleadosMaquinas,
} = require("../controllers/empleadosMaquinasController");

router.get("/", getEmpleadosMaquinas);

module.exports = router;
