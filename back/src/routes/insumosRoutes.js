const express = require("express");
const router = express.Router();
const {
  getInsumos,
  createInsumo,
  registrarIngreso,
  registrarRetiro,
} = require("../controllers/insumosController");

router.get("/", getInsumos);
router.post("/", createInsumo);
router.post("/ingresos", registrarIngreso);
router.post("/retiros", registrarRetiro);

module.exports = router;
