/* eslint-disable no-unused-vars */
'use strict';
const { Router } = require('express');
const userControllers = require('../controllers/user.controller');

const passport = require('../middleware/passport');
const custom = require('../middleware/custom');

var router = Router();

/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false }), userControllers.get);
router.post('/register', userControllers.create);
router.post('/login', userControllers.login);
router.put('/', passport.authenticate('jwt', { session: false }), userControllers.update);
router.delete('/', passport.authenticate('jwt', { session: false }), userControllers.remove);

module.exports = router;