var express = require('express');
var router = express.Router();

/**
 * Controllers (route handlers).
 */
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index);

module.exports = router;
