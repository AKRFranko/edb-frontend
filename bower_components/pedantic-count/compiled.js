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

//# sourceMappingURL=compiled.js.map