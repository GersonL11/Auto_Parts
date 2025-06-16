const mongoose = require('mongoose');

// Marca una venta como leída por un usuario admin
const VentaLeidaSchema = new mongoose.Schema({
  ventaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  leida: { type: Boolean, default: true },
  fecha: { type: Date, default: Date.now }
});

VentaLeidaSchema.index({ ventaId: 1, adminId: 1 }, { unique: true });

module.exports = mongoose.model('VentaLeida', VentaLeidaSchema);
