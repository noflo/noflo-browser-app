const runtime = require('./runtime');
const pkg = require('./package.json');
const graph = require('./graphs/main.json');

function main() {
  return runtime(graph, {
    runtimeOptions: {
      baseDir: pkg.name,
      label: pkg.name,
      namespace: pkg.name,
      repository: pkg.repository ? pkg.repository.url : null,
    },
    debugButton: document.getElementById('flowhub_debug_url'),
  });
}

document.addEventListener('DOMContentLoaded', () => {
  main()
    .catch((err) => {
      const message = document.querySelector('body p');
      message.innerHTML = `ERROR: ${err.message}`;
      message.parentElement.classList.add('error');
    });
});
