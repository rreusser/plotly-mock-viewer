// For the dev server, we separately add the containing plotly.js directory
// to the browserify bundler and store the Plotly API on the window
var Plotly = window.Plotly

require('./index')({
  Plotly: Plotly,
  mockListUrl: '/mocklist.json',
  mockBaseUrl: '/',
  mockFilter: m => m
})
