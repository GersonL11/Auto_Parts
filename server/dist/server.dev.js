"use strict";

require('dotenv').config();

var express = require('express');

var cors = require('cors');

var mongoose = require('mongoose');

var app = express();

var usuarioRoutes = require('./routes/usuario.routes');

var repuestoRoutes = require('./routes/repuesto.routes');

var movimientoRoutes = require('./routes/movimiento.routes');

var ventaRoutes = require('./routes/venta.routes');

var authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI).then(function () {
  return console.log('Conectado a MongoDB');
})["catch"](function (err) {
  return console.error('Error de conexión', err);
});
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api', authRoutes);
app.listen(3000, function () {
  console.log('Servidor corriendo en http://localhost:3000');
});
//# sourceMappingURL=server.dev.js.map
