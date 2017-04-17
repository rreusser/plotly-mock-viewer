// For the dev server, we separately add the containing plotly.js directory
// to the browserify bundler and store the Plotly API on the window
var once = require('once');

var start = once(function () {
  console.log('Got Plotly.js src. Starting');
  require('./viewer')({
    Plotly: Plotly,
    mockListUrl: window.mockListUrl || '/mocklist.json',
    mockBaseUrl: window.mockBaseUrl || '/',
    mockFilter: window.mockFilter || (m => m)
  })
})

var plotlyScript = document.createElement('script');
plotlyScript.addEventListener('load', function () { start() });
plotlyScript.addEventListener('readyStateChange', function () {
  if (plotlyScript.readyState === 'complete') start();
});
plotlyScript.src = '/plotly.js';
document.head.appendChild(plotlyScript);


