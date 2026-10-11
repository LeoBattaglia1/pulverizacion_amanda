const express = require("express");
const router = express.Router();
const {
  getInsumos,
  createInsumo,
  getIngresos,
  registrarIngreso,
  getRetiros,
  registrarRetiro,
} = require("../controllers/insumosController");

// Insumos
router.get("/", getInsumos);
router.post("/", createInsumo);

// Ingresos de Insumos (Cargas)
router.get("/ingresos", getIngresos);
router.post("/ingresos", registrarIngreso);

// Retiros de Insumos (Usos)
router.get("/retiros", getRetiros);
router.post("/retiros", registrarRetiro);

module.exports = router;
