const express = require('express');
const router = express.Router();
const ventaCtrl = require('../controllers/venta.controller');

router.post('/', ventaCtrl.crearVenta);
router.get('/', ventaCtrl.obtenerVentas);
router.get('/:id', ventaCtrl.obtenerVentaPorId);
router.put('/:id', ventaCtrl.actualizarVenta);
router.delete('/:id', ventaCtrl.eliminarVenta);
router.post('/leida', ventaCtrl.marcarVentaLeida);
router.get('/leidas/admin', ventaCtrl.obtenerVentasLeidasPorAdmin);

module.exports = router;