const Repuesto = require('../models/Repuesto');

// Crear repuesto
exports.crearRepuesto = async (req, res) => {
  try {
    const repuesto = new Repuesto(req.body);
    await repuesto.save();
    res.status(201).json(repuesto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los repuestos
exports.obtenerRepuestos = async (req, res) => {
  const repuestos = await Repuesto.find();
  res.json(repuestos);
};

// Obtener un repuesto por ID
exports.obtenerRepuestoPorId = async (req, res) => {
  try {
    const repuesto = await Repuesto.findById(req.params.id);
    if (!repuesto) return res.status(404).json({ error: 'Repuesto no encontrado' });
    res.json(repuesto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar repuesto
exports.actualizarRepuesto = async (req, res) => {
  try {
    const repuesto = await Repuesto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!repuesto) return res.status(404).json({ error: 'Repuesto no encontrado' });
    res.json(repuesto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar repuesto
exports.eliminarRepuesto = async (req, res) => {
  try {
    const repuesto = await Repuesto.findByIdAndDelete(req.params.id);
    if (!repuesto) return res.status(404).json({ error: 'Repuesto no encontrado' });
    res.json({ mensaje: 'Repuesto eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};