const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codigoRecuperacion: { type: String } // <-- nuevo campo opcional
});

module.exports = mongoose.model('Usuario', usuarioSchema);