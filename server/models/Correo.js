const mongoose = require('mongoose');

const CorreoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leido: { type: Boolean, default: false }
});

module.exports = mongoose.model('Correo', CorreoSchema);
