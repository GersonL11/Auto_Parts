"use strict";

var Usuario = require('../models/Usuario'); // Crear usuario


exports.crearUsuario = function _callee(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          usuario = new Usuario(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(usuario.save());

        case 4:
          res.status(201).json(usuario);
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
}; // Obtener todos los usuarios


exports.obtenerUsuarios = function _callee2(req, res) {
  var usuarios;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Usuario.find());

        case 2:
          usuarios = _context2.sent;
          res.json(usuarios);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // Obtener un usuario por ID


exports.obtenerUsuarioPorId = function _callee3(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Usuario.findById(req.params.id));

        case 3:
          usuario = _context3.sent;

          if (usuario) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Usuario no encontrado'
          }));

        case 6:
          res.json(usuario);
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
}; // Actualizar usuario


exports.actualizarUsuario = function _callee4(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Usuario.findByIdAndUpdate(req.params.id, req.body, {
            "new": true
          }));

        case 3:
          usuario = _context4.sent;

          if (usuario) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'Usuario no encontrado'
          }));

        case 6:
          res.json(usuario);
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
}; // Eliminar usuario


exports.eliminarUsuario = function _callee5(req, res) {
  var usuario;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Usuario.findByIdAndDelete(req.params.id));

        case 3:
          usuario = _context5.sent;

          if (usuario) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Usuario no encontrado'
          }));

        case 6:
          res.json({
            mensaje: 'Usuario eliminado'
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
//# sourceMappingURL=usuario.controller.dev.js.map
