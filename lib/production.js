// For the prod build, plotly-latest.min.js is injected into the head tag and
// so is available when this is run:

window.viewerTitle = '@latest'

require('./viewer')({
  Plotly: window.Plotly,
  mockListUrl: 'https://api.github.com/repositories/45646037/contents/test/image/mocks',
  mockBaseUrl: 'https://raw.githubusercontent.com/plotly/plotly.js/master/test/image/mocks/',
  mockFilter: m => m.name
})
