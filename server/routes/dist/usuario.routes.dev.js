"use strict";

var express = require('express');

var router = express.Router();

var usuarioCtrl = require('../controllers/usuario.controller');

router.post('/', usuarioCtrl.crearUsuario);
router.get('/', usuarioCtrl.obtenerUsuarios);
router.get('/:id', usuarioCtrl.obtenerUsuarioPorId);
router.put('/:id', usuarioCtrl.actualizarUsuario);
router["delete"]('/:id', usuarioCtrl.eliminarUsuario);
module.exports = router;
//# sourceMappingURL=usuario.routes.dev.js.map
