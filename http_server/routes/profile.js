var express = require('express');
var router = express.Router();

/**
 * Controllers (route handlers).
 */
const indexController = require('../controllers/indexController');

/* GET profile page. */
router.get('/', indexController.profile);

module.exports = router;