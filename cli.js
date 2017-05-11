#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var startServer = require('./lib/server')
var pkgUp = require('pkg-up')
var args = require('minimist')(process.argv.slice(2), {
  alias: {
    s: 'plotly-src',
    v: 'version',
    l: 'latest',
    r: 'remote-mocks',
    h: 'help',
    m: 'mapbox-access-token',
    k: 'keep-meta',
    j: 'mathjax',
    d: 'mock-dir',
    p: 'plotly-dir',
    t: 'remote-topojson'
  },
  boolean: [
    'remote-mocks',
    'keep-meta',
    'remote-topojson'
  ]
})

if (args.help) {
  process.stdout.write(fs.readFileSync(path.join(__dirname, 'lib/help.txt'), 'utf8'))
  process.exit(0)
}

function printError (message) {
  console.log('plotly-mock-viewer: Error: ' + message)
}

function printWarning (message) {
  console.log('plotly-mock-viewer: Warning: ' + message)
}

var opts = {
  isCDN: false,
  title: '@dev'
}

if (args.version) {
  opts.plotlySrc = 'https://cdn.plot.ly/plotly-' + args.version + '.js'
  opts.isCDN = true
  opts.title = '@' + args.version
  console.log('plotly-mock-viewer: using CDN version of plotly ' + opts.plotlySrc)
}

if (args.latest) {
  opts.plotlySrc = 'https://cdn.plot.ly/plotly-latest.js'
  opts.isCDN = true
  opts.title = '@latest'
  console.log('plotly-mock-viewer: using CDN version of plotly ' + opts.plotlySrc)
}

if (args['plotly-src']) {
  opts.plotlySrc = args['plotly-src'];
  opts.isCDN = false;
  opts.title = '@dev';
  consoe.log('plotly-mock-viewer: using local bunbled plotly.js: ' + opts.plotlySrc);
}

if (args['remote-mocks']) {
  opts.remoteMocks = true
}

if (args['remote-topojson']) {
  opts.remoteTopojson = true
}

if (args['mapbox-access-token']) {
  opts.mapboxAccessToken = args['mapbox-access-token']
}

if (args['mock-dir']) {
  opts.mockPath = args['mock-dir']
}

if (args._[0]) {
  opts.mockPath = path.dirname(args._[0]);
  opts.initialMock = path.basename(args._[0]);
}

if (args.mathjax) {
  opts.mathjax = true
}

opts.keepMeta = args['keep-meta']

var plotlyPkg
if (args['plotly-dir']) {
  plotlyPkg = path.join(args['plotly-dir'], 'package.json')
} else {
  plotlyPkg = pkgUp.sync()
}

var pkg = JSON.parse(fs.readFileSync(plotlyPkg, 'utf8'))
opts.plotlyPath = path.dirname(plotlyPkg)

if (!pkg || pkg.name !== 'plotly.js') {
  opts.plotlyPath = path.join(path.dirname(require.resolve('plotly.js')), '../')
}

startServer(opts)
