const Venta = require('../models/Venta');
const Repuesto = require('../models/Repuesto');
const VentaLeida = require('../models/VentaLeida');
const Movimiento = require('../models/Movimiento');

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

    // --- NUEVO: Registrar movimiento de salida por cada producto vendido ---
    for (const item of carrito) {
      await Movimiento.create({
        repuesto: item._id,
        tipo: 'Salida',
        cantidad: item.cantidad,
        fecha: new Date(),
        descripcion: `Venta de ${item.nombre} (${item.marca || ''} ${item.modelo || ''}) x${item.cantidad}`
      });
    }
    // --- FIN NUEVO ---

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

// Obtener cantidad de ventas por mes (para gráfico)
exports.obtenerVentasPorMes = async (req, res) => {
  try {
    const ahora = new Date();
    const anioActual = ahora.getFullYear();
    // Agrupa por mes y cuenta la cantidad de ventas del año actual
    const ventasPorMes = await Venta.aggregate([
      {
        $match: {
          fecha: {
            $gte: new Date(`${anioActual}-01-01T00:00:00.000Z`),
            $lte: new Date(`${anioActual}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$fecha" },
          cantidad: { $sum: 1 }
        }
      }
    ]);
    const valores = Array(12).fill(0);
    ventasPorMes.forEach(item => {
      valores[item._id - 1] = item.cantidad;
    });
    res.json({ valores });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total vendido por cliente (top 10, con nombre por defecto si está vacío)
exports.obtenerVentasPorCliente = async (req, res) => {
  try {
    const ventasPorCliente = await Venta.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$cliente", "Sin nombre"] },
          total: { $sum: "$total" }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);
    res.json({
      labels: ventasPorCliente.map(v => v._id || "Sin nombre"),
      valores: ventasPorCliente.map(v => v.total)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};