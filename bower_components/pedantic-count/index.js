(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PedanticCount = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return _get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* @file Count.js
* @author Franko <franko@akr.club>
* @version 0.1
*/

/**
 * History WeakMap for all instances
 * @const histMap
 */
var histMap = new WeakMap();
/**
* Loglines WeakMap for all instances
* @const logMap
*/

var logMap = new WeakMap();
/**
* histories memo
* @const histories
*/

var histories = function histories(object) {
  if (!histMap.has(object)) histMap.set(object, []);
  return histMap.get(object);
};
/**
* loglines memo
* @const loglines
*/


var loglines = function loglines(object) {
  if (!logMap.has(object)) logMap.set(object, []);
  return logMap.get(object);
};

var explanation = function explanation(loglines, history, result, indent) {
  result = result || ['\nScenario: Explain a Count'];
  indent = indent || 0;
  history.forEach(function (n, i) {
    var log = loglines[i];

    if (Array.isArray(log)) {
      var hist = new Array(log.length);
      hist.fill(n);
      indent++;
      return explanation(log, hist, result, indent);
    } else {
      result.push(/^initialize/.test(log) ? 'When I ' + log : 'And I ' + log);
    }
  });
  var space = new Array(indent).fill(' ').join('');
  indent--;
  return result.join('\n' + space + ' ');
};

var BaseCount =
/*#__PURE__*/
function () {
  _createClass(BaseCount, null, [{
    key: "__defineProperty",
    value: function __defineProperty(obj, name, instance, logging) {
      Object.defineProperty(obj, name, {
        enumerable: true,
        value: instance
      });

      if (!obj.__countProperties__) {
        Object.defineProperty(obj, '__countProperties__', {
          enumerable: false,
          writeable: true,
          value: {}
        });
      }

      Object.defineProperty(obj.__countProperties__, name, {
        enumerable: true,
        get: function get() {
          return instance;
        }
      });
      Object.defineProperty(obj, name + 'History', {
        get: function get() {
          return instance.history;
        }
      });

      if (logging) {
        Object.defineProperty(obj, name + 'Log', {
          get: function get() {
            return instance.log;
          }
        });
        Object.defineProperty(obj, name + 'Explanation', {
          get: function get() {
            return instance.explain().replace(/Explain a Count/g, 'Explain a Count named ' + name);
          }
        });
        var oldExplain = obj.explainCounts;

        obj.explainCounts = function () {
          var previous = oldExplain ? oldExplain.call(obj) : null;
          var bunch = previous ? [previous] : [];
          Object.keys(obj.__countProperties__).forEach(function (name) {
            bunch.push(obj[name + 'Explanation']);
          });
          return bunch.join("\n");
        };
      }
    }
  }, {
    key: "defineProperty",
    value: function defineProperty(obj, name, init, strict, logging) {
      var clazz = BaseCount;

      if (logging) {
        clazz = LoggingCount;
      } else if (strict) {
        clazz = StrictCount;
      }

      var instance = new clazz(init);

      if (typeof Object.getPrototypeOf(obj) == 'function') {
        BaseCount.__defineProperty(obj.prototype, name, instance, logging);
      } else {
        BaseCount.__defineProperty(obj, name, instance, logging);
      }

      return obj;
    }
    /**
    * Represents a Count.
    * @constructor
    * @param {number} initial - The initial value
    */

  }]);

  function BaseCount(initial) {
    _classCallCheck(this, BaseCount);

    if (isNaN(initial)) {
      this.set(0);
    } else {
      this.set(initial);
    }
  }
  /**
  * Returns the numeric value of the count
  * @returns {number} The sum of the historical changes
  */


  _createClass(BaseCount, [{
    key: "valueOf",
    value: function valueOf() {
      return Number(histories(this).reduce(function (t, n) {
        return t + n;
      }, 0));
    }
    /**
    * Returns the array of values used to calculate the result.
    * @returns {array} The values for all changes
    */

  }, {
    key: "get",

    /**
    * Returns the numeric value of the count
    * @returns {number} The sum of the historical changes
    */
    value: function get() {
      return 1 * this;
    }
    /**
    * Adds a new value to the history
    * @param {number} value - An integer
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "set",
    value: function set(v) {
      var _this = this;

      if (isNaN(v)) {
        return this.valueOf;
      }

      if (typeof v.history !== 'undefined') {
        v.history.forEach(function (v) {
          _this.set(v);
        });
      } else {
        histories(this).push(v);
      }

      return this.valueOf;
    }
    /**
    * Adds a new value incrementation the history
    * @param {number} value - A non-negative integer
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "incr",
    value: function incr(n) {
      if (isNaN(n)) {
        n = 0;
      }

      if (n < 0) {
        n = Math.abs(n);
      }

      return this.set(n);
    }
    /**
    * Adds a new value decrementation the history
    * @param {number} value - A non-negative integer
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "decr",
    value: function decr(n) {
      if (isNaN(n)) {
        n = 0;
      }

      if (n < 0) {
        n = Math.abs(n);
      }

      return this.set(-1 * n);
    }
    /**
    * Returns the history to the first value set.
    * @returns {number} The sum of the historical changes (the initial value) 
    */

  }, {
    key: "reset",
    value: function reset() {
      var h = histories(this);
      var first = h.shift();
      h.splice(0, h.length);
      h.push(first);
      return this.get();
    }
  }, {
    key: "history",
    get: function get() {
      return Array.from(histories(this));
    }
    /**
    * Returns the length of the history
    * @returns {array} The values for all changes
    */

  }, {
    key: "length",
    get: function get() {
      return histories(this).length;
    }
  }]);

  return BaseCount;
}();

var StrictCount =
/*#__PURE__*/
function (_BaseCount) {
  _inherits(StrictCount, _BaseCount);

  /**
  * Represents a Strict Count.
  * @constructor
  * @param {number} initial - The initial value (required)
  */
  function StrictCount(initial) {
    _classCallCheck(this, StrictCount);

    if (isNaN(initial)) throw new ReferenceError('Cannot initialize without numeric value');
    return _possibleConstructorReturn(this, (StrictCount.__proto__ || Object.getPrototypeOf(StrictCount)).call(this, initial));
  }
  /**
  * Adds a new value incrementation the history
  * @param {number} value - A non-negative integer (required)
  * @returns {number} The sum of the historical changes
  */


  _createClass(StrictCount, [{
    key: "incr",
    value: function incr(n) {
      if (isNaN(n)) throw new ReferenceError('Cannot set non-numeric value');
      if (n < 0) throw new ReferenceError('Cannot increment by negative value');
      return _get(StrictCount.prototype.__proto__ || Object.getPrototypeOf(StrictCount.prototype), "incr", this).call(this, n);
    }
    /**
    * Adds a new value decrementation the history
    * @param {number} value - A non-negative integer (required)
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "decr",
    value: function decr(n) {
      if (isNaN(n)) throw new ReferenceError('Cannot set non-numeric value');
      if (n < 0) throw new ReferenceError('Cannot decrement by negative value');
      return _get(StrictCount.prototype.__proto__ || Object.getPrototypeOf(StrictCount.prototype), "decr", this).call(this, n);
    }
    /**
    * Adds a new value to the history
    * @param {number} value - An integer (required)
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "set",
    value: function set(v) {
      if (isNaN(v)) throw new ReferenceError('Cannot set non-numeric value');
      return _get(StrictCount.prototype.__proto__ || Object.getPrototypeOf(StrictCount.prototype), "set", this).call(this, v);
    }
  }]);

  return StrictCount;
}(BaseCount);

var LoggingCount =
/*#__PURE__*/
function (_StrictCount) {
  _inherits(LoggingCount, _StrictCount);

  function LoggingCount() {
    _classCallCheck(this, LoggingCount);

    return _possibleConstructorReturn(this, (LoggingCount.__proto__ || Object.getPrototypeOf(LoggingCount)).apply(this, arguments));
  }

  _createClass(LoggingCount, [{
    key: "__defaultMessage",
    value: function __defaultMessage(v, message) {
      var prefix = this.length === 1 ? 'initialize to' : message ? message : v < 0 ? 'decrement by' : 'increment by';
      return [prefix, Math.abs(v)].join(' ');
    }
    /**
    * Adds a new value to the history
    * @param {number} value - An integer (required)
    * @param {string} message - A message associated with this modification (required)
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "set",
    value: function set(v, message, fn) {
      var _this2 = this;

      // fn = fn || 'set';
      var result = _get(LoggingCount.prototype.__proto__ || Object.getPrototypeOf(LoggingCount.prototype), "set", this).call(this, v);

      message = this.__defaultMessage(v, message);

      if (typeof v.log != 'undefined') {
        v.log.forEach(function (l, i) {
          loglines(_this2).push(l);
        });
      } else {
        loglines(this).push(message);
      }

      return result;
    }
    /**
    * Adds a new value incrementation the history
    * @param {number} value - A non-negative integer (required)
    * @param {string} message - A message associated with this modification (required)
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "incr",
    value: function incr(v, message) {
      return this.set(v, message);
    }
    /**
    * Adds a new value decrementation the history
    * @param {number} value - A non-negative integer (required)
    * @param {string} message - A message associated with this modification (required)
    * @returns {number} The sum of the historical changes
    */

  }, {
    key: "decr",
    value: function decr(v, message) {
      return this.set(-1 * Math.abs(v), message);
    }
    /**
    * Returns log of messages associated with value changes.
    * @returns {mixed} an array of messages or message arrays
    */

  }, {
    key: "reset",

    /**
    * Returns the history to the first value set, sets the first log entry as the entire log and adds a "reset" message
    * @returns {number} The sum of the historical changes (the initial value) 
    */
    value: function reset() {
      _get(LoggingCount.prototype.__proto__ || Object.getPrototypeOf(LoggingCount.prototype), "reset", this).call(this);

      var initial = histories(this)[0];
      var l = loglines(this);
      var first = Array.from(l);
      first.push('reset to ' + initial);
      l.splice(0, l.length);
      l.push(first);
      return this.get();
    }
  }, {
    key: "explain",
    value: function explain() {
      var explained = explanation(loglines(this), histories(this));

      if (/Then the value equals \d/.test(explained)) {
        return explained;
      }

      var total = this.get();
      var space = explained.split('\n').pop().replace(/^(\s+).+/, "$1");
      return explained + "\n".concat(space, "Then the value equals ").concat(total);
    }
  }, {
    key: "log",
    get: function get() {
      return Array.from(loglines(this));
    }
  }]);

  return LoggingCount;
}(StrictCount);
/**
 * Index Map
 * @const indexMap
 */


var indexMap = new Map();
var indexLinks = new Map();
var virtMap = new Map();

var CountIndex =
/*#__PURE__*/
function () {
  _createClass(CountIndex, null, [{
    key: "clear",
    value: function clear() {
      indexMap.clear();
      indexLinks.clear();
      virtMap.clear();
      return true;
    }
  }, {
    key: "clearIndex",
    value: function clearIndex(name) {
      indexMap.delete(name);
      indexLinks.delete(name);
      virtMap.delete(name);
      return true;
    }
  }, {
    key: "createIndex",
    value: function createIndex(name) {
      if (!this.map.has(name)) {
        var idMap = new Map();
        idMap.set('ids', new Map());
        this.map.set(name, idMap);
      }

      return new CountIndex(name);
    }
  }, {
    key: "createVirtual",
    value: function createVirtual(name, defaultValue) {
      if (!this.map.has(name)) {
        var idMap = new Map();
        idMap.set('ids', new Map());
        this.map.set(name, idMap);
      }

      virtMap.set(name, defaultValue);
      return new CountIndex(name);
    }
  }, {
    key: "index",
    value: function index(name) {
      return this.map.get(name);
    }
  }, {
    key: "exists",
    value: function exists(name) {
      return this.map.has(name);
    }
  }, {
    key: "getIds",
    value: function getIds(name) {
      if (!this.exists(name)) return [];
      return Array.from(this.index(name).get('ids').keys());
    }
  }, {
    key: "getCounts",
    value: function getCounts(name) {
      if (!this.exists(name)) return [];
      return Array.from(this.index(name).get('ids').values());
    }
  }, {
    key: "getTotal",
    value: function getTotal(name) {
      return this.getCounts(name).reduce(function (t, c) {
        return t + c;
      }, 0);
    }
  }, {
    key: "hasCount",
    value: function hasCount(name, id) {
      return this.map.has(name) && this.index(name).has('ids') && this.index(name).get('ids').has(id);
    }
  }, {
    key: "getCount",
    value: function getCount(name, id) {
      var _this3 = this;

      if (!this.hasCount(name, id)) {
        if (virtMap.has(name)) return virtMap.get(name);
        throw new ReferenceError('No index for "#' + id + '" @ "' + name + '".');
      }

      var count = this.map.get(name).get('ids').get(id);

      if (!indexLinks.has(name)) {
        return count;
      }

      var links = Array.from(indexLinks.get(name).values());
      return links.reduce(function (t, l) {
        return t - _this3.getCount(l, id);
      }, count); // console.log('lnk', linkName)
      // var linkCount = this.getCount(linkName, id );
      // return count - linkCount;
    }
  }, {
    key: "setCount",
    value: function setCount(name, id, value) {
      if (this.hasCount(name, id)) {
        throw new ReferenceError('Initial Count can only me set once for "#' + id + '" @ "' + name + '".');
      } else {
        return this.map.get(name).get('ids').set(id, new LoggingCount(value));
      }
    }
  }, {
    key: "incrCount",
    value: function incrCount(name, id, n) {
      if (!this.hasCount(name, id)) {
        if (virtMap.has(name)) {
          this.setCount(name, id, virtMap.get(name));
          return this.incrCount(name, id, n);
        }

        throw new ReferenceError('No count for id "' + id + '".');
      } else {
        return this.map.get(name).get('ids').get(id).incr(n);
      }
    }
  }, {
    key: "decrCount",
    value: function decrCount(name, id, n) {
      if (!this.hasCount(name, id)) {
        if (virtMap.has(name)) {
          this.setCount(name, id, virtMap.get(name));
          return this.decrCount(name, id, n);
        }

        throw new ReferenceError('No count for id "' + id + '".');
      } else {
        return this.map.get(name).get('ids').get(id).decr(n);
      }
    }
  }, {
    key: "resetCount",
    value: function resetCount(name, id) {
      if (!this.hasCount(name, id)) {
        return true; // throw new ReferenceError('No count for id "'+id+'".');
      } else {
        return this.map.get(name).get('ids').get(id).reset();
      }
    }
  }, {
    key: "getHistory",
    value: function getHistory(name, id) {
      if (!this.hasCount(name, id)) {
        throw new ReferenceError('No history for id "' + id + '".');
      } else {
        return this.map.get(name).get('ids').get(id).history;
      }
    }
  }, {
    key: "getLog",
    value: function getLog(name, id) {
      if (!this.hasCount(name, id)) {
        throw new ReferenceError('No log for id "' + id + '".');
      } else {
        return this.map.get(name).get('ids').get(id).log;
      }
    }
  }, {
    key: "explain",
    value: function explain(name, id) {
      if (!this.hasCount(name, id)) {
        throw new ReferenceError('No explanation for id "' + id + '".');
      } else {
        return this.map.get(name).get('ids').get(id).explain().replace('Scenario: Explain a Count', "Scenario: Explain " + name + " for the id " + id);
      }
    }
  }, {
    key: "link",
    value: function link(a, b) {
      if (!indexLinks.has(a)) {
        indexLinks.set(a, new Set());
      }

      indexLinks.get(a).add(b);
      return true;
    }
  }, {
    key: "map",
    get: function get() {
      return indexMap;
    }
  }]);

  function CountIndex(name) {
    _classCallCheck(this, CountIndex);

    this.name = name;
  }

  _createClass(CountIndex, [{
    key: "set",
    value: function set(id, initialCount) {
      return CountIndex.setCount(this.name, id, initialCount);
    }
  }, {
    key: "get",
    value: function get(id) {
      return CountIndex.getCount(this.name, id);
    }
  }, {
    key: "incr",
    value: function incr(id, n) {
      return CountIndex.incrCount(this.name, id, n);
    }
  }, {
    key: "decr",
    value: function decr(id, n) {
      return CountIndex.decrCount(this.name, id, n);
    }
  }, {
    key: "history",
    value: function history(id) {
      return CountIndex.getHistory(this.name, id);
    }
  }, {
    key: "log",
    value: function log(id) {
      return CountIndex.getLog(this.name, id);
    }
  }, {
    key: "explain",
    value: function explain(id) {
      return CountIndex.explain(this.name, id);
    }
  }, {
    key: "link",
    value: function link(name) {
      CountIndex.link(this.name, name);
      return true;
    }
  }, {
    key: "ids",
    get: function get() {
      return CountIndex.getIds(this.name);
    }
  }, {
    key: "counts",
    get: function get() {
      return CountIndex.getCounts(this.name);
    }
  }]);

  return CountIndex;
}();

var VirtualIndex =
/*#__PURE__*/
function (_CountIndex) {
  _inherits(VirtualIndex, _CountIndex);

  function VirtualIndex(name) {
    var _this4;

    _classCallCheck(this, VirtualIndex);

    _this4 = _possibleConstructorReturn(this, (VirtualIndex.__proto__ || Object.getPrototypeOf(VirtualIndex)).call(this, name));
    _this4.virtual = true;
    return _this4;
  }

  return VirtualIndex;
}(CountIndex);

module.exports = {
  CountIndex: CountIndex,
  Count: BaseCount,
  StrictCount: StrictCount,
  LoggingCount: LoggingCount
};


},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2hvbWUvZnJhbmtvLy5ucG0tcGFja2FnZXMvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb21waWxlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKGNhbGwgJiYgKF90eXBlb2YoY2FsbCkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikpIHsgcmV0dXJuIGNhbGw7IH0gaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gc2VsZjsgfVxuXG5mdW5jdGlvbiBfZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7IGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTsgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpOyBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7IHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTsgaWYgKHBhcmVudCA9PT0gbnVsbCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9IGVsc2UgeyByZXR1cm4gX2dldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7IH0gfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykgeyByZXR1cm4gZGVzYy52YWx1ZTsgfSBlbHNlIHsgdmFyIGdldHRlciA9IGRlc2MuZ2V0OyBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpOyB9IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbi8qKlxuKiBAZmlsZSBDb3VudC5qc1xuKiBAYXV0aG9yIEZyYW5rbyA8ZnJhbmtvQGFrci5jbHViPlxuKiBAdmVyc2lvbiAwLjFcbiovXG5cbi8qKlxuICogSGlzdG9yeSBXZWFrTWFwIGZvciBhbGwgaW5zdGFuY2VzXG4gKiBAY29uc3QgaGlzdE1hcFxuICovXG52YXIgaGlzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG4vKipcbiogTG9nbGluZXMgV2Vha01hcCBmb3IgYWxsIGluc3RhbmNlc1xuKiBAY29uc3QgbG9nTWFwXG4qL1xuXG52YXIgbG9nTWFwID0gbmV3IFdlYWtNYXAoKTtcbi8qKlxuKiBoaXN0b3JpZXMgbWVtb1xuKiBAY29uc3QgaGlzdG9yaWVzXG4qL1xuXG52YXIgaGlzdG9yaWVzID0gZnVuY3Rpb24gaGlzdG9yaWVzKG9iamVjdCkge1xuICBpZiAoIWhpc3RNYXAuaGFzKG9iamVjdCkpIGhpc3RNYXAuc2V0KG9iamVjdCwgW10pO1xuICByZXR1cm4gaGlzdE1hcC5nZXQob2JqZWN0KTtcbn07XG4vKipcbiogbG9nbGluZXMgbWVtb1xuKiBAY29uc3QgbG9nbGluZXNcbiovXG5cblxudmFyIGxvZ2xpbmVzID0gZnVuY3Rpb24gbG9nbGluZXMob2JqZWN0KSB7XG4gIGlmICghbG9nTWFwLmhhcyhvYmplY3QpKSBsb2dNYXAuc2V0KG9iamVjdCwgW10pO1xuICByZXR1cm4gbG9nTWFwLmdldChvYmplY3QpO1xufTtcblxudmFyIGV4cGxhbmF0aW9uID0gZnVuY3Rpb24gZXhwbGFuYXRpb24obG9nbGluZXMsIGhpc3RvcnksIHJlc3VsdCwgaW5kZW50KSB7XG4gIHJlc3VsdCA9IHJlc3VsdCB8fCBbJ1xcblNjZW5hcmlvOiBFeHBsYWluIGEgQ291bnQnXTtcbiAgaW5kZW50ID0gaW5kZW50IHx8IDA7XG4gIGhpc3RvcnkuZm9yRWFjaChmdW5jdGlvbiAobiwgaSkge1xuICAgIHZhciBsb2cgPSBsb2dsaW5lc1tpXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGxvZykpIHtcbiAgICAgIHZhciBoaXN0ID0gbmV3IEFycmF5KGxvZy5sZW5ndGgpO1xuICAgICAgaGlzdC5maWxsKG4pO1xuICAgICAgaW5kZW50Kys7XG4gICAgICByZXR1cm4gZXhwbGFuYXRpb24obG9nLCBoaXN0LCByZXN1bHQsIGluZGVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKC9eaW5pdGlhbGl6ZS8udGVzdChsb2cpID8gJ1doZW4gSSAnICsgbG9nIDogJ0FuZCBJICcgKyBsb2cpO1xuICAgIH1cbiAgfSk7XG4gIHZhciBzcGFjZSA9IG5ldyBBcnJheShpbmRlbnQpLmZpbGwoJyAnKS5qb2luKCcnKTtcbiAgaW5kZW50LS07XG4gIHJldHVybiByZXN1bHQuam9pbignXFxuJyArIHNwYWNlICsgJyAnKTtcbn07XG5cbnZhciBCYXNlQ291bnQgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBfY3JlYXRlQ2xhc3MoQmFzZUNvdW50LCBudWxsLCBbe1xuICAgIGtleTogXCJfX2RlZmluZVByb3BlcnR5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9fZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCBpbnN0YW5jZSwgbG9nZ2luZykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogaW5zdGFuY2VcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIW9iai5fX2NvdW50UHJvcGVydGllc19fKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdfX2NvdW50UHJvcGVydGllc19fJywge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIHdyaXRlYWJsZTogdHJ1ZSxcbiAgICAgICAgICB2YWx1ZToge31cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmouX19jb3VudFByb3BlcnRpZXNfXywgbmFtZSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSArICdIaXN0b3J5Jywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgICByZXR1cm4gaW5zdGFuY2UuaGlzdG9yeTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChsb2dnaW5nKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUgKyAnTG9nJywge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmxvZztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lICsgJ0V4cGxhbmF0aW9uJywge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLmV4cGxhaW4oKS5yZXBsYWNlKC9FeHBsYWluIGEgQ291bnQvZywgJ0V4cGxhaW4gYSBDb3VudCBuYW1lZCAnICsgbmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIG9sZEV4cGxhaW4gPSBvYmouZXhwbGFpbkNvdW50cztcblxuICAgICAgICBvYmouZXhwbGFpbkNvdW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcHJldmlvdXMgPSBvbGRFeHBsYWluID8gb2xkRXhwbGFpbi5jYWxsKG9iaikgOiBudWxsO1xuICAgICAgICAgIHZhciBidW5jaCA9IHByZXZpb3VzID8gW3ByZXZpb3VzXSA6IFtdO1xuICAgICAgICAgIE9iamVjdC5rZXlzKG9iai5fX2NvdW50UHJvcGVydGllc19fKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBidW5jaC5wdXNoKG9ialtuYW1lICsgJ0V4cGxhbmF0aW9uJ10pO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBidW5jaC5qb2luKFwiXFxuXCIpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWZpbmVQcm9wZXJ0eVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIGluaXQsIHN0cmljdCwgbG9nZ2luZykge1xuICAgICAgdmFyIGNsYXp6ID0gQmFzZUNvdW50O1xuXG4gICAgICBpZiAobG9nZ2luZykge1xuICAgICAgICBjbGF6eiA9IExvZ2dpbmdDb3VudDtcbiAgICAgIH0gZWxzZSBpZiAoc3RyaWN0KSB7XG4gICAgICAgIGNsYXp6ID0gU3RyaWN0Q291bnQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbnN0YW5jZSA9IG5ldyBjbGF6eihpbml0KTtcblxuICAgICAgaWYgKHR5cGVvZiBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIEJhc2VDb3VudC5fX2RlZmluZVByb3BlcnR5KG9iai5wcm90b3R5cGUsIG5hbWUsIGluc3RhbmNlLCBsb2dnaW5nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEJhc2VDb3VudC5fX2RlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwgaW5zdGFuY2UsIGxvZ2dpbmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICAvKipcbiAgICAqIFJlcHJlc2VudHMgYSBDb3VudC5cbiAgICAqIEBjb25zdHJ1Y3RvclxuICAgICogQHBhcmFtIHtudW1iZXJ9IGluaXRpYWwgLSBUaGUgaW5pdGlhbCB2YWx1ZVxuICAgICovXG5cbiAgfV0pO1xuXG4gIGZ1bmN0aW9uIEJhc2VDb3VudChpbml0aWFsKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEJhc2VDb3VudCk7XG5cbiAgICBpZiAoaXNOYU4oaW5pdGlhbCkpIHtcbiAgICAgIHRoaXMuc2V0KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldChpbml0aWFsKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICogUmV0dXJucyB0aGUgbnVtZXJpYyB2YWx1ZSBvZiB0aGUgY291bnRcbiAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3VtIG9mIHRoZSBoaXN0b3JpY2FsIGNoYW5nZXNcbiAgKi9cblxuXG4gIF9jcmVhdGVDbGFzcyhCYXNlQ291bnQsIFt7XG4gICAga2V5OiBcInZhbHVlT2ZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdmFsdWVPZigpIHtcbiAgICAgIHJldHVybiBOdW1iZXIoaGlzdG9yaWVzKHRoaXMpLnJlZHVjZShmdW5jdGlvbiAodCwgbikge1xuICAgICAgICByZXR1cm4gdCArIG47XG4gICAgICB9LCAwKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgdmFsdWVzIHVzZWQgdG8gY2FsY3VsYXRlIHRoZSByZXN1bHQuXG4gICAgKiBAcmV0dXJucyB7YXJyYXl9IFRoZSB2YWx1ZXMgZm9yIGFsbCBjaGFuZ2VzXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImdldFwiLFxuXG4gICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBudW1lcmljIHZhbHVlIG9mIHRoZSBjb3VudFxuICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHN1bSBvZiB0aGUgaGlzdG9yaWNhbCBjaGFuZ2VzXG4gICAgKi9cbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIDEgKiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEFkZHMgYSBuZXcgdmFsdWUgdG8gdGhlIGhpc3RvcnlcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIEFuIGludGVnZXJcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzdW0gb2YgdGhlIGhpc3RvcmljYWwgY2hhbmdlc1xuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KHYpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmIChpc05hTih2KSkge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZU9mO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHYuaGlzdG9yeSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdi5oaXN0b3J5LmZvckVhY2goZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICBfdGhpcy5zZXQodik7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGlzdG9yaWVzKHRoaXMpLnB1c2godik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnZhbHVlT2Y7XG4gICAgfVxuICAgIC8qKlxuICAgICogQWRkcyBhIG5ldyB2YWx1ZSBpbmNyZW1lbnRhdGlvbiB0aGUgaGlzdG9yeVxuICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gQSBub24tbmVnYXRpdmUgaW50ZWdlclxuICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHN1bSBvZiB0aGUgaGlzdG9yaWNhbCBjaGFuZ2VzXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImluY3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5jcihuKSB7XG4gICAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgICAgbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChuIDwgMCkge1xuICAgICAgICBuID0gTWF0aC5hYnMobik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnNldChuKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBBZGRzIGEgbmV3IHZhbHVlIGRlY3JlbWVudGF0aW9uIHRoZSBoaXN0b3J5XG4gICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBBIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyXG4gICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3VtIG9mIHRoZSBoaXN0b3JpY2FsIGNoYW5nZXNcbiAgICAqL1xuXG4gIH0sIHtcbiAgICBrZXk6IFwiZGVjclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWNyKG4pIHtcbiAgICAgIGlmIChpc05hTihuKSkge1xuICAgICAgICBuID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIG4gPSBNYXRoLmFicyhuKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2V0KC0xICogbik7XG4gICAgfVxuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgaGlzdG9yeSB0byB0aGUgZmlyc3QgdmFsdWUgc2V0LlxuICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHN1bSBvZiB0aGUgaGlzdG9yaWNhbCBjaGFuZ2VzICh0aGUgaW5pdGlhbCB2YWx1ZSkgXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJlc2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgdmFyIGggPSBoaXN0b3JpZXModGhpcyk7XG4gICAgICB2YXIgZmlyc3QgPSBoLnNoaWZ0KCk7XG4gICAgICBoLnNwbGljZSgwLCBoLmxlbmd0aCk7XG4gICAgICBoLnB1c2goZmlyc3QpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhpc3RvcnlcIixcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGhpc3Rvcmllcyh0aGlzKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBoaXN0b3J5XG4gICAgKiBAcmV0dXJucyB7YXJyYXl9IFRoZSB2YWx1ZXMgZm9yIGFsbCBjaGFuZ2VzXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImxlbmd0aFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIGhpc3Rvcmllcyh0aGlzKS5sZW5ndGg7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhc2VDb3VudDtcbn0oKTtcblxudmFyIFN0cmljdENvdW50ID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uIChfQmFzZUNvdW50KSB7XG4gIF9pbmhlcml0cyhTdHJpY3RDb3VudCwgX0Jhc2VDb3VudCk7XG5cbiAgLyoqXG4gICogUmVwcmVzZW50cyBhIFN0cmljdCBDb3VudC5cbiAgKiBAY29uc3RydWN0b3JcbiAgKiBAcGFyYW0ge251bWJlcn0gaW5pdGlhbCAtIFRoZSBpbml0aWFsIHZhbHVlIChyZXF1aXJlZClcbiAgKi9cbiAgZnVuY3Rpb24gU3RyaWN0Q291bnQoaW5pdGlhbCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTdHJpY3RDb3VudCk7XG5cbiAgICBpZiAoaXNOYU4oaW5pdGlhbCkpIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignQ2Fubm90IGluaXRpYWxpemUgd2l0aG91dCBudW1lcmljIHZhbHVlJyk7XG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChTdHJpY3RDb3VudC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFN0cmljdENvdW50KSkuY2FsbCh0aGlzLCBpbml0aWFsKSk7XG4gIH1cbiAgLyoqXG4gICogQWRkcyBhIG5ldyB2YWx1ZSBpbmNyZW1lbnRhdGlvbiB0aGUgaGlzdG9yeVxuICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIEEgbm9uLW5lZ2F0aXZlIGludGVnZXIgKHJlcXVpcmVkKVxuICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzdW0gb2YgdGhlIGhpc3RvcmljYWwgY2hhbmdlc1xuICAqL1xuXG5cbiAgX2NyZWF0ZUNsYXNzKFN0cmljdENvdW50LCBbe1xuICAgIGtleTogXCJpbmNyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluY3Iobikge1xuICAgICAgaWYgKGlzTmFOKG4pKSB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0Nhbm5vdCBzZXQgbm9uLW51bWVyaWMgdmFsdWUnKTtcbiAgICAgIGlmIChuIDwgMCkgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDYW5ub3QgaW5jcmVtZW50IGJ5IG5lZ2F0aXZlIHZhbHVlJyk7XG4gICAgICByZXR1cm4gX2dldChTdHJpY3RDb3VudC5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihTdHJpY3RDb3VudC5wcm90b3R5cGUpLCBcImluY3JcIiwgdGhpcykuY2FsbCh0aGlzLCBuKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBBZGRzIGEgbmV3IHZhbHVlIGRlY3JlbWVudGF0aW9uIHRoZSBoaXN0b3J5XG4gICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBBIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIChyZXF1aXJlZClcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzdW0gb2YgdGhlIGhpc3RvcmljYWwgY2hhbmdlc1xuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJkZWNyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlY3Iobikge1xuICAgICAgaWYgKGlzTmFOKG4pKSB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0Nhbm5vdCBzZXQgbm9uLW51bWVyaWMgdmFsdWUnKTtcbiAgICAgIGlmIChuIDwgMCkgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDYW5ub3QgZGVjcmVtZW50IGJ5IG5lZ2F0aXZlIHZhbHVlJyk7XG4gICAgICByZXR1cm4gX2dldChTdHJpY3RDb3VudC5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihTdHJpY3RDb3VudC5wcm90b3R5cGUpLCBcImRlY3JcIiwgdGhpcykuY2FsbCh0aGlzLCBuKTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBBZGRzIGEgbmV3IHZhbHVlIHRvIHRoZSBoaXN0b3J5XG4gICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBBbiBpbnRlZ2VyIChyZXF1aXJlZClcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzdW0gb2YgdGhlIGhpc3RvcmljYWwgY2hhbmdlc1xuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KHYpIHtcbiAgICAgIGlmIChpc05hTih2KSkgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdDYW5ub3Qgc2V0IG5vbi1udW1lcmljIHZhbHVlJyk7XG4gICAgICByZXR1cm4gX2dldChTdHJpY3RDb3VudC5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihTdHJpY3RDb3VudC5wcm90b3R5cGUpLCBcInNldFwiLCB0aGlzKS5jYWxsKHRoaXMsIHYpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTdHJpY3RDb3VudDtcbn0oQmFzZUNvdW50KTtcblxudmFyIExvZ2dpbmdDb3VudCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX1N0cmljdENvdW50KSB7XG4gIF9pbmhlcml0cyhMb2dnaW5nQ291bnQsIF9TdHJpY3RDb3VudCk7XG5cbiAgZnVuY3Rpb24gTG9nZ2luZ0NvdW50KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBMb2dnaW5nQ291bnQpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChMb2dnaW5nQ291bnQuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihMb2dnaW5nQ291bnQpKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhMb2dnaW5nQ291bnQsIFt7XG4gICAga2V5OiBcIl9fZGVmYXVsdE1lc3NhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX19kZWZhdWx0TWVzc2FnZSh2LCBtZXNzYWdlKSB7XG4gICAgICB2YXIgcHJlZml4ID0gdGhpcy5sZW5ndGggPT09IDEgPyAnaW5pdGlhbGl6ZSB0bycgOiBtZXNzYWdlID8gbWVzc2FnZSA6IHYgPCAwID8gJ2RlY3JlbWVudCBieScgOiAnaW5jcmVtZW50IGJ5JztcbiAgICAgIHJldHVybiBbcHJlZml4LCBNYXRoLmFicyh2KV0uam9pbignICcpO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEFkZHMgYSBuZXcgdmFsdWUgdG8gdGhlIGhpc3RvcnlcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIEFuIGludGVnZXIgKHJlcXVpcmVkKVxuICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBBIG1lc3NhZ2UgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbW9kaWZpY2F0aW9uIChyZXF1aXJlZClcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzdW0gb2YgdGhlIGhpc3RvcmljYWwgY2hhbmdlc1xuICAgICovXG5cbiAgfSwge1xuICAgIGtleTogXCJzZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0KHYsIG1lc3NhZ2UsIGZuKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgLy8gZm4gPSBmbiB8fCAnc2V0JztcbiAgICAgIHZhciByZXN1bHQgPSBfZ2V0KExvZ2dpbmdDb3VudC5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihMb2dnaW5nQ291bnQucHJvdG90eXBlKSwgXCJzZXRcIiwgdGhpcykuY2FsbCh0aGlzLCB2KTtcblxuICAgICAgbWVzc2FnZSA9IHRoaXMuX19kZWZhdWx0TWVzc2FnZSh2LCBtZXNzYWdlKTtcblxuICAgICAgaWYgKHR5cGVvZiB2LmxvZyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICB2LmxvZy5mb3JFYWNoKGZ1bmN0aW9uIChsLCBpKSB7XG4gICAgICAgICAgbG9nbGluZXMoX3RoaXMyKS5wdXNoKGwpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2xpbmVzKHRoaXMpLnB1c2gobWVzc2FnZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICogQWRkcyBhIG5ldyB2YWx1ZSBpbmNyZW1lbnRhdGlvbiB0aGUgaGlzdG9yeVxuICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gQSBub24tbmVnYXRpdmUgaW50ZWdlciAocmVxdWlyZWQpXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIEEgbWVzc2FnZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBtb2RpZmljYXRpb24gKHJlcXVpcmVkKVxuICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHN1bSBvZiB0aGUgaGlzdG9yaWNhbCBjaGFuZ2VzXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImluY3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5jcih2LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQodiwgbWVzc2FnZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogQWRkcyBhIG5ldyB2YWx1ZSBkZWNyZW1lbnRhdGlvbiB0aGUgaGlzdG9yeVxuICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gQSBub24tbmVnYXRpdmUgaW50ZWdlciAocmVxdWlyZWQpXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIEEgbWVzc2FnZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBtb2RpZmljYXRpb24gKHJlcXVpcmVkKVxuICAgICogQHJldHVybnMge251bWJlcn0gVGhlIHN1bSBvZiB0aGUgaGlzdG9yaWNhbCBjaGFuZ2VzXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcImRlY3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVjcih2LCBtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoLTEgKiBNYXRoLmFicyh2KSwgbWVzc2FnZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogUmV0dXJucyBsb2cgb2YgbWVzc2FnZXMgYXNzb2NpYXRlZCB3aXRoIHZhbHVlIGNoYW5nZXMuXG4gICAgKiBAcmV0dXJucyB7bWl4ZWR9IGFuIGFycmF5IG9mIG1lc3NhZ2VzIG9yIG1lc3NhZ2UgYXJyYXlzXG4gICAgKi9cblxuICB9LCB7XG4gICAga2V5OiBcInJlc2V0XCIsXG5cbiAgICAvKipcbiAgICAqIFJldHVybnMgdGhlIGhpc3RvcnkgdG8gdGhlIGZpcnN0IHZhbHVlIHNldCwgc2V0cyB0aGUgZmlyc3QgbG9nIGVudHJ5IGFzIHRoZSBlbnRpcmUgbG9nIGFuZCBhZGRzIGEgXCJyZXNldFwiIG1lc3NhZ2VcbiAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzdW0gb2YgdGhlIGhpc3RvcmljYWwgY2hhbmdlcyAodGhlIGluaXRpYWwgdmFsdWUpIFxuICAgICovXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgX2dldChMb2dnaW5nQ291bnQucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTG9nZ2luZ0NvdW50LnByb3RvdHlwZSksIFwicmVzZXRcIiwgdGhpcykuY2FsbCh0aGlzKTtcblxuICAgICAgdmFyIGluaXRpYWwgPSBoaXN0b3JpZXModGhpcylbMF07XG4gICAgICB2YXIgbCA9IGxvZ2xpbmVzKHRoaXMpO1xuICAgICAgdmFyIGZpcnN0ID0gQXJyYXkuZnJvbShsKTtcbiAgICAgIGZpcnN0LnB1c2goJ3Jlc2V0IHRvICcgKyBpbml0aWFsKTtcbiAgICAgIGwuc3BsaWNlKDAsIGwubGVuZ3RoKTtcbiAgICAgIGwucHVzaChmaXJzdCk7XG4gICAgICByZXR1cm4gdGhpcy5nZXQoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZXhwbGFpblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBleHBsYWluKCkge1xuICAgICAgdmFyIGV4cGxhaW5lZCA9IGV4cGxhbmF0aW9uKGxvZ2xpbmVzKHRoaXMpLCBoaXN0b3JpZXModGhpcykpO1xuXG4gICAgICBpZiAoL1RoZW4gdGhlIHZhbHVlIGVxdWFscyBcXGQvLnRlc3QoZXhwbGFpbmVkKSkge1xuICAgICAgICByZXR1cm4gZXhwbGFpbmVkO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG90YWwgPSB0aGlzLmdldCgpO1xuICAgICAgdmFyIHNwYWNlID0gZXhwbGFpbmVkLnNwbGl0KCdcXG4nKS5wb3AoKS5yZXBsYWNlKC9eKFxccyspLisvLCBcIiQxXCIpO1xuICAgICAgcmV0dXJuIGV4cGxhaW5lZCArIFwiXFxuXCIuY29uY2F0KHNwYWNlLCBcIlRoZW4gdGhlIHZhbHVlIGVxdWFscyBcIikuY29uY2F0KHRvdGFsKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9nXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShsb2dsaW5lcyh0aGlzKSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIExvZ2dpbmdDb3VudDtcbn0oU3RyaWN0Q291bnQpO1xuLyoqXG4gKiBJbmRleCBNYXBcbiAqIEBjb25zdCBpbmRleE1hcFxuICovXG5cblxudmFyIGluZGV4TWFwID0gbmV3IE1hcCgpO1xudmFyIGluZGV4TGlua3MgPSBuZXcgTWFwKCk7XG52YXIgdmlydE1hcCA9IG5ldyBNYXAoKTtcblxudmFyIENvdW50SW5kZXggPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBfY3JlYXRlQ2xhc3MoQ291bnRJbmRleCwgbnVsbCwgW3tcbiAgICBrZXk6IFwiY2xlYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICBpbmRleE1hcC5jbGVhcigpO1xuICAgICAgaW5kZXhMaW5rcy5jbGVhcigpO1xuICAgICAgdmlydE1hcC5jbGVhcigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsZWFySW5kZXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2xlYXJJbmRleChuYW1lKSB7XG4gICAgICBpbmRleE1hcC5kZWxldGUobmFtZSk7XG4gICAgICBpbmRleExpbmtzLmRlbGV0ZShuYW1lKTtcbiAgICAgIHZpcnRNYXAuZGVsZXRlKG5hbWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZUluZGV4XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZUluZGV4KG5hbWUpIHtcbiAgICAgIGlmICghdGhpcy5tYXAuaGFzKG5hbWUpKSB7XG4gICAgICAgIHZhciBpZE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWRNYXAuc2V0KCdpZHMnLCBuZXcgTWFwKCkpO1xuICAgICAgICB0aGlzLm1hcC5zZXQobmFtZSwgaWRNYXApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IENvdW50SW5kZXgobmFtZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNyZWF0ZVZpcnR1YWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlVmlydHVhbChuYW1lLCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5tYXAuaGFzKG5hbWUpKSB7XG4gICAgICAgIHZhciBpZE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWRNYXAuc2V0KCdpZHMnLCBuZXcgTWFwKCkpO1xuICAgICAgICB0aGlzLm1hcC5zZXQobmFtZSwgaWRNYXApO1xuICAgICAgfVxuXG4gICAgICB2aXJ0TWFwLnNldChuYW1lLCBkZWZhdWx0VmFsdWUpO1xuICAgICAgcmV0dXJuIG5ldyBDb3VudEluZGV4KG5hbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbmRleFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbmRleChuYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG5hbWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJleGlzdHNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZXhpc3RzKG5hbWUpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcC5oYXMobmFtZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldElkc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJZHMobmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmV4aXN0cyhuYW1lKSkgcmV0dXJuIFtdO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5pbmRleChuYW1lKS5nZXQoJ2lkcycpLmtleXMoKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldENvdW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDb3VudHMobmFtZSkge1xuICAgICAgaWYgKCF0aGlzLmV4aXN0cyhuYW1lKSkgcmV0dXJuIFtdO1xuICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5pbmRleChuYW1lKS5nZXQoJ2lkcycpLnZhbHVlcygpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0VG90YWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VG90YWwobmFtZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q291bnRzKG5hbWUpLnJlZHVjZShmdW5jdGlvbiAodCwgYykge1xuICAgICAgICByZXR1cm4gdCArIGM7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaGFzQ291bnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFzQ291bnQobmFtZSwgaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcC5oYXMobmFtZSkgJiYgdGhpcy5pbmRleChuYW1lKS5oYXMoJ2lkcycpICYmIHRoaXMuaW5kZXgobmFtZSkuZ2V0KCdpZHMnKS5oYXMoaWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRDb3VudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRDb3VudChuYW1lLCBpZCkge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5oYXNDb3VudChuYW1lLCBpZCkpIHtcbiAgICAgICAgaWYgKHZpcnRNYXAuaGFzKG5hbWUpKSByZXR1cm4gdmlydE1hcC5nZXQobmFtZSk7XG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignTm8gaW5kZXggZm9yIFwiIycgKyBpZCArICdcIiBAIFwiJyArIG5hbWUgKyAnXCIuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb3VudCA9IHRoaXMubWFwLmdldChuYW1lKS5nZXQoJ2lkcycpLmdldChpZCk7XG5cbiAgICAgIGlmICghaW5kZXhMaW5rcy5oYXMobmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgICAgfVxuXG4gICAgICB2YXIgbGlua3MgPSBBcnJheS5mcm9tKGluZGV4TGlua3MuZ2V0KG5hbWUpLnZhbHVlcygpKTtcbiAgICAgIHJldHVybiBsaW5rcy5yZWR1Y2UoZnVuY3Rpb24gKHQsIGwpIHtcbiAgICAgICAgcmV0dXJuIHQgLSBfdGhpczMuZ2V0Q291bnQobCwgaWQpO1xuICAgICAgfSwgY291bnQpOyAvLyBjb25zb2xlLmxvZygnbG5rJywgbGlua05hbWUpXG4gICAgICAvLyB2YXIgbGlua0NvdW50ID0gdGhpcy5nZXRDb3VudChsaW5rTmFtZSwgaWQgKTtcbiAgICAgIC8vIHJldHVybiBjb3VudCAtIGxpbmtDb3VudDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0Q291bnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Q291bnQobmFtZSwgaWQsIHZhbHVlKSB7XG4gICAgICBpZiAodGhpcy5oYXNDb3VudChuYW1lLCBpZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdJbml0aWFsIENvdW50IGNhbiBvbmx5IG1lIHNldCBvbmNlIGZvciBcIiMnICsgaWQgKyAnXCIgQCBcIicgKyBuYW1lICsgJ1wiLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChuYW1lKS5nZXQoJ2lkcycpLnNldChpZCwgbmV3IExvZ2dpbmdDb3VudCh2YWx1ZSkpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbmNyQ291bnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5jckNvdW50KG5hbWUsIGlkLCBuKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzQ291bnQobmFtZSwgaWQpKSB7XG4gICAgICAgIGlmICh2aXJ0TWFwLmhhcyhuYW1lKSkge1xuICAgICAgICAgIHRoaXMuc2V0Q291bnQobmFtZSwgaWQsIHZpcnRNYXAuZ2V0KG5hbWUpKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbmNyQ291bnQobmFtZSwgaWQsIG4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdObyBjb3VudCBmb3IgaWQgXCInICsgaWQgKyAnXCIuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG5hbWUpLmdldCgnaWRzJykuZ2V0KGlkKS5pbmNyKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJkZWNyQ291bnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVjckNvdW50KG5hbWUsIGlkLCBuKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzQ291bnQobmFtZSwgaWQpKSB7XG4gICAgICAgIGlmICh2aXJ0TWFwLmhhcyhuYW1lKSkge1xuICAgICAgICAgIHRoaXMuc2V0Q291bnQobmFtZSwgaWQsIHZpcnRNYXAuZ2V0KG5hbWUpKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kZWNyQ291bnQobmFtZSwgaWQsIG4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdObyBjb3VudCBmb3IgaWQgXCInICsgaWQgKyAnXCIuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG5hbWUpLmdldCgnaWRzJykuZ2V0KGlkKS5kZWNyKG4pO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNldENvdW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0Q291bnQobmFtZSwgaWQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNDb3VudChuYW1lLCBpZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7IC8vIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignTm8gY291bnQgZm9yIGlkIFwiJytpZCsnXCIuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG5hbWUpLmdldCgnaWRzJykuZ2V0KGlkKS5yZXNldCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRIaXN0b3J5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEhpc3RvcnkobmFtZSwgaWQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNDb3VudChuYW1lLCBpZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdObyBoaXN0b3J5IGZvciBpZCBcIicgKyBpZCArICdcIi4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcC5nZXQobmFtZSkuZ2V0KCdpZHMnKS5nZXQoaWQpLmhpc3Rvcnk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldExvZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRMb2cobmFtZSwgaWQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNDb3VudChuYW1lLCBpZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdObyBsb2cgZm9yIGlkIFwiJyArIGlkICsgJ1wiLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChuYW1lKS5nZXQoJ2lkcycpLmdldChpZCkubG9nO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJleHBsYWluXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGV4cGxhaW4obmFtZSwgaWQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNDb3VudChuYW1lLCBpZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdObyBleHBsYW5hdGlvbiBmb3IgaWQgXCInICsgaWQgKyAnXCIuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5tYXAuZ2V0KG5hbWUpLmdldCgnaWRzJykuZ2V0KGlkKS5leHBsYWluKCkucmVwbGFjZSgnU2NlbmFyaW86IEV4cGxhaW4gYSBDb3VudCcsIFwiU2NlbmFyaW86IEV4cGxhaW4gXCIgKyBuYW1lICsgXCIgZm9yIHRoZSBpZCBcIiArIGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibGlua1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsaW5rKGEsIGIpIHtcbiAgICAgIGlmICghaW5kZXhMaW5rcy5oYXMoYSkpIHtcbiAgICAgICAgaW5kZXhMaW5rcy5zZXQoYSwgbmV3IFNldCgpKTtcbiAgICAgIH1cblxuICAgICAgaW5kZXhMaW5rcy5nZXQoYSkuYWRkKGIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm1hcFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIGluZGV4TWFwO1xuICAgIH1cbiAgfV0pO1xuXG4gIGZ1bmN0aW9uIENvdW50SW5kZXgobmFtZSkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb3VudEluZGV4KTtcblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ291bnRJbmRleCwgW3tcbiAgICBrZXk6IFwic2V0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldChpZCwgaW5pdGlhbENvdW50KSB7XG4gICAgICByZXR1cm4gQ291bnRJbmRleC5zZXRDb3VudCh0aGlzLm5hbWUsIGlkLCBpbml0aWFsQ291bnQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJnZXRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0KGlkKSB7XG4gICAgICByZXR1cm4gQ291bnRJbmRleC5nZXRDb3VudCh0aGlzLm5hbWUsIGlkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaW5jclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbmNyKGlkLCBuKSB7XG4gICAgICByZXR1cm4gQ291bnRJbmRleC5pbmNyQ291bnQodGhpcy5uYW1lLCBpZCwgbik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRlY3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVjcihpZCwgbikge1xuICAgICAgcmV0dXJuIENvdW50SW5kZXguZGVjckNvdW50KHRoaXMubmFtZSwgaWQsIG4pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoaXN0b3J5XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpc3RvcnkoaWQpIHtcbiAgICAgIHJldHVybiBDb3VudEluZGV4LmdldEhpc3RvcnkodGhpcy5uYW1lLCBpZCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImxvZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsb2coaWQpIHtcbiAgICAgIHJldHVybiBDb3VudEluZGV4LmdldExvZyh0aGlzLm5hbWUsIGlkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZXhwbGFpblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBleHBsYWluKGlkKSB7XG4gICAgICByZXR1cm4gQ291bnRJbmRleC5leHBsYWluKHRoaXMubmFtZSwgaWQpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsaW5rXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxpbmsobmFtZSkge1xuICAgICAgQ291bnRJbmRleC5saW5rKHRoaXMubmFtZSwgbmFtZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaWRzXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gQ291bnRJbmRleC5nZXRJZHModGhpcy5uYW1lKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiY291bnRzXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gQ291bnRJbmRleC5nZXRDb3VudHModGhpcy5uYW1lKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ291bnRJbmRleDtcbn0oKTtcblxudmFyIFZpcnR1YWxJbmRleCA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoX0NvdW50SW5kZXgpIHtcbiAgX2luaGVyaXRzKFZpcnR1YWxJbmRleCwgX0NvdW50SW5kZXgpO1xuXG4gIGZ1bmN0aW9uIFZpcnR1YWxJbmRleChuYW1lKSB7XG4gICAgdmFyIF90aGlzNDtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBWaXJ0dWFsSW5kZXgpO1xuXG4gICAgX3RoaXM0ID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKFZpcnR1YWxJbmRleC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFZpcnR1YWxJbmRleCkpLmNhbGwodGhpcywgbmFtZSkpO1xuICAgIF90aGlzNC52aXJ0dWFsID0gdHJ1ZTtcbiAgICByZXR1cm4gX3RoaXM0O1xuICB9XG5cbiAgcmV0dXJuIFZpcnR1YWxJbmRleDtcbn0oQ291bnRJbmRleCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDb3VudEluZGV4OiBDb3VudEluZGV4LFxuICBDb3VudDogQmFzZUNvdW50LFxuICBTdHJpY3RDb3VudDogU3RyaWN0Q291bnQsXG4gIExvZ2dpbmdDb3VudDogTG9nZ2luZ0NvdW50XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21waWxlZC5qcy5tYXAiXX0=
