const Venta = require('../models/Venta');

// Crear venta
exports.crearVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    await venta.save();
    res.status(201).json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  const ventas = await Venta.find().populate('cliente repuesto usuario_registra');
  res.json(ventas);
};

// Obtener una venta por ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id).populate('cliente repuesto usuario_registra');
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar venta
exports.actualizarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar venta
exports.eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndDelete(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json({ mensaje: 'Venta eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};