const express = require("express");
const router = express.Router();
const lotesController = require("../controllers/lotesController");

router.get("/", lotesController.getLotes);
router.post("/", lotesController.createLote);

module.exports = router;
