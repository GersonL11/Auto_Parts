const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/login', authCtrl.login);

// Recuperar contraseña
router.post('/recuperar-clave', authCtrl.forgotPassword);

// Restablecer contraseña
router.post('/restablecer-clave', authCtrl.resetPassword);

module.exports = router;