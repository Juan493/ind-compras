/* eslint-disable no-unused-vars */
'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var passport = require('passport');

var _require = require('passport-jwt'),
    ExtractJwt = _require.ExtractJwt,
    Strategy = _require.Strategy;

var User = require('../models/users.model');

var CONFIG = require('../config/config');

var _require2 = require('../services/util.service'),
    tojs = _require2.tojs,
    ReE = _require2.ReE,
    ReS = _require2.ReS,
    TE = _require2.TE;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = CONFIG.jwt_encryption;
passport.use(new Strategy(opts, function _callee(jwt_payload, done) {
  var err, user, _ref, _ref2;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(tojs(User.findByPk(jwt_payload.user_id)));

        case 2:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 2);
          err = _ref2[0];
          user = _ref2[1];

          if (!err) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", done(err, false));

        case 8:
          if (!user) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", done(null, user));

        case 12:
          return _context.abrupt("return", done(null, false));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  });
}));
module.exports = passport;