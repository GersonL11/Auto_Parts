"use strict";

var mongoose = require('mongoose');

var usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Usuario', usuarioSchema);
//# sourceMappingURL=Usuario.dev.js.map
