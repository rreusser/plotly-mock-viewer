// For the dev server, we separately add the containing plotly.js directory
// to the browserify bundler and store the Plotly API on the window
var Plotly = window.Plotly

require('./viewer')({
  Plotly: Plotly,
  mockListUrl: window.mockListUrl || '/mocklist.json',
  mockBaseUrl: window.mockBaseUrl || '/',
  mockFilter: window.mockFilter || (m => m)
})
