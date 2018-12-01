# noflo-browser-app [![Build Status](https://secure.travis-ci.org/noflo/noflo-browser-app.png?branch=master)](http://travis-ci.org/noflo/noflo-browser-app)

[Hello World](http://noflojs.org/noflo-browser-app/)

Usage
-------

* Fork this project on GitHub
* Import in Flowhub
* Make changes, syncronize in Flowhub
* Add any [NoFlo modules](https://npmjs.com/browse/keyword/noflo) you need to `package.json`
* Run local development server with `npm start`
* Run tests with `npm test`

Setup autodeploy
--------------
To enable autodeploy

* create a [personal github access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)
* Enable [Travis CI](https://travis-ci.org) for your fork
* Change to use your own `GITHUB_TOKEN` with `travis encrypt add GITHUB_TOKEN=xyz123 --add`

Read more in [Travis CI GitHub Pages deployment guide](https://docs.travis-ci.com/user/deployment/pages/).
