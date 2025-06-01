"use strict";

var mongoose = require('mongoose');

var movimientoSchema = new mongoose.Schema({
  repuesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repuesto',
    required: true
  },
  tipo: String,
  cantidad: Number,
  fecha: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Movimiento', movimientoSchema);
//# sourceMappingURL=Movimiento.dev.js.map
