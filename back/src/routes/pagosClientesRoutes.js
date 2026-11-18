const express = require("express");
const router = express.Router();

// 1. IMPORTAR CORRECTAMENTE EL CONTROLADOR
const pagosController = require("../controllers/pagosClientesController");

// 2. Definir las rutas usando pagosController
router.get("/", pagosController.getPagosClientes);
router.post("/", pagosController.createPagoCliente);
router.put("/:id", pagosController.updatePagoCliente);
router.put("/liquidar/:id", pagosController.liquidarPagoCliente);
router.put("/:id/precio", pagosController.updatePrecioPorHectarea);

module.exports = router;
