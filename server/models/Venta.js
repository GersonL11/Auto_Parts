const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  carrito: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Repuesto', required: true },
      nombre: String,
      marca: String,
      modelo: String,
      cantidad: Number,
      precio: Number
    }
  ],
  metodoPago: { type: String },
  direccion: { type: String },
  telefono: { type: String },
  email: { type: String }
});

module.exports = mongoose.model('Venta', VentaSchema);
