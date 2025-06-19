"use strict";

var Venta = require('../models/Venta');

var Repuesto = require('../models/Repuesto');

var VentaLeida = require('../models/VentaLeida');

var Movimiento = require('../models/Movimiento'); // Crear venta


exports.crearVenta = function _callee(req, res) {
  var carrito, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, repuesto, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _item, venta, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _item2;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          carrito = req.body.carrito || [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 5;
          _iterator = carrito[Symbol.iterator]();

        case 7:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 21;
            break;
          }

          item = _step.value;

          if (item._id) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Falta el _id del repuesto en el carrito"
          }));

        case 11:
          _context.next = 13;
          return regeneratorRuntime.awrap(Repuesto.findById(item._id));

        case 13:
          repuesto = _context.sent;

          if (repuesto) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Repuesto no encontrado: ".concat(item.nombre)
          }));

        case 16:
          if (!(repuesto.cantidad < item.cantidad)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Stock insuficiente para: ".concat(item.nombre)
          }));

        case 18:
          _iteratorNormalCompletion = true;
          _context.next = 7;
          break;

        case 21:
          _context.next = 27;
          break;

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 27:
          _context.prev = 27;
          _context.prev = 28;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 30:
          _context.prev = 30;

          if (!_didIteratorError) {
            _context.next = 33;
            break;
          }

          throw _iteratorError;

        case 33:
          return _context.finish(30);

        case 34:
          return _context.finish(27);

        case 35:
          // Si todo ok, actualizar stock
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context.prev = 38;
          _iterator2 = carrito[Symbol.iterator]();

        case 40:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context.next = 47;
            break;
          }

          _item = _step2.value;
          _context.next = 44;
          return regeneratorRuntime.awrap(Repuesto.findByIdAndUpdate(_item._id, {
            $inc: {
              cantidad: -_item.cantidad
            }
          }));

        case 44:
          _iteratorNormalCompletion2 = true;
          _context.next = 40;
          break;

        case 47:
          _context.next = 53;
          break;

        case 49:
          _context.prev = 49;
          _context.t1 = _context["catch"](38);
          _didIteratorError2 = true;
          _iteratorError2 = _context.t1;

        case 53:
          _context.prev = 53;
          _context.prev = 54;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 56:
          _context.prev = 56;

          if (!_didIteratorError2) {
            _context.next = 59;
            break;
          }

          throw _iteratorError2;

        case 59:
          return _context.finish(56);

        case 60:
          return _context.finish(53);

        case 61:
          // Guardar la venta
          venta = new Venta(req.body);
          _context.next = 64;
          return regeneratorRuntime.awrap(venta.save());

        case 64:
          // --- NUEVO: Registrar movimiento de salida por cada producto vendido ---
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context.prev = 67;
          _iterator3 = carrito[Symbol.iterator]();

        case 69:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context.next = 76;
            break;
          }

          _item2 = _step3.value;
          _context.next = 73;
          return regeneratorRuntime.awrap(Movimiento.create({
            repuesto: _item2._id,
            tipo: 'Salida',
            cantidad: _item2.cantidad,
            fecha: new Date(),
            descripcion: "Venta de ".concat(_item2.nombre, " (").concat(_item2.marca || '', " ").concat(_item2.modelo || '', ") x").concat(_item2.cantidad)
          }));

        case 73:
          _iteratorNormalCompletion3 = true;
          _context.next = 69;
          break;

        case 76:
          _context.next = 82;
          break;

        case 78:
          _context.prev = 78;
          _context.t2 = _context["catch"](67);
          _didIteratorError3 = true;
          _iteratorError3 = _context.t2;

        case 82:
          _context.prev = 82;
          _context.prev = 83;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 85:
          _context.prev = 85;

          if (!_didIteratorError3) {
            _context.next = 88;
            break;
          }

          throw _iteratorError3;

        case 88:
          return _context.finish(85);

        case 89:
          return _context.finish(82);

        case 90:
          // --- FIN NUEVO ---
          res.status(201).json(venta);
          _context.next = 96;
          break;

        case 93:
          _context.prev = 93;
          _context.t3 = _context["catch"](0);
          res.status(400).json({
            error: _context.t3.message
          });

        case 96:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 93], [5, 23, 27, 35], [28,, 30, 34], [38, 49, 53, 61], [54,, 56, 60], [67, 78, 82, 90], [83,, 85, 89]]);
}; // Obtener todas las ventas


