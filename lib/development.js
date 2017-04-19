// For the dev server, we separately add the containing plotly.js directory
// to the browserify bundler and store the Plotly API on the window
var Plotly = window.Plotly
var extend = require('xtend');

require('./viewer')({
  Plotly: Plotly,
  mockListUrl: window.mockListUrl || '/mocklist.json',
  mockBaseUrl: window.mockBaseUrl || '/',
  mockFilter: window.mockFilter || (m => m),
  initialPlotConfig: extend({
    mapboxAccessToken: 'pk.eyJ1IjoiZXRwaW5hcmQiLCJhIjoiY2luMHIyc2YwMGFzcXZobTRpYTBvZTFrOCJ9.GuIGZ1prg2ziFQ_bzdu5Lw',
    logging: 2
  }, window.initialPlotConfig || {})
})
