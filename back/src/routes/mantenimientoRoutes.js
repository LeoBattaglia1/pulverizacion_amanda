const express = require("express");
const router = express.Router();
const {
  getMantenimientos,
  createMantenimiento,
} = require("../controllers/mantenimientoController");

router.get("/", getMantenimientos);
router.post("/", createMantenimiento);

module.exports = router;
