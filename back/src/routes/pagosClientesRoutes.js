const express = require("express");
const router = express.Router();
const pagosClientesController = require("../controllers/pagosClientesController");

router.get("/", pagosClientesController.getPagosClientes);
router.post("/", pagosClientesController.createPagoCliente);
router.put("/:id", pagosClientesController.updatePagoCliente);

module.exports = router;