exports.obtenerVentas = function _callee2(req, res) {
  var ventas;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Venta.find());

        case 3:
          ventas = _context2.sent;
          res.json(ventas);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Obtener una venta por ID


exports.obtenerVentaPorId = function _callee3(req, res) {
  var venta;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Venta.findById(req.params.id));

        case 3:
          venta = _context3.sent;

          if (venta) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Venta no encontrada'
          }));

        case 6:
          res.json(venta);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(400).json({
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Actualizar venta


exports.actualizarVenta = function _callee4(req, res) {
  var venta;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Venta.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          venta = _context4.sent;

          if (venta) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Venta no encontrada'
          }));

        case 6:
          res.json(venta);
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          res.status(400).json({
            error: _context4.t0.message
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Eliminar venta


exports.eliminarVenta = function _callee5(req, res) {
  var venta;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Venta.findByIdAndDelete(req.params.id));

        case 3:
          venta = _context5.sent;

          if (venta) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Venta no encontrada'
          }));

        case 6:
          res.json({
            mensaje: 'Venta eliminada'
          });
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          res.status(400).json({
            error: _context5.t0.message
          });

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Marcar una venta como leída por un admin


exports.marcarVentaLeida = function _callee6(req, res) {
  var _req$body, ventaId, adminId;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body = req.body, ventaId = _req$body.ventaId, adminId = _req$body.adminId;

          if (!(!ventaId || !adminId)) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Faltan parámetros'
          }));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(VentaLeida.findOneAndUpdate({
            ventaId: ventaId,
            adminId: adminId
          }, {
            leida: true,
            fecha: new Date()
          }, {
            upsert: true,
            "new": true
          }));

        case 6:
          res.json({
            ok: true
          });
          _context6.next = 12;
          break;

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          res.status(400).json({
            error: _context6.t0.message
          });

        case 12:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Obtener IDs de ventas leídas por un admin


exports.obtenerVentasLeidasPorAdmin = function _callee7(req, res) {
  var adminId, leidas;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          adminId = req.query.adminId;

          if (adminId) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            error: 'Falta adminId'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(VentaLeida.find({
            adminId: adminId,
            leida: true
          }).select('ventaId -_id'));

        case 6:
          leidas = _context7.sent;
          res.json(leidas.map(function (l) {
            return l.ventaId;
          }));
          _context7.next = 13;
          break;

        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          res.status(400).json({
            error: _context7.t0.message
          });

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Obtener cantidad de ventas por mes (para gráfico)


exports.obtenerVentasPorMes = function _callee8(req, res) {
  var ahora, anioActual, ventasPorMes, valores;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          ahora = new Date();
          anioActual = ahora.getFullYear(); // Agrupa por mes y cuenta la cantidad de ventas del año actual

          _context8.next = 5;
          return regeneratorRuntime.awrap(Venta.aggregate([{
            $match: {
              fecha: {
                $gte: new Date("".concat(anioActual, "-01-01T00:00:00.000Z")),
                $lte: new Date("".concat(anioActual, "-12-31T23:59:59.999Z"))
              }
            }
          }, {
            $group: {
              _id: {
                $month: "$fecha"
              },
              cantidad: {
                $sum: 1
              }
            }
          }]));

        case 5:
          ventasPorMes = _context8.sent;
          valores = Array(12).fill(0);
          ventasPorMes.forEach(function (item) {
            valores[item._id - 1] = item.cantidad;
          });
          res.json({
            valores: valores
          });
          _context8.next = 14;
          break;

        case 11:
          _context8.prev = 11;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            error: _context8.t0.message
          });

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Total vendido por cliente (top 10, con nombre por defecto si está vacío)


exports.obtenerVentasPorCliente = function _callee9(req, res) {
  var ventasPorCliente;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(Venta.aggregate([{
            $group: {
              _id: {
                $ifNull: ["$cliente", "Sin nombre"]
              },
              total: {
                $sum: "$total"
              }
            }
          }, {
            $sort: {
              total: -1
            }
          }, {
            $limit: 10
          }]));

        case 3:
          ventasPorCliente = _context9.sent;
          res.json({
            labels: ventasPorCliente.map(function (v) {
              return v._id || "Sin nombre";
            }),
            valores: ventasPorCliente.map(function (v) {
              return v.total;
            })
          });
          _context9.next = 10;
          break;

        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json({
            error: _context9.t0.message
          });

        case 10:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
//# sourceMappingURL=venta.controller.dev.js.map
