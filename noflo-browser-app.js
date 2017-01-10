/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var exported = {
	  'noflo': __webpack_require__(1),
	'noflo-runtime-webrtc': __webpack_require__(78),
	'noflo-runtime-iframe': __webpack_require__(101)
	};

	if (window) {
	  window.require = function (moduleName) {
	    if (exported[moduleName]) {
	      return exported[moduleName];
	    }
	    throw new Error('Module ' + moduleName + ' not available');
	  };
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var ports;

	  exports.graph = __webpack_require__(2);

	  exports.Graph = exports.graph.Graph;

	  exports.journal = __webpack_require__(10);

	  exports.Journal = exports.journal.Journal;

	  exports.Network = __webpack_require__(11).Network;

	  exports.isBrowser = __webpack_require__(5).isBrowser;

	  exports.ComponentLoader = __webpack_require__(15).ComponentLoader;

	  exports.Component = __webpack_require__(68).Component;

	  exports.AsyncComponent = __webpack_require__(73).AsyncComponent;

	  exports.helpers = __webpack_require__(75);

	  exports.streams = __webpack_require__(76);

	  ports = __webpack_require__(69);

	  exports.InPorts = ports.InPorts;

	  exports.OutPorts = ports.OutPorts;

	  exports.InPort = __webpack_require__(70);

	  exports.OutPort = __webpack_require__(72);

	  exports.Port = __webpack_require__(74).Port;

	  exports.ArrayPort = __webpack_require__(77).ArrayPort;

	  exports.internalSocket = __webpack_require__(13);

	  exports.IP = __webpack_require__(14);

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
	    return exports.graph.save(file, function() {
	      return callback(file);
	    });
	  };

	}).call(this);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var EventEmitter, Graph, clone, mergeResolveTheirsNaive, platform, resetGraph,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  clone = __webpack_require__(4).clone;

	  platform = __webpack_require__(5);

	  Graph = (function(_super) {
	    __extends(Graph, _super);

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

	    function Graph(name, options) {
	      this.name = name != null ? name : '';
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
	      var exported, found, idx, _i, _len, _ref;
	      publicPort = this.getPortName(publicPort);
	      found = null;
	      _ref = this.exports;
	      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
	        exported = _ref[idx];
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
	      var group, _i, _len, _ref;
	      this.checkTransactionStart();
	      _ref = this.groups;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        group = _ref[_i];
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
	      var group, _i, _len, _ref;
	      this.checkTransactionStart();
	      _ref = this.groups;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        group = _ref[_i];
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
	      var before, group, item, val, _i, _len, _ref;
	      this.checkTransactionStart();
	      _ref = this.groups;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        group = _ref[_i];
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
	      var edge, exported, group, index, initializer, node, priv, pub, toRemove, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _m, _n, _o, _p, _q, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
	      node = this.getNode(id);
	      if (!node) {
	        return;
	      }
	      this.checkTransactionStart();
	      toRemove = [];
	      _ref = this.edges;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        edge = _ref[_i];
	        if ((edge.from.node === node.id) || (edge.to.node === node.id)) {
	          toRemove.push(edge);
	        }
	      }
	      for (_j = 0, _len1 = toRemove.length; _j < _len1; _j++) {
	        edge = toRemove[_j];
	        this.removeEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port);
	      }
	      toRemove = [];
	      _ref1 = this.initializers;
	      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
	        initializer = _ref1[_k];
	        if (initializer.to.node === node.id) {
	          toRemove.push(initializer);
	        }
	      }
	      for (_l = 0, _len3 = toRemove.length; _l < _len3; _l++) {
	        initializer = toRemove[_l];
	        this.removeInitial(initializer.to.node, initializer.to.port);
	      }
	      toRemove = [];
	      _ref2 = this.exports;
	      for (_m = 0, _len4 = _ref2.length; _m < _len4; _m++) {
	        exported = _ref2[_m];
	        if (this.getPortName(id) === exported.process) {
	          toRemove.push(exported);
	        }
	      }
	      for (_n = 0, _len5 = toRemove.length; _n < _len5; _n++) {
	        exported = toRemove[_n];
	        this.removeExport(exported["public"]);
	      }
	      toRemove = [];
	      _ref3 = this.inports;
	      for (pub in _ref3) {
	        priv = _ref3[pub];
	        if (priv.process === id) {
	          toRemove.push(pub);
	        }
	      }
	      for (_o = 0, _len6 = toRemove.length; _o < _len6; _o++) {
	        pub = toRemove[_o];
	        this.removeInport(pub);
	      }
	      toRemove = [];
	      _ref4 = this.outports;
	      for (pub in _ref4) {
	        priv = _ref4[pub];
	        if (priv.process === id) {
	          toRemove.push(pub);
	        }
	      }
	      for (_p = 0, _len7 = toRemove.length; _p < _len7; _p++) {
	        pub = toRemove[_p];
	        this.removeOutport(pub);
	      }
	      _ref5 = this.groups;
	      for (_q = 0, _len8 = _ref5.length; _q < _len8; _q++) {
	        group = _ref5[_q];
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
	      var node, _i, _len, _ref;
	      _ref = this.nodes;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        node = _ref[_i];
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
	      var edge, exported, group, iip, index, node, priv, pub, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
	      this.checkTransactionStart();
	      node = this.getNode(oldId);
	      if (!node) {
	        return;
	      }
	      node.id = newId;
	      _ref = this.edges;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        edge = _ref[_i];
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
	      _ref1 = this.initializers;
	      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	        iip = _ref1[_j];
	        if (!iip) {
	          continue;
	        }
	        if (iip.to.node === oldId) {
	          iip.to.node = newId;
	        }
	      }
	      _ref2 = this.inports;
	      for (pub in _ref2) {
	        priv = _ref2[pub];
	        if (priv.process === oldId) {
	          priv.process = newId;
	        }
	      }
	      _ref3 = this.outports;
	      for (pub in _ref3) {
	        priv = _ref3[pub];
	        if (priv.process === oldId) {
	          priv.process = newId;
	        }
	      }
	      _ref4 = this.exports;
	      for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
	        exported = _ref4[_k];
	        if (exported.process === oldId) {
	          exported.process = newId;
	        }
	      }
	      _ref5 = this.groups;
	      for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
	        group = _ref5[_l];
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
	      var edge, _i, _len, _ref;
	      if (metadata == null) {
	        metadata = {};
	      }
	      outPort = this.getPortName(outPort);
	      inPort = this.getPortName(inPort);
	      _ref = this.edges;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        edge = _ref[_i];
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
	      var edge, index, toKeep, toRemove, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
	      this.checkTransactionStart();
	      port = this.getPortName(port);
	      port2 = this.getPortName(port2);
	      toRemove = [];
	      toKeep = [];
	      if (node2 && port2) {
	        _ref = this.edges;
	        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
	          edge = _ref[index];
	          if (edge.from.node === node && edge.from.port === port && edge.to.node === node2 && edge.to.port === port2) {
	            this.setEdgeMetadata(edge.from.node, edge.from.port, edge.to.node, edge.to.port, {});
	            toRemove.push(edge);
	          } else {
	            toKeep.push(edge);
	          }
	        }
	      } else {
	        _ref1 = this.edges;
	        for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
	          edge = _ref1[index];
	          if ((edge.from.node === node && edge.from.port === port) || (edge.to.node === node && edge.to.port === port)) {
	            this.setEdgeMetadata(edge.from.node, edge.from.port, edge.to.node, edge.to.port, {});
	            toRemove.push(edge);
	          } else {
	            toKeep.push(edge);
	          }
	        }
	      }
	      this.edges = toKeep;
	      for (_k = 0, _len2 = toRemove.length; _k < _len2; _k++) {
	        edge = toRemove[_k];
	        this.emit('removeEdge', edge);
	      }
	      return this.checkTransactionEnd();
	    };

	    Graph.prototype.getEdge = function(node, port, node2, port2) {
	      var edge, index, _i, _len, _ref;
	      port = this.getPortName(port);
	      port2 = this.getPortName(port2);
	      _ref = this.edges;
	      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
	        edge = _ref[index];
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
	      var edge, index, toKeep, toRemove, _i, _j, _len, _len1, _ref;
	      port = this.getPortName(port);
	      this.checkTransactionStart();
	      toRemove = [];
	      toKeep = [];
	      _ref = this.initializers;
	      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
	        edge = _ref[index];
	        if (edge.to.node === node && edge.to.port === port) {
	          toRemove.push(edge);
	        } else {
	          toKeep.push(edge);
	        }
	      }
	      this.initializers = toKeep;
	      for (_j = 0, _len1 = toRemove.length; _j < _len1; _j++) {
	        edge = toRemove[_j];
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
	      var cleanID, cleanPort, data, dot, edge, id, initializer, node, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
	      cleanID = function(id) {
	        return id.replace(/\s*/g, "");
	      };
	      cleanPort = function(port) {
	        return port.replace(/\./g, "");
	      };
	      dot = "digraph {\n";
	      _ref = this.nodes;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        node = _ref[_i];
	        dot += "    " + (cleanID(node.id)) + " [label=" + node.id + " shape=box]\n";
	      }
	      _ref1 = this.initializers;
	      for (id = _j = 0, _len1 = _ref1.length; _j < _len1; id = ++_j) {
	        initializer = _ref1[id];
	        if (typeof initializer.from.data === 'function') {
	          data = 'Function';
	        } else {
	          data = initializer.from.data;
	        }
	        dot += "    data" + id + " [label=\"'" + data + "'\" shape=plaintext]\n";
	        dot += "    data" + id + " -> " + (cleanID(initializer.to.node)) + "[headlabel=" + (cleanPort(initializer.to.port)) + " labelfontcolor=blue labelfontsize=8.0]\n";
	      }
	      _ref2 = this.edges;
	      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
	        edge = _ref2[_k];
	        dot += "    " + (cleanID(edge.from.node)) + " -> " + (cleanID(edge.to.node)) + "[taillabel=" + (cleanPort(edge.from.port)) + " headlabel=" + (cleanPort(edge.to.port)) + " labelfontcolor=blue labelfontsize=8.0]\n";
	      }
	      dot += "}";
	      return dot;
	    };

	    Graph.prototype.toYUML = function() {
	      var edge, initializer, yuml, _i, _j, _len, _len1, _ref, _ref1;
	      yuml = [];
	      _ref = this.initializers;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        initializer = _ref[_i];
	        yuml.push("(start)[" + initializer.to.port + "]->(" + initializer.to.node + ")");
	      }
	      _ref1 = this.edges;
	      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	        edge = _ref1[_j];
	        yuml.push("(" + edge.from.node + ")[" + edge.from.port + "]->(" + edge.to.node + ")");
	      }
	      return yuml.join(",");
	    };

	    Graph.prototype.toJSON = function() {
	      var connection, edge, exported, group, groupData, initializer, json, node, priv, property, pub, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
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
	      _ref = this.properties;
	      for (property in _ref) {
	        value = _ref[property];
	        json.properties[property] = value;
	      }
	      _ref1 = this.inports;
	      for (pub in _ref1) {
	        priv = _ref1[pub];
	        json.inports[pub] = priv;
	      }
	      _ref2 = this.outports;
	      for (pub in _ref2) {
	        priv = _ref2[pub];
	        json.outports[pub] = priv;
	      }
	      _ref3 = this.exports;
	      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
	        exported = _ref3[_i];
	        if (!json.exports) {
	          json.exports = [];
	        }
	        json.exports.push(exported);
	      }
	      _ref4 = this.groups;
	      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
	        group = _ref4[_j];
	        groupData = {
	          name: group.name,
	          nodes: group.nodes
	        };
	        if (Object.keys(group.metadata).length) {
	          groupData.metadata = group.metadata;
	        }
	        json.groups.push(groupData);
	      }
	      _ref5 = this.nodes;
	      for (_k = 0, _len2 = _ref5.length; _k < _len2; _k++) {
	        node = _ref5[_k];
	        json.processes[node.id] = {
	          component: node.component
	        };
	        if (node.metadata) {
	          json.processes[node.id].metadata = node.metadata;
	        }
	      }
	      _ref6 = this.edges;
	      for (_l = 0, _len3 = _ref6.length; _l < _len3; _l++) {
	        edge = _ref6[_l];
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
	      _ref7 = this.initializers;
	      for (_m = 0, _len4 = _ref7.length; _m < _len4; _m++) {
	        initializer = _ref7[_m];
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
	      return __webpack_require__(7).writeFile("" + file + ".json", json, "utf-8", function(err, data) {
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
	    var caseSensitive, conn, def, exported, graph, group, id, portId, priv, processId, properties, property, pub, split, value, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
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
	    _ref = definition.properties;
	    for (property in _ref) {
	      value = _ref[property];
	      if (property === 'name') {
	        continue;
	      }
	      properties[property] = value;
	    }
	    graph.setProperties(properties);
	    _ref1 = definition.processes;
	    for (id in _ref1) {
	      def = _ref1[id];
	      if (!def.metadata) {
	        def.metadata = {};
	      }
	      graph.addNode(id, def.component, def.metadata);
	    }
	    _ref2 = definition.connections;
	    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
	      conn = _ref2[_i];
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
	      _ref3 = definition.exports;
	      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
	        exported = _ref3[_j];
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
	      _ref4 = definition.inports;
	      for (pub in _ref4) {
	        priv = _ref4[pub];
	        graph.addInport(pub, priv.process, graph.getPortName(priv.port), priv.metadata);
	      }
	    }
	    if (definition.outports) {
	      _ref5 = definition.outports;
	      for (pub in _ref5) {
	        priv = _ref5[pub];
	        graph.addOutport(pub, priv.process, graph.getPortName(priv.port), priv.metadata);
	      }
	    }
	    if (definition.groups) {
	      _ref6 = definition.groups;
	      for (_k = 0, _len2 = _ref6.length; _k < _len2; _k++) {
	        group = _ref6[_k];
	        graph.addGroup(group.name, group.nodes, group.metadata || {});
	      }
	    }
	    graph.endTransaction('loadJSON');
	    return callback(null, graph);
	  };

	  exports.loadFBP = function(fbpData, callback, metadata, caseSensitive) {
	    var definition, e;
	    if (metadata == null) {
	      metadata = {};
	    }
	    if (caseSensitive == null) {
	      caseSensitive = false;
	    }
	    try {
	      definition = __webpack_require__(8).parse(fbpData, {
	        caseSensitive: caseSensitive
	      });
	    } catch (_error) {
	      e = _error;
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
	    return __webpack_require__(7).readFile(file, "utf-8", function(err, data) {
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
	    var edge, exp, group, iip, node, port, v, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
	    _ref = (clone(graph.groups)).reverse();
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      group = _ref[_i];
	      if (group != null) {
	        graph.removeGroup(group.name);
	      }
	    }
	    _ref1 = clone(graph.outports);
	    for (port in _ref1) {
	      v = _ref1[port];
	      graph.removeOutport(port);
	    }
	    _ref2 = clone(graph.inports);
	    for (port in _ref2) {
	      v = _ref2[port];
	      graph.removeInport(port);
	    }
	    _ref3 = clone(graph.exports.reverse());
	    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
	      exp = _ref3[_j];
	      graph.removeExport(exp["public"]);
	    }
	    graph.setProperties({});
	    _ref4 = (clone(graph.initializers)).reverse();
	    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
	      iip = _ref4[_k];
	      graph.removeInitial(iip.to.node, iip.to.port);
	    }
	    _ref5 = (clone(graph.edges)).reverse();
	    for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
	      edge = _ref5[_l];
	      graph.removeEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port);
	    }
	    _ref6 = (clone(graph.nodes)).reverse();
	    _results = [];
	    for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
	      node = _ref6[_m];
	      _results.push(graph.removeNode(node.id));
	    }
	    return _results;
	  };

	  mergeResolveTheirsNaive = function(base, to) {
	    var edge, exp, group, iip, node, priv, pub, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
	    resetGraph(base);
	    _ref = to.nodes;
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      node = _ref[_i];
	      base.addNode(node.id, node.component, node.metadata);
	    }
	    _ref1 = to.edges;
	    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	      edge = _ref1[_j];
	      base.addEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port, edge.metadata);
	    }
	    _ref2 = to.initializers;
	    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
	      iip = _ref2[_k];
	      base.addInitial(iip.from.data, iip.to.node, iip.to.port, iip.metadata);
	    }
	    _ref3 = to.exports;
	    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
	      exp = _ref3[_l];
	      base.addExport(exp["public"], exp.node, exp.port, exp.metadata);
	    }
	    base.setProperties(to.properties);
	    _ref4 = to.inports;
	    for (pub in _ref4) {
	      priv = _ref4[pub];
	      base.addInport(pub, priv.process, priv.port, priv.metadata);
	    }
	    _ref5 = to.outports;
	    for (pub in _ref5) {
	      priv = _ref5[pub];
	      base.addOutport(pub, priv.process, priv.port, priv.metadata);
	    }
	    _ref6 = to.groups;
	    _results = [];
	    for (_m = 0, _len4 = _ref6.length; _m < _len4; _m++) {
	      group = _ref6[_m];
	      _results.push(base.addGroup(group.name, group.nodes, group.metadata));
	    }
	    return _results;
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	(function() {
	  var clone, guessLanguageFromFilename;

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

	  exports.clone = clone;

	  exports.guessLanguageFromFilename = guessLanguageFromFilename;

	}).call(this);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  exports.isBrowser = function() {
	    if (typeof process !== 'undefined' && process.execPath && process.execPath.match(/node|iojs/)) {
	      return false;
	    }
	    return true;
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

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

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports) {

	

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

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
	          var schema = __webpack_require__(9);
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

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = {
		"$schema": "http://json-schema.org/draft-04/schema",
		"id": "graph.json",
		"title": "FBP graph",
		"description": "A graph of FBP processes and connections between them.\nThis is the primary way of specifying FBP programs.\n",
		"name": "graph",
		"type": "object",
		"additionalProperties": false,
		"properties": {
			"properties": {
				"type": "object",
				"description": "User-defined properties attached to the graph.",
				"additionalProperties": true,
				"properties": {
					"name": {
						"type": "string"
					}
				}
			},
			"inports": {
				"type": [
					"object",
					"undefined"
				],
				"description": "Exported inports of the graph",
				"additionalProperties": true,
				"patternProperties": {
					"[a-z0-9]+": {
						"type": "object",
						"properties": {
							"process": {
								"type": "string"
							},
							"port": {
								"type": "string"
							},
							"metadata": {
								"type": "object",
								"additionalProperties": true
							}
						}
					}
				}
			},
			"outports": {
				"type": [
					"object",
					"undefined"
				],
				"description": "Exported outports of the graph",
				"additionalProperties": true,
				"patternProperties": {
					"[a-z0-9]+": {
						"type": "object",
						"properties": {
							"process": {
								"type": "string"
							},
							"port": {
								"type": "string"
							},
							"metadata": {
								"type": "object",
								"additionalProperties": true
							}
						}
					}
				}
			},
			"exports": {
				"type": [
					"array",
					"undefined"
				],
				"description": "Deprecated, use inports and outports instead"
			},
			"groups": {
				"type": "array",
				"description": "List of groups of processes",
				"items": {
					"type": "object",
					"additionalProperties": false,
					"properties": {
						"name": {
							"type": "string"
						},
						"nodes": {
							"type": "array",
							"items": {
								"type": "string"
							}
						},
						"metadata": {
							"additionalProperties": true
						}
					}
				}
			},
			"processes": {
				"type": "object",
				"description": "The processes of this graph.\nEach process is an instance of a component.\n",
				"additionalProperties": false,
				"patternProperties": {
					"[a-zA-Z0-9_]+": {
						"type": "object",
						"properties": {
							"component": {
								"type": "string"
							},
							"metadata": {
								"type": "object",
								"additionalProperties": true
							}
						}
					}
				}
			},
			"connections": {
				"type": "array",
				"description": "Connections of the graph.\nA connection either connects ports of two processes, or specifices an IIP as initial input packet to a port.\n",
				"items": {
					"type": "object",
					"additionalProperties": false,
					"properties": {
						"src": {
							"type": "object",
							"additionalProperties": false,
							"properties": {
								"process": {
									"type": "string"
								},
								"port": {
									"type": "string"
								},
								"index": {
									"type": "integer"
								}
							}
						},
						"tgt": {
							"type": "object",
							"additionalProperties": false,
							"properties": {
								"process": {
									"type": "string"
								},
								"port": {
									"type": "string"
								},
								"index": {
									"type": "integer"
								}
							}
						},
						"data": {},
						"metadata": {
							"type": "object",
							"additionalProperties": true
						}
					}
				}
			}
		}
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var EventEmitter, Journal, JournalStore, MemoryJournalStore, calculateMeta, clone, entryToPrettyString,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  clone = __webpack_require__(4).clone;

	  entryToPrettyString = function(entry) {
	    var a;
	    a = entry.args;
	    switch (entry.cmd) {
	      case 'addNode':
	        return "" + a.id + "(" + a.component + ")";
	      case 'removeNode':
	        return "DEL " + a.id + "(" + a.component + ")";
	      case 'renameNode':
	        return "RENAME " + a.oldId + " " + a.newId;
	      case 'changeNode':
	        return "META " + a.id;
	      case 'addEdge':
	        return "" + a.from.node + " " + a.from.port + " -> " + a.to.port + " " + a.to.node;
	      case 'removeEdge':
	        return "" + a.from.node + " " + a.from.port + " -X> " + a.to.port + " " + a.to.node;
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

	  JournalStore = (function(_super) {
	    __extends(JournalStore, _super);

	    JournalStore.prototype.lastRevision = 0;

	    function JournalStore(graph) {
	      this.graph = graph;
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

	  MemoryJournalStore = (function(_super) {
	    __extends(MemoryJournalStore, _super);

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

	  Journal = (function(_super) {
	    __extends(Journal, _super);

	    Journal.prototype.graph = null;

	    Journal.prototype.entries = [];

	    Journal.prototype.subscribed = true;

	    function Journal(graph, metadata, store) {
	      this.endTransaction = __bind(this.endTransaction, this);
	      this.startTransaction = __bind(this.startTransaction, this);
	      var edge, group, iip, k, node, v, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
	      this.graph = graph;
	      this.entries = [];
	      this.subscribed = true;
	      this.store = store || new MemoryJournalStore(this.graph);
	      if (this.store.transactions.length === 0) {
	        this.currentRevision = -1;
	        this.startTransaction('initial', metadata);
	        _ref = this.graph.nodes;
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          node = _ref[_i];
	          this.appendCommand('addNode', node);
	        }
	        _ref1 = this.graph.edges;
	        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	          edge = _ref1[_j];
	          this.appendCommand('addEdge', edge);
	        }
	        _ref2 = this.graph.initializers;
	        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
	          iip = _ref2[_k];
	          this.appendCommand('addInitial', iip);
	        }
	        if (Object.keys(this.graph.properties).length > 0) {
	          this.appendCommand('changeProperties', this.graph.properties, {});
	        }
	        _ref3 = this.graph.inports;
	        for (k in _ref3) {
	          v = _ref3[k];
	          this.appendCommand('addInport', {
	            name: k,
	            port: v
	          });
	        }
	        _ref4 = this.graph.outports;
	        for (k in _ref4) {
	          v = _ref4[k];
	          this.appendCommand('addOutport', {
	            name: k,
	            port: v
	          });
	        }
	        _ref5 = this.graph.groups;
	        for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
	          group = _ref5[_l];
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
	      var entries, entry, i, r, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3, _ref4;
	      if (revId === this.currentRevision) {
	        return;
	      }
	      this.subscribed = false;
	      if (revId > this.currentRevision) {
	        for (r = _i = _ref = this.currentRevision + 1; _ref <= revId ? _i <= revId : _i >= revId; r = _ref <= revId ? ++_i : --_i) {
	          _ref1 = this.store.fetchTransaction(r);
	          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
	            entry = _ref1[_j];
	            this.executeEntry(entry);
	          }
	        }
	      } else {
	        for (r = _k = _ref2 = this.currentRevision, _ref3 = revId + 1; _k >= _ref3; r = _k += -1) {
	          entries = this.store.fetchTransaction(r);
	          for (i = _l = _ref4 = entries.length - 1; _l >= 0; i = _l += -1) {
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
	      var e, entry, lines, r, _i, _j, _len;
	      startRev |= 0;
	      endRev |= this.store.lastRevision;
	      lines = [];
	      for (r = _i = startRev; startRev <= endRev ? _i < endRev : _i > endRev; r = startRev <= endRev ? ++_i : --_i) {
	        e = this.store.fetchTransaction(r);
	        for (_j = 0, _len = e.length; _j < _len; _j++) {
	          entry = e[_j];
	          lines.push(entryToPrettyString(entry));
	        }
	      }
	      return lines.join('\n');
	    };

	    Journal.prototype.toJSON = function(startRev, endRev) {
	      var entries, entry, r, _i, _j, _len, _ref;
	      startRev |= 0;
	      endRev |= this.store.lastRevision;
	      entries = [];
	      for (r = _i = startRev; _i < endRev; r = _i += 1) {
	        _ref = this.store.fetchTransaction(r);
	        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
	          entry = _ref[_j];
	          entries.push(entryToPrettyString(entry));
	        }
	      }
	      return entries;
	    };

	    Journal.prototype.save = function(file, success) {
	      var json;
	      json = JSON.stringify(this.toJSON(), null, 4);
	      return __webpack_require__(7).writeFile("" + file + ".json", json, "utf-8", function(err, data) {
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var EventEmitter, Network, componentLoader, graph, internalSocket, platform, _,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  _ = __webpack_require__(12);

	  internalSocket = __webpack_require__(13);

	  graph = __webpack_require__(2);

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  platform = __webpack_require__(5);

	  componentLoader = __webpack_require__(15);

	  Network = (function(_super) {
	    __extends(Network, _super);

	    Network.prototype.processes = {};

	    Network.prototype.connections = [];

	    Network.prototype.initials = [];

	    Network.prototype.defaults = [];

	    Network.prototype.graph = null;

	    Network.prototype.startupDate = null;

	    Network.prototype.portBuffer = {};

	    function Network(graph, options) {
	      this.options = options != null ? options : {};
	      this.processes = {};
	      this.connections = [];
	      this.initials = [];
	      this.nextInitials = [];
	      this.defaults = [];
	      this.graph = graph;
	      this.started = false;
	      this.debug = true;
	      this.connectionCount = 0;
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

	    Network.prototype.increaseConnections = function() {
	      if (this.connectionCount === 0) {
	        this.setStarted(true);
	      }
	      return this.connectionCount++;
	    };

	    Network.prototype.decreaseConnections = function() {
	      this.connectionCount--;
	      if (this.connectionCount) {
	        return;
	      }
	      if (!this.debouncedEnd) {
	        this.debouncedEnd = _.debounce((function(_this) {
	          return function() {
	            if (_this.connectionCount) {
	              return;
	            }
	            return _this.setStarted(false);
	          };
	        })(this), 50);
	      }
	      return this.debouncedEnd();
	    };

	    Network.prototype.load = function(component, metadata, callback) {
	      return this.loader.load(component, callback, metadata);
	    };

	    Network.prototype.addNode = function(node, callback) {
	      var process;
	      if (this.processes[node.id]) {
	        if (callback) {
	          callback(null, this.processes[node.id]);
	        }
	        return;
	      }
	      process = {
	        id: node.id
	      };
	      if (!node.component) {
	        this.processes[process.id] = process;
	        if (callback) {
	          callback(null, process);
	        }
	        return;
	      }
	      return this.load(node.component, node.metadata, (function(_this) {
	        return function(err, instance) {
	          var name, port, _ref, _ref1;
	          if (err) {
	            return callback(err);
	          }
	          instance.nodeId = node.id;
	          process.component = instance;
	          _ref = process.component.inPorts;
	          for (name in _ref) {
	            port = _ref[name];
	            if (!port || typeof port === 'function' || !port.canAttach) {
	              continue;
	            }
	            port.node = node.id;
	            port.nodeInstance = instance;
	            port.name = name;
	          }
	          _ref1 = process.component.outPorts;
	          for (name in _ref1) {
	            port = _ref1[name];
	            if (!port || typeof port === 'function' || !port.canAttach) {
	              continue;
	            }
	            port.node = node.id;
	            port.nodeInstance = instance;
	            port.name = name;
	          }
	          if (instance.isSubgraph()) {
	            _this.subscribeSubgraph(process);
	          }
	          _this.subscribeNode(process);
	          _this.processes[process.id] = process;
	          if (callback) {
	            return callback(null, process);
	          }
	        };
	      })(this));
	    };

	    Network.prototype.removeNode = function(node, callback) {
	      if (!this.processes[node.id]) {
	        return callback(new Error("Node " + node.id + " not found"));
	      }
	      this.processes[node.id].component.shutdown();
	      delete this.processes[node.id];
	      if (callback) {
	        return callback(null);
	      }
	    };

	    Network.prototype.renameNode = function(oldId, newId, callback) {
	      var name, port, process, _ref, _ref1;
	      process = this.getNode(oldId);
	      if (!process) {
	        return callback(new Error("Process " + oldId + " not found"));
	      }
	      process.id = newId;
	      _ref = process.component.inPorts;
	      for (name in _ref) {
	        port = _ref[name];
	        port.node = newId;
	      }
	      _ref1 = process.component.outPorts;
	      for (name in _ref1) {
	        port = _ref1[name];
	        port.node = newId;
	      }
	      this.processes[newId] = process;
	      delete this.processes[oldId];
	      if (callback) {
	        return callback(null);
	      }
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
	                console.log(err);
	              }
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
	      setDefaults = _.reduceRight(this.graph.nodes, serialize, subscribeGraph);
	      initializers = _.reduceRight(this.graph.initializers, serialize, function() {
	        return setDefaults("Defaults");
	      });
	      edges = _.reduceRight(this.graph.edges, serialize, function() {
	        return initializers("Initial");
	      });
	      nodes = _.reduceRight(this.graph.nodes, serialize, function() {
	        return edges("Edge");
	      });
	      return nodes("Node");
	    };

	    Network.prototype.connectPort = function(socket, process, port, index, inbound) {
	      if (inbound) {
	        socket.to = {
	          process: process,
	          port: port,
	          index: index
	        };
	        if (!(process.component.inPorts && process.component.inPorts[port])) {
	          throw new Error("No inport '" + port + "' defined in process " + process.id + " (" + (socket.getId()) + ")");
	          return;
	        }
	        if (process.component.inPorts[port].isAddressable()) {
	          return process.component.inPorts[port].attach(socket, index);
	        }
	        return process.component.inPorts[port].attach(socket);
	      }
	      socket.from = {
	        process: process,
	        port: port,
	        index: index
	      };
	      if (!(process.component.outPorts && process.component.outPorts[port])) {
	        throw new Error("No outport '" + port + "' defined in process " + process.id + " (" + (socket.getId()) + ")");
	        return;
	      }
	      if (process.component.outPorts[port].isAddressable()) {
	        return process.component.outPorts[port].attach(socket, index);
	      }
	      return process.component.outPorts[port].attach(socket);
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
	            _this.emit('process-error', err);
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
	      this.graph.on('addNode', (function(_this) {
	        return function(node) {
	          registerOp('addNode', node);
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
	      this.graph.on('removeNode', (function(_this) {
	        return function(node) {
	          registerOp('removeNode', node);
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
	      this.graph.on('renameNode', (function(_this) {
	        return function(oldId, newId) {
	          registerOp('renameNode', {
	            from: oldId,
	            to: newId
	          });
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
	      this.graph.on('addEdge', (function(_this) {
	        return function(edge) {
	          registerOp('addEdge', edge);
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
	      this.graph.on('removeEdge', (function(_this) {
	        return function(edge) {
	          registerOp('removeEdge', edge);
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
	      this.graph.on('addInitial', (function(_this) {
	        return function(iip) {
	          registerOp('addInitial', iip);
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
	      return this.graph.on('removeInitial', (function(_this) {
	        return function(iip) {
	          registerOp('removeInitial', iip);
	          if (!processing) {
	            return processOps();
	          }
	        };
	      })(this));
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
	            throw data;
	          }
	          if (type === 'connect') {
	            _this.increaseConnections();
	          }
	          if (type === 'disconnect') {
	            _this.decreaseConnections();
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
	          return _this.emit(type, data);
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
	      return node.component.network.on('process-error', function(data) {
	        return emitSub('process-error', data);
	      });
	    };

	    Network.prototype.subscribeSocket = function(socket) {
	      socket.on('connect', (function(_this) {
	        return function() {
	          _this.increaseConnections();
	          return _this.emit('connect', {
	            id: socket.getId(),
	            socket: socket,
	            metadata: socket.metadata
	          });
	        };
	      })(this));
	      socket.on('begingroup', (function(_this) {
	        return function(group) {
	          return _this.emit('begingroup', {
	            id: socket.getId(),
	            socket: socket,
	            group: group,
	            metadata: socket.metadata
	          });
	        };
	      })(this));
	      socket.on('data', (function(_this) {
	        return function(data) {
	          return _this.emit('data', {
	            id: socket.getId(),
	            socket: socket,
	            data: data,
	            metadata: socket.metadata
	          });
	        };
	      })(this));
	      socket.on('endgroup', (function(_this) {
	        return function(group) {
	          return _this.emit('endgroup', {
	            id: socket.getId(),
	            socket: socket,
	            group: group,
	            metadata: socket.metadata
	          });
	        };
	      })(this));
	      socket.on('disconnect', (function(_this) {
	        return function() {
	          _this.decreaseConnections();
	          return _this.emit('disconnect', {
	            id: socket.getId(),
	            socket: socket,
	            metadata: socket.metadata
	          });
	        };
	      })(this));
	      return socket.on('error', (function(_this) {
	        return function(event) {
	          if (_this.listeners('process-error').length === 0) {
	            throw event;
	          }
	          return _this.emit('process-error', event);
	        };
	      })(this));
	    };

	    Network.prototype.subscribeNode = function(node) {
	      if (!node.component.getIcon) {
	        return;
	      }
	      return node.component.on('icon', (function(_this) {
	        return function() {
	          return _this.emit('icon', {
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
	      this.subscribeSocket(socket);
	      this.connectPort(socket, to, edge.to.port, edge.to.index, true);
	      this.connectPort(socket, from, edge.from.port, edge.from.index, false);
	      this.connections.push(socket);
	      if (callback) {
	        return callback();
	      }
	    };

	    Network.prototype.removeEdge = function(edge, callback) {
	      var connection, _i, _len, _ref, _results;
	      _ref = this.connections;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        connection = _ref[_i];
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
	        if (callback) {
	          _results.push(callback());
	        } else {
	          _results.push(void 0);
	        }
	      }
	      return _results;
	    };

	    Network.prototype.addDefaults = function(node, callback) {
	      var key, port, process, socket, _ref;
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
	      _ref = process.component.inPorts.ports;
	      for (key in _ref) {
	        port = _ref[key];
	        if (typeof port.hasDefault === 'function' && port.hasDefault() && !port.isAttached()) {
	          socket = internalSocket.createSocket();
	          socket.setDebug(this.debug);
	          this.subscribeSocket(socket);
	          this.connectPort(socket, process, key, void 0, true);
	          this.connections.push(socket);
	          this.defaults.push(socket);
	        }
	      }
	      if (callback) {
	        return callback();
	      }
	    };

	    Network.prototype.addInitial = function(initializer, callback) {
	      var init, socket, to;
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
	      this.connectPort(socket, to, initializer.to.port, initializer.to.index, true);
	      this.connections.push(socket);
	      init = {
	        socket: socket,
	        data: initializer.from.data
	      };
	      this.initials.push(init);
	      this.nextInitials.push(init);
	      if (this.isStarted()) {
	        this.sendInitials();
	      }
	      if (callback) {
	        return callback();
	      }
	    };

	    Network.prototype.removeInitial = function(initializer, callback) {
	      var connection, init, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
	      _ref = this.connections;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        connection = _ref[_i];
	        if (!connection) {
	          continue;
	        }
	        if (!(initializer.to.node === connection.to.process.id && initializer.to.port === connection.to.port)) {
	          continue;
	        }
	        connection.to.process.component.inPorts[connection.to.port].detach(connection);
	        this.connections.splice(this.connections.indexOf(connection), 1);
	        _ref1 = this.initials;
	        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	          init = _ref1[_j];
	          if (!init) {
	            continue;
	          }
	          if (init.socket !== connection) {
	            continue;
	          }
	          this.initials.splice(this.initials.indexOf(init), 1);
	        }
	        _ref2 = this.nextInitials;
	        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
	          init = _ref2[_k];
	          if (!init) {
	            continue;
	          }
	          if (init.socket !== connection) {
	            continue;
	          }
	          this.nextInitials.splice(this.nextInitials.indexOf(init), 1);
	        }
	      }
	      if (callback) {
	        return callback();
	      }
	    };

	    Network.prototype.sendInitial = function(initial) {
	      initial.socket.connect();
	      initial.socket.send(initial.data);
	      return initial.socket.disconnect();
	    };

	    Network.prototype.sendInitials = function(callback) {
	      var send;
	      if (!callback) {
	        callback = function() {};
	      }
	      send = (function(_this) {
	        return function() {
	          var initial, _i, _len, _ref;
	          _ref = _this.initials;
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            initial = _ref[_i];
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

	    Network.prototype.isRunning = function() {
	      if (!this.started) {
	        return false;
	      }
	      return this.connectionCount > 0;
	    };

	    Network.prototype.startComponents = function(callback) {
	      var id, process, _ref;
	      if (!callback) {
	        callback = function() {};
	      }
	      _ref = this.processes;
	      for (id in _ref) {
	        process = _ref[id];
	        process.component.start();
	      }
	      return callback();
	    };

	    Network.prototype.sendDefaults = function(callback) {
	      var socket, _i, _len, _ref;
	      if (!callback) {
	        callback = function() {};
	      }
	      if (!this.defaults.length) {
	        return callback();
	      }
	      _ref = this.defaults;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        socket = _ref[_i];
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
	        callback = function() {};
	      }
	      if (this.started) {
	        this.stop();
	      }
	      this.initials = this.nextInitials.slice(0);
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

	    Network.prototype.stop = function() {
	      var connection, id, process, _i, _len, _ref, _ref1;
	      _ref = this.connections;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        connection = _ref[_i];
	        if (!connection.isConnected()) {
	          continue;
	        }
	        connection.disconnect();
	      }
	      _ref1 = this.processes;
	      for (id in _ref1) {
	        process = _ref1[id];
	        process.component.shutdown();
	      }
	      return this.setStarted(false);
	    };

	    Network.prototype.setStarted = function(started) {
	      if (this.started === started) {
	        return;
	      }
	      if (!started) {
	        this.started = false;
	        this.emit('end', {
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
	      return this.emit('start', {
	        start: this.startupDate
	      });
	    };

	    Network.prototype.getDebug = function() {
	      return this.debug;
	    };

	    Network.prototype.setDebug = function(active) {
	      var instance, process, processId, socket, _i, _len, _ref, _ref1, _results;
	      if (active === this.debug) {
	        return;
	      }
	      this.debug = active;
	      _ref = this.connections;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        socket = _ref[_i];
	        socket.setDebug(active);
	      }
	      _ref1 = this.processes;
	      _results = [];
	      for (processId in _ref1) {
	        process = _ref1[processId];
	        instance = process.component;
	        if (instance.isSubgraph()) {
	          _results.push(instance.network.setDebug(active));
	        } else {
	          _results.push(void 0);
	        }
	      }
	      return _results;
	    };

	    return Network;

	  })(EventEmitter);

	  exports.Network = Network;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

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
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var EventEmitter, IP, InternalSocket,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  IP = __webpack_require__(14);

	  InternalSocket = (function(_super) {
	    __extends(InternalSocket, _super);

	    InternalSocket.prototype.regularEmitEvent = function(event, data) {
	      return this.emit(event, data);
	    };

	    InternalSocket.prototype.debugEmitEvent = function(event, data) {
	      var error;
	      try {
	        return this.emit(event, data);
	      } catch (_error) {
	        error = _error;
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
	      this.dataDelegate = null;
	      this.debug = false;
	      this.emitEvent = this.regularEmitEvent;
	    }

	    InternalSocket.prototype.connect = function() {
	      return this.handleSocketEvent('connect', null);
	    };

	    InternalSocket.prototype.disconnect = function() {
	      return this.handleSocketEvent('disconnect', null);
	    };

	    InternalSocket.prototype.isConnected = function() {
	      return this.brackets.length > 0;
	    };

	    InternalSocket.prototype.send = function(data) {
	      if (data === void 0 && typeof this.dataDelegate === 'function') {
	        data = this.dataDelegate();
	      }
	      return this.handleSocketEvent('data', data);
	    };

	    InternalSocket.prototype.post = function(data) {
	      if (data === void 0 && typeof this.dataDelegate === 'function') {
	        data = this.dataDelegate();
	      }
	      if (data.type === 'data' && this.brackets.length === 0) {
	        this.emitEvent('connect', this);
	      }
	      this.handleSocketEvent('data', data, false);
	      if (data.type === 'data' && this.brackets.length === 0) {
	        return this.emitEvent('disconnect', this);
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
	        return "" + from.process.id + "() " + (from.port.toUpperCase());
	      };
	      toStr = function(to) {
	        return "" + (to.port.toUpperCase()) + " " + to.process.id + "()";
	      };
	      if (!(this.from || this.to)) {
	        return "UNDEFINED";
	      }
	      if (this.from && !this.to) {
	        return "" + (fromStr(this.from)) + " -> ANON";
	      }
	      if (!this.from) {
	        return "DATA -> " + (toStr(this.to));
	      }
	      return "" + (fromStr(this.from)) + " -> " + (toStr(this.to));
	    };

	    InternalSocket.prototype.legacyToIp = function(event, payload) {
	      if (IP.isIP(payload)) {
	        return payload;
	      }
	      switch (event) {
	        case 'connect':
	        case 'begingroup':
	          return new IP('openBracket', payload);
	        case 'disconnect':
	        case 'endgroup':
	          return new IP('closeBracket');
	        default:
	          return new IP('data', payload);
	      }
	    };

	    InternalSocket.prototype.ipToLegacy = function(ip) {
	      var legacy;
	      switch (ip.type) {
	        case 'openBracket':
	          if (this.brackets.length === 1) {
	            return legacy = {
	              event: 'connect',
	              payload: this
	            };
	          }
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
	          if (this.brackets.length === 0) {
	            return legacy = {
	              event: 'disconnect',
	              payload: this
	            };
	          }
	          return legacy = {
	            event: 'endgroup',
	            payload: ip.data
	          };
	      }
	    };

	    InternalSocket.prototype.handleSocketEvent = function(event, payload, autoConnect) {
	      var ip, legacyEvent;
	      if (autoConnect == null) {
	        autoConnect = true;
	      }
	      ip = this.legacyToIp(event, payload);
	      if (ip.type === 'data' && this.brackets.length === 0 && autoConnect) {
	        this.handleSocketEvent('connect', null);
	      }
	      if (ip.type === 'openBracket') {
	        if (ip.data === null) {
	          if (this.brackets.length) {
	            return;
	          }
	        } else {
	          if (this.brackets.length === 0 && autoConnect) {
	            this.handleSocketEvent('connect', null);
	          }
	        }
	        this.brackets.push(ip.data);
	      }
	      if (ip.type === 'closeBracket') {
	        if (this.brackets.length === 0) {
	          return;
	        }
	        ip.data = this.brackets.pop();
	      }
	      this.emitEvent('ip', ip);
	      if (!(ip && ip.type)) {
	        return;
	      }
	      legacyEvent = this.ipToLegacy(ip);
	      return this.emitEvent(legacyEvent.event, legacyEvent.payload);
	    };

	    return InternalSocket;

	  })(EventEmitter);

	  exports.InternalSocket = InternalSocket;

	  exports.createSocket = function() {
	    return new InternalSocket;
	  };

	}).call(this);


/***/ },
/* 14 */
/***/ function(module, exports) {

	(function() {
	  var IP;

	  module.exports = IP = (function() {
	    IP.types = ['data', 'openBracket', 'closeBracket'];

	    IP.isIP = function(obj) {
	      return obj && typeof obj === 'object' && obj.type && this.types.indexOf(obj.type) > -1;
	    };

	    function IP(type, data, options) {
	      var key, val;
	      this.type = type != null ? type : 'data';
	      this.data = data != null ? data : null;
	      if (options == null) {
	        options = {};
	      }
	      this.groups = [];
	      this.scope = null;
	      this.owner = null;
	      this.clonable = false;
	      this.index = null;
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
	      var key, val, _results;
	      _results = [];
	      for (key in this) {
	        val = this[key];
	        _results.push(delete this[key]);
	      }
	      return _results;
	    };

	    return IP;

	  })();

	}).call(this);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var ComponentLoader, EventEmitter, internalSocket, nofloGraph, registerLoader,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  internalSocket = __webpack_require__(13);

	  nofloGraph = __webpack_require__(2);

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  registerLoader = __webpack_require__(16);

	  ComponentLoader = (function(_super) {
	    __extends(ComponentLoader, _super);

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
	      return registerLoader.register(this, (function(_this) {
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
	      if (typeof name === 'string') {
	        instance.componentName = name;
	      }
	      return callback(null, instance);
	    };

	    ComponentLoader.prototype.isGraph = function(cPath) {
	      if (typeof cPath === 'object' && cPath instanceof nofloGraph.Graph) {
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
	      return this.createComponent(name, this.components['Graph'], metadata, (function(_this) {
	        return function(err, graph) {
	          var graphSocket;
	          if (err) {
	            return callback(err);
	          }
	          graphSocket = internalSocket.createSocket();
	          graph.loader = _this;
	          graph.baseDir = _this.baseDir;
	          graph.inPorts.graph.attach(graphSocket);
	          graphSocket.send(component);
	          graphSocket.disconnect();
	          graph.inPorts.remove('graph');
	          _this.setIcon(name, graph);
	          return callback(null, graph);
	        };
	      })(this));
	    };

	    ComponentLoader.prototype.setIcon = function(name, instance) {
	      var componentName, library, _ref;
	      if (!instance.getIcon || instance.getIcon()) {
	        return;
	      }
	      _ref = name.split('/'), library = _ref[0], componentName = _ref[1];
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
	      fullName = "" + prefix + "/" + name;
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

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
	    componentData.language = 'json'
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
	  var components = {
	    'browser-app/DoSomething': __webpack_require__(17),
	    'browser-app/main': __webpack_require__(18),
	    'Graph': __webpack_require__(19),
	    'core/Callback': __webpack_require__(20),
	    'core/DisconnectAfterPacket': __webpack_require__(21),
	    'core/Drop': __webpack_require__(22),
	    'core/Group': __webpack_require__(23),
	    'core/Kick': __webpack_require__(24),
	    'core/MakeFunction': __webpack_require__(25),
	    'core/Merge': __webpack_require__(26),
	    'core/Output': __webpack_require__(27),
	    'core/ReadGlobal': __webpack_require__(31),
	    'core/Repeat': __webpack_require__(32),
	    'core/RepeatAsync': __webpack_require__(33),
	    'core/RepeatDelayed': __webpack_require__(34),
	    'core/RunInterval': __webpack_require__(35),
	    'core/RunTimeout': __webpack_require__(36),
	    'core/SendNext': __webpack_require__(37),
	    'core/Split': __webpack_require__(38),
	    'dom/AddClass': __webpack_require__(39),
	    'dom/AppendChild': __webpack_require__(40),
	    'dom/CreateElement': __webpack_require__(41),
	    'dom/CreateFragment': __webpack_require__(42),
	    'dom/GetAttribute': __webpack_require__(43),
	    'dom/GetElement': __webpack_require__(44),
	    'dom/HasClass': __webpack_require__(45),
	    'dom/Listen': __webpack_require__(46),
	    'dom/ReadHtml': __webpack_require__(47),
	    'dom/RemoveClass': __webpack_require__(48),
	    'dom/RemoveElement': __webpack_require__(49),
	    'dom/RequestAnimationFrame': __webpack_require__(50),
	    'dom/SetAttribute': __webpack_require__(51),
	    'dom/WriteHtml': __webpack_require__(52),
	    'interaction/Focus': __webpack_require__(53),
	    'interaction/ListenChange': __webpack_require__(54),
	    'interaction/ListenDrag': __webpack_require__(55),
	    'interaction/ListenHash': __webpack_require__(56),
	    'interaction/ListenKeyboard': __webpack_require__(57),
	    'interaction/ListenKeyboardShortcuts': __webpack_require__(58),
	    'interaction/ListenMouse': __webpack_require__(59),
	    'interaction/ListenPointer': __webpack_require__(60),
	    'interaction/ListenResize': __webpack_require__(61),
	    'interaction/ListenScroll': __webpack_require__(62),
	    'interaction/ListenSpeech': __webpack_require__(63),
	    'interaction/ListenTouch': __webpack_require__(64),
	    'interaction/ReadCoordinates': __webpack_require__(65),
	    'interaction/ReadGamepad': __webpack_require__(66),
	    'interaction/SetHash': __webpack_require__(67)
	  };
	  var loaders = [

	  ];
	  var names = Object.keys(components);

	  names.forEach(function (fullname) {
	    var mod = components[fullname];
	    var tok = fullname.split('/');
	    if (tok.length == 2) {
	      var modulename = tok[0];
	      var componentname = tok[1];
	      loader.registerComponent(modulename, componentname, mod);
	    } else {
	      loader.registerComponent(null, fullname, mod);
	    }
	  });

	  if (!loaders.length) {
	    return callback();
	  }

	  registerCustomLoaders(loader, loaders, callback);
	};



/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var noflo;

	noflo = __webpack_require__(1);

	exports.getComponent = function() {
	  var c;
	  c = new noflo.Component;
	  c.icon = 'cog';
	  c.description = 'do X';
	  c.inPorts.add('in', {
	    datatype: 'string',
	    process: function(event, payload) {
	      if (event !== 'data') {
	        return;
	      }
	      return c.outPorts.out.send(payload);
	    }
	  });
	  c.outPorts.add('out', {
	    datatype: 'string'
	  });
	  return c;
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = {
		"properties": {
			"name": "main",
			"environment": {
				"type": "noflo-browser",
				"content": "<button id='button'>Go!</button>\n<p id='message'></p>"
			},
			"icon": ""
		},
		"inports": {},
		"outports": {},
		"groups": [],
		"processes": {
			"dom/GetElement_7amk2": {
				"component": "dom/GetElement",
				"metadata": {
					"label": "dom/GetElement",
					"x": 252,
					"y": 180,
					"width": 72,
					"height": 72
				}
			},
			"core/Output_cg49": {
				"component": "core/Output",
				"metadata": {
					"label": "core/Output",
					"x": 432,
					"y": 360,
					"width": 72,
					"height": 72
				}
			},
			"dom/WriteHtml_fpz6j": {
				"component": "dom/WriteHtml",
				"metadata": {
					"label": "dom/WriteHtml",
					"x": 684,
					"y": 288,
					"width": 72,
					"height": 72
				}
			},
			"dom/GetElement_xvz54": {
				"component": "dom/GetElement",
				"metadata": {
					"label": "dom/GetElement",
					"x": 252,
					"y": 288,
					"width": 72,
					"height": 72
				}
			},
			"interaction/ListenMouse_1l373": {
				"component": "interaction/ListenMouse",
				"metadata": {
					"label": "interaction/ListenMouse",
					"x": 432,
					"y": 180,
					"width": 72,
					"height": 72
				}
			},
			"core/Kick_ey1nh": {
				"component": "core/Kick",
				"metadata": {
					"label": "core/Kick",
					"x": 576,
					"y": 180,
					"width": 72,
					"height": 72
				}
			}
		},
		"connections": [
			{
				"src": {
					"process": "dom/GetElement_xvz54",
					"port": "element"
				},
				"tgt": {
					"process": "dom/WriteHtml_fpz6j",
					"port": "container"
				},
				"metadata": {}
			},
			{
				"src": {
					"process": "dom/GetElement_7amk2",
					"port": "element"
				},
				"tgt": {
					"process": "interaction/ListenMouse_1l373",
					"port": "element"
				},
				"metadata": {
					"route": 0
				}
			},
			{
				"src": {
					"process": "dom/GetElement_7amk2",
					"port": "error"
				},
				"tgt": {
					"process": "core/Output_cg49",
					"port": "in"
				},
				"metadata": {
					"route": 1
				}
			},
			{
				"src": {
					"process": "dom/GetElement_xvz54",
					"port": "error"
				},
				"tgt": {
					"process": "core/Output_cg49",
					"port": "in"
				},
				"metadata": {
					"route": 1
				}
			},
			{
				"src": {
					"process": "interaction/ListenMouse_1l373",
					"port": "click"
				},
				"tgt": {
					"process": "core/Kick_ey1nh",
					"port": "in"
				},
				"metadata": {}
			},
			{
				"src": {
					"process": "core/Kick_ey1nh",
					"port": "out"
				},
				"tgt": {
					"process": "dom/WriteHtml_fpz6j",
					"port": "html"
				},
				"metadata": {}
			},
			{
				"data": "#button",
				"tgt": {
					"process": "dom/GetElement_7amk2",
					"port": "selector"
				}
			},
			{
				"data": "#message",
				"tgt": {
					"process": "dom/GetElement_xvz54",
					"port": "selector"
				}
			},
			{
				"data": "Hello World!",
				"tgt": {
					"process": "core/Kick_ey1nh",
					"port": "data"
				}
			}
		]
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var Graph, noflo,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  noflo = __webpack_require__(1);

	  Graph = (function(_super) {
	    __extends(Graph, _super);

	    function Graph(metadata) {
	      this.metadata = metadata;
	      this.network = null;
	      this.ready = true;
	      this.started = false;
	      this.baseDir = null;
	      this.loader = null;
	      this.inPorts = new noflo.InPorts({
	        graph: {
	          datatype: 'all',
	          description: 'NoFlo graph definition to be used with the subgraph component',
	          required: true,
	          immediate: true
	        }
	      });
	      this.outPorts = new noflo.OutPorts;
	      this.inPorts.on('graph', 'data', (function(_this) {
	        return function(data) {
	          return _this.setGraph(data);
	        };
	      })(this));
	    }

	    Graph.prototype.setGraph = function(graph) {
	      this.ready = false;
	      if (typeof graph === 'object') {
	        if (typeof graph.addNode === 'function') {
	          return this.createNetwork(graph, (function(_this) {
	            return function(err) {
	              if (err) {
	                return _this.error(err);
	              }
	            };
	          })(this));
	        }
	        noflo.graph.loadJSON(graph, (function(_this) {
	          return function(err, instance) {
	            if (err) {
	              return _this.error(err);
	            }
	            instance.baseDir = _this.baseDir;
	            return _this.createNetwork(instance, function(err) {
	              if (err) {
	                return _this.error(err);
	              }
	            });
	          };
	        })(this));
	        return;
	      }
	      if (graph.substr(0, 1) !== "/" && graph.substr(1, 1) !== ":" && process && process.cwd) {
	        graph = "" + (process.cwd()) + "/" + graph;
	      }
	      return graph = noflo.graph.loadFile(graph, (function(_this) {
	        return function(err, instance) {
	          if (err) {
	            return _this.error(err);
	          }
	          instance.baseDir = _this.baseDir;
	          return _this.createNetwork(instance, function(err) {
	            if (err) {
	              return _this.error(err);
	            }
	          });
	        };
	      })(this));
	    };

	    Graph.prototype.createNetwork = function(graph) {
	      this.description = graph.properties.description || '';
	      this.icon = graph.properties.icon || this.icon;
	      graph.componentLoader = this.loader;
	      return noflo.createNetwork(graph, (function(_this) {
	        return function(err, network) {
	          _this.network = network;
	          if (err) {
	            return _this.error(err);
	          }
	          _this.emit('network', _this.network);
	          return _this.network.connect(function(err) {
	            var name, notReady, process, _ref;
	            if (err) {
	              return _this.error(err);
	            }
	            notReady = false;
	            _ref = _this.network.processes;
	            for (name in _ref) {
	              process = _ref[name];
	              if (!_this.checkComponent(name, process)) {
	                notReady = true;
	              }
	            }
	            if (!notReady) {
	              return _this.setToReady();
	            }
	          });
	        };
	      })(this), true);
	    };

	    Graph.prototype.start = function() {
	      if (!this.isReady()) {
	        this.on('ready', (function(_this) {
	          return function() {
	            return _this.start();
	          };
	        })(this));
	        return;
	      }
	      if (!this.network) {
	        return;
	      }
	      this.started = true;
	      return this.network.start();
	    };

	    Graph.prototype.checkComponent = function(name, process) {
	      if (!process.component.isReady()) {
	        process.component.once("ready", (function(_this) {
	          return function() {
	            _this.checkComponent(name, process);
	            return _this.setToReady();
	          };
	        })(this));
	        return false;
	      }
	      this.findEdgePorts(name, process);
	      return true;
	    };

	    Graph.prototype.isExportedInport = function(port, nodeName, portName) {
	      var exported, priv, pub, _i, _len, _ref, _ref1;
	      _ref = this.network.graph.inports;
	      for (pub in _ref) {
	        priv = _ref[pub];
	        if (!(priv.process === nodeName && priv.port === portName)) {
	          continue;
	        }
	        return pub;
	      }
	      _ref1 = this.network.graph.exports;
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        exported = _ref1[_i];
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
	      var exported, priv, pub, _i, _len, _ref, _ref1;
	      _ref = this.network.graph.outports;
	      for (pub in _ref) {
	        priv = _ref[pub];
	        if (!(priv.process === nodeName && priv.port === portName)) {
	          continue;
	        }
	        return pub;
	      }
	      _ref1 = this.network.graph.exports;
	      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	        exported = _ref1[_i];
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
	      var port, portName, targetPortName, _ref, _ref1;
	      _ref = process.component.inPorts;
	      for (portName in _ref) {
	        port = _ref[portName];
	        if (!port || typeof port === 'function' || !port.canAttach) {
	          continue;
	        }
	        targetPortName = this.isExportedInport(port, name, portName);
	        if (targetPortName === false) {
	          continue;
	        }
	        this.inPorts.add(targetPortName, port);
	        this.inPorts[targetPortName].once('connect', (function(_this) {
	          return function() {
	            if (_this.isStarted()) {
	              return;
	            }
	            return _this.start();
	          };
	        })(this));
	      }
	      _ref1 = process.component.outPorts;
	      for (portName in _ref1) {
	        port = _ref1[portName];
	        if (!port || typeof port === 'function' || !port.canAttach) {
	          continue;
	        }
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

	    Graph.prototype.shutdown = function() {
	      if (!this.network) {
	        return;
	      }
	      return this.network.stop();
	    };

	    return Graph;

	  })(noflo.Component);

	  exports.getComponent = function(metadata) {
	    return new Graph(metadata);
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Callback, _, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	_ = __webpack_require__(12)._;

	Callback = (function(superClass) {
	  extend(Callback, superClass);

	  Callback.prototype.description = 'This component calls a given callback function for each IP it receives.  The Callback component is typically used to connect NoFlo with external Node.js code.';

	  Callback.prototype.icon = 'sign-out';

	  function Callback() {
	    this.callback = null;
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        description: 'Object passed as argument of the callback',
	        datatype: 'all'
	      },
	      callback: {
	        description: 'Callback to invoke',
	        datatype: 'function'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      error: {
	        datatype: 'object'
	      }
	    });
	    this.inPorts.callback.on('data', (function(_this) {
	      return function(data) {
	        if (!_.isFunction(data)) {
	          _this.error('The provided callback must be a function');
	          return;
	        }
	        return _this.callback = data;
	      };
	    })(this));
	    this.inPorts["in"].on('data', (function(_this) {
	      return function(data) {
	        if (!_this.callback) {
	          _this.error('No callback provided');
	          return;
	        }
	        return _this.callback(data);
	      };
	    })(this));
	  }

	  Callback.prototype.error = function(msg) {
	    if (this.outPorts.error.isAttached()) {
	      this.outPorts.error.send(new Error(msg));
	      this.outPorts.error.disconnect();
	      return;
	    }
	    throw new Error(msg);
	  };

	  return Callback;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Callback;
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var DisconnectAfterPacket, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	DisconnectAfterPacket = (function(superClass) {
	  extend(DisconnectAfterPacket, superClass);

	  DisconnectAfterPacket.prototype.description = 'Forwards any packets, but also sends a disconnect after each of them';

	  DisconnectAfterPacket.prototype.icon = 'pause';

	  function DisconnectAfterPacket() {
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        datatype: 'all',
	        description: 'Packet to be forward with disconnection'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'all'
	      }
	    });
	    this.inPorts["in"].on('begingroup', (function(_this) {
	      return function(group) {
	        return _this.outPorts.out.beginGroup(group);
	      };
	    })(this));
	    this.inPorts["in"].on('data', (function(_this) {
	      return function(data) {
	        _this.outPorts.out.send(data);
	        return _this.outPorts.out.disconnect();
	      };
	    })(this));
	    this.inPorts["in"].on('endgroup', (function(_this) {
	      return function() {
	        return _this.outPorts.out.endGroup();
	      };
	    })(this));
	  }

	  return DisconnectAfterPacket;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new DisconnectAfterPacket;
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Drop, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	Drop = (function(superClass) {
	  extend(Drop, superClass);

	  Drop.prototype.description = 'This component drops every packet it receives with no action';

	  Drop.prototype.icon = 'trash-o';

	  function Drop() {
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        datatypes: 'all',
	        description: 'Packet to be dropped'
	      }
	    });
	    this.outPorts = new noflo.OutPorts;
	  }

	  return Drop;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Drop;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var Group, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	Group = (function(superClass) {
	  extend(Group, superClass);

	  Group.prototype.description = 'Adds a set of groups around the packets received at each connection';

	  Group.prototype.icon = 'tags';

	  function Group() {
	    this.groups = [];
	    this.newGroups = [];
	    this.threshold = null;
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        datatype: 'all'
	      },
	      group: {
	        datatype: 'string',
	        description: 'The group to add around forwarded packets'
	      },
	      threshold: {
	        datatype: 'int',
	        description: 'Maximum number of groups kept around',
	        required: false
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'all',
	        required: false
	      }
	    });
	    this.inPorts["in"].on('connect', (function(_this) {
	      return function() {
	        var group, i, len, ref, results;
	        ref = _this.newGroups;
	        results = [];
	        for (i = 0, len = ref.length; i < len; i++) {
	          group = ref[i];
	          results.push(_this.outPorts.out.beginGroup(group));
	        }
	        return results;
	      };
	    })(this));
	    this.inPorts["in"].on('begingroup', (function(_this) {
	      return function(group) {
	        return _this.outPorts.out.beginGroup(group);
	      };
	    })(this));
	    this.inPorts["in"].on('data', (function(_this) {
	      return function(data) {
	        return _this.outPorts.out.send(data);
	      };
	    })(this));
	    this.inPorts["in"].on('endgroup', (function(_this) {
	      return function(group) {
	        return _this.outPorts.out.endGroup();
	      };
	    })(this));
	    this.inPorts["in"].on('disconnect', (function(_this) {
	      return function() {
	        var group, i, len, ref;
	        ref = _this.newGroups;
	        for (i = 0, len = ref.length; i < len; i++) {
	          group = ref[i];
	          _this.outPorts.out.endGroup();
	        }
	        _this.outPorts.out.disconnect();
	        return _this.groups = [];
	      };
	    })(this));
	    this.inPorts.group.on('data', (function(_this) {
	      return function(data) {
	        var diff;
	        if (_this.threshold) {
	          diff = _this.newGroups.length - _this.threshold + 1;
	          if (diff > 0) {
	            _this.newGroups = _this.newGroups.slice(diff);
	          }
	        }
	        return _this.newGroups.push(data);
	      };
	    })(this));
	    this.inPorts.threshold.on('data', (function(_this) {
	      return function(threshold) {
	        _this.threshold = threshold;
	      };
	    })(this));
	  }

	  return Group;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Group;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var Kick, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	Kick = (function(superClass) {
	  extend(Kick, superClass);

	  Kick.prototype.description = 'This component generates a single packet and sends it to the output port. Mostly usable for debugging, but can also be useful for starting up networks.';

	  Kick.prototype.icon = 'share';

	  function Kick() {
	    this.data = {
	      packet: null,
	      group: []
	    };
	    this.groups = [];
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        datatype: 'bang',
	        description: 'Signal to send the data packet'
	      },
	      data: {
	        datatype: 'all',
	        description: 'Packet to be sent'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'all'
	      }
	    });
	    this.inPorts["in"].on('begingroup', (function(_this) {
	      return function(group) {
	        return _this.groups.push(group);
	      };
	    })(this));
	    this.inPorts["in"].on('data', (function(_this) {
	      return function() {
	        return _this.data.group = _this.groups.slice(0);
	      };
	    })(this));
	    this.inPorts["in"].on('endgroup', (function(_this) {
	      return function(group) {
	        return _this.groups.pop();
	      };
	    })(this));
	    this.inPorts["in"].on('disconnect', (function(_this) {
	      return function() {
	        _this.sendKick(_this.data);
	        return _this.groups = [];
	      };
	    })(this));
	    this.inPorts.data.on('data', (function(_this) {
	      return function(data) {
	        return _this.data.packet = data;
	      };
	    })(this));
	  }

	  Kick.prototype.sendKick = function(kick) {
	    var group, i, j, len, len1, ref, ref1;
	    ref = kick.group;
	    for (i = 0, len = ref.length; i < len; i++) {
	      group = ref[i];
	      this.outPorts.out.beginGroup(group);
	    }
	    this.outPorts.out.send(kick.packet);
	    ref1 = kick.group;
	    for (j = 0, len1 = ref1.length; j < len1; j++) {
	      group = ref1[j];
	      this.outPorts.out.endGroup();
	    }
	    return this.outPorts.out.disconnect();
	  };

	  return Kick;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Kick;
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var MakeFunction, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	MakeFunction = (function(superClass) {
	  extend(MakeFunction, superClass);

	  MakeFunction.prototype.description = 'Evaluates a function each time data hits the "in" port and sends the return value to "out". Within the function "x" will be the variable from the in port. For example, to make a ^2 function input "return x*x;" to the function port.';

	  MakeFunction.prototype.icon = 'code';

	  function MakeFunction() {
	    this.f = null;
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        datatype: 'all',
	        description: 'Packet to be processed'
	      },
	      "function": {
	        datatype: 'string',
	        description: 'Function to evaluate'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'all'
	      },
	      "function": {
	        datatype: 'function'
	      },
	      error: {
	        datatype: 'object'
	      }
	    });
	    this.inPorts["function"].on('data', (function(_this) {
	      return function(data) {
	        var error;
	        if (typeof data === "function") {
	          _this.f = data;
	        } else {
	          try {
	            _this.f = Function("x", data);
	          } catch (error1) {
	            error = error1;
	            _this.error('Error creating function: ' + data);
	          }
	        }
	        if (_this.f && _this.outPorts["function"].isAttached()) {
	          return _this.outPorts["function"].send(_this.f);
	        }
	      };
	    })(this));
	    this.inPorts["in"].on('data', (function(_this) {
	      return function(data) {
	        var error;
	        if (!_this.f) {
	          _this.error('No function defined');
	          return;
	        }
	        try {
	          return _this.outPorts.out.send(_this.f(data));
	        } catch (error1) {
	          error = error1;
	          return _this.error('Error evaluating function.');
	        }
	      };
	    })(this));
	  }

	  MakeFunction.prototype.error = function(msg) {
	    if (this.outPorts.error.isAttached()) {
	      this.outPorts.error.send(new Error(msg));
	      this.outPorts.error.disconnect();
	      return;
	    }
	    throw new Error(msg);
	  };

	  return MakeFunction;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new MakeFunction;
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var Merge, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	Merge = (function(superClass) {
	  extend(Merge, superClass);

	  Merge.prototype.description = 'This component receives data on multiple input ports and sends the same data out to the connected output port';

	  Merge.prototype.icon = 'compress';

	  function Merge() {
	    this.inPorts = new noflo.InPorts({
	      "in": {
	        datatype: 'all',
	        description: 'Packet to be forwarded'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'all'
	      }
	    });
	    this.inPorts["in"].on('connect', (function(_this) {
	      return function() {
	        return _this.outPorts.out.connect();
	      };
	    })(this));
	    this.inPorts["in"].on('begingroup', (function(_this) {
	      return function(group) {
	        return _this.outPorts.out.beginGroup(group);
	      };
	    })(this));
	    this.inPorts["in"].on('data', (function(_this) {
	      return function(data) {
	        return _this.outPorts.out.send(data);
	      };
	    })(this));
	    this.inPorts["in"].on('endgroup', (function(_this) {
	      return function() {
	        return _this.outPorts.out.endGroup();
	      };
	    })(this));
	    this.inPorts["in"].on('disconnect', (function(_this) {
	      return function() {
	        var i, len, ref, socket;
	        ref = _this.inPorts["in"].sockets;
	        for (i = 0, len = ref.length; i < len; i++) {
	          socket = ref[i];
	          if (socket.connected) {
	            return;
	          }
	        }
	        return _this.outPorts.out.disconnect();
	      };
	    })(this));
	  }

	  return Merge;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Merge;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var log, noflo, util;

	noflo = __webpack_require__(1);

	if (!noflo.isBrowser()) {
	  util = __webpack_require__(28);
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
	    description: 'Options to be passed to console.log'
	  });
	  c.outPorts.add('out', {
	    datatype: 'all'
	  });
	  noflo.helpers.WirePattern(c, {
	    "in": 'in',
	    out: 'out',
	    forwardGroups: true,
	    async: true
	  }, function(data, groups, out, callback) {
	    log(c.params.options, data);
	    out.send(data);
	    return callback();
	  });
	  return c;
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

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

	exports.isBuffer = __webpack_require__(29);

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
	exports.inherits = __webpack_require__(30);

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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(6)))

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 30 */
/***/ function(module, exports) {

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


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var noflo;

	noflo = __webpack_require__(1);

	exports.getComponent = function() {
	  var c, isNode;
	  isNode = typeof window === 'undefined';
	  c = new noflo.Component;
	  c.description = 'Returns the value of a global variable.';
	  c.icon = 'usd';
	  c.inPorts.add('name', {
	    description: 'The name of the global variable.',
	    required: true
	  });
	  c.outPorts.add('value', {
	    description: 'The value of the variable.',
	    required: false
	  });
	  c.outPorts.add('error', {
	    description: 'Any errors that occured reading the variables value.',
	    required: false
	  });
	  noflo.helpers.WirePattern(c, {
	    "in": ['name'],
	    out: ['value'],
	    forwardGroups: true
	  }, function(data, groups, out) {
	    var err, value;
	    value = isNode ? global[data] : window[data];
	    if (typeof value === 'undefined') {
	      err = new Error("\"" + data + "\" is undefined on the global object.");
	      if (c.outPorts.error.isAttached()) {
	        return c.outPorts.error.send(err);
	      } else {
	        throw err;
	      }
	    } else {
	      return out.send(value);
	    }
	  });
	  return c;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var noflo;

	noflo = __webpack_require__(1);

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
	  noflo.helpers.WirePattern(c, {
	    "in": ['in'],
	    out: 'out',
	    forwardGroups: true
	  }, function(data, groups, out) {
	    return out.send(data);
	  });
	  return c;
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var noflo;

	noflo = __webpack_require__(1);

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
	  noflo.helpers.WirePattern(c, {
	    "in": ['in'],
	    out: 'out',
	    forwardGroups: true,
	    async: true
	  }, function(data, groups, out, callback) {
	    return setTimeout(function() {
	      out.send(data);
	      return callback();
	    }, 0);
	  });
	  return c;
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var noflo;

	noflo = __webpack_require__(1);

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
	    "default": 500
	  });
	  c.outPorts.add('out', {
	    datatype: 'all'
	  });
	  noflo.helpers.WirePattern(c, {
	    "in": 'in',
	    params: 'delay',
	    out: 'out',
	    forwardGroups: true,
	    async: true
	  }, function(payload, groups, out, callback) {
	    var timer;
	    timer = setTimeout((function(_this) {
	      return function() {
	        out.send(payload);
	        callback();
	        return c.timers.splice(c.timers.indexOf(timer), 1);
	      };
	    })(this), c.params.delay);
	    return c.timers.push(timer);
	  });
	  c.shutdown = function() {
	    var i, len, ref, timer;
	    ref = c.timers;
	    for (i = 0, len = ref.length; i < len; i++) {
	      timer = ref[i];
	      clearTimeout(timer);
	    }
	    return c.timers = [];
	  };
	  return c;
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var RunInterval, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	RunInterval = (function(superClass) {
	  extend(RunInterval, superClass);

	  RunInterval.prototype.description = 'Send a packet at the given interval';

	  RunInterval.prototype.icon = 'clock-o';

	  function RunInterval() {
	    this.timer = null;
	    this.interval = null;
	    this.inPorts = new noflo.InPorts({
	      interval: {
	        datatype: 'number',
	        description: 'Interval at which output packets are emitted (ms)'
	      },
	      start: {
	        datatype: 'bang',
	        description: 'Start the emission'
	      },
	      stop: {
	        datatype: 'bang',
	        description: 'Stop the emission'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'bang'
	      }
	    });
	    this.inPorts.interval.on('data', (function(_this) {
	      return function(interval) {
	        _this.interval = interval;
	        if (_this.timer != null) {
	          clearInterval(_this.timer);
	          return _this.start();
	        }
	      };
	    })(this));
	    this.inPorts.start.on('data', (function(_this) {
	      return function() {
	        if (_this.timer != null) {
	          clearInterval(_this.timer);
	        }
	        _this.outPorts.out.connect();
	        return _this.start();
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function() {
	        if (!_this.timer) {
	          return;
	        }
	        clearInterval(_this.timer);
	        _this.timer = null;
	        return _this.outPorts.out.disconnect();
	      };
	    })(this));
	  }

	  RunInterval.prototype.start = function() {
	    var out;
	    out = this.outPorts.out;
	    return this.timer = setInterval(function() {
	      return out.send(true);
	    }, this.interval);
	  };

	  RunInterval.prototype.shutdown = function() {
	    if (this.timer != null) {
	      return clearInterval(this.timer);
	    }
	  };

	  return RunInterval;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new RunInterval;
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var RunTimeout, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	RunTimeout = (function(superClass) {
	  extend(RunTimeout, superClass);

	  RunTimeout.prototype.description = 'Send a packet after the given time in ms';

	  RunTimeout.prototype.icon = 'clock-o';

	  function RunTimeout() {
	    this.timer = null;
	    this.time = null;
	    this.inPorts = new noflo.InPorts({
	      time: {
	        datatype: 'number',
	        description: 'Time after which a packet will be sent'
	      },
	      start: {
	        datatype: 'bang',
	        description: 'Start the timeout before sending a packet'
	      },
	      clear: {
	        datatype: 'bang',
	        description: 'Clear the timeout',
	        required: false
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'bang'
	      }
	    });
	    this.inPorts.time.on('data', (function(_this) {
	      return function(time) {
	        _this.time = time;
	        return _this.startTimer();
	      };
	    })(this));
	    this.inPorts.start.on('data', (function(_this) {
	      return function() {
	        return _this.startTimer();
	      };
	    })(this));
	    this.inPorts.clear.on('data', (function(_this) {
	      return function() {
	        if (_this.timer) {
	          return _this.stopTimer();
	        }
	      };
	    })(this));
	  }

	  RunTimeout.prototype.startTimer = function() {
	    if (this.timer) {
	      this.stopTimer();
	    }
	    this.outPorts.out.connect();
	    return this.timer = setTimeout((function(_this) {
	      return function() {
	        _this.outPorts.out.send(true);
	        _this.outPorts.out.disconnect();
	        return _this.timer = null;
	      };
	    })(this), this.time);
	  };

	  RunTimeout.prototype.stopTimer = function() {
	    if (!this.timer) {
	      return;
	    }
	    clearTimeout(this.timer);
	    this.timer = null;
	    return this.outPorts.out.disconnect();
	  };

	  RunTimeout.prototype.shutdown = function() {
	    if (this.timer) {
	      return this.stopTimer();
	    }
	  };

	  return RunTimeout;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new RunTimeout;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var SendNext, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	SendNext = (function(superClass) {
	  extend(SendNext, superClass);

	  SendNext.prototype.description = 'Sends next packet in buffer when receiving a bang';

	  SendNext.prototype.icon = 'forward';

	  function SendNext() {
	    this.inPorts = new noflo.InPorts({
	      data: {
	        datatype: 'all',
	        buffered: true
	      },
	      "in": {
	        datatype: 'bang'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      out: {
	        datatype: 'all'
	      },
	      empty: {
	        datatype: 'bang',
	        required: false
	      }
	    });
	    this.inPorts["in"].on('data', (function(_this) {
	      return function() {
	        return _this.sendNext();
	      };
	    })(this));
	  }

	  SendNext.prototype.sendNext = function() {
	    var groups, packet, sent;
	    sent = false;
	    while (true) {
	      packet = this.inPorts.data.receive();
	      if (!packet) {
	        this.outPorts.empty.send(true);
	        this.outPorts.empty.disconnect();
	        break;
	      }
	      groups = [];
	      switch (packet.event) {
	        case 'begingroup':
	          this.outPorts.out.beginGroup(packet.payload);
	          groups.push(packet.payload);
	          break;
	        case 'data':
	          if (sent) {
	            this.inPorts.data.buffer.unshift(packet);
	            return;
	          }
	          this.outPorts.out.send(packet.payload);
	          sent = true;
	          break;
	        case 'endgroup':
	          this.outPorts.out.endGroup();
	          groups.pop();
	          if (groups.length === 0) {
	            return;
	          }
	          break;
	        case 'disconnect':
	          this.outPorts.out.disconnect();
	          return;
	      }
	    }
	  };

	  return SendNext;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new SendNext;
	};


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var noflo;

	noflo = __webpack_require__(1);

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
	  noflo.helpers.WirePattern(c, {
	    "in": 'in',
	    out: 'out',
	    forwardGroups: true,
	    async: true
	  }, function(data, groups, out, callback) {
	    out.send(data);
	    return callback();
	  });
	  return c;
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var AddClass, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	AddClass = (function(superClass) {
	  extend(AddClass, superClass);

	  AddClass.prototype.description = 'Add a class to an element';

	  function AddClass() {
	    this.element = null;
	    this["class"] = null;
	    this.inPorts = {
	      element: new noflo.Port('object'),
	      "class": new noflo.Port('string')
	    };
	    this.outPorts = {};
	    this.inPorts.element.on('data', (function(_this) {
	      return function(data) {
	        _this.element = data;
	        if (_this["class"]) {
	          return _this.addClass();
	        }
	      };
	    })(this));
	    this.inPorts["class"].on('data', (function(_this) {
	      return function(data) {
	        _this["class"] = data;
	        if (_this.element) {
	          return _this.addClass();
	        }
	      };
	    })(this));
	  }

	  AddClass.prototype.addClass = function() {
	    return this.element.classList.add(this["class"]);
	  };

	  return AddClass;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new AddClass;
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var AppendChild, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	AppendChild = (function(superClass) {
	  extend(AppendChild, superClass);

	  AppendChild.prototype.description = 'Append elements as children of a parent element';

	  function AppendChild() {
	    this.parent = null;
	    this.children = [];
	    this.inPorts = {
	      parent: new noflo.Port('object'),
	      child: new noflo.Port('object')
	    };
	    this.outPorts = {};
	    this.inPorts.parent.on('data', (function(_this) {
	      return function(data) {
	        _this.parent = data;
	        if (_this.children.length) {
	          return _this.append();
	        }
	      };
	    })(this));
	    this.inPorts.child.on('data', (function(_this) {
	      return function(data) {
	        if (!_this.parent) {
	          _this.children.push(data);
	          return;
	        }
	        return _this.parent.appendChild(data);
	      };
	    })(this));
	  }

	  AppendChild.prototype.append = function() {
	    var child, i, len, ref;
	    ref = this.children;
	    for (i = 0, len = ref.length; i < len; i++) {
	      child = ref[i];
	      this.parent.appendChild(child);
	    }
	    return this.children = [];
	  };

	  return AppendChild;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new AppendChild;
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var CreateElement, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	CreateElement = (function(superClass) {
	  extend(CreateElement, superClass);

	  CreateElement.prototype.description = 'Create a new DOM Element';

	  function CreateElement() {
	    this.tagName = null;
	    this.container = null;
	    this.inPorts = {
	      tagname: new noflo.Port('string'),
	      container: new noflo.Port('object')
	    };
	    this.outPorts = {
	      element: new noflo.Port('object')
	    };
	    this.inPorts.tagname.on('data', (function(_this) {
	      return function(tagName) {
	        _this.tagName = tagName;
	        return _this.createElement();
	      };
	    })(this));
	    this.inPorts.tagname.on('disconnect', (function(_this) {
	      return function() {
	        if (!_this.inPorts.container.isAttached()) {
	          return _this.outPorts.element.disconnect();
	        }
	      };
	    })(this));
	    this.inPorts.container.on('data', (function(_this) {
	      return function(container) {
	        _this.container = container;
	        return _this.createElement();
	      };
	    })(this));
	    this.inPorts.container.on('disconnect', (function(_this) {
	      return function() {
	        return _this.outPorts.element.disconnect();
	      };
	    })(this));
	  }

	  CreateElement.prototype.createElement = function() {
	    var el;
	    if (!this.tagName) {
	      return;
	    }
	    if (this.inPorts.container.isAttached()) {
	      if (!this.container) {
	        return;
	      }
	    }
	    el = document.createElement(this.tagName);
	    if (this.container) {
	      this.container.appendChild(el);
	    }
	    return this.outPorts.element.send(el);
	  };

	  return CreateElement;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new CreateElement;
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var CreateFragment, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	CreateFragment = (function(superClass) {
	  extend(CreateFragment, superClass);

	  CreateFragment.prototype.description = 'Create a new DOM DocumentFragment';

	  function CreateFragment() {
	    this.inPorts = {
	      "in": new noflo.Port('bang')
	    };
	    this.outPorts = {
	      fragment: new noflo.Port('object')
	    };
	    this.inPorts["in"].on('data', (function(_this) {
	      return function() {
	        return _this.outPorts.fragment.send(document.createDocumentFragment());
	      };
	    })(this));
	    this.inPorts["in"].on('disconnect', (function(_this) {
	      return function() {
	        return _this.outPorts.fragment.disconnect();
	      };
	    })(this));
	  }

	  return CreateFragment;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new CreateFragment;
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var noflo;

	noflo = __webpack_require__(1);

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
	    required: true
	  });
	  c.outPorts.add('out', {
	    datatype: 'string',
	    description: 'Value of the attribute being read.'
	  });
	  return noflo.helpers.WirePattern(c, {
	    "in": ['element'],
	    out: ['out'],
	    params: ['attribute'],
	    forwardGroups: true
	  }, function(data, groups, out) {
	    var attr, value;
	    attr = c.params.attribute;
	    value = data.getAttribute(attr);
	    return out.send(value);
	  });
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var GetElement, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	GetElement = (function(superClass) {
	  extend(GetElement, superClass);

	  GetElement.prototype.description = 'Get a DOM element matching a query';

	  function GetElement() {
	    this.container = null;
	    this.inPorts = {
	      "in": new noflo.Port('object'),
	      selector: new noflo.Port('string')
	    };
	    this.outPorts = {
	      element: new noflo.Port('object'),
	      error: new noflo.Port('object')
	    };
	    this.inPorts["in"].on('data', (function(_this) {
	      return function(data) {
	        if (typeof data.querySelector !== 'function') {
	          _this.error('Given container doesn\'t support querySelectors');
	          return;
	        }
	        return _this.container = data;
	      };
	    })(this));
	    this.inPorts.selector.on('data', (function(_this) {
	      return function(data) {
	        return _this.select(data);
	      };
	    })(this));
	  }

	  GetElement.prototype.select = function(selector) {
	    var el, element, i, len;
	    if (this.container) {
	      el = this.container.querySelectorAll(selector);
	    } else {
	      el = document.querySelectorAll(selector);
	    }
	    if (!el.length) {
	      this.error("No element matching '" + selector + "' found");
	      return;
	    }
	    for (i = 0, len = el.length; i < len; i++) {
	      element = el[i];
	      this.outPorts.element.send(element);
	    }
	    return this.outPorts.element.disconnect();
	  };

	  GetElement.prototype.error = function(msg) {
	    if (this.outPorts.error.isAttached()) {
	      this.outPorts.error.send(new Error(msg));
	      this.outPorts.error.disconnect();
	      return;
	    }
	    throw new Error(msg);
	  };

	  return GetElement;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new GetElement;
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var HasClass, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	HasClass = (function(superClass) {
	  extend(HasClass, superClass);

	  HasClass.prototype.description = 'Check if an element has a given class';

	  function HasClass() {
	    this.element = null;
	    this["class"] = null;
	    this.inPorts = {
	      element: new noflo.Port('object'),
	      "class": new noflo.Port('string')
	    };
	    this.outPorts = {
	      element: new noflo.Port('object'),
	      missed: new noflo.Port('object')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(data) {
	        _this.element = data;
	        if (_this["class"]) {
	          return _this.checkClass();
	        }
	      };
	    })(this));
	    this.inPorts.element.on('disconnect', (function(_this) {
	      return function() {
	        _this.outPorts.element.disconnect();
	        if (!_this.outPorts.missed.isAttached()) {
	          return;
	        }
	        return _this.outPorts.missed.disconnect();
	      };
	    })(this));
	    this.inPorts["class"].on('data', (function(_this) {
	      return function(data) {
	        _this["class"] = data;
	        if (_this.element) {
	          return _this.checkClass();
	        }
	      };
	    })(this));
	  }

	  HasClass.prototype.checkClass = function() {
	    if (this.element.classList.contains(this["class"])) {
	      this.outPorts.element.send(this.element);
	      return;
	    }
	    if (!this.outPorts.missed.isAttached()) {
	      return;
	    }
	    return this.outPorts.missed.send(this.element);
	  };

	  return HasClass;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new HasClass;
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var Listen, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	Listen = (function(superClass) {
	  extend(Listen, superClass);

	  Listen.prototype.description = 'addEventListener for specified event type';

	  Listen.prototype.icon = 'stethoscope';

	  function Listen() {
	    this.change = bind(this.change, this);
	    this.element = null;
	    this.type = null;
	    this.preventDefault = false;
	    this.inPorts = {
	      element: new noflo.Port('object'),
	      type: new noflo.Port('string'),
	      preventdefault: new noflo.Port('boolean')
	    };
	    this.outPorts = {
	      element: new noflo.Port('object'),
	      event: new noflo.Port('object')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(data) {
	        if (_this.element && _this.type) {
	          _this.unsubscribe(_this.element, _this.type);
	        }
	        _this.element = data;
	        if (_this.type) {
	          return _this.subscribe(_this.element, _this.type);
	        }
	      };
	    })(this));
	    this.inPorts.type.on('data', (function(_this) {
	      return function(data) {
	        if (_this.element && _this.type) {
	          _this.unsubscribe(_this.element, _this.type);
	        }
	        _this.type = data;
	        if (_this.element) {
	          return _this.subscribe(_this.element, _this.type);
	        }
	      };
	    })(this));
	    this.inPorts.preventdefault.on('data', (function(_this) {
	      return function(data) {
	        return _this.preventDefault = data;
	      };
	    })(this));
	  }

	  Listen.prototype.unsubscribe = function(element, type) {
	    return element.removeEventListener(type, this.change);
	  };

	  Listen.prototype.subscribe = function(element, type) {
	    return element.addEventListener(type, this.change);
	  };

	  Listen.prototype.change = function(event) {
	    if (this.preventDefault) {
	      event.preventDefault();
	    }
	    if (this.outPorts.element.isAttached()) {
	      this.outPorts.element.send(this.element);
	    }
	    if (this.outPorts.event.isAttached()) {
	      return this.outPorts.event.send(event);
	    }
	  };

	  return Listen;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Listen;
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var ReadHtml, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ReadHtml = (function(superClass) {
	  extend(ReadHtml, superClass);

	  ReadHtml.prototype.description = 'Read HTML from an existing element';

	  function ReadHtml() {
	    this.inPorts = {
	      container: new noflo.Port('object')
	    };
	    this.outPorts = {
	      html: new noflo.Port('string')
	    };
	    this.inPorts.container.on('data', (function(_this) {
	      return function(data) {
	        _this.outPorts.html.send(data.innerHTML);
	        return _this.outPorts.html.disconnect();
	      };
	    })(this));
	  }

	  return ReadHtml;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ReadHtml;
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var RemoveClass, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	RemoveClass = (function(superClass) {
	  extend(RemoveClass, superClass);

	  RemoveClass.prototype.description = 'Remove a class from an element';

	  function RemoveClass() {
	    this.element = null;
	    this["class"] = null;
	    this.inPorts = {
	      element: new noflo.Port('object'),
	      "class": new noflo.Port('string')
	    };
	    this.outPorts = {};
	    this.inPorts.element.on('data', (function(_this) {
	      return function(data) {
	        _this.element = data;
	        if (_this["class"]) {
	          return _this.removeClass();
	        }
	      };
	    })(this));
	    this.inPorts["class"].on('data', (function(_this) {
	      return function(data) {
	        _this["class"] = data;
	        if (_this.element) {
	          return _this.removeClass();
	        }
	      };
	    })(this));
	  }

	  RemoveClass.prototype.removeClass = function() {
	    return this.element.classList.remove(this["class"]);
	  };

	  return RemoveClass;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new RemoveClass;
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var RemoveElement, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	RemoveElement = (function(superClass) {
	  extend(RemoveElement, superClass);

	  RemoveElement.prototype.description = 'Remove an element from DOM';

	  function RemoveElement() {
	    this.inPorts = {
	      element: new noflo.Port('object')
	    };
	    this.inPorts.element.on('data', function(element) {
	      if (!element.parentNode) {
	        return;
	      }
	      return element.parentNode.removeChild(element);
	    });
	  }

	  return RemoveElement;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new RemoveElement;
	};


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var RequestAnimationFrame, noflo, requestAnimationFrame,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
	  return window.setTimeout(function() {
	    return callback(+new Date());
	  }, 1000 / 60);
	};

	RequestAnimationFrame = (function(superClass) {
	  extend(RequestAnimationFrame, superClass);

	  RequestAnimationFrame.prototype.description = 'Sends bangs that correspond with screen refresh rate.';

	  RequestAnimationFrame.prototype.icon = 'film';

	  function RequestAnimationFrame() {
	    this.running = false;
	    this.inPorts = {
	      start: new noflo.Port('bang'),
	      stop: new noflo.Port('bang')
	    };
	    this.outPorts = {
	      out: new noflo.Port('bang')
	    };
	    this.inPorts.start.on('data', (function(_this) {
	      return function(data) {
	        _this.running = true;
	        return _this.animate();
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function(data) {
	        return _this.running = false;
	      };
	    })(this));
	  }

	  RequestAnimationFrame.prototype.animate = function() {
	    if (this.running) {
	      requestAnimationFrame(this.animate.bind(this));
	      return this.outPorts.out.send(true);
	    }
	  };

	  RequestAnimationFrame.prototype.shutdown = function() {
	    return this.running = false;
	  };

	  return RequestAnimationFrame;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new RequestAnimationFrame;
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var noflo;

	noflo = __webpack_require__(1);

	exports.getComponent = function() {
	  var c;
	  c = new noflo.Component;
	  c.description = "Set the given attribute on the DOM element to the received value.";
	  c.inPorts.add('element', {
	    datatype: 'object',
	    description: 'The element on which to set the attribute.',
	    required: true
	  });
	  c.inPorts.add('attribute', {
	    datatype: 'string',
	    description: 'The attribute which is set on the DOM element.',
	    required: true
	  });
	  c.inPorts.add('value', {
	    datatype: 'string',
	    description: 'Value of the attribute being set.'
	  });
	  c.outPorts.add('element', {
	    datatype: 'object',
	    description: 'The element that was updated.'
	  });
	  return noflo.helpers.WirePattern(c, {
	    "in": ['element', 'value'],
	    out: ['element'],
	    params: ['attribute'],
	    forwardGroups: true
	  }, function(data, groups, out) {
	    var attr, key, newVal, val, value;
	    attr = c.params.attribute;
	    value = data.value;
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
	    if (attr === "value") {
	      data.element.value = value;
	    } else {
	      data.element.setAttribute(attr, value);
	    }
	    return out.send(data.element);
	  });
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var WriteHtml, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	WriteHtml = (function(superClass) {
	  extend(WriteHtml, superClass);

	  WriteHtml.prototype.description = 'Write HTML inside an existing element';

	  function WriteHtml() {
	    this.container = null;
	    this.html = null;
	    this.inPorts = {
	      html: new noflo.Port('string'),
	      container: new noflo.Port('object')
	    };
	    this.outPorts = {
	      container: new noflo.Port('object')
	    };
	    this.inPorts.html.on('data', (function(_this) {
	      return function(data) {
	        _this.html = data;
	        if (_this.container) {
	          return _this.writeHtml();
	        }
	      };
	    })(this));
	    this.inPorts.container.on('data', (function(_this) {
	      return function(data) {
	        _this.container = data;
	        if (_this.html !== null) {
	          return _this.writeHtml();
	        }
	      };
	    })(this));
	  }

	  WriteHtml.prototype.writeHtml = function() {
	    this.container.innerHTML = this.html;
	    this.html = null;
	    if (this.outPorts.container.isAttached()) {
	      this.outPorts.container.send(this.container);
	      return this.outPorts.container.disconnect();
	    }
	  };

	  return WriteHtml;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new WriteHtml;
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var Focus, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	Focus = (function(superClass) {
	  extend(Focus, superClass);

	  Focus.prototype.description = 'focus element';

	  Focus.prototype.element = null;

	  function Focus() {
	    Focus.__super__.constructor.apply(this, arguments);
	    this.inPorts.add('element', {
	      datatype: 'all',
	      description: 'element to be focused'
	    }, (function(_this) {
	      return function(event, payload) {
	        if (event === 'data') {
	          return _this.element = payload;
	        }
	      };
	    })(this));
	    this.inPorts.add('trigger', {
	      datatype: 'bang',
	      description: 'trigger focus'
	    }, (function(_this) {
	      return function(event, payload) {
	        if (event === 'data') {
	          return window.setTimeout(function() {
	            _this.element.focus();
	            return _this.outPorts.out.send(payload);
	          }, 0);
	        }
	      };
	    })(this));
	    this.outPorts.add('out');
	  }

	  return Focus;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new Focus;
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var ListenChange, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenChange = (function(superClass) {
	  extend(ListenChange, superClass);

	  ListenChange.prototype.description = 'Listen to mouse events on a DOM element';

	  function ListenChange() {
	    this.change = bind(this.change, this);
	    this.elements = [];
	    this.inPorts = {
	      element: new noflo.Port('object')
	    };
	    this.outPorts = {
	      value: new noflo.ArrayPort('all')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(element) {
	        return _this.subscribe(element);
	      };
	    })(this));
	  }

	  ListenChange.prototype.subscribe = function(element) {
	    element.addEventListener('change', this.change, false);
	    return this.elements.push(element);
	  };

	  ListenChange.prototype.unsubscribe = function() {
	    var element, i, len, ref;
	    ref = this.elements;
	    for (i = 0, len = ref.length; i < len; i++) {
	      element = ref[i];
	      element.removeEventListener('change', this.change, false);
	    }
	    return this.elements = [];
	  };

	  ListenChange.prototype.change = function(event) {
	    if (!this.outPorts.value.sockets.length) {
	      return;
	    }
	    event.preventDefault();
	    event.stopPropagation();
	    this.outPorts.value.send(event.target.value);
	    return this.outPorts.value.disconnect();
	  };

	  ListenChange.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenChange;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenChange;
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var ListenDrag, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenDrag = (function(superClass) {
	  extend(ListenDrag, superClass);

	  ListenDrag.prototype.description = 'Listen to drag events on a DOM element';

	  ListenDrag.prototype.icon = 'arrows';

	  function ListenDrag() {
	    this.dragend = bind(this.dragend, this);
	    this.dragmove = bind(this.dragmove, this);
	    this.dragstart = bind(this.dragstart, this);
	    this.inPorts = {
	      element: new noflo.Port('object')
	    };
	    this.outPorts = {
	      start: new noflo.ArrayPort('object'),
	      movex: new noflo.ArrayPort('number'),
	      movey: new noflo.ArrayPort('number'),
	      end: new noflo.ArrayPort('object')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(element) {
	        return _this.subscribe(element);
	      };
	    })(this));
	  }

	  ListenDrag.prototype.subscribe = function(element) {
	    element.addEventListener('dragstart', this.dragstart, false);
	    element.addEventListener('drag', this.dragmove, false);
	    return element.addEventListener('dragend', this.dragend, false);
	  };

	  ListenDrag.prototype.dragstart = function(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.outPorts.start.send(event);
	    return this.outPorts.start.disconnect();
	  };

	  ListenDrag.prototype.dragmove = function(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    this.outPorts.movex.send(event.clientX);
	    return this.outPorts.movey.send(event.clientY);
	  };

	  ListenDrag.prototype.dragend = function(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    if (this.outPorts.movex.isConnected()) {
	      this.outPorts.movex.disconnect();
	    }
	    if (this.outPorts.movey.isConnected()) {
	      this.outPorts.movey.disconnect();
	    }
	    this.outPorts.end.send(event);
	    return this.outPorts.end.disconnect();
	  };

	  return ListenDrag;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenDrag;
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var ListenHash, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenHash = (function(superClass) {
	  extend(ListenHash, superClass);

	  ListenHash.prototype.description = 'Listen for hash changes in browser\'s URL bar';

	  ListenHash.prototype.icon = 'slack';

	  function ListenHash() {
	    this.hashChange = bind(this.hashChange, this);
	    this.current = null;
	    this.inPorts = new noflo.InPorts({
	      start: {
	        datatype: 'bang',
	        description: 'Start listening for hash changes'
	      },
	      stop: {
	        datatype: 'bang',
	        description: 'Stop listening for hash changes'
	      }
	    });
	    this.outPorts = new noflo.OutPorts({
	      initial: {
	        datatype: 'string',
	        required: false
	      },
	      change: {
	        datatype: 'string',
	        required: false
	      }
	    });
	    this.inPorts.start.on('data', (function(_this) {
	      return function() {
	        return _this.subscribe();
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function() {
	        return _this.unsubscribe();
	      };
	    })(this));
	  }

	  ListenHash.prototype.subscribe = function() {
	    this.current = this.getHash();
	    window.addEventListener('hashchange', this.hashChange, false);
	    this.outPorts.initial.send(this.current);
	    return this.outPorts.initial.disconnect();
	  };

	  ListenHash.prototype.unsubscribe = function() {
	    window.removeEventListener('hashchange', this.hashChange, false);
	    return this.outPorts.change.disconnect();
	  };

	  ListenHash.prototype.hashChange = function(event) {
	    var oldHash;
	    oldHash = this.current;
	    this.current = this.getHash();
	    if (oldHash) {
	      this.outPorts.change.beginGroup(oldHash);
	    }
	    this.outPorts.change.send(this.current);
	    if (oldHash) {
	      return this.outPorts.change.endGroup(oldHash);
	    }
	  };

	  ListenHash.prototype.getHash = function() {
	    return window.location.href.split('#')[1] || '';
	  };

	  ListenHash.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenHash;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenHash;
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var ListenKeyboard, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenKeyboard = (function(superClass) {
	  extend(ListenKeyboard, superClass);

	  ListenKeyboard.prototype.description = 'Listen for key presses on a given DOM element';

	  ListenKeyboard.prototype.icon = 'keyboard-o';

	  function ListenKeyboard() {
	    this.keypress = bind(this.keypress, this);
	    this.elements = [];
	    this.inPorts = {
	      element: new noflo.Port('object'),
	      stop: new noflo.Port('object')
	    };
	    this.outPorts = {
	      keypress: new noflo.Port('int')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(element) {
	        return _this.subscribe(element);
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function(element) {
	        return _this.unsubscribe(element);
	      };
	    })(this));
	  }

	  ListenKeyboard.prototype.subscribe = function(element) {
	    element.addEventListener('keypress', this.keypress, false);
	    return this.elements.push(element);
	  };

	  ListenKeyboard.prototype.unsubscribe = function(element) {
	    if (-1 === this.elements.indexOf(element)) {
	      return;
	    }
	    element.removeEventListener('keypress', this.keypress, false);
	    return this.elements.splice(this.elements.indexOf(element), 1);
	  };

	  ListenKeyboard.prototype.keypress = function(event) {
	    if (!this.outPorts.keypress.isAttached()) {
	      return;
	    }
	    this.outPorts.keypress.send(event.keyCode);
	    return this.outPorts.keypress.disconnect();
	  };

	  ListenKeyboard.prototype.shutdown = function() {
	    var element, i, len, ref, results;
	    ref = this.elements;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      element = ref[i];
	      results.push(this.unsubscribe(element));
	    }
	    return results;
	  };

	  return ListenKeyboard;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenKeyboard;
	};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var ListenKeyboardShortcuts, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenKeyboardShortcuts = (function(superClass) {
	  extend(ListenKeyboardShortcuts, superClass);

	  ListenKeyboardShortcuts.prototype.description = 'Listen for keyboard shortcuts and route them';

	  ListenKeyboardShortcuts.prototype.icon = 'keyboard-o';

	  function ListenKeyboardShortcuts() {
	    this.keypress = bind(this.keypress, this);
	    this.keys = [];
	    this.ignoreInput = true;
	    this.inPorts = {
	      keys: new noflo.Port('string'),
	      ignoreinput: new noflo.Port('boolean'),
	      stop: new noflo.Port('bang')
	    };
	    this.outPorts = {
	      shortcut: new noflo.ArrayPort('bang'),
	      missed: new noflo.Port('int')
	    };
	    this.inPorts.keys.on('data', (function(_this) {
	      return function(data) {
	        _this.keys = _this.normalizeKeys(data);
	        return _this.subscribe();
	      };
	    })(this));
	    this.inPorts.ignoreinput.on('data', (function(_this) {
	      return function(data) {
	        return _this.ignoreInput = String(data) === 'true';
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function() {
	        return _this.unsubscribe();
	      };
	    })(this));
	  }

	  ListenKeyboardShortcuts.prototype.subscribe = function() {
	    return document.addEventListener('keydown', this.keypress, false);
	  };

	  ListenKeyboardShortcuts.prototype.unsubscribe = function() {
	    return document.removeEventListener('keydown', this.keypress, false);
	  };

	  ListenKeyboardShortcuts.prototype.normalizeKeys = function(data) {
	    var i, index, key, keys, len;
	    keys = data.split(',');
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
	          break;
	        case 's':
	          keys[index] = 83;
	      }
	    }
	    return keys;
	  };

	  ListenKeyboardShortcuts.prototype.validateTarget = function(event) {
	    if (!this.ignoreInput) {
	      return true;
	    }
	    if (event.target.tagName === 'TEXTAREA') {
	      return false;
	    }
	    if (event.target.tagName === 'INPUT') {
	      return false;
	    }
	    if (String(event.target.contentEditable) === 'true') {
	      return false;
	    }
	    return true;
	  };

	  ListenKeyboardShortcuts.prototype.keypress = function(event) {
	    var route;
	    if (!(event.ctrlKey || event.metaKey)) {
	      return;
	    }
	    if (!this.validateTarget(event)) {
	      return;
	    }
	    route = this.keys.indexOf(event.keyCode);
	    if (route === -1) {
	      if (this.outPorts.missed.isAttached()) {
	        this.outPorts.missed.send(event.keyCode);
	        this.outPorts.missed.disconnect();
	      }
	      return;
	    }
	    event.preventDefault();
	    event.stopPropagation();
	    this.outPorts.shortcut.send(event.keyCode, route);
	    return this.outPorts.shortcut.disconnect();
	  };

	  ListenKeyboardShortcuts.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenKeyboardShortcuts;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenKeyboardShortcuts;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var ListenMouse, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenMouse = (function(superClass) {
	  extend(ListenMouse, superClass);

	  ListenMouse.prototype.description = 'Listen to mouse events on a DOM element';

	  function ListenMouse() {
	    this.dblclick = bind(this.dblclick, this);
	    this.click = bind(this.click, this);
	    this.elements = [];
	    this.inPorts = {
	      element: new noflo.Port('object')
	    };
	    this.outPorts = {
	      click: new noflo.ArrayPort('object'),
	      dblclick: new noflo.ArrayPort('object')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(element) {
	        return _this.subscribe(element);
	      };
	    })(this));
	  }

	  ListenMouse.prototype.subscribe = function(element) {
	    element.addEventListener('click', this.click, false);
	    element.addEventListener('dblclick', this.dblclick, false);
	    return this.elements.push(element);
	  };

	  ListenMouse.prototype.unsubscribe = function() {
	    var element, i, len, ref;
	    ref = this.elements;
	    for (i = 0, len = ref.length; i < len; i++) {
	      element = ref[i];
	      element.removeEventListener('click', this.click, false);
	      element.removeEventListener('dblclick', this.dblclick, false);
	    }
	    return this.elements = [];
	  };

	  ListenMouse.prototype.click = function(event) {
	    if (!this.outPorts.click.sockets.length) {
	      return;
	    }
	    event.preventDefault();
	    event.stopPropagation();
	    this.outPorts.click.send(event);
	    this.outPorts.click.disconnect();
	    return this.updateIcon();
	  };

	  ListenMouse.prototype.dblclick = function(event) {
	    if (!this.outPorts.dblclick.sockets.length) {
	      return;
	    }
	    event.preventDefault();
	    event.stopPropagation();
	    this.outPorts.dblclick.send(event);
	    this.outPorts.dblclick.disconnect();
	    return this.updateIcon();
	  };

	  ListenMouse.prototype.updateIcon = function() {
	    if (!this.setIcon) {
	      return;
	    }
	    if (this.timeout) {
	      return;
	    }
	    this.originalIcon = this.getIcon();
	    this.setIcon('exclamation-circle');
	    return this.timeout = setTimeout((function(_this) {
	      return function() {
	        _this.setIcon(_this.originalIcon);
	        return _this.timeout = null;
	      };
	    })(this), 200);
	  };

	  ListenMouse.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenMouse;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenMouse;
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var ListenPointer, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenPointer = (function(superClass) {
	  extend(ListenPointer, superClass);

	  ListenPointer.prototype.description = 'Listen to pointer events on a DOM element';

	  function ListenPointer() {
	    this.pointerLeave = bind(this.pointerLeave, this);
	    this.pointerEnter = bind(this.pointerEnter, this);
	    this.pointerOut = bind(this.pointerOut, this);
	    this.pointerOver = bind(this.pointerOver, this);
	    this.pointerMove = bind(this.pointerMove, this);
	    this.pointerCancel = bind(this.pointerCancel, this);
	    this.pointerUp = bind(this.pointerUp, this);
	    this.pointerDown = bind(this.pointerDown, this);
	    this.action = 'none';
	    this.capture = false;
	    this.propagate = false;
	    this.elements = [];
	    this.inPorts = {
	      element: new noflo.Port('object'),
	      action: new noflo.Port('string'),
	      capture: new noflo.Port('boolean'),
	      propagate: new noflo.Port('boolean')
	    };
	    this.outPorts = {
	      down: new noflo.Port('object'),
	      up: new noflo.Port('object'),
	      cancel: new noflo.Port('object'),
	      move: new noflo.Port('object'),
	      over: new noflo.Port('object'),
	      out: new noflo.Port('object'),
	      enter: new noflo.Port('object'),
	      leave: new noflo.Port('object')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(element) {
	        return _this.subscribe(element);
	      };
	    })(this));
	    this.inPorts.action.on('data', (function(_this) {
	      return function(action) {
	        _this.action = action;
	      };
	    })(this));
	    this.inPorts.capture.on('data', (function(_this) {
	      return function(capture) {
	        _this.capture = capture;
	      };
	    })(this));
	    this.inPorts.propagate.on('data', (function(_this) {
	      return function(propagate) {
	        _this.propagate = propagate;
	      };
	    })(this));
	  }

	  ListenPointer.prototype.subscribe = function(element) {
	    if (element.setAttribute) {
	      element.setAttribute('touch-action', this.action);
	    }
	    element.addEventListener('pointerdown', this.pointerDown, this.capture);
	    element.addEventListener('pointerup', this.pointerUp, this.capture);
	    element.addEventListener('pointercancel', this.pointerCancel, this.capture);
	    element.addEventListener('pointermove', this.pointerMove, this.capture);
	    element.addEventListener('pointerover', this.pointerOver, this.capture);
	    element.addEventListener('pointerout', this.pointerOut, this.capture);
	    element.addEventListener('pointerenter', this.pointerEnter, this.capture);
	    element.addEventListener('pointerleave', this.pointerLeave, this.capture);
	    return this.elements.push(element);
	  };

	  ListenPointer.prototype.unsubscribe = function(element) {
	    var name, port, ref, results;
	    if (element.removeAttribute) {
	      element.removeAttribute('touch-action');
	    }
	    element.removeEventListener('pointerdown', this.pointerDown, this.capture);
	    element.removeEventListener('pointerup', this.pointerUp, this.capture);
	    element.removeEventListener('pointercancel', this.pointerCancel, this.capture);
	    element.removeEventListener('pointermove', this.pointerMove, this.capture);
	    element.removeEventListener('pointerover', this.pointerOver, this.capture);
	    element.removeEventListener('pointerout', this.pointerOut, this.capture);
	    element.removeEventListener('pointerenter', this.pointerEnter, this.capture);
	    element.removeEventListener('pointerleave', this.pointerLeave, this.capture);
	    ref = this.outPorts;
	    results = [];
	    for (name in ref) {
	      port = ref[name];
	      if (!port.isAttached()) {
	        continue;
	      }
	      results.push(port.disconnect());
	    }
	    return results;
	  };

	  ListenPointer.prototype.shutdown = function() {
	    var element, i, len, ref;
	    ref = this.elements;
	    for (i = 0, len = ref.length; i < len; i++) {
	      element = ref[i];
	      this.unsubscribe(element);
	    }
	    return this.elements = [];
	  };

	  ListenPointer.prototype.pointerDown = function(event) {
	    return this.handle(event, 'down');
	  };

	  ListenPointer.prototype.pointerUp = function(event) {
	    return this.handle(event, 'up');
	  };

	  ListenPointer.prototype.pointerCancel = function(event) {
	    return this.handle(event, 'cancel');
	  };

	  ListenPointer.prototype.pointerMove = function(event) {
	    return this.handle(event, 'move');
	  };

	  ListenPointer.prototype.pointerOver = function(event) {
	    return this.handle(event, 'over');
	  };

	  ListenPointer.prototype.pointerOut = function(event) {
	    return this.handle(event, 'out');
	  };

	  ListenPointer.prototype.pointerEnter = function(event) {
	    return this.handle(event, 'enter');
	  };

	  ListenPointer.prototype.pointerLeave = function(event) {
	    return this.handle(event, 'leave');
	  };

	  ListenPointer.prototype.handle = function(event, type) {
	    var name, port, ref, results;
	    event.preventDefault();
	    if (!this.propagate) {
	      event.stopPropagation();
	    }
	    if (!this.outPorts[type].isAttached()) {
	      return;
	    }
	    this.outPorts[type].beginGroup(event.pointerId);
	    this.outPorts[type].send(event);
	    this.outPorts[type].endGroup();
	    if (type === 'up' || type === 'cancel' || type === 'leave') {
	      ref = this.outPorts;
	      results = [];
	      for (name in ref) {
	        port = ref[name];
	        if (!port.isAttached()) {
	          continue;
	        }
	        results.push(port.disconnect());
	      }
	      return results;
	    }
	  };

	  return ListenPointer;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenPointer;
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var ListenResize, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenResize = (function(superClass) {
	  extend(ListenResize, superClass);

	  ListenResize.prototype.description = 'Listen to window resize events';

	  ListenResize.prototype.icon = 'desktop';

	  function ListenResize() {
	    this.sendSize = bind(this.sendSize, this);
	    this.inPorts = {
	      start: new noflo.Port('bang'),
	      stop: new noflo.Port('bang')
	    };
	    this.outPorts = {
	      width: new noflo.Port('number'),
	      height: new noflo.Port('number')
	    };
	    this.inPorts.start.on('data', (function(_this) {
	      return function() {
	        _this.sendSize();
	        return _this.subscribe();
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function() {
	        return _this.unsubscribe();
	      };
	    })(this));
	  }

	  ListenResize.prototype.subscribe = function() {
	    return window.addEventListener('resize', this.sendSize, false);
	  };

	  ListenResize.prototype.unsubscribe = function() {
	    return window.removeEventListener('resize', this.sendSize, false);
	  };

	  ListenResize.prototype.sendSize = function() {
	    if (this.outPorts.width.isAttached()) {
	      this.outPorts.width.send(window.innerWidth);
	      this.outPorts.width.disconnect();
	    }
	    if (this.outPorts.height.isAttached()) {
	      this.outPorts.height.send(window.innerHeight);
	      return this.outPorts.height.disconnect();
	    }
	  };

	  ListenResize.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenResize;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenResize;
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var ListenScroll, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenScroll = (function(superClass) {
	  extend(ListenScroll, superClass);

	  ListenScroll.prototype.description = 'Listen to scroll events on the browser window';

	  ListenScroll.prototype.icon = 'arrows-v';

	  function ListenScroll() {
	    this.scroll = bind(this.scroll, this);
	    this.inPorts = {
	      start: new noflo.Port('bang'),
	      stop: new noflo.Port('bang')
	    };
	    this.outPorts = {
	      top: new noflo.Port('number'),
	      bottom: new noflo.Port('number'),
	      left: new noflo.Port('number'),
	      right: new noflo.Port('number')
	    };
	    this.inPorts.start.on('data', (function(_this) {
	      return function() {
	        return _this.subscribe();
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function() {
	        return _this.unsubscribe();
	      };
	    })(this));
	  }

	  ListenScroll.prototype.subscribe = function() {
	    return window.addEventListener('scroll', this.scroll, false);
	  };

	  ListenScroll.prototype.unsubscribe = function() {
	    return window.removeEventListener('scroll', this.scroll, false);
	  };

	  ListenScroll.prototype.scroll = function(event) {
	    var bottom, left, right, top;
	    top = window.scrollY;
	    left = window.scrollX;
	    if (this.outPorts.top.isAttached()) {
	      this.outPorts.top.send(top);
	      this.outPorts.top.disconnect();
	    }
	    if (this.outPorts.bottom.isAttached()) {
	      bottom = top + window.innerHeight;
	      this.outPorts.bottom.send(bottom);
	      this.outPorts.bottom.disconnect();
	    }
	    if (this.outPorts.left.isAttached()) {
	      this.outPorts.left.send(left);
	      this.outPorts.left.disconnect();
	    }
	    if (this.outPorts.right.isAttached()) {
	      right = left + window.innerWidth;
	      this.outPorts.right.send(right);
	      return this.outPorts.right.disconnect();
	    }
	  };

	  ListenScroll.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenScroll;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenScroll;
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var ListenSpeech, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenSpeech = (function(superClass) {
	  extend(ListenSpeech, superClass);

	  ListenSpeech.prototype.description = 'Listen for user\'s microphone and recognize phrases';

	  ListenSpeech.prototype.icon = 'microphone';

	  function ListenSpeech() {
	    this.handleError = bind(this.handleError, this);
	    this.handleResult = bind(this.handleResult, this);
	    this.recognition = false;
	    this.sent = [];
	    this.inPorts = {
	      start: new noflo.Port('bang'),
	      stop: new noflo.Port('bang')
	    };
	    this.outPorts = {
	      result: new noflo.Port('string'),
	      error: new noflo.Port('object')
	    };
	    this.inPorts.start.on('data', (function(_this) {
	      return function() {
	        return _this.startListening();
	      };
	    })(this));
	    this.inPorts.stop.on('data', (function(_this) {
	      return function() {
	        return _this.stopListening();
	      };
	    })(this));
	  }

	  ListenSpeech.prototype.startListening = function() {
	    if (!window.webkitSpeechRecognition) {
	      this.handleError(new Error('Speech recognition support not available'));
	    }
	    this.recognition = new window.webkitSpeechRecognition;
	    this.recognition.continuous = true;
	    this.recognition.start();
	    this.outPorts.result.connect();
	    this.recognition.onresult = this.handleResult;
	    return this.recognition.onerror = this.handleError;
	  };

	  ListenSpeech.prototype.handleResult = function(event) {
	    var i, idx, len, ref, result, results;
	    ref = event.results;
	    results = [];
	    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
	      result = ref[idx];
	      if (!result.isFinal) {
	        continue;
	      }
	      if (this.sent.indexOf(idx) !== -1) {
	        continue;
	      }
	      this.outPorts.result.send(result[0].transcript);
	      results.push(this.sent.push(idx));
	    }
	    return results;
	  };

	  ListenSpeech.prototype.handleError = function(error) {
	    if (this.outPorts.error.isAttached()) {
	      this.outPorts.error.send(error);
	      this.outPorts.error.disconnect();
	      return;
	    }
	    throw error;
	  };

	  ListenSpeech.prototype.stopListening = function() {
	    if (!this.recognition) {
	      return;
	    }
	    this.outPorts.result.disconnect();
	    this.recognition.stop();
	    this.recognition = null;
	    return this.sent = [];
	  };

	  ListenSpeech.prototype.shutdown = function() {
	    return this.stopListening();
	  };

	  return ListenSpeech;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenSpeech;
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var ListenTouch, noflo,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ListenTouch = (function(superClass) {
	  extend(ListenTouch, superClass);

	  ListenTouch.prototype.description = 'Listen to touch events on a DOM element';

	  ListenTouch.prototype.icon = 'hand-o-up';

	  function ListenTouch() {
	    this.touchend = bind(this.touchend, this);
	    this.touchmove = bind(this.touchmove, this);
	    this.touchstart = bind(this.touchstart, this);
	    this.elements = [];
	    this.inPorts = {
	      element: new noflo.Port('object')
	    };
	    this.outPorts = {
	      start: new noflo.ArrayPort('object'),
	      movex: new noflo.ArrayPort('number'),
	      movey: new noflo.ArrayPort('number'),
	      end: new noflo.ArrayPort('object')
	    };
	    this.inPorts.element.on('data', (function(_this) {
	      return function(element) {
	        return _this.subscribe(element);
	      };
	    })(this));
	  }

	  ListenTouch.prototype.subscribe = function(element) {
	    element.addEventListener('touchstart', this.touchstart, false);
	    element.addEventListener('touchmove', this.touchmove, false);
	    element.addEventListener('touchend', this.touchend, false);
	    return this.elements.push(element);
	  };

	  ListenTouch.prototype.unsubscribe = function() {
	    var element, i, len, ref;
	    ref = this.elements;
	    for (i = 0, len = ref.length; i < len; i++) {
	      element = ref[i];
	      element.removeEventListener('touchstart', this.touchstart, false);
	      element.removeEventListener('touchmove', this.touchmove, false);
	      element.removeEventListener('touchend', this.touchend, false);
	    }
	    return this.elements = [];
	  };

	  ListenTouch.prototype.touchstart = function(event) {
	    var i, idx, len, ref, touch;
	    event.preventDefault();
	    event.stopPropagation();
	    if (!event.changedTouches) {
	      return;
	    }
	    if (!event.changedTouches.length) {
	      return;
	    }
	    ref = event.changedTouches;
	    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
	      touch = ref[idx];
	      this.outPorts.start.beginGroup(idx);
	      this.outPorts.start.send(event);
	      this.outPorts.start.endGroup();
	    }
	    return this.outPorts.start.disconnect();
	  };

	  ListenTouch.prototype.touchmove = function(event) {
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
	      this.outPorts.movex.beginGroup(idx);
	      this.outPorts.movex.send(touch.pageX);
	      this.outPorts.movex.endGroup();
	      this.outPorts.movey.beginGroup(idx);
	      this.outPorts.movey.send(touch.pageY);
	      results.push(this.outPorts.movey.endGroup());
	    }
	    return results;
	  };

	  ListenTouch.prototype.touchend = function(event) {
	    var i, idx, len, ref, touch;
	    event.preventDefault();
	    event.stopPropagation();
	    if (!event.changedTouches) {
	      return;
	    }
	    if (!event.changedTouches.length) {
	      return;
	    }
	    if (this.outPorts.movex.isConnected()) {
	      this.outPorts.movex.disconnect();
	    }
	    if (this.outPorts.movey.isConnected()) {
	      this.outPorts.movey.disconnect();
	    }
	    ref = event.changedTouches;
	    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
	      touch = ref[idx];
	      this.outPorts.end.beginGroup(idx);
	      this.outPorts.end.send(event);
	      this.outPorts.end.endGroup();
	    }
	    return this.outPorts.end.disconnect();
	  };

	  ListenTouch.prototype.shutdown = function() {
	    return this.unsubscribe();
	  };

	  return ListenTouch;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ListenTouch;
	};


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var ReadCoordinates, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ReadCoordinates = (function(superClass) {
	  extend(ReadCoordinates, superClass);

	  ReadCoordinates.prototype.description = 'Read the coordinates from a DOM event';

	  function ReadCoordinates() {
	    this.inPorts = {
	      event: new noflo.Port('object')
	    };
	    this.outPorts = {
	      screen: new noflo.Port('object'),
	      client: new noflo.Port('object'),
	      page: new noflo.Port('object')
	    };
	    this.inPorts.event.on('begingroup', (function(_this) {
	      return function(group) {
	        if (_this.outPorts.screen.isAttached()) {
	          _this.outPorts.screen.beginGroup(group);
	        }
	        if (_this.outPorts.client.isAttached()) {
	          _this.outPorts.client.beginGroup(group);
	        }
	        if (_this.outPorts.page.isAttached()) {
	          return _this.outPorts.page.beginGroup(group);
	        }
	      };
	    })(this));
	    this.inPorts.event.on('data', (function(_this) {
	      return function(data) {
	        return _this.read(data);
	      };
	    })(this));
	    this.inPorts.event.on('endgroup', (function(_this) {
	      return function() {
	        if (_this.outPorts.screen.isAttached()) {
	          _this.outPorts.screen.endGroup();
	        }
	        if (_this.outPorts.client.isAttached()) {
	          _this.outPorts.client.endGroup();
	        }
	        if (_this.outPorts.page.isAttached()) {
	          return _this.outPorts.page.endGroup();
	        }
	      };
	    })(this));
	    this.inPorts.event.on('disconnect', (function(_this) {
	      return function() {
	        if (_this.outPorts.screen.isAttached()) {
	          _this.outPorts.screen.disconnect();
	        }
	        if (_this.outPorts.client.isAttached()) {
	          _this.outPorts.client.disconnect();
	        }
	        if (_this.outPorts.page.isAttached()) {
	          return _this.outPorts.page.disconnect();
	        }
	      };
	    })(this));
	  }

	  ReadCoordinates.prototype.read = function(event) {
	    if (!event) {
	      return;
	    }
	    if (this.outPorts.screen.isAttached() && event.screenX !== void 0) {
	      this.outPorts.screen.send({
	        x: event.screenX,
	        y: event.screenY
	      });
	    }
	    if (this.outPorts.client.isAttached() && event.clientX !== void 0) {
	      this.outPorts.client.send({
	        x: event.clientX,
	        y: event.clientY
	      });
	    }
	    if (this.outPorts.page.isAttached() && event.pageX !== void 0) {
	      return this.outPorts.page.send({
	        x: event.pageX,
	        y: event.pageY
	      });
	    }
	  };

	  return ReadCoordinates;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ReadCoordinates;
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var ReadGamepad, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	ReadGamepad = (function(superClass) {
	  extend(ReadGamepad, superClass);

	  ReadGamepad.prototype.description = 'Read the state of a gamepad';

	  ReadGamepad.prototype.icon = 'gamepad';

	  function ReadGamepad() {
	    this.lastTimestamp;
	    this.inPorts = {
	      gamepad: new noflo.Port('int')
	    };
	    this.outPorts = {
	      out: new noflo.Port('object'),
	      error: new noflo.Port('string')
	    };
	    this.inPorts.gamepad.on('data', (function(_this) {
	      return function(number) {
	        return _this.readGamepad(number);
	      };
	    })(this));
	  }

	  ReadGamepad.prototype.readGamepad = function(number) {
	    var gamepadState, msg;
	    if (!navigator.webkitGetGamepads) {
	      msg = "no webkit gamepad api available";
	      if (this.outPorts.error.isAttached()) {
	        this.outPorts.error.send(msg);
	        this.outPorts.error.disconnect();
	        return;
	      } else {
	        throw new Error(msg);
	      }
	    }
	    gamepadState = navigator.webkitGetGamepads()[number];
	    if (!gamepadState) {
	      msg = "state for gamepad '" + number + "' could not been read";
	      if (this.outPorts.error.isAttached()) {
	        this.outPorts.error.send(msg);
	        this.outPorts.error.disconnect();
	        return;
	      } else {
	        throw new Error(msg);
	      }
	    }
	    if (this.lastTimestamp !== gamepadState.timestamp) {
	      this.lastTimestamp = gamepadState.timestamp;
	      return this.outPorts.out.send(gamepadState);
	    }
	  };

	  return ReadGamepad;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new ReadGamepad;
	};


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var SetHash, noflo,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	noflo = __webpack_require__(1);

	SetHash = (function(superClass) {
	  extend(SetHash, superClass);

	  SetHash.prototype.description = 'Set the hash in browser\'s URL bar';

	  SetHash.prototype.icon = 'slack';

	  function SetHash() {
	    this.inPorts = {
	      hash: new noflo.ArrayPort('string')
	    };
	    this.outPorts = {
	      out: new noflo.Port('string')
	    };
	    this.inPorts.hash.on('data', (function(_this) {
	      return function(data) {
	        window.location.hash = "#" + data;
	        if (_this.outPorts.out.isAttached()) {
	          return _this.outPorts.out.send(data);
	        }
	      };
	    })(this));
	    this.inPorts.hash.on('disconnect', (function(_this) {
	      return function() {
	        if (_this.outPorts.out.isAttached()) {
	          return _this.outPorts.out.disconnect();
	        }
	      };
	    })(this));
	  }

	  return SetHash;

	})(noflo.Component);

	exports.getComponent = function() {
	  return new SetHash;
	};


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var Component, EventEmitter, IP, PortBuffer, ProcessInput, ProcessOutput, ports,
	    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    __slice = [].slice;

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  ports = __webpack_require__(69);

	  IP = __webpack_require__(14);

	  Component = (function(_super) {
	    __extends(Component, _super);

	    Component.prototype.description = '';

	    Component.prototype.icon = null;

	    function Component(options) {
	      this.error = __bind(this.error, this);
	      var _ref, _ref1, _ref2;
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
	      this.ordered = (_ref = options.ordered) != null ? _ref : false;
	      this.autoOrdering = (_ref1 = options.autoOrdering) != null ? _ref1 : null;
	      this.outputQ = [];
	      this.activateOnInput = (_ref2 = options.activateOnInput) != null ? _ref2 : true;
	      this.forwardBrackets = {
	        "in": ['out', 'error']
	      };
	      this.bracketCounter = {};
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

	    Component.prototype.error = function(e, groups, errorPort) {
	      var group, _i, _j, _len, _len1;
	      if (groups == null) {
	        groups = [];
	      }
	      if (errorPort == null) {
	        errorPort = 'error';
	      }
	      if (this.outPorts[errorPort] && (this.outPorts[errorPort].isAttached() || !this.outPorts[errorPort].isRequired())) {
	        for (_i = 0, _len = groups.length; _i < _len; _i++) {
	          group = groups[_i];
	          this.outPorts[errorPort].beginGroup(group);
	        }
	        this.outPorts[errorPort].send(e);
	        for (_j = 0, _len1 = groups.length; _j < _len1; _j++) {
	          group = groups[_j];
	          this.outPorts[errorPort].endGroup();
	        }
	        this.outPorts[errorPort].disconnect();
	        return;
	      }
	      throw e;
	    };

	    Component.prototype.shutdown = function() {
	      return this.started = false;
	    };

	    Component.prototype.start = function() {
	      this.started = true;
	      return this.started;
	    };

	    Component.prototype.isStarted = function() {
	      return this.started;
	    };

	    Component.prototype.prepareForwarding = function() {
	      var inPort, outPort, outPorts, tmp, _i, _len, _ref, _results;
	      _ref = this.forwardBrackets;
	      _results = [];
	      for (inPort in _ref) {
	        outPorts = _ref[inPort];
	        if (!(inPort in this.inPorts.ports)) {
	          delete this.forwardBrackets[inPort];
	          continue;
	        }
	        tmp = [];
	        for (_i = 0, _len = outPorts.length; _i < _len; _i++) {
	          outPort = outPorts[_i];
	          if (outPort in this.outPorts.ports) {
	            tmp.push(outPort);
	          }
	        }
	        if (tmp.length === 0) {
	          _results.push(delete this.forwardBrackets[inPort]);
	        } else {
	          this.forwardBrackets[inPort] = tmp;
	          _results.push(this.bracketCounter[inPort] = 0);
	        }
	      }
	      return _results;
	    };

	    Component.prototype.process = function(handle) {
	      var name, port, _fn, _ref;
	      if (typeof handle !== 'function') {
	        throw new Error("Process handler must be a function");
	      }
	      if (!this.inPorts) {
	        throw new Error("Component ports must be defined before process function");
	      }
	      this.prepareForwarding();
	      this.handle = handle;
	      _ref = this.inPorts.ports;
	      _fn = (function(_this) {
	        return function(name, port) {
	          if (!port.name) {
	            port.name = name;
	          }
	          return port.on('ip', function(ip) {
	            return _this.handleIP(ip, port);
	          });
	        };
	      })(this);
	      for (name in _ref) {
	        port = _ref[name];
	        _fn(name, port);
	      }
	      return this;
	    };

	    Component.prototype.handleIP = function(ip, port) {
	      var input, outPort, output, outputEntry, result, _i, _len, _ref;
	      if (ip.type === 'openBracket') {
	        if (this.autoOrdering === null) {
	          this.autoOrdering = true;
	        }
	        this.bracketCounter[port.name]++;
	      }
	      if (port.name in this.forwardBrackets && (ip.type === 'openBracket' || ip.type === 'closeBracket')) {
	        outputEntry = {
	          __resolved: true,
	          __forwarded: true,
	          __type: ip.type,
	          __scope: ip.scope
	        };
	        _ref = this.forwardBrackets[port.name];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          outPort = _ref[_i];
	          if (!(outPort in outputEntry)) {
	            outputEntry[outPort] = [];
	          }
	          outputEntry[outPort].push(ip);
	        }
	        port.buffer.pop();
	        this.outputQ.push(outputEntry);
	        this.processOutputQueue();
	        return;
	      }
	      if (!port.options.triggering) {
	        return;
	      }
	      result = {};
	      input = new ProcessInput(this.inPorts, ip, this, port, result);
	      output = new ProcessOutput(this.outPorts, ip, this, result);
	      this.load++;
	      return this.handle(input, output, function() {
	        return output.done();
	      });
	    };

	    Component.prototype.processOutputQueue = function() {
	      var bracketsClosed, ip, ips, name, port, result, _i, _len, _ref;
	      while (this.outputQ.length > 0) {
	        result = this.outputQ[0];
	        if (!result.__resolved) {
	          break;
	        }
	        for (port in result) {
	          ips = result[port];
	          if (port.indexOf('__') === 0) {
	            continue;
	          }
	          if (!this.outPorts.ports[port].isAttached()) {
	            continue;
	          }
	          for (_i = 0, _len = ips.length; _i < _len; _i++) {
	            ip = ips[_i];
	            if (ip.type === 'closeBracket') {
	              this.bracketCounter[port]--;
	            }
	            this.outPorts[port].sendIP(ip);
	          }
	        }
	        this.outputQ.shift();
	      }
	      bracketsClosed = true;
	      _ref = this.outPorts.ports;
	      for (name in _ref) {
	        port = _ref[name];
	        if (this.bracketCounter[port] !== 0) {
	          bracketsClosed = false;
	          break;
	        }
	      }
	      if (bracketsClosed && this.autoOrdering === true) {
	        return this.autoOrdering = null;
	      }
	    };

	    return Component;

	  })(EventEmitter);

	  exports.Component = Component;

	  ProcessInput = (function() {
	    function ProcessInput(ports, ip, nodeInstance, port, result) {
	      this.ports = ports;
	      this.ip = ip;
	      this.nodeInstance = nodeInstance;
	      this.port = port;
	      this.result = result;
	      this.scope = this.ip.scope;
	      this.buffer = new PortBuffer(this);
	    }

	    ProcessInput.prototype.activate = function() {
	      this.result.__resolved = false;
	      if (this.nodeInstance.ordered || this.nodeInstance.autoOrdering) {
	        return this.nodeInstance.outputQ.push(this.result);
	      }
	    };

	    ProcessInput.prototype.has = function() {
	      var args, port, res, validate, _i, _j, _len, _len1;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      if (!args.length) {
	        args = ['in'];
	      }
	      if (typeof args[args.length - 1] === 'function') {
	        validate = args.pop();
	        for (_i = 0, _len = args.length; _i < _len; _i++) {
	          port = args[_i];
	          if (!this.ports[port].has(this.scope, validate)) {
	            return false;
	          }
	        }
	        return true;
	      }
	      res = true;
	      for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
	        port = args[_j];
	        res && (res = this.ports[port].ready(this.scope));
	      }
	      return res;
	    };

	    ProcessInput.prototype.get = function() {
	      var args, port, res;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      if (!args.length) {
	        args = ['in'];
	      }
	      if ((this.nodeInstance.ordered || this.nodeInstance.autoOrdering) && this.nodeInstance.activateOnInput && !('__resolved' in this.result)) {
	        this.activate();
	      }
	      res = (function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = args.length; _i < _len; _i++) {
	          port = args[_i];
	          _results.push(this.ports[port].get(this.scope));
	        }
	        return _results;
	      }).call(this);
	      if (args.length === 1) {
	        return res[0];
	      } else {
	        return res;
	      }
	    };

	    ProcessInput.prototype.getData = function() {
	      var args, ip, ips, _i, _len, _ref, _ref1, _results;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      if (!args.length) {
	        args = ['in'];
	      }
	      ips = this.get.apply(this, args);
	      if (args.length === 1) {
	        return (_ref = ips != null ? ips.data : void 0) != null ? _ref : void 0;
	      }
	      _results = [];
	      for (_i = 0, _len = ips.length; _i < _len; _i++) {
	        ip = ips[_i];
	        _results.push((_ref1 = ip != null ? ip.data : void 0) != null ? _ref1 : void 0);
	      }
	      return _results;
	    };

	    return ProcessInput;

	  })();

	  PortBuffer = (function() {
	    function PortBuffer(context) {
	      this.context = context;
	    }

	    PortBuffer.prototype.set = function(name, buffer) {
	      if ((name != null) && typeof name !== 'string') {
	        buffer = name;
	        name = null;
	      }
	      if (this.context.scope != null) {
	        if (name != null) {
	          this.context.ports[name].scopedBuffer[this.context.scope] = buffer;
	          return this.context.ports[name].scopedBuffer[this.context.scope];
	        }
	        this.context.port.scopedBuffer[this.context.scope] = buffer;
	        return this.context.port.scopedBuffer[this.context.scope];
	      }
	      if (name != null) {
	        this.context.ports[name].buffer = buffer;
	        return this.context.ports[name].buffer;
	      }
	      this.context.port.buffer = buffer;
	      return this.context.port.buffer;
	    };

	    PortBuffer.prototype.get = function(name) {
	      if (name == null) {
	        name = null;
	      }
	      if (this.context.scope != null) {
	        if (name != null) {
	          return this.context.ports[name].scopedBuffer[this.context.scope];
	        }
	        return this.context.port.scopedBuffer[this.context.scope];
	      }
	      if (name != null) {
	        return this.context.ports[name].buffer;
	      }
	      return this.context.port.buffer;
	    };

	    PortBuffer.prototype.find = function(name, cb) {
	      var b;
	      b = this.get(name);
	      return b.filter(cb);
	    };

	    PortBuffer.prototype.filter = function(name, cb) {
	      var b;
	      if ((name != null) && typeof name !== 'string') {
	        cb = name;
	        name = null;
	      }
	      b = this.get(name);
	      b = b.filter(cb);
	      return this.set(name, b);
	    };

	    return PortBuffer;

	  })();

	  ProcessOutput = (function() {
	    function ProcessOutput(ports, ip, nodeInstance, result) {
	      this.ports = ports;
	      this.ip = ip;
	      this.nodeInstance = nodeInstance;
	      this.result = result;
	      this.scope = this.ip.scope;
	    }

	    ProcessOutput.prototype.activate = function() {
	      this.result.__resolved = false;
	      if (this.nodeInstance.ordered || this.nodeInstance.autoOrdering) {
	        return this.nodeInstance.outputQ.push(this.result);
	      }
	    };

	    ProcessOutput.prototype.isError = function(err) {
	      return err instanceof Error || Array.isArray(err) && err.length > 0 && err[0] instanceof Error;
	    };

	    ProcessOutput.prototype.error = function(err) {
	      var e, multiple, _i, _j, _len, _len1, _results;
	      multiple = Array.isArray(err);
	      if (!multiple) {
	        err = [err];
	      }
	      if ('error' in this.ports && (this.ports.error.isAttached() || !this.ports.error.isRequired())) {
	        if (multiple) {
	          this.sendIP('error', new IP('openBracket'));
	        }
	        for (_i = 0, _len = err.length; _i < _len; _i++) {
	          e = err[_i];
	          this.sendIP('error', e);
	        }
	        if (multiple) {
	          return this.sendIP('error', new IP('closeBracket'));
	        }
	      } else {
	        _results = [];
	        for (_j = 0, _len1 = err.length; _j < _len1; _j++) {
	          e = err[_j];
	          throw e;
	        }
	        return _results;
	      }
	    };

	    ProcessOutput.prototype.sendIP = function(port, packet) {
	      var ip;
	      if (typeof packet !== 'object' || IP.types.indexOf(packet.type) === -1) {
	        ip = new IP('data', packet);
	      } else {
	        ip = packet;
	      }
	      if (this.scope !== null && ip.scope === null) {
	        ip.scope = this.scope;
	      }
	      if (this.nodeInstance.ordered || this.nodeInstance.autoOrdering) {
	        if (!(port in this.result)) {
	          this.result[port] = [];
	        }
	        return this.result[port].push(ip);
	      } else {
	        return this.nodeInstance.outPorts[port].sendIP(ip);
	      }
	    };

	    ProcessOutput.prototype.send = function(outputMap) {
	      var componentPorts, mapIsInPorts, packet, port, _i, _len, _ref, _results;
	      if ((this.nodeInstance.ordered || this.nodeInstance.autoOrdering) && !('__resolved' in this.result)) {
	        this.activate();
	      }
	      if (this.isError(outputMap)) {
	        return this.error(outputMap);
	      }
	      componentPorts = [];
	      mapIsInPorts = false;
	      _ref = Object.keys(this.ports.ports);
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        port = _ref[_i];
	        if (port !== 'error' && port !== 'ports' && port !== '_callbacks') {
	          componentPorts.push(port);
	        }
	        if (!mapIsInPorts && typeof outputMap === 'object' && Object.keys(outputMap).indexOf(port) !== -1) {
	          mapIsInPorts = true;
	        }
	      }
	      if (componentPorts.length === 1 && !mapIsInPorts) {
	        this.sendIP(componentPorts[0], outputMap);
	        return;
	      }
	      _results = [];
	      for (port in outputMap) {
	        packet = outputMap[port];
	        _results.push(this.sendIP(port, packet));
	      }
	      return _results;
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
	      if (error) {
	        this.error(error);
	      }
	      if (this.nodeInstance.ordered || this.nodeInstance.autoOrdering) {
	        this.result.__resolved = true;
	        this.nodeInstance.processOutputQueue();
	      }
	      return this.nodeInstance.load--;
	    };

	    return ProcessOutput;

	  })();

	}).call(this);


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var EventEmitter, InPort, InPorts, OutPort, OutPorts, Ports,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  InPort = __webpack_require__(70);

	  OutPort = __webpack_require__(72);

	  Ports = (function(_super) {
	    __extends(Ports, _super);

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

	  exports.InPorts = InPorts = (function(_super) {
	    __extends(InPorts, _super);

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

	  exports.OutPorts = OutPorts = (function(_super) {
	    __extends(OutPorts, _super);

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

	}).call(this);


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var BasePort, IP, InPort,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  BasePort = __webpack_require__(71);

	  IP = __webpack_require__(14);

	  InPort = (function(_super) {
	    __extends(InPort, _super);

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
	      if (options.triggering == null) {
	        options.triggering = true;
	      }
	      if (!process && options && options.process) {
	        process = options.process;
	        delete options.process;
	      }
	      if (process) {
	        if (typeof process !== 'function') {
	          throw new Error('process must be a function');
	        }
	        this.process = process;
	      }
	      if (options.handle) {
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
	      ip.index = id;
	      if (ip.scope != null) {
	        if (!(ip.scope in this.scopedBuffer)) {
	          this.scopedBuffer[ip.scope] = [];
	        }
	        buf = this.scopedBuffer[ip.scope];
	      } else {
	        buf = this.buffer;
	      }
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
	      return this.scopedBuffer = {};
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
	      if (!this.isBuffered()) {
	        throw new Error('Receive is only possible on buffered ports');
	      }
	      return this.buffer.shift();
	    };

	    InPort.prototype.contains = function() {
	      if (!this.isBuffered()) {
	        throw new Error('Contains query is only possible on buffered ports');
	      }
	      return this.buffer.filter(function(packet) {
	        if (packet.event === 'data') {
	          return true;
	        }
	      }).length;
	    };

	    InPort.prototype.get = function(scope) {
	      var buf;
	      if (scope != null) {
	        if (!(scope in this.scopedBuffer)) {
	          return void 0;
	        }
	        buf = this.scopedBuffer[scope];
	      } else {
	        buf = this.buffer;
	      }
	      if (this.options.control) {
	        return buf[buf.length - 1];
	      } else {
	        return buf.shift();
	      }
	    };

	    InPort.prototype.has = function(scope, validate) {
	      var buf, packet;
	      if (scope != null) {
	        if (!(scope in this.scopedBuffer)) {
	          return false;
	        }
	        buf = this.scopedBuffer[scope];
	      } else {
	        if (!this.buffer.length) {
	          return false;
	        }
	        buf = this.buffer;
	      }
	      if ((function() {
	        var _i, _len, _results;
	        _results = [];
	        for (_i = 0, _len = buf.length; _i < _len; _i++) {
	          packet = buf[_i];
	          _results.push(validate(packet));
	        }
	        return _results;
	      })()) {
	        return true;
	      }
	      return false;
	    };

	    InPort.prototype.length = function(scope) {
	      if (scope != null) {
	        if (!(scope in this.scopedBuffer)) {
	          return 0;
	        }
	        return this.scopedBuffer[scope].length;
	      }
	      return this.buffer.length;
	    };

	    InPort.prototype.ready = function(scope) {
	      return this.length(scope) > 0;
	    };

	    return InPort;

	  })(BasePort);

	  module.exports = InPort;

	}).call(this);


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var BasePort, EventEmitter, validTypes,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  validTypes = ['all', 'string', 'number', 'int', 'object', 'array', 'boolean', 'color', 'date', 'bang', 'function', 'buffer', 'stream'];

	  BasePort = (function(_super) {
	    __extends(BasePort, _super);

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
	      if (options.type && options.type.indexOf('/') === -1) {
	        throw new Error("Invalid port type '" + options.type + "' specified. Should be URL or MIME type");
	      }
	      return this.options = options;
	    };

	    BasePort.prototype.getId = function() {
	      if (!(this.node && this.name)) {
	        return 'Port';
	      }
	      return "" + this.node + " " + (this.name.toUpperCase());
	    };

	    BasePort.prototype.getDataType = function() {
	      return this.options.datatype;
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
	      var attached, idx, socket, _i, _len, _ref;
	      attached = [];
	      _ref = this.sockets;
	      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
	        socket = _ref[idx];
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
	          throw new Error("" + (this.getId()) + ": Socket ID required");
	        }
	        if (!this.sockets[socketId]) {
	          throw new Error("" + (this.getId()) + ": Socket " + socketId + " not available");
	        }
	        return this.sockets[socketId].isConnected();
	      }
	      connected = false;
	      this.sockets.forEach((function(_this) {
	        return function(socket) {
	          if (!socket) {
	            return;
	          }
	          if (socket.isConnected()) {
	            return connected = true;
	          }
	        };
	      })(this));
	      return connected;
	    };

	    BasePort.prototype.canAttach = function() {
	      return true;
	    };

	    return BasePort;

	  })(EventEmitter);

	  module.exports = BasePort;

	}).call(this);


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var BasePort, IP, OutPort,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  BasePort = __webpack_require__(71);

	  IP = __webpack_require__(14);

	  OutPort = (function(_super) {
	    __extends(OutPort, _super);

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
	      var socket, sockets, _i, _len, _results;
	      if (socketId == null) {
	        socketId = null;
	      }
	      sockets = this.getSockets(socketId);
	      this.checkRequired(sockets);
	      _results = [];
	      for (_i = 0, _len = sockets.length; _i < _len; _i++) {
	        socket = sockets[_i];
	        if (!socket) {
	          continue;
	        }
	        _results.push(socket.connect());
	      }
	      return _results;
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
	      var socket, sockets, _i, _len, _results;
	      if (socketId == null) {
	        socketId = null;
	      }
	      sockets = this.getSockets(socketId);
	      this.checkRequired(sockets);
	      _results = [];
	      for (_i = 0, _len = sockets.length; _i < _len; _i++) {
	        socket = sockets[_i];
	        if (!socket) {
	          continue;
	        }
	        _results.push(socket.endGroup());
	      }
	      return _results;
	    };

	    OutPort.prototype.disconnect = function(socketId) {
	      var socket, sockets, _i, _len, _results;
	      if (socketId == null) {
	        socketId = null;
	      }
	      sockets = this.getSockets(socketId);
	      this.checkRequired(sockets);
	      _results = [];
	      for (_i = 0, _len = sockets.length; _i < _len; _i++) {
	        socket = sockets[_i];
	        if (!socket) {
	          continue;
	        }
	        _results.push(socket.disconnect());
	      }
	      return _results;
	    };

	    OutPort.prototype.sendIP = function(type, data, options, socketId) {
	      var ip, pristine, socket, sockets, _i, _len, _ref;
	      if (IP.isIP(type)) {
	        ip = type;
	        socketId = ip.index;
	      } else {
	        ip = new IP(type, data, options);
	      }
	      sockets = this.getSockets(socketId);
	      this.checkRequired(sockets);
	      if (this.isCaching() && data !== ((_ref = this.cache[socketId]) != null ? _ref.data : void 0)) {
	        this.cache[socketId] = ip;
	      }
	      pristine = true;
	      for (_i = 0, _len = sockets.length; _i < _len; _i++) {
	        socket = sockets[_i];
	        if (!socket) {
	          continue;
	        }
	        if (pristine) {
	          socket.post(ip);
	          pristine = false;
	        } else {
	          socket.post(ip.clonable ? ip.clone() : ip);
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
	        throw new Error("" + (this.getId()) + ": No connections available");
	      }
	    };

	    OutPort.prototype.getSockets = function(socketId) {
	      if (this.isAddressable()) {
	        if (socketId === null) {
	          throw new Error("" + (this.getId()) + " Socket ID required");
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


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {(function() {
	  var AsyncComponent, component, port,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  port = __webpack_require__(74);

	  component = __webpack_require__(68);

	  AsyncComponent = (function(_super) {
	    __extends(AsyncComponent, _super);

	    function AsyncComponent(inPortName, outPortName, errPortName) {
	      this.inPortName = inPortName != null ? inPortName : "in";
	      this.outPortName = outPortName != null ? outPortName : "out";
	      this.errPortName = errPortName != null ? errPortName : "error";
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

	    AsyncComponent.prototype.shutdown = function() {
	      this.q = [];
	      return this.errorGroups = [];
	    };

	    return AsyncComponent;

	  })(component.Component);

	  exports.AsyncComponent = AsyncComponent;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var EventEmitter, Port,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  Port = (function(_super) {
	    __extends(Port, _super);

	    Port.prototype.description = '';

	    Port.prototype.required = true;

	    function Port(type) {
	      this.type = type;
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
	      return "" + this.node + " " + (this.name.toUpperCase());
	    };

	    Port.prototype.getDataType = function() {
	      return this.type;
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
	      var socket, _i, _len, _ref, _results;
	      if (this.sockets.length === 0) {
	        throw new Error("" + (this.getId()) + ": No connections available");
	      }
	      _ref = this.sockets;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        socket = _ref[_i];
	        _results.push(socket.connect());
	      }
	      return _results;
	    };

	    Port.prototype.beginGroup = function(group) {
	      if (this.sockets.length === 0) {
	        throw new Error("" + (this.getId()) + ": No connections available");
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
	        throw new Error("" + (this.getId()) + ": No connections available");
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
	      var socket, _i, _len, _ref, _results;
	      if (this.sockets.length === 0) {
	        throw new Error("" + (this.getId()) + ": No connections available");
	      }
	      _ref = this.sockets;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        socket = _ref[_i];
	        _results.push(socket.endGroup());
	      }
	      return _results;
	    };

	    Port.prototype.disconnect = function() {
	      var socket, _i, _len, _ref, _results;
	      if (this.sockets.length === 0) {
	        throw new Error("" + (this.getId()) + ": No connections available");
	      }
	      _ref = this.sockets;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        socket = _ref[_i];
	        _results.push(socket.disconnect());
	      }
	      return _results;
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
	      this.sockets.forEach((function(_this) {
	        return function(socket) {
	          if (socket.isConnected()) {
	            return connected = true;
	          }
	        };
	      })(this));
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
	      var attached, idx, socket, _i, _len, _ref;
	      attached = [];
	      _ref = this.sockets;
	      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
	        socket = _ref[idx];
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

	    return Port;

	  })(EventEmitter);

	  exports.Port = Port;

	}).call(this);


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var InternalSocket, StreamReceiver, StreamSender, isArray, _,
	    __hasProp = {}.hasOwnProperty;

	  _ = __webpack_require__(12);

	  StreamSender = __webpack_require__(76).StreamSender;

	  StreamReceiver = __webpack_require__(76).StreamReceiver;

	  InternalSocket = __webpack_require__(13);

	  isArray = function(obj) {
	    if (Array.isArray) {
	      return Array.isArray(obj);
	    }
	    return Object.prototype.toString.call(arg) === '[object Array]';
	  };

	  exports.MapComponent = function(component, func, config) {
	    var groups, inPort, outPort;
	    if (!config) {
	      config = {};
	    }
	    if (!config.inPort) {
	      config.inPort = 'in';
	    }
	    if (!config.outPort) {
	      config.outPort = 'out';
	    }
	    inPort = component.inPorts[config.inPort];
	    outPort = component.outPorts[config.outPort];
	    groups = [];
	    return inPort.process = function(event, payload) {
	      switch (event) {
	        case 'connect':
	          return outPort.connect();
	        case 'begingroup':
	          groups.push(payload);
	          return outPort.beginGroup(payload);
	        case 'data':
	          return func(payload, groups, outPort);
	        case 'endgroup':
	          groups.pop();
	          return outPort.endGroup();
	        case 'disconnect':
	          groups = [];
	          return outPort.disconnect();
	      }
	    };
	  };

	  exports.WirePattern = function(component, config, proc) {
	    var baseShutdown, closeGroupOnOuts, collectGroups, disconnectOuts, gc, inPorts, name, outPorts, port, processQueue, resumeTaskQ, sendGroupToOuts, _fn, _fn1, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
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
	    if (!('receiveStreams' in config)) {
	      config.receiveStreams = false;
	    }
	    if (typeof config.receiveStreams === 'string') {
	      config.receiveStreams = [config.receiveStreams];
	    }
	    if (!('sendStreams' in config)) {
	      config.sendStreams = false;
	    }
	    if (typeof config.sendStreams === 'string') {
	      config.sendStreams = [config.sendStreams];
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
	    if (!('gcFrequency' in config)) {
	      config.gcFrequency = 100;
	    }
	    if (!('gcTimeout' in config)) {
	      config.gcTimeout = 300;
	    }
	    collectGroups = config.forwardGroups;
	    if (typeof collectGroups === 'boolean' && !config.group) {
	      collectGroups = inPorts;
	    }
	    if (typeof collectGroups === 'string' && !config.group) {
	      collectGroups = [collectGroups];
	    }
	    if (collectGroups !== false && config.group) {
	      collectGroups = true;
	    }
	    for (_i = 0, _len = inPorts.length; _i < _len; _i++) {
	      name = inPorts[_i];
	      if (!component.inPorts[name]) {
	        throw new Error("no inPort named '" + name + "'");
	      }
	    }
	    for (_j = 0, _len1 = outPorts.length; _j < _len1; _j++) {
	      name = outPorts[_j];
	      if (!component.outPorts[name]) {
	        throw new Error("no outPort named '" + name + "'");
	      }
	    }
	    component.groupedData = {};
	    component.groupedGroups = {};
	    component.groupedDisconnects = {};
	    disconnectOuts = function() {
	      var p, _k, _len2, _results;
	      _results = [];
	      for (_k = 0, _len2 = outPorts.length; _k < _len2; _k++) {
	        p = outPorts[_k];
	        if (component.outPorts[p].isConnected()) {
	          _results.push(component.outPorts[p].disconnect());
	        } else {
	          _results.push(void 0);
	        }
	      }
	      return _results;
	    };
	    sendGroupToOuts = function(grp) {
	      var p, _k, _len2, _results;
	      _results = [];
	      for (_k = 0, _len2 = outPorts.length; _k < _len2; _k++) {
	        p = outPorts[_k];
	        _results.push(component.outPorts[p].beginGroup(grp));
	      }
	      return _results;
	    };
	    closeGroupOnOuts = function(grp) {
	      var p, _k, _len2, _results;
	      _results = [];
	      for (_k = 0, _len2 = outPorts.length; _k < _len2; _k++) {
	        p = outPorts[_k];
	        _results.push(component.outPorts[p].endGroup(grp));
	      }
	      return _results;
	    };
	    component.outputQ = [];
	    processQueue = function() {
	      var flushed, key, stream, streams, tmp;
	      while (component.outputQ.length > 0) {
	        streams = component.outputQ[0];
	        flushed = false;
	        if (streams === null) {
	          disconnectOuts();
	          flushed = true;
	        } else {
	          if (outPorts.length === 1) {
	            tmp = {};
	            tmp[outPorts[0]] = streams;
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
	          component.outputQ.shift();
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
	      component.beforeProcess = function(outs) {
	        if (config.ordered) {
	          component.outputQ.push(outs);
	        }
	        component.load++;
	        if ('load' in component.outPorts && component.outPorts.load.isAttached()) {
	          component.outPorts.load.send(component.load);
	          return component.outPorts.load.disconnect();
	        }
	      };
	      component.afterProcess = function(err, outs) {
	        processQueue();
	        component.load--;
	        if ('load' in component.outPorts && component.outPorts.load.isAttached()) {
	          component.outPorts.load.send(component.load);
	          return component.outPorts.load.disconnect();
	        }
	      };
	    }
	    component.taskQ = [];
	    component.params = {};
	    component.requiredParams = [];
	    component.completeParams = [];
	    component.receivedParams = [];
	    component.defaultedParams = [];
	    component.defaultsSent = false;
	    component.sendDefaults = function() {
	      var param, tempSocket, _k, _len2, _ref;
	      if (component.defaultedParams.length > 0) {
	        _ref = component.defaultedParams;
	        for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
	          param = _ref[_k];
	          if (component.receivedParams.indexOf(param) === -1) {
	            tempSocket = InternalSocket.createSocket();
	            component.inPorts[param].attach(tempSocket);
	            tempSocket.send();
	            tempSocket.disconnect();
	            component.inPorts[param].detach(tempSocket);
	          }
	        }
	      }
	      return component.defaultsSent = true;
	    };
	    resumeTaskQ = function() {
	      var task, temp, _results;
	      if (component.completeParams.length === component.requiredParams.length && component.taskQ.length > 0) {
	        temp = component.taskQ.slice(0);
	        component.taskQ = [];
	        _results = [];
	        while (temp.length > 0) {
	          task = temp.shift();
	          _results.push(task());
	        }
	        return _results;
	      }
	    };
	    _ref = config.params;
	    for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
	      port = _ref[_k];
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
	    _ref1 = config.params;
	    _fn = function(port) {
	      var inPort;
	      inPort = component.inPorts[port];
	      return inPort.process = function(event, payload, index) {
	        if (event !== 'data') {
	          return;
	        }
	        if (inPort.isAddressable()) {
	          if (!(port in component.params)) {
	            component.params[port] = {};
	          }
	          component.params[port][index] = payload;
	          if (config.arrayPolicy.params === 'all' && Object.keys(component.params[port]).length < inPort.listAttached().length) {
	            return;
	          }
	        } else {
	          component.params[port] = payload;
	        }
	        if (component.completeParams.indexOf(port) === -1 && component.requiredParams.indexOf(port) > -1) {
	          component.completeParams.push(port);
	        }
	        component.receivedParams.push(port);
	        return resumeTaskQ();
	      };
	    };
	    for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
	      port = _ref1[_l];
	      _fn(port);
	    }
	    component.disconnectData = {};
	    component.disconnectQ = [];
	    component.groupBuffers = {};
	    component.keyBuffers = {};
	    component.gcTimestamps = {};
	    component.dropRequest = function(key) {
	      if (key in component.disconnectData) {
	        delete component.disconnectData[key];
	      }
	      if (key in component.groupedData) {
	        delete component.groupedData[key];
	      }
	      if (key in component.groupedGroups) {
	        return delete component.groupedGroups[key];
	      }
	    };
	    component.gcCounter = 0;
	    gc = function() {
	      var current, key, val, _ref2, _results;
	      component.gcCounter++;
	      if (component.gcCounter % config.gcFrequency === 0) {
	        current = new Date().getTime();
	        _ref2 = component.gcTimestamps;
	        _results = [];
	        for (key in _ref2) {
	          val = _ref2[key];
	          if ((current - val) > (config.gcTimeout * 1000)) {
	            component.dropRequest(key);
	            _results.push(delete component.gcTimestamps[key]);
	          } else {
	            _results.push(void 0);
	          }
	        }
	        return _results;
	      }
	    };
	    _fn1 = function(port) {
	      var inPort, needPortGroups;
	      component.groupBuffers[port] = [];
	      component.keyBuffers[port] = null;
	      if (config.receiveStreams && config.receiveStreams.indexOf(port) !== -1) {
	        inPort = new StreamReceiver(component.inPorts[port]);
	      } else {
	        inPort = component.inPorts[port];
	      }
	      needPortGroups = collectGroups instanceof Array && collectGroups.indexOf(port) !== -1;
	      return inPort.process = function(event, payload, index) {
	        var data, foundGroup, g, groupLength, groups, grp, i, key, obj, out, outs, postpone, postponedToQ, reqId, requiredLength, resume, task, tmp, whenDone, whenDoneGroups, _len5, _len6, _len7, _len8, _n, _o, _p, _q, _r, _ref2, _ref3, _ref4, _s;
	        if (!component.groupBuffers[port]) {
	          component.groupBuffers[port] = [];
	        }
	        switch (event) {
	          case 'begingroup':
	            component.groupBuffers[port].push(payload);
	            if (config.forwardGroups && (collectGroups === true || needPortGroups) && !config.async) {
	              return sendGroupToOuts(payload);
	            }
	            break;
	          case 'endgroup':
	            component.groupBuffers[port] = component.groupBuffers[port].slice(0, component.groupBuffers[port].length - 1);
	            if (config.forwardGroups && (collectGroups === true || needPortGroups) && !config.async) {
	              return closeGroupOnOuts(payload);
	            }
	            break;
	          case 'disconnect':
	            if (inPorts.length === 1) {
	              if (config.async || config.StreamSender) {
	                if (config.ordered) {
	                  component.outputQ.push(null);
	                  return processQueue();
	                } else {
	                  return component.disconnectQ.push(true);
	                }
	              } else {
	                return disconnectOuts();
	              }
	            } else {
	              foundGroup = false;
	              key = component.keyBuffers[port];
	              if (!(key in component.disconnectData)) {
	                component.disconnectData[key] = [];
	              }
	              for (i = _n = 0, _ref2 = component.disconnectData[key].length; 0 <= _ref2 ? _n < _ref2 : _n > _ref2; i = 0 <= _ref2 ? ++_n : --_n) {
	                if (!(port in component.disconnectData[key][i])) {
	                  foundGroup = true;
	                  component.disconnectData[key][i][port] = true;
	                  if (Object.keys(component.disconnectData[key][i]).length === inPorts.length) {
	                    component.disconnectData[key].shift();
	                    if (config.async || config.StreamSender) {
	                      if (config.ordered) {
	                        component.outputQ.push(null);
	                        processQueue();
	                      } else {
	                        component.disconnectQ.push(true);
	                      }
	                    } else {
	                      disconnectOuts();
	                    }
	                    if (component.disconnectData[key].length === 0) {
	                      delete component.disconnectData[key];
	                    }
	                  }
	                  break;
	                }
	              }
	              if (!foundGroup) {
	                obj = {};
	                obj[port] = true;
	                return component.disconnectData[key].push(obj);
	              }
	            }
	            break;
	          case 'data':
	            if (inPorts.length === 1 && !inPort.isAddressable()) {
	              data = payload;
	              groups = component.groupBuffers[port];
	            } else {
	              key = '';
	              if (config.group && component.groupBuffers[port].length > 0) {
	                key = component.groupBuffers[port].toString();
	                if (config.group instanceof RegExp) {
	                  reqId = null;
	                  _ref3 = component.groupBuffers[port];
	                  for (_o = 0, _len5 = _ref3.length; _o < _len5; _o++) {
	                    grp = _ref3[_o];
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
	              component.keyBuffers[port] = key;
	              if (!(key in component.groupedData)) {
	                component.groupedData[key] = [];
	              }
	              if (!(key in component.groupedGroups)) {
	                component.groupedGroups[key] = [];
	              }
	              foundGroup = false;
	              requiredLength = inPorts.length;
	              if (config.field) {
	                ++requiredLength;
	              }
	              for (i = _p = 0, _ref4 = component.groupedData[key].length; 0 <= _ref4 ? _p < _ref4 : _p > _ref4; i = 0 <= _ref4 ? ++_p : --_p) {
	                if (!(port in component.groupedData[key][i]) || (component.inPorts[port].isAddressable() && config.arrayPolicy["in"] === 'all' && !(index in component.groupedData[key][i][port]))) {
	                  foundGroup = true;
	                  if (component.inPorts[port].isAddressable()) {
	                    if (!(port in component.groupedData[key][i])) {
	                      component.groupedData[key][i][port] = {};
	                    }
	                    component.groupedData[key][i][port][index] = payload;
	                  } else {
	                    component.groupedData[key][i][port] = payload;
	                  }
	                  if (needPortGroups) {
	                    component.groupedGroups[key][i] = _.union(component.groupedGroups[key][i], component.groupBuffers[port]);
	                  } else if (collectGroups === true) {
	                    component.groupedGroups[key][i][port] = component.groupBuffers[port];
	                  }
	                  if (component.inPorts[port].isAddressable() && config.arrayPolicy["in"] === 'all' && Object.keys(component.groupedData[key][i][port]).length < component.inPorts[port].listAttached().length) {
	                    return;
	                  }
	                  groupLength = Object.keys(component.groupedData[key][i]).length;
	                  if (groupLength === requiredLength) {
	                    data = (component.groupedData[key].splice(i, 1))[0];
	                    if (inPorts.length === 1 && inPort.isAddressable()) {
	                      data = data[port];
	                    }
	                    groups = (component.groupedGroups[key].splice(i, 1))[0];
	                    if (collectGroups === true) {
	                      groups = _.intersection.apply(null, _.values(groups));
	                    }
	                    if (component.groupedData[key].length === 0) {
	                      delete component.groupedData[key];
	                    }
	                    if (component.groupedGroups[key].length === 0) {
	                      delete component.groupedGroups[key];
	                    }
	                    if (config.group && key) {
	                      delete component.gcTimestamps[key];
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
	                if (inPorts.length === 1 && component.inPorts[port].isAddressable() && (config.arrayPolicy["in"] === 'any' || component.inPorts[port].listAttached().length === 1)) {
	                  data = obj[port];
	                  groups = component.groupBuffers[port];
	                } else {
	                  component.groupedData[key].push(obj);
	                  if (needPortGroups) {
	                    component.groupedGroups[key].push(component.groupBuffers[port]);
	                  } else if (collectGroups === true) {
	                    tmp = {};
	                    tmp[port] = component.groupBuffers[port];
	                    component.groupedGroups[key].push(tmp);
	                  } else {
	                    component.groupedGroups[key].push([]);
	                  }
	                  if (config.group && key) {
	                    component.gcTimestamps[key] = new Date().getTime();
	                  }
	                  return;
	                }
	              }
	            }
	            if (config.dropInput && component.completeParams.length !== component.requiredParams.length) {
	              return;
	            }
	            outs = {};
	            for (_q = 0, _len6 = outPorts.length; _q < _len6; _q++) {
	              name = outPorts[_q];
	              if (config.async || config.sendStreams && config.sendStreams.indexOf(name) !== -1) {
	                outs[name] = new StreamSender(component.outPorts[name], config.ordered);
	              } else {
	                outs[name] = component.outPorts[name];
	              }
	            }
	            if (outPorts.length === 1) {
	              outs = outs[outPorts[0]];
	            }
	            if (!groups) {
	              groups = [];
	            }
	            whenDoneGroups = groups.slice(0);
	            whenDone = function(err) {
	              var disconnect, out, outputs, _len7, _r;
	              if (err) {
	                component.error(err, whenDoneGroups);
	              }
	              if (typeof component.fail === 'function' && component.hasErrors) {
	                component.fail();
	              }
	              outputs = outPorts.length === 1 ? {
	                port: outs
	              } : outs;
	              disconnect = false;
	              if (component.disconnectQ.length > 0) {
	                component.disconnectQ.shift();
	                disconnect = true;
	              }
	              for (name in outputs) {
	                out = outputs[name];
	                if (config.forwardGroups && config.async) {
	                  for (_r = 0, _len7 = whenDoneGroups.length; _r < _len7; _r++) {
	                    i = whenDoneGroups[_r];
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
	                return component.afterProcess(err || component.hasErrors, outs);
	              }
	            };
	            if (typeof component.beforeProcess === 'function') {
	              component.beforeProcess(outs);
	            }
	            if (config.forwardGroups && config.async) {
	              if (outPorts.length === 1) {
	                for (_r = 0, _len7 = groups.length; _r < _len7; _r++) {
	                  g = groups[_r];
	                  outs.beginGroup(g);
	                }
	              } else {
	                for (name in outs) {
	                  out = outs[name];
	                  for (_s = 0, _len8 = groups.length; _s < _len8; _s++) {
	                    g = groups[_s];
	                    out.beginGroup(g);
	                  }
	                }
	              }
	            }
	            exports.MultiError(component, config.name, config.error, groups);
	            if (config.async) {
	              postpone = function() {};
	              resume = function() {};
	              postponedToQ = false;
	              task = function() {
	                return proc.call(component, data, groups, outs, whenDone, postpone, resume);
	              };
	              postpone = function(backToQueue) {
	                if (backToQueue == null) {
	                  backToQueue = true;
	                }
	                postponedToQ = backToQueue;
	                if (backToQueue) {
	                  return component.taskQ.push(task);
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
	                proc.call(component, data, groups, outs);
	                return whenDone();
	              };
	            }
	            component.taskQ.push(task);
	            resumeTaskQ();
	            return gc();
	        }
	      };
	    };
	    for (_m = 0, _len4 = inPorts.length; _m < _len4; _m++) {
	      port = inPorts[_m];
	      _fn1(port);
	    }
	    baseShutdown = component.shutdown;
	    component.shutdown = function() {
	      baseShutdown.call(component);
	      component.groupedData = {};
	      component.groupedGroups = {};
	      component.outputQ = [];
	      component.disconnectData = {};
	      component.disconnectQ = [];
	      component.taskQ = [];
	      component.params = {};
	      component.completeParams = [];
	      component.receivedParams = [];
	      component.defaultsSent = false;
	      component.groupBuffers = {};
	      component.keyBuffers = {};
	      component.gcTimestamps = {};
	      return component.gcCounter = 0;
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
	      if (!__hasProp.call(options, key)) continue;
	      val = options[key];
	      err[key] = val;
	    }
	    return err;
	  };

	  exports.MultiError = function(component, group, errorPort, forwardedGroups) {
	    var baseShutdown;
	    if (group == null) {
	      group = '';
	    }
	    if (errorPort == null) {
	      errorPort = 'error';
	    }
	    if (forwardedGroups == null) {
	      forwardedGroups = [];
	    }
	    component.hasErrors = false;
	    component.errors = [];
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
	      var error, grp, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
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
	        component.outPorts[errorPort].beginGroup(group);
	      }
	      _ref = component.errors;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        error = _ref[_i];
	        _ref1 = error.groups;
	        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	          grp = _ref1[_j];
	          component.outPorts[errorPort].beginGroup(grp);
	        }
	        component.outPorts[errorPort].send(error.err);
	        _ref2 = error.groups;
	        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
	          grp = _ref2[_k];
	          component.outPorts[errorPort].endGroup();
	        }
	      }
	      if (group) {
	        component.outPorts[errorPort].endGroup();
	      }
	      component.outPorts[errorPort].disconnect();
	      component.hasErrors = false;
	      return component.errors = [];
	    };
	    baseShutdown = component.shutdown;
	    component.shutdown = function() {
	      baseShutdown.call(component);
	      component.hasErrors = false;
	      return component.errors = [];
	    };
	    return component;
	  };

	}).call(this);


/***/ },
/* 76 */
/***/ function(module, exports) {

	(function() {
	  var IP, StreamReceiver, StreamSender, Substream;

	  IP = (function() {
	    function IP(data) {
	      this.data = data;
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
	      var ip, _i, _len, _ref;
	      port.beginGroup(this.key);
	      _ref = this.value;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        ip = _ref[_i];
	        if (ip instanceof Substream || ip instanceof IP) {
	          ip.sendTo(port);
	        } else {
	          port.send(ip);
	        }
	      }
	      return port.endGroup();
	    };

	    Substream.prototype.getKey = function() {
	      return this.key;
	    };

	    Substream.prototype.getValue = function() {
	      var hasKeys, ip, obj, res, val, _i, _len, _ref;
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
	          _ref = this.value;
	          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	            ip = _ref[_i];
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
	    function StreamSender(port, ordered) {
	      this.port = port;
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
	      var ip, res, _i, _len, _ref;
	      res = false;
	      if (this.q.length > 0) {
	        _ref = this.q;
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          ip = _ref[_i];
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
	    function StreamReceiver(port, buffered, process) {
	      this.port = port;
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


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var ArrayPort, port,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

	  port = __webpack_require__(74);

	  ArrayPort = (function(_super) {
	    __extends(ArrayPort, _super);

	    function ArrayPort(type) {
	      this.type = type;
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
	          throw new Error("" + (this.getId()) + ": No connections available");
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
	        throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
	      }
	      return this.sockets[socketId].connect();
	    };

	    ArrayPort.prototype.beginGroup = function(group, socketId) {
	      if (socketId == null) {
	        socketId = null;
	      }
	      if (socketId === null) {
	        if (!this.sockets.length) {
	          throw new Error("" + (this.getId()) + ": No connections available");
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
	        throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
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
	          throw new Error("" + (this.getId()) + ": No connections available");
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
	        throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
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
	          throw new Error("" + (this.getId()) + ": No connections available");
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
	        throw new Error("" + (this.getId()) + ": No connection '" + socketId + "' available");
	      }
	      return this.sockets[socketId].endGroup();
	    };

	    ArrayPort.prototype.disconnect = function(socketId) {
	      var socket, _i, _len, _ref;
	      if (socketId == null) {
	        socketId = null;
	      }
	      if (socketId === null) {
	        if (!this.sockets.length) {
	          throw new Error("" + (this.getId()) + ": No connections available");
	        }
	        _ref = this.sockets;
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          socket = _ref[_i];
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
	        this.sockets.forEach((function(_this) {
	          return function(socket) {
	            if (!socket) {
	              return;
	            }
	            if (socket.isConnected()) {
	              return connected = true;
	            }
	          };
	        })(this));
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
	      var socket, _i, _len, _ref;
	      if (socketId === void 0) {
	        _ref = this.sockets;
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          socket = _ref[_i];
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


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var Base, WebRTCRuntime, isBrowser, uuid,
	  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	  hasProp = {}.hasOwnProperty;

	isBrowser = function() {
	  return !(typeof process !== 'undefined' && process.execPath && process.execPath.indexOf('node') !== -1);
	};

	Base = __webpack_require__(79);

	uuid = __webpack_require__(99);

	WebRTCRuntime = (function(superClass) {
	  extend(WebRTCRuntime, superClass);

	  function WebRTCRuntime(address, options, dontstart) {
	    this.channels = [];
	    this.debug = false;
	    if (address && address.indexOf('#') !== -1) {
	      this.signaller = address.split('#')[0];
	      this.id = address.split('#')[1];
	    } else {
	      this.signaller = 'https://api.flowhub.io';
	      this.id = address;
	    }
	    if (!this.id) {
	      this.id = uuid.v4();
	    }
	    if (!dontstart) {
	      this.start();
	    }
	    WebRTCRuntime.__super__.constructor.call(this, options);
	  }

	  WebRTCRuntime.prototype.start = function() {
	    var peer, rtcOptions;
	    rtcOptions = {
	      room: this.id,
	      debug: true,
	      channels: {
	        chat: true
	      },
	      signaller: this.signaller,
	      capture: false,
	      constraints: false,
	      expectedLocalStreams: 0
	    };
	    peer = RTC(rtcOptions);
	    peer.on('channel:opened:chat', (function(_this) {
	      return function(id, dc) {
	        _this.channels.push(dc);
	        return dc.onmessage = function(data) {
	          var context, msg;
	          context = {
	            channel: dc
	          };
	          msg = JSON.parse(data.data);
	          if (_this.debug) {
	            console.log('message', msg);
	          }
	          return _this.receive(msg.protocol, msg.command, msg.payload, context);
	        };
	      };
	    })(this));
	    return peer.on('channel:closed:chat', (function(_this) {
	      return function(id, dc) {
	        dc.onmessage = null;
	        if (_this.channels.indexOf(dc) === -1) {
	          return;
	        }
	        return _this.channels.splice(_this.channels.indexOf(dc), 1);
	      };
	    })(this));
	  };

	  WebRTCRuntime.prototype.send = function(protocol, topic, payload, context) {
	    var m, msg;
	    if (!context.channel) {
	      return;
	    }
	    msg = {
	      protocol: protocol,
	      command: topic,
	      payload: payload
	    };
	    m = JSON.stringify(msg);
	    if (this.debug) {
	      console.log('send', msg);
	    }
	    return context.channel.send(m);
	  };

	  WebRTCRuntime.prototype.sendAll = function(protocol, topic, payload) {
	    var channel, e, error, i, len, m, msg, ref, results;
	    msg = {
	      protocol: protocol,
	      command: topic,
	      payload: payload
	    };
	    m = JSON.stringify(msg);
	    if (this.debug) {
	      console.log('sendAll', msg);
	    }
	    ref = this.channels;
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      channel = ref[i];
	      try {
	        results.push(channel.send(m));
	      } catch (error) {
	        e = error;
	      }
	    }
	    return results;
	  };

	  return WebRTCRuntime;

	})(Base);

	module.exports = function(address, options, dontstart) {
	  var runtime;
	  runtime = new WebRTCRuntime(address, options, dontstart);
	  return runtime;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var BaseTransport, protocols;

	  protocols = {
	    Runtime: __webpack_require__(80),
	    Graph: __webpack_require__(81),
	    Network: __webpack_require__(82),
	    Component: __webpack_require__(87)
	  };

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

	    BaseTransport.prototype.send = function(protocol, topic, payload, context) {};

	    BaseTransport.prototype.sendAll = function(protocol, topic, payload, context) {};

	    BaseTransport.prototype.receive = function(protocol, topic, payload, context) {
	      if (!payload) {
	        payload = {};
	      }
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

	  module.exports.trace = __webpack_require__(88);

	}).call(this);


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var RuntimeProtocol, noflo, portsPayload, sendToInport;

	  noflo = __webpack_require__(1);

	  sendToInport = function(component, portName, event, payload) {
	    var port, socket;
	    socket = noflo.internalSocket.createSocket();
	    port = component.inPorts[portName];
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
	        socket.post(payload);
	    }
	    return port.detach(socket);
	  };

	  portsPayload = function(name, graph) {
	    var inports, internal, outports, payload, pub, ref, ref1, ref2, ref3;
	    inports = [];
	    outports = [];
	    if (graph) {
	      ref = graph.inports;
	      for (pub in ref) {
	        internal = ref[pub];
	        inports.push({
	          id: pub,
	          type: 'any',
	          description: (ref1 = internal.metadata) != null ? ref1.description : void 0,
	          addressable: false,
	          required: false
	        });
	      }
	      ref2 = graph.outports;
	      for (pub in ref2) {
	        internal = ref2[pub];
	        outports.push({
	          id: pub,
	          type: 'any',
	          description: (ref3 = internal.metadata) != null ? ref3.description : void 0,
	          addressable: false,
	          required: false
	        });
	      }
	    }
	    return payload = {
	      graph: name,
	      inPorts: inports,
	      outPorts: outports
	    };
	  };

	  RuntimeProtocol = (function() {
	    function RuntimeProtocol(transport) {
	      this.transport = transport;
	      this.outputSockets = {};
	      this.mainGraph = null;
	      this.transport.network.on('addnetwork', (function(_this) {
	        return function(network, name) {
	          _this.subscribeExportedPorts(name, network.graph, true);
	          _this.subscribeOutPorts(name, network);
	          _this.sendPorts(name, network.graph);
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
	          return this.receivePacket(payload, context);
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
	      this.send('runtime', payload, context);
	      ref = this.transport.network.networks;
	      results = [];
	      for (name in ref) {
	        network = ref[name];
	        results.push(this.sendPorts(name, network.graph, context));
	      }
	      return results;
	    };

	    RuntimeProtocol.prototype.sendPorts = function(name, graph, context) {
	      var payload;
	      payload = portsPayload(name, graph);
	      if (!context) {
	        return this.sendAll('ports', payload);
	      } else {
	        return this.send('ports', payload, context);
	      }
	    };

	    RuntimeProtocol.prototype.setMainGraph = function(id) {
	      return this.mainGraph = id;
	    };

	    RuntimeProtocol.prototype.subscribeExportedPorts = function(name, graph, add) {
	      var d, dependencies, i, j, len, len1, results, sendExportedPorts;
	      sendExportedPorts = (function(_this) {
	        return function() {
	          return _this.sendPorts(name, graph);
	        };
	      })(this);
	      dependencies = ['addInport', 'addOutport', 'removeInport', 'removeOutport'];
	      for (i = 0, len = dependencies.length; i < len; i++) {
	        d = dependencies[i];
	        graph.removeListener(d, sendExportedPorts);
	      }
	      if (add) {
	        results = [];
	        for (j = 0, len1 = dependencies.length; j < len1; j++) {
	          d = dependencies[j];
	          results.push(graph.on(d, sendExportedPorts));
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

	    RuntimeProtocol.prototype.receivePacket = function(payload, context) {
	      var component, graph, internal, network, ref;
	      graph = this.transport.graph.graphs[payload.graph];
	      network = this.transport.network.networks[payload.graph];
	      if (!network) {
	        return this.sendError("Cannot find network for graph " + payload.graph, context);
	      }
	      internal = graph.inports[payload.port];
	      component = (ref = network.network.getNode(internal != null ? internal.process : void 0)) != null ? ref.component : void 0;
	      if (!(internal && component)) {
	        return this.sendError("Cannot find internal port for " + payload.port, context);
	      }
	      return sendToInport(component, internal.port, payload.event, payload.payload);
	    };

	    return RuntimeProtocol;

	  })();

	  module.exports = RuntimeProtocol;

	}).call(this);


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var GraphProtocol, noflo;

	  noflo = __webpack_require__(1);

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
	      return this.sendAll('clear', payload, context);
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
	          node.graph = id;
	          return _this.sendAll('removenode', node, context);
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
	            metadata: edge.metadata,
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
	            metadata: iip.metadata,
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


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {(function() {
	  var EventEmitter, NetworkProtocol, getConnectionSignature, getEdgeSignature, getPortSignature, getSocketSignature, networkIsRunning, noflo, prepareSocketEvent,
	    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty;

	  noflo = __webpack_require__(1);

	  EventEmitter = __webpack_require__(3).EventEmitter;

	  prepareSocketEvent = function(event, req) {
	    var payload, ref;
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
	    if (event.data) {
	      if (!noflo.isBrowser()) {
	        if (Buffer.isBuffer(event.data)) {
	          event.data = event.data.slice(0, 20);
	        }
	      }
	      if (event.data.toJSON) {
	        payload.data = event.data.toJSON();
	      }
	      if (event.data.toString) {
	        payload.data = event.data.toString();
	        if (payload.data === '[object Object]') {
	          try {
	            payload.data = JSON.parse(JSON.stringify(event.data));
	          } catch (undefined) {}
	        }
	      } else {
	        payload.data = event.data;
	      }
	      if ((ref = event.metadata) != null ? ref.secure : void 0) {
	        payload.data = 'DATA';
	      }
	    }
	    if (event.subgraph) {
	      payload.subgraph = event.subgraph;
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

	  networkIsRunning = function(net) {
	    var isRunning;
	    if (net.isRunning) {
	      isRunning = net.isRunning();
	    } else {
	      isRunning = net.isStarted() && net.connectionCount > 0;
	    }
	    return isRunning;
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
	      var edge, j, len, network, ref, results, signature;
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
	      results = [];
	      for (j = 0, len = ref.length; j < len; j++) {
	        edge = ref[j];
	        signature = getEdgeSignature(edge);
	        results.push(network.filters[signature] = true);
	      }
	      return results;
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
	        network.stop();
	        delete this.networks[payload.graph];
	        this.emit('removenetwork', network, payload.graph, this.networks);
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
	            running: true,
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
	            running: false,
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
	          return _this.sendAll('connect', prepareSocketEvent(event, payload), context);
	        };
	      })(this));
	      network.on('begingroup', (function(_this) {
	        return function(event) {
	          return _this.sendAll('begingroup', prepareSocketEvent(event, payload), context);
	        };
	      })(this));
	      network.on('data', (function(_this) {
	        return function(event) {
	          if (!_this.eventFiltered(payload.graph, event)) {
	            return;
	          }
	          return _this.sendAll('data', prepareSocketEvent(event, payload), context);
	        };
	      })(this));
	      network.on('endgroup', (function(_this) {
	        return function(event) {
	          return _this.sendAll('endgroup', prepareSocketEvent(event, payload), context);
	        };
	      })(this));
	      network.on('disconnect', (function(_this) {
	        return function(event) {
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
	            if (net.isStarted()) {
	              return _this.sendAll('started', {
	                time: new Date,
	                graph: payload.graph,
	                running: networkIsRunning(net),
	                started: true
	              }, context);
	            } else {
	              return _this.sendAll('stopped', {
	                time: new Date,
	                graph: payload.graph,
	                running: networkIsRunning(net),
	                started: false
	              }, context);
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
	        this.networks[payload.graph].network.stop();
	        return;
	      }
	      return this.send('stopped', {
	        time: new Date,
	        graph: payload.graph,
	        running: networkIsRunning(net),
	        started: false
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
	        running: networkIsRunning(net),
	        started: net.isStarted()
	      }, context);
	    };

	    return NetworkProtocol;

	  })(EventEmitter);

	  module.exports = NetworkProtocol;

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(83).Buffer))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(84)
	var ieee754 = __webpack_require__(85)
	var isArray = __webpack_require__(86)

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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 84 */
/***/ function(module, exports) {

	'use strict'

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
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}

	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)

	  arr = new Arr(len * 3 / 4 - placeHolders)

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len

	  var L = 0

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
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


/***/ },
/* 85 */
/***/ function(module, exports) {

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


/***/ },
/* 86 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var ComponentProtocol, _, noflo;

	  noflo = __webpack_require__(1);

	  _ = __webpack_require__(12);

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


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	(function() {
	  var TraceBuffer, Tracer, clone, debug, e, error, jsonStringify, networkToTraceEvent, noflo, subscribeExportedOutports;

	  noflo = __webpack_require__(1);

	  debug = __webpack_require__(89)('noflo-runtime-base:trace');

	  jsonStringify = JSON.stringify;

	  try {
	    jsonStringify = __webpack_require__(92);
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
	      fs = __webpack_require__(7);
	      temp = __webpack_require__(93);
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


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(90);
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
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
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
	  if (typeof window !== 'undefined' && window && typeof window.process !== 'undefined' && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document && 'WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window && window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
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
	  try {
	    return exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (typeof process !== 'undefined' && 'env' in process) {
	    return process.env.DEBUG;
	  }
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug.default = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(91);

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
	 * Previous log timestamp.
	 */

	var prevTime;

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

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
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

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
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


/***/ },
/* 91 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000
	var m = s * 60
	var h = m * 60
	var d = h * 24
	var y = d * 365.25

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function (val, options) {
	  options = options || {}
	  var type = typeof val
	  if (type === 'string' && val.length > 0) {
	    return parse(val)
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ?
				fmtLong(val) :
				fmtShort(val)
	  }
	  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
	}

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str)
	  if (str.length > 10000) {
	    return
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str)
	  if (!match) {
	    return
	  }
	  var n = parseFloat(match[1])
	  var type = (match[2] || 'ms').toLowerCase()
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n
	    default:
	      return undefined
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
	    return Math.round(ms / d) + 'd'
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h'
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm'
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's'
	  }
	  return ms + 'ms'
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
	    ms + ' ms'
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's'
	}


/***/ },
/* 92 */
/***/ function(module, exports) {

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


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs   = __webpack_require__(7),
	    path = __webpack_require__(94),
	    cnst = __webpack_require__(95);

	var rimraf     = __webpack_require__(96),
	    osTmpdir   = __webpack_require__(98),
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 95 */
/***/ function(module, exports) {

	module.exports = {
		"O_RDONLY": 0,
		"O_WRONLY": 1,
		"O_RDWR": 2,
		"S_IFMT": 61440,
		"S_IFREG": 32768,
		"S_IFDIR": 16384,
		"S_IFCHR": 8192,
		"S_IFBLK": 24576,
		"S_IFIFO": 4096,
		"S_IFLNK": 40960,
		"S_IFSOCK": 49152,
		"O_CREAT": 512,
		"O_EXCL": 2048,
		"O_NOCTTY": 131072,
		"O_TRUNC": 1024,
		"O_APPEND": 8,
		"O_DIRECTORY": 1048576,
		"O_NOFOLLOW": 256,
		"O_SYNC": 128,
		"O_SYMLINK": 2097152,
		"O_NONBLOCK": 4,
		"S_IRWXU": 448,
		"S_IRUSR": 256,
		"S_IWUSR": 128,
		"S_IXUSR": 64,
		"S_IRWXG": 56,
		"S_IRGRP": 32,
		"S_IWGRP": 16,
		"S_IXGRP": 8,
		"S_IRWXO": 7,
		"S_IROTH": 4,
		"S_IWOTH": 2,
		"S_IXOTH": 1,
		"E2BIG": 7,
		"EACCES": 13,
		"EADDRINUSE": 48,
		"EADDRNOTAVAIL": 49,
		"EAFNOSUPPORT": 47,
		"EAGAIN": 35,
		"EALREADY": 37,
		"EBADF": 9,
		"EBADMSG": 94,
		"EBUSY": 16,
		"ECANCELED": 89,
		"ECHILD": 10,
		"ECONNABORTED": 53,
		"ECONNREFUSED": 61,
		"ECONNRESET": 54,
		"EDEADLK": 11,
		"EDESTADDRREQ": 39,
		"EDOM": 33,
		"EDQUOT": 69,
		"EEXIST": 17,
		"EFAULT": 14,
		"EFBIG": 27,
		"EHOSTUNREACH": 65,
		"EIDRM": 90,
		"EILSEQ": 92,
		"EINPROGRESS": 36,
		"EINTR": 4,
		"EINVAL": 22,
		"EIO": 5,
		"EISCONN": 56,
		"EISDIR": 21,
		"ELOOP": 62,
		"EMFILE": 24,
		"EMLINK": 31,
		"EMSGSIZE": 40,
		"EMULTIHOP": 95,
		"ENAMETOOLONG": 63,
		"ENETDOWN": 50,
		"ENETRESET": 52,
		"ENETUNREACH": 51,
		"ENFILE": 23,
		"ENOBUFS": 55,
		"ENODATA": 96,
		"ENODEV": 19,
		"ENOENT": 2,
		"ENOEXEC": 8,
		"ENOLCK": 77,
		"ENOLINK": 97,
		"ENOMEM": 12,
		"ENOMSG": 91,
		"ENOPROTOOPT": 42,
		"ENOSPC": 28,
		"ENOSR": 98,
		"ENOSTR": 99,
		"ENOSYS": 78,
		"ENOTCONN": 57,
		"ENOTDIR": 20,
		"ENOTEMPTY": 66,
		"ENOTSOCK": 38,
		"ENOTSUP": 45,
		"ENOTTY": 25,
		"ENXIO": 6,
		"EOPNOTSUPP": 102,
		"EOVERFLOW": 84,
		"EPERM": 1,
		"EPIPE": 32,
		"EPROTO": 100,
		"EPROTONOSUPPORT": 43,
		"EPROTOTYPE": 41,
		"ERANGE": 34,
		"EROFS": 30,
		"ESPIPE": 29,
		"ESRCH": 3,
		"ESTALE": 70,
		"ETIME": 101,
		"ETIMEDOUT": 60,
		"ETXTBSY": 26,
		"EWOULDBLOCK": 35,
		"EXDEV": 18,
		"SIGHUP": 1,
		"SIGINT": 2,
		"SIGQUIT": 3,
		"SIGILL": 4,
		"SIGTRAP": 5,
		"SIGABRT": 6,
		"SIGIOT": 6,
		"SIGBUS": 10,
		"SIGFPE": 8,
		"SIGKILL": 9,
		"SIGUSR1": 30,
		"SIGSEGV": 11,
		"SIGUSR2": 31,
		"SIGPIPE": 13,
		"SIGALRM": 14,
		"SIGTERM": 15,
		"SIGCHLD": 20,
		"SIGCONT": 19,
		"SIGSTOP": 17,
		"SIGTSTP": 18,
		"SIGTTIN": 21,
		"SIGTTOU": 22,
		"SIGURG": 16,
		"SIGXCPU": 24,
		"SIGXFSZ": 25,
		"SIGVTALRM": 26,
		"SIGPROF": 27,
		"SIGWINCH": 28,
		"SIGIO": 23,
		"SIGSYS": 12,
		"SSL_OP_ALL": 2147486719,
		"SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION": 262144,
		"SSL_OP_CIPHER_SERVER_PREFERENCE": 4194304,
		"SSL_OP_CISCO_ANYCONNECT": 32768,
		"SSL_OP_COOKIE_EXCHANGE": 8192,
		"SSL_OP_CRYPTOPRO_TLSEXT_BUG": 2147483648,
		"SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS": 2048,
		"SSL_OP_EPHEMERAL_RSA": 0,
		"SSL_OP_LEGACY_SERVER_CONNECT": 4,
		"SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER": 32,
		"SSL_OP_MICROSOFT_SESS_ID_BUG": 1,
		"SSL_OP_MSIE_SSLV2_RSA_PADDING": 0,
		"SSL_OP_NETSCAPE_CA_DN_BUG": 536870912,
		"SSL_OP_NETSCAPE_CHALLENGE_BUG": 2,
		"SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG": 1073741824,
		"SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG": 8,
		"SSL_OP_NO_COMPRESSION": 131072,
		"SSL_OP_NO_QUERY_MTU": 4096,
		"SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION": 65536,
		"SSL_OP_NO_SSLv2": 16777216,
		"SSL_OP_NO_SSLv3": 33554432,
		"SSL_OP_NO_TICKET": 16384,
		"SSL_OP_NO_TLSv1": 67108864,
		"SSL_OP_NO_TLSv1_1": 268435456,
		"SSL_OP_NO_TLSv1_2": 134217728,
		"SSL_OP_PKCS1_CHECK_1": 0,
		"SSL_OP_PKCS1_CHECK_2": 0,
		"SSL_OP_SINGLE_DH_USE": 1048576,
		"SSL_OP_SINGLE_ECDH_USE": 524288,
		"SSL_OP_SSLEAY_080_CLIENT_DH_BUG": 128,
		"SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG": 0,
		"SSL_OP_TLS_BLOCK_PADDING_BUG": 512,
		"SSL_OP_TLS_D5_BUG": 256,
		"SSL_OP_TLS_ROLLBACK_BUG": 8388608,
		"ENGINE_METHOD_DSA": 2,
		"ENGINE_METHOD_DH": 4,
		"ENGINE_METHOD_RAND": 8,
		"ENGINE_METHOD_ECDH": 16,
		"ENGINE_METHOD_ECDSA": 32,
		"ENGINE_METHOD_CIPHERS": 64,
		"ENGINE_METHOD_DIGESTS": 128,
		"ENGINE_METHOD_STORE": 256,
		"ENGINE_METHOD_PKEY_METHS": 512,
		"ENGINE_METHOD_PKEY_ASN1_METHS": 1024,
		"ENGINE_METHOD_ALL": 65535,
		"ENGINE_METHOD_NONE": 0,
		"DH_CHECK_P_NOT_SAFE_PRIME": 2,
		"DH_CHECK_P_NOT_PRIME": 1,
		"DH_UNABLE_TO_CHECK_GENERATOR": 4,
		"DH_NOT_SUITABLE_GENERATOR": 8,
		"NPN_ENABLED": 1,
		"RSA_PKCS1_PADDING": 1,
		"RSA_SSLV23_PADDING": 2,
		"RSA_NO_PADDING": 3,
		"RSA_PKCS1_OAEP_PADDING": 4,
		"RSA_X931_PADDING": 5,
		"RSA_PKCS1_PSS_PADDING": 6,
		"POINT_CONVERSION_COMPRESSED": 2,
		"POINT_CONVERSION_UNCOMPRESSED": 4,
		"POINT_CONVERSION_HYBRID": 6,
		"F_OK": 0,
		"R_OK": 4,
		"W_OK": 2,
		"X_OK": 1,
		"UV_UDP_REUSEADDR": 4
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports = rimraf
	rimraf.sync = rimrafSync

	var assert = __webpack_require__(97)
	var path = __webpack_require__(94)
	var fs = __webpack_require__(7)

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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

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

	var util = __webpack_require__(28);
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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php

	// Unique ID creation requires a high quality random # generator.  We feature
	// detect to determine the best RNG source, normalizing to a function that
	// returns 128-bits of randomness, since that's what's usually required
	var _rng = __webpack_require__(100);

	// Maps for number <-> hex string conversion
	var _byteToHex = [];
	var _hexToByte = {};
	for (var i = 0; i < 256; i++) {
	  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	  _hexToByte[_byteToHex[i]] = i;
	}

	// **`parse()` - Parse a UUID into it's component bytes**
	function parse(s, buf, offset) {
	  var i = (buf && offset) || 0, ii = 0;

	  buf = buf || [];
	  s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	    if (ii < 16) { // Don't overflow!
	      buf[i + ii++] = _hexToByte[oct];
	    }
	  });

	  // Zero out remaining bytes if string was short
	  while (ii < 16) {
	    buf[i + ii++] = 0;
	  }

	  return buf;
	}

	// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	function unparse(buf, offset) {
	  var i = offset || 0, bth = _byteToHex;
	  return  bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] + '-' +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]] +
	          bth[buf[i++]] + bth[buf[i++]];
	}

	// **`v1()` - Generate time-based UUID**
	//
	// Inspired by https://github.com/LiosK/UUID.js
	// and http://docs.python.org/library/uuid.html

	// random #'s we need to init node and clockseq
	var _seedBytes = _rng();

	// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	var _nodeId = [
	  _seedBytes[0] | 0x01,
	  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	];

	// Per 4.2.2, randomize (14 bit) clockseq
	var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

	// Previous uuid creation time
	var _lastMSecs = 0, _lastNSecs = 0;

	// See https://github.com/broofa/node-uuid for API details
	function v1(options, buf, offset) {
	  var i = buf && offset || 0;
	  var b = buf || [];

	  options = options || {};

	  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

	  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

	  // Per 4.2.1.2, use count of uuid's generated during the current clock
	  // cycle to simulate higher resolution clock
	  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

	  // Time since last uuid creation (in msecs)
	  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

	  // Per 4.2.1.2, Bump clockseq on clock regression
	  if (dt < 0 && options.clockseq === undefined) {
	    clockseq = clockseq + 1 & 0x3fff;
	  }

	  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	  // time interval
	  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
	    nsecs = 0;
	  }

	  // Per 4.2.1.2 Throw error if too many uuids are requested
	  if (nsecs >= 10000) {
	    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	  }

	  _lastMSecs = msecs;
	  _lastNSecs = nsecs;
	  _clockseq = clockseq;

	  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	  msecs += 12219292800000;

	  // `time_low`
	  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	  b[i++] = tl >>> 24 & 0xff;
	  b[i++] = tl >>> 16 & 0xff;
	  b[i++] = tl >>> 8 & 0xff;
	  b[i++] = tl & 0xff;

	  // `time_mid`
	  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	  b[i++] = tmh >>> 8 & 0xff;
	  b[i++] = tmh & 0xff;

	  // `time_high_and_version`
	  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	  b[i++] = tmh >>> 16 & 0xff;

	  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	  b[i++] = clockseq >>> 8 | 0x80;

	  // `clock_seq_low`
	  b[i++] = clockseq & 0xff;

	  // `node`
	  var node = options.node || _nodeId;
	  for (var n = 0; n < 6; n++) {
	    b[i + n] = node[n];
	  }

	  return buf ? buf : unparse(b);
	}

	// **`v4()` - Generate random UUID**

	// See https://github.com/broofa/node-uuid for API details
	function v4(options, buf, offset) {
	  // Deprecated - 'format' argument, as supported in v1.2
	  var i = buf && offset || 0;

	  if (typeof(options) == 'string') {
	    buf = options == 'binary' ? new Array(16) : null;
	    options = null;
	  }
	  options = options || {};

	  var rnds = options.random || (options.rng || _rng)();

	  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	  rnds[6] = (rnds[6] & 0x0f) | 0x40;
	  rnds[8] = (rnds[8] & 0x3f) | 0x80;

	  // Copy bytes to buffer, if provided
	  if (buf) {
	    for (var ii = 0; ii < 16; ii++) {
	      buf[i + ii] = rnds[ii];
	    }
	  }

	  return buf || unparse(rnds);
	}

	// Export public API
	var uuid = v4;
	uuid.v1 = v1;
	uuid.v4 = v4;
	uuid.parse = parse;
	uuid.unparse = unparse;

	module.exports = uuid;


/***/ },
/* 100 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var rng;

	var crypto = global.crypto || global.msCrypto; // for IE 11
	if (crypto && crypto.getRandomValues) {
	  // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	  // Moderately fast, high quality
	  var _rnds8 = new Uint8Array(16);
	  rng = function whatwgRNG() {
	    crypto.getRandomValues(_rnds8);
	    return _rnds8;
	  };
	}

	if (!rng) {
	  // Math.random()-based (RNG)
	  //
	  // If all else fails, use Math.random().  It's fast, but is of unspecified
	  // quality.
	  var  _rnds = new Array(16);
	  rng = function() {
	    for (var i = 0, r; i < 16; i++) {
	      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	      _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	    }

	    return _rnds;
	  };
	}

	module.exports = rng;


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	(function (context) {
	  var noflo = __webpack_require__(1);
	  var Base = __webpack_require__(79);

	  var Iframe = function (options) {
	    if (!options) {
	      options = {};
	    }

	    if (options.catchExceptions) {
	      // Can't use bind until https://github.com/ariya/phantomjs/issues/10522 is fixed
	      var self = this;
	      context.onerror = function (err) {
	        self.send('network', 'error', {
	          message: err.toString()
	        }, {
	          href: self.context ? self.context.href : context.parent.location.href
	        });
	        return true;
	      };
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
	  };
	  Iframe.prototype = Base;
	  Iframe.prototype.send = function (protocol, topic, payload, ctx) {
	    if (payload instanceof Error) {
	      payload = {
	        message: payload.toString()
	      };
	    }
	    if (this.context) {
	      ctx = this.context;
	    }
	    context.parent.postMessage(JSON.stringify({
	      protocol: protocol,
	      command: topic,
	      payload: payload
	    }), ctx.href);
	  };
	  Iframe.prototype.sendAll = function (protocol, topic, payload) {
	    this.send(protocol, topic, payload, window.context);
	  };
	  Iframe.prototype.start = function () {
	    // Ignored, nothing to do
	  };

	  context.NofloIframeRuntime = function (options) {
	    if (typeof options.catchExceptions === 'undefined') {
	      options.catchExceptions = true;
	      if (context.location.search && context.location.search.substring(1) === 'debug') {
	        options.catchExceptions = false;
	      }
	    }
	    var runtime = new Iframe(options);
	    context.addEventListener('message', function (message) {
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
	      if (data.protocol === 'iframe' && data.command === 'setcontent') {
	        document.body.innerHTML = data.payload;
	        return;
	      }
	      runtime.receive(data.protocol, data.command, data.payload, {
	        href: message.origin
	      });
	    });
	    return runtime;
	  };
	})(window);

	if (typeof module !== 'undefined' && module.exports) {
	  module.exports = window.NofloIframeRuntime;
	}


/***/ }
/******/ ]);