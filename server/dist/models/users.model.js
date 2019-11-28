/* eslint-disable no-unused-vars */
'use strict';

var _this = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var _require = require('../services/util.service'),
    tojs = _require.tojs,
    ReE = _require.ReE,
    ReS = _require.ReS,
    TE = _require.TE;

var CONFIG = require('../config/config');

module.exports = function (sequelize, DataTypes) {
  var Model = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Email invalid.'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [7, 20],
          msg: 'Phone number invalid, too short.'
        },
        isNumeric: {
          msg: 'not a valid phone number.'
        }
      }
    },
    user: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        len: {
          args: [7, 8],
          msg: 'User name invalid, too short.'
        }
      }
    },
    password: DataTypes.STRING
  });
  Model.beforeSave(function _callee(user, options) {
    var err, salt, hash, _ref, _ref2, _ref3, _ref4;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!user.changed('password')) {
              _context.next = 16;
              break;
            }

            _context.next = 3;
            return regeneratorRuntime.awrap(tojs(bcrypt.genSalt(10)));

          case 3:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 2);
            err = _ref2[0];
            salt = _ref2[1];
            if (err) TE(err.message, true);
            _context.next = 10;
            return regeneratorRuntime.awrap(tojs(bcrypt.hash(user.password, salt)));

          case 10:
            _ref3 = _context.sent;
            _ref4 = _slicedToArray(_ref3, 2);
            err = _ref4[0];
            hash = _ref4[1];
            if (err) TE(err.message, true); // eslint-disable-next-line require-atomic-updates

            user.password = hash;

          case 16:
          case "end":
            return _context.stop();
        }
      }
    });
  });

  Model.prototype.comparePassword = function _callee2(pw) {
    var err, pass, _ref5, _ref6;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!_this.password) TE('password not set');
            _context2.next = 3;
            return regeneratorRuntime.awrap(tojs(bcrypt.compare(pw, _this.password)));

          case 3:
            _ref5 = _context2.sent;
            _ref6 = _slicedToArray(_ref5, 2);
            err = _ref6[0];
            pass = _ref6[1];
            if (err) TE(err);
            if (!pass) TE('invalid password');
            return _context2.abrupt("return", _this);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    });
  };

  Model.prototype.getJWT = function () {
    var expirationTime = parseInt(CONFIG.jwt_expiration);
    return 'Bearer ' + jwt.sign({
      user_id: _this.id
    }, CONFIG.jwt_encryption, {
      expiresIn: expirationTime
    });
  };

  Model.prototype.toWeb = function (pw) {
    var json = _this.toJSON();

    return json;
  };

  return Model;
};