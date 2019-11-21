/* eslint-disable no-unused-vars */
import { User } from '../models/usersModel';
import { getUniqueKeyFromBody, createUser, authUser } from '../services/authService';
import { tojs, ReE, ReS } from '../services/utilService';

export const get = async function (req, res) {
	let user = req.user;

	return ReS(res, { user: user.toWeb() });
};

export const create = async function (req, res) {
	const body = req.body;
	if (!body.unique_key && !body.email && !body.user) {
		return ReE(res, 'Please enter an email or user name to register.');
	} else if (!body.password) {
		return ReE(res, 'Please enter a password to register.');
	} else {
		let err, user;

		[err, user] = await tojs(createUser(body));

		if (err) return ReE(res, err, 422);
		return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
	}
};

export const update = async function (req, res) {
	let err, user, data;
	user = req.user;
	data = req.body;
	user.set(data);

	[err, user] = await tojs(user.save());
	if (err) {
		if (err.message == 'Validation error') err = 'The email address or user name is already in use';
		return ReE(res, err);
	}
	return ReS(res, { message: 'Updated User: ' });
};

export const remove = async function (req, res) {
	let user, err;
	user = req.user;

	[err, user] = await tojs(user.destroy());
	if (err) return ReE(res, 'error occured trying to delete user');

	return ReS(res, { message: 'Deleted User' }, 204);
};

export const login = async function (req, res) {
	const body = req.body;
	let err, user;

	[err, user] = await tojs(authUser(req.body));
	if (err) return ReE(res, err, 422);

	return ReS(res, { token: user.getJWT(), user: user.toWeb() });
};