const express = require("express");
const router = express.Router();
const {
  getProveedores,
  createProveedor,
  getPagosProveedores,
  createPagoProveedor,
  actualizarPagoProveedor,
} = require("../controllers/proveedoresController");

router.get("/", getProveedores);
router.post("/", createProveedor);
router.get("/pagos", getPagosProveedores);
router.post("/pagos", createPagoProveedor);
router.put("/pagos/:id", actualizarPagoProveedor);

module.exports = router;
