const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contact.controller');

router.post('/', contactCtrl.enviarContacto);

module.exports = router;
