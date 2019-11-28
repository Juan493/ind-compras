/* eslint-disable no-unused-vars */
'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('../models'),
    User = _require.User;

var _require2 = require('../services/auth.service'),
    getUniqueKeyFromBody = _require2.getUniqueKeyFromBody,
    createUser = _require2.createUser,
    authUser = _require2.authUser;

var _require3 = require('../services/util.service'),
    tojs = _require3.tojs,
    ReE = _require3.ReE,
    ReS = _require3.ReS,
    TE = _require3.TE;

module.exports = {
  get: function get(req, res) {
    var user;
    return regeneratorRuntime.async(function get$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            user = req.user;
            return _context.abrupt("return", ReS(res, {
              user: user.toWeb()
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  create: function create(req, res) {
    var body, err, user, _ref, _ref2;

    return regeneratorRuntime.async(function create$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = req.body;

            if (!(!body.unique_key && !body.email && !body.user)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", ReE(res, 'Please enter an email or user name to register.'));

          case 5:
            if (body.password) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", ReE(res, 'Please enter a password to register.'));

          case 9:
            _context2.next = 11;
            return regeneratorRuntime.awrap(tojs(createUser(body)));

          case 11:
            _ref = _context2.sent;
            _ref2 = _slicedToArray(_ref, 2);
            err = _ref2[0];
            user = _ref2[1];

            if (!err) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", ReE(res, err, 422));

          case 17:
            return _context2.abrupt("return", ReS(res, {
              message: 'Successfully created new user.',
              user: user.toWeb(),
              token: user.getJWT()
            }, 201));

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  update: function update(req, res) {
    var err, user, data, _ref3, _ref4;

    return regeneratorRuntime.async(function update$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            user = req.user;
            data = req.body;
            user.set(data);
            _context3.next = 5;
            return regeneratorRuntime.awrap(tojs(user.save()));

          case 5:
            _ref3 = _context3.sent;
            _ref4 = _slicedToArray(_ref3, 2);
            err = _ref4[0];
            user = _ref4[1];

            if (!err) {
              _context3.next = 12;
              break;
            }

            if (err.message == 'Validation error') err = 'The email address or user name is already in use';
            return _context3.abrupt("return", ReE(res, err));

          case 12:
            return _context3.abrupt("return", ReS(res, {
              message: 'Updated User'
            }));

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  remove: function remove(req, res) {
    var user, err, _ref5, _ref6;

    return regeneratorRuntime.async(function remove$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            user = req.user;
            _context4.next = 3;
            return regeneratorRuntime.awrap(tojs(user.destroy()));

          case 3:
            _ref5 = _context4.sent;
            _ref6 = _slicedToArray(_ref5, 2);
            err = _ref6[0];
            user = _ref6[1];

            if (!err) {
              _context4.next = 9;
              break;
            }

            return _context4.abrupt("return", ReE(res, 'error occured trying to delete user'));

          case 9:
            return _context4.abrupt("return", ReS(res, {
              message: 'Deleted User'
            }, 204));

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  login: function login(req, res) {
    var body, err, user, _ref7, _ref8;

    return regeneratorRuntime.async(function login$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            body = req.body;
            _context5.next = 3;
            return regeneratorRuntime.awrap(tojs(authUser(body)));

          case 3:
            _ref7 = _context5.sent;
            _ref8 = _slicedToArray(_ref7, 2);
            err = _ref8[0];
            user = _ref8[1];

            if (!err) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", ReE(res, err, 422));

          case 9:
            return _context5.abrupt("return", ReS(res, {
              token: user.getJWT(),
              user: user.toWeb()
            }));

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    });
  }
};