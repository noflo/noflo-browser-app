/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var fbpGraph, ports;

  fbpGraph = __webpack_require__(8);

  exports.graph = fbpGraph.graph;

  exports.Graph = fbpGraph.Graph;

  exports.journal = fbpGraph.journal;

  exports.Journal = fbpGraph.Journal;

  exports.Network = __webpack_require__(15).Network;

  exports.isBrowser = __webpack_require__(5).isBrowser;

  exports.ComponentLoader = __webpack_require__(10).ComponentLoader;

  exports.Component = __webpack_require__(18).Component;

  exports.AsyncComponent = __webpack_require__(89).AsyncComponent;

  exports.helpers = __webpack_require__(90);

  exports.streams = __webpack_require__(12);

  ports = __webpack_require__(19);

  exports.InPorts = ports.InPorts;

  exports.OutPorts = ports.OutPorts;

  exports.InPort = __webpack_require__(20);

  exports.OutPort = __webpack_require__(22);

  exports.Port = __webpack_require__(11).Port;

  exports.ArrayPort = __webpack_require__(91).ArrayPort;

  exports.internalSocket = __webpack_require__(7);

  exports.IP = __webpack_require__(4);

  exports.createNetwork = function(graph, callback, options) {
    var network, networkReady;
    if (typeof options !== 'object') {
      options = {
        delay: options
      };
    }
    if (typeof callback !== 'function') {
      callback = function(err) {
        if (err) {
          throw err;
        }
      };
    }
    network = new exports.Network(graph, options);
    networkReady = function(network) {
      return network.start(function(err) {
        if (err) {
          return callback(err);
        }
        return callback(null, network);
      });
    };
    network.loader.listComponents(function(err) {
      if (err) {
        return callback(err);
      }
      if (graph.nodes.length === 0) {
        return networkReady(network);
      }
      if (options.delay) {
        callback(null, network);
        return;
      }
      return network.connect(function(err) {
        if (err) {
          return callback(err);
        }
        return networkReady(network);
      });
    });
    return network;
  };

  exports.loadFile = function(file, options, callback) {
    var baseDir;
    if (!callback) {
      callback = options;
      baseDir = null;
    }
    if (callback && typeof options !== 'object') {
      options = {
        baseDir: options
      };
    }
    return exports.graph.loadFile(file, function(err, net) {
      if (err) {
        return callback(err);
      }
      if (options.baseDir) {
        net.baseDir = options.baseDir;
      }
      return exports.createNetwork(net, callback, options);
    });
  };

  exports.saveFile = function(graph, file, callback) {
    return exports.graph.save(file, callback);
  };

  exports.asCallback = __webpack_require__(92).asCallback;

}).call(this);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(87);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

(function() {
  var IP;

  module.exports = IP = (function() {
    IP.types = ['data', 'openBracket', 'closeBracket'];

    IP.isIP = function(obj) {
      return obj && typeof obj === 'object' && obj._isIP === true;
    };

    function IP(type, data, options) {
      var key, val;
      this.type = type != null ? type : 'data';
      this.data = data != null ? data : null;
      if (options == null) {
        options = {};
      }
      this._isIP = true;
      this.scope = null;
      this.owner = null;
      this.clonable = false;
      this.index = null;
      this.schema = null;
      this.datatype = 'all';
      for (key in options) {
        val = options[key];
        this[key] = val;
      }
    }

    IP.prototype.clone = function() {
      var ip, key, val;
      ip = new IP(this.type);
      for (key in this) {
        val = this[key];
        if (['owner'].indexOf(key) !== -1) {
          continue;
        }
        if (val === null) {
          continue;
        }
        if (typeof val === 'object') {
          ip[key] = JSON.parse(JSON.stringify(val));
        } else {
          ip[key] = val;
        }
      }
      return ip;
    };

    IP.prototype.move = function(owner) {
      this.owner = owner;
    };

    IP.prototype.drop = function() {
      var key, results, val;
      results = [];
      for (key in this) {
        val = this[key];
        results.push(delete this[key]);
      }
      return results;
    };

    return IP;

  })();

}).call(this);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  exports.isBrowser = function() {
    if (typeof process !== 'undefined' && process.execPath && process.execPath.match(/node|iojs/)) {
      return false;
    }
    return true;
  };

  exports.deprecated = function(message) {
    if (exports.isBrowser()) {
      if (window.NOFLO_FATAL_DEPRECATED) {
        throw new Error(message);
      }
      console.warn(message);
      return;
    }
    if (process.env.NOFLO_FATAL_DEPRECATED) {
      throw new Error(message);
    }
    return console.warn(message);
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {



/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var EventEmitter, IP, InternalSocket,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = __webpack_require__(2).EventEmitter;

  IP = __webpack_require__(4);

  InternalSocket = (function(superClass) {
    extend(InternalSocket, superClass);

    InternalSocket.prototype.regularEmitEvent = function(event, data) {
      return this.emit(event, data);
    };

    InternalSocket.prototype.debugEmitEvent = function(event, data) {
      var error, error1;
      try {
        return this.emit(event, data);
      } catch (error1) {
        error = error1;
        if (error.id && error.metadata && error.error) {
          if (this.listeners('error').length === 0) {
            throw error.error;
          }
          this.emit('error', error);
          return;
        }
        if (this.listeners('error').length === 0) {
          throw error;
        }
        return this.emit('error', {
          id: this.to.process.id,
          error: error,
          metadata: this.metadata
        });
      }
    };

    function InternalSocket(metadata) {
      this.metadata = metadata != null ? metadata : {};
      this.brackets = [];
      this.connected = false;
      this.dataDelegate = null;
      this.debug = false;
      this.emitEvent = this.regularEmitEvent;
    }

    InternalSocket.prototype.connect = function() {
      if (this.connected) {
        return;
      }
      this.connected = true;
      return this.emitEvent('connect', null);
    };

    InternalSocket.prototype.disconnect = function() {
      if (!this.connected) {
        return;
      }
      this.connected = false;
      return this.emitEvent('disconnect', null);
    };

    InternalSocket.prototype.isConnected = function() {
      return this.connected;
    };

    InternalSocket.prototype.send = function(data) {
      if (data === void 0 && typeof this.dataDelegate === 'function') {
        data = this.dataDelegate();
      }
      return this.handleSocketEvent('data', data);
    };

    InternalSocket.prototype.post = function(ip, autoDisconnect) {
      if (autoDisconnect == null) {
        autoDisconnect = true;
      }
      if (ip === void 0 && typeof this.dataDelegate === 'function') {
        ip = this.dataDelegate();
      }
      if (!this.isConnected() && this.brackets.length === 0) {
        this.connect();
      }
      this.handleSocketEvent('ip', ip, false);
      if (autoDisconnect && this.isConnected() && this.brackets.length === 0) {
        return this.disconnect();
      }
    };

    InternalSocket.prototype.beginGroup = function(group) {
      return this.handleSocketEvent('begingroup', group);
    };

    InternalSocket.prototype.endGroup = function() {
      return this.handleSocketEvent('endgroup');
    };

    InternalSocket.prototype.setDataDelegate = function(delegate) {
      if (typeof delegate !== 'function') {
        throw Error('A data delegate must be a function.');
      }
      return this.dataDelegate = delegate;
    };

    InternalSocket.prototype.setDebug = function(active) {
      this.debug = active;
      return this.emitEvent = this.debug ? this.debugEmitEvent : this.regularEmitEvent;
    };

    InternalSocket.prototype.getId = function() {
      var fromStr, toStr;
      fromStr = function(from) {
        return from.process.id + "() " + (from.port.toUpperCase());
      };
      toStr = function(to) {
        return (to.port.toUpperCase()) + " " + to.process.id + "()";
      };
      if (!(this.from || this.to)) {
        return "UNDEFINED";
      }
      if (this.from && !this.to) {
        return (fromStr(this.from)) + " -> ANON";
      }
      if (!this.from) {
        return "DATA -> " + (toStr(this.to));
      }
      return (fromStr(this.from)) + " -> " + (toStr(this.to));
    };

    InternalSocket.prototype.legacyToIp = function(event, payload) {
      if (IP.isIP(payload)) {
        return payload;
      }
      switch (event) {
        case 'begingroup':
          return new IP('openBracket', payload);
        case 'endgroup':
          return new IP('closeBracket');
        case 'data':
          return new IP('data', payload);
        default:
          return null;
      }
    };

    InternalSocket.prototype.ipToLegacy = function(ip) {
      var legacy;
      switch (ip.type) {
        case 'openBracket':
          return legacy = {
            event: 'begingroup',
            payload: ip.data
          };
        case 'data':
          return legacy = {
            event: 'data',
            payload: ip.data
          };
        case 'closeBracket':
          return legacy = {
            event: 'endgroup',
            payload: ip.data
          };
      }
    };

    InternalSocket.prototype.handleSocketEvent = function(event, payload, autoConnect) {
      var ip, isIP, legacy;
      if (autoConnect == null) {
        autoConnect = true;
      }
      isIP = event === 'ip' && IP.isIP(payload);
      ip = isIP ? payload : this.legacyToIp(event, payload);
      if (!ip) {
        return;
      }
      if (!this.isConnected() && autoConnect && this.brackets.length === 0) {
        this.connect();
      }
      if (event === 'begingroup') {
        this.brackets.push(payload);
      }
      if (isIP && ip.type === 'openBracket') {
        this.brackets.push(ip.data);
      }
      if (event === 'endgroup') {
        if (this.brackets.length === 0) {
          return;
        }
        ip.data = this.brackets.pop();
        payload = ip.data;
      }
      if (isIP && payload.type === 'closeBracket') {
        if (this.brackets.length === 0) {
          return;
        }
        this.brackets.pop();
      }
      this.emitEvent('ip', ip);
      if (!(ip && ip.type)) {
        return;
      }
      if (isIP) {
        legacy = this.ipToLegacy(ip);
        event = legacy.event;
        payload = legacy.payload;
      }
      if (event === 'connect') {
        this.connected = true;
      }
      if (event === 'disconnect') {
        this.connected = false;
      }
      return this.emitEvent(event, payload);
    };

    return InternalSocket;

  })(EventEmitter);

  exports.InternalSocket = InternalSocket;

  exports.createSocket = function() {
    return new InternalSocket;
  };

}).call(this);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

exports.graph = __webpack_require__(27);
exports.Graph = exports.graph.Graph;

exports.journal = __webpack_require__(34);
exports.Journal = exports.journal.Journal;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var ComponentLoader, EventEmitter, fbpGraph, internalSocket, registerLoader,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  internalSocket = __webpack_require__(7);

  fbpGraph = __webpack_require__(8);

  EventEmitter = __webpack_require__(2).EventEmitter;

  registerLoader = __webpack_require__(35);

  ComponentLoader = (function(superClass) {
    extend(ComponentLoader, superClass);

    function ComponentLoader(baseDir, options) {
      this.baseDir = baseDir;
      this.options = options != null ? options : {};
      this.components = null;
      this.libraryIcons = {};
      this.processing = false;
      this.ready = false;
      if (typeof this.setMaxListeners === 'function') {
        this.setMaxListeners(0);
      }
    }

    ComponentLoader.prototype.getModulePrefix = function(name) {
      if (!name) {
        return '';
      }
      if (name === 'noflo') {
        return '';
      }
      if (name[0] === '@') {
        name = name.replace(/\@[a-z\-]+\//, '');
      }
      return name.replace('noflo-', '');
    };

    ComponentLoader.prototype.listComponents = function(callback) {
      if (this.processing) {
        this.once('ready', (function(_this) {
          return function() {
            return callback(null, _this.components);
          };
        })(this));
        return;
      }
      if (this.components) {
        return callback(null, this.components);
      }
      this.ready = false;
      this.processing = true;
      this.components = {};
      registerLoader.register(this, (function(_this) {
        return function(err) {
          if (err) {
            if (callback) {
              return callback(err);
            }
            throw err;
          }
          _this.processing = false;
          _this.ready = true;
          _this.emit('ready', true);
          if (callback) {
            return callback(null, _this.components);
          }
        };
      })(this));
    };

    ComponentLoader.prototype.load = function(name, callback, metadata) {
      var component, componentName;
      if (!this.ready) {
        this.listComponents((function(_this) {
          return function(err) {
            if (err) {
              return callback(err);
            }
            return _this.load(name, callback, metadata);
          };
        })(this));
        return;
      }
      component = this.components[name];
      if (!component) {
        for (componentName in this.components) {
          if (componentName.split('/')[1] === name) {
            component = this.components[componentName];
            break;
          }
        }
        if (!component) {
          callback(new Error("Component " + name + " not available with base " + this.baseDir));
          return;
        }
      }
      if (this.isGraph(component)) {
        if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
          process.nextTick((function(_this) {
            return function() {
              return _this.loadGraph(name, component, callback, metadata);
            };
          })(this));
        } else {
          setTimeout((function(_this) {
            return function() {
              return _this.loadGraph(name, component, callback, metadata);
            };
          })(this), 0);
        }
        return;
      }
      return this.createComponent(name, component, metadata, (function(_this) {
        return function(err, instance) {
          if (err) {
            return callback(err);
          }
          if (!instance) {
            callback(new Error("Component " + name + " could not be loaded."));
            return;
          }
          if (name === 'Graph') {
            instance.baseDir = _this.baseDir;
          }
          if (typeof name === 'string') {
            instance.componentName = name;
          }
          _this.setIcon(name, instance);
          return callback(null, instance);
        };
      })(this));
    };

    ComponentLoader.prototype.createComponent = function(name, component, metadata, callback) {
      var implementation, instance;
      implementation = component;
      if (!implementation) {
        return callback(new Error("Component " + name + " not available"));
      }
      if (typeof implementation === 'string') {
        if (typeof registerLoader.dynamicLoad === 'function') {
          registerLoader.dynamicLoad(name, implementation, metadata, callback);
          return;
        }
        return callback(Error("Dynamic loading of " + implementation + " for component " + name + " not available on this platform."));
      }
      if (typeof implementation.getComponent === 'function') {
        instance = implementation.getComponent(metadata);
      } else if (typeof implementation === 'function') {
        instance = implementation(metadata);
      } else {
        callback(new Error("Invalid type " + (typeof implementation) + " for component " + name + "."));
        return;
      }
      return callback(null, instance);
    };

    ComponentLoader.prototype.isGraph = function(cPath) {
      if (typeof cPath === 'object' && cPath instanceof fbpGraph.Graph) {
        return true;
      }
      if (typeof cPath === 'object' && cPath.processes && cPath.connections) {
        return true;
      }
      if (typeof cPath !== 'string') {
        return false;
      }
      return cPath.indexOf('.fbp') !== -1 || cPath.indexOf('.json') !== -1;
    };

    ComponentLoader.prototype.loadGraph = function(name, component, callback, metadata) {
      this.createComponent(name, this.components['Graph'], metadata, (function(_this) {
        return function(err, graph) {
          var graphSocket;
          if (err) {
            return callback(err);
          }
          graphSocket = internalSocket.createSocket();
          graph.loader = _this;
          graph.baseDir = _this.baseDir;
          graph.inPorts.remove('graph');
          graph.setGraph(component, function(err) {
            if (err) {
              return callback(err);
            }
            _this.setIcon(name, graph);
            return callback(null, graph);
          });
        };
      })(this));
    };

    ComponentLoader.prototype.setIcon = function(name, instance) {
      var componentName, library, ref;
      if (!instance.getIcon || instance.getIcon()) {
        return;
      }
      ref = name.split('/'), library = ref[0], componentName = ref[1];
      if (componentName && this.getLibraryIcon(library)) {
        instance.setIcon(this.getLibraryIcon(library));
        return;
      }
      if (instance.isSubgraph()) {
        instance.setIcon('sitemap');
        return;
      }
      instance.setIcon('square');
    };

    ComponentLoader.prototype.getLibraryIcon = function(prefix) {
      if (this.libraryIcons[prefix]) {
        return this.libraryIcons[prefix];
      }
      return null;
    };

    ComponentLoader.prototype.setLibraryIcon = function(prefix, icon) {
      return this.libraryIcons[prefix] = icon;
    };

    ComponentLoader.prototype.normalizeName = function(packageId, name) {
      var fullName, prefix;
      prefix = this.getModulePrefix(packageId);
      fullName = prefix + "/" + name;
      if (!packageId) {
        fullName = name;
      }
      return fullName;
    };

    ComponentLoader.prototype.registerComponent = function(packageId, name, cPath, callback) {
      var fullName;
      fullName = this.normalizeName(packageId, name);
      this.components[fullName] = cPath;
      if (callback) {
        return callback();
      }
    };

    ComponentLoader.prototype.registerGraph = function(packageId, name, gPath, callback) {
      return this.registerComponent(packageId, name, gPath, callback);
    };

    ComponentLoader.prototype.registerLoader = function(loader, callback) {
      return loader(this, callback);
    };

    ComponentLoader.prototype.setSource = function(packageId, name, source, language, callback) {
      if (!registerLoader.setSource) {
        return callback(new Error('setSource not allowed'));
      }
      if (!this.ready) {
        this.listComponents((function(_this) {
          return function(err) {
            if (err) {
              return callback(err);
            }
            return _this.setSource(packageId, name, source, language, callback);
          };
        })(this));
        return;
      }
      return registerLoader.setSource(this, packageId, name, source, language, callback);
    };

    ComponentLoader.prototype.getSource = function(name, callback) {
      if (!registerLoader.getSource) {
        return callback(new Error('getSource not allowed'));
      }
      if (!this.ready) {
        this.listComponents((function(_this) {
          return function(err) {
            if (err) {
              return callback(err);
            }
            return _this.getSource(name, callback);
          };
        })(this));
        return;
      }
      return registerLoader.getSource(this, name, callback);
    };

    ComponentLoader.prototype.clear = function() {
      this.components = null;
      this.ready = false;
      return this.processing = false;
    };

    return ComponentLoader;

  })(EventEmitter);

  exports.ComponentLoader = ComponentLoader;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var EventEmitter, Port, platform,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = __webpack_require__(2).EventEmitter;

  platform = __webpack_require__(5);

  Port = (function(superClass) {
    extend(Port, superClass);

    Port.prototype.description = '';

    Port.prototype.required = true;

    function Port(type) {
      this.type = type;
      platform.deprecated('noflo.Port is deprecated. Please port to noflo.InPort/noflo.OutPort');
      if (!this.type) {
        this.type = 'all';
      }
      if (this.type === 'integer') {
        this.type = 'int';
      }
      this.sockets = [];
      this.from = null;
      this.node = null;
      this.name = null;
    }

    Port.prototype.getId = function() {
      if (!(this.node && this.name)) {
        return 'Port';
      }
      return this.node + " " + (this.name.toUpperCase());
    };

    Port.prototype.getDataType = function() {
      return this.type;
    };

    Port.prototype.getSchema = function() {
      return null;
    };

    Port.prototype.getDescription = function() {
      return this.description;
    };

    Port.prototype.attach = function(socket) {
      this.sockets.push(socket);
      return this.attachSocket(socket);
    };

    Port.prototype.attachSocket = function(socket, localId) {
      if (localId == null) {
        localId = null;
      }
      this.emit("attach", socket, localId);
      this.from = socket.from;
      if (socket.setMaxListeners) {
        socket.setMaxListeners(0);
      }
      socket.on("connect", (function(_this) {
        return function() {
          return _this.emit("connect", socket, localId);
        };
      })(this));
      socket.on("begingroup", (function(_this) {
        return function(group) {
          return _this.emit("begingroup", group, localId);
        };
      })(this));
      socket.on("data", (function(_this) {
        return function(data) {
          return _this.emit("data", data, localId);
        };
      })(this));
      socket.on("endgroup", (function(_this) {
        return function(group) {
          return _this.emit("endgroup", group, localId);
        };
      })(this));
      return socket.on("disconnect", (function(_this) {
        return function() {
          return _this.emit("disconnect", socket, localId);
        };
      })(this));
    };

    Port.prototype.connect = function() {
      var i, len, ref, results, socket;
      if (this.sockets.length === 0) {
        throw new Error((this.getId()) + ": No connections available");
      }
      ref = this.sockets;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        socket = ref[i];
        results.push(socket.connect());
      }
      return results;
    };

    Port.prototype.beginGroup = function(group) {
      if (this.sockets.length === 0) {
        throw new Error((this.getId()) + ": No connections available");
      }
      return this.sockets.forEach(function(socket) {
        if (socket.isConnected()) {
          return socket.beginGroup(group);
        }
        socket.once('connect', function() {
          return socket.beginGroup(group);
        });
        return socket.connect();
      });
    };

    Port.prototype.send = function(data) {
      if (this.sockets.length === 0) {
        throw new Error((this.getId()) + ": No connections available");
      }
      return this.sockets.forEach(function(socket) {
        if (socket.isConnected()) {
          return socket.send(data);
        }
        socket.once('connect', function() {
          return socket.send(data);
        });
        return socket.connect();
      });
    };

    Port.prototype.endGroup = function() {
      var i, len, ref, results, socket;
      if (this.sockets.length === 0) {
        throw new Error((this.getId()) + ": No connections available");
      }
      ref = this.sockets;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        socket = ref[i];
        results.push(socket.endGroup());
      }
      return results;
    };

    Port.prototype.disconnect = function() {
      var i, len, ref, results, socket;
      if (this.sockets.length === 0) {
        throw new Error((this.getId()) + ": No connections available");
      }
      ref = this.sockets;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        socket = ref[i];
        results.push(socket.disconnect());
      }
      return results;
    };

    Port.prototype.detach = function(socket) {
      var index;
      if (this.sockets.length === 0) {
        return;
      }
      if (!socket) {
        socket = this.sockets[0];
      }
      index = this.sockets.indexOf(socket);
      if (index === -1) {
        return;
      }
      if (this.isAddressable()) {
        this.sockets[index] = void 0;
        this.emit('detach', socket, index);
        return;
      }
      this.sockets.splice(index, 1);
      return this.emit("detach", socket);
    };

    Port.prototype.isConnected = function() {
      var connected;
      connected = false;
      this.sockets.forEach(function(socket) {
        if (socket.isConnected()) {
          return connected = true;
        }
      });
      return connected;
    };

    Port.prototype.isAddressable = function() {
      return false;
    };

    Port.prototype.isRequired = function() {
      return this.required;
    };

    Port.prototype.isAttached = function() {
      if (this.sockets.length > 0) {
        return true;
      }
      return false;
    };

    Port.prototype.listAttached = function() {
      var attached, i, idx, len, ref, socket;
      attached = [];
      ref = this.sockets;
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        socket = ref[idx];
        if (!socket) {
          continue;
        }
        attached.push(idx);
      }
      return attached;
    };

    Port.prototype.canAttach = function() {
      return true;
    };

    Port.prototype.clear = function() {};

    return Port;

  })(EventEmitter);

  exports.Port = Port;

}).call(this);


/***/ }),
/* 12 */
/***/ (function(module, exports) {

(function() {
  var IP, StreamReceiver, StreamSender, Substream;

  IP = (function() {
    function IP(data1) {
      this.data = data1;
    }

    IP.prototype.sendTo = function(port) {
      return port.send(this.data);
    };

    IP.prototype.getValue = function() {
      return this.data;
    };

    IP.prototype.toObject = function() {
      return this.data;
    };

    return IP;

  })();

  exports.IP = IP;

  Substream = (function() {
    function Substream(key) {
      this.key = key;
      this.value = [];
    }

    Substream.prototype.push = function(value) {
      return this.value.push(value);
    };

    Substream.prototype.sendTo = function(port) {
      var i, ip, len, ref;
      port.beginGroup(this.key);
      ref = this.value;
      for (i = 0, len = ref.length; i < len; i++) {
        ip = ref[i];
        if (ip instanceof Substream || ip instanceof IP) {
          ip.sendTo(port);
        } else {
          port.send(ip);
        }
      }
      return port.endGroup(this.key);
    };

    Substream.prototype.getKey = function() {
      return this.key;
    };

    Substream.prototype.getValue = function() {
      var hasKeys, i, ip, len, obj, ref, res, val;
      switch (this.value.length) {
        case 0:
          return null;
        case 1:
          if (typeof this.value[0].getValue === 'function') {
            if (this.value[0] instanceof Substream) {
              obj = {};
              obj[this.value[0].key] = this.value[0].getValue();
              return obj;
            } else {
              return this.value[0].getValue();
            }
          } else {
            return this.value[0];
          }
          break;
        default:
          res = [];
          hasKeys = false;
          ref = this.value;
          for (i = 0, len = ref.length; i < len; i++) {
            ip = ref[i];
            val = typeof ip.getValue === 'function' ? ip.getValue() : ip;
            if (ip instanceof Substream) {
              obj = {};
              obj[ip.key] = ip.getValue();
              res.push(obj);
            } else {
              res.push(val);
            }
          }
          return res;
      }
    };

    Substream.prototype.toObject = function() {
      var obj;
      obj = {};
      obj[this.key] = this.getValue();
      return obj;
    };

    return Substream;

  })();

  exports.Substream = Substream;

  StreamSender = (function() {
    function StreamSender(port1, ordered) {
      this.port = port1;
      this.ordered = ordered != null ? ordered : false;
      this.q = [];
      this.resetCurrent();
      this.resolved = false;
    }

    StreamSender.prototype.resetCurrent = function() {
      this.level = 0;
      this.current = null;
      return this.stack = [];
    };

    StreamSender.prototype.beginGroup = function(group) {
      var stream;
      this.level++;
      stream = new Substream(group);
      this.stack.push(stream);
      this.current = stream;
      return this;
    };

    StreamSender.prototype.endGroup = function() {
      var parent, value;
      if (this.level > 0) {
        this.level--;
      }
      value = this.stack.pop();
      if (this.level === 0) {
        this.q.push(value);
        this.resetCurrent();
      } else {
        parent = this.stack[this.stack.length - 1];
        parent.push(value);
        this.current = parent;
      }
      return this;
    };

    StreamSender.prototype.send = function(data) {
      if (this.level === 0) {
        this.q.push(new IP(data));
      } else {
        this.current.push(new IP(data));
      }
      return this;
    };

    StreamSender.prototype.done = function() {
      if (this.ordered) {
        this.resolved = true;
      } else {
        this.flush();
      }
      return this;
    };

    StreamSender.prototype.disconnect = function() {
      this.q.push(null);
      return this;
    };

    StreamSender.prototype.flush = function() {
      var i, ip, len, ref, res;
      res = false;
      if (this.q.length > 0) {
        ref = this.q;
        for (i = 0, len = ref.length; i < len; i++) {
          ip = ref[i];
          if (ip === null) {
            if (this.port.isConnected()) {
              this.port.disconnect();
            }
          } else {
            ip.sendTo(this.port);
          }
        }
        res = true;
      }
      this.q = [];
      return res;
    };

    StreamSender.prototype.isAttached = function() {
      return this.port.isAttached();
    };

    return StreamSender;

  })();

  exports.StreamSender = StreamSender;

  StreamReceiver = (function() {
    function StreamReceiver(port1, buffered, process) {
      this.port = port1;
      this.buffered = buffered != null ? buffered : false;
      this.process = process != null ? process : null;
      this.q = [];
      this.resetCurrent();
      this.port.process = (function(_this) {
        return function(event, payload, index) {
          var stream;
          switch (event) {
            case 'connect':
              if (typeof _this.process === 'function') {
                return _this.process('connect', index);
              }
              break;
            case 'begingroup':
              _this.level++;
              stream = new Substream(payload);
              if (_this.level === 1) {
                _this.root = stream;
                _this.parent = null;
              } else {
                _this.parent = _this.current;
              }
              return _this.current = stream;
            case 'endgroup':
              if (_this.level > 0) {
                _this.level--;
              }
              if (_this.level === 0) {
                if (_this.buffered) {
                  _this.q.push(_this.root);
                  _this.process('readable', index);
                } else {
                  if (typeof _this.process === 'function') {
                    _this.process('data', _this.root, index);
                  }
                }
                return _this.resetCurrent();
              } else {
                _this.parent.push(_this.current);
                return _this.current = _this.parent;
              }
              break;
            case 'data':
              if (_this.level === 0) {
                return _this.q.push(new IP(payload));
              } else {
                return _this.current.push(new IP(payload));
              }
              break;
            case 'disconnect':
              if (typeof _this.process === 'function') {
                return _this.process('disconnect', index);
              }
          }
        };
      })(this);
    }

    StreamReceiver.prototype.resetCurrent = function() {
      this.level = 0;
      this.root = null;
      this.current = null;
      return this.parent = null;
    };

    StreamReceiver.prototype.read = function() {
      if (this.q.length === 0) {
        return void 0;
      }
      return this.q.shift();
    };

    return StreamReceiver;

  })();

  exports.StreamReceiver = StreamReceiver;

}).call(this);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {var clone = (function() {
'use strict';

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14).Buffer))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(28)
var ieee754 = __webpack_require__(29)
var isArray = __webpack_require__(30)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var EventEmitter, IP, Network, componentLoader, graph, internalSocket, platform, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  internalSocket = __webpack_require__(7);

  graph = __webpack_require__(8);

  EventEmitter = __webpack_require__(2).EventEmitter;

  platform = __webpack_require__(5);

  componentLoader = __webpack_require__(10);

  utils = __webpack_require__(17);

  IP = __webpack_require__(4);

  Network = (function(superClass) {
    extend(Network, superClass);

    Network.prototype.processes = {};

    Network.prototype.connections = [];

    Network.prototype.initials = [];

    Network.prototype.defaults = [];

    Network.prototype.graph = null;

    Network.prototype.startupDate = null;

    function Network(graph, options) {
      this.options = options != null ? options : {};
      this.processes = {};
      this.connections = [];
      this.initials = [];
      this.nextInitials = [];
      this.defaults = [];
      this.graph = graph;
      this.started = false;
      this.stopped = true;
      this.debug = true;
      this.eventBuffer = [];
      if (!platform.isBrowser()) {
        this.baseDir = graph.baseDir || process.cwd();
      } else {
        this.baseDir = graph.baseDir || '/';
      }
      this.startupDate = null;
      if (graph.componentLoader) {
        this.loader = graph.componentLoader;
      } else {
        this.loader = new componentLoader.ComponentLoader(this.baseDir, this.options);
      }
    }

    Network.prototype.uptime = function() {
      if (!this.startupDate) {
        return 0;
      }
      return new Date() - this.startupDate;
    };

    Network.prototype.getActiveProcesses = function() {
      var active, name, process, ref;
      active = [];
      if (!this.started) {
        return active;
      }
      ref = this.processes;
      for (name in ref) {
        process = ref[name];
        if (process.component.load > 0) {
          active.push(name);
        }
        if (process.component.__openConnections > 0) {
          active.push(name);
        }
      }
      return active;
    };

    Network.prototype.bufferedEmit = function(event, payload) {
      var ev, i, len, ref;
      if (event === 'error' || event === 'process-error' || event === 'end') {
        this.emit(event, payload);
        return;
      }
      if (!this.isStarted() && event !== 'end') {
        this.eventBuffer.push({
          type: event,
          payload: payload
        });
        return;
      }
      this.emit(event, payload);
      if (event === 'start') {
        ref = this.eventBuffer;
        for (i = 0, len = ref.length; i < len; i++) {
          ev = ref[i];
          this.emit(ev.type, ev.payload);
        }
        return this.eventBuffer = [];
      }
    };

    Network.prototype.load = function(component, metadata, callback) {
      return this.loader.load(component, callback, metadata);
    };

    Network.prototype.addNode = function(node, callback) {
      var process;
      if (this.processes[node.id]) {
        callback(null, this.processes[node.id]);
        return;
      }
      process = {
        id: node.id
      };
      if (!node.component) {
        this.processes[process.id] = process;
        callback(null, process);
        return;
      }
      return this.load(node.component, node.metadata, (function(_this) {
        return function(err, instance) {
          var inPorts, name, outPorts, port;
          if (err) {
            return callback(err);
          }
          instance.nodeId = node.id;
          process.component = instance;
          process.componentName = node.component;
          inPorts = process.component.inPorts.ports || process.component.inPorts;
          outPorts = process.component.outPorts.ports || process.component.outPorts;
          for (name in inPorts) {
            port = inPorts[name];
            port.node = node.id;
            port.nodeInstance = instance;
            port.name = name;
          }
          for (name in outPorts) {
            port = outPorts[name];
            port.node = node.id;
            port.nodeInstance = instance;
            port.name = name;
          }
          if (instance.isSubgraph()) {
            _this.subscribeSubgraph(process);
          }
          _this.subscribeNode(process);
          _this.processes[process.id] = process;
          return callback(null, process);
        };
      })(this));
    };

    Network.prototype.removeNode = function(node, callback) {
      if (!this.processes[node.id]) {
        return callback(new Error("Node " + node.id + " not found"));
      }
      return this.processes[node.id].component.shutdown((function(_this) {
        return function(err) {
          if (err) {
            return callback(err);
          }
          delete _this.processes[node.id];
          return callback(null);
        };
      })(this));
    };

    Network.prototype.renameNode = function(oldId, newId, callback) {
      var inPorts, name, outPorts, port, process;
      process = this.getNode(oldId);
      if (!process) {
        return callback(new Error("Process " + oldId + " not found"));
      }
      process.id = newId;
      inPorts = process.component.inPorts.ports || process.component.inPorts;
      outPorts = process.component.outPorts.ports || process.component.outPorts;
      for (name in inPorts) {
        port = inPorts[name];
        if (!port) {
          continue;
        }
        port.node = newId;
      }
      for (name in outPorts) {
        port = outPorts[name];
        if (!port) {
          continue;
        }
        port.node = newId;
      }
      this.processes[newId] = process;
      delete this.processes[oldId];
      return callback(null);
    };

    Network.prototype.getNode = function(id) {
      return this.processes[id];
    };

    Network.prototype.connect = function(done) {
      var callStack, edges, initializers, nodes, serialize, setDefaults, subscribeGraph;
      if (done == null) {
        done = function() {};
      }
      callStack = 0;
      serialize = (function(_this) {
        return function(next, add) {
          return function(type) {
            return _this["add" + type](add, function(err) {
              if (err) {
                return done(err);
              }
              callStack++;
              if (callStack % 100 === 0) {
                setTimeout(function() {
                  return next(type);
                }, 0);
                return;
              }
              return next(type);
            });
          };
        };
      })(this);
      subscribeGraph = (function(_this) {
        return function() {
          _this.subscribeGraph();
          return done();
        };
      })(this);
      setDefaults = utils.reduceRight(this.graph.nodes, serialize, subscribeGraph);
      initializers = utils.reduceRight(this.graph.initializers, serialize, function() {
        return setDefaults("Defaults");
      });
      edges = utils.reduceRight(this.graph.edges, serialize, function() {
        return initializers("Initial");
      });
      nodes = utils.reduceRight(this.graph.nodes, serialize, function() {
        return edges("Edge");
      });
      return nodes("Node");
    };

    Network.prototype.connectPort = function(socket, process, port, index, inbound, callback) {
      if (inbound) {
        socket.to = {
          process: process,
          port: port,
          index: index
        };
        if (!(process.component.inPorts && process.component.inPorts[port])) {
          callback(new Error("No inport '" + port + "' defined in process " + process.id + " (" + (socket.getId()) + ")"));
          return;
        }
        if (process.component.inPorts[port].isAddressable()) {
          process.component.inPorts[port].attach(socket, index);
          callback();
          return;
        }
        process.component.inPorts[port].attach(socket);
        callback();
        return;
      }
      socket.from = {
        process: process,
        port: port,
        index: index
      };
      if (!(process.component.outPorts && process.component.outPorts[port])) {
        callback(new Error("No outport '" + port + "' defined in process " + process.id + " (" + (socket.getId()) + ")"));
        return;
      }
      if (process.component.outPorts[port].isAddressable()) {
        process.component.outPorts[port].attach(socket, index);
        callback();
        return;
      }
      process.component.outPorts[port].attach(socket);
      callback();
    };

    Network.prototype.subscribeGraph = function() {
      var graphOps, processOps, processing, registerOp;
      graphOps = [];
      processing = false;
      registerOp = function(op, details) {
        return graphOps.push({
          op: op,
          details: details
        });
      };
      processOps = (function(_this) {
        return function(err) {
          var cb, op;
          if (err) {
            if (_this.listeners('process-error').length === 0) {
              throw err;
            }
            _this.bufferedEmit('process-error', err);
          }
          if (!graphOps.length) {
            processing = false;
            return;
          }
          processing = true;
          op = graphOps.shift();
          cb = processOps;
          switch (op.op) {
            case 'renameNode':
              return _this.renameNode(op.details.from, op.details.to, cb);
            default:
              return _this[op.op](op.details, cb);
          }
        };
      })(this);
      this.graph.on('addNode', function(node) {
        registerOp('addNode', node);
        if (!processing) {
          return processOps();
        }
      });
      this.graph.on('removeNode', function(node) {
        registerOp('removeNode', node);
        if (!processing) {
          return processOps();
        }
      });
      this.graph.on('renameNode', function(oldId, newId) {
        registerOp('renameNode', {
          from: oldId,
          to: newId
        });
        if (!processing) {
          return processOps();
        }
      });
      this.graph.on('addEdge', function(edge) {
        registerOp('addEdge', edge);
        if (!processing) {
          return processOps();
        }
      });
      this.graph.on('removeEdge', function(edge) {
        registerOp('removeEdge', edge);
        if (!processing) {
          return processOps();
        }
      });
      this.graph.on('addInitial', function(iip) {
        registerOp('addInitial', iip);
        if (!processing) {
          return processOps();
        }
      });
      return this.graph.on('removeInitial', function(iip) {
        registerOp('removeInitial', iip);
        if (!processing) {
          return processOps();
        }
      });
    };

    Network.prototype.subscribeSubgraph = function(node) {
      var emitSub;
      if (!node.component.isReady()) {
        node.component.once('ready', (function(_this) {
          return function() {
            return _this.subscribeSubgraph(node);
          };
        })(this));
        return;
      }
      if (!node.component.network) {
        return;
      }
      node.component.network.setDebug(this.debug);
      emitSub = (function(_this) {
        return function(type, data) {
          if (type === 'process-error' && _this.listeners('process-error').length === 0) {
            if (data.id && data.metadata && data.error) {
              throw data.error;
            }
            throw data;
          }
          if (!data) {
            data = {};
          }
          if (data.subgraph) {
            if (!data.subgraph.unshift) {
              data.subgraph = [data.subgraph];
            }
            data.subgraph = data.subgraph.unshift(node.id);
          } else {
            data.subgraph = [node.id];
          }
          return _this.bufferedEmit(type, data);
        };
      })(this);
      node.component.network.on('connect', function(data) {
        return emitSub('connect', data);
      });
      node.component.network.on('begingroup', function(data) {
        return emitSub('begingroup', data);
      });
      node.component.network.on('data', function(data) {
        return emitSub('data', data);
      });
      node.component.network.on('endgroup', function(data) {
        return emitSub('endgroup', data);
      });
      node.component.network.on('disconnect', function(data) {
        return emitSub('disconnect', data);
      });
      node.component.network.on('ip', function(data) {
        return emitSub('ip', data);
      });
      return node.component.network.on('process-error', function(data) {
        return emitSub('process-error', data);
      });
    };

    Network.prototype.subscribeSocket = function(socket, source) {
      socket.on('ip', (function(_this) {
        return function(ip) {
          return _this.bufferedEmit('ip', {
            id: socket.getId(),
            type: ip.type,
            socket: socket,
            data: ip.data,
            metadata: socket.metadata
          });
        };
      })(this));
      socket.on('connect', (function(_this) {
        return function() {
          if (source && source.component.isLegacy()) {
            if (!source.component.__openConnections) {
              source.component.__openConnections = 0;
            }
            source.component.__openConnections++;
          }
          return _this.bufferedEmit('connect', {
            id: socket.getId(),
            socket: socket,
            metadata: socket.metadata
          });
        };
      })(this));
      socket.on('begingroup', (function(_this) {
        return function(group) {
          return _this.bufferedEmit('begingroup', {
            id: socket.getId(),
            socket: socket,
            group: group,
            metadata: socket.metadata
          });
        };
      })(this));
      socket.on('data', (function(_this) {
        return function(data) {
          return _this.bufferedEmit('data', {
            id: socket.getId(),
            socket: socket,
            data: data,
            metadata: socket.metadata
          });
        };
      })(this));
      socket.on('endgroup', (function(_this) {
        return function(group) {
          return _this.bufferedEmit('endgroup', {
            id: socket.getId(),
            socket: socket,
            group: group,
            metadata: socket.metadata
          });
        };
      })(this));
      socket.on('disconnect', (function(_this) {
        return function() {
          _this.bufferedEmit('disconnect', {
            id: socket.getId(),
            socket: socket,
            metadata: socket.metadata
          });
          if (source && source.component.isLegacy()) {
            source.component.__openConnections--;
            if (source.component.__openConnections < 0) {
              source.component.__openConnections = 0;
            }
            if (source.component.__openConnections === 0) {
              return _this.checkIfFinished();
            }
          }
        };
      })(this));
      return socket.on('error', (function(_this) {
        return function(event) {
          if (_this.listeners('process-error').length === 0) {
            if (event.id && event.metadata && event.error) {
              throw event.error;
            }
            throw event;
          }
          return _this.bufferedEmit('process-error', event);
        };
      })(this));
    };

    Network.prototype.subscribeNode = function(node) {
      node.component.on('deactivate', (function(_this) {
        return function(load) {
          if (load > 0) {
            return;
          }
          return _this.checkIfFinished();
        };
      })(this));
      if (!node.component.getIcon) {
        return;
      }
      return node.component.on('icon', (function(_this) {
        return function() {
          return _this.bufferedEmit('icon', {
            id: node.id,
            icon: node.component.getIcon()
          });
        };
      })(this));
    };

    Network.prototype.addEdge = function(edge, callback) {
      var from, socket, to;
      socket = internalSocket.createSocket(edge.metadata);
      socket.setDebug(this.debug);
      from = this.getNode(edge.from.node);
      if (!from) {
        return callback(new Error("No process defined for outbound node " + edge.from.node));
      }
      if (!from.component) {
        return callback(new Error("No component defined for outbound node " + edge.from.node));
      }
      if (!from.component.isReady()) {
        from.component.once("ready", (function(_this) {
          return function() {
            return _this.addEdge(edge, callback);
          };
        })(this));
        return;
      }
      to = this.getNode(edge.to.node);
      if (!to) {
        return callback(new Error("No process defined for inbound node " + edge.to.node));
      }
      if (!to.component) {
        return callback(new Error("No component defined for inbound node " + edge.to.node));
      }
      if (!to.component.isReady()) {
        to.component.once("ready", (function(_this) {
          return function() {
            return _this.addEdge(edge, callback);
          };
        })(this));
        return;
      }
      this.subscribeSocket(socket, from);
      return this.connectPort(socket, to, edge.to.port, edge.to.index, true, (function(_this) {
        return function(err) {
          if (err) {
            return callback(err);
          }
          return _this.connectPort(socket, from, edge.from.port, edge.from.index, false, function(err) {
            if (err) {
              return callback(err);
            }
            _this.connections.push(socket);
            return callback();
          });
        };
      })(this));
    };

    Network.prototype.removeEdge = function(edge, callback) {
      var connection, i, len, ref, results;
      ref = this.connections;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        connection = ref[i];
        if (!connection) {
          continue;
        }
        if (!(edge.to.node === connection.to.process.id && edge.to.port === connection.to.port)) {
          continue;
        }
        connection.to.process.component.inPorts[connection.to.port].detach(connection);
        if (edge.from.node) {
          if (connection.from && edge.from.node === connection.from.process.id && edge.from.port === connection.from.port) {
            connection.from.process.component.outPorts[connection.from.port].detach(connection);
          }
        }
        this.connections.splice(this.connections.indexOf(connection), 1);
        results.push(callback());
      }
      return results;
    };

    Network.prototype.addDefaults = function(node, callback) {
      var key, port, process, ref, socket;
      process = this.processes[node.id];
      if (!process.component.isReady()) {
        if (process.component.setMaxListeners) {
          process.component.setMaxListeners(0);
        }
        process.component.once("ready", (function(_this) {
          return function() {
            return _this.addDefaults(process, callback);
          };
        })(this));
        return;
      }
      ref = process.component.inPorts.ports;
      for (key in ref) {
        port = ref[key];
        if (typeof port.hasDefault === 'function' && port.hasDefault() && !port.isAttached()) {
          socket = internalSocket.createSocket();
          socket.setDebug(this.debug);
          this.subscribeSocket(socket);
          this.connectPort(socket, process, key, void 0, true, function() {});
          this.connections.push(socket);
          this.defaults.push(socket);
        }
      }
      return callback();
    };

    Network.prototype.addInitial = function(initializer, callback) {
      var socket, to;
      socket = internalSocket.createSocket(initializer.metadata);
      socket.setDebug(this.debug);
      this.subscribeSocket(socket);
      to = this.getNode(initializer.to.node);
      if (!to) {
        return callback(new Error("No process defined for inbound node " + initializer.to.node));
      }
      if (!(to.component.isReady() || to.component.inPorts[initializer.to.port])) {
        if (to.component.setMaxListeners) {
          to.component.setMaxListeners(0);
        }
        to.component.once("ready", (function(_this) {
          return function() {
            return _this.addInitial(initializer, callback);
          };
        })(this));
        return;
      }
      return this.connectPort(socket, to, initializer.to.port, initializer.to.index, true, (function(_this) {
        return function(err) {
          var init;
          if (err) {
            return callback(err);
          }
          _this.connections.push(socket);
          init = {
            socket: socket,
            data: initializer.from.data
          };
          _this.initials.push(init);
          _this.nextInitials.push(init);
          if (_this.isRunning()) {
            _this.sendInitials();
          } else if (!_this.isStopped()) {
            _this.setStarted(true);
            _this.sendInitials();
          }
          return callback();
        };
      })(this));
    };

    Network.prototype.removeInitial = function(initializer, callback) {
      var connection, i, init, j, k, len, len1, len2, ref, ref1, ref2;
      ref = this.connections;
      for (i = 0, len = ref.length; i < len; i++) {
        connection = ref[i];
        if (!connection) {
          continue;
        }
        if (!(initializer.to.node === connection.to.process.id && initializer.to.port === connection.to.port)) {
          continue;
        }
        connection.to.process.component.inPorts[connection.to.port].detach(connection);
        this.connections.splice(this.connections.indexOf(connection), 1);
        ref1 = this.initials;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          init = ref1[j];
          if (!init) {
            continue;
          }
          if (init.socket !== connection) {
            continue;
          }
          this.initials.splice(this.initials.indexOf(init), 1);
        }
        ref2 = this.nextInitials;
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          init = ref2[k];
          if (!init) {
            continue;
          }
          if (init.socket !== connection) {
            continue;
          }
          this.nextInitials.splice(this.nextInitials.indexOf(init), 1);
        }
      }
      return callback();
    };

    Network.prototype.sendInitial = function(initial) {
      return initial.socket.post(new IP('data', initial.data, {
        initial: true
      }));
    };

    Network.prototype.sendInitials = function(callback) {
      var send;
      if (!callback) {
        callback = function() {};
      }
      send = (function(_this) {
        return function() {
          var i, initial, len, ref;
          ref = _this.initials;
          for (i = 0, len = ref.length; i < len; i++) {
            initial = ref[i];
            _this.sendInitial(initial);
          }
          _this.initials = [];
          return callback();
        };
      })(this);
      if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
        return process.nextTick(send);
      } else {
        return setTimeout(send, 0);
      }
    };

    Network.prototype.isStarted = function() {
      return this.started;
    };

    Network.prototype.isStopped = function() {
      return this.stopped;
    };

    Network.prototype.isRunning = function() {
      if (!this.started) {
        return false;
      }
      return this.getActiveProcesses().length > 0;
    };

    Network.prototype.startComponents = function(callback) {
      var count, id, length, onProcessStart, process, ref, results;
      if (!callback) {
        callback = function() {};
      }
      count = 0;
      length = this.processes ? Object.keys(this.processes).length : 0;
      onProcessStart = function(err) {
        if (err) {
          return callback(err);
        }
        count++;
        if (count === length) {
          return callback();
        }
      };
      if (!(this.processes && Object.keys(this.processes).length)) {
        return callback();
      }
      ref = this.processes;
      results = [];
      for (id in ref) {
        process = ref[id];
        if (process.component.isStarted()) {
          onProcessStart();
          continue;
        }
        if (process.component.start.length === 0) {
          platform.deprecated('component.start method without callback is deprecated');
          process.component.start();
          onProcessStart();
          continue;
        }
        results.push(process.component.start(onProcessStart));
      }
      return results;
    };

    Network.prototype.sendDefaults = function(callback) {
      var i, len, ref, socket;
      if (!callback) {
        callback = function() {};
      }
      if (!this.defaults.length) {
        return callback();
      }
      ref = this.defaults;
      for (i = 0, len = ref.length; i < len; i++) {
        socket = ref[i];
        if (socket.to.process.component.inPorts[socket.to.port].sockets.length !== 1) {
          continue;
        }
        socket.connect();
        socket.send();
        socket.disconnect();
      }
      return callback();
    };

    Network.prototype.start = function(callback) {
      if (!callback) {
        platform.deprecated('Calling network.start() without callback is deprecated');
        callback = function() {};
      }
      if (this.debouncedEnd) {
        this.abortDebounce = true;
      }
      if (this.started) {
        this.stop((function(_this) {
          return function(err) {
            if (err) {
              return callback(err);
            }
            return _this.start(callback);
          };
        })(this));
        return;
      }
      this.initials = this.nextInitials.slice(0);
      this.eventBuffer = [];
      return this.startComponents((function(_this) {
        return function(err) {
          if (err) {
            return callback(err);
          }
          return _this.sendInitials(function(err) {
            if (err) {
              return callback(err);
            }
            return _this.sendDefaults(function(err) {
              if (err) {
                return callback(err);
              }
              _this.setStarted(true);
              return callback(null);
            });
          });
        };
      })(this));
    };

    Network.prototype.stop = function(callback) {
      var connection, count, i, id, len, length, onProcessEnd, process, ref, ref1, results;
      if (!callback) {
        platform.deprecated('Calling network.stop() without callback is deprecated');
        callback = function() {};
      }
      if (this.debouncedEnd) {
        this.abortDebounce = true;
      }
      if (!this.started) {
        this.stopped = true;
        return callback(null);
      }
      ref = this.connections;
      for (i = 0, len = ref.length; i < len; i++) {
        connection = ref[i];
        if (!connection.isConnected()) {
          continue;
        }
        connection.disconnect();
      }
      count = 0;
      length = this.processes ? Object.keys(this.processes).length : 0;
      onProcessEnd = (function(_this) {
        return function(err) {
          if (err) {
            return callback(err);
          }
          count++;
          if (count === length) {
            _this.setStarted(false);
            _this.stopped = true;
            return callback();
          }
        };
      })(this);
      if (!(this.processes && Object.keys(this.processes).length)) {
        this.setStarted(false);
        this.stopped = true;
        return callback();
      }
      ref1 = this.processes;
      results = [];
      for (id in ref1) {
        process = ref1[id];
        if (!process.component.isStarted()) {
          onProcessEnd();
          continue;
        }
        if (process.component.shutdown.length === 0) {
          platform.deprecated('component.shutdown method without callback is deprecated');
          process.component.shutdown();
          onProcessEnd();
          continue;
        }
        results.push(process.component.shutdown(onProcessEnd));
      }
      return results;
    };

    Network.prototype.setStarted = function(started) {
      if (this.started === started) {
        return;
      }
      if (!started) {
        this.started = false;
        this.bufferedEmit('end', {
          start: this.startupDate,
          end: new Date,
          uptime: this.uptime()
        });
        return;
      }
      if (!this.startupDate) {
        this.startupDate = new Date;
      }
      this.started = true;
      this.stopped = false;
      return this.bufferedEmit('start', {
        start: this.startupDate
      });
    };

    Network.prototype.checkIfFinished = function() {
      if (this.isRunning()) {
        return;
      }
      delete this.abortDebounce;
      if (!this.debouncedEnd) {
        this.debouncedEnd = utils.debounce((function(_this) {
          return function() {
            if (_this.abortDebounce) {
              return;
            }
            if (_this.isRunning()) {
              return;
            }
            return _this.setStarted(false);
          };
        })(this), 50);
      }
      return this.debouncedEnd();
    };

    Network.prototype.getDebug = function() {
      return this.debug;
    };

    Network.prototype.setDebug = function(active) {
      var i, instance, len, process, processId, ref, ref1, results, socket;
      if (active === this.debug) {
        return;
      }
      this.debug = active;
      ref = this.connections;
      for (i = 0, len = ref.length; i < len; i++) {
        socket = ref[i];
        socket.setDebug(active);
      }
      ref1 = this.processes;
      results = [];
      for (processId in ref1) {
        process = ref1[processId];
        instance = process.component;
        if (instance.isSubgraph()) {
          results.push(instance.network.setDebug(active));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return Network;

  })(EventEmitter);

  exports.Network = Network;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(48);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(49);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(1)))

/***/ }),
/* 17 */
/***/ (function(module, exports) {

(function() {
  var clone, contains, createReduce, debounce, getKeys, getValues, guessLanguageFromFilename, intersection, isArray, isObject, optimizeCb, reduceRight, unique;

  clone = function(obj) {
    var flags, key, newInstance;
    if ((obj == null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = clone(obj[key]);
    }
    return newInstance;
  };

  guessLanguageFromFilename = function(filename) {
    if (/.*\.coffee$/.test(filename)) {
      return 'coffeescript';
    }
    return 'javascript';
  };

  isArray = function(obj) {
    if (Array.isArray) {
      return Array.isArray(obj);
    }
    return Object.prototype.toString.call(arg) === '[object Array]';
  };

  isObject = function(obj) {
    var type;
    type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  unique = function(array) {
    var k, key, output, ref, results, value;
    output = {};
    for (key = k = 0, ref = array.length; 0 <= ref ? k < ref : k > ref; key = 0 <= ref ? ++k : --k) {
      output[array[key]] = array[key];
    }
    results = [];
    for (key in output) {
      value = output[key];
      results.push(value);
    }
    return results;
  };

  optimizeCb = function(func, context, argCount) {
    if (context === void 0) {
      return func;
    }
    switch ((argCount === null ? 3 : argCount)) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      case 2:
        return function(value, other) {
          return func.call(context, value, other);
        };
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  createReduce = function(dir) {
    var iterator;
    iterator = function(obj, iteratee, memo, keys, index, length) {
      var currentKey;
      while (index >= 0 && index < length) {
        currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
        index += dir;
      }
      return memo;
    };
    return function(obj, iteratee, memo, context) {
      var index, keys, length;
      iteratee = optimizeCb(iteratee, context, 4);
      keys = Object.keys(obj);
      length = (keys || obj).length;
      index = dir > 0 ? 0 : length - 1;
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  };

  reduceRight = createReduce(-1);

  debounce = function(func, wait, immediate) {
    var args, context, later, result, timeout, timestamp;
    timeout = void 0;
    args = void 0;
    context = void 0;
    timestamp = void 0;
    result = void 0;
    later = function() {
      var last;
      last = Date.now - timestamp;
      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) {
            context = args = null;
          }
        }
      }
    };
    return function() {
      var callNow;
      context = this;
      args = arguments;
      timestamp = Date.now;
      callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }
      return result;
    };
  };

  getKeys = function(obj) {
    var key, keys;
    if (!isObject(obj)) {
      return [];
    }
    if (Object.keys) {
      return Object.keys(obj);
    }
    keys = [];
    for (key in obj) {
      if (obj.has(key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  getValues = function(obj) {
    var i, keys, length, values;
    keys = getKeys(obj);
    length = keys.length;
    values = Array(length);
    i = 0;
    while (i < length) {
      values[i] = obj[keys[i]];
      i++;
    }
    return values;
  };

  contains = function(obj, item, fromIndex) {
    if (!isArray(obj)) {
      obj = getValues(obj);
    }
    if (typeof fromIndex !== 'number' || guard) {
      fromIndex = 0;
    }
    return obj.indexOf(item) >= 0;
  };

  intersection = function(array) {
    var argsLength, i, item, j, k, l, ref, ref1, result;
    result = [];
    argsLength = arguments.length;
    for (i = k = 0, ref = array.length; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      item = array[i];
      if (contains(result, item)) {
        continue;
      }
      for (j = l = 1, ref1 = argsLength; 1 <= ref1 ? l <= ref1 : l >= ref1; j = 1 <= ref1 ? ++l : --l) {
        if (!contains(arguments[j], item)) {
          break;
        }
      }
      if (j === argsLength) {
        result.push(item);
      }
    }
    return result;
  };

  exports.clone = clone;

  exports.guessLanguageFromFilename = guessLanguageFromFilename;

  exports.optimizeCb = optimizeCb;

  exports.reduceRight = reduceRight;

  exports.debounce = debounce;

  exports.unique = unique;

  exports.intersection = intersection;

  exports.getValues = getValues;

}).call(this);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var Component, EventEmitter, IP, ProcessContext, ProcessInput, ProcessOutput, debug, debugBrackets, debugSend, ports,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  EventEmitter = __webpack_require__(2).EventEmitter;

  ports = __webpack_require__(19);

  IP = __webpack_require__(4);

  debug = __webpack_require__(3)('noflo:component');

  debugBrackets = __webpack_require__(3)('noflo:component:brackets');

  debugSend = __webpack_require__(3)('noflo:component:send');

  Component = (function(superClass) {
    extend(Component, superClass);

    Component.prototype.description = '';

    Component.prototype.icon = null;

    function Component(options) {
      this.error = bind(this.error, this);
      var ref, ref1, ref2;
      if (!options) {
        options = {};
      }
      if (!options.inPorts) {
        options.inPorts = {};
      }
      if (options.inPorts instanceof ports.InPorts) {
        this.inPorts = options.inPorts;
      } else {
        this.inPorts = new ports.InPorts(options.inPorts);
      }
      if (!options.outPorts) {
        options.outPorts = {};
      }
      if (options.outPorts instanceof ports.OutPorts) {
        this.outPorts = options.outPorts;
      } else {
        this.outPorts = new ports.OutPorts(options.outPorts);
      }
      if (options.icon) {
        this.icon = options.icon;
      }
      if (options.description) {
        this.description = options.description;
      }
      this.started = false;
      this.load = 0;
      this.ordered = (ref = options.ordered) != null ? ref : false;
      this.autoOrdering = (ref1 = options.autoOrdering) != null ? ref1 : null;
      this.outputQ = [];
      this.bracketContext = {
        "in": {},
        out: {}
      };
      this.activateOnInput = (ref2 = options.activateOnInput) != null ? ref2 : true;
      this.forwardBrackets = {
        "in": ['out', 'error']
      };
      if ('forwardBrackets' in options) {
        this.forwardBrackets = options.forwardBrackets;
      }
      if (typeof options.process === 'function') {
        this.process(options.process);
      }
    }

    Component.prototype.getDescription = function() {
      return this.description;
    };

    Component.prototype.isReady = function() {
      return true;
    };

    Component.prototype.isSubgraph = function() {
      return false;
    };

    Component.prototype.setIcon = function(icon) {
      this.icon = icon;
      return this.emit('icon', this.icon);
    };

    Component.prototype.getIcon = function() {
      return this.icon;
    };

    Component.prototype.error = function(e, groups, errorPort, scope) {
      var group, i, j, len1, len2;
      if (groups == null) {
        groups = [];
      }
      if (errorPort == null) {
        errorPort = 'error';
      }
      if (scope == null) {
        scope = null;
      }
      if (this.outPorts[errorPort] && (this.outPorts[errorPort].isAttached() || !this.outPorts[errorPort].isRequired())) {
        for (i = 0, len1 = groups.length; i < len1; i++) {
          group = groups[i];
          this.outPorts[errorPort].openBracket(group, {
            scope: scope
          });
        }
        this.outPorts[errorPort].data(e, {
          scope: scope
        });
        for (j = 0, len2 = groups.length; j < len2; j++) {
          group = groups[j];
          this.outPorts[errorPort].closeBracket(group, {
            scope: scope
          });
        }
        return;
      }
      throw e;
    };

    Component.prototype.setUp = function(callback) {
      return callback();
    };

    Component.prototype.tearDown = function(callback) {
      return callback();
    };

    Component.prototype.start = function(callback) {
      if (this.isStarted()) {
        return callback();
      }
      return this.setUp((function(_this) {
        return function(err) {
          if (err) {
            return callback(err);
          }
          _this.started = true;
          _this.emit('start');
          return callback(null);
        };
      })(this));
    };

    Component.prototype.shutdown = function(callback) {
      var finalize;
      finalize = (function(_this) {
        return function() {
          var inPort, inPorts, portName;
          inPorts = _this.inPorts.ports || _this.inPorts;
          for (portName in inPorts) {
            inPort = inPorts[portName];
            if (typeof inPort.clear !== 'function') {
              continue;
            }
            inPort.clear();
          }
          _this.bracketContext = {
            "in": {},
            out: {}
          };
          if (!_this.isStarted()) {
            return callback();
          }
          _this.started = false;
          _this.emit('end');
          return callback();
        };
      })(this);
      return this.tearDown((function(_this) {
        return function(err) {
          var checkLoad;
          if (err) {
            return callback(err);
          }
          if (_this.load > 0) {
            checkLoad = function(load) {
              if (load > 0) {
                return;
              }
              this.removeListener('deactivate', checkLoad);
              return finalize();
            };
            _this.on('deactivate', checkLoad);
            return;
          }
          return finalize();
        };
      })(this));
    };

    Component.prototype.isStarted = function() {
      return this.started;
    };

    Component.prototype.prepareForwarding = function() {
      var i, inPort, len1, outPort, outPorts, ref, results, tmp;
      ref = this.forwardBrackets;
      results = [];
      for (inPort in ref) {
        outPorts = ref[inPort];
        if (!(inPort in this.inPorts.ports)) {
          delete this.forwardBrackets[inPort];
          continue;
        }
        tmp = [];
        for (i = 0, len1 = outPorts.length; i < len1; i++) {
          outPort = outPorts[i];
          if (outPort in this.outPorts.ports) {
            tmp.push(outPort);
          }
        }
        if (tmp.length === 0) {
          results.push(delete this.forwardBrackets[inPort]);
        } else {
          results.push(this.forwardBrackets[inPort] = tmp);
        }
      }
      return results;
    };

    Component.prototype.isLegacy = function() {
      if (this.handle) {
        return false;
      }
      if (this._wpData) {
        return false;
      }
      return true;
    };

    Component.prototype.process = function(handle) {
      var fn, name, port, ref;
      if (typeof handle !== 'function') {
        throw new Error("Process handler must be a function");
      }
      if (!this.inPorts) {
        throw new Error("Component ports must be defined before process function");
      }
      this.prepareForwarding();
      this.handle = handle;
      ref = this.inPorts.ports;
      fn = (function(_this) {
        return function(name, port) {
          if (!port.name) {
            port.name = name;
          }
          return port.on('ip', function(ip) {
            return _this.handleIP(ip, port);
          });
        };
      })(this);
      for (name in ref) {
        port = ref[name];
        fn(name, port);
      }
      return this;
    };

    Component.prototype.isForwardingInport = function(port) {
      var portName;
      if (typeof port === 'string') {
        portName = port;
      } else {
        portName = port.name;
      }
      if (portName in this.forwardBrackets) {
        return true;
      }
      return false;
    };

    Component.prototype.isForwardingOutport = function(inport, outport) {
      var inportName, outportName;
      if (typeof inport === 'string') {
        inportName = inport;
      } else {
        inportName = inport.name;
      }
      if (typeof outport === 'string') {
        outportName = outport;
      } else {
        outportName = outport.name;
      }
      if (!this.forwardBrackets[inportName]) {
        return false;
      }
      if (this.forwardBrackets[inportName].indexOf(outportName) !== -1) {
        return true;
      }
      return false;
    };

    Component.prototype.isOrdered = function() {
      if (this.ordered) {
        return true;
      }
      if (this.autoOrdering) {
        return true;
      }
      return false;
    };

    Component.prototype.handleIP = function(ip, port) {
      var buf, context, dataPackets, e, error1, input, output, result;
      if (!port.options.triggering) {
        return;
      }
      if (ip.type === 'openBracket' && this.autoOrdering === null && !this.ordered) {
        debug(this.nodeId + " port '" + port.name + "' entered auto-ordering mode");
        this.autoOrdering = true;
      }
      result = {};
      if (this.isForwardingInport(port)) {
        if (ip.type === 'openBracket') {
          return;
        }
        if (ip.type === 'closeBracket') {
          buf = port.getBuffer(ip.scope, ip.index);
          dataPackets = buf.filter(function(ip) {
            return ip.type === 'data';
          });
          if (this.outputQ.length >= this.load && dataPackets.length === 0) {
            if (buf[0] !== ip) {
              return;
            }
            port.get(ip.scope, ip.index);
            context = this.getBracketContext('in', port.name, ip.scope, ip.index).pop();
            context.closeIp = ip;
            debugBrackets(this.nodeId + " closeBracket-C from '" + context.source + "' to " + context.ports + ": '" + ip.data + "'");
            result = {
              __resolved: true,
              __bracketClosingAfter: [context]
            };
            this.outputQ.push(result);
            this.processOutputQueue();
          }
          if (!dataPackets.length) {
            return;
          }
        }
      }
      context = new ProcessContext(ip, this, port, result);
      input = new ProcessInput(this.inPorts, context);
      output = new ProcessOutput(this.outPorts, context);
      try {
        this.handle(input, output, context);
      } catch (error1) {
        e = error1;
        this.deactivate(context);
        output.sendDone(e);
      }
      if (context.activated) {
        return;
      }
      if (port.isAddressable()) {
        debug(this.nodeId + " packet on '" + port.name + "[" + ip.index + "]' didn't match preconditions: " + ip.type);
        return;
      }
      debug(this.nodeId + " packet on '" + port.name + "' didn't match preconditions: " + ip.type);
    };

    Component.prototype.getBracketContext = function(type, port, scope, idx) {
      var index, name, portsList, ref;
      ref = ports.normalizePortName(port), name = ref.name, index = ref.index;
      if (idx != null) {
        index = idx;
      }
      portsList = type === 'in' ? this.inPorts : this.outPorts;
      if (portsList[name].isAddressable()) {
        port = name + "[" + index + "]";
      }
      if (!this.bracketContext[type][port]) {
        this.bracketContext[type][port] = {};
      }
      if (!this.bracketContext[type][port][scope]) {
        this.bracketContext[type][port][scope] = [];
      }
      return this.bracketContext[type][port][scope];
    };

    Component.prototype.addToResult = function(result, port, ip, before) {
      var idx, index, method, name, ref;
      if (before == null) {
        before = false;
      }
      ref = ports.normalizePortName(port), name = ref.name, index = ref.index;
      method = before ? 'unshift' : 'push';
      if (this.outPorts[name].isAddressable()) {
        idx = index ? parseInt(index) : ip.index;
        if (!result[name]) {
          result[name] = {};
        }
        if (!result[name][idx]) {
          result[name][idx] = [];
        }
        ip.index = idx;
        result[name][idx][method](ip);
        return;
      }
      if (!result[name]) {
        result[name] = [];
      }
      return result[name][method](ip);
    };

    Component.prototype.getForwardableContexts = function(inport, outport, contexts) {
      var forwardable, index, name, ref;
      ref = ports.normalizePortName(outport), name = ref.name, index = ref.index;
      forwardable = [];
      contexts.forEach((function(_this) {
        return function(ctx, idx) {
          var outContext;
          if (!_this.isForwardingOutport(inport, name)) {
            return;
          }
          if (ctx.ports.indexOf(outport) !== -1) {
            return;
          }
          outContext = _this.getBracketContext('out', name, ctx.ip.scope, index)[idx];
          if (outContext) {
            if (outContext.ip.data === ctx.ip.data && outContext.ports.indexOf(outport) !== -1) {
              return;
            }
          }
          return forwardable.push(ctx);
        };
      })(this));
      return forwardable;
    };

    Component.prototype.addBracketForwards = function(result) {
      var context, i, ipClone, j, k, l, len1, len2, len3, len4, port, ref, ref1, ref2, ref3, ref4, ref5;
      if ((ref = result.__bracketClosingBefore) != null ? ref.length : void 0) {
        ref1 = result.__bracketClosingBefore;
        for (i = 0, len1 = ref1.length; i < len1; i++) {
          context = ref1[i];
          debugBrackets(this.nodeId + " closeBracket-A from '" + context.source + "' to " + context.ports + ": '" + context.closeIp.data + "'");
          if (!context.ports.length) {
            continue;
          }
          ref2 = context.ports;
          for (j = 0, len2 = ref2.length; j < len2; j++) {
            port = ref2[j];
            ipClone = context.closeIp.clone();
            this.addToResult(result, port, ipClone, true);
            this.getBracketContext('out', port, ipClone.scope).pop();
          }
        }
      }
      if (result.__bracketContext) {
        Object.keys(result.__bracketContext).reverse().forEach((function(_this) {
          return function(inport) {
            var ctx, datas, forwardedOpens, idx, idxIps, ip, ips, k, l, len3, len4, len5, m, outport, portIdentifier, results, unforwarded;
            context = result.__bracketContext[inport];
            if (!context.length) {
              return;
            }
            results = [];
            for (outport in result) {
              ips = result[outport];
              if (outport.indexOf('__') === 0) {
                continue;
              }
              if (_this.outPorts[outport].isAddressable()) {
                for (idx in ips) {
                  idxIps = ips[idx];
                  datas = idxIps.filter(function(ip) {
                    return ip.type === 'data';
                  });
                  if (!datas.length) {
                    continue;
                  }
                  portIdentifier = outport + "[" + idx + "]";
                  unforwarded = _this.getForwardableContexts(inport, portIdentifier, context);
                  if (!unforwarded.length) {
                    continue;
                  }
                  forwardedOpens = [];
                  for (k = 0, len3 = unforwarded.length; k < len3; k++) {
                    ctx = unforwarded[k];
                    debugBrackets(_this.nodeId + " openBracket from '" + inport + "' to '" + portIdentifier + "': '" + ctx.ip.data + "'");
                    ipClone = ctx.ip.clone();
                    ipClone.index = parseInt(idx);
                    forwardedOpens.push(ipClone);
                    ctx.ports.push(portIdentifier);
                    _this.getBracketContext('out', outport, ctx.ip.scope, idx).push(ctx);
                  }
                  forwardedOpens.reverse();
                  for (l = 0, len4 = forwardedOpens.length; l < len4; l++) {
                    ip = forwardedOpens[l];
                    _this.addToResult(result, outport, ip, true);
                  }
                }
                continue;
              }
              datas = ips.filter(function(ip) {
                return ip.type === 'data';
              });
              if (!datas.length) {
                continue;
              }
              unforwarded = _this.getForwardableContexts(inport, outport, context);
              if (!unforwarded.length) {
                continue;
              }
              forwardedOpens = [];
              for (m = 0, len5 = unforwarded.length; m < len5; m++) {
                ctx = unforwarded[m];
                debugBrackets(_this.nodeId + " openBracket from '" + inport + "' to '" + outport + "': '" + ctx.ip.data + "'");
                forwardedOpens.push(ctx.ip.clone());
                ctx.ports.push(outport);
                _this.getBracketContext('out', outport, ctx.ip.scope).push(ctx);
              }
              forwardedOpens.reverse();
              results.push((function() {
                var len6, n, results1;
                results1 = [];
                for (n = 0, len6 = forwardedOpens.length; n < len6; n++) {
                  ip = forwardedOpens[n];
                  results1.push(this.addToResult(result, outport, ip, true));
                }
                return results1;
              }).call(_this));
            }
            return results;
          };
        })(this));
      }
      if ((ref3 = result.__bracketClosingAfter) != null ? ref3.length : void 0) {
        ref4 = result.__bracketClosingAfter;
        for (k = 0, len3 = ref4.length; k < len3; k++) {
          context = ref4[k];
          debugBrackets(this.nodeId + " closeBracket-B from '" + context.source + "' to " + context.ports + ": '" + context.closeIp.data + "'");
          if (!context.ports.length) {
            continue;
          }
          ref5 = context.ports;
          for (l = 0, len4 = ref5.length; l < len4; l++) {
            port = ref5[l];
            ipClone = context.closeIp.clone();
            this.addToResult(result, port, ipClone, false);
            this.getBracketContext('out', port, ipClone.scope).pop();
          }
        }
      }
      delete result.__bracketClosingBefore;
      delete result.__bracketContext;
      return delete result.__bracketClosingAfter;
    };

    Component.prototype.processOutputQueue = function() {
      var idx, idxIps, ip, ips, port, portIdentifier, result, results;
      results = [];
      while (this.outputQ.length > 0) {
        if (!this.outputQ[0].__resolved) {
          break;
        }
        result = this.outputQ.shift();
        this.addBracketForwards(result);
        results.push((function() {
          var i, len1, results1;
          results1 = [];
          for (port in result) {
            ips = result[port];
            if (port.indexOf('__') === 0) {
              continue;
            }
            if (this.outPorts.ports[port].isAddressable()) {
              for (idx in ips) {
                idxIps = ips[idx];
                idx = parseInt(idx);
                if (!this.outPorts.ports[port].isAttached(idx)) {
                  continue;
                }
                for (i = 0, len1 = idxIps.length; i < len1; i++) {
                  ip = idxIps[i];
                  portIdentifier = port + "[" + ip.index + "]";
                  if (ip.type === 'openBracket') {
                    debugSend(this.nodeId + " sending " + portIdentifier + " < '" + ip.data + "'");
                  } else if (ip.type === 'closeBracket') {
                    debugSend(this.nodeId + " sending " + portIdentifier + " > '" + ip.data + "'");
                  } else {
                    debugSend(this.nodeId + " sending " + portIdentifier + " DATA");
                  }
                  this.outPorts[port].sendIP(ip);
                }
              }
              continue;
            }
            if (!this.outPorts.ports[port].isAttached()) {
              continue;
            }
            results1.push((function() {
              var j, len2, results2;
              results2 = [];
              for (j = 0, len2 = ips.length; j < len2; j++) {
                ip = ips[j];
                portIdentifier = port;
                if (ip.type === 'openBracket') {
                  debugSend(this.nodeId + " sending " + portIdentifier + " < '" + ip.data + "'");
                } else if (ip.type === 'closeBracket') {
                  debugSend(this.nodeId + " sending " + portIdentifier + " > '" + ip.data + "'");
                } else {
                  debugSend(this.nodeId + " sending " + portIdentifier + " DATA");
                }
                results2.push(this.outPorts[port].sendIP(ip));
              }
              return results2;
            }).call(this));
          }
          return results1;
        }).call(this));
      }
      return results;
    };

    Component.prototype.activate = function(context) {
      if (context.activated) {
        return;
      }
      context.activated = true;
      context.deactivated = false;
      this.load++;
      this.emit('activate', this.load);
      if (this.ordered || this.autoOrdering) {
        return this.outputQ.push(context.result);
      }
    };

    Component.prototype.deactivate = function(context) {
      if (context.deactivated) {
        return;
      }
      context.deactivated = true;
      context.activated = false;
      if (this.isOrdered()) {
        this.processOutputQueue();
      }
      this.load--;
      return this.emit('deactivate', this.load);
    };

    return Component;

  })(EventEmitter);

  exports.Component = Component;

  ProcessContext = (function() {
    function ProcessContext(ip1, nodeInstance, port1, result1) {
      this.ip = ip1;
      this.nodeInstance = nodeInstance;
      this.port = port1;
      this.result = result1;
      this.scope = this.ip.scope;
      this.activated = false;
      this.deactivated = false;
    }

    ProcessContext.prototype.activate = function() {
      if (this.result.__resolved || this.nodeInstance.outputQ.indexOf(this.result) === -1) {
        this.result = {};
      }
      return this.nodeInstance.activate(this);
    };

    ProcessContext.prototype.deactivate = function() {
      if (!this.result.__resolved) {
        this.result.__resolved = true;
      }
      return this.nodeInstance.deactivate(this);
    };

    return ProcessContext;

  })();

  ProcessInput = (function() {
    function ProcessInput(ports1, context1) {
      this.ports = ports1;
      this.context = context1;
      this.nodeInstance = this.context.nodeInstance;
      this.ip = this.context.ip;
      this.port = this.context.port;
      this.result = this.context.result;
      this.scope = this.context.scope;
    }

    ProcessInput.prototype.activate = function() {
      if (this.context.activated) {
        return;
      }
      if (this.nodeInstance.isOrdered()) {
        this.result.__resolved = false;
      }
      this.nodeInstance.activate(this.context);
      if (this.port.isAddressable()) {
        return debug(this.nodeInstance.nodeId + " packet on '" + this.port.name + "[" + this.ip.index + "]' caused activation " + this.nodeInstance.load + ": " + this.ip.type);
      } else {
        return debug(this.nodeInstance.nodeId + " packet on '" + this.port.name + "' caused activation " + this.nodeInstance.load + ": " + this.ip.type);
      }
    };

    ProcessInput.prototype.attached = function() {
      var args, i, len1, port, res;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!args.length) {
        args = ['in'];
      }
      res = [];
      for (i = 0, len1 = args.length; i < len1; i++) {
        port = args[i];
        res.push(this.ports[port].listAttached());
      }
      if (args.length === 1) {
        return res.pop();
      }
      return res;
    };

    ProcessInput.prototype.has = function() {
      var args, i, len1, port, validate;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!args.length) {
        args = ['in'];
      }
      if (typeof args[args.length - 1] === 'function') {
        validate = args.pop();
      } else {
        validate = function() {
          return true;
        };
      }
      for (i = 0, len1 = args.length; i < len1; i++) {
        port = args[i];
        if (Array.isArray(port)) {
          if (!this.ports[port[0]].isAddressable()) {
            throw new Error("Non-addressable ports, access must be with string " + port[0]);
          }
          if (!this.ports[port[0]].has(this.scope, port[1], validate)) {
            return false;
          }
          continue;
        }
        if (this.ports[port].isAddressable()) {
          throw new Error("For addressable ports, access must be with array [" + port + ", idx]");
        }
        if (!this.ports[port].has(this.scope, validate)) {
          return false;
        }
      }
      return true;
    };

    ProcessInput.prototype.hasData = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!args.length) {
        args = ['in'];
      }
      args.push(function(ip) {
        return ip.type === 'data';
      });
      return this.has.apply(this, args);
    };

    ProcessInput.prototype.hasStream = function() {
      var args, dataBrackets, hasData, i, len1, port, portBrackets, validate, validateStream;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!args.length) {
        args = ['in'];
      }
      if (typeof args[args.length - 1] === 'function') {
        validateStream = args.pop();
      } else {
        validateStream = function() {
          return true;
        };
      }
      for (i = 0, len1 = args.length; i < len1; i++) {
        port = args[i];
        portBrackets = [];
        dataBrackets = [];
        hasData = false;
        validate = function(ip) {
          if (ip.type === 'openBracket') {
            portBrackets.push(ip.data);
            return false;
          }
          if (ip.type === 'data') {
            hasData = validateStream(ip, portBrackets);
            if (!portBrackets.length) {
              return hasData;
            }
            return false;
          }
          if (ip.type === 'closeBracket') {
            portBrackets.pop();
            if (portBrackets.length) {
              return false;
            }
            if (!hasData) {
              return false;
            }
            return true;
          }
        };
        if (!this.has(port, validate)) {
          return false;
        }
      }
      return true;
    };

    ProcessInput.prototype.get = function() {
      var args, i, idx, ip, len1, port, portname, res;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.activate();
      if (!args.length) {
        args = ['in'];
      }
      res = [];
      for (i = 0, len1 = args.length; i < len1; i++) {
        port = args[i];
        if (Array.isArray(port)) {
          portname = port[0], idx = port[1];
          if (!this.ports[portname].isAddressable()) {
            throw new Error('Non-addressable ports, access must be with string portname');
          }
        } else {
          portname = port;
          if (this.ports[portname].isAddressable()) {
            throw new Error('For addressable ports, access must be with array [portname, idx]');
          }
        }
        if (this.nodeInstance.isForwardingInport(portname)) {
          ip = this.__getForForwarding(portname, idx);
          res.push(ip);
          continue;
        }
        ip = this.ports[portname].get(this.scope, idx);
        res.push(ip);
      }
      if (args.length === 1) {
        return res[0];
      } else {
        return res;
      }
    };

    ProcessInput.prototype.__getForForwarding = function(port, idx) {
      var context, dataIp, i, ip, len1, prefix;
      prefix = [];
      dataIp = null;
      while (true) {
        ip = this.ports[port].get(this.scope, idx);
        if (!ip) {
          break;
        }
        if (ip.type === 'data') {
          dataIp = ip;
          break;
        }
        prefix.push(ip);
      }
      for (i = 0, len1 = prefix.length; i < len1; i++) {
        ip = prefix[i];
        if (ip.type === 'closeBracket') {
          if (!this.result.__bracketClosingBefore) {
            this.result.__bracketClosingBefore = [];
          }
          context = this.nodeInstance.getBracketContext('in', port, this.scope, idx).pop();
          context.closeIp = ip;
          this.result.__bracketClosingBefore.push(context);
          continue;
        }
        if (ip.type === 'openBracket') {
          this.nodeInstance.getBracketContext('in', port, this.scope, idx).push({
            ip: ip,
            ports: [],
            source: port
          });
          continue;
        }
      }
      if (!this.result.__bracketContext) {
        this.result.__bracketContext = {};
      }
      this.result.__bracketContext[port] = this.nodeInstance.getBracketContext('in', port, this.scope, idx).slice(0);
      return dataIp;
    };

    ProcessInput.prototype.getData = function() {
      var args, datas, i, len1, packet, port;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!args.length) {
        args = ['in'];
      }
      datas = [];
      for (i = 0, len1 = args.length; i < len1; i++) {
        port = args[i];
        packet = this.get(port);
        if (packet == null) {
          datas.push(packet);
          continue;
        }
        while (packet.type !== 'data') {
          packet = this.get(port);
          if (!packet) {
            break;
          }
        }
        datas.push(packet.data);
      }
      if (args.length === 1) {
        return datas.pop();
      }
      return datas;
    };

    ProcessInput.prototype.getStream = function() {
      var args, datas, hasData, i, ip, len1, port, portBrackets, portPackets;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (!args.length) {
        args = ['in'];
      }
      datas = [];
      for (i = 0, len1 = args.length; i < len1; i++) {
        port = args[i];
        portBrackets = [];
        portPackets = [];
        hasData = false;
        ip = this.get(port);
        if (!ip) {
          datas.push(void 0);
        }
        while (ip) {
          if (ip.type === 'openBracket') {
            if (!portBrackets.length) {
              portPackets = [];
              hasData = false;
            }
            portBrackets.push(ip.data);
            portPackets.push(ip);
          }
          if (ip.type === 'data') {
            portPackets.push(ip);
            hasData = true;
            if (!portBrackets.length) {
              break;
            }
          }
          if (ip.type === 'closeBracket') {
            portPackets.push(ip);
            portBrackets.pop();
            if (hasData && !portBrackets.length) {
              break;
            }
          }
          ip = this.get(port);
        }
        datas.push(portPackets);
      }
      if (args.length === 1) {
        return datas.pop();
      }
      return datas;
    };

    return ProcessInput;

  })();

  ProcessOutput = (function() {
    function ProcessOutput(ports1, context1) {
      this.ports = ports1;
      this.context = context1;
      this.nodeInstance = this.context.nodeInstance;
      this.ip = this.context.ip;
      this.result = this.context.result;
      this.scope = this.context.scope;
    }

    ProcessOutput.prototype.isError = function(err) {
      return err instanceof Error || Array.isArray(err) && err.length > 0 && err[0] instanceof Error;
    };

    ProcessOutput.prototype.error = function(err) {
      var e, i, j, len1, len2, multiple, results;
      multiple = Array.isArray(err);
      if (!multiple) {
        err = [err];
      }
      if ('error' in this.ports && (this.ports.error.isAttached() || !this.ports.error.isRequired())) {
        if (multiple) {
          this.sendIP('error', new IP('openBracket'));
        }
        for (i = 0, len1 = err.length; i < len1; i++) {
          e = err[i];
          this.sendIP('error', e);
        }
        if (multiple) {
          return this.sendIP('error', new IP('closeBracket'));
        }
      } else {
        results = [];
        for (j = 0, len2 = err.length; j < len2; j++) {
          e = err[j];
          throw e;
        }
        return results;
      }
    };

    ProcessOutput.prototype.sendIP = function(port, packet) {
      var ip;
      if (!IP.isIP(packet)) {
        ip = new IP('data', packet);
      } else {
        ip = packet;
      }
      if (this.scope !== null && ip.scope === null) {
        ip.scope = this.scope;
      }
      if (this.nodeInstance.outPorts[port].isAddressable() && ip.index === null) {
        throw new Error('Sending packets to addressable ports requires specifying index');
      }
      if (this.nodeInstance.isOrdered()) {
        this.nodeInstance.addToResult(this.result, port, ip);
        return;
      }
      return this.nodeInstance.outPorts[port].sendIP(ip);
    };

    ProcessOutput.prototype.send = function(outputMap) {
      var componentPorts, i, len1, mapIsInPorts, packet, port, ref, results;
      if (this.isError(outputMap)) {
        return this.error(outputMap);
      }
      componentPorts = [];
      mapIsInPorts = false;
      ref = Object.keys(this.ports.ports);
      for (i = 0, len1 = ref.length; i < len1; i++) {
        port = ref[i];
        if (port !== 'error' && port !== 'ports' && port !== '_callbacks') {
          componentPorts.push(port);
        }
        if (!mapIsInPorts && (outputMap != null) && typeof outputMap === 'object' && Object.keys(outputMap).indexOf(port) !== -1) {
          mapIsInPorts = true;
        }
      }
      if (componentPorts.length === 1 && !mapIsInPorts) {
        this.sendIP(componentPorts[0], outputMap);
        return;
      }
      if (componentPorts.length > 1 && !mapIsInPorts) {
        throw new Error('Port must be specified for sending output');
      }
      results = [];
      for (port in outputMap) {
        packet = outputMap[port];
        results.push(this.sendIP(port, packet));
      }
      return results;
    };

    ProcessOutput.prototype.sendDone = function(outputMap) {
      this.send(outputMap);
      return this.done();
    };

    ProcessOutput.prototype.pass = function(data, options) {
      var key, val;
      if (options == null) {
        options = {};
      }
      if (!('out' in this.ports)) {
        throw new Error('output.pass() requires port "out" to be present');
      }
      for (key in options) {
        val = options[key];
        this.ip[key] = val;
      }
      this.ip.data = data;
      this.sendIP('out', this.ip);
      return this.done();
    };

    ProcessOutput.prototype.done = function(error) {
      var buf, context, contexts, ctx, ip, isLast, nodeContext, port, ref;
      this.result.__resolved = true;
      this.nodeInstance.activate(this.context);
      if (error) {
        this.error(error);
      }
      isLast = (function(_this) {
        return function() {
          var len, load, pos, resultsOnly;
          resultsOnly = _this.nodeInstance.outputQ.filter(function(q) {
            if (!q.__resolved) {
              return true;
            }
            if (Object.keys(q).length === 2 && q.__bracketClosingAfter) {
              return false;
            }
            return true;
          });
          pos = resultsOnly.indexOf(_this.result);
          len = resultsOnly.length;
          load = _this.nodeInstance.load;
          if (pos === len - 1) {
            return true;
          }
          if (pos === -1 && load === len + 1) {
            return true;
          }
          if (len <= 1 && load === 1) {
            return true;
          }
          return false;
        };
      })(this);
      if (this.nodeInstance.isOrdered() && isLast()) {
        ref = this.nodeInstance.bracketContext["in"];
        for (port in ref) {
          contexts = ref[port];
          if (!contexts[this.scope]) {
            continue;
          }
          nodeContext = contexts[this.scope];
          if (!nodeContext.length) {
            continue;
          }
          context = nodeContext[nodeContext.length - 1];
          buf = this.nodeInstance.inPorts[context.source].getBuffer(context.ip.scope, context.ip.index);
          while (true) {
            if (!buf.length) {
              break;
            }
            if (buf[0].type !== 'closeBracket') {
              break;
            }
            ip = this.nodeInstance.inPorts[context.source].get(context.ip.scope, context.ip.index);
            ctx = nodeContext.pop();
            ctx.closeIp = ip;
            if (!this.result.__bracketClosingAfter) {
              this.result.__bracketClosingAfter = [];
            }
            this.result.__bracketClosingAfter.push(ctx);
          }
        }
      }
      debug(this.nodeInstance.nodeId + " finished processing " + this.nodeInstance.load);
      return this.nodeInstance.deactivate(this.context);
    };

    return ProcessOutput;

  })();

}).call(this);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var EventEmitter, InPort, InPorts, OutPort, OutPorts, Ports,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = __webpack_require__(2).EventEmitter;

  InPort = __webpack_require__(20);

  OutPort = __webpack_require__(22);

  Ports = (function(superClass) {
    extend(Ports, superClass);

    Ports.prototype.model = InPort;

    function Ports(ports) {
      var name, options;
      this.ports = {};
      if (!ports) {
        return;
      }
      for (name in ports) {
        options = ports[name];
        this.add(name, options);
      }
    }

    Ports.prototype.add = function(name, options, process) {
      if (name === 'add' || name === 'remove') {
        throw new Error('Add and remove are restricted port names');
      }
      if (!name.match(/^[a-z0-9_\.\/]+$/)) {
        throw new Error("Port names can only contain lowercase alphanumeric characters and underscores. '" + name + "' not allowed");
      }
      if (this.ports[name]) {
        this.remove(name);
      }
      if (typeof options === 'object' && options.canAttach) {
        this.ports[name] = options;
      } else {
        this.ports[name] = new this.model(options, process);
      }
      this[name] = this.ports[name];
      this.emit('add', name);
      return this;
    };

    Ports.prototype.remove = function(name) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not defined");
      }
      delete this.ports[name];
      delete this[name];
      this.emit('remove', name);
      return this;
    };

    return Ports;

  })(EventEmitter);

  exports.InPorts = InPorts = (function(superClass) {
    extend(InPorts, superClass);

    function InPorts() {
      return InPorts.__super__.constructor.apply(this, arguments);
    }

    InPorts.prototype.on = function(name, event, callback) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].on(event, callback);
    };

    InPorts.prototype.once = function(name, event, callback) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].once(event, callback);
    };

    return InPorts;

  })(Ports);

  exports.OutPorts = OutPorts = (function(superClass) {
    extend(OutPorts, superClass);

    function OutPorts() {
      return OutPorts.__super__.constructor.apply(this, arguments);
    }

    OutPorts.prototype.model = OutPort;

    OutPorts.prototype.connect = function(name, socketId) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].connect(socketId);
    };

    OutPorts.prototype.beginGroup = function(name, group, socketId) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].beginGroup(group, socketId);
    };

    OutPorts.prototype.send = function(name, data, socketId) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].send(data, socketId);
    };

    OutPorts.prototype.endGroup = function(name, socketId) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].endGroup(socketId);
    };

    OutPorts.prototype.disconnect = function(name, socketId) {
      if (!this.ports[name]) {
        throw new Error("Port " + name + " not available");
      }
      return this.ports[name].disconnect(socketId);
    };

    return OutPorts;

  })(Ports);

  exports.normalizePortName = function(name) {
    var matched, port;
    port = {
      name: name
    };
    if (name.indexOf('[') === -1) {
      return port;
    }
    matched = name.match(/(.*)\[([0-9]+)\]/);
    if (!(matched != null ? matched.length : void 0)) {
      return name;
    }
    port.name = matched[1];
    port.index = matched[2];
    return port;
  };

}).call(this);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var BasePort, IP, InPort, platform,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BasePort = __webpack_require__(21);

  IP = __webpack_require__(4);

  platform = __webpack_require__(5);

  InPort = (function(superClass) {
    extend(InPort, superClass);

    function InPort(options, process) {
      this.process = null;
      if (!process && typeof options === 'function') {
        process = options;
        options = {};
      }
      if (options == null) {
        options = {};
      }
      if (options.buffered == null) {
        options.buffered = false;
      }
      if (options.control == null) {
        options.control = false;
      }
      if (options.scoped == null) {
        options.scoped = true;
      }
      if (options.triggering == null) {
        options.triggering = true;
      }
      if (!process && options && options.process) {
        process = options.process;
        delete options.process;
      }
      if (process) {
        platform.deprecated('InPort process callback is deprecated. Please use Process API or the InPort handle option');
        if (typeof process !== 'function') {
          throw new Error('process must be a function');
        }
        this.process = process;
      }
      if (options.handle) {
        platform.deprecated('InPort handle callback is deprecated. Please use Process API');
        if (typeof options.handle !== 'function') {
          throw new Error('handle must be a function');
        }
        this.handle = options.handle;
        delete options.handle;
      }
      InPort.__super__.constructor.call(this, options);
      this.prepareBuffer();
    }

    InPort.prototype.attachSocket = function(socket, localId) {
      if (localId == null) {
        localId = null;
      }
      if (this.hasDefault()) {
        if (this.handle) {
          socket.setDataDelegate((function(_this) {
            return function() {
              return new IP('data', _this.options["default"]);
            };
          })(this));
        } else {
          socket.setDataDelegate((function(_this) {
            return function() {
              return _this.options["default"];
            };
          })(this));
        }
      }
      socket.on('connect', (function(_this) {
        return function() {
          return _this.handleSocketEvent('connect', socket, localId);
        };
      })(this));
      socket.on('begingroup', (function(_this) {
        return function(group) {
          return _this.handleSocketEvent('begingroup', group, localId);
        };
      })(this));
      socket.on('data', (function(_this) {
        return function(data) {
          _this.validateData(data);
          return _this.handleSocketEvent('data', data, localId);
        };
      })(this));
      socket.on('endgroup', (function(_this) {
        return function(group) {
          return _this.handleSocketEvent('endgroup', group, localId);
        };
      })(this));
      socket.on('disconnect', (function(_this) {
        return function() {
          return _this.handleSocketEvent('disconnect', socket, localId);
        };
      })(this));
      return socket.on('ip', (function(_this) {
        return function(ip) {
          return _this.handleIP(ip, localId);
        };
      })(this));
    };

    InPort.prototype.handleIP = function(ip, id) {
      var buf;
      if (this.process) {
        return;
      }
      if (this.options.control && ip.type !== 'data') {
        return;
      }
      ip.owner = this.nodeInstance;
      if (this.isAddressable()) {
        ip.index = id;
      }
      if (ip.datatype === 'all') {
        ip.datatype = this.getDataType();
      }
      if (this.getSchema() && !ip.schema) {
        ip.schema = this.getSchema();
      }
      buf = this.prepareBufferForIP(ip);
      buf.push(ip);
      if (this.options.control && buf.length > 1) {
        buf.shift();
      }
      if (this.handle) {
        this.handle(ip, this.nodeInstance);
      }
      return this.emit('ip', ip, id);
    };

    InPort.prototype.handleSocketEvent = function(event, payload, id) {
      if (this.isBuffered()) {
        this.buffer.push({
          event: event,
          payload: payload,
          id: id
        });
        if (this.isAddressable()) {
          if (this.process) {
            this.process(event, id, this.nodeInstance);
          }
          this.emit(event, id);
        } else {
          if (this.process) {
            this.process(event, this.nodeInstance);
          }
          this.emit(event);
        }
        return;
      }
      if (this.process) {
        if (this.isAddressable()) {
          this.process(event, payload, id, this.nodeInstance);
        } else {
          this.process(event, payload, this.nodeInstance);
        }
      }
      if (this.isAddressable()) {
        return this.emit(event, payload, id);
      }
      return this.emit(event, payload);
    };

    InPort.prototype.hasDefault = function() {
      return this.options["default"] !== void 0;
    };

    InPort.prototype.prepareBuffer = function() {
      this.buffer = [];
      if (this.isAddressable()) {
        this.indexedBuffer = {};
      }
      this.scopedBuffer = {};
      return this.iipBuffer = this.isAddressable() ? {} : [];
    };

    InPort.prototype.prepareBufferForIP = function(ip) {
      if (this.isAddressable()) {
        if ((ip.scope != null) && this.options.scoped) {
          if (!(ip.scope in this.scopedBuffer)) {
            this.scopedBuffer[ip.scope] = [];
          }
          if (!(ip.index in this.scopedBuffer[ip.scope])) {
            this.scopedBuffer[ip.scope][ip.index] = [];
          }
          return this.scopedBuffer[ip.scope][ip.index];
        }
        if (ip.initial) {
          if (!(ip.index in this.iipBuffer)) {
            this.iipBuffer[ip.index] = [];
          }
          return this.iipBuffer[ip.index];
        }
        if (!(ip.index in this.indexedBuffer)) {
          this.indexedBuffer[ip.index] = [];
        }
        return this.indexedBuffer[ip.index];
      }
      if ((ip.scope != null) && this.options.scoped) {
        if (!(ip.scope in this.scopedBuffer)) {
          this.scopedBuffer[ip.scope] = [];
        }
        return this.scopedBuffer[ip.scope];
      }
      if (ip.initial) {
        return this.iipBuffer;
      }
      return this.buffer;
    };

    InPort.prototype.validateData = function(data) {
      if (!this.options.values) {
        return;
      }
      if (this.options.values.indexOf(data) === -1) {
        throw new Error("Invalid data='" + data + "' received, not in [" + this.options.values + "]");
      }
    };

    InPort.prototype.receive = function() {
      platform.deprecated('InPort.receive is deprecated. Use InPort.get instead');
      if (!this.isBuffered()) {
        throw new Error('Receive is only possible on buffered ports');
      }
      return this.buffer.shift();
    };

    InPort.prototype.contains = function() {
      platform.deprecated('InPort.contains is deprecated. Use InPort.has instead');
      if (!this.isBuffered()) {
        throw new Error('Contains query is only possible on buffered ports');
      }
      return this.buffer.filter(function(packet) {
        if (packet.event === 'data') {
          return true;
        }
      }).length;
    };

    InPort.prototype.getBuffer = function(scope, idx, initial) {
      if (initial == null) {
        initial = false;
      }
      if (this.isAddressable()) {
        if ((scope != null) && this.options.scoped) {
          if (!(scope in this.scopedBuffer)) {
            return void 0;
          }
          if (!(idx in this.scopedBuffer[scope])) {
            return void 0;
          }
          return this.scopedBuffer[scope][idx];
        }
        if (initial) {
          if (!(idx in this.iipBuffer)) {
            return void 0;
          }
          return this.iipBuffer[idx];
        }
        if (!(idx in this.indexedBuffer)) {
          return void 0;
        }
        return this.indexedBuffer[idx];
      }
      if ((scope != null) && this.options.scoped) {
        if (!(scope in this.scopedBuffer)) {
          return void 0;
        }
        return this.scopedBuffer[scope];
      }
      if (initial) {
        return this.iipBuffer;
      }
      return this.buffer;
    };

    InPort.prototype.getFromBuffer = function(scope, idx, initial) {
      var buf;
      if (initial == null) {
        initial = false;
      }
      buf = this.getBuffer(scope, idx, initial);
      if (!(buf != null ? buf.length : void 0)) {
        return void 0;
      }
      if (this.options.control) {
        return buf[buf.length - 1];
      } else {
        return buf.shift();
      }
    };

    InPort.prototype.get = function(scope, idx) {
      var res;
      res = this.getFromBuffer(scope, idx);
      if (res !== void 0) {
        return res;
      }
      return this.getFromBuffer(null, idx, true);
    };

    InPort.prototype.hasIPinBuffer = function(scope, idx, validate, initial) {
      var buf, i, len, packet;
      if (initial == null) {
        initial = false;
      }
      buf = this.getBuffer(scope, idx, initial);
      if (!(buf != null ? buf.length : void 0)) {
        return false;
      }
      for (i = 0, len = buf.length; i < len; i++) {
        packet = buf[i];
        if (validate(packet)) {
          return true;
        }
      }
      return false;
    };

    InPort.prototype.hasIIP = function(idx, validate) {
      return this.hasIPinBuffer(null, idx, validate, true);
    };

    InPort.prototype.has = function(scope, idx, validate) {
      if (!this.isAddressable()) {
        validate = idx;
        idx = null;
      }
      if (this.hasIPinBuffer(scope, idx, validate)) {
        return true;
      }
      if (this.hasIIP(idx, validate)) {
        return true;
      }
      return false;
    };

    InPort.prototype.length = function(scope, idx) {
      var buf;
      buf = this.getBuffer(scope, idx);
      if (!buf) {
        return 0;
      }
      return buf.length;
    };

    InPort.prototype.ready = function(scope, idx) {
      return this.length(scope) > 0;
    };

    InPort.prototype.clear = function() {
      return this.prepareBuffer();
    };

    return InPort;

  })(BasePort);

  module.exports = InPort;

}).call(this);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var BasePort, EventEmitter, validTypes,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = __webpack_require__(2).EventEmitter;

  validTypes = ['all', 'string', 'number', 'int', 'object', 'array', 'boolean', 'color', 'date', 'bang', 'function', 'buffer', 'stream'];

  BasePort = (function(superClass) {
    extend(BasePort, superClass);

    function BasePort(options) {
      this.handleOptions(options);
      this.sockets = [];
      this.node = null;
      this.name = null;
    }

    BasePort.prototype.handleOptions = function(options) {
      if (!options) {
        options = {};
      }
      if (!options.datatype) {
        options.datatype = 'all';
      }
      if (options.required === void 0) {
        options.required = false;
      }
      if (options.datatype === 'integer') {
        options.datatype = 'int';
      }
      if (validTypes.indexOf(options.datatype) === -1) {
        throw new Error("Invalid port datatype '" + options.datatype + "' specified, valid are " + (validTypes.join(', ')));
      }
      if (options.type && !options.schema) {
        options.schema = options.type;
        delete options.type;
      }
      if (options.schema && options.schema.indexOf('/') === -1) {
        throw new Error("Invalid port schema '" + options.schema + "' specified. Should be URL or MIME type");
      }
      return this.options = options;
    };

    BasePort.prototype.getId = function() {
      if (!(this.node && this.name)) {
        return 'Port';
      }
      return this.node + " " + (this.name.toUpperCase());
    };

    BasePort.prototype.getDataType = function() {
      return this.options.datatype;
    };

    BasePort.prototype.getSchema = function() {
      return this.options.schema || null;
    };

    BasePort.prototype.getDescription = function() {
      return this.options.description;
    };

    BasePort.prototype.attach = function(socket, index) {
      if (index == null) {
        index = null;
      }
      if (!this.isAddressable() || index === null) {
        index = this.sockets.length;
      }
      this.sockets[index] = socket;
      this.attachSocket(socket, index);
      if (this.isAddressable()) {
        this.emit('attach', socket, index);
        return;
      }
      return this.emit('attach', socket);
    };

    BasePort.prototype.attachSocket = function() {};

    BasePort.prototype.detach = function(socket) {
      var index;
      index = this.sockets.indexOf(socket);
      if (index === -1) {
        return;
      }
      this.sockets[index] = void 0;
      if (this.isAddressable()) {
        this.emit('detach', socket, index);
        return;
      }
      return this.emit('detach', socket);
    };

    BasePort.prototype.isAddressable = function() {
      if (this.options.addressable) {
        return true;
      }
      return false;
    };

    BasePort.prototype.isBuffered = function() {
      if (this.options.buffered) {
        return true;
      }
      return false;
    };

    BasePort.prototype.isRequired = function() {
      if (this.options.required) {
        return true;
      }
      return false;
    };

    BasePort.prototype.isAttached = function(socketId) {
      if (socketId == null) {
        socketId = null;
      }
      if (this.isAddressable() && socketId !== null) {
        if (this.sockets[socketId]) {
          return true;
        }
        return false;
      }
      if (this.sockets.length) {
        return true;
      }
      return false;
    };

    BasePort.prototype.listAttached = function() {
      var attached, i, idx, len, ref, socket;
      attached = [];
      ref = this.sockets;
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        socket = ref[idx];
        if (!socket) {
          continue;
        }
        attached.push(idx);
      }
      return attached;
    };

    BasePort.prototype.isConnected = function(socketId) {
      var connected;
      if (socketId == null) {
        socketId = null;
      }
      if (this.isAddressable()) {
        if (socketId === null) {
          throw new Error((this.getId()) + ": Socket ID required");
        }
        if (!this.sockets[socketId]) {
          throw new Error((this.getId()) + ": Socket " + socketId + " not available");
        }
        return this.sockets[socketId].isConnected();
      }
      connected = false;
      this.sockets.forEach(function(socket) {
        if (!socket) {
          return;
        }
        if (socket.isConnected()) {
          return connected = true;
        }
      });
      return connected;
    };

    BasePort.prototype.canAttach = function() {
      return true;
    };

    return BasePort;

  })(EventEmitter);

  module.exports = BasePort;

}).call(this);


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var BasePort, IP, OutPort,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BasePort = __webpack_require__(21);

  IP = __webpack_require__(4);

  OutPort = (function(superClass) {
    extend(OutPort, superClass);

    function OutPort(options) {
      this.cache = {};
      OutPort.__super__.constructor.call(this, options);
    }

    OutPort.prototype.attach = function(socket, index) {
      if (index == null) {
        index = null;
      }
      OutPort.__super__.attach.call(this, socket, index);
      if (this.isCaching() && (this.cache[index] != null)) {
        return this.send(this.cache[index], index);
      }
    };

    OutPort.prototype.connect = function(socketId) {
      var i, len, results, socket, sockets;
      if (socketId == null) {
        socketId = null;
      }
      sockets = this.getSockets(socketId);
      this.checkRequired(sockets);
      results = [];
      for (i = 0, len = sockets.length; i < len; i++) {
        socket = sockets[i];
        if (!socket) {
          continue;
        }
        results.push(socket.connect());
      }
      return results;
    };

    OutPort.prototype.beginGroup = function(group, socketId) {
      var sockets;
      if (socketId == null) {
        socketId = null;
      }
      sockets = this.getSockets(socketId);
      this.checkRequired(sockets);
      return sockets.forEach(function(socket) {
        if (!socket) {
          return;
        }
        return socket.beginGroup(group);
      });
    };

    OutPort.prototype.send = function(data, socketId) {
      var sockets;
      if (socketId == null) {
        socketId = null;
      }
      sockets = this.getSockets(socketId);
      this.checkRequired(sockets);
      if (this.isCaching() && data !== this.cache[socketId]) {
        this.cache[socketId] = data;
      }
      return sockets.forEach(function(socket) {
        if (!socket) {
          return;
        }
        return socket.send(data);
      });
    };

    OutPort.prototype.endGroup = function(socketId) {
      var i, len, results, socket, sockets;
      if (socketId == null) {
        socketId = null;
      }
      sockets = this.getSockets(socketId);
      this.checkRequired(sockets);
      results = [];
      for (i = 0, len = sockets.length; i < len; i++) {
        socket = sockets[i];
        if (!socket) {
          continue;
        }
        results.push(socket.endGroup());
      }
      return results;
    };

    OutPort.prototype.disconnect = function(socketId) {
      var i, len, results, socket, sockets;
      if (socketId == null) {
        socketId = null;
      }
      sockets = this.getSockets(socketId);
      this.checkRequired(sockets);
      results = [];
      for (i = 0, len = sockets.length; i < len; i++) {
        socket = sockets[i];
        if (!socket) {
          continue;
        }
        results.push(socket.disconnect());
      }
      return results;
    };

    OutPort.prototype.sendIP = function(type, data, options, socketId, autoConnect) {
      var i, ip, len, pristine, ref, socket, sockets;
      if (autoConnect == null) {
        autoConnect = true;
      }
      if (IP.isIP(type)) {
        ip = type;
        socketId = ip.index;
      } else {
        ip = new IP(type, data, options);
      }
      sockets = this.getSockets(socketId);
      this.checkRequired(sockets);
      if (ip.datatype === 'all') {
        ip.datatype = this.getDataType();
      }
      if (this.getSchema() && !ip.schema) {
        ip.schema = this.getSchema();
      }
      if (this.isCaching() && data !== ((ref = this.cache[socketId]) != null ? ref.data : void 0)) {
        this.cache[socketId] = ip;
      }
      pristine = true;
      for (i = 0, len = sockets.length; i < len; i++) {
        socket = sockets[i];
        if (!socket) {
          continue;
        }
        if (pristine) {
          socket.post(ip, autoConnect);
          pristine = false;
        } else {
          if (ip.clonable) {
            ip = ip.clone();
          }
          socket.post(ip, autoConnect);
        }
      }
      return this;
    };

    OutPort.prototype.openBracket = function(data, options, socketId) {
      if (data == null) {
        data = null;
      }
      if (options == null) {
        options = {};
      }
      if (socketId == null) {
        socketId = null;
      }
      return this.sendIP('openBracket', data, options, socketId);
    };

    OutPort.prototype.data = function(data, options, socketId) {
      if (options == null) {
        options = {};
      }
      if (socketId == null) {
        socketId = null;
      }
      return this.sendIP('data', data, options, socketId);
    };

    OutPort.prototype.closeBracket = function(data, options, socketId) {
      if (data == null) {
        data = null;
      }
      if (options == null) {
        options = {};
      }
      if (socketId == null) {
        socketId = null;
      }
      return this.sendIP('closeBracket', data, options, socketId);
    };

    OutPort.prototype.checkRequired = function(sockets) {
      if (sockets.length === 0 && this.isRequired()) {
        throw new Error((this.getId()) + ": No connections available");
      }
    };

    OutPort.prototype.getSockets = function(socketId) {
      if (this.isAddressable()) {
        if (socketId === null) {
          throw new Error((this.getId()) + " Socket ID required");
        }
        if (!this.sockets[socketId]) {
          return [];
        }
        return [this.sockets[socketId]];
      }
      return this.sockets;
    };

    OutPort.prototype.isCaching = function() {
      if (this.options.caching) {
        return true;
      }
      return false;
    };

    return OutPort;

  })(BasePort);

  module.exports = OutPort;

}).call(this);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

(function (context) {
  var noflo = __webpack_require__(0);
  var Base = __webpack_require__(24);

  var PostMessage = function (options) {
    if (!options) {
      options = {};
    }

    if (options.catchExceptions) {
      context.onerror = function (err) {
        if (this.client) {
          this.send('network', 'error', err, {
            href: this.context ? this.context.href : this.client.location.href
          });
        }
        console.error(err);
        return true;
      }.bind(this);
    }

    if (!options.defaultPermissions) {
      // The iframe runtime is run on user's own computer, so default to all access allowed
      options.defaultPermissions = [
        'protocol:graph',
        'protocol:component',
        'protocol:network',
        'protocol:runtime',
        'component:setsource',
        'component:getsource'
      ];
    }

    this.prototype.constructor.apply(this, arguments);
    this.receive = this.prototype.receive;
    this.canDo = this.prototype.canDo;
    this.getPermitted = this.prototype.getPermitted;
    this.client = null;
  };
  PostMessage.prototype = Base;
  PostMessage.prototype.setClient = function (client) {
    this.client = client;
  };
  PostMessage.prototype.send = function (protocol, topic, payload, ctx) {
    if (!this.client) {
      return;
    }
    if (payload instanceof Error) {
      payload = {
        message: payload.message,
        stack: payload.stack
      };
    }
    if (this.context) {
      ctx = this.context;
    }
    this.client.postMessage(JSON.stringify({
      protocol: protocol,
      command: topic,
      payload: payload
    }), ctx.href);
    this.prototype.send.apply(this, arguments);
  };
  PostMessage.prototype.sendAll = function (protocol, topic, payload) {
    this.send(protocol, topic, payload, window.context);
  };
  PostMessage.prototype.start = function () {
    // Ignored, nothing to do
  };

  PostMessage.normalizeOptions = function (options) {
    if (typeof options.catchExceptions === 'undefined') {
      options.catchExceptions = true;
      if (context.location.search && context.location.search.substring(1) === 'debug') {
        options.catchExceptions = false;
      }
    }
    return options;
  };

  PostMessage.subscribe = function (ctx, callback) {
    ctx.addEventListener('message', function (message) {
      var data;
      if (typeof message.data === 'string') {
        data = JSON.parse(message.data);
      } else {
        data = message.data;
      }
      if (!data.protocol) {
        return;
      }
      if (!data.command) {
        return;
      }
      callback(data, message);
    });
  };

  module.exports = PostMessage;
})(window);


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var BaseTransport, debugMessagingReceive, debugMessagingReceivePayload, debugMessagingSend, debugMessagingSendPayload, protocols;

  protocols = {
    Runtime: __webpack_require__(95),
    Graph: __webpack_require__(96),
    Network: __webpack_require__(97),
    Component: __webpack_require__(98)
  };

  debugMessagingReceive = __webpack_require__(3)('noflo-runtime-base:messaging:receive');

  debugMessagingReceivePayload = __webpack_require__(3)('noflo-runtime-base:messaging:receive:payload');

  debugMessagingSend = __webpack_require__(3)('noflo-runtime-base:messaging:send');

  debugMessagingSendPayload = __webpack_require__(3)('noflo-runtime-base:messaging:send:payload');

  BaseTransport = (function() {
    function BaseTransport(options) {
      var path;
      this.options = options;
      if (!this.options) {
        this.options = {};
      }
      this.version = '0.5';
      this.component = new protocols.Component(this);
      this.graph = new protocols.Graph(this);
      this.network = new protocols.Network(this);
      this.runtime = new protocols.Runtime(this);
      this.context = null;
      if (this.options.defaultGraph != null) {
        this.options.defaultGraph.baseDir = this.options.baseDir;
        path = 'default/main';
        this.context = 'none';
        this.graph.registerGraph(path, this.options.defaultGraph);
        this.network.startNetwork(this.options.defaultGraph, {
          graph: path
        }, this.context);
      }
      if ((this.options.captureOutput != null) && this.options.captureOutput) {
        this.startCapture();
      }
      if (!this.options.defaultPermissions) {
        this.options.defaultPermissions = [];
      }
      if (!this.options.permissions) {
        this.options.permissions = {};
      }
    }

    BaseTransport.prototype.canDo = function(capability, secret) {
      var permitted;
      permitted = this.getPermitted(secret);
      if (permitted.indexOf(capability) !== -1) {
        return true;
      }
      return false;
    };

    BaseTransport.prototype.getPermitted = function(secret) {
      if (!secret) {
        return this.options.defaultPermissions;
      }
      if (!this.options.permissions[secret]) {
        return [];
      }
      return this.options.permissions[secret];
    };

    BaseTransport.prototype.send = function(protocol, topic, payload, context) {
      debugMessagingSend(protocol + " " + topic);
      return debugMessagingSendPayload(payload);
    };

    BaseTransport.prototype.sendAll = function(protocol, topic, payload, context) {};

    BaseTransport.prototype.receive = function(protocol, topic, payload, context) {
      if (!payload) {
        payload = {};
      }
      debugMessagingReceive(protocol + " " + topic);
      debugMessagingReceivePayload(payload);
      this.context = context;
      switch (protocol) {
        case 'runtime':
          return this.runtime.receive(topic, payload, context);
        case 'graph':
          return this.graph.receive(topic, payload, context);
        case 'network':
          return this.network.receive(topic, payload, context);
        case 'component':
          return this.component.receive(topic, payload, context);
      }
    };

    return BaseTransport;

  })();

  module.exports = BaseTransport;

  module.exports.trace = __webpack_require__(100);

  module.exports.direct = __webpack_require__(107);

}).call(this);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var exported = {
  'noflo': __webpack_require__(0),
'noflo-runtime-postmessage': __webpack_require__(93)
};

if (window) {
  window.require = function (moduleName) {
    if (exported[moduleName]) {
      return exported[moduleName];
    }
    throw new Error('Module ' + moduleName + ' not available');
  };
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var EventEmitter, Graph, clone, mergeResolveTheirsNaive, platform, resetGraph,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = __webpack_require__(2).EventEmitter;

  clone = __webpack_require__(13);

  platform = __webpack_require__(31);

  Graph = (function(superClass) {
    extend(Graph, superClass);

    Graph.prototype.name = '';

    Graph.prototype.caseSensitive = false;

    Graph.prototype.properties = {};

    Graph.prototype.nodes = [];

    Graph.prototype.edges = [];

    Graph.prototype.initializers = [];

    Graph.prototype.exports = [];

    Graph.prototype.inports = {};

    Graph.prototype.outports = {};

    Graph.prototype.groups = [];

    function Graph(name1, options) {
      this.name = name1 != null ? name1 : '';
      if (options == null) {
        options = {};
      }
      this.properties = {};
      this.nodes = [];
      this.edges = [];
      this.initializers = [];
      this.exports = [];
      this.inports = {};
      this.outports = {};
      this.groups = [];
      this.transaction = {
        id: null,
        depth: 0
      };
      this.caseSensitive = options.caseSensitive || false;
    }

    Graph.prototype.getPortName = function(port) {
      if (this.caseSensitive) {
        return port;
      } else {
        return port.toLowerCase();
      }
    };

    Graph.prototype.startTransaction = function(id, metadata) {
      if (this.transaction.id) {
        throw Error("Nested transactions not supported");
      }
      this.transaction.id = id;
      this.transaction.depth = 1;
      return this.emit('startTransaction', id, metadata);
    };

    Graph.prototype.endTransaction = function(id, metadata) {
      if (!this.transaction.id) {
        throw Error("Attempted to end non-existing transaction");
      }
      this.transaction.id = null;
      this.transaction.depth = 0;
      return this.emit('endTransaction', id, metadata);
    };

    Graph.prototype.checkTransactionStart = function() {
      if (!this.transaction.id) {
        return this.startTransaction('implicit');
      } else if (this.transaction.id === 'implicit') {
        return this.transaction.depth += 1;
      }
    };

    Graph.prototype.checkTransactionEnd = function() {
      if (this.transaction.id === 'implicit') {
        this.transaction.depth -= 1;
      }
      if (this.transaction.depth === 0) {
        return this.endTransaction('implicit');
      }
    };

    Graph.prototype.setProperties = function(properties) {
      var before, item, val;
      this.checkTransactionStart();
      before = clone(this.properties);
      for (item in properties) {
        val = properties[item];
        this.properties[item] = val;
      }
      this.emit('changeProperties', this.properties, before);
      return this.checkTransactionEnd();
    };

    Graph.prototype.addExport = function(publicPort, nodeKey, portKey, metadata) {
      var exported;
      if (metadata == null) {
        metadata = {
          x: 0,
          y: 0
        };
      }
      platform.deprecated('fbp-graph.Graph exports is deprecated: please use specific inport or outport instead');
      if (!this.getNode(nodeKey)) {
        return;
      }
      this.checkTransactionStart();
      exported = {
        "public": this.getPortName(publicPort),
        process: nodeKey,
        port: this.getPortName(portKey),
        metadata: metadata
      };
      this.exports.push(exported);
      this.emit('addExport', exported);
      return this.checkTransactionEnd();
    };

    Graph.prototype.removeExport = function(publicPort) {
      var exported, found, i, idx, len, ref;
      platform.deprecated('fbp-graph.Graph exports is deprecated: please use specific inport or outport instead');
      publicPort = this.getPortName(publicPort);
      found = null;
      ref = this.exports;
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        exported = ref[idx];
        if (exported["public"] === publicPort) {
          found = exported;
        }
      }
      if (!found) {
        return;
      }
      this.checkTransactionStart();
      this.exports.splice(this.exports.indexOf(found), 1);
      this.emit('removeExport', found);
      return this.checkTransactionEnd();
    };

    Graph.prototype.addInport = function(publicPort, nodeKey, portKey, metadata) {
      if (!this.getNode(nodeKey)) {
        return;
      }
      publicPort = this.getPortName(publicPort);
      this.checkTransactionStart();
      this.inports[publicPort] = {
        process: nodeKey,
        port: this.getPortName(portKey),
        metadata: metadata
      };
      this.emit('addInport', publicPort, this.inports[publicPort]);
      return this.checkTransactionEnd();
    };

    Graph.prototype.removeInport = function(publicPort) {
      var port;
      publicPort = this.getPortName(publicPort);
      if (!this.inports[publicPort]) {
        return;
      }
      this.checkTransactionStart();
      port = this.inports[publicPort];
      this.setInportMetadata(publicPort, {});
      delete this.inports[publicPort];
      this.emit('removeInport', publicPort, port);
      return this.checkTransactionEnd();
    };

    Graph.prototype.renameInport = function(oldPort, newPort) {
      oldPort = this.getPortName(oldPort);
      newPort = this.getPortName(newPort);
      if (!this.inports[oldPort]) {
        return;
      }
      this.checkTransactionStart();
      this.inports[newPort] = this.inports[oldPort];
      delete this.inports[oldPort];
      this.emit('renameInport', oldPort, newPort);
      return this.checkTransactionEnd();
    };

    Graph.prototype.setInportMetadata = function(publicPort, metadata) {
      var before, item, val;
      publicPort = this.getPortName(publicPort);
      if (!this.inports[publicPort]) {
        return;
      }
      this.checkTransactionStart();
      before = clone(this.inports[publicPort].metadata);
      if (!this.inports[publicPort].metadata) {
        this.inports[publicPort].metadata = {};
      }
      for (item in metadata) {
        val = metadata[item];
        if (val != null) {
          this.inports[publicPort].metadata[item] = val;
        } else {
          delete this.inports[publicPort].metadata[item];
        }
      }
      this.emit('changeInport', publicPort, this.inports[publicPort], before);
      return this.checkTransactionEnd();
    };

    Graph.prototype.addOutport = function(publicPort, nodeKey, portKey, metadata) {
      if (!this.getNode(nodeKey)) {
        return;
      }
      publicPort = this.getPortName(publicPort);
      this.checkTransactionStart();
      this.outports[publicPort] = {
        process: nodeKey,
        port: this.getPortName(portKey),
        metadata: metadata
      };
      this.emit('addOutport', publicPort, this.outports[publicPort]);
      return this.checkTransactionEnd();
    };

    Graph.prototype.removeOutport = function(publicPort) {
      var port;
      publicPort = this.getPortName(publicPort);
      if (!this.outports[publicPort]) {
        return;
      }
      this.checkTransactionStart();
      port = this.outports[publicPort];
      this.setOutportMetadata(publicPort, {});
      delete this.outports[publicPort];
      this.emit('removeOutport', publicPort, port);
      return this.checkTransactionEnd();
    };

    Graph.prototype.renameOutport = function(oldPort, newPort) {
      oldPort = this.getPortName(oldPort);
      newPort = this.getPortName(newPort);
      if (!this.outports[oldPort]) {
        return;
      }
      this.checkTransactionStart();
      this.outports[newPort] = this.outports[oldPort];
      delete this.outports[oldPort];
      this.emit('renameOutport', oldPort, newPort);
      return this.checkTransactionEnd();
    };

    Graph.prototype.setOutportMetadata = function(publicPort, metadata) {
      var before, item, val;
      publicPort = this.getPortName(publicPort);
      if (!this.outports[publicPort]) {
        return;
      }
      this.checkTransactionStart();
      before = clone(this.outports[publicPort].metadata);
      if (!this.outports[publicPort].metadata) {
        this.outports[publicPort].metadata = {};
      }
      for (item in metadata) {
        val = metadata[item];
        if (val != null) {
          this.outports[publicPort].metadata[item] = val;
        } else {
          delete this.outports[publicPort].metadata[item];
        }
      }
      this.emit('changeOutport', publicPort, this.outports[publicPort], before);
      return this.checkTransactionEnd();
    };

    Graph.prototype.addGroup = function(group, nodes, metadata) {
      var g;
      this.checkTransactionStart();
      g = {
        name: group,
        nodes: nodes,
        metadata: metadata
      };
      this.groups.push(g);
      this.emit('addGroup', g);
      return this.checkTransactionEnd();
    };

    Graph.prototype.renameGroup = function(oldName, newName) {
      var group, i, len, ref;
      this.checkTransactionStart();
      ref = this.groups;
      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
        if (!group) {
          continue;
        }
        if (group.name !== oldName) {
          continue;
        }
        group.name = newName;
        this.emit('renameGroup', oldName, newName);
      }
      return this.checkTransactionEnd();
    };

    Graph.prototype.removeGroup = function(groupName) {
      var group, i, len, ref;
      this.checkTransactionStart();
      ref = this.groups;
      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
        if (!group) {
          continue;
        }
        if (group.name !== groupName) {
          continue;
        }
        this.setGroupMetadata(group.name, {});
        this.groups.splice(this.groups.indexOf(group), 1);
        this.emit('removeGroup', group);
      }
      return this.checkTransactionEnd();
    };

    Graph.prototype.setGroupMetadata = function(groupName, metadata) {
      var before, group, i, item, len, ref, val;
      this.checkTransactionStart();
      ref = this.groups;
      for (i = 0, len = ref.length; i < len; i++) {
        group = ref[i];
        if (!group) {
          continue;
        }
        if (group.name !== groupName) {
          continue;
        }
        before = clone(group.metadata);
        for (item in metadata) {
          val = metadata[item];
          if (val != null) {
            group.metadata[item] = val;
          } else {
            delete group.metadata[item];
          }
        }
        this.emit('changeGroup', group, before);
      }
      return this.checkTransactionEnd();
    };

    Graph.prototype.addNode = function(id, component, metadata) {
      var node;
      this.checkTransactionStart();
      if (!metadata) {
        metadata = {};
      }
      node = {
        id: id,
        component: component,
        metadata: metadata
      };
      this.nodes.push(node);
      this.emit('addNode', node);
      this.checkTransactionEnd();
      return node;
    };

    Graph.prototype.removeNode = function(id) {
      var edge, exported, group, i, index, initializer, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, len8, m, n, node, o, p, priv, pub, q, ref, ref1, ref2, ref3, ref4, ref5, toRemove;
      node = this.getNode(id);
      if (!node) {
        return;
      }
      this.checkTransactionStart();
      toRemove = [];
      ref = this.edges;
      for (i = 0, len = ref.length; i < len; i++) {
        edge = ref[i];
        if ((edge.from.node === node.id) || (edge.to.node === node.id)) {
          toRemove.push(edge);
        }
      }
      for (j = 0, len1 = toRemove.length; j < len1; j++) {
        edge = toRemove[j];
        this.removeEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port);
      }
      toRemove = [];
      ref1 = this.initializers;
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        initializer = ref1[k];
        if (initializer.to.node === node.id) {
          toRemove.push(initializer);
        }
      }
      for (l = 0, len3 = toRemove.length; l < len3; l++) {
        initializer = toRemove[l];
        this.removeInitial(initializer.to.node, initializer.to.port);
      }
      toRemove = [];
      ref2 = this.exports;
      for (m = 0, len4 = ref2.length; m < len4; m++) {
        exported = ref2[m];
        if (this.getPortName(id) === exported.process) {
          toRemove.push(exported);
        }
      }
      for (n = 0, len5 = toRemove.length; n < len5; n++) {
        exported = toRemove[n];
        this.removeExport(exported["public"]);
      }
      toRemove = [];
      ref3 = this.inports;
      for (pub in ref3) {
        priv = ref3[pub];
        if (priv.process === id) {
          toRemove.push(pub);
        }
      }
      for (o = 0, len6 = toRemove.length; o < len6; o++) {
        pub = toRemove[o];
        this.removeInport(pub);
      }
      toRemove = [];
      ref4 = this.outports;
      for (pub in ref4) {
        priv = ref4[pub];
        if (priv.process === id) {
          toRemove.push(pub);
        }
      }
      for (p = 0, len7 = toRemove.length; p < len7; p++) {
        pub = toRemove[p];
        this.removeOutport(pub);
      }
      ref5 = this.groups;
      for (q = 0, len8 = ref5.length; q < len8; q++) {
        group = ref5[q];
        if (!group) {
          continue;
        }
        index = group.nodes.indexOf(id);
        if (index === -1) {
          continue;
        }
        group.nodes.splice(index, 1);
      }
      this.setNodeMetadata(id, {});
      if (-1 !== this.nodes.indexOf(node)) {
        this.nodes.splice(this.nodes.indexOf(node), 1);
      }
      this.emit('removeNode', node);
      return this.checkTransactionEnd();
    };

    Graph.prototype.getNode = function(id) {
      var i, len, node, ref;
      ref = this.nodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        if (!node) {
          continue;
        }
        if (node.id === id) {
          return node;
        }
      }
      return null;
    };

    Graph.prototype.renameNode = function(oldId, newId) {
      var edge, exported, group, i, iip, index, j, k, l, len, len1, len2, len3, node, priv, pub, ref, ref1, ref2, ref3, ref4, ref5;
      this.checkTransactionStart();
      node = this.getNode(oldId);
      if (!node) {
        return;
      }
      node.id = newId;
      ref = this.edges;
      for (i = 0, len = ref.length; i < len; i++) {
        edge = ref[i];
        if (!edge) {
          continue;
        }
        if (edge.from.node === oldId) {
          edge.from.node = newId;
        }
        if (edge.to.node === oldId) {
          edge.to.node = newId;
        }
      }
      ref1 = this.initializers;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        iip = ref1[j];
        if (!iip) {
          continue;
        }
        if (iip.to.node === oldId) {
          iip.to.node = newId;
        }
      }
      ref2 = this.inports;
      for (pub in ref2) {
        priv = ref2[pub];
        if (priv.process === oldId) {
          priv.process = newId;
        }
      }
      ref3 = this.outports;
      for (pub in ref3) {
        priv = ref3[pub];
        if (priv.process === oldId) {
          priv.process = newId;
        }
      }
      ref4 = this.exports;
      for (k = 0, len2 = ref4.length; k < len2; k++) {
        exported = ref4[k];
        if (exported.process === oldId) {
          exported.process = newId;
        }
      }
      ref5 = this.groups;
      for (l = 0, len3 = ref5.length; l < len3; l++) {
        group = ref5[l];
        if (!group) {
          continue;
        }
        index = group.nodes.indexOf(oldId);
        if (index === -1) {
          continue;
        }
        group.nodes[index] = newId;
      }
      this.emit('renameNode', oldId, newId);
      return this.checkTransactionEnd();
    };

    Graph.prototype.setNodeMetadata = function(id, metadata) {
      var before, item, node, val;
      node = this.getNode(id);
      if (!node) {
        return;
      }
      this.checkTransactionStart();
      before = clone(node.metadata);
      if (!node.metadata) {
        node.metadata = {};
      }
      for (item in metadata) {
        val = metadata[item];
        if (val != null) {
          node.metadata[item] = val;
        } else {
          delete node.metadata[item];
        }
      }
      this.emit('changeNode', node, before);
      return this.checkTransactionEnd();
    };

    Graph.prototype.addEdge = function(outNode, outPort, inNode, inPort, metadata) {
      var edge, i, len, ref;
      if (metadata == null) {
        metadata = {};
      }
      outPort = this.getPortName(outPort);
      inPort = this.getPortName(inPort);
      ref = this.edges;
      for (i = 0, len = ref.length; i < len; i++) {
        edge = ref[i];
        if (edge.from.node === outNode && edge.from.port === outPort && edge.to.node === inNode && edge.to.port === inPort) {
          return;
        }
      }
      if (!this.getNode(outNode)) {
        return;
      }
      if (!this.getNode(inNode)) {
        return;
      }
      this.checkTransactionStart();
      edge = {
        from: {
          node: outNode,
          port: outPort
        },
        to: {
          node: inNode,
          port: inPort
        },
        metadata: metadata
      };
      this.edges.push(edge);
      this.emit('addEdge', edge);
      this.checkTransactionEnd();
      return edge;
    };

    Graph.prototype.addEdgeIndex = function(outNode, outPort, outIndex, inNode, inPort, inIndex, metadata) {
      var edge;
      if (metadata == null) {
        metadata = {};
      }
      if (!this.getNode(outNode)) {
        return;
      }
      if (!this.getNode(inNode)) {
        return;
      }
      outPort = this.getPortName(outPort);
      inPort = this.getPortName(inPort);
      if (inIndex === null) {
        inIndex = void 0;
      }
      if (outIndex === null) {
        outIndex = void 0;
      }
      if (!metadata) {
        metadata = {};
      }
      this.checkTransactionStart();
      edge = {
        from: {
          node: outNode,
          port: outPort,
          index: outIndex
        },
        to: {
          node: inNode,
          port: inPort,
          index: inIndex
        },
        metadata: metadata
      };
      this.edges.push(edge);
      this.emit('addEdge', edge);
      this.checkTransactionEnd();
      return edge;
    };

    Graph.prototype.removeEdge = function(node, port, node2, port2) {
      var edge, i, index, j, k, len, len1, len2, ref, ref1, toKeep, toRemove;
      this.checkTransactionStart();
      port = this.getPortName(port);
      port2 = this.getPortName(port2);
      toRemove = [];
      toKeep = [];
      if (node2 && port2) {
        ref = this.edges;
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
          edge = ref[index];
          if (edge.from.node === node && edge.from.port === port && edge.to.node === node2 && edge.to.port === port2) {
            this.setEdgeMetadata(edge.from.node, edge.from.port, edge.to.node, edge.to.port, {});
            toRemove.push(edge);
          } else {
            toKeep.push(edge);
          }
        }
      } else {
        ref1 = this.edges;
        for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
          edge = ref1[index];
          if ((edge.from.node === node && edge.from.port === port) || (edge.to.node === node && edge.to.port === port)) {
            this.setEdgeMetadata(edge.from.node, edge.from.port, edge.to.node, edge.to.port, {});
            toRemove.push(edge);
          } else {
            toKeep.push(edge);
          }
        }
      }
      this.edges = toKeep;
      for (k = 0, len2 = toRemove.length; k < len2; k++) {
        edge = toRemove[k];
        this.emit('removeEdge', edge);
      }
      return this.checkTransactionEnd();
    };

    Graph.prototype.getEdge = function(node, port, node2, port2) {
      var edge, i, index, len, ref;
      port = this.getPortName(port);
      port2 = this.getPortName(port2);
      ref = this.edges;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        edge = ref[index];
        if (!edge) {
          continue;
        }
        if (edge.from.node === node && edge.from.port === port) {
          if (edge.to.node === node2 && edge.to.port === port2) {
            return edge;
          }
        }
      }
      return null;
    };

    Graph.prototype.setEdgeMetadata = function(node, port, node2, port2, metadata) {
      var before, edge, item, val;
      edge = this.getEdge(node, port, node2, port2);
      if (!edge) {
        return;
      }
      this.checkTransactionStart();
      before = clone(edge.metadata);
      if (!edge.metadata) {
        edge.metadata = {};
      }
      for (item in metadata) {
        val = metadata[item];
        if (val != null) {
          edge.metadata[item] = val;
        } else {
          delete edge.metadata[item];
        }
      }
      this.emit('changeEdge', edge, before);
      return this.checkTransactionEnd();
    };

    Graph.prototype.addInitial = function(data, node, port, metadata) {
      var initializer;
      if (!this.getNode(node)) {
        return;
      }
      port = this.getPortName(port);
      this.checkTransactionStart();
      initializer = {
        from: {
          data: data
        },
        to: {
          node: node,
          port: port
        },
        metadata: metadata
      };
      this.initializers.push(initializer);
      this.emit('addInitial', initializer);
      this.checkTransactionEnd();
      return initializer;
    };

    Graph.prototype.addInitialIndex = function(data, node, port, index, metadata) {
      var initializer;
      if (!this.getNode(node)) {
        return;
      }
      if (index === null) {
        index = void 0;
      }
      port = this.getPortName(port);
      this.checkTransactionStart();
      initializer = {
        from: {
          data: data
        },
        to: {
          node: node,
          port: port,
          index: index
        },
        metadata: metadata
      };
      this.initializers.push(initializer);
      this.emit('addInitial', initializer);
      this.checkTransactionEnd();
      return initializer;
    };

    Graph.prototype.addGraphInitial = function(data, node, metadata) {
      var inport;
      inport = this.inports[node];
      if (!inport) {
        return;
      }
      return this.addInitial(data, inport.process, inport.port, metadata);
    };

    Graph.prototype.addGraphInitialIndex = function(data, node, index, metadata) {
      var inport;
      inport = this.inports[node];
      if (!inport) {
        return;
      }
      return this.addInitialIndex(data, inport.process, inport.port, index, metadata);
    };

    Graph.prototype.removeInitial = function(node, port) {
      var edge, i, index, j, len, len1, ref, toKeep, toRemove;
      port = this.getPortName(port);
      this.checkTransactionStart();
      toRemove = [];
      toKeep = [];
      ref = this.initializers;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        edge = ref[index];
        if (edge.to.node === node && edge.to.port === port) {
          toRemove.push(edge);
        } else {
          toKeep.push(edge);
        }
      }
      this.initializers = toKeep;
      for (j = 0, len1 = toRemove.length; j < len1; j++) {
        edge = toRemove[j];
        this.emit('removeInitial', edge);
      }
      return this.checkTransactionEnd();
    };

    Graph.prototype.removeGraphInitial = function(node) {
      var inport;
      inport = this.inports[node];
      if (!inport) {
        return;
      }
      return this.removeInitial(inport.process, inport.port);
    };

    Graph.prototype.toDOT = function() {
      var cleanID, cleanPort, data, dot, edge, i, id, initializer, j, k, len, len1, len2, node, ref, ref1, ref2;
      cleanID = function(id) {
        return id.replace(/\s*/g, "");
      };
      cleanPort = function(port) {
        return port.replace(/\./g, "");
      };
      dot = "digraph {\n";
      ref = this.nodes;
      for (i = 0, len = ref.length; i < len; i++) {
        node = ref[i];
        dot += "    " + (cleanID(node.id)) + " [label=" + node.id + " shape=box]\n";
      }
      ref1 = this.initializers;
      for (id = j = 0, len1 = ref1.length; j < len1; id = ++j) {
        initializer = ref1[id];
        if (typeof initializer.from.data === 'function') {
          data = 'Function';
        } else {
          data = initializer.from.data;
        }
        dot += "    data" + id + " [label=\"'" + data + "'\" shape=plaintext]\n";
        dot += "    data" + id + " -> " + (cleanID(initializer.to.node)) + "[headlabel=" + (cleanPort(initializer.to.port)) + " labelfontcolor=blue labelfontsize=8.0]\n";
      }
      ref2 = this.edges;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        edge = ref2[k];
        dot += "    " + (cleanID(edge.from.node)) + " -> " + (cleanID(edge.to.node)) + "[taillabel=" + (cleanPort(edge.from.port)) + " headlabel=" + (cleanPort(edge.to.port)) + " labelfontcolor=blue labelfontsize=8.0]\n";
      }
      dot += "}";
      return dot;
    };

    Graph.prototype.toYUML = function() {
      var edge, i, initializer, j, len, len1, ref, ref1, yuml;
      yuml = [];
      ref = this.initializers;
      for (i = 0, len = ref.length; i < len; i++) {
        initializer = ref[i];
        yuml.push("(start)[" + initializer.to.port + "]->(" + initializer.to.node + ")");
      }
      ref1 = this.edges;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        edge = ref1[j];
        yuml.push("(" + edge.from.node + ")[" + edge.from.port + "]->(" + edge.to.node + ")");
      }
      return yuml.join(",");
    };

    Graph.prototype.toJSON = function() {
      var connection, edge, exported, group, groupData, i, initializer, j, json, k, l, len, len1, len2, len3, len4, m, node, priv, property, pub, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, value;
      json = {
        caseSensitive: this.caseSensitive,
        properties: {},
        inports: {},
        outports: {},
        groups: [],
        processes: {},
        connections: []
      };
      if (this.name) {
        json.properties.name = this.name;
      }
      ref = this.properties;
      for (property in ref) {
        value = ref[property];
        json.properties[property] = value;
      }
      ref1 = this.inports;
      for (pub in ref1) {
        priv = ref1[pub];
        json.inports[pub] = priv;
      }
      ref2 = this.outports;
      for (pub in ref2) {
        priv = ref2[pub];
        json.outports[pub] = priv;
      }
      ref3 = this.exports;
      for (i = 0, len = ref3.length; i < len; i++) {
        exported = ref3[i];
        if (!json.exports) {
          json.exports = [];
        }
        json.exports.push(exported);
      }
      ref4 = this.groups;
      for (j = 0, len1 = ref4.length; j < len1; j++) {
        group = ref4[j];
        groupData = {
          name: group.name,
          nodes: group.nodes
        };
        if (Object.keys(group.metadata).length) {
          groupData.metadata = group.metadata;
        }
        json.groups.push(groupData);
      }
      ref5 = this.nodes;
      for (k = 0, len2 = ref5.length; k < len2; k++) {
        node = ref5[k];
        json.processes[node.id] = {
          component: node.component
        };
        if (node.metadata) {
          json.processes[node.id].metadata = node.metadata;
        }
      }
      ref6 = this.edges;
      for (l = 0, len3 = ref6.length; l < len3; l++) {
        edge = ref6[l];
        connection = {
          src: {
            process: edge.from.node,
            port: edge.from.port,
            index: edge.from.index
          },
          tgt: {
            process: edge.to.node,
            port: edge.to.port,
            index: edge.to.index
          }
        };
        if (Object.keys(edge.metadata).length) {
          connection.metadata = edge.metadata;
        }
        json.connections.push(connection);
      }
      ref7 = this.initializers;
      for (m = 0, len4 = ref7.length; m < len4; m++) {
        initializer = ref7[m];
        json.connections.push({
          data: initializer.from.data,
          tgt: {
            process: initializer.to.node,
            port: initializer.to.port,
            index: initializer.to.index
          }
        });
      }
      return json;
    };

    Graph.prototype.save = function(file, callback) {
      var json;
      if (platform.isBrowser()) {
        return callback(new Error("Saving graphs not supported on browser"));
      }
      json = JSON.stringify(this.toJSON(), null, 4);
      return __webpack_require__(6).writeFile(file + ".json", json, "utf-8", function(err, data) {
        if (err) {
          throw err;
        }
        return callback(file);
      });
    };

    return Graph;

  })(EventEmitter);

  exports.Graph = Graph;

  exports.createGraph = function(name, options) {
    return new Graph(name, options);
  };

  exports.loadJSON = function(definition, callback, metadata) {
    var caseSensitive, conn, def, exported, graph, group, i, id, j, k, len, len1, len2, portId, priv, processId, properties, property, pub, ref, ref1, ref2, ref3, ref4, ref5, ref6, split, value;
    if (metadata == null) {
      metadata = {};
    }
    if (typeof definition === 'string') {
      definition = JSON.parse(definition);
    }
    if (!definition.properties) {
      definition.properties = {};
    }
    if (!definition.processes) {
      definition.processes = {};
    }
    if (!definition.connections) {
      definition.connections = [];
    }
    caseSensitive = definition.caseSensitive || false;
    graph = new Graph(definition.properties.name, {
      caseSensitive: caseSensitive
    });
    graph.startTransaction('loadJSON', metadata);
    properties = {};
    ref = definition.properties;
    for (property in ref) {
      value = ref[property];
      if (property === 'name') {
        continue;
      }
      properties[property] = value;
    }
    graph.setProperties(properties);
    ref1 = definition.processes;
    for (id in ref1) {
      def = ref1[id];
      if (!def.metadata) {
        def.metadata = {};
      }
      graph.addNode(id, def.component, def.metadata);
    }
    ref2 = definition.connections;
    for (i = 0, len = ref2.length; i < len; i++) {
      conn = ref2[i];
      metadata = conn.metadata ? conn.metadata : {};
      if (conn.data !== void 0) {
        if (typeof conn.tgt.index === 'number') {
          graph.addInitialIndex(conn.data, conn.tgt.process, graph.getPortName(conn.tgt.port), conn.tgt.index, metadata);
        } else {
          graph.addInitial(conn.data, conn.tgt.process, graph.getPortName(conn.tgt.port), metadata);
        }
        continue;
      }
      if (typeof conn.src.index === 'number' || typeof conn.tgt.index === 'number') {
        graph.addEdgeIndex(conn.src.process, graph.getPortName(conn.src.port), conn.src.index, conn.tgt.process, graph.getPortName(conn.tgt.port), conn.tgt.index, metadata);
        continue;
      }
      graph.addEdge(conn.src.process, graph.getPortName(conn.src.port), conn.tgt.process, graph.getPortName(conn.tgt.port), metadata);
    }
    if (definition.exports && definition.exports.length) {
      ref3 = definition.exports;
      for (j = 0, len1 = ref3.length; j < len1; j++) {
        exported = ref3[j];
        if (exported["private"]) {
          split = exported["private"].split('.');
          if (split.length !== 2) {
            continue;
          }
          processId = split[0];
          portId = split[1];
          for (id in definition.processes) {
            if (graph.getPortName(id) === graph.getPortName(processId)) {
              processId = id;
            }
          }
        } else {
          processId = exported.process;
          portId = graph.getPortName(exported.port);
        }
        graph.addExport(exported["public"], processId, portId, exported.metadata);
      }
    }
    if (definition.inports) {
      ref4 = definition.inports;
      for (pub in ref4) {
        priv = ref4[pub];
        graph.addInport(pub, priv.process, graph.getPortName(priv.port), priv.metadata);
      }
    }
    if (definition.outports) {
      ref5 = definition.outports;
      for (pub in ref5) {
        priv = ref5[pub];
        graph.addOutport(pub, priv.process, graph.getPortName(priv.port), priv.metadata);
      }
    }
    if (definition.groups) {
      ref6 = definition.groups;
      for (k = 0, len2 = ref6.length; k < len2; k++) {
        group = ref6[k];
        graph.addGroup(group.name, group.nodes, group.metadata || {});
      }
    }
    graph.endTransaction('loadJSON');
    return callback(null, graph);
  };

  exports.loadFBP = function(fbpData, callback, metadata, caseSensitive) {
    var definition, e, error;
    if (metadata == null) {
      metadata = {};
    }
    if (caseSensitive == null) {
      caseSensitive = false;
    }
    try {
      definition = __webpack_require__(32).parse(fbpData, {
        caseSensitive: caseSensitive
      });
    } catch (error) {
      e = error;
      return callback(e);
    }
    return exports.loadJSON(definition, callback, metadata);
  };

  exports.loadHTTP = function(url, callback) {
    var req;
    req = new XMLHttpRequest;
    req.onreadystatechange = function() {
      if (req.readyState !== 4) {
        return;
      }
      if (req.status !== 200) {
        return callback(new Error("Failed to load " + url + ": HTTP " + req.status));
      }
      return callback(null, req.responseText);
    };
    req.open('GET', url, true);
    return req.send();
  };

  exports.loadFile = function(file, callback, metadata, caseSensitive) {
    if (metadata == null) {
      metadata = {};
    }
    if (caseSensitive == null) {
      caseSensitive = false;
    }
    if (platform.isBrowser()) {
      exports.loadHTTP(file, function(err, data) {
        var definition;
        if (err) {
          return callback(err);
        }
        if (file.split('.').pop() === 'fbp') {
          return exports.loadFBP(data, callback, metadata);
        }
        definition = JSON.parse(data);
        return exports.loadJSON(definition, callback, metadata);
      });
      return;
    }
    return __webpack_require__(6).readFile(file, "utf-8", function(err, data) {
      var definition;
      if (err) {
        return callback(err);
      }
      if (file.split('.').pop() === 'fbp') {
        return exports.loadFBP(data, callback, {}, caseSensitive);
      }
      definition = JSON.parse(data);
      return exports.loadJSON(definition, callback, {});
    });
  };

  resetGraph = function(graph) {
    var edge, exp, group, i, iip, j, k, l, len, len1, len2, len3, len4, m, node, port, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, v;
    ref = (clone(graph.groups)).reverse();
    for (i = 0, len = ref.length; i < len; i++) {
      group = ref[i];
      if (group != null) {
        graph.removeGroup(group.name);
      }
    }
    ref1 = clone(graph.outports);
    for (port in ref1) {
      v = ref1[port];
      graph.removeOutport(port);
    }
    ref2 = clone(graph.inports);
    for (port in ref2) {
      v = ref2[port];
      graph.removeInport(port);
    }
    ref3 = clone(graph.exports.reverse());
    for (j = 0, len1 = ref3.length; j < len1; j++) {
      exp = ref3[j];
      graph.removeExport(exp["public"]);
    }
    graph.setProperties({});
    ref4 = (clone(graph.initializers)).reverse();
    for (k = 0, len2 = ref4.length; k < len2; k++) {
      iip = ref4[k];
      graph.removeInitial(iip.to.node, iip.to.port);
    }
    ref5 = (clone(graph.edges)).reverse();
    for (l = 0, len3 = ref5.length; l < len3; l++) {
      edge = ref5[l];
      graph.removeEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port);
    }
    ref6 = (clone(graph.nodes)).reverse();
    results = [];
    for (m = 0, len4 = ref6.length; m < len4; m++) {
      node = ref6[m];
      results.push(graph.removeNode(node.id));
    }
    return results;
  };

  mergeResolveTheirsNaive = function(base, to) {
    var edge, exp, group, i, iip, j, k, l, len, len1, len2, len3, len4, m, node, priv, pub, ref, ref1, ref2, ref3, ref4, ref5, ref6, results;
    resetGraph(base);
    ref = to.nodes;
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i];
      base.addNode(node.id, node.component, node.metadata);
    }
    ref1 = to.edges;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      edge = ref1[j];
      base.addEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port, edge.metadata);
    }
    ref2 = to.initializers;
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      iip = ref2[k];
      base.addInitial(iip.from.data, iip.to.node, iip.to.port, iip.metadata);
    }
    ref3 = to.exports;
    for (l = 0, len3 = ref3.length; l < len3; l++) {
      exp = ref3[l];
      base.addExport(exp["public"], exp.node, exp.port, exp.metadata);
    }
    base.setProperties(to.properties);
    ref4 = to.inports;
    for (pub in ref4) {
      priv = ref4[pub];
      base.addInport(pub, priv.process, priv.port, priv.metadata);
    }
    ref5 = to.outports;
    for (pub in ref5) {
      priv = ref5[pub];
      base.addOutport(pub, priv.process, priv.port, priv.metadata);
    }
    ref6 = to.groups;
    results = [];
    for (m = 0, len4 = ref6.length; m < len4; m++) {
      group = ref6[m];
      results.push(base.addGroup(group.name, group.nodes, group.metadata));
    }
    return results;
  };

  exports.equivalent = function(a, b, options) {
    var A, B;
    if (options == null) {
      options = {};
    }
    A = JSON.stringify(a);
    B = JSON.stringify(b);
    return A === B;
  };

  exports.mergeResolveTheirs = mergeResolveTheirsNaive;

}).call(this);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 29 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  exports.isBrowser = function() {
    if (typeof process !== 'undefined' && process.execPath && process.execPath.match(/node|iojs/)) {
      return false;
    }
    return true;
  };

  exports.deprecated = function(message) {
    if (exports.isBrowser()) {
      if (window.NOFLO_FATAL_DEPRECATED) {
        throw new Error(message);
      }
      console.warn(message);
      return;
    }
    if (process.env.NOFLO_FATAL_DEPRECATED) {
      throw new Error(message);
    }
    return console.warn(message);
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function() { return parser.getResult();  },
        peg$c1 = "EXPORT=",
        peg$c2 = { type: "literal", value: "EXPORT=", description: "\"EXPORT=\"" },
        peg$c3 = ":",
        peg$c4 = { type: "literal", value: ":", description: "\":\"" },
        peg$c5 = function(priv, pub) {return parser.registerExports(priv,pub)},
        peg$c6 = "INPORT=",
        peg$c7 = { type: "literal", value: "INPORT=", description: "\"INPORT=\"" },
        peg$c8 = ".",
        peg$c9 = { type: "literal", value: ".", description: "\".\"" },
        peg$c10 = function(node, port, pub) {return parser.registerInports(node,port,pub)},
        peg$c11 = "OUTPORT=",
        peg$c12 = { type: "literal", value: "OUTPORT=", description: "\"OUTPORT=\"" },
        peg$c13 = function(node, port, pub) {return parser.registerOutports(node,port,pub)},
        peg$c14 = "DEFAULT_INPORT=",
        peg$c15 = { type: "literal", value: "DEFAULT_INPORT=", description: "\"DEFAULT_INPORT=\"" },
        peg$c16 = function(name) { defaultInPort = name},
        peg$c17 = "DEFAULT_OUTPORT=",
        peg$c18 = { type: "literal", value: "DEFAULT_OUTPORT=", description: "\"DEFAULT_OUTPORT=\"" },
        peg$c19 = function(name) { defaultOutPort = name},
        peg$c20 = /^[\n\r\u2028\u2029]/,
        peg$c21 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
        peg$c22 = function(edges) {return parser.registerEdges(edges);},
        peg$c23 = ",",
        peg$c24 = { type: "literal", value: ",", description: "\",\"" },
        peg$c25 = "#",
        peg$c26 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c27 = "->",
        peg$c28 = { type: "literal", value: "->", description: "\"->\"" },
        peg$c29 = function(x, y) { return [x,y]; },
        peg$c30 = function(x, proc, y) { return [{"tgt":makeInPort(proc, x)},{"src":makeOutPort(proc, y)}]; },
        peg$c31 = function(proc, port) { return {"src":makeOutPort(proc, port)} },
        peg$c32 = function(port, proc) { return {"tgt":makeInPort(proc, port)} },
        peg$c33 = "'",
        peg$c34 = { type: "literal", value: "'", description: "\"'\"" },
        peg$c35 = function(iip) { return {"data":iip.join("")} },
        peg$c36 = function(iip) { return {"data":iip} },
        peg$c37 = function(name) { return name},
        peg$c38 = /^[a-zA-Z_]/,
        peg$c39 = { type: "class", value: "[a-zA-Z_]", description: "[a-zA-Z_]" },
        peg$c40 = /^[a-zA-Z0-9_\-]/,
        peg$c41 = { type: "class", value: "[a-zA-Z0-9_\\-]", description: "[a-zA-Z0-9_\\-]" },
        peg$c42 = function(name) { return makeName(name)},
        peg$c43 = function(name, comp) { parser.addNode(name,comp); return name},
        peg$c44 = function(comp) { return parser.addAnonymousNode(comp, location().start.offset) },
        peg$c45 = "(",
        peg$c46 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c47 = /^[a-zA-Z\/\-0-9_]/,
        peg$c48 = { type: "class", value: "[a-zA-Z/\\-0-9_]", description: "[a-zA-Z/\\-0-9_]" },
        peg$c49 = ")",
        peg$c50 = { type: "literal", value: ")", description: "\")\"" },
        peg$c51 = function(comp, meta) { var o = {}; comp ? o.comp = comp.join("") : o.comp = ''; meta ? o.meta = meta.join("").split(',') : null; return o; },
        peg$c52 = /^[a-zA-Z\/=_,0-9]/,
        peg$c53 = { type: "class", value: "[a-zA-Z/=_,0-9]", description: "[a-zA-Z/=_,0-9]" },
        peg$c54 = function(meta) {return meta},
        peg$c55 = function(portname, portindex) {return { port: options.caseSensitive? portname : portname.toLowerCase(), index: portindex != null ? portindex : undefined }},
        peg$c56 = function(port) { return port; },
        peg$c57 = /^[a-zA-Z.0-9_]/,
        peg$c58 = { type: "class", value: "[a-zA-Z.0-9_]", description: "[a-zA-Z.0-9_]" },
        peg$c59 = function(portname) {return makeName(portname)},
        peg$c60 = "[",
        peg$c61 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c62 = /^[0-9]/,
        peg$c63 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c64 = "]",
        peg$c65 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c66 = function(portindex) {return parseInt(portindex.join(''))},
        peg$c67 = /^[^\n\r\u2028\u2029]/,
        peg$c68 = { type: "class", value: "[^\\n\\r\\u2028\\u2029]", description: "[^\\n\\r\\u2028\\u2029]" },
        peg$c69 = /^[\\]/,
        peg$c70 = { type: "class", value: "[\\\\]", description: "[\\\\]" },
        peg$c71 = /^[']/,
        peg$c72 = { type: "class", value: "[']", description: "[']" },
        peg$c73 = function() { return "'"; },
        peg$c74 = /^[^']/,
        peg$c75 = { type: "class", value: "[^']", description: "[^']" },
        peg$c76 = " ",
        peg$c77 = { type: "literal", value: " ", description: "\" \"" },
        peg$c78 = function(value) { return value; },
        peg$c79 = "{",
        peg$c80 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c81 = "}",
        peg$c82 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c83 = { type: "other", description: "whitespace" },
        peg$c84 = /^[ \t\n\r]/,
        peg$c85 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c86 = "false",
        peg$c87 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c88 = function() { return false; },
        peg$c89 = "null",
        peg$c90 = { type: "literal", value: "null", description: "\"null\"" },
        peg$c91 = function() { return null;  },
        peg$c92 = "true",
        peg$c93 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c94 = function() { return true;  },
        peg$c95 = function(head, m) { return m; },
        peg$c96 = function(head, tail) {
                  var result = {}, i;

                  result[head.name] = head.value;

                  for (i = 0; i < tail.length; i++) {
                    result[tail[i].name] = tail[i].value;
                  }

                  return result;
                },
        peg$c97 = function(members) { return members !== null ? members: {}; },
        peg$c98 = function(name, value) {
                return { name: name, value: value };
              },
        peg$c99 = function(head, v) { return v; },
        peg$c100 = function(head, tail) { return [head].concat(tail); },
        peg$c101 = function(values) { return values !== null ? values : []; },
        peg$c102 = { type: "other", description: "number" },
        peg$c103 = function() { return parseFloat(text()); },
        peg$c104 = /^[1-9]/,
        peg$c105 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c106 = /^[eE]/,
        peg$c107 = { type: "class", value: "[eE]", description: "[eE]" },
        peg$c108 = "-",
        peg$c109 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c110 = "+",
        peg$c111 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c112 = "0",
        peg$c113 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c114 = { type: "other", description: "string" },
        peg$c115 = function(chars) { return chars.join(""); },
        peg$c116 = "\"",
        peg$c117 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c118 = "\\",
        peg$c119 = { type: "literal", value: "\\", description: "\"\\\\\"" },
        peg$c120 = "/",
        peg$c121 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c122 = "b",
        peg$c123 = { type: "literal", value: "b", description: "\"b\"" },
        peg$c124 = function() { return "\b"; },
        peg$c125 = "f",
        peg$c126 = { type: "literal", value: "f", description: "\"f\"" },
        peg$c127 = function() { return "\f"; },
        peg$c128 = "n",
        peg$c129 = { type: "literal", value: "n", description: "\"n\"" },
        peg$c130 = function() { return "\n"; },
        peg$c131 = "r",
        peg$c132 = { type: "literal", value: "r", description: "\"r\"" },
        peg$c133 = function() { return "\r"; },
        peg$c134 = "t",
        peg$c135 = { type: "literal", value: "t", description: "\"t\"" },
        peg$c136 = function() { return "\t"; },
        peg$c137 = "u",
        peg$c138 = { type: "literal", value: "u", description: "\"u\"" },
        peg$c139 = function(digits) {
                    return String.fromCharCode(parseInt(digits, 16));
                  },
        peg$c140 = function(sequence) { return sequence; },
        peg$c141 = /^[^\0-\x1F"\\]/,
        peg$c142 = { type: "class", value: "[^\\0-\\x1F\\x22\\x5C]", description: "[^\\0-\\x1F\\x22\\x5C]" },
        peg$c143 = /^[0-9a-f]/i,
        peg$c144 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseline();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseline();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseline() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c1) {
          s2 = peg$c1;
          peg$currPos += 7;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c2); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseportName();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s4 = peg$c3;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseportName();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseLineTerminator();
                  if (s7 === peg$FAILED) {
                    s7 = null;
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c5(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c6) {
            s2 = peg$c6;
            peg$currPos += 7;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c7); }
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsenode();
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 46) {
                s4 = peg$c8;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c9); }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseportName();
                if (s5 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 58) {
                    s6 = peg$c3;
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c4); }
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseportName();
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_();
                      if (s8 !== peg$FAILED) {
                        s9 = peg$parseLineTerminator();
                        if (s9 === peg$FAILED) {
                          s9 = null;
                        }
                        if (s9 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c10(s3, s5, s7);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c11) {
              s2 = peg$c11;
              peg$currPos += 8;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c12); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parsenode();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 46) {
                  s4 = peg$c8;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c9); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseportName();
                  if (s5 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 58) {
                      s6 = peg$c3;
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c4); }
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseportName();
                      if (s7 !== peg$FAILED) {
                        s8 = peg$parse_();
                        if (s8 !== peg$FAILED) {
                          s9 = peg$parseLineTerminator();
                          if (s9 === peg$FAILED) {
                            s9 = null;
                          }
                          if (s9 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c13(s3, s5, s7);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              if (input.substr(peg$currPos, 15) === peg$c14) {
                s2 = peg$c14;
                peg$currPos += 15;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c15); }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$parseportName();
                if (s3 !== peg$FAILED) {
                  s4 = peg$parse_();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parseLineTerminator();
                    if (s5 === peg$FAILED) {
                      s5 = null;
                    }
                    if (s5 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c16(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              s1 = peg$parse_();
              if (s1 !== peg$FAILED) {
                if (input.substr(peg$currPos, 16) === peg$c17) {
                  s2 = peg$c17;
                  peg$currPos += 16;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c18); }
                }
                if (s2 !== peg$FAILED) {
                  s3 = peg$parseportName();
                  if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                      s5 = peg$parseLineTerminator();
                      if (s5 === peg$FAILED) {
                        s5 = null;
                      }
                      if (s5 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c19(s3);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parsecomment();
                if (s1 !== peg$FAILED) {
                  if (peg$c20.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c21); }
                  }
                  if (s2 === peg$FAILED) {
                    s2 = null;
                  }
                  if (s2 !== peg$FAILED) {
                    s1 = [s1, s2];
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  s1 = peg$parse_();
                  if (s1 !== peg$FAILED) {
                    if (peg$c20.test(input.charAt(peg$currPos))) {
                      s2 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s2 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c21); }
                    }
                    if (s2 !== peg$FAILED) {
                      s1 = [s1, s2];
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    s1 = peg$parse_();
                    if (s1 !== peg$FAILED) {
                      s2 = peg$parseconnection();
                      if (s2 !== peg$FAILED) {
                        s3 = peg$parse_();
                        if (s3 !== peg$FAILED) {
                          s4 = peg$parseLineTerminator();
                          if (s4 === peg$FAILED) {
                            s4 = null;
                          }
                          if (s4 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c22(s2);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseLineTerminator() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s2 = peg$c23;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsecomment();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (peg$c20.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c21); }
            }
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s1 = [s1, s2, s3, s4];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsecomment() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 35) {
          s2 = peg$c25;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c26); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseanychar();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseanychar();
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseconnection() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parsesource();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c27) {
            s3 = peg$c27;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c28); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseconnection();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c29(s1, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsedestination();
      }

      return s0;
    }

    function peg$parsesource() {
      var s0;

      s0 = peg$parsebridge();
      if (s0 === peg$FAILED) {
        s0 = peg$parseoutport();
        if (s0 === peg$FAILED) {
          s0 = peg$parseiip();
        }
      }

      return s0;
    }

    function peg$parsedestination() {
      var s0;

      s0 = peg$parseinport();
      if (s0 === peg$FAILED) {
        s0 = peg$parsebridge();
      }

      return s0;
    }

    function peg$parsebridge() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseport__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsenode();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__port();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c30(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseport__();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsenodeWithComponent();
          if (s2 !== peg$FAILED) {
            s3 = peg$parse__port();
            if (s3 === peg$FAILED) {
              s3 = null;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c30(s1, s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseoutport() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsenode();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__port();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c31(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseinport() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseport__();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsenode();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c32(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseiip() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c33;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseiipchar();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseiipchar();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c33;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c34); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c35(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseJSON_text();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c36(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsenode() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsenodeNameAndComponent();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c37(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsenodeName();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c37(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsenodeComponent();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c37(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsenodeName() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (peg$c38.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c40.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c41); }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c40.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c42(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenodeNameAndComponent() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parsenodeName();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsecomponent();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c43(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsenodeComponent() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsecomponent();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c44(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenodeWithComponent() {
      var s0;

      s0 = peg$parsenodeNameAndComponent();
      if (s0 === peg$FAILED) {
        s0 = peg$parsenodeComponent();
      }

      return s0;
    }

    function peg$parsecomponent() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c45;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c46); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c47.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c47.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c48); }
          }
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsecompMeta();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 41) {
              s4 = peg$c49;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c50); }
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c51(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsecompMeta() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 58) {
        s1 = peg$c3;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c52.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c53); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c52.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c53); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c54(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseport() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseportName();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseportIndex();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c55(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseport__() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseport();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c56(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse__port() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseport();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c56(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseportName() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (peg$c38.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c57.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          if (peg$c57.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c58); }
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c59(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseportIndex() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c60;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c61); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c62.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c63); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c62.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s3 = peg$c64;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c65); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c66(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseanychar() {
      var s0;

      if (peg$c67.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c68); }
      }

      return s0;
    }

    function peg$parseiipchar() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c69.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c70); }
      }
      if (s1 !== peg$FAILED) {
        if (peg$c71.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c72); }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c73();
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        if (peg$c74.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c75); }
        }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (input.charCodeAt(peg$currPos) === 32) {
        s1 = peg$c76;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c77); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (input.charCodeAt(peg$currPos) === 32) {
          s1 = peg$c76;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c77); }
        }
      }
      if (s0 === peg$FAILED) {
        s0 = null;
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      s0 = [];
      if (input.charCodeAt(peg$currPos) === 32) {
        s1 = peg$c76;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c77); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (input.charCodeAt(peg$currPos) === 32) {
            s1 = peg$c76;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c77); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseJSON_text() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsevalue();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c78(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsebegin_array() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c60;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c61); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsebegin_object() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 123) {
          s2 = peg$c79;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c80); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseend_array() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 93) {
          s2 = peg$c64;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c65); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseend_object() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 125) {
          s2 = peg$c81;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c82); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsename_separator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s2 = peg$c3;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsevalue_separator() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsews();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 44) {
          s2 = peg$c23;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsews();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c84.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c85); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c84.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c85); }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c83); }
      }

      return s0;
    }

    function peg$parsevalue() {
      var s0;

      s0 = peg$parsefalse();
      if (s0 === peg$FAILED) {
        s0 = peg$parsenull();
        if (s0 === peg$FAILED) {
          s0 = peg$parsetrue();
          if (s0 === peg$FAILED) {
            s0 = peg$parseobject();
            if (s0 === peg$FAILED) {
              s0 = peg$parsearray();
              if (s0 === peg$FAILED) {
                s0 = peg$parsenumber();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsestring();
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsefalse() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c86) {
        s1 = peg$c86;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c87); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c88();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsenull() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c89) {
        s1 = peg$c89;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c90); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c91();
      }
      s0 = s1;

      return s0;
    }

    function peg$parsetrue() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c92) {
        s1 = peg$c92;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c93); }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c94();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseobject() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_object();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parsemember();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsemember();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c95(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$currPos;
            s6 = peg$parsevalue_separator();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsemember();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c95(s3, s7);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c96(s3, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseend_object();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c97(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsemember() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsestring();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsename_separator();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsevalue();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c98(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsearray() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsebegin_array();
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parsevalue();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$currPos;
          s6 = peg$parsevalue_separator();
          if (s6 !== peg$FAILED) {
            s7 = peg$parsevalue();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s5;
              s6 = peg$c99(s3, s7);
              s5 = s6;
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          } else {
            peg$currPos = s5;
            s5 = peg$FAILED;
          }
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$currPos;
            s6 = peg$parsevalue_separator();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsevalue();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s5;
                s6 = peg$c99(s3, s7);
                s5 = s6;
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$FAILED;
            }
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c100(s3, s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseend_array();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c101(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseminus();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseint();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsefrac();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseexp();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c103();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }

      return s0;
    }

    function peg$parsedecimal_point() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 46) {
        s0 = peg$c8;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c9); }
      }

      return s0;
    }

    function peg$parsedigit1_9() {
      var s0;

      if (peg$c104.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c105); }
      }

      return s0;
    }

    function peg$parsee() {
      var s0;

      if (peg$c106.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c107); }
      }

      return s0;
    }

    function peg$parseexp() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parsee();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseminus();
        if (s2 === peg$FAILED) {
          s2 = peg$parseplus();
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseDIGIT();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseDIGIT();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsefrac() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parsedecimal_point();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseDIGIT();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseDIGIT();
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseint() {
      var s0, s1, s2, s3;

      s0 = peg$parsezero();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsedigit1_9();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseDIGIT();
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseDIGIT();
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseminus() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 45) {
        s0 = peg$c108;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c109); }
      }

      return s0;
    }

    function peg$parseplus() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 43) {
        s0 = peg$c110;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c111); }
      }

      return s0;
    }

    function peg$parsezero() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 48) {
        s0 = peg$c112;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c113); }
      }

      return s0;
    }

    function peg$parsestring() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parsequotation_mark();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parsechar();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parsechar();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsequotation_mark();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c115(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c114); }
      }

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$parseunescaped();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseescape();
        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s2 = peg$c116;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c117); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 92) {
              s2 = peg$c118;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c119); }
            }
            if (s2 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 47) {
                s2 = peg$c120;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c121); }
              }
              if (s2 === peg$FAILED) {
                s2 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 98) {
                  s3 = peg$c122;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c123); }
                }
                if (s3 !== peg$FAILED) {
                  peg$savedPos = s2;
                  s3 = peg$c124();
                }
                s2 = s3;
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 102) {
                    s3 = peg$c125;
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c126); }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$savedPos = s2;
                    s3 = peg$c127();
                  }
                  s2 = s3;
                  if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 110) {
                      s3 = peg$c128;
                      peg$currPos++;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c129); }
                    }
                    if (s3 !== peg$FAILED) {
                      peg$savedPos = s2;
                      s3 = peg$c130();
                    }
                    s2 = s3;
                    if (s2 === peg$FAILED) {
                      s2 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 114) {
                        s3 = peg$c131;
                        peg$currPos++;
                      } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c132); }
                      }
                      if (s3 !== peg$FAILED) {
                        peg$savedPos = s2;
                        s3 = peg$c133();
                      }
                      s2 = s3;
                      if (s2 === peg$FAILED) {
                        s2 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 116) {
                          s3 = peg$c134;
                          peg$currPos++;
                        } else {
                          s3 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c135); }
                        }
                        if (s3 !== peg$FAILED) {
                          peg$savedPos = s2;
                          s3 = peg$c136();
                        }
                        s2 = s3;
                        if (s2 === peg$FAILED) {
                          s2 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 117) {
                            s3 = peg$c137;
                            peg$currPos++;
                          } else {
                            s3 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c138); }
                          }
                          if (s3 !== peg$FAILED) {
                            s4 = peg$currPos;
                            s5 = peg$currPos;
                            s6 = peg$parseHEXDIG();
                            if (s6 !== peg$FAILED) {
                              s7 = peg$parseHEXDIG();
                              if (s7 !== peg$FAILED) {
                                s8 = peg$parseHEXDIG();
                                if (s8 !== peg$FAILED) {
                                  s9 = peg$parseHEXDIG();
                                  if (s9 !== peg$FAILED) {
                                    s6 = [s6, s7, s8, s9];
                                    s5 = s6;
                                  } else {
                                    peg$currPos = s5;
                                    s5 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s5;
                                  s5 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s5;
                              s5 = peg$FAILED;
                            }
                            if (s5 !== peg$FAILED) {
                              s4 = input.substring(s4, peg$currPos);
                            } else {
                              s4 = s5;
                            }
                            if (s4 !== peg$FAILED) {
                              peg$savedPos = s2;
                              s3 = peg$c139(s4);
                              s2 = s3;
                            } else {
                              peg$currPos = s2;
                              s2 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s2;
                            s2 = peg$FAILED;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c140(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseescape() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 92) {
        s0 = peg$c118;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }

      return s0;
    }

    function peg$parsequotation_mark() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 34) {
        s0 = peg$c116;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c117); }
      }

      return s0;
    }

    function peg$parseunescaped() {
      var s0;

      if (peg$c141.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c142); }
      }

      return s0;
    }

    function peg$parseDIGIT() {
      var s0;

      if (peg$c62.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }

      return s0;
    }

    function peg$parseHEXDIG() {
      var s0;

      if (peg$c143.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c144); }
      }

      return s0;
    }


      var parser, edges, nodes;

      var defaultInPort = "IN", defaultOutPort = "OUT";

      parser = this;
      delete parser.exports;
      delete parser.inports;
      delete parser.outports;

      edges = parser.edges = [];

      nodes = {};

      var serialize, indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      parser.serialize = function(graph) {
        var conn, getInOutName, getName, i, inPort, input, len, name, namedComponents, outPort, output, process, ref, ref1, ref2, src, srcName, srcPort, srcProcess, tgt, tgtName, tgtPort, tgtProcess;
        if (options == null) {
          options = {};
        }
        if (typeof(graph) === 'string') {
          input = JSON.parse(graph);
        } else {
          input = graph;
        }
        namedComponents = [];
        output = "";
        getName = function(name) {
          if (input.processes[name].metadata != null) {
            name = input.processes[name].metadata.label;
          }
          if (name.indexOf('/') > -1) {
            name = name.split('/').pop();
          }
          return name;
        };
        getInOutName = function(name, data) {
          if ((data.process != null) && (input.processes[data.process].metadata != null)) {
            name = input.processes[data.process].metadata.label;
          } else if (data.process != null) {
            name = data.process;
          }
          if (name.indexOf('/') > -1) {
            name = name.split('/').pop();
          }
          return name;
        };
        ref = input.inports;
        for (name in ref) {
          inPort = ref[name];
          process = getInOutName(name, inPort);
          name = name.toUpperCase();
          inPort.port = inPort.port.toUpperCase();
          output += "INPORT=" + process + "." + inPort.port + ":" + name + "\n";
        }
        ref1 = input.outports;
        for (name in ref1) {
          outPort = ref1[name];
          process = getInOutName(name, inPort);
          name = name.toUpperCase();
          outPort.port = outPort.port.toUpperCase();
          output += "OUTPORT=" + process + "." + outPort.port + ":" + name + "\n";
        }
        output += "\n";
        ref2 = input.connections;
        for (i = 0, len = ref2.length; i < len; i++) {
          conn = ref2[i];
          if (conn.data != null) {
            tgtPort = conn.tgt.port.toUpperCase();
            tgtName = conn.tgt.process;
            tgtProcess = input.processes[tgtName].component;
            tgt = getName(tgtName);
            if (indexOf.call(namedComponents, tgtProcess) < 0) {
              tgt += "(" + tgtProcess + ")";
              namedComponents.push(tgtProcess);
            }
            output += '"' + conn.data + '"' + (" -> " + tgtPort + " " + tgt + "\n");
          } else {
            srcPort = conn.src.port.toUpperCase();
            srcName = conn.src.process;
            srcProcess = input.processes[srcName].component;
            src = getName(srcName);
            if (indexOf.call(namedComponents, srcProcess) < 0) {
              src += "(" + srcProcess + ")";
              namedComponents.push(srcProcess);
            }
            tgtPort = conn.tgt.port.toUpperCase();
            tgtName = conn.tgt.process;
            tgtProcess = input.processes[tgtName].component;
            tgt = getName(tgtName);
            if (indexOf.call(namedComponents, tgtProcess) < 0) {
              tgt += "(" + tgtProcess + ")";
              namedComponents.push(tgtProcess);
            }
            output += src + " " + srcPort + " -> " + tgtPort + " " + tgt + "\n";
          }
        }
        return output;
      };

      parser.addNode = function (nodeName, comp) {
        if (!nodes[nodeName]) {
          nodes[nodeName] = {}
        }
        if (!!comp.comp) {
          nodes[nodeName].component = comp.comp;
        }
        if (!!comp.meta) {
          var metadata = {};
          for (var i = 0; i < comp.meta.length; i++) {
            var item = comp.meta[i].split('=');
            if (item.length === 1) {
              item = ['routes', item[0]];
            }
            var key = item[0];
            var value = item[1];
            if (key==='x' || key==='y') {
              value = parseFloat(value);
            }
            metadata[key] = value;
          }
          nodes[nodeName].metadata=metadata;
        }

      }

      var anonymousIndexes = {};
      var anonymousNodeNames = {};
      parser.addAnonymousNode = function(comp, offset) {
          if (!anonymousNodeNames[offset]) {
              var componentName = comp.comp.replace(/[^a-zA-Z0-9]+/, "_");
              anonymousIndexes[componentName] = (anonymousIndexes[componentName] || 0) + 1;
              anonymousNodeNames[offset] = "_" + componentName + "_" + anonymousIndexes[componentName];
              this.addNode(anonymousNodeNames[offset], comp);
          }
          return anonymousNodeNames[offset];
      }

      parser.getResult = function () {
        var result = {
          processes: nodes,
          connections: parser.processEdges(),
          exports: parser.exports,
          inports: parser.inports,
          outports: parser.outports
        };

        var validateSchema = parser.validateSchema; // default
        if (typeof(options.validateSchema) !== 'undefined') { validateSchema = options.validateSchema; } // explicit option
        if (validateSchema) {
          if (typeof(tv4) === 'undefined') {
            var tv4 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tv4\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
          }
          var schema = __webpack_require__(33);
          var validation = tv4.validateMultiple(result, schema);
          if (!validation.valid) {
            throw new Error("fbp: Did not validate againt graph schema:\n" + JSON.stringify(validation.errors, null, 2));
          }
        }
        result.caseSensitive = options.caseSensitive;
        return result;
      }

      var flatten = function (array, isShallow) {
        var index = -1,
          length = array ? array.length : 0,
          result = [];

        while (++index < length) {
          var value = array[index];

          if (value instanceof Array) {
            Array.prototype.push.apply(result, isShallow ? value : flatten(value));
          }
          else {
            result.push(value);
          }
        }
        return result;
      }

      parser.registerExports = function (priv, pub) {
        if (!parser.exports) {
          parser.exports = [];
        }

        if (!options.caseSensitive) {
          priv = priv.toLowerCase();
          pub = pub.toLowerCase();
        }

        parser.exports.push({private:priv, public:pub});
      }
      parser.registerInports = function (node, port, pub) {
        if (!parser.inports) {
          parser.inports = {};
        }

        if (!options.caseSensitive) {
          pub = pub.toLowerCase();
          port = port.toLowerCase();
        }

        parser.inports[pub] = {process:node, port:port};
      }
      parser.registerOutports = function (node, port, pub) {
        if (!parser.outports) {
          parser.outports = {};
        }

        if (!options.caseSensitive) {
          pub = pub.toLowerCase();
          port = port.toLowerCase();
        }

        parser.outports[pub] = {process:node, port:port};
      }

      parser.registerEdges = function (edges) {
        if (Array.isArray(edges)) {
          edges.forEach(function (o, i) {
            parser.edges.push(o);
          });
        }
      }

      parser.processEdges = function () {
        var flats, grouped;
        flats = flatten(parser.edges);
        grouped = [];
        var current = {};
        for (var i = 1; i < flats.length; i += 1) {
            // skip over default ports at the beginning of lines (could also handle this in grammar)
            if (("src" in flats[i - 1] || "data" in flats[i - 1]) && "tgt" in flats[i]) {
                flats[i - 1].tgt = flats[i].tgt;
                grouped.push(flats[i - 1]);
                i++;
            }
        }
        return grouped;
      }

      function makeName(s) {
        return s[0] + s[1].join("");
      }

      function makePort(process, port, defaultPort) {
        if (!options.caseSensitive) {
          defaultPort = defaultPort.toLowerCase()
        }
        var p = {
            process: process,
            port: port ? port.port : defaultPort
        };
        if (port && port.index != null) {
            p.index = port.index;
        }
        return p;
    }

      function makeInPort(process, port) {
          return makePort(process, port, defaultInPort);
      }
      function makeOutPort(process, port) {
          return makePort(process, port, defaultOutPort);
      }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = {"$schema":"http://json-schema.org/draft-04/schema","id":"graph.json","title":"FBP graph","description":"A graph of FBP processes and connections between them.\nThis is the primary way of specifying FBP programs.\n","name":"graph","type":"object","additionalProperties":false,"properties":{"properties":{"type":"object","description":"User-defined properties attached to the graph.","additionalProperties":true,"properties":{"name":{"type":"string"}}},"inports":{"type":["object","undefined"],"description":"Exported inports of the graph","additionalProperties":true,"patternProperties":{"[a-z0-9]+":{"type":"object","properties":{"process":{"type":"string"},"port":{"type":"string"},"metadata":{"type":"object","additionalProperties":true}}}}},"outports":{"type":["object","undefined"],"description":"Exported outports of the graph","additionalProperties":true,"patternProperties":{"[a-z0-9]+":{"type":"object","properties":{"process":{"type":"string"},"port":{"type":"string"},"metadata":{"type":"object","additionalProperties":true}}}}},"exports":{"type":["array","undefined"],"description":"Deprecated, use inports and outports instead"},"groups":{"type":"array","description":"List of groups of processes","items":{"type":"object","additionalProperties":false,"properties":{"name":{"type":"string"},"nodes":{"type":"array","items":{"type":"string"}},"metadata":{"additionalProperties":true}}}},"processes":{"type":"object","description":"The processes of this graph.\nEach process is an instance of a component.\n","additionalProperties":false,"patternProperties":{"[a-zA-Z0-9_]+":{"type":"object","properties":{"component":{"type":"string"},"metadata":{"type":"object","additionalProperties":true}}}}},"connections":{"type":"array","description":"Connections of the graph.\nA connection either connects ports of two processes, or specifices an IIP as initial input packet to a port.\n","items":{"type":"object","additionalProperties":false,"properties":{"src":{"type":"object","additionalProperties":false,"properties":{"process":{"type":"string"},"port":{"type":"string"},"index":{"type":"integer"}}},"tgt":{"type":"object","additionalProperties":false,"properties":{"process":{"type":"string"},"port":{"type":"string"},"index":{"type":"integer"}}},"data":{},"metadata":{"type":"object","additionalProperties":true}}}}}}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var EventEmitter, Journal, JournalStore, MemoryJournalStore, calculateMeta, clone, entryToPrettyString,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  EventEmitter = __webpack_require__(2).EventEmitter;

  clone = __webpack_require__(13);

  entryToPrettyString = function(entry) {
    var a;
    a = entry.args;
    switch (entry.cmd) {
      case 'addNode':
        return a.id + "(" + a.component + ")";
      case 'removeNode':
        return "DEL " + a.id + "(" + a.component + ")";
      case 'renameNode':
        return "RENAME " + a.oldId + " " + a.newId;
      case 'changeNode':
        return "META " + a.id;
      case 'addEdge':
        return a.from.node + " " + a.from.port + " -> " + a.to.port + " " + a.to.node;
      case 'removeEdge':
        return a.from.node + " " + a.from.port + " -X> " + a.to.port + " " + a.to.node;
      case 'changeEdge':
        return "META " + a.from.node + " " + a.from.port + " -> " + a.to.port + " " + a.to.node;
      case 'addInitial':
        return "'" + a.from.data + "' -> " + a.to.port + " " + a.to.node;
      case 'removeInitial':
        return "'" + a.from.data + "' -X> " + a.to.port + " " + a.to.node;
      case 'startTransaction':
        return ">>> " + entry.rev + ": " + a.id;
      case 'endTransaction':
        return "<<< " + entry.rev + ": " + a.id;
      case 'changeProperties':
        return "PROPERTIES";
      case 'addGroup':
        return "GROUP " + a.name;
      case 'renameGroup':
        return "RENAME GROUP " + a.oldName + " " + a.newName;
      case 'removeGroup':
        return "DEL GROUP " + a.name;
      case 'changeGroup':
        return "META GROUP " + a.name;
      case 'addInport':
        return "INPORT " + a.name;
      case 'removeInport':
        return "DEL INPORT " + a.name;
      case 'renameInport':
        return "RENAME INPORT " + a.oldId + " " + a.newId;
      case 'changeInport':
        return "META INPORT " + a.name;
      case 'addOutport':
        return "OUTPORT " + a.name;
      case 'removeOutport':
        return "DEL OUTPORT " + a.name;
      case 'renameOutport':
        return "RENAME OUTPORT " + a.oldId + " " + a.newId;
      case 'changeOutport':
        return "META OUTPORT " + a.name;
      default:
        throw new Error("Unknown journal entry: " + entry.cmd);
    }
  };

  calculateMeta = function(oldMeta, newMeta) {
    var k, setMeta, v;
    setMeta = {};
    for (k in oldMeta) {
      v = oldMeta[k];
      setMeta[k] = null;
    }
    for (k in newMeta) {
      v = newMeta[k];
      setMeta[k] = v;
    }
    return setMeta;
  };

  JournalStore = (function(superClass) {
    extend(JournalStore, superClass);

    JournalStore.prototype.lastRevision = 0;

    function JournalStore(graph1) {
      this.graph = graph1;
      this.lastRevision = 0;
    }

    JournalStore.prototype.putTransaction = function(revId, entries) {
      if (revId > this.lastRevision) {
        this.lastRevision = revId;
      }
      return this.emit('transaction', revId);
    };

    JournalStore.prototype.fetchTransaction = function(revId, entries) {};

    return JournalStore;

  })(EventEmitter);

  MemoryJournalStore = (function(superClass) {
    extend(MemoryJournalStore, superClass);

    function MemoryJournalStore(graph) {
      MemoryJournalStore.__super__.constructor.call(this, graph);
      this.transactions = [];
    }

    MemoryJournalStore.prototype.putTransaction = function(revId, entries) {
      MemoryJournalStore.__super__.putTransaction.call(this, revId, entries);
      return this.transactions[revId] = entries;
    };

    MemoryJournalStore.prototype.fetchTransaction = function(revId) {
      return this.transactions[revId];
    };

    return MemoryJournalStore;

  })(JournalStore);

  Journal = (function(superClass) {
    extend(Journal, superClass);

    Journal.prototype.graph = null;

    Journal.prototype.entries = [];

    Journal.prototype.subscribed = true;

    function Journal(graph, metadata, store) {
      this.endTransaction = bind(this.endTransaction, this);
      this.startTransaction = bind(this.startTransaction, this);
      var edge, group, iip, j, k, l, len, len1, len2, len3, m, n, node, ref, ref1, ref2, ref3, ref4, ref5, v;
      this.graph = graph;
      this.entries = [];
      this.subscribed = true;
      this.store = store || new MemoryJournalStore(this.graph);
      if (this.store.transactions.length === 0) {
        this.currentRevision = -1;
        this.startTransaction('initial', metadata);
        ref = this.graph.nodes;
        for (j = 0, len = ref.length; j < len; j++) {
          node = ref[j];
          this.appendCommand('addNode', node);
        }
        ref1 = this.graph.edges;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          edge = ref1[l];
          this.appendCommand('addEdge', edge);
        }
        ref2 = this.graph.initializers;
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          iip = ref2[m];
          this.appendCommand('addInitial', iip);
        }
        if (Object.keys(this.graph.properties).length > 0) {
          this.appendCommand('changeProperties', this.graph.properties, {});
        }
        ref3 = this.graph.inports;
        for (k in ref3) {
          v = ref3[k];
          this.appendCommand('addInport', {
            name: k,
            port: v
          });
        }
        ref4 = this.graph.outports;
        for (k in ref4) {
          v = ref4[k];
          this.appendCommand('addOutport', {
            name: k,
            port: v
          });
        }
        ref5 = this.graph.groups;
        for (n = 0, len3 = ref5.length; n < len3; n++) {
          group = ref5[n];
          this.appendCommand('addGroup', group);
        }
        this.endTransaction('initial', metadata);
      } else {
        this.currentRevision = this.store.lastRevision;
      }
      this.graph.on('addNode', (function(_this) {
        return function(node) {
          return _this.appendCommand('addNode', node);
        };
      })(this));
      this.graph.on('removeNode', (function(_this) {
        return function(node) {
          return _this.appendCommand('removeNode', node);
        };
      })(this));
      this.graph.on('renameNode', (function(_this) {
        return function(oldId, newId) {
          var args;
          args = {
            oldId: oldId,
            newId: newId
          };
          return _this.appendCommand('renameNode', args);
        };
      })(this));
      this.graph.on('changeNode', (function(_this) {
        return function(node, oldMeta) {
          return _this.appendCommand('changeNode', {
            id: node.id,
            "new": node.metadata,
            old: oldMeta
          });
        };
      })(this));
      this.graph.on('addEdge', (function(_this) {
        return function(edge) {
          return _this.appendCommand('addEdge', edge);
        };
      })(this));
      this.graph.on('removeEdge', (function(_this) {
        return function(edge) {
          return _this.appendCommand('removeEdge', edge);
        };
      })(this));
      this.graph.on('changeEdge', (function(_this) {
        return function(edge, oldMeta) {
          return _this.appendCommand('changeEdge', {
            from: edge.from,
            to: edge.to,
            "new": edge.metadata,
            old: oldMeta
          });
        };
      })(this));
      this.graph.on('addInitial', (function(_this) {
        return function(iip) {
          return _this.appendCommand('addInitial', iip);
        };
      })(this));
      this.graph.on('removeInitial', (function(_this) {
        return function(iip) {
          return _this.appendCommand('removeInitial', iip);
        };
      })(this));
      this.graph.on('changeProperties', (function(_this) {
        return function(newProps, oldProps) {
          return _this.appendCommand('changeProperties', {
            "new": newProps,
            old: oldProps
          });
        };
      })(this));
      this.graph.on('addGroup', (function(_this) {
        return function(group) {
          return _this.appendCommand('addGroup', group);
        };
      })(this));
      this.graph.on('renameGroup', (function(_this) {
        return function(oldName, newName) {
          return _this.appendCommand('renameGroup', {
            oldName: oldName,
            newName: newName
          });
        };
      })(this));
      this.graph.on('removeGroup', (function(_this) {
        return function(group) {
          return _this.appendCommand('removeGroup', group);
        };
      })(this));
      this.graph.on('changeGroup', (function(_this) {
        return function(group, oldMeta) {
          return _this.appendCommand('changeGroup', {
            name: group.name,
            "new": group.metadata,
            old: oldMeta
          });
        };
      })(this));
      this.graph.on('addExport', (function(_this) {
        return function(exported) {
          return _this.appendCommand('addExport', exported);
        };
      })(this));
      this.graph.on('removeExport', (function(_this) {
        return function(exported) {
          return _this.appendCommand('removeExport', exported);
        };
      })(this));
      this.graph.on('addInport', (function(_this) {
        return function(name, port) {
          return _this.appendCommand('addInport', {
            name: name,
            port: port
          });
        };
      })(this));
      this.graph.on('removeInport', (function(_this) {
        return function(name, port) {
          return _this.appendCommand('removeInport', {
            name: name,
            port: port
          });
        };
      })(this));
      this.graph.on('renameInport', (function(_this) {
        return function(oldId, newId) {
          return _this.appendCommand('renameInport', {
            oldId: oldId,
            newId: newId
          });
        };
      })(this));
      this.graph.on('changeInport', (function(_this) {
        return function(name, port, oldMeta) {
          return _this.appendCommand('changeInport', {
            name: name,
            "new": port.metadata,
            old: oldMeta
          });
        };
      })(this));
      this.graph.on('addOutport', (function(_this) {
        return function(name, port) {
          return _this.appendCommand('addOutport', {
            name: name,
            port: port
          });
        };
      })(this));
      this.graph.on('removeOutport', (function(_this) {
        return function(name, port) {
          return _this.appendCommand('removeOutport', {
            name: name,
            port: port
          });
        };
      })(this));
      this.graph.on('renameOutport', (function(_this) {
        return function(oldId, newId) {
          return _this.appendCommand('renameOutport', {
            oldId: oldId,
            newId: newId
          });
        };
      })(this));
      this.graph.on('changeOutport', (function(_this) {
        return function(name, port, oldMeta) {
          return _this.appendCommand('changeOutport', {
            name: name,
            "new": port.metadata,
            old: oldMeta
          });
        };
      })(this));
      this.graph.on('startTransaction', (function(_this) {
        return function(id, meta) {
          return _this.startTransaction(id, meta);
        };
      })(this));
      this.graph.on('endTransaction', (function(_this) {
        return function(id, meta) {
          return _this.endTransaction(id, meta);
        };
      })(this));
    }

    Journal.prototype.startTransaction = function(id, meta) {
      if (!this.subscribed) {
        return;
      }
      if (this.entries.length > 0) {
        throw Error("Inconsistent @entries");
      }
      this.currentRevision++;
      return this.appendCommand('startTransaction', {
        id: id,
        metadata: meta
      }, this.currentRevision);
    };

    Journal.prototype.endTransaction = function(id, meta) {
      if (!this.subscribed) {
        return;
      }
      this.appendCommand('endTransaction', {
        id: id,
        metadata: meta
      }, this.currentRevision);
      this.store.putTransaction(this.currentRevision, this.entries);
      return this.entries = [];
    };

    Journal.prototype.appendCommand = function(cmd, args, rev) {
      var entry;
      if (!this.subscribed) {
        return;
      }
      entry = {
        cmd: cmd,
        args: clone(args)
      };
      if (rev != null) {
        entry.rev = rev;
      }
      return this.entries.push(entry);
    };

    Journal.prototype.executeEntry = function(entry) {
      var a;
      a = entry.args;
      switch (entry.cmd) {
        case 'addNode':
          return this.graph.addNode(a.id, a.component);
        case 'removeNode':
          return this.graph.removeNode(a.id);
        case 'renameNode':
          return this.graph.renameNode(a.oldId, a.newId);
        case 'changeNode':
          return this.graph.setNodeMetadata(a.id, calculateMeta(a.old, a["new"]));
        case 'addEdge':
          return this.graph.addEdge(a.from.node, a.from.port, a.to.node, a.to.port);
        case 'removeEdge':
          return this.graph.removeEdge(a.from.node, a.from.port, a.to.node, a.to.port);
        case 'changeEdge':
          return this.graph.setEdgeMetadata(a.from.node, a.from.port, a.to.node, a.to.port, calculateMeta(a.old, a["new"]));
        case 'addInitial':
          return this.graph.addInitial(a.from.data, a.to.node, a.to.port);
        case 'removeInitial':
          return this.graph.removeInitial(a.to.node, a.to.port);
        case 'startTransaction':
          return null;
        case 'endTransaction':
          return null;
        case 'changeProperties':
          return this.graph.setProperties(a["new"]);
        case 'addGroup':
          return this.graph.addGroup(a.name, a.nodes, a.metadata);
        case 'renameGroup':
          return this.graph.renameGroup(a.oldName, a.newName);
        case 'removeGroup':
          return this.graph.removeGroup(a.name);
        case 'changeGroup':
          return this.graph.setGroupMetadata(a.name, calculateMeta(a.old, a["new"]));
        case 'addInport':
          return this.graph.addInport(a.name, a.port.process, a.port.port, a.port.metadata);
        case 'removeInport':
          return this.graph.removeInport(a.name);
        case 'renameInport':
          return this.graph.renameInport(a.oldId, a.newId);
        case 'changeInport':
          return this.graph.setInportMetadata(a.name, calculateMeta(a.old, a["new"]));
        case 'addOutport':
          return this.graph.addOutport(a.name, a.port.process, a.port.port, a.port.metadata(a.name));
        case 'removeOutport':
          return this.graph.removeOutport;
        case 'renameOutport':
          return this.graph.renameOutport(a.oldId, a.newId);
        case 'changeOutport':
          return this.graph.setOutportMetadata(a.name, calculateMeta(a.old, a["new"]));
        default:
          throw new Error("Unknown journal entry: " + entry.cmd);
      }
    };

    Journal.prototype.executeEntryInversed = function(entry) {
      var a;
      a = entry.args;
      switch (entry.cmd) {
        case 'addNode':
          return this.graph.removeNode(a.id);
        case 'removeNode':
          return this.graph.addNode(a.id, a.component);
        case 'renameNode':
          return this.graph.renameNode(a.newId, a.oldId);
        case 'changeNode':
          return this.graph.setNodeMetadata(a.id, calculateMeta(a["new"], a.old));
        case 'addEdge':
          return this.graph.removeEdge(a.from.node, a.from.port, a.to.node, a.to.port);
        case 'removeEdge':
          return this.graph.addEdge(a.from.node, a.from.port, a.to.node, a.to.port);
        case 'changeEdge':
          return this.graph.setEdgeMetadata(a.from.node, a.from.port, a.to.node, a.to.port, calculateMeta(a["new"], a.old));
        case 'addInitial':
          return this.graph.removeInitial(a.to.node, a.to.port);
        case 'removeInitial':
          return this.graph.addInitial(a.from.data, a.to.node, a.to.port);
        case 'startTransaction':
          return null;
        case 'endTransaction':
          return null;
        case 'changeProperties':
          return this.graph.setProperties(a.old);
        case 'addGroup':
          return this.graph.removeGroup(a.name);
        case 'renameGroup':
          return this.graph.renameGroup(a.newName, a.oldName);
        case 'removeGroup':
          return this.graph.addGroup(a.name, a.nodes, a.metadata);
        case 'changeGroup':
          return this.graph.setGroupMetadata(a.name, calculateMeta(a["new"], a.old));
        case 'addInport':
          return this.graph.removeInport(a.name);
        case 'removeInport':
          return this.graph.addInport(a.name, a.port.process, a.port.port, a.port.metadata);
        case 'renameInport':
          return this.graph.renameInport(a.newId, a.oldId);
        case 'changeInport':
          return this.graph.setInportMetadata(a.name, calculateMeta(a["new"], a.old));
        case 'addOutport':
          return this.graph.removeOutport(a.name);
        case 'removeOutport':
          return this.graph.addOutport(a.name, a.port.process, a.port.port, a.port.metadata);
        case 'renameOutport':
          return this.graph.renameOutport(a.newId, a.oldId);
        case 'changeOutport':
          return this.graph.setOutportMetadata(a.name, calculateMeta(a["new"], a.old));
        default:
          throw new Error("Unknown journal entry: " + entry.cmd);
      }
    };

    Journal.prototype.moveToRevision = function(revId) {
      var entries, entry, i, j, l, len, m, n, r, ref, ref1, ref2, ref3, ref4, ref5;
      if (revId === this.currentRevision) {
        return;
      }
      this.subscribed = false;
      if (revId > this.currentRevision) {
        for (r = j = ref = this.currentRevision + 1, ref1 = revId; ref <= ref1 ? j <= ref1 : j >= ref1; r = ref <= ref1 ? ++j : --j) {
          ref2 = this.store.fetchTransaction(r);
          for (l = 0, len = ref2.length; l < len; l++) {
            entry = ref2[l];
            this.executeEntry(entry);
          }
        }
      } else {
        for (r = m = ref3 = this.currentRevision, ref4 = revId + 1; m >= ref4; r = m += -1) {
          entries = this.store.fetchTransaction(r);
          for (i = n = ref5 = entries.length - 1; n >= 0; i = n += -1) {
            this.executeEntryInversed(entries[i]);
          }
        }
      }
      this.currentRevision = revId;
      return this.subscribed = true;
    };

    Journal.prototype.undo = function() {
      if (!this.canUndo()) {
        return;
      }
      return this.moveToRevision(this.currentRevision - 1);
    };

    Journal.prototype.canUndo = function() {
      return this.currentRevision > 0;
    };

    Journal.prototype.redo = function() {
      if (!this.canRedo()) {
        return;
      }
      return this.moveToRevision(this.currentRevision + 1);
    };

    Journal.prototype.canRedo = function() {
      return this.currentRevision < this.store.lastRevision;
    };

    Journal.prototype.toPrettyString = function(startRev, endRev) {
      var e, entry, j, l, len, lines, r, ref, ref1;
      startRev |= 0;
      endRev |= this.store.lastRevision;
      lines = [];
      for (r = j = ref = startRev, ref1 = endRev; ref <= ref1 ? j < ref1 : j > ref1; r = ref <= ref1 ? ++j : --j) {
        e = this.store.fetchTransaction(r);
        for (l = 0, len = e.length; l < len; l++) {
          entry = e[l];
          lines.push(entryToPrettyString(entry));
        }
      }
      return lines.join('\n');
    };

    Journal.prototype.toJSON = function(startRev, endRev) {
      var entries, entry, j, l, len, r, ref, ref1, ref2;
      startRev |= 0;
      endRev |= this.store.lastRevision;
      entries = [];
      for (r = j = ref = startRev, ref1 = endRev; j < ref1; r = j += 1) {
        ref2 = this.store.fetchTransaction(r);
        for (l = 0, len = ref2.length; l < len; l++) {
          entry = ref2[l];
          entries.push(entryToPrettyString(entry));
        }
      }
      return entries;
    };

    Journal.prototype.save = function(file, success) {
      var json;
      json = JSON.stringify(this.toJSON(), null, 4);
      return __webpack_require__(6).writeFile(file + ".json", json, "utf-8", function(err, data) {
        if (err) {
          throw err;
        }
        return success(file);
      });
    };

    return Journal;

  })(EventEmitter);

  exports.Journal = Journal;

  exports.JournalStore = JournalStore;

  exports.MemoryJournalStore = MemoryJournalStore;

}).call(this);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var registerCustomLoaders = function (loader, loaders, callback) {
  if (!loaders.length) {
    return callback();
  }
  var customLoader = loaders.shift();
  loader.registerLoader(customLoader, function (err) {
    if (err) {
      return callback(err);
    }
    registerCustomLoaders(loader, loaders, callback);
  });
};

var sources = {
  "browser-app/DoSomething": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n\n  # Define a meaningful icon for component from http://fontawesome.io/icons/\n  c.icon = 'cog'\n\n  # Provide a description on component usage\n  c.description = 'do X'\n\n  # Add input ports\n  c.inPorts.add 'in',\n    datatype: 'string'\n\n  # Add output ports\n  c.outPorts.add 'out',\n    datatype: 'string'\n\n  # What to do when port receives a packet\n  c.process (input, output) ->\n    # Check that input has received data packet\n    return unless input.hasData 'in'\n    # Read the contents of the data packet\n    data = input.getData 'in'\n    # Send the contents to output port\n    output.send\n      out: data\n    # Finish processing\n    output.done()\n"},
  "Graph": {"language":"javascript","source":"(function() {\n  var Graph, noflo,\n    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },\n    hasProp = {}.hasOwnProperty;\n\n  noflo = require(\"../lib/NoFlo\");\n\n  Graph = (function(superClass) {\n    extend(Graph, superClass);\n\n    function Graph(metadata1) {\n      this.metadata = metadata1;\n      this.network = null;\n      this.ready = true;\n      this.started = false;\n      this.starting = false;\n      this.baseDir = null;\n      this.loader = null;\n      this.load = 0;\n      this.inPorts = new noflo.InPorts({\n        graph: {\n          datatype: 'all',\n          description: 'NoFlo graph definition to be used with the subgraph component',\n          required: true\n        }\n      });\n      this.outPorts = new noflo.OutPorts;\n      this.inPorts.graph.on('ip', (function(_this) {\n        return function(packet) {\n          if (packet.type !== 'data') {\n            return;\n          }\n          return _this.setGraph(packet.data, function(err) {\n            if (err) {\n              return _this.error(err);\n            }\n          });\n        };\n      })(this));\n    }\n\n    Graph.prototype.setGraph = function(graph, callback) {\n      this.ready = false;\n      if (typeof graph === 'object') {\n        if (typeof graph.addNode === 'function') {\n          this.createNetwork(graph, callback);\n          return;\n        }\n        noflo.graph.loadJSON(graph, (function(_this) {\n          return function(err, instance) {\n            if (err) {\n              return callback(err);\n            }\n            instance.baseDir = _this.baseDir;\n            return _this.createNetwork(instance, callback);\n          };\n        })(this));\n        return;\n      }\n      if (graph.substr(0, 1) !== \"/\" && graph.substr(1, 1) !== \":\" && process && process.cwd) {\n        graph = (process.cwd()) + \"/\" + graph;\n      }\n      return noflo.graph.loadFile(graph, (function(_this) {\n        return function(err, instance) {\n          if (err) {\n            return callback(err);\n          }\n          instance.baseDir = _this.baseDir;\n          return _this.createNetwork(instance, callback);\n        };\n      })(this));\n    };\n\n    Graph.prototype.createNetwork = function(graph, callback) {\n      this.description = graph.properties.description || '';\n      this.icon = graph.properties.icon || this.icon;\n      if (!graph.name) {\n        graph.name = this.nodeId;\n      }\n      graph.componentLoader = this.loader;\n      return noflo.createNetwork(graph, (function(_this) {\n        return function(err, network1) {\n          _this.network = network1;\n          if (err) {\n            return callback(err);\n          }\n          _this.emit('network', _this.network);\n          _this.subscribeNetwork(_this.network);\n          return _this.network.connect(function(err) {\n            var name, node, ref;\n            if (err) {\n              return callback(err);\n            }\n            ref = _this.network.processes;\n            for (name in ref) {\n              node = ref[name];\n              _this.findEdgePorts(name, node);\n            }\n            _this.setToReady();\n            return callback();\n          });\n        };\n      })(this), true);\n    };\n\n    Graph.prototype.subscribeNetwork = function(network) {\n      var contexts;\n      contexts = [];\n      this.network.on('start', (function(_this) {\n        return function() {\n          var ctx;\n          ctx = {};\n          contexts.push(ctx);\n          return _this.activate(ctx);\n        };\n      })(this));\n      return this.network.on('end', (function(_this) {\n        return function() {\n          var ctx;\n          ctx = contexts.pop();\n          if (!ctx) {\n            return;\n          }\n          return _this.deactivate(ctx);\n        };\n      })(this));\n    };\n\n    Graph.prototype.isExportedInport = function(port, nodeName, portName) {\n      var exported, i, len, priv, pub, ref, ref1;\n      ref = this.network.graph.inports;\n      for (pub in ref) {\n        priv = ref[pub];\n        if (!(priv.process === nodeName && priv.port === portName)) {\n          continue;\n        }\n        return pub;\n      }\n      ref1 = this.network.graph.exports;\n      for (i = 0, len = ref1.length; i < len; i++) {\n        exported = ref1[i];\n        if (!(exported.process === nodeName && exported.port === portName)) {\n          continue;\n        }\n        this.network.graph.checkTransactionStart();\n        this.network.graph.removeExport(exported[\"public\"]);\n        this.network.graph.addInport(exported[\"public\"], exported.process, exported.port, exported.metadata);\n        this.network.graph.checkTransactionEnd();\n        return exported[\"public\"];\n      }\n      return false;\n    };\n\n    Graph.prototype.isExportedOutport = function(port, nodeName, portName) {\n      var exported, i, len, priv, pub, ref, ref1;\n      ref = this.network.graph.outports;\n      for (pub in ref) {\n        priv = ref[pub];\n        if (!(priv.process === nodeName && priv.port === portName)) {\n          continue;\n        }\n        return pub;\n      }\n      ref1 = this.network.graph.exports;\n      for (i = 0, len = ref1.length; i < len; i++) {\n        exported = ref1[i];\n        if (!(exported.process === nodeName && exported.port === portName)) {\n          continue;\n        }\n        this.network.graph.checkTransactionStart();\n        this.network.graph.removeExport(exported[\"public\"]);\n        this.network.graph.addOutport(exported[\"public\"], exported.process, exported.port, exported.metadata);\n        this.network.graph.checkTransactionEnd();\n        return exported[\"public\"];\n      }\n      return false;\n    };\n\n    Graph.prototype.setToReady = function() {\n      if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {\n        return process.nextTick((function(_this) {\n          return function() {\n            _this.ready = true;\n            return _this.emit('ready');\n          };\n        })(this));\n      } else {\n        return setTimeout((function(_this) {\n          return function() {\n            _this.ready = true;\n            return _this.emit('ready');\n          };\n        })(this), 0);\n      }\n    };\n\n    Graph.prototype.findEdgePorts = function(name, process) {\n      var inPorts, outPorts, port, portName, targetPortName;\n      inPorts = process.component.inPorts.ports || process.component.inPorts;\n      outPorts = process.component.outPorts.ports || process.component.outPorts;\n      for (portName in inPorts) {\n        port = inPorts[portName];\n        targetPortName = this.isExportedInport(port, name, portName);\n        if (targetPortName === false) {\n          continue;\n        }\n        this.inPorts.add(targetPortName, port);\n        this.inPorts[targetPortName].once('connect', (function(_this) {\n          return function() {\n            if (_this.starting) {\n              return;\n            }\n            if (_this.isStarted()) {\n              return;\n            }\n            return _this.start(function() {});\n          };\n        })(this));\n      }\n      for (portName in outPorts) {\n        port = outPorts[portName];\n        targetPortName = this.isExportedOutport(port, name, portName);\n        if (targetPortName === false) {\n          continue;\n        }\n        this.outPorts.add(targetPortName, port);\n      }\n      return true;\n    };\n\n    Graph.prototype.isReady = function() {\n      return this.ready;\n    };\n\n    Graph.prototype.isSubgraph = function() {\n      return true;\n    };\n\n    Graph.prototype.setUp = function(callback) {\n      this.starting = true;\n      if (!this.isReady()) {\n        this.once('ready', (function(_this) {\n          return function() {\n            return _this.setUp(callback);\n          };\n        })(this));\n        return;\n      }\n      if (!this.network) {\n        return callback(null);\n      }\n      return this.network.start(function(err) {\n        if (err) {\n          return callback(err);\n        }\n        this.starting = false;\n        return callback();\n      });\n    };\n\n    Graph.prototype.tearDown = function(callback) {\n      this.starting = false;\n      if (!this.network) {\n        return callback(null);\n      }\n      return this.network.stop(function(err) {\n        if (err) {\n          return callback(err);\n        }\n        return callback();\n      });\n    };\n\n    return Graph;\n\n  })(noflo.Component);\n\n  exports.getComponent = function(metadata) {\n    return new Graph(metadata);\n  };\n\n}).call(this);\n"},
  "core/Callback": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'This component calls a given callback function for each\n  IP it receives.  The Callback component is typically used to connect\n  NoFlo with external Node.js code.'\n  c.icon = 'sign-out'\n\n  c.inPorts.add 'in',\n    description: 'Object passed as argument of the callback'\n    datatype: 'all'\n  c.inPorts.add 'callback',\n    description: 'Callback to invoke'\n    datatype: 'function'\n    control: true\n    required: true\n  c.outPorts.add 'error',\n    datatype: 'object'\n\n  c.process (input, output) ->\n    return unless input.hasData 'callback', 'in'\n    [callback, data] = input.getData 'callback', 'in'\n    unless typeof callback is 'function'\n      output.done new Error 'The provided callback must be a function'\n      return\n\n    # Call the callback when receiving data\n    try\n      callback data\n    catch e\n      return output.done e\n    output.done()\n"},
  "core/Copy": {"language":"coffeescript","source":"noflo = require 'noflo'\nowl = require 'owl-deepcopy'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'deep (i.e. recursively) copy an object'\n  c.icon = 'copy'\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be copied'\n  c.outPorts.add 'out',\n    datatype: 'all'\n    description: 'Copy of the original packet'\n\n  c.process (input, output) ->\n    return unless input.hasData 'in'\n    data = input.getData 'in'\n\n    copy = owl.deepCopy data\n    output.sendDone\n      out: copy\n    return\n"},
  "core/DisconnectAfterPacket": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Makes each data packet a stream of its own'\n  c.icon = 'pause'\n  c.forwardBrackets = {}\n  c.autoOrdering = false\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be forward with disconnection'\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  brackets = {}\n  c.tearDown = (callback) ->\n    brackets = {}\n  c.process (input, output) ->\n    # Force auto-ordering to be off for this one\n    c.autoOrdering = false\n\n    data = input.get 'in'\n    brackets[input.scope] = [] unless brackets[input.scope]\n    if data.type is 'openBracket'\n      brackets[input.scope].push data.data\n      output.done()\n      return\n    if data.type is 'closeBracket'\n      brackets[input.scope].pop()\n      output.done()\n      return\n\n    return unless data.type is 'data'\n\n    for bracket in brackets[input.scope]\n      output.sendIP 'out', new noflo.IP 'openBracket', bracket\n    output.sendIP 'out', data\n    closes = brackets[input.scope].slice 0\n    closes.reverse()\n    for bracket in closes\n      output.sendIP 'out', new noflo.IP 'closeBracket', bracket\n\n    output.done()\n"},
  "core/Drop": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'This component drops every packet it receives with no\n  action'\n  c.icon = 'trash-o'\n\n  c.inPorts.add 'in',\n    datatypes: 'all'\n    description: 'Packet to be dropped'\n\n  c.process (input, output) ->\n    data = input.get 'in'\n    data.drop()\n    output.done()\n    return\n"},
  "core/Kick": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'This component generates a single packet and sends it to\n  the output port. Mostly usable for debugging, but can also be useful\n  for starting up networks.'\n  c.icon = 'share'\n\n  c.inPorts.add 'in',\n    datatype: 'bang'\n    description: 'Signal to send the data packet'\n  c.inPorts.add 'data',\n    datatype: 'all'\n    description: 'Packet to be sent'\n    control: true\n    default: null\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.process (input, output) ->\n    return unless input.hasStream 'in'\n    return if input.attached('data').length and not input.hasData 'data'\n    bang = input.getData 'in'\n    data = input.getData 'data'\n    output.send\n      out: data\n    output.done()\n"},
  "core/MakeFunction": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Evaluates a function each time data hits the \"in\" port\n  and sends the return value to \"out\". Within the function \"x\" will\n  be the variable from the in port. For example, to make a ^2 function\n  input \"return x*x;\" to the function port.'\n  c.icon = 'code'\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be processed'\n  c.inPorts.add 'function',\n    datatype: 'string'\n    description: 'Function to evaluate'\n    control: true\n  c.outPorts.add 'out',\n    datatype: 'all'\n  c.outPorts.add 'function',\n    datatype: 'function'\n  c.outPorts.add 'error',\n    datatype: 'object'\n\n  prepareFunction = (func, callback) ->\n    if typeof func is 'function'\n      callback null, func\n      return\n    try\n      newFunc = Function 'x', func\n    catch e\n      callback e\n      return\n    callback null, newFunc\n\n  c.process (input, output) ->\n    return if input.attached('in').length and not input.hasData 'in'\n    if input.hasData 'function', 'in'\n      # Both function and input data\n      prepareFunction input.getData('function'), (err, func) ->\n        if err\n          output.done e\n          return\n        data = input.getData 'in'\n        try\n          result = func data\n        catch e\n          output.done e\n          return\n        output.sendDone\n          function: func\n          out: result\n        return\n      return\n    return unless input.hasData 'function'\n    prepareFunction input.getData('function'), (err, func) ->\n      if err\n        output.done e\n        return\n      output.sendDone\n        function: func\n      return\n    return\n"},
  "core/Merge": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'This component receives data on multiple input ports and\n    sends the same data out to the connected output port'\n  c.icon = 'compress'\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be forwarded'\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.process (input, output) ->\n    data = input.get 'in'\n    output.sendDone\n      out: data\n"},
  "core/Output": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nunless noflo.isBrowser()\n  util = require 'util'\nelse\n  util =\n    inspect: (data) -> data\n\nlog = (options, data) ->\n  if options?\n    console.log util.inspect data,\n      options.showHidden, options.depth, options.colors\n  else\n    console.log data\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Sends the data items to console.log'\n  c.icon = 'bug'\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be printed through console.log'\n  c.inPorts.add 'options',\n    datatype: 'object'\n    description: 'Options to be passed to console.log'\n    control: true\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.process (input, output) ->\n    return unless input.hasData 'in'\n    return if input.attached('options').length and not input.hasData 'options'\n\n    options = null\n    if input.has 'options'\n      options = input.getData 'options'\n\n    data = input.getData 'in'\n    log options, data\n    output.sendDone\n      out: data\n"},
  "core/ReadGlobal": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Returns the value of a global variable.'\n  c.icon = 'usd'\n\n  # inPorts\n  c.inPorts.add 'name',\n    description: 'The name of the global variable.'\n\n  # outPorts\n  c.outPorts.add 'value',\n    description: 'The value of the variable.'\n\n  c.outPorts.add 'error',\n    description: 'Any errors that occured reading the variables value.'\n\n  c.forwardBrackets =\n    name: ['value', 'error']\n\n  c.process (input, output) ->\n    return unless input.hasData 'name'\n    data = input.getData 'name'\n\n    value = unless noflo.isBrowser() then global[data] else window[data]\n\n    if typeof value is 'undefined'\n      err = new Error \"\\\"#{data}\\\" is undefined on the global object.\"\n      output.sendDone err\n      return\n    output.sendDone\n      value: value\n"},
  "core/Repeat": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Forwards packets and metadata in the same way\n  it receives them'\n  c.icon = 'forward'\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to forward'\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.process (input, output) ->\n    data = input.get 'in'\n    output.sendDone\n      out: data\n"},
  "core/RepeatAsync": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = \"Like 'Repeat', except repeat on next tick\"\n  c.icon = 'step-forward'\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to forward'\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.process (input, output) ->\n    data = input.get 'in'\n    setTimeout ->\n      output.sendDone\n        out: data\n    , 0\n"},
  "core/RepeatDelayed": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Forward packet after a set delay'\n  c.icon = 'clock-o'\n\n  c.timers = []\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be forwarded with a delay'\n  c.inPorts.add 'delay',\n    datatype: 'number'\n    description: 'How much to delay'\n    default: 500\n    control: true\n\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.tearDown = (callback) ->\n    clearTimeout timer for timer in c.timers\n    c.timers = []\n    callback()\n\n  c.process (input, output) ->\n    return unless input.hasData 'in'\n    return if input.attached('delay').length and not input.hasData 'delay'\n\n    delay = 500\n    if input.hasData 'delay'\n      delay = input.getData 'delay'\n    payload = input.get 'in'\n\n    timer = setTimeout ->\n      c.timers.splice c.timers.indexOf(timer), 1\n      output.sendDone\n        out: payload\n    , delay\n    c.timers.push timer\n"},
  "core/RunInterval": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Send a packet at the given interval'\n  c.icon = 'clock-o'\n  c.inPorts.add 'interval',\n    datatype: 'number'\n    description: 'Interval at which output packets are emitted (ms)'\n    required: true\n    control: true\n  c.inPorts.add 'start',\n    datatype: 'bang'\n    description: 'Start the emission'\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n    description: 'Stop the emission'\n  c.outPorts.add 'out',\n    datatype: 'bang'\n\n  c.timers = {}\n\n  cleanUp = (scope) ->\n    return unless c.timers[scope]\n    clearInterval c.timers[scope].interval\n    c.timers[scope].deactivate()\n    c.timers[scope] = null\n\n  c.tearDown = (callback) ->\n    for scope, context of c.timers\n      cleanUp scope\n    c.timers = {}\n    callback()\n\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'start'\n      return unless input.hasData 'interval'\n      start = input.get 'start'\n      return unless start.type is 'data'\n      interval = parseInt input.getData 'interval'\n      # Ensure we deactivate previous interval in this scope, if any\n      cleanUp start.scope\n\n      # Set up interval\n      context.interval = setInterval ->\n        bang = new noflo.IP 'data', true\n        bang.scope = start.scope\n        c.outPorts.out.sendIP bang\n      , interval\n\n      # Register scope, we keep it active until stopped\n      c.timers[start.scope] = context\n      return\n\n    if input.hasData 'stop'\n      stop = input.get 'stop'\n      return unless stop.type is 'data'\n      # Deactivate interval in this scope\n      cleanUp stop.scope\n      return\n"},
  "core/RunTimeout": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Send a packet after the given time in ms'\n  c.icon = 'clock-o'\n\n  c.timer = {}\n\n  c.inPorts.add 'time',\n    datatype: 'number'\n    description: 'Time after which a packet will be sent'\n    required: true\n    control: true\n  c.inPorts.add 'start',\n    datatype: 'bang'\n    description: 'Start the timeout before sending a packet'\n  c.outPorts.add 'out',\n    datatype: 'bang'\n\n  c.forwardBrackets =\n    start: ['out']\n\n  c.stopTimer = (scope) ->\n    return unless c.timer[scope]\n    clearTimeout c.timer[scope].timeout\n    c.timer[scope].deactivate()\n    delete c.timer[scope]\n\n  c.tearDown = (callback) ->\n    for scope, timer of c.timer\n      c.stopTimer scope\n    callback()\n\n  c.process (input, output, context) ->\n    return unless input.hasData 'time', 'start'\n    time = input.getData 'time'\n    bang = input.getData 'start'\n    # Ensure we deactivate previous timeout, if any\n    c.stopTimer input.scope\n    # Set up new timer\n    context.timeout = setTimeout ->\n      c.timer = null\n      output.sendDone\n        out: true\n    , time\n    c.timer[input.scope] = context\n    return\n"},
  "core/SendNext": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Sends next packet in buffer when receiving a bang'\n  c.icon = 'forward'\n\n  c.inPorts.add 'data',\n    datatype: 'all'\n  c.inPorts.add 'in',\n    datatype: 'bang'\n  c.outPorts.add 'out',\n    datatype: 'all'\n  c.outPorts.add 'empty',\n    datatype: 'bang'\n    required: false\n\n  c.forwardBrackets = {}\n  c.process (input, output) ->\n    return unless input.hasData 'in'\n    bang = input.getData 'in'\n\n    unless input.hasData 'data'\n      # No data packets in the buffer, send \"empty\"\n      output.sendDone\n        empty: true\n      return\n\n    sent = false\n    # Loop until we've either drained the buffer completely, or until\n    # we hit the next data packet\n    while input.has 'data'\n      if sent\n        # If we already sent data, we look ahead to see if next packet is data and bail out\n        buf = c.inPorts.data.getBuffer bang.scope\n        break if buf[0].type is 'data'\n\n      packet = input.get 'data'\n      output.send\n        out: packet\n      sent = true if packet.type is 'data'\n    # After the loop we can deactivate\n    output.done()\n"},
  "core/Split": {"language":"coffeescript","source":"noflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.icon = 'expand'\n  c.description = 'This component receives data on a single input port and\n    sends the same data out to all connected output ports'\n\n  c.inPorts.add 'in',\n    datatype: 'all'\n    description: 'Packet to be forwarded'\n\n  c.outPorts.add 'out',\n    datatype: 'all'\n\n  c.process (input, output) ->\n    data = input.get 'in'\n    output.sendDone\n      out: data\n"},
  "dom/AddClass": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Add a class to an element'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.inPorts.add 'class',\n    datatype: 'string'\n\n  c.process (input, output) ->\n    return unless input.has 'element', 'class'\n    [element, className] = input.getData 'element', 'class'\n    element.classList.add className\n    output.done()\n"},
  "dom/AppendChild": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Append elements as children of a parent element'\n  c.inPorts.add 'parent',\n    datatype: 'object'\n  c.inPorts.add 'child',\n    datatype: 'object'\n\n  c.process (input, output) ->\n    return unless input.hasData 'parent', 'child'\n    [parent, child] = input.getData 'parent', 'child'\n    parent.appendChild child\n    output.done()\n"},
  "dom/CreateElement": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Create a new DOM Element'\n  c.inPorts.add 'tagname',\n    datatype: 'string'\n  c.inPorts.add 'container',\n    datatype: 'object'\n  c.outPorts.add 'element',\n    datatype: 'object'\n  c.forwardBrackets =\n    tagname: ['element']\n\n  c.process (input, output) ->\n    return unless input.hasData 'tagname'\n    if c.inPorts.container.isAttached()\n      # If container is attached, we want it too\n      return unless input.hasData 'container'\n\n    tagname = input.getData 'tagname'\n    element = document.createElement tagname\n    if input.hasData 'container'\n      container = input.getData 'container'\n      container.appendChild element\n\n    output.sendDone\n      element: element\n"},
  "dom/CreateFragment": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c. description = 'Create a new DOM DocumentFragment'\n  c.inPorts.add 'in',\n    datatype: 'bang'\n  c.outPorts.add 'fragment',\n    datatype: 'object'\n\n  c.forwardBrackets =\n    in: ['fragment']\n\n  c.process (input, output) ->\n    return unless input.hasData 'in'\n    input.getData 'in'\n    fragment = document.createDocumentFragment()\n    output.sendDone\n      fragment: fragment\n"},
  "dom/GetAttribute": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = \"Reads the given attribute from the DOM element on the in\n    port.\"\n\n  # Define in ports.\n  c.inPorts.add 'element',\n    datatype: 'object'\n    description: 'The element from which to read the attribute from.'\n    required: true\n\n  c.inPorts.add 'attribute',\n    datatype: 'string'\n    description: 'The attribute which is read from the DOM element.'\n    required: true\n    control: true\n\n  # Define out ports.\n  c.outPorts.add 'out',\n    datatype: 'string'\n    description: 'Value of the attribute being read.'\n\n  c.forwardBrackets =\n    element: ['out']\n\n  # On data flow.\n  c.process (input, output) ->\n    return unless input.hasData 'element', 'attribute'\n    [element, attribute] = input.getData 'element', 'attribute'\n    value = element.getAttribute attribute\n    output.sendDone\n      out: value\n"},
  "dom/GetElement": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description ='Get a DOM element matching a query'\n  c.inPorts.add 'in',\n    datatype: 'object'\n    description: 'DOM element to constrain the query to'\n  c.inPorts.add 'selector',\n    datatype: 'string'\n    description: 'CSS selector'\n  c.outPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'error',\n    datatype: 'object'\n  c.forwardBrackets =\n    selector: ['element', 'error']\n  c.process (input, output) ->\n    return unless input.hasData 'selector'\n    return unless input.hasData 'in' if input.attached('in').length > 0\n    if input.hasData 'in'\n      # Element-scoped selector\n      [container, selector] = input.getData 'in', 'selector'\n      unless typeof container.querySelector is 'function'\n        output.done new Error 'Given container doesn\\'t support querySelectors'\n        return\n      el = container.querySelectorAll selector\n      unless el.length\n        output.done new Error \"No element matching '#{selector}' found under container\"\n        return\n      for element in el\n        output.send\n          element: element\n      output.done()\n      return\n    selector = input.getData 'selector'\n    el = document.querySelectorAll selector\n    unless el.length\n      output.done new Error \"No element matching '#{selector}' found under document\"\n      return\n    for element in el\n      output.send\n        element: element\n    output.done()\n"},
  "dom/HasClass": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Check if an element has a given class'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.inPorts.add 'class',\n    datatype: 'string'\n  c.outPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'missed',\n    datatype: 'object'\n  c.process (input, output) ->\n    return unless input.hasData 'element', 'class'\n    [element, klass] = input.getData 'element', 'class'\n    if element.classList.contains klass\n      output.sendDone\n        element: element\n      return\n    output.sendDone\n      missed: element\n"},
  "dom/Listen": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'addEventListener for specified event type'\n  c.icon = 'stethoscope'\n\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.inPorts.add 'type',\n    datatype: 'string'\n  c.inPorts.add 'preventdefault',\n    datatype: 'boolean'\n    control: true\n    default: false\n  c.outPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'event',\n    datatype: 'object'\n\n  c.elements = {}\n  cleanUp = (scope) ->\n    return unless c.elements[scope]\n    {element, event, listener} = c.elements[scope]\n    element.removeEventListener event, listener\n    c.elements[scope].deactivate()\n    delete c.elements[scope]\n  c.tearDown = (callback) ->\n    for scope, element of c.elements\n      cleanUp scope\n    c.elements = {}\n    callback()\n  c.forwardBrackets = {}\n\n  c.process (input, output, context) ->\n\n    return unless input.hasData 'element', 'type'\n    [element, type] = input.getData 'element', 'type'\n\n    preventDefault = false\n    if input.hasData 'preventdefault'\n      preventDefault = input.getData 'preventdefault'\n\n    scope = null\n    cleanUp scope\n\n    context.element = element\n    context.event = type\n    context.listener = (event) ->\n      event.preventDefault() if preventDefault\n      output.send\n        element: context.element\n        event: event\n    c.elements[context] = context\n    element.addEventListener type, context.listener\n"},
  "dom/ReadHtml": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Read HTML from an existing element'\n  c.inPorts.add 'container',\n    datatype: 'object'\n  c.outPorts.add 'html',\n    datatype: 'string'\n  c.forwardBrackets =\n    container: ['html']\n  c.process (input, output) ->\n    return unless input.hasData 'container'\n    container = input.getData 'container'\n    output.sendDone\n      html: container.innerHTML\n"},
  "dom/RemoveClass": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Remove a class from an element'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.inPorts.add 'class',\n    datatype: 'string'\n\n  c.process (input, output) ->\n    return unless input.has 'element', 'class'\n    [element, className] = input.getData 'element', 'class'\n    element.classList.remove className\n    output.done()\n"},
  "dom/RemoveElement": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Remove an element from DOM'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.process (input, output) ->\n    return unless input.hasData 'element'\n    element = input.getData 'element'\n    return unless element.parentNode\n    element.parentNode.removeChild element\n    output.done()\n"},
  "dom/RequestAnimationFrame": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nrequestAnimationFrame =\n  window.requestAnimationFrame       ||\n  window.webkitRequestAnimationFrame ||\n  window.mozRequestAnimationFrame    ||\n  window.oRequestAnimationFrame      ||\n  window.msRequestAnimationFrame     ||\n  (callback, element) ->\n    window.setTimeout( ->\n      callback(+new Date())\n    , 1000 / 60)\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Sends bangs that correspond with screen refresh rate.'\n  c.icon = 'film'\n\n  c.inPorts.add 'start',\n    datatype: 'bang'\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n  c.outPorts.add 'out',\n    datatype: 'bang'\n\n  c.running = {}\n  cleanUp = (scope) ->\n    return unless c.running[scope]\n    c.running[scope].deactivate()\n    delete c.running[scope]\n  c.tearDown = (callback) ->\n    for scope, running of c.running\n      cleanUp scope\n    c.running = {}\n    callback()\n  c.animate = (scope, output) ->\n    # Stop when context has been stopped\n    return unless c.running[scope]\n    # Send bang\n    output.send true\n    # Request next frame\n    requestAnimationFrame c.animate.bind c, scope, output\n\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'start'\n      start = input.get 'start'\n      return unless start.type is 'data'\n      # Ensure previous was deactivated\n      cleanUp start.scope\n\n      # Register scope\n      c.running[start.scope] = context\n\n      # Request first frame\n      requestAnimationFrame c.animate.bind c, start.scope, output\n      return\n\n    if input.hasData 'stop'\n      stop = input.get 'stop'\n      return unless stop.type is 'data'\n      # Deactivate this scope\n      cleanUp stop.scope\n      return\n"},
  "dom/SetAttribute": {"language":"coffeescript","source":"'use strict'\n\n# @runtime noflo-browser\n\nnoflo = require 'noflo'\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = \"Set the given attribute on the DOM element to the received\n    value.\"\n    \n  # Define in ports.\n  c.inPorts.add 'element',\n    datatype: 'object'\n    description: 'The element on which to set the attribute.'\n\n  c.inPorts.add 'attribute',\n    datatype: 'string'\n    description: 'The attribute which is set on the DOM element.'\n\n  c.inPorts.add 'value',\n    datatype: 'string'\n    description: 'Value of the attribute being set.'\n  \n  # Define out ports.\n  c.outPorts.add 'element',\n    datatype: 'object'\n    description: 'The element that was updated.'\n\n  c.forwardBrackets =\n    element: ['element']\n    value: ['element']\n\n  c.process (input, output) ->\n    return unless input.hasData 'element', 'attribute', 'value'\n    [element, attribute, value] = input.getData 'element', 'attribute', 'value'\n    if typeof value is 'object'\n      if toString.call(value) is '[object Array]'\n        value = value.join ' '\n      else\n        newVal = []\n        newVal.push val for key, val of value\n        value = newVal.join ' '\n    if attribute is \"value\"\n      element.value = value\n    else\n      element.setAttribute attribute, value\n\n    output.sendDone\n      element: element\n"},
  "dom/WriteHtml": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Write HTML inside an existing element'\n  c.inPorts.add 'container',\n    datatype: 'object'\n  c.inPorts.add 'html',\n    datatype: 'string'\n  c.outPorts.add 'container',\n    datatype: 'object'\n  c.process (input, output) ->\n    return unless input.hasData 'container', 'html'\n    [container, html] = input.getData 'container', 'html'\n    container.innerHTML = html\n    output.sendDone\n      container: container\n"},
  "interaction/Focus": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.icon = 'i-cursor'\n  c.description = 'focus element'\n  c.inPorts.add 'element',\n    datatype: 'object'\n    description: 'element to be focused'\n    control: true\n  c.inPorts.add 'trigger',\n    datatype: 'bang'\n    description: 'trigger focus'\n  c.outPorts.add 'out',\n    datatype: 'bang'\n  c.process (input, output) ->\n    return unless input.hasData 'element', 'trigger'\n    element = input.getData 'element'\n    input.getData 'trigger'\n    window.setTimeout ->\n      element.focus()\n      output.sendDone\n        out: true\n    , 0\n"},
  "interaction/ListenChange": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen to changes on an input element'\n  c.icon = 'hourglass'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'value',\n    datatype: 'object'\n  c.elements = []\n  c.tearDown = (callback) ->\n    for element in c.elements\n      element.el.removeEventListener 'change', element.listener, false\n      element.ctx.deactivate()\n    c.elements = []\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    return unless input.hasData 'element'\n    data =\n      el: input.getData 'element'\n      listener: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        output.send\n          value: event.target.value\n      ctx: context\n    data.el.addEventListener 'change', data.listener, false\n    c.elements.push data\n    return\n"},
  "interaction/ListenDrag": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description =  'Listen to drag events on a DOM element'\n  c.icon = 'arrows'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'start',\n    datatype: 'object'\n  c.outPorts.add 'movey',\n    datatype: 'number'\n  c.outPorts.add 'movex',\n    datatype: 'number'\n  c.outPorts.add 'end',\n    datatype: 'object'\n  c.elements = []\n  c.tearDown = (callback) ->\n    for element in c.elements\n      element.el.removeEventListener 'dragstart', element.dragstart, false\n      element.el.removeEventListener 'drag', element.dragmove, false\n      element.el.removeEventListener 'dragend', element.dragend, false\n      element.ctx.deactivate()\n    c.elements = []\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    return unless input.hasData 'element'\n    data =\n      el: input.getData 'element'\n      dragstart: (event) ->\n        event.stopPropagation()\n        output.send\n          start: event\n      dragmove: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        output.send\n          movex: event.clientX\n          movey: event.clientY\n      dragend: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        output.send\n          end: event\n      ctx: context\n    data.el.addEventListener 'dragstart', data.dragstart, false\n    data.el.addEventListener 'drag', data.dragmove, false\n    data.el.addEventListener 'dragend', data.dragend, false\n    c.elements.push data\n    return\n"},
  "interaction/ListenHash": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen for hash changes in browser\\'s URL bar'\n  c.icon = 'slack'\n  c.inPorts.add 'start',\n    datatype: 'bang'\n    description: 'Start listening for hash changes'\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n    description: 'Stop listening for hash changes'\n  c.outPorts.add 'initial',\n    datatype: 'string'\n  c.outPorts.add 'change',\n    datatype: 'string'\n  c.current = null\n  c.subscriber = null\n  unsubscribe = ->\n    return unless c.subscriber\n    window.removeEventListener 'hashchange', c.subscriber.callback, false\n    c.subscriber.ctx.deactivate()\n    c.subscriber = null\n  c.tearDown = (callback) ->\n    c.current = null\n    do unsubscribe\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'start'\n      input.getData 'start'\n      # Ensure previous subscription is ended\n      do unsubscribe\n      sendHash = (port) ->\n        oldHash = c.current\n        c.current = window.location.href.split('#')[1] or ''\n        if oldHash\n          output.send\n            change: new noflo.IP 'openBracket', oldHash\n        payload = {}\n        payload[port] = c.current\n        output.send payload\n        if oldHash\n          output.send\n            change: new noflo.IP 'closeBracket', oldHash\n      c.subscriber =\n        callback: (event) ->\n          sendHash 'change'\n        ctx: context\n      # Send initial\n      sendHash 'initial'\n      window.addEventListener 'hashchange', c.subscriber.callback, false\n      return\n    if input.hasData 'stop'\n      input.getData 'stop'\n      do unsubscribe\n      output.done()\n      return\n"},
  "interaction/ListenKeyboard": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen for key presses on a given DOM element'\n  c.icon = 'keyboard-o'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.inPorts.add 'stop',\n    datatype: 'object'\n  c.outPorts.add 'keypress',\n    datatype: 'integer'\n  c.elements = []\n  unsubcribe = (element) ->\n    element.el.removeEventListener 'keypress', element.listener, false\n    element.ctx.deactivate()\n  c.tearDown = (callback) ->\n    unsubscribe element for element in c.elements\n    c.elements = []\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'element'\n      data =\n        el: input.getData 'element'\n        listener: (event) ->\n          output.send\n            keypress: event.keyCode\n        ctx: context\n      data.el.addEventListener 'keypress', data.listener, false\n      c.elements.push data\n      return\n    if input.hasData 'stop'\n      element = input.getData 'stop'\n      ctx = null\n      for el in c.elements\n        continue unless el.el is element\n        ctx = el\n      return unless ctx\n      unsubscribe ctx\n      output.done()\n"},
  "interaction/ListenKeyboardShortcuts": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen for keyboard shortcuts and route them'\n  c.icon = 'keyboard-o'\n  c.inPorts.add 'keys',\n    datatype: 'array'\n  c.inPorts.add 'ignoreinput',\n    datatype: 'boolean'\n    default: true\n    control: true\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n  c.outPorts.add 'shortcut',\n    datatype: 'bang'\n    addressable: true\n  c.outPorts.add 'missed',\n    datatype: 'integer'\n  c.subscriber = null\n  unsubscribe = ->\n    return unless c.subscriber\n    document.removeEventListener 'keydown', c.subscriber.callback, false\n    c.subscriber.ctx.deactivate()\n    c.subscriber = null\n  c.tearDown = (callback) ->\n    do unsubscribe\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'keys'\n      keys = input.getData 'keys'\n\n      # Ensure previous subscription is ended\n      do unsubscribe\n\n      # Older version of this component used string input\n      keys = keys.split ',' if typeof keys is 'string'\n\n      # We allow some common keyboard shortcuts to be passed as strings\n      for key, index in keys\n        switch key\n          when '-' then keys[index] = 189\n          when '=' then keys[index] = 187\n          when '0' then keys[index] = 48\n          when 'a' then keys[index] = 65\n          when 'x' then keys[index] = 88\n          when 'c' then keys[index] = 67\n          when 'v' then keys[index] = 86\n          when 'z' then keys[index] = 90\n          when 'r' then keys[index] = 82\n\n      ignoreInput = if input.hasData('ignoreinput') then input.getData('ignoreinput') else true\n\n      c.subscriber =\n        callback: (event) ->\n          return unless event.ctrlKey or event.metaKey\n          return if event.target.tagName is 'TEXTAREA' and ignoreInput\n          return if event.target.tagName is 'INPUT' and ignoreInput\n          return if String(event.target.contentEditable) is 'true' and ignoreInput\n          route = keys.indexOf event.keyCode\n          if route is -1\n            output.send\n              missed: event.keyCode\n            return\n          event.preventDefault()\n          event.stopPropagation()\n          output.send\n            shortcut: new noflo.IP 'data', event.keyCode,\n              index: route\n        ctx: context\n      document.addEventListener 'keydown', c.subscriber.callback, false\n      return\n    if input.hasData 'stop'\n      input.getData 'stop'\n      do unsubscribe\n      output.done()\n      return\n"},
  "interaction/ListenMouse": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.icon = 'mouse-pointer'\n  c.description = 'Listen to mouse events on a DOM element'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'click',\n    datatype: 'object'\n  c.outPorts.add 'dblclick',\n    datatype: 'object'\n  c.elements = []\n  c.tearDown = (callback) ->\n    for element in c.elements\n      element.el.removeEventListener 'click', element.click, false\n      element.el.removeEventListener 'dblclick', element.dblclick, false\n      element.ctx.deactivate()\n    c.elements = []\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    return unless input.hasData 'element'\n    data =\n      el: input.getData 'element'\n      click: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        output.send\n          click: event\n      dblclick: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        output.send\n          dblclick: event\n      ctx: context\n    data.el.addEventListener 'click', data.click, false\n    data.el.addEventListener 'dblclick', data.dblclick, false\n    c.elements.push data\n    return\n"},
  "interaction/ListenPointer": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen to pointer events on a DOM element'\n  c.icon = 'pencil-square-o'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.inPorts.add 'action',\n    datatype: 'string'\n    default: 'none'\n    control: true\n  events = [\n    'down'\n    'up'\n    'cancel'\n    'move'\n    'over'\n    'out'\n    'enter'\n    'leave'\n  ]\n  for event in events\n    c.outPorts.add event,\n      datatype: 'object'\n      description: \"Sends event on pointer#{event}\"\n  c.elements = []\n  c.tearDown = (callback) ->\n    for element in c.elements\n      if element.el.removeAttribute\n        element.el.removeAttribute 'touch-action'\n      for event in events\n        element.el.removeEventListener \"pointer#{event}\", element[\"pointer#{event}\"], false\n      element.ctx.deactivate()\n    c.elements = []\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    return unless input.hasData 'element'\n    action = if input.hasData('action') then input.getData('action') else 'none'\n    data =\n      el: input.getData 'element'\n      ctx: context\n    data.el.setAttribute 'touch-action', action\n    events.forEach (event) ->\n      data[\"pointer#{event}\"] = (ev) ->\n        ev.preventDefault()\n        ev.stopPropagation()\n        payload = {}\n        payload[event] = ev.target.value\n        output.send payload\n      data.el.addEventListener \"pointer#{event}\", data[\"pointer#{event}\"], false\n    c.elements.push data\n    return\n"},
  "interaction/ListenResize": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen to window resize events'\n  c.icon = 'desktop'\n  c.inPorts.add 'start',\n    datatype: 'bang'\n    description: 'Start listening for screen resizes'\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n    description: 'Stop listening for screen resizes'\n  c.outPorts.add 'width',\n    datatype: 'number'\n  c.outPorts.add 'height',\n    datatype: 'number'\n  c.subscriber = null\n  unsubscribe = ->\n    return unless c.subscriber\n    window.removeEventListener 'resize', c.subscriber.callback, false\n    c.subscriber.ctx.deactivate()\n    c.subscriber = null\n  c.tearDown = (callback) ->\n    do unsubscribe\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'start'\n      input.getData 'start'\n      # Ensure previous subscription is ended\n      do unsubscribe\n      c.subscriber =\n        callback: (event) ->\n          output.send\n            width: window.innerWidth\n            height: window.innerHeight\n        ctx: context\n      output.send\n        width: window.innerWidth\n        height: window.innerHeight\n      window.addEventListener 'resize', c.subscriber.callback, false\n      return\n    if input.hasData 'stop'\n      input.getData 'stop'\n      do unsubscribe\n      output.done()\n      return\n"},
  "interaction/ListenScroll": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen to scroll events on the browser window'\n  c.icon = 'arrows-v'\n  c.inPorts.add 'start',\n    datatype: 'bang'\n    description: 'Start listening for hash changes'\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n    description: 'Stop listening for hash changes'\n  c.outPorts.add 'top',\n    datatype: 'number'\n  c.outPorts.add 'bottom',\n    datatype: 'number'\n  c.outPorts.add 'left',\n    datatype: 'number'\n  c.outPorts.add 'right',\n    datatype: 'number'\n  c.subscriber = null\n  unsubscribe = ->\n    return unless c.subscriber\n    window.removeEventListener 'scroll', c.subscriber.callback, false\n    c.subscriber.ctx.deactivate()\n    c.subscriber = null\n  c.tearDown = (callback) ->\n    do unsubscribe\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'start'\n      input.getData 'start'\n      # Ensure previous subscription is ended\n      do unsubscribe\n      c.subscriber =\n        callback: (event) ->\n          top = window.scrollY\n          left = window.scrollX\n          output.send\n            top: top\n            bottom: top + window.innerHeight\n            left: left\n            right: left.window.innerWidth\n        ctx: context\n      window.addEventListener 'scroll', c.subscriber.callback, false\n      return\n    if input.hasData 'stop'\n      input.getData 'stop'\n      do unsubscribe\n      output.done()\n      return\n"},
  "interaction/ListenSpeech": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen for user\\'s microphone and recognize phrases'\n  c.icon = 'microphone'\n  c.inPorts.add 'start',\n    datatype: 'bang'\n    description: 'Start listening for hash changes'\n  c.inPorts.add 'stop',\n    datatype: 'bang'\n    description: 'Stop listening for hash changes'\n  c.outPorts.add 'result',\n    datatype: 'string'\n  c.outPorts.add 'error',\n    datatype: 'object'\n  c.subscriber = null\n  unsubscribe = ->\n    return unless c.subscriber\n    do c.subscriber.recognition.stop\n    do c.subscriber.ctx.deactivate\n    c.subscriber = null\n  c.tearDown = (callback) ->\n    do unsubscribe\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    if input.hasData 'start'\n      input.getData 'start'\n      # Ensure previous subscription is ended\n      do unsubscribe\n      unless window.webkitSpeechRecognition\n        output.done new Error 'Speech recognition support not available'\n        return\n      c.subscriber =\n        sent: []\n        callback: (event) ->\n          for result, idx in event.results\n            continue unless result.isFinal\n            if c.subscriber.sent.indexOf(idx) isnt -1\n              continue\n            output.send\n              result: result[0].transcript\n            c.subscriber.sent.push idx\n        error: (err) ->\n          output.send\n            error: err\n        ctx: context\n      c.subscriber.recognition = new window.webkitSpeechRecognition\n      c.subscriber.recognition.continuous = true\n      c.subscriber.recognition.start()\n      c.subscriber.recognition.onresult = c.subscriber.callback\n      c.subscriber.recognition.onerror = c.subscriber.error\n      return\n    if input.hasData 'stop'\n      input.getData 'stop'\n      do unsubscribe\n      output.done()\n      return\n"},
  "interaction/ListenTouch": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Listen to touch events on a DOM element'\n  c.icon = 'hand-o-up'\n  c.inPorts.add 'element',\n    datatype: 'object'\n  c.outPorts.add 'start',\n    datatype: 'object'\n  c.outPorts.add 'movex',\n    datatype: 'number'\n  c.outPorts.add 'movey',\n    datatype: 'number'\n  c.outPorts.add 'end',\n    datatype: 'object'\n  c.elements = []\n  c.tearDown = (callback) ->\n    for element in c.elements\n      element.el.removeEventListener 'touchstart', element.touchstart, false\n      element.el.removeEventListener 'touchmove', element.touchmove, false\n      element.el.removeEventListener 'touchend', element.touchend, false\n      element.ctx.deactivate()\n    c.elements = []\n    do callback\n  c.forwardBrackets = {}\n  c.process (input, output, context) ->\n    return unless input.hasData 'element'\n    data =\n      el: input.getData 'element'\n      touchstart: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        return unless event.changedTouches\n        return unless event.changedTouches.length\n        for touch, idx in event.changedTouches\n          output.send\n            start: new noflo.IP 'data', event,\n              touch: idx\n      touchmove: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        return unless event.changedTouches\n        return unless event.changedTouches.length\n        for touch, idx in event.changedTouches\n          output.send\n            movex: new noflo.IP 'data', touch.pageX,\n              touch: idx\n            movey: new noflo.IP 'data', touch.pageY,\n              touch: idx\n      touchend: (event) ->\n        event.preventDefault()\n        event.stopPropagation()\n        return unless event.changedTouches\n        return unless event.changedTouches.length\n        for touch, idx in event.changedTouches\n          output.send\n            end: new noflo.IP 'data', event,\n              touch: idx\n      ctx: context\n    data.el.addEventListener 'touchstart', data.touchstart, false\n    data.el.addEventListener 'touchmove', data.touchmove, false\n    data.el.addEventListener 'touchend', data.touchend, false\n    c.elements.push data\n    return\n"},
  "interaction/ReadCoordinates": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Read the coordinates from a DOM event'\n  c.icon = 'map-marker'\n  c.inPorts.add 'event',\n    datatype: 'object'\n  c.outPorts.add 'screen',\n    datatype: 'object'\n  c.outPorts.add 'client',\n    datatype: 'object'\n  c.outPorts.add 'page',\n    datatype: 'object'\n  c.forwardBrackets =\n    event: ['screen', 'client', 'page']\n  c.process (input, output) ->\n    return unless input.hasData 'event'\n    event = input.getData 'event'\n    output.sendDone\n      screen:\n        x: event.screenX\n        y: event.screenY\n      client:\n        x: event.clientX\n        y: event.clientY\n      page:\n        x: event.pageX\n        y: event.pageY\n"},
  "interaction/ReadGamepad": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Read the state of a gamepad'\n  c.icon = 'gamepad'\n  c.inPorts.add 'gamepad',\n    datatype: 'integer'\n  c.outPorts.add 'out',\n    datatype: 'object'\n  c.outPorts.add 'error',\n    datatype: 'object'\n  c.lastTimestamps = {}\n  c.tearDown = (callback) ->\n    c.lastTimestamps = {}\n    do callback\n  c.process (input, output) ->\n    return unless input.hasData 'gamepad'\n    gamepad = input.getData 'gamepad'\n    unless navigator.webkitGetGamepads\n      output.done new Error \"No WebKit Gamepad API available\"\n      return\n    gamepadState = navigator.webkitGetGamepads()[gamepad]\n    unless gamepadState\n      output.done new Error \"Gamepad '#{gamepad}' not available\"\n    if c.lastTimestamps[gamepad] = gamepadState.timestamp\n      # No change\n      output.done()\n      return\n    c.lastTimestamps[gamepad] = gamepadState.timestamp\n    output.sendDone\n      out: gamepadState\n"},
  "interaction/SetHash": {"language":"coffeescript","source":"noflo = require 'noflo'\n\n# @runtime noflo-browser\n\nexports.getComponent = ->\n  c = new noflo.Component\n  c.description = 'Set the hash in browser\\'s URL bar'\n  c.icon = 'slack'\n  c.inPorts.add 'hash',\n    datatype: 'string'\n  c.outPorts.add 'out',\n    datatype: 'string'\n  c.process (input, output) ->\n    return unless input.hasData 'hash'\n    hash = input.getData 'hash'\n    window.location.hash = \"##{hash}\"\n    output.sendDone\n      out: hash\n"}
};

exports.setSource = function (loader, packageId, name, source, language, callback) {
  var implementation;
  var originalSource = source;
  // Transpiling
  if (language === 'coffeescript') {
    if (!window.CoffeeScript) {
      return callback(new Error('CoffeeScript compiler not available'));
    }
    try {
      source = window.CoffeeScript.compile(source, {
        bare: true
      });
    } catch (e) {
      return callback(e);
    }
  }
  if (language === 'es6' || language === 'es2015') {
    if (!window.babel) {
      return callback(new Error('Babel compiler not available'));
    }
    try {
      source = window.babel.transform(source).code;
    } catch (e) {
      return callback(e);
    }
  }
  // Eval the contents to get a runnable component
  try {
    var withExports = '(function () { var exports = {}; ' + source + '; return exports; })();';
    implementation = eval(withExports);
  } catch (e) {
    return callback(e);
  }

  if (!implementation && !implementation.getComponent) {
    return callback(new Error('Provided source failed to create a runnable component'));
  }

  var fullName = packageId + '/' + name;
  sources[fullName] = {
    language: language,
    source: originalSource
  };

  loader.registerComponent(packageId, name, implementation, callback);
};

exports.getSource = function (loader, name, callback) {
  if (!loader.components[name]) {
    return callback(new Error('Component ' + name + ' not available'));
  }
  var component = loader.components[name];
  var nameParts = name.split('/');
  var componentData = {
    name: nameParts[1],
    library: nameParts[0]
  };
  if (loader.isGraph(component)) {
    componentData.code = JSON.stringify(component, null, 2);
    componentData.language = 'json';
    return callback(null, componentData);
  } else if (sources[name]) {
    componentData.code = sources[name].source;
    componentData.language = sources[name].language;
    return callback(null, componentData);
  } else if (typeof component === 'function') {
    componentData.code = component.toString();
    componentData.language = 'javascript';
    return callback(null, componentData);
  } else if (typeof component.getComponent === 'function') {
    componentData.code = component.getComponent.toString();
    componentData.language = 'javascript';
    return callback(null, componentData);
  }
  return callback(new Error('Unable to get sources for ' + name));
};

exports.register = function (loader, callback) {
  var loaders = [

  ];
  loader.setLibraryIcon('dom', 'html5')
  loader.registerComponent("browser-app", "DoSomething", __webpack_require__(36));
  loader.registerComponent("browser-app", "main", __webpack_require__(37));
  loader.registerComponent(null, "Graph", __webpack_require__(38));
  loader.registerComponent("core", "Callback", __webpack_require__(39));
  loader.registerComponent("core", "Copy", __webpack_require__(40));
  loader.registerComponent("core", "DisconnectAfterPacket", __webpack_require__(42));
  loader.registerComponent("core", "Drop", __webpack_require__(43));
  loader.registerComponent("core", "Kick", __webpack_require__(44));
  loader.registerComponent("core", "MakeFunction", __webpack_require__(45));
  loader.registerComponent("core", "Merge", __webpack_require__(46));
  loader.registerComponent("core", "Output", __webpack_require__(47));
  loader.registerComponent("core", "ReadGlobal", __webpack_require__(50));
  loader.registerComponent("core", "Repeat", __webpack_require__(51));
  loader.registerComponent("core", "RepeatAsync", __webpack_require__(52));
  loader.registerComponent("core", "RepeatDelayed", __webpack_require__(53));
  loader.registerComponent("core", "RunInterval", __webpack_require__(54));
  loader.registerComponent("core", "RunTimeout", __webpack_require__(55));
  loader.registerComponent("core", "SendNext", __webpack_require__(56));
  loader.registerComponent("core", "Split", __webpack_require__(57));
  loader.registerComponent("dom", "AddClass", __webpack_require__(58));
  loader.registerComponent("dom", "AppendChild", __webpack_require__(59));
  loader.registerComponent("dom", "CreateElement", __webpack_require__(60));
  loader.registerComponent("dom", "CreateFragment", __webpack_require__(61));
  loader.registerComponent("dom", "GetAttribute", __webpack_require__(62));
  loader.registerComponent("dom", "GetElement", __webpack_require__(63));
  loader.registerComponent("dom", "HasClass", __webpack_require__(64));
  loader.registerComponent("dom", "Listen", __webpack_require__(65));
  loader.registerComponent("dom", "ReadHtml", __webpack_require__(66));
  loader.registerComponent("dom", "RemoveClass", __webpack_require__(67));
  loader.registerComponent("dom", "RemoveElement", __webpack_require__(68));
  loader.registerComponent("dom", "RequestAnimationFrame", __webpack_require__(69));
  loader.registerComponent("dom", "SetAttribute", __webpack_require__(70));
  loader.registerComponent("dom", "WriteHtml", __webpack_require__(71));
  loader.registerComponent("interaction", "Focus", __webpack_require__(72));
  loader.registerComponent("interaction", "ListenChange", __webpack_require__(73));
  loader.registerComponent("interaction", "ListenDrag", __webpack_require__(74));
  loader.registerComponent("interaction", "ListenHash", __webpack_require__(75));
  loader.registerComponent("interaction", "ListenKeyboard", __webpack_require__(76));
  loader.registerComponent("interaction", "ListenKeyboardShortcuts", __webpack_require__(77));
  loader.registerComponent("interaction", "ListenMouse", __webpack_require__(78));
  loader.registerComponent("interaction", "ListenPointer", __webpack_require__(79));
  loader.registerComponent("interaction", "ListenResize", __webpack_require__(80));
  loader.registerComponent("interaction", "ListenScroll", __webpack_require__(81));
  loader.registerComponent("interaction", "ListenSpeech", __webpack_require__(82));
  loader.registerComponent("interaction", "ListenTouch", __webpack_require__(83));
  loader.registerComponent("interaction", "ReadCoordinates", __webpack_require__(84));
  loader.registerComponent("interaction", "ReadGamepad", __webpack_require__(85));
  loader.registerComponent("interaction", "SetHash", __webpack_require__(86))
  if (!loaders.length) {
    return callback();
  }

  registerCustomLoaders(loader, loaders, callback);
};



/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.icon = 'cog';
  c.description = 'do X';
  c.inPorts.add('in', {
    datatype: 'string'
  });
  c.outPorts.add('out', {
    datatype: 'string'
  });
  return c.process(function(input, output) {
    var data;
    if (!input.hasData('in')) {
      return;
    }
    data = input.getData('in');
    output.send({
      out: data
    });
    return output.done();
  });
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = {"properties":{"name":"main","environment":{"type":"noflo-browser","content":"<button id='button'>Go!</button>\n<p id='message'></p>"},"icon":""},"inports":{},"outports":{},"groups":[],"processes":{"dom/GetElement_7amk2":{"component":"dom/GetElement","metadata":{"label":"dom/GetElement","x":252,"y":180,"width":72,"height":72}},"core/Output_cg49":{"component":"core/Output","metadata":{"label":"core/Output","x":432,"y":360,"width":72,"height":72}},"dom/WriteHtml_fpz6j":{"component":"dom/WriteHtml","metadata":{"label":"dom/WriteHtml","x":684,"y":288,"width":72,"height":72}},"dom/GetElement_xvz54":{"component":"dom/GetElement","metadata":{"label":"dom/GetElement","x":252,"y":288,"width":72,"height":72}},"interaction/ListenMouse_1l373":{"component":"interaction/ListenMouse","metadata":{"label":"interaction/ListenMouse","x":432,"y":180,"width":72,"height":72}},"core/Kick_ey1nh":{"component":"core/Kick","metadata":{"label":"core/Kick","x":576,"y":180,"width":72,"height":72}}},"connections":[{"src":{"process":"dom/GetElement_xvz54","port":"element"},"tgt":{"process":"dom/WriteHtml_fpz6j","port":"container"},"metadata":{}},{"src":{"process":"dom/GetElement_7amk2","port":"element"},"tgt":{"process":"interaction/ListenMouse_1l373","port":"element"},"metadata":{"route":0}},{"src":{"process":"dom/GetElement_7amk2","port":"error"},"tgt":{"process":"core/Output_cg49","port":"in"},"metadata":{"route":1}},{"src":{"process":"dom/GetElement_xvz54","port":"error"},"tgt":{"process":"core/Output_cg49","port":"in"},"metadata":{"route":1}},{"src":{"process":"interaction/ListenMouse_1l373","port":"click"},"tgt":{"process":"core/Kick_ey1nh","port":"in"},"metadata":{}},{"src":{"process":"core/Kick_ey1nh","port":"out"},"tgt":{"process":"dom/WriteHtml_fpz6j","port":"html"},"metadata":{}},{"data":"#button","tgt":{"process":"dom/GetElement_7amk2","port":"selector"}},{"data":"#message","tgt":{"process":"dom/GetElement_xvz54","port":"selector"}},{"data":"Hello World!","tgt":{"process":"core/Kick_ey1nh","port":"data"}}]}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var Graph, noflo,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  noflo = __webpack_require__(0);

  Graph = (function(superClass) {
    extend(Graph, superClass);

    function Graph(metadata1) {
      this.metadata = metadata1;
      this.network = null;
      this.ready = true;
      this.started = false;
      this.starting = false;
      this.baseDir = null;
      this.loader = null;
      this.load = 0;
      this.inPorts = new noflo.InPorts({
        graph: {
          datatype: 'all',
          description: 'NoFlo graph definition to be used with the subgraph component',
          required: true
        }
      });
      this.outPorts = new noflo.OutPorts;
      this.inPorts.graph.on('ip', (function(_this) {
        return function(packet) {
          if (packet.type !== 'data') {
            return;
          }
          return _this.setGraph(packet.data, function(err) {
            if (err) {
              return _this.error(err);
            }
          });
        };
      })(this));
    }

    Graph.prototype.setGraph = function(graph, callback) {
      this.ready = false;
      if (typeof graph === 'object') {
        if (typeof graph.addNode === 'function') {
          this.createNetwork(graph, callback);
          return;
        }
        noflo.graph.loadJSON(graph, (function(_this) {
          return function(err, instance) {
            if (err) {
              return callback(err);
            }
            instance.baseDir = _this.baseDir;
            return _this.createNetwork(instance, callback);
          };
        })(this));
        return;
      }
      if (graph.substr(0, 1) !== "/" && graph.substr(1, 1) !== ":" && process && process.cwd) {
        graph = (process.cwd()) + "/" + graph;
      }
      return noflo.graph.loadFile(graph, (function(_this) {
        return function(err, instance) {
          if (err) {
            return callback(err);
          }
          instance.baseDir = _this.baseDir;
          return _this.createNetwork(instance, callback);
        };
      })(this));
    };

    Graph.prototype.createNetwork = function(graph, callback) {
      this.description = graph.properties.description || '';
      this.icon = graph.properties.icon || this.icon;
      if (!graph.name) {
        graph.name = this.nodeId;
      }
      graph.componentLoader = this.loader;
      return noflo.createNetwork(graph, (function(_this) {
        return function(err, network1) {
          _this.network = network1;
          if (err) {
            return callback(err);
          }
          _this.emit('network', _this.network);
          _this.subscribeNetwork(_this.network);
          return _this.network.connect(function(err) {
            var name, node, ref;
            if (err) {
              return callback(err);
            }
            ref = _this.network.processes;
            for (name in ref) {
              node = ref[name];
              _this.findEdgePorts(name, node);
            }
            _this.setToReady();
            return callback();
          });
        };
      })(this), true);
    };

    Graph.prototype.subscribeNetwork = function(network) {
      var contexts;
      contexts = [];
      this.network.on('start', (function(_this) {
        return function() {
          var ctx;
          ctx = {};
          contexts.push(ctx);
          return _this.activate(ctx);
        };
      })(this));
      return this.network.on('end', (function(_this) {
        return function() {
          var ctx;
          ctx = contexts.pop();
          if (!ctx) {
            return;
          }
          return _this.deactivate(ctx);
        };
      })(this));
    };

    Graph.prototype.isExportedInport = function(port, nodeName, portName) {
      var exported, i, len, priv, pub, ref, ref1;
      ref = this.network.graph.inports;
      for (pub in ref) {
        priv = ref[pub];
        if (!(priv.process === nodeName && priv.port === portName)) {
          continue;
        }
        return pub;
      }
      ref1 = this.network.graph.exports;
      for (i = 0, len = ref1.length; i < len; i++) {
        exported = ref1[i];
        if (!(exported.process === nodeName && exported.port === portName)) {
          continue;
        }
        this.network.graph.checkTransactionStart();
        this.network.graph.removeExport(exported["public"]);
        this.network.graph.addInport(exported["public"], exported.process, exported.port, exported.metadata);
        this.network.graph.checkTransactionEnd();
        return exported["public"];
      }
      return false;
    };

    Graph.prototype.isExportedOutport = function(port, nodeName, portName) {
      var exported, i, len, priv, pub, ref, ref1;
      ref = this.network.graph.outports;
      for (pub in ref) {
        priv = ref[pub];
        if (!(priv.process === nodeName && priv.port === portName)) {
          continue;
        }
        return pub;
      }
      ref1 = this.network.graph.exports;
      for (i = 0, len = ref1.length; i < len; i++) {
        exported = ref1[i];
        if (!(exported.process === nodeName && exported.port === portName)) {
          continue;
        }
        this.network.graph.checkTransactionStart();
        this.network.graph.removeExport(exported["public"]);
        this.network.graph.addOutport(exported["public"], exported.process, exported.port, exported.metadata);
        this.network.graph.checkTransactionEnd();
        return exported["public"];
      }
      return false;
    };

    Graph.prototype.setToReady = function() {
      if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
        return process.nextTick((function(_this) {
          return function() {
            _this.ready = true;
            return _this.emit('ready');
          };
        })(this));
      } else {
        return setTimeout((function(_this) {
          return function() {
            _this.ready = true;
            return _this.emit('ready');
          };
        })(this), 0);
      }
    };

    Graph.prototype.findEdgePorts = function(name, process) {
      var inPorts, outPorts, port, portName, targetPortName;
      inPorts = process.component.inPorts.ports || process.component.inPorts;
      outPorts = process.component.outPorts.ports || process.component.outPorts;
      for (portName in inPorts) {
        port = inPorts[portName];
        targetPortName = this.isExportedInport(port, name, portName);
        if (targetPortName === false) {
          continue;
        }
        this.inPorts.add(targetPortName, port);
        this.inPorts[targetPortName].once('connect', (function(_this) {
          return function() {
            if (_this.starting) {
              return;
            }
            if (_this.isStarted()) {
              return;
            }
            return _this.start(function() {});
          };
        })(this));
      }
      for (portName in outPorts) {
        port = outPorts[portName];
        targetPortName = this.isExportedOutport(port, name, portName);
        if (targetPortName === false) {
          continue;
        }
        this.outPorts.add(targetPortName, port);
      }
      return true;
    };

    Graph.prototype.isReady = function() {
      return this.ready;
    };

    Graph.prototype.isSubgraph = function() {
      return true;
    };

    Graph.prototype.setUp = function(callback) {
      this.starting = true;
      if (!this.isReady()) {
        this.once('ready', (function(_this) {
          return function() {
            return _this.setUp(callback);
          };
        })(this));
        return;
      }
      if (!this.network) {
        return callback(null);
      }
      return this.network.start(function(err) {
        if (err) {
          return callback(err);
        }
        this.starting = false;
        return callback();
      });
    };

    Graph.prototype.tearDown = function(callback) {
      this.starting = false;
      if (!this.network) {
        return callback(null);
      }
      return this.network.stop(function(err) {
        if (err) {
          return callback(err);
        }
        return callback();
      });
    };

    return Graph;

  })(noflo.Component);

  exports.getComponent = function(metadata) {
    return new Graph(metadata);
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'This component calls a given callback function for each IP it receives.  The Callback component is typically used to connect NoFlo with external Node.js code.';
  c.icon = 'sign-out';
  c.inPorts.add('in', {
    description: 'Object passed as argument of the callback',
    datatype: 'all'
  });
  c.inPorts.add('callback', {
    description: 'Callback to invoke',
    datatype: 'function',
    control: true,
    required: true
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  return c.process(function(input, output) {
    var callback, data, e, ref;
    if (!input.hasData('callback', 'in')) {
      return;
    }
    ref = input.getData('callback', 'in'), callback = ref[0], data = ref[1];
    if (typeof callback !== 'function') {
      output.done(new Error('The provided callback must be a function'));
      return;
    }
    try {
      callback(data);
    } catch (error) {
      e = error;
      return output.done(e);
    }
    return output.done();
  });
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var noflo, owl;

noflo = __webpack_require__(0);

owl = __webpack_require__(41);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'deep (i.e. recursively) copy an object';
  c.icon = 'copy';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be copied'
  });
  c.outPorts.add('out', {
    datatype: 'all',
    description: 'Copy of the original packet'
  });
  return c.process(function(input, output) {
    var copy, data;
    if (!input.hasData('in')) {
      return;
    }
    data = input.getData('in');
    copy = owl.deepCopy(data);
    output.sendDone({
      out: copy
    });
  });
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* This file is part of OWL JavaScript Utilities.

OWL JavaScript Utilities is free software: you can redistribute it and/or 
modify it under the terms of the GNU Lesser General Public License
as published by the Free Software Foundation, either version 3 of
the License, or (at your option) any later version.

OWL JavaScript Utilities is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public 
License along with OWL JavaScript Utilities.  If not, see 
<http://www.gnu.org/licenses/>.
*/

/*
  Hey, so, this deep copy is still the only attempt at a truly
  comprehensive approach, even years later. Kudos to the original
  author, one 'Oran Looney' (or, at least, that's what his blog
  sez'.

  All I did was lift it out of the closure wrapper to make it
  CommonJS requireable.
*/


function Clone() {}

// clone objects, skip other types.
function clone(target) {
  if ( typeof target == 'object' ) {
    Clone.prototype = target;
    return new Clone();
  } else {
    return target;
  }
}


// Shallow Copy 
function copy(target) {
  if (typeof target !== 'object' ) {
    return target;  // non-object have value sematics, so target is already a copy.
  } else {
    var value = target.valueOf();
    if (target != value) { 
      // the object is a standard object wrapper for a native type, say String.
      // we can make a copy by instantiating a new object around the value.
      return new target.constructor(value);
    } else {
      // ok, we have a normal object. If possible, we'll clone the original's prototype 
      // (not the original) to get an empty object with the same prototype chain as
      // the original.  If just copy the instance properties.  Otherwise, we have to 
      // copy the whole thing, property-by-property.
      if ( target instanceof target.constructor && target.constructor !== Object ) { 
	var c = clone(target.constructor.prototype);
	
	// give the copy all the instance properties of target.  It has the same
	// prototype as target, so inherited properties are already there.
	for ( var property in target) { 
	  if (target.hasOwnProperty(property)) {
	    c[property] = target[property];
	  } 
	}
      } else {
	var c = {};
	for ( var property in target ) c[property] = target[property];
      }
      
      return c;
    }
  }
}

// Deep Copy
var deepCopiers = [];

function DeepCopier(config) {
  for ( var key in config ) this[key] = config[key];
}
DeepCopier.prototype = {
  constructor: DeepCopier,
  
  // determines if this DeepCopier can handle the given object.
  canCopy: function(source) { return false; },
  
  // starts the deep copying process by creating the copy object.  You
  // can initialize any properties you want, but you can't call recursively
  // into the DeeopCopyAlgorithm.
  create: function(source) { },
  
  // Completes the deep copy of the source object by populating any properties
  // that need to be recursively deep copied.  You can do this by using the
  // provided deepCopyAlgorithm instance's deepCopy() method.  This will handle
  // cyclic references for objects already deepCopied, including the source object
  // itself.  The "result" passed in is the object returned from create().
  populate: function(deepCopyAlgorithm, source, result) {}
};

function DeepCopyAlgorithm() {
  // copiedObjects keeps track of objects already copied by this
  // deepCopy operation, so we can correctly handle cyclic references.
  this.copiedObjects = [];
  var thisPass = this;
  this.recursiveDeepCopy = function(source) {
    return thisPass.deepCopy(source);
  }
  this.depth = 0;
}
DeepCopyAlgorithm.prototype = {
  constructor: DeepCopyAlgorithm,
  
  maxDepth: 256,
  
  // add an object to the cache.  No attempt is made to filter duplicates;
  // we always check getCachedResult() before calling it.
  cacheResult: function(source, result) {
    this.copiedObjects.push([source, result]);
  },
  
  // Returns the cached copy of a given object, or undefined if it's an
  // object we haven't seen before.
  getCachedResult: function(source) {
    var copiedObjects = this.copiedObjects;
    var length = copiedObjects.length;
    for ( var i=0; i<length; i++ ) {
      if ( copiedObjects[i][0] === source ) {
	return copiedObjects[i][1];
      }
    }
    return undefined;
  },
  
  // deepCopy handles the simple cases itself: non-objects and object's we've seen before.
  // For complex cases, it first identifies an appropriate DeepCopier, then calls
  // applyDeepCopier() to delegate the details of copying the object to that DeepCopier.
  deepCopy: function(source) {
    // null is a special case: it's the only value of type 'object' without properties.
    if ( source === null ) return null;
    
    // All non-objects use value semantics and don't need explict copying.
    if ( typeof source !== 'object' ) return source;
    
    var cachedResult = this.getCachedResult(source);
    
    // we've already seen this object during this deep copy operation
    // so can immediately return the result.  This preserves the cyclic
    // reference structure and protects us from infinite recursion.
    if ( cachedResult ) return cachedResult;
    
    // objects may need special handling depending on their class.  There is
    // a class of handlers call "DeepCopiers"  that know how to copy certain
    // objects.  There is also a final, generic deep copier that can handle any object.
    for ( var i=0; i<deepCopiers.length; i++ ) {
      var deepCopier = deepCopiers[i];
      if ( deepCopier.canCopy(source) ) {
	return this.applyDeepCopier(deepCopier, source);
      }
    }
    // the generic copier can handle anything, so we should never reach this line.
    throw new Error("no DeepCopier is able to copy " + source);
  },
  
  // once we've identified which DeepCopier to use, we need to call it in a very
  // particular order: create, cache, populate.  This is the key to detecting cycles.
  // We also keep track of recursion depth when calling the potentially recursive
  // populate(): this is a fail-fast to prevent an infinite loop from consuming all
  // available memory and crashing or slowing down the browser.
  applyDeepCopier: function(deepCopier, source) {
    // Start by creating a stub object that represents the copy.
    var result = deepCopier.create(source);
    
    // we now know the deep copy of source should always be result, so if we encounter
    // source again during this deep copy we can immediately use result instead of
    // descending into it recursively.  
    this.cacheResult(source, result);
    
    // only DeepCopier::populate() can recursively deep copy.  So, to keep track
    // of recursion depth, we increment this shared counter before calling it,
    // and decrement it afterwards.
    this.depth++;
    if ( this.depth > this.maxDepth ) {
      throw new Error("Exceeded max recursion depth in deep copy.");
    }
    
    // It's now safe to let the deepCopier recursively deep copy its properties.
    deepCopier.populate(this.recursiveDeepCopy, source, result);
    
    this.depth--;
    
    return result;
  }
};

// entry point for deep copy.
//   source is the object to be deep copied.
//   maxDepth is an optional recursion limit. Defaults to 256.
function deepCopy(source, maxDepth) {
  var deepCopyAlgorithm = new DeepCopyAlgorithm();
  if ( maxDepth ) deepCopyAlgorithm.maxDepth = maxDepth;
  return deepCopyAlgorithm.deepCopy(source);
}

// publicly expose the DeepCopier class.
deepCopy.DeepCopier = DeepCopier;

// publicly expose the list of deepCopiers.
deepCopy.deepCopiers = deepCopiers;

// make deepCopy() extensible by allowing others to 
// register their own custom DeepCopiers.
deepCopy.register = function(deepCopier) {
  if ( !(deepCopier instanceof DeepCopier) ) {
    deepCopier = new DeepCopier(deepCopier);
  }
  deepCopiers.unshift(deepCopier);
}

// Generic Object copier
// the ultimate fallback DeepCopier, which tries to handle the generic case.  This
// should work for base Objects and many user-defined classes.
deepCopy.register({
  canCopy: function(source) { return true; },

  create: function(source) {
    if ( source.hasOwnProperty && source instanceof source.constructor ) {
      return clone(source.constructor.prototype);
    } else {
      return {};
    }
  },

  populate: function(deepCopy, source, result) {
    for ( var key in source ) {
      if ( source.hasOwnProperty && source.hasOwnProperty(key) ) {
    result[key] = deepCopy(source[key]);
      }
    }
    return result;
  }
});

// Array copier
deepCopy.register({
  canCopy: function(source) {
    return ( source instanceof Array );
  },
  
  create: function(source) {
    return new source.constructor();
  },
  
  populate: function(deepCopy, source, result) {
    for ( var i=0; i<source.length; i++) {
      result.push( deepCopy(source[i]) );
    }
    return result;
  }
});

// Date copier
deepCopy.register({
  canCopy: function(source) {
    return ( source instanceof Date );
  },
  
  create: function(source) {
    return new Date(source);
  }
});

// EventEmitter copier
// EventEmitters have a property which is an object, but doesn't 
// have an object prototype, so instanceof doesn't work on them
var EventEmitter = __webpack_require__(2).EventEmitter;
deepCopy.register({
  canCopy: function(source) { return source instanceof EventEmitter; },
  
  create: function(source) {
    if ( source.hasOwnProperty && source instanceof source.constructor ) {
      return clone(source.constructor.prototype);
    } else {
      return {};
    }
  },
  
  populate: function(deepCopy, source, result) {
    for ( var key in source ) {
      if ( !source.hasOwnProperty || source.hasOwnProperty(key) ) {
        result[key] = deepCopy(source[key]);
      }
    }
    return result;
  }
});

// HTML DOM Node

// utility function to detect Nodes.  In particular, we're looking
// for the cloneNode method.  The global document is also defined to
// be a Node, but is a special case in many ways.
function isNode(source) {
  return false; // LJF change here -- I don't care that I am breaking
  // this for the browser. at all.
  if ( window.Node ) {
    return source instanceof Node;
  } else {
    // the document is a special Node and doesn't have many of
    // the common properties so we use an identity check instead.
    if ( source === document ) return true;
    return (
      typeof source.nodeType === 'number' &&
	source.attributes &&
	source.childNodes &&
	source.cloneNode
    );
  }
}

// Node copier
deepCopy.register({
  canCopy: function(source) { return isNode(source); },
  
  create: function(source) {
    // there can only be one (document).
    if ( source === document ) return document;
    
    // start with a shallow copy.  We'll handle the deep copy of
    // its children ourselves.
    return source.cloneNode(false);
  },
  
  populate: function(deepCopy, source, result) {
    // we're not copying the global document, so don't have to populate it either.
    if ( source === document ) return document;
    
    // if this Node has children, deep copy them one-by-one.
    if ( source.childNodes && source.childNodes.length ) {
      for ( var i=0; i<source.childNodes.length; i++ ) {
	var childCopy = deepCopy(source.childNodes[i]);
	result.appendChild(childCopy);
      }
    }
  }
});

exports.DeepCopyAlgorithm = DeepCopyAlgorithm;
exports.copy = copy;
exports.clone = clone;
exports.deepCopy = deepCopy;



/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var brackets, c;
  c = new noflo.Component;
  c.description = 'Makes each data packet a stream of its own';
  c.icon = 'pause';
  c.forwardBrackets = {};
  c.autoOrdering = false;
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be forward with disconnection'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  brackets = {};
  c.tearDown = function(callback) {
    return brackets = {};
  };
  return c.process(function(input, output) {
    var bracket, closes, data, i, j, len, len1, ref;
    c.autoOrdering = false;
    data = input.get('in');
    if (!brackets[input.scope]) {
      brackets[input.scope] = [];
    }
    if (data.type === 'openBracket') {
      brackets[input.scope].push(data.data);
      output.done();
      return;
    }
    if (data.type === 'closeBracket') {
      brackets[input.scope].pop();
      output.done();
      return;
    }
    if (data.type !== 'data') {
      return;
    }
    ref = brackets[input.scope];
    for (i = 0, len = ref.length; i < len; i++) {
      bracket = ref[i];
      output.sendIP('out', new noflo.IP('openBracket', bracket));
    }
    output.sendIP('out', data);
    closes = brackets[input.scope].slice(0);
    closes.reverse();
    for (j = 0, len1 = closes.length; j < len1; j++) {
      bracket = closes[j];
      output.sendIP('out', new noflo.IP('closeBracket', bracket));
    }
    return output.done();
  });
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'This component drops every packet it receives with no action';
  c.icon = 'trash-o';
  c.inPorts.add('in', {
    datatypes: 'all',
    description: 'Packet to be dropped'
  });
  return c.process(function(input, output) {
    var data;
    data = input.get('in');
    data.drop();
    output.done();
  });
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'This component generates a single packet and sends it to the output port. Mostly usable for debugging, but can also be useful for starting up networks.';
  c.icon = 'share';
  c.inPorts.add('in', {
    datatype: 'bang',
    description: 'Signal to send the data packet'
  });
  c.inPorts.add('data', {
    datatype: 'all',
    description: 'Packet to be sent',
    control: true,
    "default": null
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  return c.process(function(input, output) {
    var bang, data;
    if (!input.hasStream('in')) {
      return;
    }
    if (input.attached('data').length && !input.hasData('data')) {
      return;
    }
    bang = input.getData('in');
    data = input.getData('data');
    output.send({
      out: data
    });
    return output.done();
  });
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, prepareFunction;
  c = new noflo.Component;
  c.description = 'Evaluates a function each time data hits the "in" port and sends the return value to "out". Within the function "x" will be the variable from the in port. For example, to make a ^2 function input "return x*x;" to the function port.';
  c.icon = 'code';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be processed'
  });
  c.inPorts.add('function', {
    datatype: 'string',
    description: 'Function to evaluate',
    control: true
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.outPorts.add('function', {
    datatype: 'function'
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  prepareFunction = function(func, callback) {
    var e, newFunc;
    if (typeof func === 'function') {
      callback(null, func);
      return;
    }
    try {
      newFunc = Function('x', func);
    } catch (error) {
      e = error;
      callback(e);
      return;
    }
    return callback(null, newFunc);
  };
  return c.process(function(input, output) {
    if (input.attached('in').length && !input.hasData('in')) {
      return;
    }
    if (input.hasData('function', 'in')) {
      prepareFunction(input.getData('function'), function(err, func) {
        var data, e, result;
        if (err) {
          output.done(e);
          return;
        }
        data = input.getData('in');
        try {
          result = func(data);
        } catch (error) {
          e = error;
          output.done(e);
          return;
        }
        output.sendDone({
          "function": func,
          out: result
        });
      });
      return;
    }
    if (!input.hasData('function')) {
      return;
    }
    prepareFunction(input.getData('function'), function(err, func) {
      if (err) {
        output.done(e);
        return;
      }
      output.sendDone({
        "function": func
      });
    });
  });
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'This component receives data on multiple input ports and sends the same data out to the connected output port';
  c.icon = 'compress';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be forwarded'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  return c.process(function(input, output) {
    var data;
    data = input.get('in');
    return output.sendDone({
      out: data
    });
  });
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var log, noflo, util;

noflo = __webpack_require__(0);

if (!noflo.isBrowser()) {
  util = __webpack_require__(16);
} else {
  util = {
    inspect: function(data) {
      return data;
    }
  };
}

log = function(options, data) {
  if (options != null) {
    return console.log(util.inspect(data, options.showHidden, options.depth, options.colors));
  } else {
    return console.log(data);
  }
};

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Sends the data items to console.log';
  c.icon = 'bug';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be printed through console.log'
  });
  c.inPorts.add('options', {
    datatype: 'object',
    description: 'Options to be passed to console.log',
    control: true
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  return c.process(function(input, output) {
    var data, options;
    if (!input.hasData('in')) {
      return;
    }
    if (input.attached('options').length && !input.hasData('options')) {
      return;
    }
    options = null;
    if (input.has('options')) {
      options = input.getData('options');
    }
    data = input.getData('in');
    log(options, data);
    return output.sendDone({
      out: data
    });
  });
};


/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 49 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Returns the value of a global variable.';
  c.icon = 'usd';
  c.inPorts.add('name', {
    description: 'The name of the global variable.'
  });
  c.outPorts.add('value', {
    description: 'The value of the variable.'
  });
  c.outPorts.add('error', {
    description: 'Any errors that occured reading the variables value.'
  });
  c.forwardBrackets = {
    name: ['value', 'error']
  };
  return c.process(function(input, output) {
    var data, err, value;
    if (!input.hasData('name')) {
      return;
    }
    data = input.getData('name');
    value = !noflo.isBrowser() ? global[data] : window[data];
    if (typeof value === 'undefined') {
      err = new Error("\"" + data + "\" is undefined on the global object.");
      output.sendDone(err);
      return;
    }
    return output.sendDone({
      value: value
    });
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Forwards packets and metadata in the same way it receives them';
  c.icon = 'forward';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to forward'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  return c.process(function(input, output) {
    var data;
    data = input.get('in');
    return output.sendDone({
      out: data
    });
  });
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = "Like 'Repeat', except repeat on next tick";
  c.icon = 'step-forward';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to forward'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  return c.process(function(input, output) {
    var data;
    data = input.get('in');
    return setTimeout(function() {
      return output.sendDone({
        out: data
      });
    }, 0);
  });
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Forward packet after a set delay';
  c.icon = 'clock-o';
  c.timers = [];
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be forwarded with a delay'
  });
  c.inPorts.add('delay', {
    datatype: 'number',
    description: 'How much to delay',
    "default": 500,
    control: true
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.tearDown = function(callback) {
    var i, len, ref, timer;
    ref = c.timers;
    for (i = 0, len = ref.length; i < len; i++) {
      timer = ref[i];
      clearTimeout(timer);
    }
    c.timers = [];
    return callback();
  };
  return c.process(function(input, output) {
    var delay, payload, timer;
    if (!input.hasData('in')) {
      return;
    }
    if (input.attached('delay').length && !input.hasData('delay')) {
      return;
    }
    delay = 500;
    if (input.hasData('delay')) {
      delay = input.getData('delay');
    }
    payload = input.get('in');
    timer = setTimeout(function() {
      c.timers.splice(c.timers.indexOf(timer), 1);
      return output.sendDone({
        out: payload
      });
    }, delay);
    return c.timers.push(timer);
  });
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, cleanUp;
  c = new noflo.Component;
  c.description = 'Send a packet at the given interval';
  c.icon = 'clock-o';
  c.inPorts.add('interval', {
    datatype: 'number',
    description: 'Interval at which output packets are emitted (ms)',
    required: true,
    control: true
  });
  c.inPorts.add('start', {
    datatype: 'bang',
    description: 'Start the emission'
  });
  c.inPorts.add('stop', {
    datatype: 'bang',
    description: 'Stop the emission'
  });
  c.outPorts.add('out', {
    datatype: 'bang'
  });
  c.timers = {};
  cleanUp = function(scope) {
    if (!c.timers[scope]) {
      return;
    }
    clearInterval(c.timers[scope].interval);
    c.timers[scope].deactivate();
    return c.timers[scope] = null;
  };
  c.tearDown = function(callback) {
    var context, ref, scope;
    ref = c.timers;
    for (scope in ref) {
      context = ref[scope];
      cleanUp(scope);
    }
    c.timers = {};
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var interval, start, stop;
    if (input.hasData('start')) {
      if (!input.hasData('interval')) {
        return;
      }
      start = input.get('start');
      if (start.type !== 'data') {
        return;
      }
      interval = parseInt(input.getData('interval'));
      cleanUp(start.scope);
      context.interval = setInterval(function() {
        var bang;
        bang = new noflo.IP('data', true);
        bang.scope = start.scope;
        return c.outPorts.out.sendIP(bang);
      }, interval);
      c.timers[start.scope] = context;
      return;
    }
    if (input.hasData('stop')) {
      stop = input.get('stop');
      if (stop.type !== 'data') {
        return;
      }
      cleanUp(stop.scope);
    }
  });
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Send a packet after the given time in ms';
  c.icon = 'clock-o';
  c.timer = {};
  c.inPorts.add('time', {
    datatype: 'number',
    description: 'Time after which a packet will be sent',
    required: true,
    control: true
  });
  c.inPorts.add('start', {
    datatype: 'bang',
    description: 'Start the timeout before sending a packet'
  });
  c.outPorts.add('out', {
    datatype: 'bang'
  });
  c.forwardBrackets = {
    start: ['out']
  };
  c.stopTimer = function(scope) {
    if (!c.timer[scope]) {
      return;
    }
    clearTimeout(c.timer[scope].timeout);
    c.timer[scope].deactivate();
    return delete c.timer[scope];
  };
  c.tearDown = function(callback) {
    var ref, scope, timer;
    ref = c.timer;
    for (scope in ref) {
      timer = ref[scope];
      c.stopTimer(scope);
    }
    return callback();
  };
  return c.process(function(input, output, context) {
    var bang, time;
    if (!input.hasData('time', 'start')) {
      return;
    }
    time = input.getData('time');
    bang = input.getData('start');
    c.stopTimer(input.scope);
    context.timeout = setTimeout(function() {
      c.timer = null;
      return output.sendDone({
        out: true
      });
    }, time);
    c.timer[input.scope] = context;
  });
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Sends next packet in buffer when receiving a bang';
  c.icon = 'forward';
  c.inPorts.add('data', {
    datatype: 'all'
  });
  c.inPorts.add('in', {
    datatype: 'bang'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  c.outPorts.add('empty', {
    datatype: 'bang',
    required: false
  });
  c.forwardBrackets = {};
  return c.process(function(input, output) {
    var bang, buf, packet, sent;
    if (!input.hasData('in')) {
      return;
    }
    bang = input.getData('in');
    if (!input.hasData('data')) {
      output.sendDone({
        empty: true
      });
      return;
    }
    sent = false;
    while (input.has('data')) {
      if (sent) {
        buf = c.inPorts.data.getBuffer(bang.scope);
        if (buf[0].type === 'data') {
          break;
        }
      }
      packet = input.get('data');
      output.send({
        out: packet
      });
      if (packet.type === 'data') {
        sent = true;
      }
    }
    return output.done();
  });
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.icon = 'expand';
  c.description = 'This component receives data on a single input port and sends the same data out to all connected output ports';
  c.inPorts.add('in', {
    datatype: 'all',
    description: 'Packet to be forwarded'
  });
  c.outPorts.add('out', {
    datatype: 'all'
  });
  return c.process(function(input, output) {
    var data;
    data = input.get('in');
    return output.sendDone({
      out: data
    });
  });
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Add a class to an element';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.inPorts.add('class', {
    datatype: 'string'
  });
  return c.process(function(input, output) {
    var className, element, ref;
    if (!input.has('element', 'class')) {
      return;
    }
    ref = input.getData('element', 'class'), element = ref[0], className = ref[1];
    element.classList.add(className);
    return output.done();
  });
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Append elements as children of a parent element';
  c.inPorts.add('parent', {
    datatype: 'object'
  });
  c.inPorts.add('child', {
    datatype: 'object'
  });
  return c.process(function(input, output) {
    var child, parent, ref;
    if (!input.hasData('parent', 'child')) {
      return;
    }
    ref = input.getData('parent', 'child'), parent = ref[0], child = ref[1];
    parent.appendChild(child);
    return output.done();
  });
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Create a new DOM Element';
  c.inPorts.add('tagname', {
    datatype: 'string'
  });
  c.inPorts.add('container', {
    datatype: 'object'
  });
  c.outPorts.add('element', {
    datatype: 'object'
  });
  c.forwardBrackets = {
    tagname: ['element']
  };
  return c.process(function(input, output) {
    var container, element, tagname;
    if (!input.hasData('tagname')) {
      return;
    }
    if (c.inPorts.container.isAttached()) {
      if (!input.hasData('container')) {
        return;
      }
    }
    tagname = input.getData('tagname');
    element = document.createElement(tagname);
    if (input.hasData('container')) {
      container = input.getData('container');
      container.appendChild(element);
    }
    return output.sendDone({
      element: element
    });
  });
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Create a new DOM DocumentFragment';
  c.inPorts.add('in', {
    datatype: 'bang'
  });
  c.outPorts.add('fragment', {
    datatype: 'object'
  });
  c.forwardBrackets = {
    "in": ['fragment']
  };
  return c.process(function(input, output) {
    var fragment;
    if (!input.hasData('in')) {
      return;
    }
    input.getData('in');
    fragment = document.createDocumentFragment();
    return output.sendDone({
      fragment: fragment
    });
  });
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = "Reads the given attribute from the DOM element on the in port.";
  c.inPorts.add('element', {
    datatype: 'object',
    description: 'The element from which to read the attribute from.',
    required: true
  });
  c.inPorts.add('attribute', {
    datatype: 'string',
    description: 'The attribute which is read from the DOM element.',
    required: true,
    control: true
  });
  c.outPorts.add('out', {
    datatype: 'string',
    description: 'Value of the attribute being read.'
  });
  c.forwardBrackets = {
    element: ['out']
  };
  return c.process(function(input, output) {
    var attribute, element, ref, value;
    if (!input.hasData('element', 'attribute')) {
      return;
    }
    ref = input.getData('element', 'attribute'), element = ref[0], attribute = ref[1];
    value = element.getAttribute(attribute);
    return output.sendDone({
      out: value
    });
  });
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Get a DOM element matching a query';
  c.inPorts.add('in', {
    datatype: 'object',
    description: 'DOM element to constrain the query to'
  });
  c.inPorts.add('selector', {
    datatype: 'string',
    description: 'CSS selector'
  });
  c.outPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  c.forwardBrackets = {
    selector: ['element', 'error']
  };
  return c.process(function(input, output) {
    var container, el, element, i, j, len, len1, ref, selector;
    if (!input.hasData('selector')) {
      return;
    }
    if (input.attached('in').length > 0) {
      if (!input.hasData('in')) {
        return;
      }
    }
    if (input.hasData('in')) {
      ref = input.getData('in', 'selector'), container = ref[0], selector = ref[1];
      if (typeof container.querySelector !== 'function') {
        output.done(new Error('Given container doesn\'t support querySelectors'));
        return;
      }
      el = container.querySelectorAll(selector);
      if (!el.length) {
        output.done(new Error("No element matching '" + selector + "' found under container"));
        return;
      }
      for (i = 0, len = el.length; i < len; i++) {
        element = el[i];
        output.send({
          element: element
        });
      }
      output.done();
      return;
    }
    selector = input.getData('selector');
    el = document.querySelectorAll(selector);
    if (!el.length) {
      output.done(new Error("No element matching '" + selector + "' found under document"));
      return;
    }
    for (j = 0, len1 = el.length; j < len1; j++) {
      element = el[j];
      output.send({
        element: element
      });
    }
    return output.done();
  });
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Check if an element has a given class';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.inPorts.add('class', {
    datatype: 'string'
  });
  c.outPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('missed', {
    datatype: 'object'
  });
  return c.process(function(input, output) {
    var element, klass, ref;
    if (!input.hasData('element', 'class')) {
      return;
    }
    ref = input.getData('element', 'class'), element = ref[0], klass = ref[1];
    if (element.classList.contains(klass)) {
      output.sendDone({
        element: element
      });
      return;
    }
    return output.sendDone({
      missed: element
    });
  });
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, cleanUp;
  c = new noflo.Component;
  c.description = 'addEventListener for specified event type';
  c.icon = 'stethoscope';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.inPorts.add('type', {
    datatype: 'string'
  });
  c.inPorts.add('preventdefault', {
    datatype: 'boolean',
    control: true,
    "default": false
  });
  c.outPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('event', {
    datatype: 'object'
  });
  c.elements = {};
  cleanUp = function(scope) {
    var element, event, listener, ref;
    if (!c.elements[scope]) {
      return;
    }
    ref = c.elements[scope], element = ref.element, event = ref.event, listener = ref.listener;
    element.removeEventListener(event, listener);
    c.elements[scope].deactivate();
    return delete c.elements[scope];
  };
  c.tearDown = function(callback) {
    var element, ref, scope;
    ref = c.elements;
    for (scope in ref) {
      element = ref[scope];
      cleanUp(scope);
    }
    c.elements = {};
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var element, preventDefault, ref, scope, type;
    if (!input.hasData('element', 'type')) {
      return;
    }
    ref = input.getData('element', 'type'), element = ref[0], type = ref[1];
    preventDefault = false;
    if (input.hasData('preventdefault')) {
      preventDefault = input.getData('preventdefault');
    }
    scope = null;
    cleanUp(scope);
    context.element = element;
    context.event = type;
    context.listener = function(event) {
      if (preventDefault) {
        event.preventDefault();
      }
      return output.send({
        element: context.element,
        event: event
      });
    };
    c.elements[context] = context;
    return element.addEventListener(type, context.listener);
  });
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Read HTML from an existing element';
  c.inPorts.add('container', {
    datatype: 'object'
  });
  c.outPorts.add('html', {
    datatype: 'string'
  });
  c.forwardBrackets = {
    container: ['html']
  };
  return c.process(function(input, output) {
    var container;
    if (!input.hasData('container')) {
      return;
    }
    container = input.getData('container');
    return output.sendDone({
      html: container.innerHTML
    });
  });
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Remove a class from an element';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.inPorts.add('class', {
    datatype: 'string'
  });
  return c.process(function(input, output) {
    var className, element, ref;
    if (!input.has('element', 'class')) {
      return;
    }
    ref = input.getData('element', 'class'), element = ref[0], className = ref[1];
    element.classList.remove(className);
    return output.done();
  });
};


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Remove an element from DOM';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  return c.process(function(input, output) {
    var element;
    if (!input.hasData('element')) {
      return;
    }
    element = input.getData('element');
    if (!element.parentNode) {
      return;
    }
    element.parentNode.removeChild(element);
    return output.done();
  });
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var noflo, requestAnimationFrame;

noflo = __webpack_require__(0);

requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
  return window.setTimeout(function() {
    return callback(+new Date());
  }, 1000 / 60);
};

exports.getComponent = function() {
  var c, cleanUp;
  c = new noflo.Component;
  c.description = 'Sends bangs that correspond with screen refresh rate.';
  c.icon = 'film';
  c.inPorts.add('start', {
    datatype: 'bang'
  });
  c.inPorts.add('stop', {
    datatype: 'bang'
  });
  c.outPorts.add('out', {
    datatype: 'bang'
  });
  c.running = {};
  cleanUp = function(scope) {
    if (!c.running[scope]) {
      return;
    }
    c.running[scope].deactivate();
    return delete c.running[scope];
  };
  c.tearDown = function(callback) {
    var ref, running, scope;
    ref = c.running;
    for (scope in ref) {
      running = ref[scope];
      cleanUp(scope);
    }
    c.running = {};
    return callback();
  };
  c.animate = function(scope, output) {
    if (!c.running[scope]) {
      return;
    }
    output.send(true);
    return requestAnimationFrame(c.animate.bind(c, scope, output));
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var start, stop;
    if (input.hasData('start')) {
      start = input.get('start');
      if (start.type !== 'data') {
        return;
      }
      cleanUp(start.scope);
      c.running[start.scope] = context;
      requestAnimationFrame(c.animate.bind(c, start.scope, output));
      return;
    }
    if (input.hasData('stop')) {
      stop = input.get('stop');
      if (stop.type !== 'data') {
        return;
      }
      cleanUp(stop.scope);
    }
  });
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = "Set the given attribute on the DOM element to the received value.";
  c.inPorts.add('element', {
    datatype: 'object',
    description: 'The element on which to set the attribute.'
  });
  c.inPorts.add('attribute', {
    datatype: 'string',
    description: 'The attribute which is set on the DOM element.'
  });
  c.inPorts.add('value', {
    datatype: 'string',
    description: 'Value of the attribute being set.'
  });
  c.outPorts.add('element', {
    datatype: 'object',
    description: 'The element that was updated.'
  });
  c.forwardBrackets = {
    element: ['element'],
    value: ['element']
  };
  return c.process(function(input, output) {
    var attribute, element, key, newVal, ref, val, value;
    if (!input.hasData('element', 'attribute', 'value')) {
      return;
    }
    ref = input.getData('element', 'attribute', 'value'), element = ref[0], attribute = ref[1], value = ref[2];
    if (typeof value === 'object') {
      if (toString.call(value) === '[object Array]') {
        value = value.join(' ');
      } else {
        newVal = [];
        for (key in value) {
          val = value[key];
          newVal.push(val);
        }
        value = newVal.join(' ');
      }
    }
    if (attribute === "value") {
      element.value = value;
    } else {
      element.setAttribute(attribute, value);
    }
    return output.sendDone({
      element: element
    });
  });
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Write HTML inside an existing element';
  c.inPorts.add('container', {
    datatype: 'object'
  });
  c.inPorts.add('html', {
    datatype: 'string'
  });
  c.outPorts.add('container', {
    datatype: 'object'
  });
  return c.process(function(input, output) {
    var container, html, ref;
    if (!input.hasData('container', 'html')) {
      return;
    }
    ref = input.getData('container', 'html'), container = ref[0], html = ref[1];
    container.innerHTML = html;
    return output.sendDone({
      container: container
    });
  });
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.icon = 'i-cursor';
  c.description = 'focus element';
  c.inPorts.add('element', {
    datatype: 'object',
    description: 'element to be focused',
    control: true
  });
  c.inPorts.add('trigger', {
    datatype: 'bang',
    description: 'trigger focus'
  });
  c.outPorts.add('out', {
    datatype: 'bang'
  });
  return c.process(function(input, output) {
    var element;
    if (!input.hasData('element', 'trigger')) {
      return;
    }
    element = input.getData('element');
    input.getData('trigger');
    return window.setTimeout(function() {
      element.focus();
      return output.sendDone({
        out: true
      });
    }, 0);
  });
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Listen to changes on an input element';
  c.icon = 'hourglass';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('value', {
    datatype: 'object'
  });
  c.elements = [];
  c.tearDown = function(callback) {
    var element, i, len, ref;
    ref = c.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      element.el.removeEventListener('change', element.listener, false);
      element.ctx.deactivate();
    }
    c.elements = [];
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var data;
    if (!input.hasData('element')) {
      return;
    }
    data = {
      el: input.getData('element'),
      listener: function(event) {
        event.preventDefault();
        event.stopPropagation();
        return output.send({
          value: event.target.value
        });
      },
      ctx: context
    };
    data.el.addEventListener('change', data.listener, false);
    c.elements.push(data);
  });
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Listen to drag events on a DOM element';
  c.icon = 'arrows';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('start', {
    datatype: 'object'
  });
  c.outPorts.add('movey', {
    datatype: 'number'
  });
  c.outPorts.add('movex', {
    datatype: 'number'
  });
  c.outPorts.add('end', {
    datatype: 'object'
  });
  c.elements = [];
  c.tearDown = function(callback) {
    var element, i, len, ref;
    ref = c.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      element.el.removeEventListener('dragstart', element.dragstart, false);
      element.el.removeEventListener('drag', element.dragmove, false);
      element.el.removeEventListener('dragend', element.dragend, false);
      element.ctx.deactivate();
    }
    c.elements = [];
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var data;
    if (!input.hasData('element')) {
      return;
    }
    data = {
      el: input.getData('element'),
      dragstart: function(event) {
        event.stopPropagation();
        return output.send({
          start: event
        });
      },
      dragmove: function(event) {
        event.preventDefault();
        event.stopPropagation();
        return output.send({
          movex: event.clientX,
          movey: event.clientY
        });
      },
      dragend: function(event) {
        event.preventDefault();
        event.stopPropagation();
        return output.send({
          end: event
        });
      },
      ctx: context
    };
    data.el.addEventListener('dragstart', data.dragstart, false);
    data.el.addEventListener('drag', data.dragmove, false);
    data.el.addEventListener('dragend', data.dragend, false);
    c.elements.push(data);
  });
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, unsubscribe;
  c = new noflo.Component;
  c.description = 'Listen for hash changes in browser\'s URL bar';
  c.icon = 'slack';
  c.inPorts.add('start', {
    datatype: 'bang',
    description: 'Start listening for hash changes'
  });
  c.inPorts.add('stop', {
    datatype: 'bang',
    description: 'Stop listening for hash changes'
  });
  c.outPorts.add('initial', {
    datatype: 'string'
  });
  c.outPorts.add('change', {
    datatype: 'string'
  });
  c.current = null;
  c.subscriber = null;
  unsubscribe = function() {
    if (!c.subscriber) {
      return;
    }
    window.removeEventListener('hashchange', c.subscriber.callback, false);
    c.subscriber.ctx.deactivate();
    return c.subscriber = null;
  };
  c.tearDown = function(callback) {
    c.current = null;
    unsubscribe();
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var sendHash;
    if (input.hasData('start')) {
      input.getData('start');
      unsubscribe();
      sendHash = function(port) {
        var oldHash, payload;
        oldHash = c.current;
        c.current = window.location.href.split('#')[1] || '';
        if (oldHash) {
          output.send({
            change: new noflo.IP('openBracket', oldHash)
          });
        }
        payload = {};
        payload[port] = c.current;
        output.send(payload);
        if (oldHash) {
          return output.send({
            change: new noflo.IP('closeBracket', oldHash)
          });
        }
      };
      c.subscriber = {
        callback: function(event) {
          return sendHash('change');
        },
        ctx: context
      };
      sendHash('initial');
      window.addEventListener('hashchange', c.subscriber.callback, false);
      return;
    }
    if (input.hasData('stop')) {
      input.getData('stop');
      unsubscribe();
      output.done();
    }
  });
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, unsubcribe;
  c = new noflo.Component;
  c.description = 'Listen for key presses on a given DOM element';
  c.icon = 'keyboard-o';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.inPorts.add('stop', {
    datatype: 'object'
  });
  c.outPorts.add('keypress', {
    datatype: 'integer'
  });
  c.elements = [];
  unsubcribe = function(element) {
    element.el.removeEventListener('keypress', element.listener, false);
    return element.ctx.deactivate();
  };
  c.tearDown = function(callback) {
    var element, i, len, ref;
    ref = c.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      unsubscribe(element);
    }
    c.elements = [];
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var ctx, data, el, element, i, len, ref;
    if (input.hasData('element')) {
      data = {
        el: input.getData('element'),
        listener: function(event) {
          return output.send({
            keypress: event.keyCode
          });
        },
        ctx: context
      };
      data.el.addEventListener('keypress', data.listener, false);
      c.elements.push(data);
      return;
    }
    if (input.hasData('stop')) {
      element = input.getData('stop');
      ctx = null;
      ref = c.elements;
      for (i = 0, len = ref.length; i < len; i++) {
        el = ref[i];
        if (el.el !== element) {
          continue;
        }
        ctx = el;
      }
      if (!ctx) {
        return;
      }
      unsubscribe(ctx);
      return output.done();
    }
  });
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, unsubscribe;
  c = new noflo.Component;
  c.description = 'Listen for keyboard shortcuts and route them';
  c.icon = 'keyboard-o';
  c.inPorts.add('keys', {
    datatype: 'array'
  });
  c.inPorts.add('ignoreinput', {
    datatype: 'boolean',
    "default": true,
    control: true
  });
  c.inPorts.add('stop', {
    datatype: 'bang'
  });
  c.outPorts.add('shortcut', {
    datatype: 'bang',
    addressable: true
  });
  c.outPorts.add('missed', {
    datatype: 'integer'
  });
  c.subscriber = null;
  unsubscribe = function() {
    if (!c.subscriber) {
      return;
    }
    document.removeEventListener('keydown', c.subscriber.callback, false);
    c.subscriber.ctx.deactivate();
    return c.subscriber = null;
  };
  c.tearDown = function(callback) {
    unsubscribe();
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var i, ignoreInput, index, key, keys, len;
    if (input.hasData('keys')) {
      keys = input.getData('keys');
      unsubscribe();
      if (typeof keys === 'string') {
        keys = keys.split(',');
      }
      for (index = i = 0, len = keys.length; i < len; index = ++i) {
        key = keys[index];
        switch (key) {
          case '-':
            keys[index] = 189;
            break;
          case '=':
            keys[index] = 187;
            break;
          case '0':
            keys[index] = 48;
            break;
          case 'a':
            keys[index] = 65;
            break;
          case 'x':
            keys[index] = 88;
            break;
          case 'c':
            keys[index] = 67;
            break;
          case 'v':
            keys[index] = 86;
            break;
          case 'z':
            keys[index] = 90;
            break;
          case 'r':
            keys[index] = 82;
        }
      }
      ignoreInput = input.hasData('ignoreinput') ? input.getData('ignoreinput') : true;
      c.subscriber = {
        callback: function(event) {
          var route;
          if (!(event.ctrlKey || event.metaKey)) {
            return;
          }
          if (event.target.tagName === 'TEXTAREA' && ignoreInput) {
            return;
          }
          if (event.target.tagName === 'INPUT' && ignoreInput) {
            return;
          }
          if (String(event.target.contentEditable) === 'true' && ignoreInput) {
            return;
          }
          route = keys.indexOf(event.keyCode);
          if (route === -1) {
            output.send({
              missed: event.keyCode
            });
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          return output.send({
            shortcut: new noflo.IP('data', event.keyCode, {
              index: route
            })
          });
        },
        ctx: context
      };
      document.addEventListener('keydown', c.subscriber.callback, false);
      return;
    }
    if (input.hasData('stop')) {
      input.getData('stop');
      unsubscribe();
      output.done();
    }
  });
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.icon = 'mouse-pointer';
  c.description = 'Listen to mouse events on a DOM element';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('click', {
    datatype: 'object'
  });
  c.outPorts.add('dblclick', {
    datatype: 'object'
  });
  c.elements = [];
  c.tearDown = function(callback) {
    var element, i, len, ref;
    ref = c.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      element.el.removeEventListener('click', element.click, false);
      element.el.removeEventListener('dblclick', element.dblclick, false);
      element.ctx.deactivate();
    }
    c.elements = [];
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var data;
    if (!input.hasData('element')) {
      return;
    }
    data = {
      el: input.getData('element'),
      click: function(event) {
        event.preventDefault();
        event.stopPropagation();
        return output.send({
          click: event
        });
      },
      dblclick: function(event) {
        event.preventDefault();
        event.stopPropagation();
        return output.send({
          dblclick: event
        });
      },
      ctx: context
    };
    data.el.addEventListener('click', data.click, false);
    data.el.addEventListener('dblclick', data.dblclick, false);
    c.elements.push(data);
  });
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, event, events, i, len;
  c = new noflo.Component;
  c.description = 'Listen to pointer events on a DOM element';
  c.icon = 'pencil-square-o';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.inPorts.add('action', {
    datatype: 'string',
    "default": 'none',
    control: true
  });
  events = ['down', 'up', 'cancel', 'move', 'over', 'out', 'enter', 'leave'];
  for (i = 0, len = events.length; i < len; i++) {
    event = events[i];
    c.outPorts.add(event, {
      datatype: 'object',
      description: "Sends event on pointer" + event
    });
  }
  c.elements = [];
  c.tearDown = function(callback) {
    var element, j, k, len1, len2, ref;
    ref = c.elements;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      element = ref[j];
      if (element.el.removeAttribute) {
        element.el.removeAttribute('touch-action');
      }
      for (k = 0, len2 = events.length; k < len2; k++) {
        event = events[k];
        element.el.removeEventListener("pointer" + event, element["pointer" + event], false);
      }
      element.ctx.deactivate();
    }
    c.elements = [];
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var action, data;
    if (!input.hasData('element')) {
      return;
    }
    action = input.hasData('action') ? input.getData('action') : 'none';
    data = {
      el: input.getData('element'),
      ctx: context
    };
    data.el.setAttribute('touch-action', action);
    events.forEach(function(event) {
      data["pointer" + event] = function(ev) {
        var payload;
        ev.preventDefault();
        ev.stopPropagation();
        payload = {};
        payload[event] = ev.target.value;
        return output.send(payload);
      };
      return data.el.addEventListener("pointer" + event, data["pointer" + event], false);
    });
    c.elements.push(data);
  });
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, unsubscribe;
  c = new noflo.Component;
  c.description = 'Listen to window resize events';
  c.icon = 'desktop';
  c.inPorts.add('start', {
    datatype: 'bang',
    description: 'Start listening for screen resizes'
  });
  c.inPorts.add('stop', {
    datatype: 'bang',
    description: 'Stop listening for screen resizes'
  });
  c.outPorts.add('width', {
    datatype: 'number'
  });
  c.outPorts.add('height', {
    datatype: 'number'
  });
  c.subscriber = null;
  unsubscribe = function() {
    if (!c.subscriber) {
      return;
    }
    window.removeEventListener('resize', c.subscriber.callback, false);
    c.subscriber.ctx.deactivate();
    return c.subscriber = null;
  };
  c.tearDown = function(callback) {
    unsubscribe();
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    if (input.hasData('start')) {
      input.getData('start');
      unsubscribe();
      c.subscriber = {
        callback: function(event) {
          return output.send({
            width: window.innerWidth,
            height: window.innerHeight
          });
        },
        ctx: context
      };
      output.send({
        width: window.innerWidth,
        height: window.innerHeight
      });
      window.addEventListener('resize', c.subscriber.callback, false);
      return;
    }
    if (input.hasData('stop')) {
      input.getData('stop');
      unsubscribe();
      output.done();
    }
  });
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, unsubscribe;
  c = new noflo.Component;
  c.description = 'Listen to scroll events on the browser window';
  c.icon = 'arrows-v';
  c.inPorts.add('start', {
    datatype: 'bang',
    description: 'Start listening for hash changes'
  });
  c.inPorts.add('stop', {
    datatype: 'bang',
    description: 'Stop listening for hash changes'
  });
  c.outPorts.add('top', {
    datatype: 'number'
  });
  c.outPorts.add('bottom', {
    datatype: 'number'
  });
  c.outPorts.add('left', {
    datatype: 'number'
  });
  c.outPorts.add('right', {
    datatype: 'number'
  });
  c.subscriber = null;
  unsubscribe = function() {
    if (!c.subscriber) {
      return;
    }
    window.removeEventListener('scroll', c.subscriber.callback, false);
    c.subscriber.ctx.deactivate();
    return c.subscriber = null;
  };
  c.tearDown = function(callback) {
    unsubscribe();
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    if (input.hasData('start')) {
      input.getData('start');
      unsubscribe();
      c.subscriber = {
        callback: function(event) {
          var left, top;
          top = window.scrollY;
          left = window.scrollX;
          return output.send({
            top: top,
            bottom: top + window.innerHeight,
            left: left,
            right: left.window.innerWidth
          });
        },
        ctx: context
      };
      window.addEventListener('scroll', c.subscriber.callback, false);
      return;
    }
    if (input.hasData('stop')) {
      input.getData('stop');
      unsubscribe();
      output.done();
    }
  });
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c, unsubscribe;
  c = new noflo.Component;
  c.description = 'Listen for user\'s microphone and recognize phrases';
  c.icon = 'microphone';
  c.inPorts.add('start', {
    datatype: 'bang',
    description: 'Start listening for hash changes'
  });
  c.inPorts.add('stop', {
    datatype: 'bang',
    description: 'Stop listening for hash changes'
  });
  c.outPorts.add('result', {
    datatype: 'string'
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  c.subscriber = null;
  unsubscribe = function() {
    if (!c.subscriber) {
      return;
    }
    c.subscriber.recognition.stop();
    c.subscriber.ctx.deactivate();
    return c.subscriber = null;
  };
  c.tearDown = function(callback) {
    unsubscribe();
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    if (input.hasData('start')) {
      input.getData('start');
      unsubscribe();
      if (!window.webkitSpeechRecognition) {
        output.done(new Error('Speech recognition support not available'));
        return;
      }
      c.subscriber = {
        sent: [],
        callback: function(event) {
          var i, idx, len, ref, result, results;
          ref = event.results;
          results = [];
          for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
            result = ref[idx];
            if (!result.isFinal) {
              continue;
            }
            if (c.subscriber.sent.indexOf(idx) !== -1) {
              continue;
            }
            output.send({
              result: result[0].transcript
            });
            results.push(c.subscriber.sent.push(idx));
          }
          return results;
        },
        error: function(err) {
          return output.send({
            error: err
          });
        },
        ctx: context
      };
      c.subscriber.recognition = new window.webkitSpeechRecognition;
      c.subscriber.recognition.continuous = true;
      c.subscriber.recognition.start();
      c.subscriber.recognition.onresult = c.subscriber.callback;
      c.subscriber.recognition.onerror = c.subscriber.error;
      return;
    }
    if (input.hasData('stop')) {
      input.getData('stop');
      unsubscribe();
      output.done();
    }
  });
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Listen to touch events on a DOM element';
  c.icon = 'hand-o-up';
  c.inPorts.add('element', {
    datatype: 'object'
  });
  c.outPorts.add('start', {
    datatype: 'object'
  });
  c.outPorts.add('movex', {
    datatype: 'number'
  });
  c.outPorts.add('movey', {
    datatype: 'number'
  });
  c.outPorts.add('end', {
    datatype: 'object'
  });
  c.elements = [];
  c.tearDown = function(callback) {
    var element, i, len, ref;
    ref = c.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      element = ref[i];
      element.el.removeEventListener('touchstart', element.touchstart, false);
      element.el.removeEventListener('touchmove', element.touchmove, false);
      element.el.removeEventListener('touchend', element.touchend, false);
      element.ctx.deactivate();
    }
    c.elements = [];
    return callback();
  };
  c.forwardBrackets = {};
  return c.process(function(input, output, context) {
    var data;
    if (!input.hasData('element')) {
      return;
    }
    data = {
      el: input.getData('element'),
      touchstart: function(event) {
        var i, idx, len, ref, results, touch;
        event.preventDefault();
        event.stopPropagation();
        if (!event.changedTouches) {
          return;
        }
        if (!event.changedTouches.length) {
          return;
        }
        ref = event.changedTouches;
        results = [];
        for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
          touch = ref[idx];
          results.push(output.send({
            start: new noflo.IP('data', event, {
              touch: idx
            })
          }));
        }
        return results;
      },
      touchmove: function(event) {
        var i, idx, len, ref, results, touch;
        event.preventDefault();
        event.stopPropagation();
        if (!event.changedTouches) {
          return;
        }
        if (!event.changedTouches.length) {
          return;
        }
        ref = event.changedTouches;
        results = [];
        for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
          touch = ref[idx];
          results.push(output.send({
            movex: new noflo.IP('data', touch.pageX, {
              touch: idx
            }),
            movey: new noflo.IP('data', touch.pageY, {
              touch: idx
            })
          }));
        }
        return results;
      },
      touchend: function(event) {
        var i, idx, len, ref, results, touch;
        event.preventDefault();
        event.stopPropagation();
        if (!event.changedTouches) {
          return;
        }
        if (!event.changedTouches.length) {
          return;
        }
        ref = event.changedTouches;
        results = [];
        for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
          touch = ref[idx];
          results.push(output.send({
            end: new noflo.IP('data', event, {
              touch: idx
            })
          }));
        }
        return results;
      },
      ctx: context
    };
    data.el.addEventListener('touchstart', data.touchstart, false);
    data.el.addEventListener('touchmove', data.touchmove, false);
    data.el.addEventListener('touchend', data.touchend, false);
    c.elements.push(data);
  });
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Read the coordinates from a DOM event';
  c.icon = 'map-marker';
  c.inPorts.add('event', {
    datatype: 'object'
  });
  c.outPorts.add('screen', {
    datatype: 'object'
  });
  c.outPorts.add('client', {
    datatype: 'object'
  });
  c.outPorts.add('page', {
    datatype: 'object'
  });
  c.forwardBrackets = {
    event: ['screen', 'client', 'page']
  };
  return c.process(function(input, output) {
    var event;
    if (!input.hasData('event')) {
      return;
    }
    event = input.getData('event');
    return output.sendDone({
      screen: {
        x: event.screenX,
        y: event.screenY
      },
      client: {
        x: event.clientX,
        y: event.clientY
      },
      page: {
        x: event.pageX,
        y: event.pageY
      }
    });
  });
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Read the state of a gamepad';
  c.icon = 'gamepad';
  c.inPorts.add('gamepad', {
    datatype: 'integer'
  });
  c.outPorts.add('out', {
    datatype: 'object'
  });
  c.outPorts.add('error', {
    datatype: 'object'
  });
  c.lastTimestamps = {};
  c.tearDown = function(callback) {
    c.lastTimestamps = {};
    return callback();
  };
  return c.process(function(input, output) {
    var gamepad, gamepadState;
    if (!input.hasData('gamepad')) {
      return;
    }
    gamepad = input.getData('gamepad');
    if (!navigator.webkitGetGamepads) {
      output.done(new Error("No WebKit Gamepad API available"));
      return;
    }
    gamepadState = navigator.webkitGetGamepads()[gamepad];
    if (!gamepadState) {
      output.done(new Error("Gamepad '" + gamepad + "' not available"));
    }
    if (c.lastTimestamps[gamepad] = gamepadState.timestamp) {
      output.done();
      return;
    }
    c.lastTimestamps[gamepad] = gamepadState.timestamp;
    return output.sendDone({
      out: gamepadState
    });
  });
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var noflo;

noflo = __webpack_require__(0);

exports.getComponent = function() {
  var c;
  c = new noflo.Component;
  c.description = 'Set the hash in browser\'s URL bar';
  c.icon = 'slack';
  c.inPorts.add('hash', {
    datatype: 'string'
  });
  c.outPorts.add('out', {
    datatype: 'string'
  });
  return c.process(function(input, output) {
    var hash;
    if (!input.hasData('hash')) {
      return;
    }
    hash = input.getData('hash');
    window.location.hash = "#" + hash;
    return output.sendDone({
      out: hash
    });
  });
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(88);

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 88 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var AsyncComponent, component, platform, port,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  port = __webpack_require__(11);

  component = __webpack_require__(18);

  platform = __webpack_require__(5);

  AsyncComponent = (function(superClass) {
    extend(AsyncComponent, superClass);

    function AsyncComponent(inPortName, outPortName, errPortName) {
      this.inPortName = inPortName != null ? inPortName : "in";
      this.outPortName = outPortName != null ? outPortName : "out";
      this.errPortName = errPortName != null ? errPortName : "error";
      this.error = bind(this.error, this);
      platform.deprecated('noflo.AsyncComponent is deprecated. Please port to Process API');
      if (!this.inPorts[this.inPortName]) {
        throw new Error("no inPort named '" + this.inPortName + "'");
      }
      if (!this.outPorts[this.outPortName]) {
        throw new Error("no outPort named '" + this.outPortName + "'");
      }
      this.load = 0;
      this.q = [];
      this.errorGroups = [];
      this.outPorts.load = new port.Port();
      this.inPorts[this.inPortName].on("begingroup", (function(_this) {
        return function(group) {
          if (_this.load > 0) {
            return _this.q.push({
              name: "begingroup",
              data: group
            });
          }
          _this.errorGroups.push(group);
          return _this.outPorts[_this.outPortName].beginGroup(group);
        };
      })(this));
      this.inPorts[this.inPortName].on("endgroup", (function(_this) {
        return function() {
          if (_this.load > 0) {
            return _this.q.push({
              name: "endgroup"
            });
          }
          _this.errorGroups.pop();
          return _this.outPorts[_this.outPortName].endGroup();
        };
      })(this));
      this.inPorts[this.inPortName].on("disconnect", (function(_this) {
        return function() {
          if (_this.load > 0) {
            return _this.q.push({
              name: "disconnect"
            });
          }
          _this.outPorts[_this.outPortName].disconnect();
          _this.errorGroups = [];
          if (_this.outPorts.load.isAttached()) {
            return _this.outPorts.load.disconnect();
          }
        };
      })(this));
      this.inPorts[this.inPortName].on("data", (function(_this) {
        return function(data) {
          if (_this.q.length > 0) {
            return _this.q.push({
              name: "data",
              data: data
            });
          }
          return _this.processData(data);
        };
      })(this));
    }

    AsyncComponent.prototype.processData = function(data) {
      this.incrementLoad();
      return this.doAsync(data, (function(_this) {
        return function(err) {
          if (err) {
            _this.error(err, _this.errorGroups, _this.errPortName);
          }
          return _this.decrementLoad();
        };
      })(this));
    };

    AsyncComponent.prototype.incrementLoad = function() {
      this.load++;
      if (this.outPorts.load.isAttached()) {
        this.outPorts.load.send(this.load);
      }
      if (this.outPorts.load.isAttached()) {
        return this.outPorts.load.disconnect();
      }
    };

    AsyncComponent.prototype.doAsync = function(data, callback) {
      return callback(new Error("AsyncComponents must implement doAsync"));
    };

    AsyncComponent.prototype.decrementLoad = function() {
      if (this.load === 0) {
        throw new Error("load cannot be negative");
      }
      this.load--;
      if (this.outPorts.load.isAttached()) {
        this.outPorts.load.send(this.load);
      }
      if (this.outPorts.load.isAttached()) {
        this.outPorts.load.disconnect();
      }
      if (typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1) {
        return process.nextTick((function(_this) {
          return function() {
            return _this.processQueue();
          };
        })(this));
      } else {
        return setTimeout((function(_this) {
          return function() {
            return _this.processQueue();
          };
        })(this), 0);
      }
    };

    AsyncComponent.prototype.processQueue = function() {
      var event, processedData;
      if (this.load > 0) {
        return;
      }
      processedData = false;
      while (this.q.length > 0) {
        event = this.q[0];
        switch (event.name) {
          case "begingroup":
            if (processedData) {
              return;
            }
            this.outPorts[this.outPortName].beginGroup(event.data);
            this.errorGroups.push(event.data);
            this.q.shift();
            break;
          case "endgroup":
            if (processedData) {
              return;
            }
            this.outPorts[this.outPortName].endGroup();
            this.errorGroups.pop();
            this.q.shift();
            break;
          case "disconnect":
            if (processedData) {
              return;
            }
            this.outPorts[this.outPortName].disconnect();
            if (this.outPorts.load.isAttached()) {
              this.outPorts.load.disconnect();
            }
            this.errorGroups = [];
            this.q.shift();
            break;
          case "data":
            this.processData(event.data);
            this.q.shift();
            processedData = true;
        }
      }
    };

    AsyncComponent.prototype.tearDown = function(callback) {
      this.q = [];
      this.errorGroups = [];
      return callback();
    };

    AsyncComponent.prototype.error = function(e, groups, errorPort) {
      var group, i, j, len, len1;
      if (groups == null) {
        groups = [];
      }
      if (errorPort == null) {
        errorPort = 'error';
      }
      if (this.outPorts[errorPort] && (this.outPorts[errorPort].isAttached() || !this.outPorts[errorPort].isRequired())) {
        for (i = 0, len = groups.length; i < len; i++) {
          group = groups[i];
          this.outPorts[errorPort].beginGroup(group);
        }
        this.outPorts[errorPort].send(e);
        for (j = 0, len1 = groups.length; j < len1; j++) {
          group = groups[j];
          this.outPorts[errorPort].endGroup();
        }
        this.outPorts[errorPort].disconnect();
        return;
      }
      throw e;
    };

    return AsyncComponent;

  })(component.Component);

  exports.AsyncComponent = AsyncComponent;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var IP, InternalSocket, OutPortWrapper, StreamReceiver, StreamSender, checkDeprecation, checkWirePatternPreconditions, checkWirePatternPreconditionsInput, checkWirePatternPreconditionsParams, debug, getGroupContext, getInputData, getOutputProxy, handleInputCollation, isArray, legacyWirePattern, platform, populateParams, processApiWirePattern, reorderBuffer, setupBracketForwarding, setupControlPorts, setupErrorHandler, setupSendDefaults, utils,
    slice = [].slice,
    hasProp = {}.hasOwnProperty;

  StreamSender = __webpack_require__(12).StreamSender;

  StreamReceiver = __webpack_require__(12).StreamReceiver;

  InternalSocket = __webpack_require__(7);

  IP = __webpack_require__(4);

  platform = __webpack_require__(5);

  utils = __webpack_require__(17);

  debug = __webpack_require__(3)('noflo:helpers');

  isArray = function(obj) {
    if (Array.isArray) {
      return Array.isArray(obj);
    }
    return Object.prototype.toString.call(arg) === '[object Array]';
  };

  exports.MapComponent = function(component, func, config) {
    platform.deprecated('noflo.helpers.MapComponent is deprecated. Please port to Process API');
    if (!config) {
      config = {};
    }
    if (!config.inPort) {
      config.inPort = 'in';
    }
    if (!config.outPort) {
      config.outPort = 'out';
    }
    if (!component.forwardBrackets) {
      component.forwardBrackets = {};
    }
    component.forwardBrackets[config.inPort] = [config.outPort];
    return component.process(function(input, output) {
      var data, groups, outProxy;
      if (!input.hasData(config.inPort)) {
        return;
      }
      data = input.getData(config.inPort);
      groups = getGroupContext(component, config.inPort, input);
      outProxy = getOutputProxy([config.outPort], output);
      func(data, groups, outProxy);
      return output.done();
    });
  };

  exports.WirePattern = function(component, config, proc) {
    var inPorts, outPorts, ref, setup;
    inPorts = 'in' in config ? config["in"] : 'in';
    if (!isArray(inPorts)) {
      inPorts = [inPorts];
    }
    outPorts = 'out' in config ? config.out : 'out';
    if (!isArray(outPorts)) {
      outPorts = [outPorts];
    }
    if (!('error' in config)) {
      config.error = 'error';
    }
    if (!('async' in config)) {
      config.async = false;
    }
    if (!('ordered' in config)) {
      config.ordered = true;
    }
    if (!('group' in config)) {
      config.group = false;
    }
    if (!('field' in config)) {
      config.field = null;
    }
    if (!('forwardGroups' in config)) {
      config.forwardGroups = false;
    }
    if (config.forwardGroups) {
      if (typeof config.forwardGroups === 'string') {
        config.forwardGroups = [config.forwardGroups];
      }
      if (typeof config.forwardGroups === 'boolean') {
        config.forwardGroups = inPorts;
      }
    }
    if (!('receiveStreams' in config)) {
      config.receiveStreams = false;
    }
    if (config.receiveStreams) {
      throw new Error('WirePattern receiveStreams is deprecated');
    }
    if (!('sendStreams' in config)) {
      config.sendStreams = false;
    }
    if (config.sendStreams) {
      throw new Error('WirePattern sendStreams is deprecated');
    }
    if (config.async) {
      config.sendStreams = outPorts;
    }
    if (!('params' in config)) {
      config.params = [];
    }
    if (typeof config.params === 'string') {
      config.params = [config.params];
    }
    if (!('name' in config)) {
      config.name = '';
    }
    if (!('dropInput' in config)) {
      config.dropInput = false;
    }
    if (!('arrayPolicy' in config)) {
      config.arrayPolicy = {
        "in": 'any',
        params: 'all'
      };
    }
    config.inPorts = inPorts;
    config.outPorts = outPorts;
    checkDeprecation(config, proc);
    if (config.legacy || (typeof process !== "undefined" && process !== null ? (ref = process.env) != null ? ref.NOFLO_WIREPATTERN_LEGACY : void 0 : void 0)) {
      platform.deprecated('noflo.helpers.WirePattern legacy mode is deprecated');
      setup = legacyWirePattern;
    } else {
      setup = processApiWirePattern;
    }
    return setup(component, config, proc);
  };

  processApiWirePattern = function(component, config, func) {
    setupControlPorts(component, config);
    setupSendDefaults(component);
    setupBracketForwarding(component, config);
    component.ordered = config.ordered;
    return component.process(function(input, output, context) {
      var data, errorHandler, groups, outProxy, postpone, resume;
      if (!checkWirePatternPreconditions(config, input, output)) {
        return;
      }
      component.params = populateParams(config, input);
      data = getInputData(config, input);
      groups = getGroupContext(component, config.inPorts[0], input);
      outProxy = getOutputProxy(config.outPorts, output);
      debug("WirePattern Process API call with", data, groups, component.params, context.scope);
      postpone = function() {
        throw new Error('noflo.helpers.WirePattern postpone is deprecated');
      };
      resume = function() {
        throw new Error('noflo.helpers.WirePattern resume is deprecated');
      };
      if (!config.async) {
        errorHandler = setupErrorHandler(component, config, output);
        func.call(component, data, groups, outProxy, postpone, resume, input.scope);
        if (output.result.__resolved) {
          return;
        }
        errorHandler();
        output.done();
        return;
      }
      errorHandler = setupErrorHandler(component, config, output);
      return func.call(component, data, groups, outProxy, function(err) {
        errorHandler();
        return output.done(err);
      }, postpone, resume, input.scope);
    });
  };

  checkDeprecation = function(config, func) {
    if (config.group) {
      platform.deprecated('noflo.helpers.WirePattern group option is deprecated. Please port to Process API');
    }
    if (config.field) {
      platform.deprecated('noflo.helpers.WirePattern field option is deprecated. Please port to Process API');
    }
    if (func.length > 4) {
      platform.deprecated('noflo.helpers.WirePattern postpone and resume are deprecated. Please port to Process API');
    }
    if (!config.async) {
      platform.deprecated('noflo.helpers.WirePattern synchronous is deprecated. Please port to Process API');
    }
    if (config.error !== 'error') {
      platform.deprecated('noflo.helpers.WirePattern custom error port name is deprecated. Please switch to "error" or port to WirePattern');
    }
  };

  setupControlPorts = function(component, config) {
    var j, len, param, ref, results;
    ref = config.params;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      results.push(component.inPorts[param].options.control = true);
    }
    return results;
  };

  setupBracketForwarding = function(component, config) {
    var inPort, inPorts, j, k, len, len1, outPort, ref;
    component.forwardBrackets = {};
    if (!config.forwardGroups) {
      return;
    }
    inPorts = config.inPorts;
    if (isArray(config.forwardGroups)) {
      inPorts = config.forwardGroups;
    }
    for (j = 0, len = inPorts.length; j < len; j++) {
      inPort = inPorts[j];
      component.forwardBrackets[inPort] = [];
      ref = config.outPorts;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        outPort = ref[k];
        component.forwardBrackets[inPort].push(outPort);
      }
      if (component.outPorts.error) {
        component.forwardBrackets[inPort].push('error');
      }
    }
  };

  setupErrorHandler = function(component, config, output) {
    var errorHandler, errors, failHandler, sendErrors;
    errors = [];
    errorHandler = function(e, groups) {
      if (groups == null) {
        groups = [];
      }
      platform.deprecated('noflo.helpers.WirePattern error method is deprecated. Please send error to callback instead');
      errors.push({
        err: e,
        groups: groups
      });
      return component.hasErrors = true;
    };
    failHandler = function(e, groups) {
      if (e == null) {
        e = null;
      }
      if (groups == null) {
        groups = [];
      }
      platform.deprecated('noflo.helpers.WirePattern fail method is deprecated. Please send error to callback instead');
      if (e) {
        errorHandler(e, groups);
      }
      sendErrors();
      return output.done();
    };
    sendErrors = function() {
      if (!errors.length) {
        return;
      }
      if (config.name) {
        output.sendIP('error', new IP('openBracket', config.name));
      }
      errors.forEach(function(e) {
        var grp, j, k, len, len1, ref, ref1, results;
        ref = e.groups;
        for (j = 0, len = ref.length; j < len; j++) {
          grp = ref[j];
          output.sendIP('error', new IP('openBracket', grp));
        }
        output.sendIP('error', new IP('data', e.err));
        ref1 = e.groups;
        results = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          grp = ref1[k];
          results.push(output.sendIP('error', new IP('closeBracket', grp)));
        }
        return results;
      });
      if (config.name) {
        output.sendIP('error', new IP('closeBracket', config.name));
      }
      component.hasErrors = false;
      return errors = [];
    };
    component.hasErrors = false;
    component.error = errorHandler;
    component.fail = failHandler;
    return sendErrors;
  };

  setupSendDefaults = function(component) {
    var portsWithDefaults;
    portsWithDefaults = Object.keys(component.inPorts.ports).filter(function(p) {
      if (!component.inPorts[p].options.control) {
        return false;
      }
      if (!component.inPorts[p].hasDefault()) {
        return false;
      }
      return true;
    });
    return component.sendDefaults = function() {
      platform.deprecated('noflo.helpers.WirePattern sendDefaults method is deprecated. Please start with a Network');
      return portsWithDefaults.forEach(function(port) {
        var tempSocket;
        tempSocket = InternalSocket.createSocket();
        component.inPorts[port].attach(tempSocket);
        tempSocket.send();
        tempSocket.disconnect();
        return component.inPorts[port].detach(tempSocket);
      });
    };
  };

  populateParams = function(config, input) {
    var idx, j, k, len, len1, paramPort, params, ref, ref1;
    if (!config.params.length) {
      return {};
    }
    params = {};
    ref = config.params;
    for (j = 0, len = ref.length; j < len; j++) {
      paramPort = ref[j];
      if (input.ports[paramPort].isAddressable()) {
        params[paramPort] = {};
        ref1 = input.attached(paramPort);
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          idx = ref1[k];
          if (!input.hasData([paramPort, idx])) {
            continue;
          }
          params[paramPort][idx] = input.getData([paramPort, idx]);
        }
        continue;
      }
      params[paramPort] = input.getData(paramPort);
    }
    return params;
  };

  reorderBuffer = function(buffer, matcher) {
    var brackets, idx, ip, j, k, len, len1, results, substream, substreamBrackets, substreamIdx;
    substream = null;
    brackets = [];
    substreamBrackets = [];
    for (idx = j = 0, len = buffer.length; j < len; idx = ++j) {
      ip = buffer[idx];
      if (ip.type === 'openBracket') {
        brackets.push(ip.data);
        substreamBrackets.push(ip);
        continue;
      }
      if (ip.type === 'closeBracket') {
        brackets.pop();
        if (substream) {
          substream.push(ip);
        }
        if (substreamBrackets.length) {
          substreamBrackets.pop();
        }
        if (substream && !substreamBrackets.length) {
          break;
        }
        continue;
      }
      if (!matcher(ip, brackets)) {
        substreamBrackets = [];
        continue;
      }
      substream = substreamBrackets.slice(0);
      substream.push(ip);
    }
    substreamIdx = buffer.indexOf(substream[0]);
    if (substreamIdx === 0) {
      return;
    }
    buffer.splice(substreamIdx, substream.length);
    substream.reverse();
    results = [];
    for (k = 0, len1 = substream.length; k < len1; k++) {
      ip = substream[k];
      results.push(buffer.unshift(ip));
    }
    return results;
  };

  handleInputCollation = function(data, config, input, port, idx) {
    var buf;
    if (!config.group && !config.field) {
      return;
    }
    if (config.group) {
      buf = input.ports[port].getBuffer(input.scope, idx);
      reorderBuffer(buf, function(ip, brackets) {
        var grp, j, len, ref;
        ref = input.collatedBy.brackets;
        for (idx = j = 0, len = ref.length; j < len; idx = ++j) {
          grp = ref[idx];
          if (brackets[idx] !== grp) {
            return false;
          }
        }
        return true;
      });
    }
    if (config.field) {
      data[config.field] = input.collatedBy.field;
      buf = input.ports[port].getBuffer(input.scope, idx);
      return reorderBuffer(buf, function(ip) {
        return ip.data[config.field] === data[config.field];
      });
    }
  };

  getInputData = function(config, input) {
    var data, idx, j, k, len, len1, port, ref, ref1;
    data = {};
    ref = config.inPorts;
    for (j = 0, len = ref.length; j < len; j++) {
      port = ref[j];
      if (input.ports[port].isAddressable()) {
        data[port] = {};
        ref1 = input.attached(port);
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          idx = ref1[k];
          if (!input.hasData([port, idx])) {
            continue;
          }
          handleInputCollation(data, config, input, port, idx);
          data[port][idx] = input.getData([port, idx]);
        }
        continue;
      }
      if (!input.hasData(port)) {
        continue;
      }
      handleInputCollation(data, config, input, port);
      data[port] = input.getData(port);
    }
    if (config.inPorts.length === 1) {
      return data[config.inPorts[0]];
    }
    return data;
  };

  getGroupContext = function(component, port, input) {
    var ref, ref1;
    if (((ref = input.result.__bracketContext) != null ? ref[port] : void 0) == null) {
      return [];
    }
    if ((ref1 = input.collatedBy) != null ? ref1.brackets : void 0) {
      return input.collatedBy.brackets;
    }
    return input.result.__bracketContext[port].filter(function(c) {
      return c.source === port;
    }).map(function(c) {
      return c.ip.data;
    });
  };

  getOutputProxy = function(ports, output) {
    var outProxy;
    outProxy = {};
    ports.forEach(function(port) {
      return outProxy[port] = {
        connect: function() {},
        beginGroup: function(group, idx) {
          var ip;
          ip = new IP('openBracket', group);
          ip.index = idx;
          return output.sendIP(port, ip);
        },
        send: function(data, idx) {
          var ip;
          ip = new IP('data', data);
          ip.index = idx;
          return output.sendIP(port, ip);
        },
        endGroup: function(group, idx) {
          var ip;
          ip = new IP('closeBracket', group);
          ip.index = idx;
          return output.sendIP(port, ip);
        },
        disconnect: function() {}
      };
    });
    if (ports.length === 1) {
      return outProxy[ports[0]];
    }
    return outProxy;
  };

  checkWirePatternPreconditions = function(config, input, output) {
    var attached, idx, inputsOk, j, k, len, len1, packetsDropped, paramsOk, port, ref;
    paramsOk = checkWirePatternPreconditionsParams(config, input);
    inputsOk = checkWirePatternPreconditionsInput(config, input);
    if (config.dropInput && !paramsOk) {
      packetsDropped = false;
      ref = config.inPorts;
      for (j = 0, len = ref.length; j < len; j++) {
        port = ref[j];
        if (input.ports[port].isAddressable()) {
          attached = input.attached(port);
          if (!attached.length) {
            continue;
          }
          for (k = 0, len1 = attached.length; k < len1; k++) {
            idx = attached[k];
            while (input.has([port, idx])) {
              packetsDropped = true;
              input.get([port, idx]).drop();
            }
          }
          continue;
        }
        while (input.has(port)) {
          packetsDropped = true;
          input.get(port).drop();
        }
      }
      if (packetsDropped) {
        output.done();
      }
    }
    return inputsOk && paramsOk;
  };

  checkWirePatternPreconditionsParams = function(config, input) {
    var attached, j, len, param, ref, withData;
    ref = config.params;
    for (j = 0, len = ref.length; j < len; j++) {
      param = ref[j];
      if (!input.ports[param].isRequired()) {
        continue;
      }
      if (input.ports[param].isAddressable()) {
        attached = input.attached(param);
        if (!attached.length) {
          return false;
        }
        withData = attached.filter(function(idx) {
          return input.hasData([param, idx]);
        });
        if (config.arrayPolicy.params === 'all') {
          if (withData.length !== attached.length) {
            return false;
          }
          continue;
        }
        if (!withData.length) {
          return false;
        }
        continue;
      }
      if (!input.hasData(param)) {
        return false;
      }
    }
    return true;
  };

  checkWirePatternPreconditionsInput = function(config, input) {
    var attached, bracketsAtPorts, checkBrackets, checkPacket, checkPort, j, len, port, ref, withData;
    if (config.group) {
      bracketsAtPorts = {};
      input.collatedBy = {
        brackets: [],
        ready: false
      };
      checkBrackets = function(left, right) {
        var bracket, idx, j, len;
        for (idx = j = 0, len = left.length; j < len; idx = ++j) {
          bracket = left[idx];
          if (right[idx] !== bracket) {
            return false;
          }
        }
        return true;
      };
      checkPacket = function(ip, brackets) {
        var bracketId, bracketsToCheck;
        bracketsToCheck = brackets.slice(0);
        if (config.group instanceof RegExp) {
          bracketsToCheck = bracketsToCheck.slice(0, 1);
          if (!bracketsToCheck.length) {
            return false;
          }
          if (!config.group.test(bracketsToCheck[0])) {
            return false;
          }
        }
        if (input.collatedBy.ready) {
          return checkBrackets(input.collatedBy.brackets, bracketsToCheck);
        }
        bracketId = bracketsToCheck.join(':');
        if (!bracketsAtPorts[bracketId]) {
          bracketsAtPorts[bracketId] = [];
        }
        if (bracketsAtPorts[bracketId].indexOf(port) === -1) {
          bracketsAtPorts[bracketId].push(port);
        }
        if (config.inPorts.indexOf(port) !== config.inPorts.length - 1) {
          return true;
        }
        if (bracketsAtPorts[bracketId].length !== config.inPorts.length) {
          return false;
        }
        if (input.collatedBy.ready) {
          return false;
        }
        input.collatedBy.ready = true;
        input.collatedBy.brackets = bracketsToCheck;
        return true;
      };
    }
    if (config.field) {
      input.collatedBy = {
        field: void 0,
        ready: false
      };
    }
    checkPort = function(port) {
      var buf, dataBrackets, hasData, hasMatching, ip, j, len, portBrackets;
      if (!config.group && !config.field) {
        return input.hasData(port);
      }
      if (config.group) {
        portBrackets = [];
        dataBrackets = [];
        hasMatching = false;
        buf = input.ports[port].getBuffer(input.scope);
        for (j = 0, len = buf.length; j < len; j++) {
          ip = buf[j];
          if (ip.type === 'openBracket') {
            portBrackets.push(ip.data);
            continue;
          }
          if (ip.type === 'closeBracket') {
            portBrackets.pop();
            if (portBrackets.length) {
              continue;
            }
            if (!hasData) {
              continue;
            }
            hasMatching = true;
            continue;
          }
          hasData = checkPacket(ip, portBrackets);
          continue;
        }
        return hasMatching;
      }
      if (config.field) {
        return input.hasStream(port, function(ip) {
          if (!input.collatedBy.ready) {
            input.collatedBy.field = ip.data[config.field];
            input.collatedBy.ready = true;
            return true;
          }
          return ip.data[config.field] === input.collatedBy.field;
        });
      }
    };
    ref = config.inPorts;
    for (j = 0, len = ref.length; j < len; j++) {
      port = ref[j];
      if (input.ports[port].isAddressable()) {
        attached = input.attached(port);
        if (!attached.length) {
          return false;
        }
        withData = attached.filter(function(idx) {
          return checkPort([port, idx]);
        });
        if (config.arrayPolicy['in'] === 'all') {
          if (withData.length !== attached.length) {
            return false;
          }
          continue;
        }
        if (!withData.length) {
          return false;
        }
        continue;
      }
      if (!checkPort(port)) {
        return false;
      }
    }
    return true;
  };

  OutPortWrapper = (function() {
    function OutPortWrapper(port1, scope1) {
      this.port = port1;
      this.scope = scope1;
    }

    OutPortWrapper.prototype.connect = function(socketId) {
      if (socketId == null) {
        socketId = null;
      }
      return this.port.openBracket(null, {
        scope: this.scope
      }, socketId);
    };

    OutPortWrapper.prototype.beginGroup = function(group, socketId) {
      if (socketId == null) {
        socketId = null;
      }
      return this.port.openBracket(group, {
        scope: this.scope
      }, socketId);
    };

    OutPortWrapper.prototype.send = function(data, socketId) {
      if (socketId == null) {
        socketId = null;
      }
      return this.port.sendIP('data', data, {
        scope: this.scope
      }, socketId, false);
    };

    OutPortWrapper.prototype.endGroup = function(group, socketId) {
      if (socketId == null) {
        socketId = null;
      }
      return this.port.closeBracket(group, {
        scope: this.scope
      }, socketId);
    };

    OutPortWrapper.prototype.disconnect = function(socketId) {
      if (socketId == null) {
        socketId = null;
      }
      return this.endGroup(socketId);
    };

    OutPortWrapper.prototype.isConnected = function() {
      return this.port.isConnected();
    };

    OutPortWrapper.prototype.isAttached = function() {
      return this.port.isAttached();
    };

    return OutPortWrapper;

  })();

  legacyWirePattern = function(component, config, proc) {
    var _wp, baseTearDown, closeGroupOnOuts, collectGroups, disconnectOuts, fn, fn1, gc, j, k, l, len, len1, len2, len3, len4, m, n, name, port, processQueue, ref, ref1, ref2, ref3, ref4, resumeTaskQ, sendGroupToOuts, setParamsScope;
    if (!('gcFrequency' in config)) {
      config.gcFrequency = 100;
    }
    if (!('gcTimeout' in config)) {
      config.gcTimeout = 300;
    }
    collectGroups = config.forwardGroups;
    if (collectGroups !== false && config.group) {
      collectGroups = true;
    }
    ref = config.inPorts;
    for (j = 0, len = ref.length; j < len; j++) {
      name = ref[j];
      if (!component.inPorts[name]) {
        throw new Error("no inPort named '" + name + "'");
      }
    }
    ref1 = config.outPorts;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      name = ref1[k];
      if (!component.outPorts[name]) {
        throw new Error("no outPort named '" + name + "'");
      }
    }
    disconnectOuts = function() {
      var l, len2, p, ref2, results;
      ref2 = config.outPorts;
      results = [];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        p = ref2[l];
        if (component.outPorts[p].isConnected()) {
          results.push(component.outPorts[p].disconnect());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    sendGroupToOuts = function(grp) {
      var l, len2, p, ref2, results;
      ref2 = config.outPorts;
      results = [];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        p = ref2[l];
        results.push(component.outPorts[p].beginGroup(grp));
      }
      return results;
    };
    closeGroupOnOuts = function(grp) {
      var l, len2, p, ref2, results;
      ref2 = config.outPorts;
      results = [];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        p = ref2[l];
        results.push(component.outPorts[p].endGroup(grp));
      }
      return results;
    };
    component.requiredParams = [];
    component.defaultedParams = [];
    component.gcCounter = 0;
    component._wpData = {};
    _wp = function(scope) {
      if (!(scope in component._wpData)) {
        component._wpData[scope] = {};
        component._wpData[scope].groupedData = {};
        component._wpData[scope].groupedGroups = {};
        component._wpData[scope].groupedDisconnects = {};
        component._wpData[scope].outputQ = [];
        component._wpData[scope].taskQ = [];
        component._wpData[scope].params = {};
        component._wpData[scope].completeParams = [];
        component._wpData[scope].receivedParams = [];
        component._wpData[scope].defaultsSent = false;
        component._wpData[scope].disconnectData = {};
        component._wpData[scope].disconnectQ = [];
        component._wpData[scope].groupBuffers = {};
        component._wpData[scope].keyBuffers = {};
        component._wpData[scope].gcTimestamps = {};
      }
      return component._wpData[scope];
    };
    component.params = {};
    setParamsScope = function(scope) {
      return component.params = _wp(scope).params;
    };
    processQueue = function(scope) {
      var flushed, key, stream, streams, tmp;
      while (_wp(scope).outputQ.length > 0) {
        streams = _wp(scope).outputQ[0];
        flushed = false;
        if (streams === null) {
          disconnectOuts();
          flushed = true;
        } else {
          if (config.outPorts.length === 1) {
            tmp = {};
            tmp[config.outPorts[0]] = streams;
            streams = tmp;
          }
          for (key in streams) {
            stream = streams[key];
            if (stream.resolved) {
              stream.flush();
              flushed = true;
            }
          }
        }
        if (flushed) {
          _wp(scope).outputQ.shift();
        }
        if (!flushed) {
          return;
        }
      }
    };
    if (config.async) {
      if ('load' in component.outPorts) {
        component.load = 0;
      }
      component.beforeProcess = function(scope, outs) {
        if (config.ordered) {
          _wp(scope).outputQ.push(outs);
        }
        component.load++;
        component.emit('activate', component.load);
        if ('load' in component.outPorts && component.outPorts.load.isAttached()) {
          component.outPorts.load.send(component.load);
          return component.outPorts.load.disconnect();
        }
      };
      component.afterProcess = function(scope, err, outs) {
        processQueue(scope);
        component.load--;
        if ('load' in component.outPorts && component.outPorts.load.isAttached()) {
          component.outPorts.load.send(component.load);
          component.outPorts.load.disconnect();
        }
        return component.emit('deactivate', component.load);
      };
    }
    component.sendDefaults = function(scope) {
      var l, len2, param, ref2, tempSocket;
      if (component.defaultedParams.length > 0) {
        ref2 = component.defaultedParams;
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          param = ref2[l];
          if (_wp(scope).receivedParams.indexOf(param) === -1) {
            tempSocket = InternalSocket.createSocket();
            component.inPorts[param].attach(tempSocket);
            tempSocket.send();
            tempSocket.disconnect();
            component.inPorts[param].detach(tempSocket);
          }
        }
      }
      return _wp(scope).defaultsSent = true;
    };
    resumeTaskQ = function(scope) {
      var results, task, temp;
      if (_wp(scope).completeParams.length === component.requiredParams.length && _wp(scope).taskQ.length > 0) {
        temp = _wp(scope).taskQ.slice(0);
        _wp(scope).taskQ = [];
        results = [];
        while (temp.length > 0) {
          task = temp.shift();
          results.push(task());
        }
        return results;
      }
    };
    ref2 = config.params;
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      port = ref2[l];
      if (!component.inPorts[port]) {
        throw new Error("no inPort named '" + port + "'");
      }
      if (component.inPorts[port].isRequired()) {
        component.requiredParams.push(port);
      }
      if (component.inPorts[port].hasDefault()) {
        component.defaultedParams.push(port);
      }
    }
    ref3 = config.params;
    fn = function(port) {
      var inPort;
      inPort = component.inPorts[port];
      return inPort.handle = function(ip) {
        var event, index, payload, scope;
        event = ip.type;
        payload = ip.data;
        scope = ip.scope;
        index = ip.index;
        if (event !== 'data') {
          return;
        }
        if (inPort.isAddressable()) {
          if (!(port in _wp(scope).params)) {
            _wp(scope).params[port] = {};
          }
          _wp(scope).params[port][index] = payload;
          if (config.arrayPolicy.params === 'all' && Object.keys(_wp(scope).params[port]).length < inPort.listAttached().length) {
            return;
          }
        } else {
          _wp(scope).params[port] = payload;
        }
        if (_wp(scope).completeParams.indexOf(port) === -1 && component.requiredParams.indexOf(port) > -1) {
          _wp(scope).completeParams.push(port);
        }
        _wp(scope).receivedParams.push(port);
        return resumeTaskQ(scope);
      };
    };
    for (m = 0, len3 = ref3.length; m < len3; m++) {
      port = ref3[m];
      fn(port);
    }
    component.dropRequest = function(scope, key) {
      if (key in _wp(scope).disconnectData) {
        delete _wp(scope).disconnectData[key];
      }
      if (key in _wp(scope).groupedData) {
        delete _wp(scope).groupedData[key];
      }
      if (key in _wp(scope).groupedGroups) {
        return delete _wp(scope).groupedGroups[key];
      }
    };
    gc = function() {
      var current, key, len4, n, ref4, results, scope, val;
      component.gcCounter++;
      if (component.gcCounter % config.gcFrequency === 0) {
        ref4 = Object.keys(component._wpData);
        results = [];
        for (n = 0, len4 = ref4.length; n < len4; n++) {
          scope = ref4[n];
          current = new Date().getTime();
          results.push((function() {
            var ref5, results1;
            ref5 = _wp(scope).gcTimestamps;
            results1 = [];
            for (key in ref5) {
              val = ref5[key];
              if ((current - val) > (config.gcTimeout * 1000)) {
                component.dropRequest(scope, key);
                results1.push(delete _wp(scope).gcTimestamps[key]);
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          })());
        }
        return results;
      }
    };
    ref4 = config.inPorts;
    fn1 = function(port) {
      var inPort, needPortGroups;
      inPort = component.inPorts[port];
      needPortGroups = collectGroups instanceof Array && collectGroups.indexOf(port) !== -1;
      return inPort.handle = function(ip) {
        var data, foundGroup, g, groupLength, groups, grp, i, index, key, len5, len6, len7, len8, o, obj, out, outs, payload, postpone, postponedToQ, q, r, ref5, ref6, ref7, ref8, reqId, requiredLength, resume, s, scope, t, task, tmp, u, whenDone, whenDoneGroups, wrp;
        index = ip.index;
        payload = ip.data;
        scope = ip.scope;
        if (!(port in _wp(scope).groupBuffers)) {
          _wp(scope).groupBuffers[port] = [];
        }
        if (!(port in _wp(scope).keyBuffers)) {
          _wp(scope).keyBuffers[port] = null;
        }
        switch (ip.type) {
          case 'openBracket':
            if (payload === null) {
              return;
            }
            _wp(scope).groupBuffers[port].push(payload);
            if (config.forwardGroups && (collectGroups === true || needPortGroups) && !config.async) {
              return sendGroupToOuts(payload);
            }
            break;
          case 'closeBracket':
            _wp(scope).groupBuffers[port] = _wp(scope).groupBuffers[port].slice(0, _wp(scope).groupBuffers[port].length - 1);
            if (config.forwardGroups && (collectGroups === true || needPortGroups) && !config.async) {
              closeGroupOnOuts(payload);
            }
            if (_wp(scope).groupBuffers[port].length === 0) {
              if (config.inPorts.length === 1) {
                if (config.async || config.StreamSender) {
                  if (config.ordered) {
                    _wp(scope).outputQ.push(null);
                    return processQueue(scope);
                  } else {
                    return _wp(scope).disconnectQ.push(true);
                  }
                } else {
                  return disconnectOuts();
                }
              } else {
                foundGroup = false;
                key = _wp(scope).keyBuffers[port];
                if (!(key in _wp(scope).disconnectData)) {
                  _wp(scope).disconnectData[key] = [];
                }
                for (i = o = 0, ref5 = _wp(scope).disconnectData[key].length; 0 <= ref5 ? o < ref5 : o > ref5; i = 0 <= ref5 ? ++o : --o) {
                  if (!(port in _wp(scope).disconnectData[key][i])) {
                    foundGroup = true;
                    _wp(scope).disconnectData[key][i][port] = true;
                    if (Object.keys(_wp(scope).disconnectData[key][i]).length === config.inPorts.length) {
                      _wp(scope).disconnectData[key].shift();
                      if (config.async || config.StreamSender) {
                        if (config.ordered) {
                          _wp(scope).outputQ.push(null);
                          processQueue(scope);
                        } else {
                          _wp(scope).disconnectQ.push(true);
                        }
                      } else {
                        disconnectOuts();
                      }
                      if (_wp(scope).disconnectData[key].length === 0) {
                        delete _wp(scope).disconnectData[key];
                      }
                    }
                    break;
                  }
                }
                if (!foundGroup) {
                  obj = {};
                  obj[port] = true;
                  return _wp(scope).disconnectData[key].push(obj);
                }
              }
            }
            break;
          case 'data':
            if (config.inPorts.length === 1 && !inPort.isAddressable()) {
              data = payload;
              groups = _wp(scope).groupBuffers[port];
            } else {
              key = '';
              if (config.group && _wp(scope).groupBuffers[port].length > 0) {
                key = _wp(scope).groupBuffers[port].toString();
                if (config.group instanceof RegExp) {
                  reqId = null;
                  ref6 = _wp(scope).groupBuffers[port];
                  for (q = 0, len5 = ref6.length; q < len5; q++) {
                    grp = ref6[q];
                    if (config.group.test(grp)) {
                      reqId = grp;
                      break;
                    }
                  }
                  key = reqId ? reqId : '';
                }
              } else if (config.field && typeof payload === 'object' && config.field in payload) {
                key = payload[config.field];
              }
              _wp(scope).keyBuffers[port] = key;
              if (!(key in _wp(scope).groupedData)) {
                _wp(scope).groupedData[key] = [];
              }
              if (!(key in _wp(scope).groupedGroups)) {
                _wp(scope).groupedGroups[key] = [];
              }
              foundGroup = false;
              requiredLength = config.inPorts.length;
              if (config.field) {
                ++requiredLength;
              }
              for (i = r = 0, ref7 = _wp(scope).groupedData[key].length; 0 <= ref7 ? r < ref7 : r > ref7; i = 0 <= ref7 ? ++r : --r) {
                if (!(port in _wp(scope).groupedData[key][i]) || (component.inPorts[port].isAddressable() && config.arrayPolicy["in"] === 'all' && !(index in _wp(scope).groupedData[key][i][port]))) {
                  foundGroup = true;
                  if (component.inPorts[port].isAddressable()) {
                    if (!(port in _wp(scope).groupedData[key][i])) {
                      _wp(scope).groupedData[key][i][port] = {};
                    }
                    _wp(scope).groupedData[key][i][port][index] = payload;
                  } else {
                    _wp(scope).groupedData[key][i][port] = payload;
                  }
                  if (needPortGroups) {
                    _wp(scope).groupedGroups[key][i] = utils.unique(slice.call(_wp(scope).groupedGroups[key][i]).concat(slice.call(_wp(scope).groupBuffers[port])));
                  } else if (collectGroups === true) {
                    _wp(scope).groupedGroups[key][i][port] = _wp(scope).groupBuffers[port];
                  }
                  if (component.inPorts[port].isAddressable() && config.arrayPolicy["in"] === 'all' && Object.keys(_wp(scope).groupedData[key][i][port]).length < component.inPorts[port].listAttached().length) {
                    return;
                  }
                  groupLength = Object.keys(_wp(scope).groupedData[key][i]).length;
                  if (groupLength === requiredLength) {
                    data = (_wp(scope).groupedData[key].splice(i, 1))[0];
                    if (config.inPorts.length === 1 && inPort.isAddressable()) {
                      data = data[port];
                    }
                    groups = (_wp(scope).groupedGroups[key].splice(i, 1))[0];
                    if (collectGroups === true) {
                      groups = utils.intersection.apply(null, utils.getValues(groups));
                    }
                    if (_wp(scope).groupedData[key].length === 0) {
                      delete _wp(scope).groupedData[key];
                    }
                    if (_wp(scope).groupedGroups[key].length === 0) {
                      delete _wp(scope).groupedGroups[key];
                    }
                    if (config.group && key) {
                      delete _wp(scope).gcTimestamps[key];
                    }
                    break;
                  } else {
                    return;
                  }
                }
              }
              if (!foundGroup) {
                obj = {};
                if (config.field) {
                  obj[config.field] = key;
                }
                if (component.inPorts[port].isAddressable()) {
                  obj[port] = {};
                  obj[port][index] = payload;
                } else {
                  obj[port] = payload;
                }
                if (config.inPorts.length === 1 && component.inPorts[port].isAddressable() && (config.arrayPolicy["in"] === 'any' || component.inPorts[port].listAttached().length === 1)) {
                  data = obj[port];
                  groups = _wp(scope).groupBuffers[port];
                } else {
                  _wp(scope).groupedData[key].push(obj);
                  if (needPortGroups) {
                    _wp(scope).groupedGroups[key].push(_wp(scope).groupBuffers[port]);
                  } else if (collectGroups === true) {
                    tmp = {};
                    tmp[port] = _wp(scope).groupBuffers[port];
                    _wp(scope).groupedGroups[key].push(tmp);
                  } else {
                    _wp(scope).groupedGroups[key].push([]);
                  }
                  if (config.group && key) {
                    _wp(scope).gcTimestamps[key] = new Date().getTime();
                  }
                  return;
                }
              }
            }
            if (config.dropInput && _wp(scope).completeParams.length !== component.requiredParams.length) {
              return;
            }
            outs = {};
            ref8 = config.outPorts;
            for (s = 0, len6 = ref8.length; s < len6; s++) {
              name = ref8[s];
              wrp = new OutPortWrapper(component.outPorts[name], scope);
              if (config.async || config.sendStreams && config.sendStreams.indexOf(name) !== -1) {
                wrp;
                outs[name] = new StreamSender(wrp, config.ordered);
              } else {
                outs[name] = wrp;
              }
            }
            if (config.outPorts.length === 1) {
              outs = outs[config.outPorts[0]];
            }
            if (!groups) {
              groups = [];
            }
            groups = (function() {
              var len7, results, t;
              results = [];
              for (t = 0, len7 = groups.length; t < len7; t++) {
                g = groups[t];
                if (g !== null) {
                  results.push(g);
                }
              }
              return results;
            })();
            whenDoneGroups = groups.slice(0);
            whenDone = function(err) {
              var disconnect, len7, out, outputs, t;
              if (err) {
                component.error(err, whenDoneGroups, 'error', scope);
              }
              if (typeof component.fail === 'function' && component.hasErrors) {
                component.fail(null, [], scope);
              }
              outputs = outs;
              if (config.outPorts.length === 1) {
                outputs = {};
                outputs[port] = outs;
              }
              disconnect = false;
              if (_wp(scope).disconnectQ.length > 0) {
                _wp(scope).disconnectQ.shift();
                disconnect = true;
              }
              for (name in outputs) {
                out = outputs[name];
                if (config.forwardGroups && config.async) {
                  for (t = 0, len7 = whenDoneGroups.length; t < len7; t++) {
                    i = whenDoneGroups[t];
                    out.endGroup();
                  }
                }
                if (disconnect) {
                  out.disconnect();
                }
                if (config.async || config.StreamSender) {
                  out.done();
                }
              }
              if (typeof component.afterProcess === 'function') {
                return component.afterProcess(scope, err || component.hasErrors, outs);
              }
            };
            if (typeof component.beforeProcess === 'function') {
              component.beforeProcess(scope, outs);
            }
            if (config.forwardGroups && config.async) {
              if (config.outPorts.length === 1) {
                for (t = 0, len7 = groups.length; t < len7; t++) {
                  g = groups[t];
                  outs.beginGroup(g);
                }
              } else {
                for (name in outs) {
                  out = outs[name];
                  for (u = 0, len8 = groups.length; u < len8; u++) {
                    g = groups[u];
                    out.beginGroup(g);
                  }
                }
              }
            }
            exports.MultiError(component, config.name, config.error, groups, scope);
            debug("WirePattern Legacy API call with", data, groups, component.params, scope);
            if (config.async) {
              postpone = function() {};
              resume = function() {};
              postponedToQ = false;
              task = function() {
                setParamsScope(scope);
                return proc.call(component, data, groups, outs, whenDone, postpone, resume, scope);
              };
              postpone = function(backToQueue) {
                if (backToQueue == null) {
                  backToQueue = true;
                }
                postponedToQ = backToQueue;
                if (backToQueue) {
                  return _wp(scope).taskQ.push(task);
                }
              };
              resume = function() {
                if (postponedToQ) {
                  return resumeTaskQ();
                } else {
                  return task();
                }
              };
            } else {
              task = function() {
                setParamsScope(scope);
                proc.call(component, data, groups, outs, null, null, null, scope);
                return whenDone();
              };
            }
            _wp(scope).taskQ.push(task);
            resumeTaskQ(scope);
            return gc();
        }
      };
    };
    for (n = 0, len4 = ref4.length; n < len4; n++) {
      port = ref4[n];
      fn1(port);
    }
    baseTearDown = component.tearDown;
    component.tearDown = function(callback) {
      component.requiredParams = [];
      component.defaultedParams = [];
      component.gcCounter = 0;
      component._wpData = {};
      component.params = {};
      return baseTearDown.call(component, callback);
    };
    return component;
  };

  exports.GroupedInput = exports.WirePattern;

  exports.CustomError = function(message, options) {
    var err;
    err = new Error(message);
    return exports.CustomizeError(err, options);
  };

  exports.CustomizeError = function(err, options) {
    var key, val;
    for (key in options) {
      if (!hasProp.call(options, key)) continue;
      val = options[key];
      err[key] = val;
    }
    return err;
  };

  exports.MultiError = function(component, group, errorPort, forwardedGroups, scope) {
    var baseTearDown;
    if (group == null) {
      group = '';
    }
    if (errorPort == null) {
      errorPort = 'error';
    }
    if (forwardedGroups == null) {
      forwardedGroups = [];
    }
    if (scope == null) {
      scope = null;
    }
    platform.deprecated('noflo.helpers.MultiError is deprecated. Send errors to error port instead');
    component.hasErrors = false;
    component.errors = [];
    if (component.name && !group) {
      group = component.name;
    }
    if (!group) {
      group = 'Component';
    }
    component.error = function(e, groups) {
      if (groups == null) {
        groups = [];
      }
      component.errors.push({
        err: e,
        groups: forwardedGroups.concat(groups)
      });
      return component.hasErrors = true;
    };
    component.fail = function(e, groups) {
      var error, grp, j, k, l, len, len1, len2, ref, ref1, ref2;
      if (e == null) {
        e = null;
      }
      if (groups == null) {
        groups = [];
      }
      if (e) {
        component.error(e, groups);
      }
      if (!component.hasErrors) {
        return;
      }
      if (!(errorPort in component.outPorts)) {
        return;
      }
      if (!component.outPorts[errorPort].isAttached()) {
        return;
      }
      if (group) {
        component.outPorts[errorPort].openBracket(group, {
          scope: scope
        });
      }
      ref = component.errors;
      for (j = 0, len = ref.length; j < len; j++) {
        error = ref[j];
        ref1 = error.groups;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          grp = ref1[k];
          component.outPorts[errorPort].openBracket(grp, {
            scope: scope
          });
        }
        component.outPorts[errorPort].data(error.err, {
          scope: scope
        });
        ref2 = error.groups;
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          grp = ref2[l];
          component.outPorts[errorPort].closeBracket(grp, {
            scope: scope
          });
        }
      }
      if (group) {
        component.outPorts[errorPort].closeBracket(group, {
          scope: scope
        });
      }
      component.hasErrors = false;
      return component.errors = [];
    };
    baseTearDown = component.tearDown;
    component.tearDown = function(callback) {
      component.hasErrors = false;
      component.errors = [];
      return baseTearDown.call(component, callback);
    };
    return component;
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var ArrayPort, platform, port,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  port = __webpack_require__(11);

  platform = __webpack_require__(5);

  ArrayPort = (function(superClass) {
    extend(ArrayPort, superClass);

    function ArrayPort(type) {
      this.type = type;
      platform.deprecated('noflo.ArrayPort is deprecated. Please port to noflo.InPort/noflo.OutPort and use addressable: true');
      ArrayPort.__super__.constructor.call(this, this.type);
    }

    ArrayPort.prototype.attach = function(socket, socketId) {
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        socketId = this.sockets.length;
      }
      this.sockets[socketId] = socket;
      return this.attachSocket(socket, socketId);
    };

    ArrayPort.prototype.connect = function(socketId) {
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        if (!this.sockets.length) {
          throw new Error((this.getId()) + ": No connections available");
        }
        this.sockets.forEach(function(socket) {
          if (!socket) {
            return;
          }
          return socket.connect();
        });
        return;
      }
      if (!this.sockets[socketId]) {
        throw new Error((this.getId()) + ": No connection '" + socketId + "' available");
      }
      return this.sockets[socketId].connect();
    };

    ArrayPort.prototype.beginGroup = function(group, socketId) {
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        if (!this.sockets.length) {
          throw new Error((this.getId()) + ": No connections available");
        }
        this.sockets.forEach((function(_this) {
          return function(socket, index) {
            if (!socket) {
              return;
            }
            return _this.beginGroup(group, index);
          };
        })(this));
        return;
      }
      if (!this.sockets[socketId]) {
        throw new Error((this.getId()) + ": No connection '" + socketId + "' available");
      }
      if (this.isConnected(socketId)) {
        return this.sockets[socketId].beginGroup(group);
      }
      this.sockets[socketId].once("connect", (function(_this) {
        return function() {
          return _this.sockets[socketId].beginGroup(group);
        };
      })(this));
      return this.sockets[socketId].connect();
    };

    ArrayPort.prototype.send = function(data, socketId) {
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        if (!this.sockets.length) {
          throw new Error((this.getId()) + ": No connections available");
        }
        this.sockets.forEach((function(_this) {
          return function(socket, index) {
            if (!socket) {
              return;
            }
            return _this.send(data, index);
          };
        })(this));
        return;
      }
      if (!this.sockets[socketId]) {
        throw new Error((this.getId()) + ": No connection '" + socketId + "' available");
      }
      if (this.isConnected(socketId)) {
        return this.sockets[socketId].send(data);
      }
      this.sockets[socketId].once("connect", (function(_this) {
        return function() {
          return _this.sockets[socketId].send(data);
        };
      })(this));
      return this.sockets[socketId].connect();
    };

    ArrayPort.prototype.endGroup = function(socketId) {
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        if (!this.sockets.length) {
          throw new Error((this.getId()) + ": No connections available");
        }
        this.sockets.forEach((function(_this) {
          return function(socket, index) {
            if (!socket) {
              return;
            }
            return _this.endGroup(index);
          };
        })(this));
        return;
      }
      if (!this.sockets[socketId]) {
        throw new Error((this.getId()) + ": No connection '" + socketId + "' available");
      }
      return this.sockets[socketId].endGroup();
    };

    ArrayPort.prototype.disconnect = function(socketId) {
      var i, len, ref, socket;
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        if (!this.sockets.length) {
          throw new Error((this.getId()) + ": No connections available");
        }
        ref = this.sockets;
        for (i = 0, len = ref.length; i < len; i++) {
          socket = ref[i];
          if (!socket) {
            return;
          }
          socket.disconnect();
        }
        return;
      }
      if (!this.sockets[socketId]) {
        return;
      }
      return this.sockets[socketId].disconnect();
    };

    ArrayPort.prototype.isConnected = function(socketId) {
      var connected;
      if (socketId == null) {
        socketId = null;
      }
      if (socketId === null) {
        connected = false;
        this.sockets.forEach(function(socket) {
          if (!socket) {
            return;
          }
          if (socket.isConnected()) {
            return connected = true;
          }
        });
        return connected;
      }
      if (!this.sockets[socketId]) {
        return false;
      }
      return this.sockets[socketId].isConnected();
    };

    ArrayPort.prototype.isAddressable = function() {
      return true;
    };

    ArrayPort.prototype.isAttached = function(socketId) {
      var i, len, ref, socket;
      if (socketId === void 0) {
        ref = this.sockets;
        for (i = 0, len = ref.length; i < len; i++) {
          socket = ref[i];
          if (socket) {
            return true;
          }
        }
        return false;
      }
      if (this.sockets[socketId]) {
        return true;
      }
      return false;
    };

    return ArrayPort;

  })(port.Port);

  exports.ArrayPort = ArrayPort;

}).call(this);


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var ComponentLoader, Graph, IP, Network, getType, internalSocket, normalizeOptions, normalizeOutput, prepareInputMap, prepareNetwork, runNetwork, sendOutputMap;

  ComponentLoader = __webpack_require__(10).ComponentLoader;

  Network = __webpack_require__(15).Network;

  IP = __webpack_require__(4);

  internalSocket = __webpack_require__(7);

  Graph = __webpack_require__(8).Graph;

  normalizeOptions = function(options, component) {
    if (!options) {
      options = {};
    }
    if (!options.name) {
      options.name = component;
    }
    if (options.loader) {
      options.baseDir = options.loader.baseDir;
    }
    if (!options.baseDir && process && process.cwd) {
      options.baseDir = process.cwd();
    }
    if (!options.loader) {
      options.loader = new ComponentLoader(options.baseDir);
    }
    if (!options.raw) {
      options.raw = false;
    }
    return options;
  };

  prepareNetwork = function(component, options, callback) {
    return options.loader.load(component, function(err, instance) {
      var def, graph, inPorts, network, nodeName, outPorts, port;
      if (err) {
        return callback(err);
      }
      graph = new Graph(options.name);
      nodeName = options.name;
      graph.addNode(nodeName, component);
      inPorts = instance.inPorts.ports || instance.inPorts;
      outPorts = instance.outPorts.ports || instance.outPorts;
      for (port in inPorts) {
        def = inPorts[port];
        graph.addInport(port, nodeName, port);
      }
      for (port in outPorts) {
        def = outPorts[port];
        graph.addOutport(port, nodeName, port);
      }
      graph.componentLoader = options.loader;
      network = new Network(graph, options);
      return network.connect(function(err) {
        if (err) {
          return callback(err);
        }
        return callback(null, network);
      });
    });
  };

  runNetwork = function(network, inputs, options, callback) {
    var inPorts, inSockets, outPorts, outSockets, process, received;
    process = network.getNode(options.name);
    inPorts = Object.keys(network.graph.inports);
    inSockets = {};
    inPorts.forEach(function(inport) {
      inSockets[inport] = internalSocket.createSocket();
      return process.component.inPorts[inport].attach(inSockets[inport]);
    });
    received = [];
    outPorts = Object.keys(network.graph.outports);
    outSockets = {};
    outPorts.forEach(function(outport) {
      outSockets[outport] = internalSocket.createSocket();
      process.component.outPorts[outport].attach(outSockets[outport]);
      return outSockets[outport].on('ip', function(ip) {
        var res;
        res = {};
        res[outport] = ip;
        return received.push(res);
      });
    });
    network.once('end', function() {
      var port, socket;
      for (port in outSockets) {
        socket = outSockets[port];
        process.component.outPorts[port].detach(socket);
      }
      outSockets = {};
      inSockets = {};
      return callback(null, received);
    });
    return network.start(function(err) {
      var i, inputMap, len, port, results, value;
      if (err) {
        return callback(err);
      }
      results = [];
      for (i = 0, len = inputs.length; i < len; i++) {
        inputMap = inputs[i];
        results.push((function() {
          var results1;
          results1 = [];
          for (port in inputMap) {
            value = inputMap[port];
            if (IP.isIP(value)) {
              inSockets[port].post(value);
              continue;
            }
            results1.push(inSockets[port].post(new IP('data', value)));
          }
          return results1;
        })());
      }
      return results;
    });
  };

  getType = function(inputs, network) {
    var key, maps, value;
    if (typeof inputs !== 'object') {
      return 'simple';
    }
    if (Array.isArray(inputs)) {
      maps = inputs.filter(function(entry) {
        return getType(entry, network) === 'map';
      });
      if (maps.length === inputs.length) {
        return 'sequence';
      }
      return 'simple';
    }
    if (!Object.keys(inputs).length) {
      return 'simple';
    }
    for (key in inputs) {
      value = inputs[key];
      if (!network.graph.inports[key]) {
        return 'simple';
      }
    }
    return 'map';
  };

  prepareInputMap = function(inputs, inputType, network) {
    var inPort, map;
    if (inputType === 'sequence') {
      return inputs;
    }
    if (inputType === 'map') {
      return [inputs];
    }
    inPort = Object.keys(network.graph.inports)[0];
    if (network.graph.inports["in"]) {
      inPort = 'in';
    }
    map = {};
    map[inPort] = inputs;
    return [map];
  };

  normalizeOutput = function(values, options) {
    var current, i, len, packet, previous, result;
    if (options.raw) {
      return values;
    }
    result = [];
    previous = null;
    current = result;
    for (i = 0, len = values.length; i < len; i++) {
      packet = values[i];
      if (packet.type === 'openBracket') {
        previous = current;
        current = [];
        previous.push(current);
      }
      if (packet.type === 'data') {
        current.push(packet.data);
      }
      if (packet.type === 'closeBracket') {
        current = previous;
      }
    }
    if (result.length === 1) {
      return result[0];
    }
    return result;
  };

  sendOutputMap = function(outputs, resultType, options, callback) {
    var errors, i, key, len, map, mappedOutputs, outputKeys, packets, port, result, val, withValue;
    errors = outputs.filter(function(map) {
      return map.error != null;
    }).map(function(map) {
      return map.error;
    });
    if (errors.length) {
      return callback(normalizeOutput(errors, options));
    }
    if (resultType === 'sequence') {
      return callback(null, outputs.map(function(map) {
        var key, res, val;
        res = {};
        for (key in map) {
          val = map[key];
          if (options.raw) {
            res[key] = val;
            continue;
          }
          res[key] = normalizeOutput([val], options);
        }
        return res;
      }));
    }
    mappedOutputs = {};
    for (i = 0, len = outputs.length; i < len; i++) {
      map = outputs[i];
      for (key in map) {
        val = map[key];
        if (!mappedOutputs[key]) {
          mappedOutputs[key] = [];
        }
        mappedOutputs[key].push(val);
      }
    }
    outputKeys = Object.keys(mappedOutputs);
    withValue = outputKeys.filter(function(outport) {
      return mappedOutputs[outport].length > 0;
    });
    if (withValue.length === 0) {
      return callback(null);
    }
    if (withValue.length === 1 && resultType === 'simple') {
      return callback(null, normalizeOutput(mappedOutputs[withValue[0]], options));
    }
    result = {};
    for (port in mappedOutputs) {
      packets = mappedOutputs[port];
      result[port] = normalizeOutput(packets, options);
    }
    return callback(null, result);
  };

  exports.asCallback = function(component, options) {
    options = normalizeOptions(options, component);
    return function(inputs, callback) {
      return prepareNetwork(component, options, function(err, network) {
        var inputMap, resultType;
        if (err) {
          return callback(err);
        }
        resultType = getType(inputs, network);
        inputMap = prepareInputMap(inputs, resultType, network);
        return runNetwork(network, inputMap, options, function(err, outputMap) {
          if (err) {
            return callback(err);
          }
          return sendOutputMap(outputMap, resultType, options, callback);
        });
      });
    };
  };

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  iframe: __webpack_require__(94),
  opener: __webpack_require__(108)
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

(function (context) {
  var PostMessage = __webpack_require__(23);

  var IframeRuntime = function (options) {
    PostMessage.call(this, options);
    this.setClient(context.parent);
  };
  IframeRuntime.prototype = new PostMessage;

  module.exports = function (options) {
    options = PostMessage.normalizeOptions(options);
    var runtime = new IframeRuntime(options);
    PostMessage.subscribe(context, function (msg, metadata) {
      if (msg.protocol === 'iframe' && msg.command === 'setcontent') {
        document.body.innerHTML = msg.payload;
        return;
      }
      runtime.receive(msg.protocol, msg.command, msg.payload, {
        href: metadata.origin
      });
    });
    return runtime;
  };
})(window);


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var EventEmitter, RuntimeProtocol, findPort, noflo, portToPayload, portsPayload, sendToInport,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  noflo = __webpack_require__(0);

  EventEmitter = __webpack_require__(2).EventEmitter;

  sendToInport = function(port, event, payload) {
    var socket;
    socket = noflo.internalSocket.createSocket();
    port.attach(socket);
    switch (event) {
      case 'connect':
        socket.connect();
        break;
      case 'disconnect':
        socket.disconnect();
        break;
      case 'begingroup':
        socket.beginGroup(payload);
        break;
      case 'endgroup':
        socket.endGroup(payload);
        break;
      case 'data':
        socket.send(payload);
    }
    return port.detach(socket);
  };

  findPort = function(network, name, inPort) {
    var component, internal, ref;
    if (!network.graph) {
      return;
    }
    if (inPort) {
      internal = network.graph.inports[name];
    } else {
      internal = network.graph.outports[name];
    }
    if (!(internal != null ? internal.process : void 0)) {
      return;
    }
    component = (ref = network.getNode(internal.process)) != null ? ref.component : void 0;
    if (!component) {
      return;
    }
    if (inPort) {
      return component.inPorts[internal.port];
    }
    return component.outPorts[internal.port];
  };

  portToPayload = function(pub, internal, network, inPort) {
    var def, port, ref, ref1;
    def = {
      id: pub,
      type: 'all',
      description: (ref = internal.metadata) != null ? ref.description : void 0,
      addressable: false,
      required: false
    };
    port = findPort(network, pub, inPort);
    if (!port) {
      return def;
    }
    def.type = port.getDataType();
    if (port.getSchema) {
      def.schema = port.getSchema();
    }
    def.description = ((ref1 = internal.metadata) != null ? ref1.description : void 0) || port.getDescription();
    def.addressable = port.isAddressable();
    def.required = port.isRequired();
    return def;
  };

  portsPayload = function(name, network) {
    var internal, payload, pub, ref, ref1;
    payload = {
      graph: name,
      inPorts: [],
      outPorts: []
    };
    if (!(network != null ? network.graph : void 0)) {
      return payload;
    }
    ref = network.graph.inports;
    for (pub in ref) {
      internal = ref[pub];
      payload.inPorts.push(portToPayload(pub, internal, network, true));
    }
    ref1 = network.graph.outports;
    for (pub in ref1) {
      internal = ref1[pub];
      payload.outPorts.push(portToPayload(pub, internal, network, false));
    }
    return payload;
  };

  RuntimeProtocol = (function(superClass) {
    extend(RuntimeProtocol, superClass);

    function RuntimeProtocol(transport) {
      this.transport = transport;
      this.outputSockets = {};
      this.mainGraph = null;
      this.transport.network.on('addnetwork', (function(_this) {
        return function(network, name) {
          _this.subscribeExportedPorts(name, network, true);
          _this.subscribeOutPorts(name, network);
          _this.sendPorts(name, network);
          if (network.isStarted()) {
            _this.subscribeOutdata(name, network, true);
          }
          return network.on('start', function() {
            return _this.subscribeOutdata(name, network, true);
          });
        };
      })(this));
      this.transport.network.on('removenetwork', (function(_this) {
        return function(network, name) {
          _this.subscribeOutdata(name, network, false);
          _this.subscribeOutPorts(name, network);
          _this.subscribeExportedPorts(name, network.graph, false);
          return _this.sendPorts(name, null);
        };
      })(this));
    }

    RuntimeProtocol.prototype.send = function(topic, payload, context) {
      return this.transport.send('runtime', topic, payload, context);
    };

    RuntimeProtocol.prototype.sendAll = function(topic, payload) {
      return this.transport.sendAll('runtime', topic, payload);
    };

    RuntimeProtocol.prototype.sendError = function(message, context) {
      return this.send('error', new Error(message), context);
    };

    RuntimeProtocol.prototype.receive = function(topic, payload, context) {
      if (topic === 'packet' && !this.transport.canDo('protocol:runtime', payload.secret)) {
        this.send('error', new Error(topic + " not permitted"), context);
        return;
      }
      switch (topic) {
        case 'getruntime':
          return this.getRuntime(payload, context);
        case 'packet':
          return this.sendPacket(payload, (function(_this) {
            return function(err) {
              if (err) {
                _this.sendError(err.message, context);
              }
            };
          })(this));
      }
    };

    RuntimeProtocol.prototype.getRuntime = function(payload, context) {
      var capabilities, name, network, permittedCapabilities, ref, results, type;
      type = this.transport.options.type;
      if (!type) {
        if (noflo.isBrowser()) {
          type = 'noflo-browser';
        } else {
          type = 'noflo-nodejs';
        }
      }
      capabilities = this.transport.options.capabilities;
      if (!capabilities) {
        capabilities = ['protocol:graph', 'protocol:component', 'protocol:network', 'protocol:runtime', 'component:setsource', 'component:getsource'];
      }
      permittedCapabilities = capabilities.filter((function(_this) {
        return function(capability) {
          return _this.transport.canDo(capability, payload.secret);
        };
      })(this));
      payload = {
        type: type,
        version: this.transport.version,
        capabilities: permittedCapabilities,
        allCapabilities: capabilities
      };
      if (this.mainGraph) {
        payload.graph = this.mainGraph;
      }
      if (this.transport.options.id) {
        payload.id = this.transport.options.id;
      }
      if (this.transport.options.label) {
        payload.label = this.transport.options.label;
      }
      if (this.transport.options.namespace) {
        payload.namespace = this.transport.options.namespace;
      }
      if (this.transport.options.repository) {
        payload.repository = this.transport.options.repository;
      }
      if (this.transport.options.repositoryVersion) {
        payload.repositoryVersion = this.transport.options.repositoryVersion;
      }
      this.send('runtime', payload, context);
      ref = this.transport.network.networks;
      results = [];
      for (name in ref) {
        network = ref[name];
        results.push(this.sendPorts(name, network, context));
      }
      return results;
    };

    RuntimeProtocol.prototype.sendPorts = function(name, network, context) {
      var payload;
      payload = portsPayload(name, network);
      this.emit('ports', payload);
      if (!context) {
        return this.sendAll('ports', payload);
      } else {
        return this.send('ports', payload, context);
      }
    };

    RuntimeProtocol.prototype.setMainGraph = function(id) {
      return this.mainGraph = id;
    };

    RuntimeProtocol.prototype.subscribeExportedPorts = function(name, network, add) {
      var d, dependencies, i, j, len, len1, results, sendExportedPorts;
      sendExportedPorts = (function(_this) {
        return function() {
          return _this.sendPorts(name, network);
        };
      })(this);
      dependencies = ['addInport', 'addOutport', 'removeInport', 'removeOutport'];
      for (i = 0, len = dependencies.length; i < len; i++) {
        d = dependencies[i];
        network.graph.removeListener(d, sendExportedPorts);
      }
      if (add) {
        results = [];
        for (j = 0, len1 = dependencies.length; j < len1; j++) {
          d = dependencies[j];
          results.push(network.graph.on(d, sendExportedPorts));
        }
        return results;
      }
    };

    RuntimeProtocol.prototype.subscribeOutPorts = function(name, network, add) {
      var graph, portAdded, portRemoved;
      portRemoved = (function(_this) {
        return function() {
          return _this.subscribeOutdata(name, network, false);
        };
      })(this);
      portAdded = (function(_this) {
        return function() {
          return _this.subscribeOutdata(name, network, true);
        };
      })(this);
      graph = network.graph;
      graph.removeListener('addOutport', portAdded);
      graph.removeListener('removeOutport', portRemoved);
      if (add) {
        graph.on('addOutport', portAdded);
        return graph.on('removeOutport', portRemoved);
      }
    };

    RuntimeProtocol.prototype.subscribeOutdata = function(graphName, network, add) {
      var event, events, graphSockets, i, len, pub, socket;
      events = ['data', 'begingroup', 'endgroup', 'connect', 'disconnect'];
      if (!this.outputSockets[graphName]) {
        this.outputSockets[graphName] = {};
      }
      graphSockets = this.outputSockets[graphName];
      for (pub in graphSockets) {
        socket = graphSockets[pub];
        for (i = 0, len = events.length; i < len; i++) {
          event = events[i];
          socket.removeAllListeners(event);
        }
      }
      graphSockets = {};
      if (!add) {
        return;
      }
      return Object.keys(network.graph.outports).forEach((function(_this) {
        return function(pub) {
          var component, internal, j, len1, results, sendFunc;
          internal = network.graph.outports[pub];
          socket = noflo.internalSocket.createSocket();
          graphSockets[pub] = socket;
          component = network.processes[internal.process].component;
          component.outPorts[internal.port].attach(socket);
          sendFunc = function(event) {
            return function(payload) {
              _this.emit('packet', {
                port: pub,
                event: event,
                graph: graphName,
                payload: payload
              });
              return _this.sendAll('packet', {
                port: pub,
                event: event,
                graph: graphName,
                payload: payload
              });
            };
          };
          results = [];
          for (j = 0, len1 = events.length; j < len1; j++) {
            event = events[j];
            results.push(socket.on(event, sendFunc(event)));
          }
          return results;
        };
      })(this));
    };

    RuntimeProtocol.prototype.sendPacket = function(payload, callback) {
      var network, port;
      network = this.transport.network.networks[payload.graph];
      if (!network) {
        return callback(new Error("Cannot find network for graph " + payload.graph));
      }
      port = findPort(network.network, payload.port, true);
      if (!port) {
        return callback(new Error("Cannot find internal port for " + payload.port));
      }
      return sendToInport(port, payload.event, payload.payload);
    };

    return RuntimeProtocol;

  })(EventEmitter);

  module.exports = RuntimeProtocol;

}).call(this);


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var GraphProtocol, noflo;

  noflo = __webpack_require__(0);

  GraphProtocol = (function() {
    function GraphProtocol(transport) {
      this.transport = transport;
      this.graphs = {};
    }

    GraphProtocol.prototype.send = function(topic, payload, context) {
      return this.transport.send('graph', topic, payload, context);
    };

    GraphProtocol.prototype.sendAll = function(topic, payload) {
      return this.transport.sendAll('graph', topic, payload);
    };

    GraphProtocol.prototype.receive = function(topic, payload, context) {
      var graph;
      if (!this.transport.canDo('protocol:graph', payload.secret)) {
        this.send('error', new Error(topic + " not permitted"), context);
        return;
      }
      if (topic !== 'clear') {
        graph = this.resolveGraph(payload, context);
        if (!graph) {
          this.send('error', new Error("Graph '" + payload.graph + "' not found"), context);
          return;
        }
      }
      switch (topic) {
        case 'clear':
          return this.initGraph(payload, context);
        case 'addnode':
          return this.addNode(graph, payload, context);
        case 'removenode':
          return this.removeNode(graph, payload, context);
        case 'renamenode':
          return this.renameNode(graph, payload, context);
        case 'changenode':
          return this.changeNode(graph, payload, context);
        case 'addedge':
          return this.addEdge(graph, payload, context);
        case 'removeedge':
          return this.removeEdge(graph, payload, context);
        case 'changeedge':
          return this.changeEdge(graph, payload, context);
        case 'addinitial':
          return this.addInitial(graph, payload, context);
        case 'removeinitial':
          return this.removeInitial(graph, payload, context);
        case 'addinport':
          return this.addInport(graph, payload, context);
        case 'removeinport':
          return this.removeInport(graph, payload, context);
        case 'renameinport':
          return this.renameInport(graph, payload, context);
        case 'addoutport':
          return this.addOutport(graph, payload, context);
        case 'removeoutport':
          return this.removeOutport(graph, payload, context);
        case 'renameoutport':
          return this.renameOutport(graph, payload, context);
        case 'addgroup':
          return this.addGroup(graph, payload, context);
        case 'removegroup':
          return this.removeGroup(graph, payload, context);
        case 'renamegroup':
          return this.renameGroup(graph, payload, context);
        case 'changegroup':
          return this.changeGroup(graph, payload, context);
      }
    };

    GraphProtocol.prototype.resolveGraph = function(payload, context) {
      if (!payload.graph) {
        this.send('error', new Error('No graph specified'), context);
        return;
      }
      if (!this.graphs[payload.graph]) {
        this.send('error', new Error('Requested graph not found'), context);
        return;
      }
      return this.graphs[payload.graph];
    };

    GraphProtocol.prototype.getLoader = function(baseDir) {
      return this.transport.component.getLoader(baseDir, this.transport.options);
    };

    GraphProtocol.prototype.sendGraph = function(id, graph, context) {
      var payload;
      payload = {
        graph: id,
        description: graph.toJSON()
      };
      return this.send('graph', payload, context);
    };

    GraphProtocol.prototype.initGraph = function(payload, context) {
      var fullName, graph;
      if (!payload.id) {
        this.send('error', new Error('No graph ID provided'), context);
        return;
      }
      if (!payload.name) {
        payload.name = 'NoFlo runtime';
      }
      graph = new noflo.Graph(payload.name);
      fullName = payload.id;
      if (payload.library) {
        payload.library = payload.library.replace('noflo-', '');
        graph.properties.library = payload.library;
        fullName = payload.library + "/" + fullName;
      }
      if (payload.icon) {
        graph.properties.icon = payload.icon;
      }
      if (payload.description) {
        graph.properties.description = payload.description;
      }
      graph.baseDir = this.transport.options.baseDir;
      this.subscribeGraph(payload.id, graph, context);
      if (payload.main) {
        this.transport.runtime.setMainGraph(fullName, graph, context);
      } else {
        this.transport.component.registerGraph(fullName, graph, context);
      }
      this.graphs[payload.id] = graph;
      return this.sendAll('clear', {
        id: payload.id,
        name: payload.name,
        library: payload.library,
        main: payload.main,
        icon: payload.icon,
        description: payload.description
      }, context);
    };

    GraphProtocol.prototype.registerGraph = function(id, graph) {
      if (id === 'default/main') {
        this.transport.runtime.setMainGraph(id, graph);
      }
      this.subscribeGraph(id, graph, '');
      return this.graphs[id] = graph;
    };

    GraphProtocol.prototype.subscribeGraph = function(id, graph, context) {
      graph.on('addNode', (function(_this) {
        return function(node) {
          node.graph = id;
          return _this.sendAll('addnode', node, context);
        };
      })(this));
      graph.on('removeNode', (function(_this) {
        return function(node) {
          var nodeData;
          nodeData = {
            id: node.id,
            graph: id
          };
          return _this.sendAll('removenode', nodeData, context);
        };
      })(this));
      graph.on('renameNode', (function(_this) {
        return function(oldId, newId) {
          return _this.sendAll('renamenode', {
            from: oldId,
            to: newId,
            graph: id
          }, context);
        };
      })(this));
      graph.on('changeNode', (function(_this) {
        return function(node, before) {
          return _this.sendAll('changenode', {
            id: node.id,
            metadata: node.metadata,
            graph: id
          }, context);
        };
      })(this));
      graph.on('addEdge', (function(_this) {
        return function(edge) {
          var edgeData;
          if (typeof edge.from.index !== 'number') {
            delete edge.from.index;
          }
          if (typeof edge.to.index !== 'number') {
            delete edge.to.index;
          }
          edgeData = {
            src: edge.from,
            tgt: edge.to,
            metadata: edge.metadata,
            graph: id
          };
          return _this.sendAll('addedge', edgeData, context);
        };
      })(this));
      graph.on('removeEdge', (function(_this) {
        return function(edge) {
          var edgeData;
          edgeData = {
            src: edge.from,
            tgt: edge.to,
            graph: id
          };
          return _this.sendAll('removeedge', edgeData, context);
        };
      })(this));
      graph.on('changeEdge', (function(_this) {
        return function(edge) {
          var edgeData;
          edgeData = {
            src: edge.from,
            tgt: edge.to,
            metadata: edge.metadata,
            graph: id
          };
          return _this.sendAll('changeedge', edgeData, context);
        };
      })(this));
      graph.on('addInitial', (function(_this) {
        return function(iip) {
          var iipData;
          iipData = {
            src: iip.from,
            tgt: iip.to,
            metadata: iip.metadata,
            graph: id
          };
          return _this.sendAll('addinitial', iipData, context);
        };
      })(this));
      graph.on('removeInitial', (function(_this) {
        return function(iip) {
          var iipData;
          iipData = {
            src: iip.from,
            tgt: iip.to,
            graph: id
          };
          return _this.sendAll('removeinitial', iipData, context);
        };
      })(this));
      graph.on('addGroup', (function(_this) {
        return function(group) {
          var groupData;
          groupData = {
            name: group.name,
            nodes: group.nodes,
            metadata: group.metadata,
            graph: id
          };
          return _this.sendAll('addgroup', groupData, context);
        };
      })(this));
      graph.on('removeGroup', (function(_this) {
        return function(group) {
          var groupData;
          groupData = {
            name: group.name,
            graph: id
          };
          return _this.sendAll('removegroup', groupData, context);
        };
      })(this));
      graph.on('renameGroup', (function(_this) {
        return function(oldName, newName) {
          var groupData;
          groupData = {
            from: oldName,
            to: newName,
            graph: id
          };
          return _this.sendAll('renamegroup', groupData, context);
        };
      })(this));
      graph.on('changeGroup', (function(_this) {
        return function(group) {
          var groupData;
          groupData = {
            name: group.name,
            metadata: group.metadata,
            graph: id
          };
          return _this.sendAll('changegroup', groupData, context);
        };
      })(this));
      graph.on('addInport', (function(_this) {
        return function(publicName, port) {
          var data;
          data = {
            "public": publicName,
            node: port.process,
            port: port.port,
            metadata: port.metadata,
            graph: id
          };
          return _this.sendAll('addinport', data, context);
        };
      })(this));
      graph.on('addOutport', (function(_this) {
        return function(publicName, port) {
          var data;
          data = {
            "public": publicName,
            node: port.process,
            port: port.port,
            metadata: port.metadata,
            graph: id
          };
          return _this.sendAll('addoutport', data, context);
        };
      })(this));
      graph.on('removeInport', (function(_this) {
        return function(publicName, port) {
          var data;
          data = {
            "public": publicName,
            graph: id
          };
          return _this.sendAll('removeinport', data, context);
        };
      })(this));
      return graph.on('removeOutport', (function(_this) {
        return function(publicName, port) {
          var data;
          data = {
            "public": publicName,
            graph: id
          };
          return _this.sendAll('removeoutport', data, context);
        };
      })(this));
    };

    GraphProtocol.prototype.addNode = function(graph, node, context) {
      if (!(node.id || node.component)) {
        this.send('error', new Error('No ID or component supplied'), context);
        return;
      }
      return graph.addNode(node.id, node.component, node.metadata);
    };

    GraphProtocol.prototype.removeNode = function(graph, payload, context) {
      if (!payload.id) {
        this.send('error', new Error('No ID supplied'), context);
        return;
      }
      return graph.removeNode(payload.id);
    };

    GraphProtocol.prototype.renameNode = function(graph, payload, context) {
      if (!(payload.from || payload.to)) {
        this.send('error', new Error('No from or to supplied'), context);
        return;
      }
      return graph.renameNode(payload.from, payload.to);
    };

    GraphProtocol.prototype.changeNode = function(graph, payload, context) {
      if (!(payload.id || payload.metadata)) {
        this.send('error', new Error('No id or metadata supplied'), context);
        return;
      }
      return graph.setNodeMetadata(payload.id, payload.metadata);
    };

    GraphProtocol.prototype.addEdge = function(graph, edge, context) {
      if (!(edge.src || edge.tgt)) {
        this.send('error', new Error('No src or tgt supplied'), context);
        return;
      }
      if (typeof edge.src.index === 'number' || typeof edge.tgt.index === 'number') {
        if (graph.addEdgeIndex) {
          graph.addEdgeIndex(edge.src.node, edge.src.port, edge.src.index, edge.tgt.node, edge.tgt.port, edge.tgt.index, edge.metadata);
          return;
        }
      }
      return graph.addEdge(edge.src.node, edge.src.port, edge.tgt.node, edge.tgt.port, edge.metadata);
    };

    GraphProtocol.prototype.removeEdge = function(graph, edge, context) {
      if (!(edge.src || edge.tgt)) {
        this.send('error', new Error('No src or tgt supplied'), context);
        return;
      }
      return graph.removeEdge(edge.src.node, edge.src.port, edge.tgt.node, edge.tgt.port);
    };

    GraphProtocol.prototype.changeEdge = function(graph, edge, context) {
      if (!(edge.src || edge.tgt)) {
        this.send('error', new Error('No src or tgt supplied'), context);
        return;
      }
      return graph.setEdgeMetadata(edge.src.node, edge.src.port, edge.tgt.node, edge.tgt.port, edge.metadata);
    };

    GraphProtocol.prototype.addInitial = function(graph, payload, context) {
      if (!(payload.src || payload.tgt)) {
        this.send('error', new Error('No src or tgt supplied'), context);
        return;
      }
      if (graph.addInitialIndex && typeof payload.tgt.index === 'number') {
        graph.addInitialIndex(payload.src.data, payload.tgt.node, payload.tgt.port, payload.tgt.index, payload.metadata);
        return;
      }
      return graph.addInitial(payload.src.data, payload.tgt.node, payload.tgt.port, payload.metadata);
    };

    GraphProtocol.prototype.removeInitial = function(graph, payload, context) {
      if (!payload.tgt) {
        this.send('error', new Error('No tgt supplied'), context);
        return;
      }
      return graph.removeInitial(payload.tgt.node, payload.tgt.port);
    };

    GraphProtocol.prototype.addInport = function(graph, payload, context) {
      if (!(payload["public"] || payload.node || payload.port)) {
        this.send('error', new Error('Missing exported inport information'), context);
        return;
      }
      return graph.addInport(payload["public"], payload.node, payload.port, payload.metadata);
    };

    GraphProtocol.prototype.removeInport = function(graph, payload, context) {
      if (!payload["public"]) {
        this.send('error', new Error('Missing exported inport name'), context);
        return;
      }
      return graph.removeInport(payload["public"]);
    };

    GraphProtocol.prototype.renameInport = function(graph, payload, context) {
      if (!(payload.from || payload.to)) {
        this.send('error', new Error('No from or to supplied'), context);
        return;
      }
      return graph.renameInport(payload.from, payload.to);
    };

    GraphProtocol.prototype.addOutport = function(graph, payload, context) {
      if (!(payload["public"] || payload.node || payload.port)) {
        this.send('error', new Error('Missing exported outport information'), context);
        return;
      }
      return graph.addOutport(payload["public"], payload.node, payload.port, payload.metadata);
    };

    GraphProtocol.prototype.removeOutport = function(graph, payload, context) {
      if (!payload["public"]) {
        this.send('error', new Error('Missing exported outport name'), context);
        return;
      }
      return graph.removeOutport(payload["public"]);
    };

    GraphProtocol.prototype.renameOutport = function(graph, payload, context) {
      if (!(payload.from || payload.to)) {
        this.send('error', new Error('No from or to supplied'), context);
        return;
      }
      return graph.renameOutport(payload.from, payload.to);
    };

    GraphProtocol.prototype.addGroup = function(graph, payload, context) {
      if (!(payload.name || payload.nodes || payload.metadata)) {
        this.send('error', new Error('No name or nodes or metadata supplied'), context);
        return;
      }
      return graph.addGroup(payload.name, payload.nodes, payload.metadata);
    };

    GraphProtocol.prototype.removeGroup = function(graph, payload, context) {
      if (!payload.name) {
        this.send('error', new Error('No name supplied'), context);
        return;
      }
      return graph.removeGroup(payload.name);
    };

    GraphProtocol.prototype.renameGroup = function(graph, payload, context) {
      if (!(payload.from || payload.to)) {
        this.send('error', new Error('No from or to supplied'), context);
        return;
      }
      return graph.renameGroup(payload.from, payload.to);
    };

    GraphProtocol.prototype.changeGroup = function(graph, payload, context) {
      if (!(payload.name || payload.metadata)) {
        this.send('error', new Error('No name or metadata supplied'), context);
        return;
      }
      return graph.setEdgeMetadata(payload.name, payload.metadata);
    };

    return GraphProtocol;

  })();

  module.exports = GraphProtocol;

}).call(this);


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {(function() {
  var EventEmitter, NetworkProtocol, getConnectionSignature, getEdgeSignature, getPortSignature, getSocketSignature, noflo, prepareSocketEvent,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  noflo = __webpack_require__(0);

  EventEmitter = __webpack_require__(2).EventEmitter;

  prepareSocketEvent = function(event, req) {
    var payload, ref, ref1, ref2;
    payload = {
      id: event.id,
      graph: req.graph
    };
    if (event.socket.from) {
      payload.src = {
        node: event.socket.from.process.id,
        port: event.socket.from.port
      };
    }
    if (event.socket.to) {
      payload.tgt = {
        node: event.socket.to.process.id,
        port: event.socket.to.port
      };
    }
    if (event.subgraph) {
      payload.subgraph = event.subgraph;
    }
    if (event.group) {
      payload.group = event.group;
    }
    if (event.datatype) {
      payload.type = event.datatype;
    }
    if (event.schema) {
      payload.schema = event.schema;
    }
    if (typeof event.data !== 'undefined') {
      if (!noflo.isBrowser()) {
        if (Buffer.isBuffer(event.data)) {
          event.data = event.data.slice(0, 20);
        }
      }
      if ((ref = event.data) != null ? ref.toJSON : void 0) {
        payload.data = event.data.toJSON();
      }
      if ((ref1 = event.data) != null ? ref1.toString : void 0) {
        payload.data = event.data.toString();
        if (payload.data === '[object Object]') {
          try {
            payload.data = JSON.parse(JSON.stringify(event.data));
          } catch (undefined) {}
        }
      } else {
        payload.data = event.data;
      }
      if ((ref2 = event.metadata) != null ? ref2.secure : void 0) {
        payload.data = 'DATA';
      }
    }
    return payload;
  };

  getPortSignature = function(item) {
    if (!item) {
      return '';
    }
    return item.process + '(' + item.port + ')';
  };

  getEdgeSignature = function(edge) {
    return getPortSignature(edge.src) + ' -> ' + getPortSignature(edge.tgt);
  };

  getConnectionSignature = function(connection) {
    if (!connection) {
      return '';
    }
    return connection.process.id + '(' + connection.port + ')';
  };

  getSocketSignature = function(socket) {
    return getConnectionSignature(socket.from) + ' -> ' + getConnectionSignature(socket.to);
  };

  NetworkProtocol = (function(superClass) {
    extend(NetworkProtocol, superClass);

    function NetworkProtocol(transport) {
      this.transport = transport;
      this.networks = {};
    }

    NetworkProtocol.prototype.send = function(topic, payload, context) {
      return this.transport.send('network', topic, payload, context);
    };

    NetworkProtocol.prototype.sendAll = function(topic, payload) {
      return this.transport.sendAll('network', topic, payload);
    };

    NetworkProtocol.prototype.receive = function(topic, payload, context) {
      var graph;
      if (!this.transport.canDo('protocol:network', payload.secret)) {
        this.send('error', new Error(topic + " not permitted"), context);
        return;
      }
      if (topic !== 'list') {
        graph = this.resolveGraph(payload, context);
        if (!graph) {
          return;
        }
      }
      switch (topic) {
        case 'start':
          return this.startNetwork(graph, payload, context);
        case 'stop':
          return this.stopNetwork(graph, payload, context);
        case 'edges':
          return this.updateEdgesFilter(graph, payload, context);
        case 'debug':
          return this.debugNetwork(graph, payload, context);
        case 'getstatus':
          return this.getStatus(graph, payload, context);
      }
    };

    NetworkProtocol.prototype.resolveGraph = function(payload, context) {
      if (!payload.graph) {
        this.send('error', new Error('No graph specified'), context);
        return;
      }
      if (!this.transport.graph.graphs[payload.graph]) {
        this.send('error', new Error('Requested graph not found'), context);
        return;
      }
      return this.transport.graph.graphs[payload.graph];
    };

    NetworkProtocol.prototype.updateEdgesFilter = function(graph, payload, context) {
      var edge, j, len, network, ref, signature;
      network = this.networks[payload.graph];
      if (network) {
        network.filters = {};
      } else {
        network = {
          network: null,
          filters: {}
        };
        this.networks[payload.graph] = network;
      }
      ref = payload.edges;
      for (j = 0, len = ref.length; j < len; j++) {
        edge = ref[j];
        signature = getEdgeSignature(edge);
        network.filters[signature] = true;
      }
      return this.send('edges', {
        graph: payload.graph,
        edges: payload.edges
      }, context);
    };

    NetworkProtocol.prototype.eventFiltered = function(graph, event) {
      var sign;
      if (!this.transport.options.filterData) {
        return true;
      }
      sign = getSocketSignature(event.socket);
      return this.networks[graph].filters[sign];
    };

    NetworkProtocol.prototype.initNetwork = function(graph, payload, context, callback) {
      var network, opts;
      if (this.networks[payload.graph] && this.networks[payload.graph].network) {
        network = this.networks[payload.graph].network;
        network.stop((function(_this) {
          return function(err) {
            if (err) {
              return callback(err);
            }
            delete _this.networks[payload.graph];
            _this.emit('removenetwork', network, payload.graph, _this.networks);
            return _this.initNetwork(graph, payload, context, callback);
          };
        })(this));
        return;
      }
      graph.componentLoader = this.transport.component.getLoader(graph.baseDir, this.transport.options);
      opts = JSON.parse(JSON.stringify(this.transport.options));
      opts.delay = true;
      return noflo.createNetwork(graph, (function(_this) {
        return function(err, network) {
          if (err) {
            return callback(err);
          }
          if (_this.networks[payload.graph] && _this.networks[payload.graph].network) {
            _this.networks[payload.graph].network = network;
          } else {
            _this.networks[payload.graph] = {
              network: network,
              filters: {}
            };
          }
          _this.emit('addnetwork', network, payload.graph, _this.networks);
          _this.subscribeNetwork(network, payload, context);
          return network.connect(callback);
        };
      })(this), opts);
    };

    NetworkProtocol.prototype.subscribeNetwork = function(network, payload, context) {
      network.on('start', (function(_this) {
        return function(event) {
          return _this.sendAll('started', {
            time: event.start,
            graph: payload.graph,
            running: network.isRunning(),
            started: network.isStarted()
          }, context);
        };
      })(this));
      network.on('end', (function(_this) {
        return function(event) {
          return _this.sendAll('stopped', {
            time: new Date,
            uptime: event.uptime,
            graph: payload.graph,
            running: network.isRunning(),
            started: network.isStarted()
          }, context);
        };
      })(this));
      network.on('icon', (function(_this) {
        return function(event) {
          event.graph = payload.graph;
          return _this.sendAll('icon', event, context);
        };
      })(this));
      network.on('connect', (function(_this) {
        return function(event) {
          if (!_this.eventFiltered(payload.graph, event)) {
            return;
          }
          return _this.sendAll('connect', prepareSocketEvent(event, payload), context);
        };
      })(this));
      network.on('ip', (function(_this) {
        return function(event) {
          var protocolEvent;
          if (!_this.eventFiltered(payload.graph, event)) {
            return;
          }
          protocolEvent = {
            id: event.id,
            socket: event.socket,
            subgraph: event.subgraph,
            metadata: event.metadata
          };
          switch (event.type) {
            case 'openBracket':
              protocolEvent.type = 'begingroup';
              protocolEvent.group = event.data;
              break;
            case 'data':
              protocolEvent.type = 'data';
              protocolEvent.data = event.data;
              protocolEvent.datatype = event.datatype;
              protocolEvent.schema = event.schema;
              break;
            case 'closeBracket':
              protocolEvent.type = 'endgroup';
              protocolEvent.group = event.data;
          }
          return _this.sendAll(protocolEvent.type, prepareSocketEvent(protocolEvent, payload), context);
        };
      })(this));
      network.on('disconnect', (function(_this) {
        return function(event) {
          if (!_this.eventFiltered(payload.graph, event)) {
            return;
          }
          return _this.sendAll('disconnect', prepareSocketEvent(event, payload), context);
        };
      })(this));
      return network.on('process-error', (function(_this) {
        return function(event) {
          var bt, error, i, j, ref;
          error = event.error.message;
          if (event.error.stack) {
            bt = event.error.stack.split('\n');
            for (i = j = 0, ref = Math.min(bt.length, 3); 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
              error += "\n" + bt[i];
            }
          }
          return _this.sendAll('processerror', {
            id: event.id,
            error: error,
            graph: payload.graph
          }, context);
        };
      })(this));
    };

    NetworkProtocol.prototype.startNetwork = function(graph, payload, context) {
      var doStart, network;
      doStart = (function(_this) {
        return function(net) {
          return net.start(function(err) {
            if (err) {
              return _this.send('error', err, content);
            }
          });
        };
      })(this);
      network = this.networks[payload.graph];
      if (network && network.network) {
        doStart(network.network);
        return;
      }
      return this.initNetwork(graph, payload, context, (function(_this) {
        return function(err) {
          if (err) {
            return _this.send('error', err, context);
          }
          network = _this.networks[payload.graph];
          return doStart(network.network);
        };
      })(this));
    };

    NetworkProtocol.prototype.stopNetwork = function(graph, payload, context) {
      var net;
      if (!this.networks[payload.graph]) {
        return;
      }
      net = this.networks[payload.graph].network;
      if (!net) {
        return;
      }
      if (net.isStarted()) {
        this.networks[payload.graph].network.stop((function(_this) {
          return function(err) {
            if (err) {
              return _this.send('error', err, context);
            }
          };
        })(this));
        return;
      }
      return this.send('stopped', {
        time: new Date,
        graph: payload.graph,
        running: net.isRunning(),
        started: net.isStarted()
      }, context);
    };

    NetworkProtocol.prototype.debugNetwork = function(graph, payload, context) {
      var net;
      if (!this.networks[payload.graph]) {
        return;
      }
      net = this.networks[payload.graph].network;
      if (!net) {
        return;
      }
      if (net.setDebug != null) {
        return net.setDebug(payload.enable);
      } else {
        return console.log('Warning: Network.setDebug not supported. Update to newer NoFlo');
      }
    };

    NetworkProtocol.prototype.getStatus = function(graph, payload, context) {
      var net;
      if (!this.networks[payload.graph]) {
        return;
      }
      net = this.networks[payload.graph].network;
      if (!net) {
        return;
      }
      return this.send('status', {
        graph: payload.graph,
        running: net.isRunning(),
        started: net.isStarted()
      }, context);
    };

    return NetworkProtocol;

  })(EventEmitter);

  module.exports = NetworkProtocol;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14).Buffer))

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var ComponentProtocol, _, noflo;

  noflo = __webpack_require__(0);

  _ = __webpack_require__(99);

  ComponentProtocol = (function() {
    ComponentProtocol.prototype.loaders = {};

    function ComponentProtocol(transport) {
      this.transport = transport;
    }

    ComponentProtocol.prototype.send = function(topic, payload, context) {
      return this.transport.send('component', topic, payload, context);
    };

    ComponentProtocol.prototype.receive = function(topic, payload, context) {
      if (!this.transport.canDo('protocol:component', payload.secret)) {
        this.send('error', new Error(topic + " not permitted"), context);
        return;
      }
      if (topic === 'source' && !this.transport.canDo('component:setsource', payload.secret)) {
        this.send('error', new Error(topic + " not permitted"), context);
        return;
      }
      if (topic === 'getsource' && !this.transport.canDo('component:getsource', payload.secret)) {
        this.send('error', new Error(topic + " not permitted"), context);
        return;
      }
      switch (topic) {
        case 'list':
          return this.listComponents(payload, context);
        case 'getsource':
          return this.getSource(payload, context);
        case 'source':
          return this.setSource(payload, context);
      }
    };

    ComponentProtocol.prototype.getLoader = function(baseDir, options) {
      if (options == null) {
        options = {};
      }
      if (!this.loaders[baseDir]) {
        this.loaders[baseDir] = new noflo.ComponentLoader(baseDir, options);
      }
      return this.loaders[baseDir];
    };

    ComponentProtocol.prototype.listComponents = function(payload, context) {
      var baseDir, loader;
      baseDir = this.transport.options.baseDir;
      loader = this.getLoader(baseDir, this.transport.options);
      return loader.listComponents((function(_this) {
        return function(err, components) {
          var componentNames, processed;
          if (err) {
            _this.send('error', err, context);
            return;
          }
          componentNames = Object.keys(components);
          processed = 0;
          return componentNames.forEach(function(component) {
            return _this.processComponent(loader, component, context, function(err) {
              processed++;
              if (processed < componentNames.length) {
                return;
              }
              return _this.send('componentsready', processed, context);
            });
          });
        };
      })(this));
    };

    ComponentProtocol.prototype.getSource = function(payload, context) {
      var baseDir, loader;
      baseDir = this.transport.options.baseDir;
      loader = this.getLoader(baseDir, this.transport.options);
      return loader.getSource(payload.name, (function(_this) {
        return function(err, component) {
          var graph, nameParts;
          if (err) {
            graph = _this.transport.graph.graphs[payload.name];
            if (graph == null) {
              _this.send('error', err, context);
              return;
            }
            nameParts = payload.name.split('/');
            return _this.send('source', {
              name: nameParts[1],
              library: nameParts[0],
              code: JSON.stringify(graph.toJSON()),
              language: 'json'
            }, context);
          } else {
            return _this.send('source', component, context);
          }
        };
      })(this));
    };

    ComponentProtocol.prototype.setSource = function(payload, context) {
      var baseDir, loader;
      baseDir = this.transport.options.baseDir;
      loader = this.getLoader(baseDir, this.transport.options);
      return loader.setSource(payload.library, payload.name, payload.code, payload.language, (function(_this) {
        return function(err) {
          if (err) {
            _this.send('error', err, context);
            return;
          }
          return _this.processComponent(loader, loader.normalizeName(payload.library, payload.name), context);
        };
      })(this));
    };

    ComponentProtocol.prototype.processComponent = function(loader, component, context, callback) {
      if (!callback) {
        callback = function() {};
      }
      return loader.load(component, (function(_this) {
        return function(err, instance) {
          if (!instance) {
            if (err instanceof Error) {
              _this.send('error', err, context);
              return callback(err);
            }
            instance = err;
          }
          if (!instance.isReady()) {
            instance.once('ready', function() {
              _this.sendComponent(component, instance, context);
              return callback(null);
            });
            return;
          }
          _this.sendComponent(component, instance, context);
          return callback(null);
        };
      })(this), true);
    };

    ComponentProtocol.prototype.sendComponent = function(component, instance, context) {
      var icon, inPorts, outPorts, port, portName, ref, ref1;
      inPorts = [];
      outPorts = [];
      ref = instance.inPorts;
      for (portName in ref) {
        port = ref[portName];
        if (!port || typeof port === 'function' || !port.canAttach) {
          continue;
        }
        inPorts.push({
          id: portName,
          type: port.getDataType ? port.getDataType() : void 0,
          schema: port.getSchema ? port.getSchema() : void 0,
          required: port.isRequired ? port.isRequired() : void 0,
          addressable: port.isAddressable ? port.isAddressable() : void 0,
          description: port.getDescription ? port.getDescription() : void 0,
          values: port.options && port.options.values ? port.options.values : void 0,
          "default": port.options && port.options["default"] ? port.options["default"] : void 0
        });
      }
      ref1 = instance.outPorts;
      for (portName in ref1) {
        port = ref1[portName];
        if (!port || typeof port === 'function' || !port.canAttach) {
          continue;
        }
        outPorts.push({
          id: portName,
          type: port.getDataType ? port.getDataType() : void 0,
          schema: port.getSchema ? port.getSchema() : void 0,
          required: port.isRequired ? port.isRequired() : void 0,
          addressable: port.isAddressable ? port.isAddressable() : void 0,
          description: port.getDescription ? port.getDescription() : void 0
        });
      }
      icon = instance.getIcon ? instance.getIcon() : 'blank';
      return this.send('component', {
        name: component,
        description: instance.description,
        subgraph: instance.isSubgraph(),
        icon: icon,
        inPorts: inPorts,
        outPorts: outPorts
      }, context);
    };

    ComponentProtocol.prototype.registerGraph = function(id, graph, context) {
      var loader, send, sender;
      sender = (function(_this) {
        return function() {
          return _this.processComponent(loader, id, context);
        };
      })(this);
      send = _.debounce(sender, 10);
      loader = this.getLoader(graph.baseDir, this.transport.options);
      loader.listComponents((function(_this) {
        return function(err, components) {
          if (err) {
            _this.send('error', err, context);
            return;
          }
          loader.registerComponent('', id, graph);
          return send();
        };
      })(this));
      graph.on('addNode', send);
      graph.on('removeNode', send);
      graph.on('renameNode', send);
      graph.on('addEdge', send);
      graph.on('removeEdge', send);
      graph.on('addInitial', send);
      graph.on('removeInitial', send);
      graph.on('addInport', send);
      graph.on('removeInport', send);
      graph.on('renameInport', send);
      graph.on('addOutport', send);
      graph.on('removeOutport', send);
      return graph.on('renameOutport', send);
    };

    return ComponentProtocol;

  })();

  module.exports = ComponentProtocol;

}).call(this);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return _;
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

(function() {
  var TraceBuffer, Tracer, clone, debug, e, error, jsonStringify, networkToTraceEvent, noflo, subscribeExportedOutports;

  noflo = __webpack_require__(0);

  debug = __webpack_require__(3)('noflo-runtime-base:trace');

  jsonStringify = JSON.stringify;

  try {
    jsonStringify = __webpack_require__(101);
  } catch (error) {
    e = error;
    console.log("WARN: failed to load json-stringify-safe, circular objects may cause fail.\n" + e.message);
  }

  clone = function(obj) {
    var s;
    s = jsonStringify(obj);
    return JSON.parse(s);
  };

  TraceBuffer = (function() {
    function TraceBuffer() {
      this.events = [];
    }

    TraceBuffer.prototype.add = function(event) {
      return this.events.push(event);
    };

    TraceBuffer.prototype.getAll = function(consumeFunc, doneFunc) {
      var i, len, ref;
      ref = this.events;
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        consumeFunc(e);
      }
      return doneFunc(null);
    };

    return TraceBuffer;

  })();

  subscribeExportedOutports = function(network, networkId, eventNames, subscribeFunc) {
    var component, event, graphSockets, i, internal, len, pub, ref, sendFunc, socket;
    graphSockets = {};
    ref = network.graph.outports;
    for (pub in ref) {
      internal = ref[pub];
      socket = noflo.internalSocket.createSocket();
      graphSockets[pub] = socket;
      component = network.processes[internal.process].component;
      component.outPorts[internal.port].attach(socket);
      sendFunc = function(event) {
        return function(payload) {
          var data;
          data = {
            id: "EXPORT: " + networkId + " " + (pub.toUpperCase()) + " ->",
            payload: payload,
            socket: {
              to: {
                process: {
                  id: networkId
                },
                port: pub
              }
            }
          };
          return subscribeFunc(event, data);
        };
      };
      for (i = 0, len = eventNames.length; i < len; i++) {
        event = eventNames[i];
        socket.on(event, sendFunc(event));
      }
    }
    return graphSockets;
  };

  networkToTraceEvent = function(networkId, type, data) {
    var error1, event, p, ref, ref1, ref2, ref3, serializeGroup, socket;
    debug('event', networkId, type, "'" + data.id + "'");
    socket = data.socket;
    event = {
      protocol: 'network',
      command: type,
      payload: {
        time: new Date().toISOString(),
        graph: networkId,
        error: null,
        src: {
          node: (ref = socket.from) != null ? ref.process.id : void 0,
          port: (ref1 = socket.from) != null ? ref1.port : void 0
        },
        tgt: {
          node: (ref2 = socket.to) != null ? ref2.process.id : void 0,
          port: (ref3 = socket.to) != null ? ref3.port : void 0
        },
        id: void 0,
        subgraph: void 0
      }
    };
    serializeGroup = function(p) {
      var error1;
      try {
        return p.group = data.group.toString();
      } catch (error1) {
        e = error1;
        debug('group serialization error', e);
        return p.error = e.message;
      }
    };
    p = event.payload;
    switch (type) {
      case 'connect':
        null;
        break;
      case 'disconnect':
        null;
        break;
      case 'begingroup':
        serializeGroup(event.payload);
        break;
      case 'endgroup':
        serializeGroup(event.payload);
        break;
      case 'data':
        try {
          p.data = clone(data.data);
        } catch (error1) {
          e = error1;
          debug('data serialization error', e);
          p.error = e.message;
        }
        break;
      default:
        throw new Error("trace: Unknown event type " + type);
    }
    debug('event done', networkId, type, "'" + data.id + "'");
    return event;
  };

  Tracer = (function() {
    function Tracer(options) {
      this.options = options;
      this.buffer = new TraceBuffer;
      this.header = {
        graphs: {}
      };
    }

    Tracer.prototype.attach = function(network) {
      var eventNames, netId, sockets;
      netId = network.graph.name || network.graph.properties.name || 'default';
      debug('attach', netId);
      eventNames = ['connect', 'begingroup', 'data', 'endgroup', 'disconnect'];
      eventNames.forEach((function(_this) {
        return function(event) {
          return network.on(event, function(data) {
            var payload;
            payload = networkToTraceEvent(netId, event, data);
            return _this.buffer.add(payload);
          });
        };
      })(this));
      sockets = subscribeExportedOutports(network, netId, eventNames, (function(_this) {
        return function(event, data) {
          var payload;
          payload = networkToTraceEvent(netId, event, data);
          return _this.buffer.add(payload);
        };
      })(this));
      return this.header.graphs[netId] = network.graph.toJSON();
    };

    Tracer.prototype.detach = function(network) {};

    Tracer.prototype.dumpString = function(callback) {
      var consume, events;
      events = [];
      consume = function(e) {
        return events.push(e);
      };
      return this.buffer.getAll(consume, (function(_this) {
        return function(err) {
          var trace;
          trace = {
            header: _this.header,
            events: events
          };
          return callback(err, JSON.stringify(trace, null, 2));
        };
      })(this));
    };

    Tracer.prototype.dumpFile = function(filepath, callback) {
      var fs, openFile, temp;
      fs = __webpack_require__(6);
      temp = __webpack_require__(102);
      openFile = function(cb) {
        return fs.open(filepath, 'w', function(err, fd) {
          return cb(err, {
            path: filepath,
            fd: fd
          });
        });
      };
      if (!filepath) {
        openFile = function(cb) {
          return temp.open({
            suffix: '.json'
          }, cb);
        };
      }
      return openFile((function(_this) {
        return function(err, info) {
          var events, header, write, writeEvent;
          if (err) {
            return callback(err);
          }
          events = 0;
          write = function(data, cb) {
            return fs.write(info.fd, data, {
              encoding: 'utf-8'
            }, cb);
          };
          writeEvent = function(e) {
            var s;
            s = events ? ',' : '';
            events += 1;
            s += JSON.stringify(e, null, 2);
            return write(s, function(err) {});
          };
          debug('streaming to file', info.path);
          header = JSON.stringify(_this.header, null, 2);
          return write("{\n \"header\": " + header + "\n, \"events\":\n[", function(err) {
            return _this.buffer.getAll(writeEvent, function(err) {
              if (err) {
                return callback(err);
              }
              debug("streamed " + events + " events");
              return write(']\n }', function(err) {
                debug("completed stream", info.path);
                return callback(err, info.path);
              });
            });
          });
        };
      })(this));
    };

    return Tracer;

  })();

  module.exports.Tracer = Tracer;

}).call(this);


/***/ }),
/* 101 */
/***/ (function(module, exports) {

exports = module.exports = stringify
exports.getSerialize = serializer

function stringify(obj, replacer, spaces, cycleReplacer) {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
  var stack = [], keys = []

  if (cycleReplacer == null) cycleReplacer = function(key, value) {
    if (stack[0] === value) return "[Circular ~]"
    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
  }

  return function(key, value) {
    if (stack.length > 0) {
      var thisPos = stack.indexOf(this)
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
    }
    else stack.push(value)

    return replacer == null ? value : replacer.call(this, key, value)
  }
}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var fs   = __webpack_require__(6),
    path = __webpack_require__(25),
    cnst = __webpack_require__(103);

var rimraf     = __webpack_require__(104),
    osTmpdir   = __webpack_require__(106),
    rimrafSync = rimraf.sync;

/* HELPERS */

var RDWR_EXCL = cnst.O_CREAT | cnst.O_TRUNC | cnst.O_RDWR | cnst.O_EXCL;

var generateName = function(rawAffixes, defaultPrefix) {
  var affixes = parseAffixes(rawAffixes, defaultPrefix);
  var now = new Date();
  var name = [affixes.prefix,
              now.getYear(), now.getMonth(), now.getDate(),
              '-',
              process.pid,
              '-',
              (Math.random() * 0x100000000 + 1).toString(36),
              affixes.suffix].join('');
  return path.join(affixes.dir || exports.dir, name);
};

var parseAffixes = function(rawAffixes, defaultPrefix) {
  var affixes = {prefix: null, suffix: null};
  if(rawAffixes) {
    switch (typeof(rawAffixes)) {
    case 'string':
      affixes.prefix = rawAffixes;
      break;
    case 'object':
      affixes = rawAffixes;
      break;
    default:
      throw new Error("Unknown affix declaration: " + affixes);
    }
  } else {
    affixes.prefix = defaultPrefix;
  }
  return affixes;
};

/* -------------------------------------------------------------------------
 * Don't forget to call track() if you want file tracking and exit handlers!
 * -------------------------------------------------------------------------
 * When any temp file or directory is created, it is added to filesToDelete
 * or dirsToDelete. The first time any temp file is created, a listener is
 * added to remove all temp files and directories at exit.
 */
var tracking = false;
var track = function(value) {
  tracking = (value !== false);
  return module.exports; // chainable
};
var exitListenerAttached = false;
var filesToDelete = [];
var dirsToDelete = [];

function deleteFileOnExit(filePath) {
  if (!tracking) return false;
  attachExitListener();
  filesToDelete.push(filePath);
}

function deleteDirOnExit(dirPath) {
  if (!tracking) return false;
  attachExitListener();
  dirsToDelete.push(dirPath);
}

function attachExitListener() {
  if (!tracking) return false;
  if (!exitListenerAttached) {
    process.addListener('exit', cleanupSync);
    exitListenerAttached = true;
  }
}

function cleanupFilesSync() {
  if (!tracking) {
    return false;
  }
  var count = 0;
  var toDelete;
  while ((toDelete = filesToDelete.shift()) !== undefined) {
    rimrafSync(toDelete);
    count++;
  }
  return count;
}

function cleanupFiles(callback) {
  if (!tracking) {
    if (callback) {
      callback(new Error("not tracking"));
    }
    return;
  }
  var count = 0;
  var left = filesToDelete.length;
  if (!left) {
    if (callback) {
      callback(null, count);
    }
    return;
  }
  var toDelete;
  var rimrafCallback = function(err) {
    if (!left) {
      // Prevent processing if aborted
      return;
    }
    if (err) {
      // This shouldn't happen; pass error to callback and abort
      // processing
      if (callback) {
        callback(err);
      }
      left = 0;
      return;
    } else {
      count++;
    }
    left--;
    if (!left && callback) {
      callback(null, count);
    }
  };
  while ((toDelete = filesToDelete.shift()) !== undefined) {
    rimraf(toDelete, rimrafCallback);
  }
}

function cleanupDirsSync() {
  if (!tracking) {
    return false;
  }
  var count = 0;
  var toDelete;
  while ((toDelete = dirsToDelete.shift()) !== undefined) {
    rimrafSync(toDelete);
    count++;
  }
  return count;
}

function cleanupDirs(callback) {
  if (!tracking) {
    if (callback) {
      callback(new Error("not tracking"));
    }
    return;
  }
  var count = 0;
  var left = dirsToDelete.length;
  if (!left) {
    if (callback) {
      callback(null, count);
    }
    return;
  }
  var toDelete;
  var rimrafCallback = function (err) {
    if (!left) {
      // Prevent processing if aborted
      return;
    }
    if (err) {
      // rimraf handles most "normal" errors; pass the error to the
      // callback and abort processing
      if (callback) {
        callback(err, count);
      }
      left = 0;
      return;
    } else {
      count;
    }
    left--;
    if (!left && callback) {
      callback(null, count);
    }
  };
  while ((toDelete = dirsToDelete.shift()) !== undefined) {
    rimraf(toDelete, rimrafCallback);
  }
}

function cleanupSync() {
  if (!tracking) {
    return false;
  }
  var fileCount = cleanupFilesSync();
  var dirCount  = cleanupDirsSync();
  return {files: fileCount, dirs: dirCount};
}

function cleanup(callback) {
  if (!tracking) {
    if (callback) {
      callback(new Error("not tracking"));
    }
    return;
  }
  cleanupFiles(function(fileErr, fileCount) {
    if (fileErr) {
      if (callback) {
        callback(fileErr, {files: fileCount})
      }
    } else {
      cleanupDirs(function(dirErr, dirCount) {
        if (callback) {
          callback(dirErr, {files: fileCount, dirs: dirCount});
        }
      });
    }
  });
}

/* DIRECTORIES */

function mkdir(affixes, callback) {
  var dirPath = generateName(affixes, 'd-');
  fs.mkdir(dirPath, 0700, function(err) {
    if (!err) {
      deleteDirOnExit(dirPath);
    }
    if (callback) {
      callback(err, dirPath);
    }
  });
}

function mkdirSync(affixes) {
  var dirPath = generateName(affixes, 'd-');
  fs.mkdirSync(dirPath, 0700);
  deleteDirOnExit(dirPath);
  return dirPath;
}

/* FILES */

function open(affixes, callback) {
  var filePath = generateName(affixes, 'f-');
  fs.open(filePath, RDWR_EXCL, 0600, function(err, fd) {
    if (!err) {
      deleteFileOnExit(filePath);
    }
    if (callback) {
      callback(err, {path: filePath, fd: fd});
    }
  });
}

function openSync(affixes) {
  var filePath = generateName(affixes, 'f-');
  var fd = fs.openSync(filePath, RDWR_EXCL, 0600);
  deleteFileOnExit(filePath);
  return {path: filePath, fd: fd};
}

function createWriteStream(affixes) {
  var filePath = generateName(affixes, 's-');
  var stream = fs.createWriteStream(filePath, {flags: RDWR_EXCL, mode: 0600});
  deleteFileOnExit(filePath);
  return stream;
}

/* EXPORTS */
// Settings
exports.dir               = path.resolve(osTmpdir());
exports.track             = track;
// Functions
exports.mkdir             = mkdir;
exports.mkdirSync         = mkdirSync;
exports.open              = open;
exports.openSync          = openSync;
exports.path              = generateName;
exports.cleanup           = cleanup;
exports.cleanupSync       = cleanupSync;
exports.createWriteStream = createWriteStream;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = {"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"E2BIG":7,"EACCES":13,"EADDRINUSE":48,"EADDRNOTAVAIL":49,"EAFNOSUPPORT":47,"EAGAIN":35,"EALREADY":37,"EBADF":9,"EBADMSG":94,"EBUSY":16,"ECANCELED":89,"ECHILD":10,"ECONNABORTED":53,"ECONNREFUSED":61,"ECONNRESET":54,"EDEADLK":11,"EDESTADDRREQ":39,"EDOM":33,"EDQUOT":69,"EEXIST":17,"EFAULT":14,"EFBIG":27,"EHOSTUNREACH":65,"EIDRM":90,"EILSEQ":92,"EINPROGRESS":36,"EINTR":4,"EINVAL":22,"EIO":5,"EISCONN":56,"EISDIR":21,"ELOOP":62,"EMFILE":24,"EMLINK":31,"EMSGSIZE":40,"EMULTIHOP":95,"ENAMETOOLONG":63,"ENETDOWN":50,"ENETRESET":52,"ENETUNREACH":51,"ENFILE":23,"ENOBUFS":55,"ENODATA":96,"ENODEV":19,"ENOENT":2,"ENOEXEC":8,"ENOLCK":77,"ENOLINK":97,"ENOMEM":12,"ENOMSG":91,"ENOPROTOOPT":42,"ENOSPC":28,"ENOSR":98,"ENOSTR":99,"ENOSYS":78,"ENOTCONN":57,"ENOTDIR":20,"ENOTEMPTY":66,"ENOTSOCK":38,"ENOTSUP":45,"ENOTTY":25,"ENXIO":6,"EOPNOTSUPP":102,"EOVERFLOW":84,"EPERM":1,"EPIPE":32,"EPROTO":100,"EPROTONOSUPPORT":43,"EPROTOTYPE":41,"ERANGE":34,"EROFS":30,"ESPIPE":29,"ESRCH":3,"ESTALE":70,"ETIME":101,"ETIMEDOUT":60,"ETXTBSY":26,"EWOULDBLOCK":35,"EXDEV":18,"SIGHUP":1,"SIGINT":2,"SIGQUIT":3,"SIGILL":4,"SIGTRAP":5,"SIGABRT":6,"SIGIOT":6,"SIGBUS":10,"SIGFPE":8,"SIGKILL":9,"SIGUSR1":30,"SIGSEGV":11,"SIGUSR2":31,"SIGPIPE":13,"SIGALRM":14,"SIGTERM":15,"SIGCHLD":20,"SIGCONT":19,"SIGSTOP":17,"SIGTSTP":18,"SIGTTIN":21,"SIGTTOU":22,"SIGURG":16,"SIGXCPU":24,"SIGXFSZ":25,"SIGVTALRM":26,"SIGPROF":27,"SIGWINCH":28,"SIGIO":23,"SIGSYS":12,"SSL_OP_ALL":2147486719,"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION":262144,"SSL_OP_CIPHER_SERVER_PREFERENCE":4194304,"SSL_OP_CISCO_ANYCONNECT":32768,"SSL_OP_COOKIE_EXCHANGE":8192,"SSL_OP_CRYPTOPRO_TLSEXT_BUG":2147483648,"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS":2048,"SSL_OP_EPHEMERAL_RSA":0,"SSL_OP_LEGACY_SERVER_CONNECT":4,"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER":32,"SSL_OP_MICROSOFT_SESS_ID_BUG":1,"SSL_OP_MSIE_SSLV2_RSA_PADDING":0,"SSL_OP_NETSCAPE_CA_DN_BUG":536870912,"SSL_OP_NETSCAPE_CHALLENGE_BUG":2,"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG":1073741824,"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG":8,"SSL_OP_NO_COMPRESSION":131072,"SSL_OP_NO_QUERY_MTU":4096,"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION":65536,"SSL_OP_NO_SSLv2":16777216,"SSL_OP_NO_SSLv3":33554432,"SSL_OP_NO_TICKET":16384,"SSL_OP_NO_TLSv1":67108864,"SSL_OP_NO_TLSv1_1":268435456,"SSL_OP_NO_TLSv1_2":134217728,"SSL_OP_PKCS1_CHECK_1":0,"SSL_OP_PKCS1_CHECK_2":0,"SSL_OP_SINGLE_DH_USE":1048576,"SSL_OP_SINGLE_ECDH_USE":524288,"SSL_OP_SSLEAY_080_CLIENT_DH_BUG":128,"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG":0,"SSL_OP_TLS_BLOCK_PADDING_BUG":512,"SSL_OP_TLS_D5_BUG":256,"SSL_OP_TLS_ROLLBACK_BUG":8388608,"ENGINE_METHOD_DSA":2,"ENGINE_METHOD_DH":4,"ENGINE_METHOD_RAND":8,"ENGINE_METHOD_ECDH":16,"ENGINE_METHOD_ECDSA":32,"ENGINE_METHOD_CIPHERS":64,"ENGINE_METHOD_DIGESTS":128,"ENGINE_METHOD_STORE":256,"ENGINE_METHOD_PKEY_METHS":512,"ENGINE_METHOD_PKEY_ASN1_METHS":1024,"ENGINE_METHOD_ALL":65535,"ENGINE_METHOD_NONE":0,"DH_CHECK_P_NOT_SAFE_PRIME":2,"DH_CHECK_P_NOT_PRIME":1,"DH_UNABLE_TO_CHECK_GENERATOR":4,"DH_NOT_SUITABLE_GENERATOR":8,"NPN_ENABLED":1,"RSA_PKCS1_PADDING":1,"RSA_SSLV23_PADDING":2,"RSA_NO_PADDING":3,"RSA_PKCS1_OAEP_PADDING":4,"RSA_X931_PADDING":5,"RSA_PKCS1_PSS_PADDING":6,"POINT_CONVERSION_COMPRESSED":2,"POINT_CONVERSION_UNCOMPRESSED":4,"POINT_CONVERSION_HYBRID":6,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_UDP_REUSEADDR":4}

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {module.exports = rimraf
rimraf.sync = rimrafSync

var assert = __webpack_require__(105)
var path = __webpack_require__(25)
var fs = __webpack_require__(6)

// for EMFILE handling
var timeout = 0
exports.EMFILE_MAX = 1000
exports.BUSYTRIES_MAX = 3

var isWindows = (process.platform === "win32")

function defaults (options) {
  var methods = [
    'unlink',
    'chmod',
    'stat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(function(m) {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })
}

function rimraf (p, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  defaults(options)

  if (!cb) throw new Error("No callback passed to rimraf()")

  var busyTries = 0
  rimraf_(p, options, function CB (er) {
    if (er) {
      if (isWindows && (er.code === "EBUSY" || er.code === "ENOTEMPTY") &&
          busyTries < exports.BUSYTRIES_MAX) {
        busyTries ++
        var time = busyTries * 100
        // try again, with the same exact callback as this one.
        return setTimeout(function () {
          rimraf_(p, options, CB)
        }, time)
      }

      // this one won't happen if graceful-fs is used.
      if (er.code === "EMFILE" && timeout < exports.EMFILE_MAX) {
        return setTimeout(function () {
          rimraf_(p, options, CB)
        }, timeout ++)
      }

      // already gone
      if (er.code === "ENOENT") er = null
    }

    timeout = 0
    cb(er)
  })
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.unlink(p, function (er) {
    if (er) {
      if (er.code === "ENOENT")
        return cb(null)
      if (er.code === "EPERM")
        return (isWindows)
          ? fixWinEPERM(p, options, er, cb)
          : rmdir(p, options, er, cb)
      if (er.code === "EISDIR")
        return rmdir(p, options, er, cb)
    }
    return cb(er)
  })
}

function fixWinEPERM (p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')
  if (er)
    assert(er instanceof Error)

  options.chmod(p, 666, function (er2) {
    if (er2)
      cb(er2.code === "ENOENT" ? null : er)
    else
      options.stat(p, function(er3, stats) {
        if (er3)
          cb(er3.code === "ENOENT" ? null : er)
        else if (stats.isDirectory())
          rmdir(p, options, er, cb)
        else
          options.unlink(p, cb)
      })
  })
}

function fixWinEPERMSync (p, options, er) {
  assert(p)
  assert(options)
  if (er)
    assert(er instanceof Error)

  try {
    options.chmodSync(p, 666)
  } catch (er2) {
    if (er2.code === "ENOENT")
      return
    else
      throw er
  }

  try {
    var stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === "ENOENT")
      return
    else
      throw er
  }

  if (stats.isDirectory())
    rmdirSync(p, options, er)
  else
    options.unlinkSync(p)
}

function rmdir (p, options, originalEr, cb) {
  assert(p)
  assert(options)
  if (originalEr)
    assert(originalEr instanceof Error)
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, function (er) {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
      rmkids(p, options, cb)
    else if (er && er.code === "ENOTDIR")
      cb(originalEr)
    else
      cb(er)
  })
}

function rmkids(p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, function (er, files) {
    if (er)
      return cb(er)
    var n = files.length
    if (n === 0)
      return options.rmdir(p, cb)
    var errState
    files.forEach(function (f) {
      rimraf(path.join(p, f), options, function (er) {
        if (errState)
          return
        if (er)
          return cb(errState = er)
        if (--n === 0)
          options.rmdir(p, cb)
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  options = options || {}
  defaults(options)

  assert(p)
  assert(options)

  try {
    options.unlinkSync(p)
  } catch (er) {
    if (er.code === "ENOENT")
      return
    if (er.code === "EPERM")
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    if (er.code !== "EISDIR")
      throw er
    rmdirSync(p, options, er)
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p)
  assert(options)
  if (originalEr)
    assert(originalEr instanceof Error)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === "ENOENT")
      return
    if (er.code === "ENOTDIR")
      throw originalEr
    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
      rmkidsSync(p, options)
  }
}

function rmkidsSync (p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(function (f) {
    rimrafSync(path.join(p, f), options)
  })
  options.rmdirSync(p, options)
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(16);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
var isWindows = process.platform === 'win32';
var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;

// https://github.com/nodejs/node/blob/3e7a14381497a3b73dda68d05b5130563cdab420/lib/os.js#L25-L43
module.exports = function () {
	var path;

	if (isWindows) {
		path = process.env.TEMP ||
			process.env.TMP ||
			(process.env.SystemRoot || process.env.windir) + '\\temp';
	} else {
		path = process.env.TMPDIR ||
			process.env.TMP ||
			process.env.TEMP ||
			'/tmp';
	}

	if (trailingSlashRe.test(path)) {
		path = path.slice(0, -1);
	}

	return path;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function() {
  var Base, DirectClient, DirectRuntime, EventEmitter, isBrowser,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isBrowser = function() {
    return !(typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1);
  };

  Base = __webpack_require__(24);

  EventEmitter = __webpack_require__(2).EventEmitter;

  DirectRuntime = (function(superClass) {
    extend(DirectRuntime, superClass);

    function DirectRuntime(options) {
      DirectRuntime.__super__.constructor.call(this, options);
      this.clients = [];
    }

    DirectRuntime.prototype._connect = function(client) {
      this.clients.push(client);
      return client.on('send', (function(_this) {
        return function(msg) {
          return _this._receive(msg, {
            client: client
          });
        };
      })(this));
    };

    DirectRuntime.prototype._disconnect = function(client) {
      if (this.clients.indexOf(client) === -1) {
        return;
      }
      this.clients.splice(this.clients.indexOf(client), 1);
      return client.removeAllListeners('send');
    };

    DirectRuntime.prototype._receive = function(msg, context) {
      return this.receive(msg.protocol, msg.command, msg.payload, context);
    };

    DirectRuntime.prototype.send = function(protocol, topic, payload, context) {
      var m;
      if (!context.client) {
        return;
      }
      m = {
        protocol: protocol,
        command: topic,
        payload: payload
      };
      return context.client._receive(m);
    };

    DirectRuntime.prototype.sendAll = function(protocol, topic, payload) {
      var client, i, len, m, ref, results;
      m = {
        protocol: protocol,
        command: topic,
        payload: payload
      };
      ref = this.clients;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        client = ref[i];
        results.push(client._receive(m));
      }
      return results;
    };

    return DirectRuntime;

  })(Base);

  DirectClient = (function(superClass) {
    extend(DirectClient, superClass);

    function DirectClient(runtime, name) {
      this.name = name;
      DirectClient.__super__.constructor.call(this);
      this.runtime = runtime;
      if (!this.name) {
        this.name = 'Unnamed client';
      }
    }

    DirectClient.prototype.connect = function() {
      return this.runtime._connect(this);
    };

    DirectClient.prototype.disconnect = function() {
      return this.runtime._disconnect(this);
    };

    DirectClient.prototype.send = function(protocol, topic, payload) {
      var m;
      m = {
        protocol: protocol,
        command: topic,
        payload: payload
      };
      return this.emit('send', m);
    };

    DirectClient.prototype._receive = function(message) {
      return setTimeout((function(_this) {
        return function() {
          return _this.emit('message', message);
        };
      })(this), 1);
    };

    return DirectClient;

  })(EventEmitter);

  exports.Client = DirectClient;

  exports.Runtime = DirectRuntime;

}).call(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

(function (context) {
  var PostMessage = __webpack_require__(23);

  var OpenerRuntime = function (options, button) {
    PostMessage.call(this, options);
    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.openClient(button.getAttribute('href'));
      }.bind(this));
    }
  };
  OpenerRuntime.prototype = new PostMessage;

  OpenerRuntime.prototype.openClient = function (url) {
    var client = window.open(url, '_blank');
    if (!client) {
      throw new Error("Unable to open client window");
    }
    this.context = {
      href: '*'
    };
    var handleMessage = function (message) {
      var data;
      if (typeof message.data === 'string') {
        data = JSON.parse(message.data);
      } else {
        data = message.data;
      }

      if (!data.protocol || !data.command) {
        return;
      }
      this.receive(data.protocol, data.command, data.payload, this.context);
    }.bind(this);
    var closeCheck = setInterval(function () {
      if (!client || client.closed) {
        // Client window was closed
        this.setClient(null);
        window.removeEventListener('message', handleMessage);
        clearInterval(closeCheck);
      }
    }.bind(this), 1000);

    // Register client window and subscribe to messages
    this.setClient(client);
    window.addEventListener('message', handleMessage);
  };

  module.exports = function (options, button) {
    options = PostMessage.normalizeOptions(options);
    var runtime = new OpenerRuntime(options, button);
    return runtime;
  };
})(window);



/***/ })
/******/ ]);