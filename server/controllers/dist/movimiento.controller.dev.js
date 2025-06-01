"use strict";

var Movimiento = require('../models/Movimiento'); // Crear movimiento


exports.crearMovimiento = function _callee(req, res) {
  var movimiento;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          movimiento = new Movimiento(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(movimiento.save());

        case 4:
          res.status(201).json(movimiento);
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
}; // Obtener todos los movimientos


exports.obtenerMovimientos = function _callee2(req, res) {
  var movimientos;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Movimiento.find().populate('repuesto'));

        case 2:
          movimientos = _context2.sent;
          res.json(movimientos);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Obtener un movimiento por ID


exports.obtenerMovimientoPorId = function _callee3(req, res) {
  var movimiento;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Movimiento.findById(req.params.id).populate('repuesto'));

        case 3:
          movimiento = _context3.sent;

          if (movimiento) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Movimiento no encontrado'
          }));

        case 6:
          res.json(movimiento);
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
}; // Actualizar movimiento


exports.actualizarMovimiento = function _callee4(req, res) {
  var movimiento;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Movimiento.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          movimiento = _context4.sent;

          if (movimiento) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Movimiento no encontrado'
          }));

        case 6:
          res.json(movimiento);
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
}; // Eliminar movimiento


exports.eliminarMovimiento = function _callee5(req, res) {
  var movimiento;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Movimiento.findByIdAndDelete(req.params.id));

        case 3:
          movimiento = _context5.sent;

          if (movimiento) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Movimiento no encontrado'
          }));

        case 6:
          res.json({
            mensaje: 'Movimiento eliminado'
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
//# sourceMappingURL=movimiento.controller.dev.js.map
