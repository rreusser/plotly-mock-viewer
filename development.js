var Plotly = window.Plotly = require('plotly.js')

var start = require('./index')({
    Plotly: Plotly,
    mockListUrl: '/mocklist.json',
    mockBaseUrl: '/',
    mockFilter: m => m
});
