"use strict";

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Usuario = require('../models/Usuario');

exports.login = function _callee(req, res) {
  var _req$body, correo, password, usuario, _usuario$toObject, _, usuarioSinPassword;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, correo = _req$body.correo, password = _req$body.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Usuario.findOne({
            correo: correo
          }));

        case 4:
          usuario = _context.sent;

          if (usuario) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: 'Usuario no encontrado'
          }));

        case 7:
          if (!(usuario.password !== password)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: 'Contraseña incorrecta'
          }));

        case 9:
          _usuario$toObject = usuario.toObject(), _ = _usuario$toObject.password, usuarioSinPassword = _objectWithoutProperties(_usuario$toObject, ["password"]);
          res.json({
            usuario: usuarioSinPassword
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            error: 'Error en el servidor'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
};
//# sourceMappingURL=auth.controller.dev.js.map
