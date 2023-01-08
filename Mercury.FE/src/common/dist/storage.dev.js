"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var storage = function () {
  var setItem = function setItem(key, data) {
    localStorage.setItem(key, data && _typeof(data) === "object" ? JSON.stringify(data) : data);

    if (data === undefined) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, data && _typeof(data) === "object" ? JSON.stringify(data) : data);
  };

  var getItem = function getItem(key) {
    var data = localStorage.getItem(key);

    try {
      data = JSON.parse(data);
      return data;
    } catch (error) {// console.error(error);
    }

    return data;
  };

  var removeItem = function removeItem(key) {
    localStorage.removeItem(key);
  };

  return {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
  };
}();

var _default = storage;
exports["default"] = _default;