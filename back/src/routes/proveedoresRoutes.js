const express = require("express");
const router = express.Router();
const {
  getProveedores,
  createProveedor,
  updateProveedor,
  getPagosProveedores,
  createPagoProveedor,
  abonarPagoProveedor,
} = require("../controllers/proveedoresController");

router.get("/", getProveedores);
router.post("/", createProveedor);
router.put("/:id", updateProveedor);
router.get("/pagos", getPagosProveedores);
router.post("/pagos", createPagoProveedor);
router.post("/pagos/abonar", abonarPagoProveedor);

module.exports = router;
