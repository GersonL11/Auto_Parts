const express = require('express');
const router = express.Router();
const movimientoCtrl = require('../controllers/movimiento.controller');

router.post('/', movimientoCtrl.crearMovimiento);
router.get('/', movimientoCtrl.obtenerMovimientos);
router.get('/:id', movimientoCtrl.obtenerMovimientoPorId);
router.put('/:id', movimientoCtrl.actualizarMovimiento);
router.delete('/:id', movimientoCtrl.eliminarMovimiento);

module.exports = router;