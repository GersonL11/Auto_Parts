"use strict";

var express = require('express');

var router = express.Router();

var repuestoCtrl = require('../controllers/repuesto.controller');

router.post('/', repuestoCtrl.crearRepuesto);
router.get('/', repuestoCtrl.obtenerRepuestos);
router.get('/:id', repuestoCtrl.obtenerRepuestoPorId);
router.put('/:id', repuestoCtrl.actualizarRepuesto);
router["delete"]('/:id', repuestoCtrl.eliminarRepuesto);
module.exports = router;
//# sourceMappingURL=repuesto.routes.dev.js.map
