const express = require("express");
const router = express.Router();
const {
  getMaquinas,
  createMaquina,
  updateMaquina,
  deleteMaquina,
} = require("../controllers/maquinasController");

router.get("/", getMaquinas);
router.post("/", createMaquina);
router.put("/:id", updateMaquina);
router.delete("/:id", deleteMaquina);

module.exports = router;
