var fs = require('fs');
var h = require('h');
var gd;
var Plotly = window.Plotly = require('plotly.js');
var css = require('insert-css');
var autocomplete;

css(fs.readFileSync(__dirname + '/assets/auto-complete.css', 'utf8'));

css(`
html, body {
  margin: 0;
  paddng: 0;
}
#mock-selector {
  display: block;
  width: 400px;
  margin: 5px;
}
#graph {
  border: 1px solid rgb(65,120,223);
  display: inline-block;
}
`)

function fetchMockList () {
  return fetch('/mocklist.json').then(function (response) {
    return response.json().then(function (json) {
      mocklist = window.mocklist = json;
      return mocklist;
    });
  });
}

function fetchMock (mockname) {
  return fetch(mockname).then(function(response) {
    if (response.status === 500) {
      return new Promise(function(resolve, reject) {
        response.json().then(function (error) {
          reject(error.error + ': ' + error.message);
        });
      });
    }
    return response.json().then(function (json) {
      mock = window.mock = json;
      return mock;
    }, function () {
      throw new Error('Unable to find mock "' + mockname + '"');
    });
  });
}

function plotMock (filename) {
  if (!filename || filename.length === 0) return;

  filename = filename.replace(/^#/, '');
  if (!/\.json$/.test(filename)) {
    filename += '.json';
  }
  return fetchMock(filename).then(function (mock) {
    if (gd) document.body.removeChild(gd);
    gd = window.gd = h('div', {id: 'graph'});
    document.body.appendChild(gd);
    console.log("Plotting mock", filename, mock);

    window.removeEventListener('hashchange', plotFromHash);
    window.location.hash = filename.replace(/\.json$/, '');
    window.addEventListener('hashchange', plotFromHash);

    Plotly.plot(gd, mock);
  }, function (err) {
    console.error(err);
  })
}

function plotFromHash () {
  return plotMock(window.location.hash);
}

function updateMockMenu () {
  var i;
  var mockSelect = document.querySelector('#mock-selector');
  if (!mockSelect) {
    mockSelect = h('input', {
      type: 'text',
      id: 'mock-selector',
      name: "Mock Selector",
      placeholder: "Search mocks",
      value: window.location.hash.replace(/^#/, '').replace(/\.json$/, '')
    });
    document.body.appendChild(mockSelect);

    mockSelect.addEventListener('change', function () {
      plotMock(mockSelect.value);
    });
  }

  //var options = mockSelect.querySelectorAll('option');
  //for (i = 0; i < options.length; i++) {
    //mockSelect.removeChild(options[i]);
  //}

  fetchMockList().then(function (list) {
    //for (i = 0; i < list.length; i++) {
      //mockSelect.appendChild(h('option', {value: list[i]}, list[i].replace(/\.json/, '')));
    //}

    if (autocomplete) {
      autocomplete.destroy();
    }

    autocomplete = new autoComplete({
      selector: mockSelect,
      minChars: 1,
      source: function (term, response) {
        var re = new RegExp(term.split("").join('.*'), 'i');
        response(list.filter(i => re.test(i)).map(i => i.replace(/\.json$/, '')));
      }
    });
  });
}

updateMockMenu();

window.addEventListener('hashchange', plotFromHash);
plotFromHash();
