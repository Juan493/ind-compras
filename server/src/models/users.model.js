/* eslint-disable no-unused-vars */
'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { tojs, ReE, ReS, TE } = require('../services/util.service');

const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
	var Model = sequelize.define('User', {
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: { msg: 'Email invalid.' } } },
		phone: { type: DataTypes.STRING, validate: { len: { args: [7, 20], msg: 'Phone number invalid, too short.' }, isNumeric: { msg: 'not a valid phone number.' } } },
		user: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { len: { args: [7, 8], msg: 'User name invalid, too short.' } } },
		password: DataTypes.STRING
	});

	Model.beforeSave(async (user, options) => {
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

	Model.prototype.comparePassword = async function (pw) {
		let err, pass;
		if (!this.password) TE('password not set');

		[err, pass] = await tojs(bcrypt.compare(pw, this.password));
		if (err) TE(err);

		if (!pass) TE('invalid password');

		return this;
	};

	Model.prototype.getJWT = function () {
		let expiration_time = parseInt(CONFIG.jwt_expiration);
		return 'Bearer ' + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
	};

	Model.prototype.toWeb = function (pw) {
		let json = this.toJSON();
		return json;
	};

	return Model;
};