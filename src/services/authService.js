/* eslint-disable no-unused-vars */
import User from '../models/usersModel';
import validator from 'validator';
import { tojs, ReE, ReS, TE } from './utilService';

export const getUniqueKeyFromBody = function (body) { // this is so they can send in 3 options unique_key, email, or phone and it will work
	let uniqueKey = body.unique_key;
	if (typeof uniqueKey === 'undefined') {
		if (typeof body.email !== 'undefined') {
			uniqueKey = body.email;
		} else if (typeof body.user !== 'undefined') {
			uniqueKey = body.user;
		} else {
			uniqueKey = null;
		}
	}

	return uniqueKey;
};

export const createUser = async (userInfo) => {
	let uniqueKey, authInfo, err, user;

	authInfo = {};
	authInfo.status = 'create';

	uniqueKey = getUniqueKeyFromBody(userInfo);
	if (!uniqueKey) {
		TE('An email or user number was not entered.');
	}

	if (validator.isEmail(uniqueKey)) {
		authInfo.method = 'email';
		userInfo.email = uniqueKey;

		[err, user] = await tojs(User.create(userInfo));

		if (err) {
			TE('user already exists with that email');
		}

		return user;
	} else if (validator.isAlphanumeric(uniqueKey, ['es-ES'])) { // checks if only phone number was sent
		authInfo.method = 'user';
		userInfo.user = uniqueKey;

		[err, user] = await tojs(User.create(userInfo));
		console.log(err);
		if (err) TE(err.message);

		return user;
	} else {
		TE('A valid email or user name was not entered.');
	}
};

export const authUser = async function (userInfo) { // returns token
	let uniqueKey, authInfo, err, user;
	authInfo = {};
	authInfo.status = 'login';
	uniqueKey = getUniqueKeyFromBody(userInfo);

	if (!uniqueKey) {
		TE('Please enter an email or user name to login');
	}

	if (!userInfo.password) {
		TE('Please enter a password to login');
	}

	if (validator.isEmail(uniqueKey)) {
		authInfo.method = 'email';
		[err, user] = await tojs(User.findOne({ where: { email: uniqueKey } }));
		if (err) {
			TE(err.message);
		}
	} else if (validator.isAlphanumeric(uniqueKey, ['es-ES'])) {// checks if only phone number was sent
		authInfo.method = 'user';

		[err, user] = await tojs(User.findOne({ where: { user: uniqueKey } }));
		if (err) {
			TE(err.message);
		}
	} else {
		TE('A valid email or user name was not entered');
	}

	if (!user) {
		TE('Not registered');
	}

	[err, user] = await tojs(user.comparePassword(userInfo.password));

	if (err) {
		TE(err.message);
	}

	return user;
};
