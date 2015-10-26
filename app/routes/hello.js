var express = require('express');
var router = express.Router();

var getRoot = require('./getRoot');

router.get('/', getRoot);

module.exports = router;
