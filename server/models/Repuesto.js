const mongoose = require('mongoose');

const repuestoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  marca: String,
  modelo: String,
  año: Number,
  estado: String,
  cantidad: Number,
  precio: Number,
  ubicacion: String,
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repuesto', repuestoSchema);