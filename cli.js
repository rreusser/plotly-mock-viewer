#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var startServer = require('./lib/server')
var pkgUp = require('pkg-up')

function printError (message) {
  console.log('plotly-mock-viewer: error: ' + message)
}

pkgUp().then(function (plotlyPkg) {
  var pkg = JSON.parse(fs.readFileSync(plotlyPkg, 'utf8'))

  if (pkg.name !== 'plotly.js') {
    printError('must be run from within plotly.js directory')
  }

  var plotlyDir = path.dirname(plotlyPkg)

  startServer(plotlyDir)
})
