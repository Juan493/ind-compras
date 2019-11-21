/* eslint-disable no-unused-vars */
import { Router } from 'express';
import path from 'path';
import * as userControllers from '../controllers/userControllers';

import passport from './../middleware/passport';
//import custom from './../middleware/custom';

var router = Router();

/* GET home page. */
router.get('/', passport.authenticate('jwt', { session: false }), userControllers.get);
router.post('/register', userControllers.create);
router.put('/', passport.authenticate('jwt', { session: false }), userControllers.update);
router.delete('/', passport.authenticate('jwt', { session: false }), userControllers.remove);

router.post('/login', userControllers.login);

export default router;