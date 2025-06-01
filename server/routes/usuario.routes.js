const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuario.controller');

router.post('/', usuarioCtrl.crearUsuario);
router.get('/', usuarioCtrl.obtenerUsuarios);
router.get('/:id', usuarioCtrl.obtenerUsuarioPorId);
router.put('/:id', usuarioCtrl.actualizarUsuario);
router.delete('/:id', usuarioCtrl.eliminarUsuario);

module.exports = router;