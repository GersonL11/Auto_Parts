const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/venta.controller');

// Obtener todas las ventas
router.get('/', ventaController.obtenerVentas);

// Obtener una venta por ID
router.get('/:id', ventaController.obtenerVentaPorId);

// Crear una venta
router.post('/', ventaController.crearVenta);

// Actualizar una venta
router.put('/:id', ventaController.actualizarVenta);

// Eliminar una venta
router.delete('/:id', ventaController.eliminarVenta);

module.exports = router;
