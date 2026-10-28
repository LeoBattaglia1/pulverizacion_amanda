const express = require("express");
const router = express.Router();
const trabajosController = require("../controllers/trabajosController");

router.get("/pendientes", trabajosController.obtenerTrabajosPendientes);
router.get("/", trabajosController.getTrabajos);
router.post("/", trabajosController.createTrabajo);
router.delete("/:id", trabajosController.deleteTrabajo);

module.exports = router;
