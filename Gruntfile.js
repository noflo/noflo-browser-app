module.exports = function tasks() {
  // Project configuration
  const pkg = this.file.readJSON('package.json');
  const repo = pkg.repository.url.replace('git://', `https://${process.env.GH_TOKEN}@`);
  this.initConfig({
    pkg: this.file.readJSON('package.json'),
    // Browser build of NoFlo
    noflo_browser: {
      build: {
        options: {
          debug: true,
          exposed_modules: {
            noflo: 'noflo',
            'noflo-runtime-postmessage': 'noflo-runtime-postmessage',
          },
        },
        files: {
          'browser/<%=pkg.name%>.js': ['package.json'],
        },
      },
    },
    // Deployment to GitHub Pages
    'gh-pages': {
      options: {
        base: 'browser',
        clone: 'gh-pages',
        message: `Release ${pkg.name} ${process.env.TRAVIS_TAG}`,
        repo,
        user: {
          name: 'NoFlo bot',
          email: 'bot@noflo.org',
        },
        silent: true,
      },
      src: '**/*',
    },
  });
  // Grunt plugins used for building
  this.loadNpmTasks('grunt-noflo-browser');
  // Grunt plugins used for deploying
  this.loadNpmTasks('grunt-gh-pages');
  // Our local tasks
  this.registerTask('build', 'Build NoFlo for the chosen target platform', (target = 'all') => {
    if (target === 'all' || target === 'browser') {
      this.task.run('noflo_browser');
    }
  });
  this.registerTask('default', ['build']);
};
