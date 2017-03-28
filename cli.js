#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var startServer = require('./lib/server')
var pkgUp = require('pkg-up')
var args = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'version',
    l: 'latest',
    r: 'remote-mocks',
    h: 'help',
    m: 'mapbox-access-token'
  },
  boolean: [
    'remote-mocks'
  ],
});

if (args.help) {
  process.stdout.write(fs.readFileSync(path.join(__dirname, 'lib/help.txt'), 'utf8'))
  process.exit(0);
}

function printError (message) {
  console.log('plotly-mock-viewer: Error: ' + message)
}

function printWarning (message) {
  console.log('plotly-mock-viewer: Warning: ' + message)
}

var opts = {isCDN: false};

if (args._[0]) {
  opts.plotlySrc = args._[0]
  opts.isCDN = true;
}

if (args.version) {
  opts.plotlySrc = 'https://cdn.plot.ly/plotly-' + args.version + '.js'
  opts.isCDN = true;
  console.log('plotly-mock-viewer: using CDN version of plotly ' + opts.plotlySrc);
}

if (args.latest) {
  opts.plotlySrc = 'https://cdn.plot.ly/plotly-latest.js'
  opts.isCDN = true;
  console.log('plotly-mock-viewer: using CDN version of plotly ' + opts.plotlySrc);
}

if (args['remote-mocks']) {
  opts.remoteMocks = true
}

if (args['mapbox-access-token']) {
  opts.mapboxAccessToken = args['mapbox-access-token']
}

pkgUp().then(function (plotlyPkg) {
  var pkg = JSON.parse(fs.readFileSync(plotlyPkg, 'utf8'))
  opts.plotlyPath = path.dirname(plotlyPkg)

  if (!pkg || pkg.name !== 'plotly.js') {
    opts.plotlyPath = path.join(path.dirname(require.resolve('plotly.js')), '../');
  }

  startServer(opts);
}).catch(function (err) {
  printError(err);
})
