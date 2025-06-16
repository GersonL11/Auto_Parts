const Venta = require('../models/Venta');
const Repuesto = require('../models/Repuesto');
const VentaLeida = require('../models/VentaLeida');

// Crear venta
exports.crearVenta = async (req, res) => {
  try {
    const carrito = req.body.carrito || [];
    for (const item of carrito) {
      if (!item._id) {
        return res.status(400).json({ error: `Falta el _id del repuesto en el carrito` });
      }
      const repuesto = await Repuesto.findById(item._id);
      if (!repuesto) {
        return res.status(400).json({ error: `Repuesto no encontrado: ${item.nombre}` });
      }
      if (repuesto.cantidad < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para: ${item.nombre}` });
      }
    }
    // Si todo ok, actualizar stock
    for (const item of carrito) {
      await Repuesto.findByIdAndUpdate(
        item._id,
        { $inc: { cantidad: -item.cantidad } }
      );
    }
    // Guardar la venta
    const venta = new Venta(req.body);
    await venta.save();
    res.status(201).json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todas las ventas
exports.obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una venta por ID
exports.obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar venta
exports.actualizarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar venta
exports.eliminarVenta = async (req, res) => {
  try {
    const venta = await Venta.findByIdAndDelete(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json({ mensaje: 'Venta eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Marcar una venta como leída por un admin
exports.marcarVentaLeida = async (req, res) => {
  try {
    const { ventaId, adminId } = req.body;
    if (!ventaId || !adminId) return res.status(400).json({ error: 'Faltan parámetros' });
    await VentaLeida.findOneAndUpdate(
      { ventaId, adminId },
      { leida: true, fecha: new Date() },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener IDs de ventas leídas por un admin
exports.obtenerVentasLeidasPorAdmin = async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!adminId) return res.status(400).json({ error: 'Falta adminId' });
    const leidas = await VentaLeida.find({ adminId, leida: true }).select('ventaId -_id');
    res.json(leidas.map(l => l.ventaId));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};