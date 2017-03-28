var fs = require('fs')
var h = require('h')
var css = require('insert-css')
var AutoComplete = require('./../assets/auto-complete')

module.exports = function (config) {
  var Plotly = config.Plotly
  var gd
  var autocomplete

  if (!window.plotlyCredentials || !window.plotlyCredentials.MAPBOX_ACCESS_TOKEN) {
    console.warn('Warning: No valid mapbox access token found. To set manually, run `Plotly.setConfig({mapboxAccessToken: YOUR_TOKEN_HERE})`')
  } else {
    Plotly.setPlotConfig({
      mapboxAccessToken: window.plotlyCredentials.MAPBOX_ACCESS_TOKEN,
    })
  }

  css(fs.readFileSync(__dirname + '/../assets/auto-complete.css', 'utf8'))
  css(fs.readFileSync(__dirname + '/../assets/styles.css', 'utf8'))

  var title = 'plotly.js' + (window.viewerTitle ? window.viewerTitle : '')
  var bar = h('div', {id: 'bar', class: 'clearfix'}, [
    h('h3', h('a', {href: 'https://github.com/plotly/plotly.js', target: '_blank'}, title))
  ])

  function setTitle (t) {
    var el = document.querySelector('title');
    if (!el) {
      el = h('title')
      document.head.appendChild(el);
    }
    el.textContent = t;
  }

  setTitle(title);

  document.body.appendChild(bar)

  function fetchMockList () {
    return fetch(config.mockListUrl).then(function (response) {
      console.info('Fetched mocks from', config.mockListUrl);
      return response.json().then(function (json) {
        return (window.mocklist = json.map(config.mockFilter))
      })
    })
  }

  function fetchMock (mockname) {
    var remoteUrl = config.mockBaseUrl + mockname.replace(/^\//, '')
    return fetch(remoteUrl).then(function (response) {
      console.info('Fetched mock from', remoteUrl);
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

      updateGraphDiv();

      window.removeEventListener('hashchange', plotFromHash)
      window.location.hash = filename.replace(/\.json$/, '')
      window.addEventListener('hashchange', plotFromHash)

      Plotly.plot(gd, mock)
    }, function (err) {
      console.error(err)
    })
  }

  function plotFromHash () {
    return plotMock(window.location.hash)
  }

  function updateMockMenu () {
    var mockSelect = bar.querySelector('#mock-selector')
    if (!mockSelect) {
      mockSelect = h('input', {
        type: 'text',
        id: 'mock-selector',
        name: 'Mock Selector',
        placeholder: 'Search mocks',
        value: window.location.hash.replace(/^#/, '').replace(/\.json$/, '')
      })
      bar.appendChild(mockSelect)

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
  updateGraphDiv();
  plotFromHash()
}
