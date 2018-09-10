var fs = require('fs')
var h = require('h')
var css = require('insert-css')
var AutoComplete = require('../assets/auto-complete')

module.exports = function (config) {
  var Plotly = config.Plotly
  var gd
  var autocomplete

  // Make sure it's global, I guess?
  window.Plotly = Plotly
  window.d3 = Plotly.d3

  console.groupCollapsed('📊📊 %cplotly.js mock viewer (expand for instructions)%c 📊📊', 'background-color:rgb(65,120,223);color:white;font-weight:bold', 'background-color:none')
  console.log('This viewer exposes a number of global variables for easy inspection:')
  console.log('    Plotly    the plotly instance')
  console.log('        d3    d3 v3 object')
  console.log('        gd    the graph div')
  console.log('      mock    the currently loaded mock')
  console.log('  mocklist    a list of all available mocks')
  console.log('plotMock()    fetch and plot a mock by name, e.g. plotMock(\'gl3d_bunny\')')
  console.groupEnd('-- Expand for instructions --')

  if (!config.initialPlotConfig.mapboxAccessToken) {
    console.warn('Warning: No mapbox access token found. To set manually, run `Plotly.setConfig({mapboxAccessToken: YOUR_TOKEN_HERE})`')
  }

  Plotly.setPlotConfig(config.initialPlotConfig)

  css(fs.readFileSync(__dirname + '/../assets/auto-complete.css', 'utf8'))
  css(fs.readFileSync(__dirname + '/../assets/styles.css', 'utf8'))

  var title = 'plotly.js' + (window.viewerTitle ? window.viewerTitle : '')

  var barContainer = h('div', {class: 'bar-container'}, [
    h('h3', h('a', {href: 'https://github.com/plotly/plotly.js', target: '_blank'}, title))
  ])

  var bar = h('div', {id: 'bar', class: 'clearfix'}, barContainer)

  function setTitle (t) {
    var el = document.querySelector('title')
    if (!el) {
      el = h('title')
      document.head.appendChild(el)
    }
    el.textContent = t
  }

  setTitle(title)

  document.body.appendChild(bar)

  function fetchMockList () {
    return fetch(config.mockListUrl).then(function (response) {
      console.info('Fetched mocks from', config.mockListUrl)
      return response.json().then(function (json) {
        return (window.mocklist = json.map(config.mockFilter))
      })
    })
  }

  function fetchMock (mockname) {
    var remoteUrl = config.mockBaseUrl + mockname.replace(/^\//, '')
    return fetch(remoteUrl).then(function (response) {
      console.info('Fetched mock from', remoteUrl)
      if (response.status === 500) {
        return new Promise(function (resolve, reject) {
          response.json().then(function (error) {
            reject(error.error + ': ' + error.message)
          })
        })
      }
      return response.json().then(function (json) {
        return (window.mock = json)
      }, function () {
        throw new Error('Unable to find mock "' + mockname + '"')
      })
    })
  }

  function updateGraphDiv () {
    if (gd) document.body.removeChild(gd)
    gd = window.gd = h('div', {id: 'graph'})
    document.body.appendChild(gd)
  }

  function plotMock (filename) {
    if (!filename || filename.length === 0) return

    filename = filename.replace(/^#/, '')
    if (!/\.json$/.test(filename)) {
      filename += '.json'
    }
    return fetchMock(filename).then(function (mock) {
      console.info('Plotting mock', filename, mock)

      window.removeEventListener('hashchange', plotFromHash)
      window.location.hash = filename.replace(/\.json$/, '')
      window.addEventListener('hashchange', plotFromHash)

      Plotly.purge(gd)
      updateGraphDiv()
      Plotly.newPlot(gd, mock)
    }, function (err) {
      console.error(err)
    })
  }

  function plotFromHash () {
    return plotMock(window.location.hash)
  }

  function updateMockMenu () {
    var mockSelect = barContainer.querySelector('#mock-selector')
    if (!mockSelect) {
      mockSelect = h('input', {
        type: 'text',
        id: 'mock-selector',
        name: 'Mock Selector',
        placeholder: 'Search mocks',
        value: window.location.hash.replace(/^#/, '').replace(/\.json$/, '')
      })
      barContainer.appendChild(mockSelect)

      mockSelect.addEventListener('change', function () {
        window.location.hash = mockSelect.value
      })
    }

    fetchMockList().then(function (list) {
      if (autocomplete) {
        autocomplete.destroy()
      }

      window.autocomplete = autocomplete = new AutoComplete({
        selector: mockSelect,
        minChars: 1,
        source: function (term, response) {
          var re = new RegExp(term.split('').join('.*'), 'i')
          response(list.filter(i => re.test(i)).map(i => i.replace(/\.json$/, '')))
        }
      })
    })
  }

  updateMockMenu()

  window.addEventListener('hashchange', plotFromHash)
  updateGraphDiv()
  plotFromHash()

  // Instead of exposing the function directly, add this layer of indirection
  // to avoid double-plots due to the hashchange listener
  window.plotMock = function (hash) {
    window.location.hash = hash
  }
}
