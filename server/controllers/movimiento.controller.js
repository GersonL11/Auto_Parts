const Movimiento = require('../models/Movimiento');

// Crear movimiento
exports.crearMovimiento = async (req, res) => {
  try {
    const movimiento = new Movimiento(req.body);
    await movimiento.save();
    res.status(201).json(movimiento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los movimientos
exports.obtenerMovimientos = async (req, res) => {
  const movimientos = await Movimiento.find().populate('repuesto');
  res.json(movimientos);
};

// Obtener un movimiento por ID
exports.obtenerMovimientoPorId = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id).populate('repuesto');
    if (!movimiento) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar movimiento
exports.actualizarMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movimiento) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(movimiento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar movimiento
exports.eliminarMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findByIdAndDelete(req.params.id);
    if (!movimiento) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json({ mensaje: 'Movimiento eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};