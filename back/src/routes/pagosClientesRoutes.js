const express = require("express");
const router = express.Router();

// 1. IMPORTA BIEN EL CONTROLADOR AQUÍ ARRIBA
const pagoClienteController = require("../controllers/pagosClientesController");

// 2. TUS RUTAS USANDO EL CONTROLADOR
router.get("/", pagoClienteController.getPagosClientes);
router.post("/", pagoClienteController.createPagoCliente);
router.put("/:id", pagoClienteController.updatePagoCliente);

// La nueva ruta para liquidar pendientes que agregamos:
router.put("/liquidar/:id", pagoClienteController.liquidarPagoCliente);

module.exports = router;
