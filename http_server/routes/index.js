var express = require('express');
var router = express.Router();

/**
 * Controllers (route handlers).
 */
const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.index);
router.get('/profile', indexController.profile);
router.get('/login', indexController.login);
router.get('/presentation', indexController.presentation);

module.exports = router;
