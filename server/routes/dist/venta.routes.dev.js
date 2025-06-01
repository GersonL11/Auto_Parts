"use strict";

var express = require('express');

var router = express.Router();

var ventaCtrl = require('../controllers/venta.controller');

router.post('/', ventaCtrl.crearVenta);
router.get('/', ventaCtrl.obtenerVentas);
router.get('/:id', ventaCtrl.obtenerVentaPorId);
router.put('/:id', ventaCtrl.actualizarVenta);
router["delete"]('/:id', ventaCtrl.eliminarVenta);
module.exports = router;
//# sourceMappingURL=venta.routes.dev.js.map
