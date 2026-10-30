const express = require("express");
const router = express.Router();
const { getRendimientoData } = require("../controllers/rendimientoController");

router.get("/", getRendimientoData);

module.exports = router;
