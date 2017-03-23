#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var budo = require('budo')
var es2040 = require('es2040')
var html = require('simple-html-index');
var brfs = require('brfs');
var hyperstream = require('hyperstream');

var mockpath = path.join(path.dirname(require.resolve('plotly.js')), '../test/image/mocks/');
var plotlypath = path.join(path.dirname(require.resolve('plotly.js')), '../');

function fetchMockList () {
  return JSON.stringify(fs.readdirSync(mockpath).filter(name => /\.json$/.test(name)));
}

function resolveMock (name) {
  return fs.readFileSync(path.join(mockpath, name));
}

var server = budo('./index.js', {
  live: true,
  open: true,
  watchGlob: [path.join(plotlypath, '*'), path.join(plotlypath, '**/*')],
  browserify: { transform: [brfs, es2040] },
  middleware: [function (req, res, next) {
    if (/mocklist\.json$/.test(req.url)) {
      res.end(fetchMockList());
    } else {
      next();
    }
  }, function (req, res, next) {
    if (/\.json$/.test(req.url)) {
      res.end(resolveMock(req.url));
    } else {
      next();
    }
  }],
  defaultIndex: function (params, req) {
    return html(params).pipe(hyperstream({head: {
      _appendHtml:
        '<style type="text/css">' + fs.readFileSync(path.join(__dirname, 'assets/auto-complete.css'), 'utf8') + '</style>' +
        '<script type="text/javascript">' + fs.readFileSync(path.join(__dirname, 'assets/auto-complete.min.js'), 'utf8') + '</script>'
    }}))
  }
}).on('connect', function (ev) {
  console.log('Server running on %s', ev.uri)
  console.log('LiveReload running on port %s', ev.livePort)
}).on('update', function (buffer) {
  console.log('bundle - %d bytes', buffer.length)
})
