import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import User from '../models/usersModel';

import CONFIG from '../config/config';
import { tojs } from '../services/utilService';

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = CONFIG.jwt_encryption;

passport.use(new Strategy(opts, async function (jwt_payload, done) {
	let err, user;
	[err, user] = await tojs(User.findByPk(jwt_payload.user_id));

	if (err) return done(err, false);
	if (user) {
		return done(null, user);
	} else {
		return done(null, false);
	}
}));

export default passport;