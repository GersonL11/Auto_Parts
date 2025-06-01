"use strict";

var Venta = require('../models/Venta'); // Crear venta


exports.crearVenta = function _callee(req, res) {
  var venta;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          venta = new Venta(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(venta.save());

        case 4:
          res.status(201).json(venta);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(400).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Obtener todas las ventas


exports.obtenerVentas = function _callee2(req, res) {
  var ventas;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Venta.find().populate('cliente repuesto usuario_registra'));

        case 2:
          ventas = _context2.sent;
          res.json(ventas);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Obtener una venta por ID


exports.obtenerVentaPorId = function _callee3(req, res) {
  var venta;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Venta.findById(req.params.id).populate('cliente repuesto usuario_registra'));

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
};
//# sourceMappingURL=venta.controller.dev.js.map
