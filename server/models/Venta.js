const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  repuesto: { type: mongoose.Schema.Types.ObjectId, ref: 'Repuesto', required: true },
  cantidad: Number,
  precio_unitario: Number,
  total: Number,
  fecha_venta: { type: Date, default: Date.now },
  usuario_registra: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Venta', ventaSchema);