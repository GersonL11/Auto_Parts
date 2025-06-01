"use strict";

var express = require('express');

var router = express.Router();

var authCtrl = require('../controllers/auth.controller');

router.post('/login', authCtrl.login);
module.exports = router;
//# sourceMappingURL=auth.routes.dev.js.map
