/* eslint-disable no-unused-vars */
'use strict';
const { User } = require('../models');
const authService = require('../services/auth.service');
const { tojs, ReE, ReS, TE } = require('../services/util.service');


const get = async (req, res) => {
	let user = req.user;

	return ReS(res, { user: user.toWeb() });
};
module.exports.get = get;

const create = async (req, res) => {
	const body = req.body;
	if (!body.unique_key && !body.email && !body.user) {
		return ReE(res, 'Please enter an email or user name to register.');
	} else if (!body.password) {
		return ReE(res, 'Please enter a password to register.');
	} else {
		let err, user;

		[err, user] = await tojs(authService.createUser(body));

		if (err) return ReE(res, err, 422);
		return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
	}
};
module.exports.create = create;

const update = async (req, res) => {
	let err, user, data;
	user = req.user;
	data = req.body;
	user.set(data);

	[err, user] = await tojs(user.save());
	if (err) {
		if (err.message == 'Validation error') err = 'The email address or user name is already in use';
		return ReE(res, err);
	}
	return ReS(res, { message: 'Updated User' });
};
module.exports.update = update;

const remove = async (req, res) => {
	let user, err;
	user = req.user;

	[err, user] = await tojs(user.destroy());
	if (err) return ReE(res, 'error occured trying to delete user');

	return ReS(res, { message: 'Deleted User' }, 204);
};
module.exports.remove = remove;

const login = async (req, res) => {
	const body = req.body;
	let err, user;

	[err, user] = await tojs(authService.authUser(body));
	if (err) return ReE(res, err, 422);

	return ReS(res, { token: user.getJWT(), user: user.toWeb() });
};
module.exports.login = login;
