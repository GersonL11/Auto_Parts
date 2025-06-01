require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const usuarioRoutes = require('./routes/usuario.routes');
const repuestoRoutes = require('./routes/repuesto.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const ventaRoutes = require('./routes/venta.routes');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión', err));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/repuestos', repuestoRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api', authRoutes);
app.use('/api/contacto', contactRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});