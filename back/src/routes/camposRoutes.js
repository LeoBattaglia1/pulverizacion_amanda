const express = require("express");
const router = express.Router();
const {
  getCampos,
  createCampo,
  updateCampo,
  deleteCampo,
} = require("../controllers/camposController");

router.get("/", getCampos);
router.post("/", createCampo);
router.put("/:id", updateCampo);
router.delete("/:id", deleteCampo);

module.exports = router;
