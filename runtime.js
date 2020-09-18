const noflo = require('noflo');
const postMessageRuntime = require('noflo-runtime-postmessage');
const qs = require('querystring');

const defaultPermissions = [
  'protocol:graph',
  'protocol:component',
  'protocol:network',
  'protocol:runtime',
  'component:getsource',
  'component:setsource',
];

function getParameterByName(name) {
  const params = (new URL(document.location)).searchParams;
  return params.get(name);
}

function getIdeUrl(options, ide = 'https://app.flowhub.io') {
  const params = {
    protocol: 'opener',
    address: window.location.href,
  };
  if (options.id) {
    params.id = options.id;
  }
  const query = qs.stringify(params);
  return `${ide}#runtime/endpoint?${query}`;
}

function loadGraph(json) {
  return new Promise((resolve, reject) => {
    noflo.graph.loadJSON(json, (err, graphInstance) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(graphInstance);
    });
  });
}

function startRuntime(graph, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol || getParameterByName('fbp_protocol') || 'opener';

    const runtimeOptions = {
      ...options.runtimeOptions,
    };
    if (!runtimeOptions.defaultPermissions) {
      runtimeOptions.defaultPermissions = defaultPermissions;
    }

    switch (protocol) {
      case 'opener': {
        if (!options.debugButton) {
          reject(new Error('No debug button defined'));
          return;
        }
        const button = options.debugButton;
        button.classList.replace('nodebug', 'debug');
        button.href = getIdeUrl(runtimeOptions, options.ide);
        resolve(postMessageRuntime.opener(runtimeOptions, button));
        return;
      }
      case 'iframe': {
        resolve(postMessageRuntime.iframe(runtimeOptions));
        return;
      }
      default: {
        reject(new Error(`Unknown FBP protocol ${protocol}`));
      }
    }
  });
}

function startNetwork(runtime, graph, options) {
  const noLoad = options.noLoad || (getParameterByName('fbp_noload') === 'true');
  if (noLoad) {
    return Promise.resolve(runtime);
  }
  return new Promise((resolve, reject) => {
    const graphName = `${runtime.options.namespace || 'default'}/${graph.name || 'main'}`;
    runtime.graph.registerGraph(graphName, graph);
    // eslint-disable-next-line no-underscore-dangle
    runtime.network._startNetwork(graph, graphName, 'none', (err) => {
      if (err) {
        reject(err);
        return;
      }
      runtime.runtime.setMainGraph(graphName, graph);
      resolve(runtime);
    });
  });
}

module.exports = (graph, options) => loadGraph(graph)
  .then((graphInstance) => startRuntime(graphInstance, options)
    .then((runtime) => startNetwork(runtime, graphInstance, options)));
