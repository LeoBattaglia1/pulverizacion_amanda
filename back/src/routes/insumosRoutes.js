const express = require("express");
const router = express.Router();
const {
  getInsumos,
  createInsumo,
  updateInsumo, // <-- Asegúrate de importarlo
  getIngresos,
  registrarIngreso,
  getRetiros,
  registrarRetiro,
} = require("../controllers/insumosController");

router.get("/", getInsumos);
router.post("/", createInsumo);
router.put("/:id", updateInsumo); // <-- Ruta PUT para editar

router.get("/ingresos", getIngresos);
router.post("/ingresos", registrarIngreso);

router.get("/retiros", getRetiros);
router.post("/retiros", registrarRetiro);

module.exports = router;
