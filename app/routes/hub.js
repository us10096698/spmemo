'use strict';

var express = require('express');
var router = express.Router();

var hubAPI = require('../api/hubAPI');

router.put('/', hubAPI.saveFile);
router.get('/auth', hubAPI.auth);

module.exports = router;
