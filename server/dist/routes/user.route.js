/* eslint-disable no-unused-vars */
'use strict';

var _require = require('express'),
    Router = _require.Router;

var userControllers = require('../controllers/user.controller');

var passport = require('../middleware/passport');

var custom = require('../middleware/custom');

var router = Router();
/* GET home page. */

router.get('/', passport.authenticate('jwt', {
  session: false
}), userControllers.get);
router.post('/register', userControllers.create);
router.post('/login', userControllers.login);
router.put('/', passport.authenticate('jwt', {
  session: false
}), userControllers.update);
router["delete"]('/', passport.authenticate('jwt', {
  session: false
}), userControllers.remove);
module.exports = router;