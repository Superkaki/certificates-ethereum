var express = require('express');
var router = express.Router();

/**
 * Controllers (route handlers).
 */
const indexController = require('../controllers/indexController');

/* GET login page. */
router.get('/', indexController.login);

module.exports = router;