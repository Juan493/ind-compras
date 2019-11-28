/* eslint-disable no-unused-vars */
'use strict';

var _this = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('../models'),
    User = _require.User;

var validator = require('validator');

var _require2 = require('./util.service'),
    tojs = _require2.tojs,
    ReE = _require2.ReE,
    ReS = _require2.ReS,
    TE = _require2.TE;

module.exports = {
  getUniqueKeyFromBody: function getUniqueKeyFromBody(body) {
    // this is so they can send in 3 options unique_key, email, or user name and it will work
    var uniqueKey = body.unique_key;

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
  },
  createUser: function createUser(userInfo) {
    var uniqueKey, authInfo, err, user, _ref, _ref2, _ref3, _ref4;

    return regeneratorRuntime.async(function createUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            authInfo = {};
            authInfo.status = 'create';
            uniqueKey = _this.getUniqueKeyFromBody(userInfo);

            if (!uniqueKey) {
              TE('An email or user number was not entered.');
            }

            if (!validator.isEmail(uniqueKey)) {
              _context.next = 17;
              break;
            }

            authInfo.method = 'email';
            userInfo.email = uniqueKey;
            _context.next = 9;
            return regeneratorRuntime.awrap(tojs(User.create(userInfo)));

          case 9:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 2);
            err = _ref2[0];
            user = _ref2[1];

            if (err) {
              TE('user already exists with that email');
            }

            return _context.abrupt("return", user);

          case 17:
            if (!validator.isAlphanumeric(uniqueKey, ['es-ES'])) {
              _context.next = 31;
              break;
            }

            // checks if only phone number was sent
            authInfo.method = 'user';
            userInfo.user = uniqueKey;
            _context.next = 22;
            return regeneratorRuntime.awrap(tojs(User.create(userInfo)));

          case 22:
            _ref3 = _context.sent;
            _ref4 = _slicedToArray(_ref3, 2);
            err = _ref4[0];
            user = _ref4[1];
            console.log(err);
            if (err) TE(err.message);
            return _context.abrupt("return", user);

          case 31:
            TE('A valid email or user name was not entered.');

          case 32:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  authUser: function authUser(userInfo) {
    var uniqueKey, authInfo, err, user, _ref5, _ref6, _ref7, _ref8, _ref9, _ref10;

    return regeneratorRuntime.async(function authUser$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // returns token
            authInfo = {};
            authInfo.status = 'login';
            uniqueKey = _this.getUniqueKeyFromBody(userInfo);

            if (!uniqueKey) {
              TE('Please enter an email or user name to login');
            }

            if (!userInfo.password) {
              TE('Please enter a password to login');
            }

            if (!validator.isEmail(uniqueKey)) {
              _context2.next = 16;
              break;
            }

            authInfo.method = 'email';
            _context2.next = 9;
            return regeneratorRuntime.awrap(tojs(User.findOne({
              where: {
                email: uniqueKey
              }
            })));

          case 9:
            _ref5 = _context2.sent;
            _ref6 = _slicedToArray(_ref5, 2);
            err = _ref6[0];
            user = _ref6[1];

            if (err) {
              TE(err.message);
            }

            _context2.next = 28;
            break;

          case 16:
            if (!validator.isAlphanumeric(uniqueKey, ['es-ES'])) {
              _context2.next = 27;
              break;
            }

            // checks if only phone number was sent
            authInfo.method = 'user';
            _context2.next = 20;
            return regeneratorRuntime.awrap(tojs(User.findOne({
              where: {
                user: uniqueKey
              }
            })));

          case 20:
            _ref7 = _context2.sent;
            _ref8 = _slicedToArray(_ref7, 2);
            err = _ref8[0];
            user = _ref8[1];

            if (err) {
              TE(err.message);
            }

            _context2.next = 28;
            break;

          case 27:
            TE('A valid email or user name was not entered');

          case 28:
            if (!user) {
              TE('Not registered');
            }

            _context2.next = 31;
            return regeneratorRuntime.awrap(tojs(user.comparePassword(userInfo.password)));

          case 31:
            _ref9 = _context2.sent;
            _ref10 = _slicedToArray(_ref9, 2);
            err = _ref10[0];
            user = _ref10[1];

            if (err) {
              TE(err.message);
            }

            return _context2.abrupt("return", user);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};