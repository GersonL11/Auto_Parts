const express = require('express');
const router = express.Router();
const repuestoCtrl = require('../controllers/repuesto.controller');

router.post('/', repuestoCtrl.crearRepuesto);
router.get('/', repuestoCtrl.obtenerRepuestos);
router.get('/:id', repuestoCtrl.obtenerRepuestoPorId);
router.put('/:id', repuestoCtrl.actualizarRepuesto);
router.delete('/:id', repuestoCtrl.eliminarRepuesto);
router.get('/por-fecha', repuestoCtrl.cantidadPorFechaRegistro);

module.exports = router;