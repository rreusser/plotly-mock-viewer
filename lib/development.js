// For the dev server, we separately add the containing plotly.js directory
// to the browserify bundler and store the Plotly API on the window
var once = require('once');

var start = once(function () {
  console.log('Got Plotly.js src. Starting');
  require('./viewer')({
    Plotly: window.Plotly,
    mockListUrl: window.mockListUrl || '/mocklist.json',
    mockBaseUrl: window.mockBaseUrl || '/',
    mockFilter: window.mockFilter || (m => m)
  })
})


var pollRaf;
var poll = function () {
  if (window.Plotly) {
    cancelAnimationFrame(pollRaf);
    start();
  } else {
    pollRaf = requestAnimationFrame(poll);
  }
}
pollRaf = requestAnimationFrame(poll);
