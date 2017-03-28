var path = require('path')
var fs = require('fs')
var budo = require('budo')
var es2040 = require('es2040')
var html = require('simple-html-index')
var brfs = require('brfs')
var leftpad = require('pad-left')
var toStream = require('string-to-stream')

// var plotlypath = path.join(path.dirname(require.resolve('plotly.js')), '../')
// var mockpath = path.join(plotlypath, 'test/image/mocks/')

function startServer (plotlypath) {
  var mockpath = path.join(plotlypath, 'test/image/mocks/')

  function fetchMockList () {
    return JSON.stringify(fs.readdirSync(mockpath).filter(name => /\.json$/.test(name)))
  }

  function resolveMock (name) {
    var data = fs.readFileSync(path.join(mockpath, name)).toString()
    try {
      JSON.parse(data)
    } catch (e) {
      var position = parseInt(e.message.match(/at position ([0-9]*)/)[1])
      var lines = data.slice(0, position).split(/\n/)
      var next = data.slice(position).split(/\n/)[0]
      var linenum = lines.length
      e.message = e.message
        .replace(/in JSON at position [0-9]*/, 'at line ' + linenum + ' of "' + name.replace(/.*\//, '') + '":') +
        '\n' +
        lines.map((l, i) => (
          (i === linenum - 1 ? '-->' : '   ') +
          leftpad(i + 1, 4, ' ') + ': ' + l)).slice(-5).join('\n') +
          next
      throw e
    }
    return data
  }

  return budo(path.join(__dirname, 'dummy.js'), {
    live: true,
    open: true,
    host: 'localhost',
    forceDefaultIndex: true,
    watchGlob: [plotlypath],
    browserify: {
      transform: [brfs, es2040],
      plugin: [
        // budo does not accept stream input, so we use a blank dummy file
        // for the main entry and add this via a plugin:
        b => b.add(toStream('window.Plotly = require("' + plotlypath + '")')),

        // This is our development server:
        b => b.add(path.join(__dirname, 'development.js'))
      ]
    },
    middleware: [
      function (req, res, next) {
        if (/mocklist\.json$/.test(req.url)) {
          res.end(fetchMockList())
        } else {
          next()
        }
      }, function (req, res, next) {
        if (/\.json$/.test(req.url)) {
          try {
            res.end(resolveMock(req.url))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({error: 'Invalid JSON', message: e.message}))
          }
        } else {
          next()
        }
      }
    ],
    defaultIndex: function (params, req) {
      return html(params)
    }
  }).on('connect', function (ev) {
    console.log('Server running on %s', ev.uri)
    console.log('LiveReload running on port %s', ev.livePort)
  }).on('update', function (buffer) {
    console.log('bundle - %d bytes', buffer.length)
  })
}

module.exports = startServer
