/* eslint-disable no-unused-vars */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { tojs, ReE, ReS, TE } from '../services/utilService';
import { DataTypes } from 'sequelize';

import CONFIG from '../config/config';
import db from '../config/database';

var User = db.define('User', {
	firstName: DataTypes.STRING,
	lastName: DataTypes.STRING,
	email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: { msg: 'Email invalid.' } } },
	phone: { type: DataTypes.STRING, validate: { len: { args: [7, 20], msg: 'Phone number invalid, too short.' }, isNumeric: { msg: 'not a valid phone number.' } } },
	user: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: { args: [7, 8], msg: 'User name invalid, too short.' } } },
	password: DataTypes.STRING
});

User.beforeSave(async (user, options) => {
	let err;
	if (user.changed('password')) {
		let salt, hash;
		[err, salt] = await tojs(bcrypt.genSalt(10));
		if (err) TE(err.message, true);

		[err, hash] = await tojs(bcrypt.hash(user.password, salt));
		if (err) TE(err.message, true);

		// eslint-disable-next-line require-atomic-updates
		user.password = hash;
	}
});

User.prototype.comparePassword = async function (pw) {
	let err, pass;
	if (!this.password) TE('password not set');

	[err, pass] = await tojs(bcrypt.compare(pw, this.password));
	if (err) TE(err);

	if (!pass) TE('invalid password');

	return this;
};

User.prototype.getJWT = function () {
	let expirationTime = parseInt(CONFIG.jwt_expiration);
	return 'Bearer ' + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expirationTime });
};

User.prototype.toWeb = function (pw) {
	let json = this.toJSON();
	return json;
};

if (CONFIG.app === 'development') {
	User.sequelize.sync()//creates table if they do not already exist
		.then(() => console.log('User table created successfully'))
		.catch(err => console.log('oooh, did you enter wrong database credentials?'));
	//User.sequelize.sync({ force: true })//deletes all tables then recreates them useful for testing and development purposes
	//	.then(() => console.log('User table created successfully'))
	//	.catch(err => console.log('oooh, did you enter wrong database credentials?'));
}

export default User;