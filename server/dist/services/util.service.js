/* eslint-disable no-unused-vars */
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var to = require('await-to-js');

var parseError = require('parse-error');

module.exports = {
  tojs: function tojs(promise) {
    var err, res, _ref, _ref2;

    return regeneratorRuntime.async(function tojs$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(to(promise));

          case 2:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 2);
            err = _ref2[0];
            res = _ref2[1];

            if (!err) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", [parseError(err)]);

          case 8:
            return _context.abrupt("return", [null, res]);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  ReE: function ReE(res, err, code) {
    // Error Web Response
    if (_typeof(err) === 'object' && typeof err.message !== 'undefined') {
      err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;
    return res.json({
      success: false,
      error: err
    });
  },
  ReS: function ReS(res, data, code) {
    // Success Web Response
    var send_data = {
      success: true
    };

    if (_typeof(data) === 'object') {
      send_data = Object.assign(data, send_data); // merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;
    return res.json(send_data);
  },
  TE: function TE(err_message, log) {
    // TE stands for Throw Error
    if (log === true) {
      console.error(err_message);
    }

    throw new Error(err_message);
  }
};